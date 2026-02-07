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
You are an expert scientific‑paper analyst. Given the full text of a research
article you MUST produce a single JSON object that strictly conforms to the
provided JSON schema.

Evaluation criteria
───────────────────
• CASP (Critical Appraisal Skills Programme) – answer every question for the
  appropriate checklist type (RCT, Cohort, Qualitative, or Systematic Review).
• GRADE (Grading of Recommendations, Assessment, Development and Evaluations) –
  factor certainty of evidence into your quality rating and recommendations.
• PICO (Population, Intervention, Comparator, Outcomes) – extract these
  explicitly in question 1.

CASP Question texts (use these EXACT strings for each "question" field)
────────────────────────────────────────────────────────────────────────
  Q1  (question_1_focused_issue):       "Did the trial address a clearly focused issue?"
  Q2  (question_2_randomization):       "Was the assignment of patients to treatments randomised?"
  Q3  (question_3_all_patients_accounted): "Were all patients who entered the trial properly accounted for at its conclusion?"
  Q4  (question_4_blinding):            "Were patients, health workers and study personnel blind to treatment?"
  Q5  (question_5_groups_similar):      "Were the groups similar at the start of the trial?"
  Q6  (question_6_treated_equally):     "Aside from the experimental intervention, were the groups treated equally?"
  Q7  (question_7_effect_size):         "How large was the treatment effect?"
  Q8  (question_8_precision):           "How precise was the estimate of the treatment effect?"
  Q9  (question_9_results_applicable):  "Can the results be applied in your context?"
  Q10 (question_10_outcomes_considered):"Were all clinically important outcomes considered?"
  Q11 (question_11_benefits_worth_harms): "Are the benefits worth the harms and costs?"

Scoring rules
─────────────
CRITICAL: Follow this EXACT step-by-step calculation process for deterministic results:

STRICT MATHEMATICAL SCORING RUBRIC (100-point scale):
──────────────────────────────────────────────────────
You must follow this fixed point allocation:

1. Methodology Quality (CASP): 40 points maximum
   - Based on CASP checklist questions (validity, randomization, blinding, etc.)
   - Each CASP question contributes proportionally to these 40 points

2. Evidence Strength (GRADE): 40 points maximum
   - High certainty: 35-40 points
   - Moderate certainty: 25-34 points
   - Low certainty: 15-24 points
   - Very low certainty: 0-14 points
   - SPECIAL RULE: For studies with N<10 in human samples, automatically deduct 15 points
     (e.g., Suez et al. 2014 with N=7: maximum GRADE = 25 points)

3. Clinical Relevance (PICO): 20 points maximum
   - Clear, focused PICO: 18-20 points
   - Partially clear PICO: 10-17 points
   - Unclear/weak PICO: 0-9 points

CALCULATION STEPS:
──────────────────

STEP 1: Assign points for each category
• Methodology (CASP): 0-40 points based on checklist performance
• Evidence Strength (GRADE): 0-40 points (remember: -15 if N<10 humans)
• Clinical Relevance (PICO): 0-20 points based on clarity and focus

STEP 2: Calculate total points
• total_points = CASP_points + GRADE_points + PICO_points
• Maximum possible = 100 points

STEP 3: Convert to percentage_score
• percentage_score = total_points (it's already a percentage!)
• Must be between 0 and 100

STEP 4: Map CASP questions to 0-1 scores (for schema compatibility)
• Each CASP question gets a score between 0.0 and 1.0
  (0 = not met, 0.5 = partial, 1.0 = fully met)
• total_score = sum of all CASP question scores
• total_applicable_questions = number of CASP questions answered (10 or 11)

STEP 5: Assign quality_rating based on percentage_score
• LOW: percentage_score < 40
• MODERATE: 40 ≤ percentage_score < 65
• MODERATE_TO_HIGH: 65 ≤ percentage_score < 80
• HIGH: percentage_score ≥ 80

STEP 6: Verify consistency
• Ensure percentage_score matches your point allocation
• Verify quality_rating matches the threshold
• bradford_hill_criteria_met is an integer from 0 to 9 based on causality evidence

Field guidance
──────────────
• evaluation_date: use today's date in ISO format (YYYY-MM-DD).
• limitations_found: always provide a list of strings. Use an empty list []
  when there are no limitations to report.
• notes: provide a string with additional commentary, or null if none.
• If the study is not an animal study, adapt the animal‑specific fields
  (mice_studies, mice, same_diet_batch, same_housing, primary_outcome_mice,
  microbiota_transfer, antibiotic_reversal, animal_to_human_translation, etc.)
  to describe the relevant study components or write "NOT_APPLICABLE".
• Fill every field; use empty lists [] where nothing applies, or null for
  optional string fields with no content.
• Return ONLY the JSON – no markdown fences, no commentary.
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
            temperature=0,
            topP=1,
            topK=1,
            maxOutputTokens=8192,  # Increased for large JSON output
            responseMimeType="application/json",
            # responseSchema removed - too complex for Gemini's constraints
            # Schema is embedded in prompt and validated via Pydantic after
        ),
    )

    try:
        raw_json = json.loads(response.text)
    except json.JSONDecodeError as e:
        # If JSON is malformed, show the error and first 500 chars
        error_msg = f"JSON parsing failed: {e}\n\nReceived text (first 500 chars):\n{response.text[:500]}"
        raise ValueError(error_msg)
    
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
