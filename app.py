import streamlit as st
import pdfplumber
import json
import google.generativeai as genai
from schema import CASPArticleEvaluation


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
• Each question "score" is a float between 0.0 and 1.0 inclusive
  (0 = not met, 0.5 = partial, 1.0 = fully met).
• For question 11 (benefits_worth_harms), "score" is a string: use a numeric
  string like "0.5" when applicable, or "N/A" when not applicable.
• percentage_score = (total_score / total_applicable_questions) × 100.
  It must be between 0 and 100.
• quality_rating thresholds: LOW < 40, MODERATE 40‑64, MODERATE_TO_HIGH 65‑79,
  HIGH ≥ 80.
• bradford_hill_criteria_met is an integer from 0 to 9.

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


def analyze_pdf(text: str, api_key: str) -> CASPArticleEvaluation:
    """Send extracted text to Gemini 1.5 Flash and return a validated evaluation."""
    genai.configure(api_key=api_key, transport="rest")

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": CASPArticleEvaluation,
            "temperature": 0.2,
        },
        system_instruction=SYSTEM_PROMPT,
    )

    response = model.generate_content(
        f"Analyze the following scientific article and produce the CASP / GRADE / PICO evaluation JSON.\n\n"
        f"--- BEGIN ARTICLE TEXT ---\n{text}\n--- END ARTICLE TEXT ---"
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
