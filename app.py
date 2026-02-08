import streamlit as st
import pdfplumber
import json
from google import genai
from google.genai import types
from schema import CASPArticleEvaluation


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MODEL_NAME = "gemini-2.5-flash"


# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """\
You are a SENIOR SCIENTIFIC RESEARCHER with expertise in systematic critical appraisal.
You MUST produce a single JSON object that strictly conforms to the provided JSON schema.

═══════════════════════════════════════════════════════════════════════════
MULTI-FRAMEWORK SCIENTIFIC ANALYSIS SYSTEM
═══════════════════════════════════════════════════════════════════════════

STEP 0: CLASSIFY THE STUDY TYPE
────────────────────────────────
First, determine the study_type:
• ORIGINAL_ARTICLE: Primary research (RCT, cohort, case-control, cross-sectional, etc.)
• SYSTEMATIC_REVIEW: Systematic search + quality appraisal + synthesis
• NARRATIVE_REVIEW: Literature overview without systematic methodology
• META_ANALYSIS: Quantitative synthesis of multiple studies

FRAMEWORK SELECTION BY STUDY TYPE
──────────────────────────────────

IF ORIGINAL_ARTICLE:
  frameworks_applied = ["CASP", "GRADE", "PICO"]
  • CASP: Assess methodology quality (validity, bias, reporting)
  • GRADE: Assess certainty of evidence (risk of bias, inconsistency, imprecision, indirectness)
  • PICO: Define clinical question structure

IF SYSTEMATIC_REVIEW:
  frameworks_applied = ["AMSTAR_2", "PRISMA", "GRADE", "CASP"]
  • AMSTAR 2: Critical appraisal of systematic review process (16 items)
  • PRISMA: Reporting transparency (27-item checklist)
  • GRADE: Quality of the body of evidence synthesized
  • CASP: Use CASP Systematic Review checklist (adapt questions)
  
  IMPORTANT for Systematic Reviews:
  • Effect size (Q7): Answer can be "VARIES" or "PARTIAL" if studies show heterogeneous results
  • Precision (Q8): Answer can be "VARIES" or "PARTIAL" if confidence intervals differ across studies
  • For Q7 and Q8, describe the RANGE of effect sizes/precision across included studies
  • Example Q7 answer: "VARIES - effect sizes range from small (d=0.2) to large (d=0.8)"
  • Example Q8 answer: "PARTIAL - some studies report narrow CIs, others report wide CIs or only p-values"

IF NARRATIVE_REVIEW:
  frameworks_applied = ["SANRA", "PICO_SCOPE"]
  • SANRA: Scale for Assessment of Narrative Review Articles (6 dimensions)
  • PICO_SCOPE: Define the scope and breadth of the review

═══════════════════════════════════════════════════════════════════════════
CASP EVALUATION (FOR ORIGINAL ARTICLES)
═══════════════════════════════════════════════════════════════════════════

CASP Question texts (use these EXACT strings):
────────────────────────────────────────────────
  Q1  "Did the trial address a clearly focused issue?"
  Q2  "Was the assignment of patients to treatments randomised?"
  Q3  "Were all patients who entered the trial properly accounted for at its conclusion?"
  Q4  "Were patients, health workers and study personnel blind to treatment?"
  Q5  "Were the groups similar at the start of the trial?"
  Q6  "Aside from the experimental intervention, were the groups treated equally?"
  Q7  "How large was the treatment effect?"
  Q8  "How precise was the estimate of the treatment effect?"
  Q9  "Can the results be applied in your context?"
  Q10 "Were all clinically important outcomes considered?"
  Q11 "Are the benefits worth the harms and costs?"

Scoring (0.0 to 1.0 per question):
  • 1.0 = Fully met with clear evidence
  • 0.5 = Partially met or unclear
  • 0.0 = Not met or serious concerns

Answer types for Q1-Q11:
  • "YES", "NO", "PARTIAL", "NOT_APPLICABLE", "UNCLEAR"
  • For Q7 (effect size): Can also use "LARGE", "MODERATE", "SMALL", "NONE", "VARIES"
  • For Q8 (precision): Can also use "HIGH", "MODERATE", "LOW", "VARIES"
  • For systematic reviews: "VARIES" indicates heterogeneity across included studies
  • For systematic reviews: "PARTIAL" indicates some studies meet criteria, others don't

═══════════════════════════════════════════════════════════════════════════
GRADE CERTAINTY OF EVIDENCE
═══════════════════════════════════════════════════════════════════════════

Start at HIGH and downgrade for:
  • Risk of Bias: Lack of blinding, allocation concealment issues
  • Inconsistency: Unexplained heterogeneity across studies
  • Indirectness: Population/intervention differs from target
  • Imprecision: Wide confidence intervals, small sample size
  • Publication Bias: Funnel plot asymmetry, industry funding

CRITICAL RULE: Small sample sizes (N < 10 humans) → Downgrade GRADE by 2 levels

Final GRADE levels:
  • HIGH: Very confident in effect estimate
  • MODERATE: Moderately confident; true effect likely close to estimate
  • LOW: Limited confidence; true effect may differ substantially
  • VERY_LOW: Very little confidence in effect estimate

═══════════════════════════════════════════════════════════════════════════
CROSS-MODEL VALIDATION & CONFLICTS
═══════════════════════════════════════════════════════════════════════════

MANDATORY: Check for conflicts between frameworks
  • If CASP score ≥ 80% but GRADE is LOW/VERY_LOW:
      → Final quality_rating MUST be LOW or MODERATE at best
      → Document in cross_model_conflicts field
  
  • If GRADE is HIGH but CASP has serious validity concerns (Q2, Q4, Q5 < 0.5):
      → Final quality_rating MUST be MODERATE at best
      → Document in cross_model_conflicts field

Example conflict:
  "High CASP methodology score (72%) conflicts with Low GRADE certainty due to 
   very small human sample (N=7), lack of blinding, and short intervention period. 
   GRADE certainty takes precedence for final rating."

═══════════════════════════════════════════════════════════════════════════
CRITICAL APPRAISAL: WHAT WAS NOT CONSIDERED?
═══════════════════════════════════════════════════════════════════════════

For EVERY study, populate what_was_not_considered with:
  ✓ Missing long-term outcomes (if study duration < 6 months for chronic conditions)
  ✓ Safety in vulnerable subgroups (elderly, children, pregnant women)
  ✓ Implementation barriers (cost, accessibility, training requirements)
  ✓ Patient-reported outcomes if only biomarkers measured
  ✓ Quality of life measures
  ✓ Adverse events in specific populations
  ✓ Generalizability beyond study setting

═══════════════════════════════════════════════════════════════════════════
SCIENTIFIC JUSTIFICATION (REQUIRED)
═══════════════════════════════════════════════════════════════════════════

In the scientific_justification field, explain:
  1. Which frameworks were applied and why
  2. How each framework influenced the final quality_rating
  3. Any conflicts between frameworks and how they were resolved
  4. Why the final percentage_score and quality_rating are appropriate

Example:
  "This original article was evaluated using CASP (methodology), GRADE (certainty), 
   and PICO (clinical structure). CASP yielded 65% (moderate methodology) due to 
   lack of blinding and unclear randomization. However, GRADE assessment revealed 
   very serious imprecision (N=7 humans, 7-day intervention) and high risk of bias, 
   downgrading certainty to LOW. The final quality_rating of MODERATE reflects the 
   compromise: acceptable animal model methodology but insufficient human evidence. 
   Percentage score adjusted to 59% to account for GRADE concerns taking precedence 
   over CASP methodology scoring."

═══════════════════════════════════════════════════════════════════════════
SCORING CALCULATION (DETERMINISTIC)
═══════════════════════════════════════════════════════════════════════════

STEP 1: Calculate raw CASP score
  • Sum scores Q1-Q11 (treat Q11 "N/A" as 0, exclude from denominator)
  • total_score = sum of all scores
  • total_applicable_questions = 11 (or 10 if Q11 is N/A)

STEP 2: Calculate preliminary percentage
  • preliminary_percentage = (total_score / total_applicable_questions) × 100

STEP 3: Apply GRADE adjustment
  • If GRADE is VERY_LOW: reduce by 15-25 points
  • If GRADE is LOW: reduce by 10-15 points
  • If GRADE is MODERATE: reduce by 0-5 points
  • If GRADE is HIGH: no reduction

STEP 4: Final percentage_score and quality_rating
  • percentage_score = preliminary_percentage - GRADE_adjustment
  • Clamp to [0, 100]
  • quality_rating thresholds:
      LOW: < 40
      MODERATE: 40-64
      MODERATE_TO_HIGH: 65-79
      HIGH: ≥ 80

═══════════════════════════════════════════════════════════════════════════
FIELD GUIDANCE
═══════════════════════════════════════════════════════════════════════════

• study_type: Use StudyType enum (ORIGINAL_ARTICLE, SYSTEMATIC_REVIEW, etc.)
• frameworks_applied: List of strings matching study type
• what_was_not_considered: Always provide 3-7 items (never empty!)
• scientific_justification: Always provide (200+ words explaining framework integration)
• cross_model_conflicts: Provide if CASP vs GRADE conflict exists, else null
• evaluation_date: Today's date in ISO format (YYYY-MM-DD)
• limitations_found: Use empty list [] only if genuinely no limitations
• For animal studies: Fill animal-specific fields; for human-only: use "NOT_APPLICABLE"
• Return ONLY the JSON – no markdown fences, no commentary

Be CRITICAL, be DECISIVE, be CONSISTENT.
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def extract_text_from_pdf(uploaded_file) -> str:
    """Extract all text from an uploaded PDF using pdfplumber."""
    text_parts: list[str] = []
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n\n".join(text_parts)


def _get_json_schema() -> str:
    """Return the JSON schema string derived from the Pydantic root model."""
    return json.dumps(CASPArticleEvaluation.model_json_schema(), indent=2)


def analyze_pdf(text: str, api_key: str) -> CASPArticleEvaluation:
    """Send extracted text to Gemini Flash and return a validated evaluation."""
    client = genai.Client(api_key=api_key)

    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        "Analyze the following scientific article and produce the CASP / GRADE / PICO "
        "evaluation as a single JSON object.\n\n"
        "Your response MUST conform EXACTLY to this JSON Schema:\n"
        f"```\n{_get_json_schema()}\n```\n\n"
        f"--- BEGIN ARTICLE TEXT ---\n{text}\n--- END ARTICLE TEXT ---"
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            responseMimeType="application/json",
            # responseSchema removed - too complex for Gemini's constraints
            # Schema is embedded in prompt and validated via Pydantic after
            temperature=0.0,  # Maximum determinism for consistent evaluations
            topP=1.0,         # Use all tokens (no randomness)
        ),
    )

    raw_json = json.loads(response.text)
    evaluation = CASPArticleEvaluation(**raw_json)
    return evaluation


# ---------------------------------------------------------------------------
# Quality‑rating colour helper
# ---------------------------------------------------------------------------
_RATING_COLORS = {
    "LOW": "#e74c3c",
    "MODERATE": "#f39c12",
    "MODERATE_TO_HIGH": "#2ecc71",
    "HIGH": "#27ae60",
}


def _color_for_rating(rating: str) -> str:
    return _RATING_COLORS.get(rating, "#888888")


# ---------------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------------
def main():
    st.set_page_config(
        page_title="Scientific PDF Analyzer",
        page_icon="🔬",
        layout="wide",
    )

    st.title("🔬 Scientific PDF Analyzer")
    st.markdown(
        "Upload a scientific PDF and get an automated **CASP / GRADE / PICO** "
        "quality evaluation powered by **Google Gemini 1.5 Flash**."
    )

    # ---- Sidebar ----
    with st.sidebar:
        st.header("⚙️ Settings")
        api_key = st.text_input(
            "Google API Key",
            type="password",
            help="Enter your Google Generative AI API key. Get one at https://aistudio.google.com/apikey",
        )
        st.divider()
        st.markdown(
            "**How it works**\n"
            "1. Enter your API key\n"
            "2. Upload a scientific PDF\n"
            "3. Click *Analyze*\n"
            "4. Review the evaluation results"
        )

    # ---- Main area ----
    uploaded_file = st.file_uploader(
        "Upload a scientific PDF",
        type=["pdf"],
        help="Supported format: PDF",
    )

    if uploaded_file is not None:
        with st.expander("📄 Extracted text preview", expanded=False):
            with st.spinner("Extracting text from PDF…"):
                pdf_text = extract_text_from_pdf(uploaded_file)
            if not pdf_text.strip():
                st.error("Could not extract any text from this PDF. It may be scanned/image‑only.")
                return
            st.text_area("Extracted text", pdf_text, height=300, disabled=True)

        analyze_btn = st.button("🚀 Analyze", type="primary", use_container_width=True)

        if analyze_btn:
            if not api_key:
                st.error("Please enter your Google API key in the sidebar.")
                return

            with st.spinner("Analyzing with Gemini 1.5 Flash — this may take a minute…"):
                try:
                    evaluation = analyze_pdf(pdf_text, api_key)
                except Exception as exc:
                    st.error(f"Analysis failed: {exc}")
                    return

            # Store in session state so it survives reruns
            st.session_state["evaluation"] = evaluation

    # ---- Display results ----
    if "evaluation" in st.session_state:
        evaluation: CASPArticleEvaluation = st.session_state["evaluation"]
        oa = evaluation.overall_assessment
        meta = evaluation.article_metadata

        st.divider()
        st.header("📊 Overall Assessment")

        # Article info row
        st.markdown(f"**{meta.title}**")
        st.caption(
            f"{', '.join(meta.authors)} · *{meta.journal}* ({meta.publication_year}) · "
            f"DOI: `{meta.doi}` · Study type: {meta.study_type}"
        )

        # Metrics row
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Quality Rating", oa.quality_rating.value.replace("_", " ").title())
        with col2:
            st.metric("Score", f"{oa.percentage_score:.1f}%")
        with col3:
            st.metric(
                "Applicable Questions",
                f"{oa.total_score} / {oa.total_applicable_questions}",
            )

        # Colour badge
        color = _color_for_rating(oa.quality_rating.value)
        st.markdown(
            f'<div style="background:{color};color:#fff;padding:12px 20px;'
            f'border-radius:8px;text-align:center;font-size:1.1rem;'
            f'margin:8px 0 16px 0;">'
            f"Quality Rating: <strong>{oa.quality_rating.value.replace('_', ' ').title()}</strong> "
            f"({oa.percentage_score:.1f}%)</div>",
            unsafe_allow_html=True,
        )

        # Reliability conclusion
        st.markdown(f"**Reliability conclusion:** {oa.reliability_conclusion}")

        # ---- Strengths & Limitations columns ----
        st.subheader("Key Strengths & Limitations")
        left, right = st.columns(2)

        with left:
            st.markdown("##### ✅ Strengths")
            for s in oa.key_strengths:
                st.markdown(f"- {s}")

        with right:
            st.markdown("##### ⚠️ Limitations")
            for lim in oa.key_limitations:
                st.markdown(f"- {lim}")

        # ---- Recommendations ----
        st.subheader("📋 Recommendations")
        for i, rec in enumerate(oa.recommendations, 1):
            st.markdown(f"{i}. {rec}")

        # ---- Critical missing information ----
        if oa.limitations_found:
            with st.expander("🔍 Critical missing information", expanded=False):
                for item in oa.limitations_found:
                    st.markdown(f"- {item}")

        # ---- Full JSON download ----
        st.divider()
        st.download_button(
            label="⬇️ Download full evaluation JSON",
            data=evaluation.model_dump_json(indent=2),
            file_name="casp_evaluation.json",
            mime="application/json",
            use_container_width=True,
        )


if __name__ == "__main__":
    main()
