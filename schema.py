from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class AnswerType(str, Enum):
    YES = "YES"
    NO = "NO"
    PARTIAL = "PARTIAL"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    UNCLEAR = "UNCLEAR"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    UNCLEAR = "UNCLEAR"


class QualityRating(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    MODERATE_TO_HIGH = "MODERATE_TO_HIGH"
    HIGH = "HIGH"


class EffectSizeLevel(str, Enum):
    LARGE = "LARGE"
    MODERATE = "MODERATE"
    SMALL = "SMALL"
    NONE = "NONE"
    UNCLEAR = "UNCLEAR"


class PrecisionLevel(str, Enum):
    HIGH = "HIGH"
    MODERATE = "MODERATE"
    LOW = "LOW"
    UNCLEAR = "UNCLEAR"


class ChecklistType(str, Enum):
    CASP_RCT = "CASP_RCT"
    CASP_COHORT = "CASP_COHORT"
    CASP_QUALITATIVE = "CASP_QUALITATIVE"
    CASP_SYSTEMATIC_REVIEW = "CASP_SYSTEMATIC_REVIEW"


# Article Metadata Models
class ArticleMetadata(BaseModel):
    title: str
    authors: List[str]
    journal: str
    publication_year: int
    doi: str
    study_type: str
    limitations_found: Optional[List[str]]


# PICO Structure
class PICODetails(BaseModel):
    population: str
    intervention: str
    comparator: str
    outcomes: str
    limitations_found: Optional[List[str]]


# Question 1: Focused Issue
class FocusedIssueQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: PICODetails
    score: float
    notes: Optional[str]
    limitations_found: Optional[List[str]]


# Question 2: Randomization
class RandomizationDetails(BaseModel):
    mice_studies: str
    human_intervention: str
    human_observational: str
    limitations_found: Optional[List[str]]


class RandomizationQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: RandomizationDetails
    score: float
    concerns: List[str]
    limitations_found: Optional[List[str]]


# Question 3: Patient Accounting
class PatientAccountingDetails(BaseModel):
    mice: str
    humans: str
    limitations_found: Optional[List[str]]


class PatientAccountingQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: PatientAccountingDetails
    score: float
    notes: Optional[str]
    limitations_found: Optional[List[str]]


# Preliminary Assessment
class PreliminaryAssessment(BaseModel):
    worth_continuing: bool
    rationale: str
    limitations_found: Optional[List[str]]


# Section A: Validity
class SectionAValidity(BaseModel):
    question_1_focused_issue: FocusedIssueQuestion
    question_2_randomization: RandomizationQuestion
    question_3_all_patients_accounted: PatientAccountingQuestion
    preliminary_assessment: PreliminaryAssessment
    limitations_found: Optional[List[str]]


# Question 4: Blinding
class BlindingDetails(BaseModel):
    patients_blinded: bool
    personnel_blinded: bool
    explicit_statement: str
    limitations_found: Optional[List[str]]


class BlindingQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: BlindingDetails
    score: float
    bias_risk: RiskLevel
    concerns: List[str]
    limitations_found: Optional[List[str]]


# Question 5: Group Similarity
class GroupSimilarityDetails(BaseModel):
    baseline_characteristics: str
    human_baseline: str
    baseline_measurements: str
    limitations_found: Optional[List[str]]


class GroupSimilarityQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: GroupSimilarityDetails
    score: float
    notes: Optional[str]
    limitations_found: Optional[List[str]]


# Question 6: Equal Treatment
class EqualTreatmentDetails(BaseModel):
    same_diet_batch: str
    same_housing: str
    same_testing: str
    limitations_found: Optional[List[str]]


class EqualTreatmentQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: EqualTreatmentDetails
    score: float
    limitations_found: Optional[List[str]]


# Question 7: Effect Size
class OutcomeMeasurement(BaseModel):
    metric: str
    statistical_significance: str
    effect_description: str
    limitations_found: Optional[List[str]]


class MechanisticOutcomes(BaseModel):
    microbiota_transfer: str
    antibiotic_reversal: str
    limitations_found: Optional[List[str]]


class HumanOutcomeMeasurement(BaseModel):
    observational: str
    intervention: str
    limitations_found: Optional[List[str]]


class EffectSizeDetails(BaseModel):
    primary_outcome_mice: OutcomeMeasurement
    primary_outcome_humans: HumanOutcomeMeasurement
    mechanistic_outcomes: MechanisticOutcomes
    limitations_found: Optional[List[str]]


class EffectSizeQuestion(BaseModel):
    question: str
    answer: EffectSizeLevel
    details: EffectSizeDetails
    score: float
    limitations_found: Optional[List[str]]


# Question 8: Precision
class SampleSizes(BaseModel):
    mice_groups: str
    human_observational: str
    human_intervention: str
    limitations_found: Optional[List[str]]


class PrecisionDetails(BaseModel):
    confidence_intervals: str
    p_values: str
    sample_sizes: SampleSizes
    error_reporting: str
    limitations_found: Optional[List[str]]


class PrecisionQuestion(BaseModel):
    question: str
    answer: PrecisionLevel
    details: PrecisionDetails
    score: float
    concerns: List[str]
    limitations_found: Optional[List[str]]


# Section B: Results
class SectionBResults(BaseModel):
    question_4_blinding: BlindingQuestion
    question_5_groups_similar: GroupSimilarityQuestion
    question_6_treated_equally: EqualTreatmentQuestion
    question_7_effect_size: EffectSizeQuestion
    question_8_precision: PrecisionQuestion
    limitations_found: Optional[List[str]]


# Question 9: Applicability
class ApplicabilityDetails(BaseModel):
    generalizability_limitations: List[str]
    strengths: List[str]
    limitations_found: Optional[List[str]]


class ApplicabilityQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: ApplicabilityDetails
    score: float
    limitations_found: Optional[List[str]]


# Question 10: Important Outcomes
class OutcomesConsideredDetails(BaseModel):
    outcomes_measured: List[str]
    outcomes_missing: List[str]
    limitations_found: Optional[List[str]]


class OutcomesConsideredQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: OutcomesConsideredDetails
    score: float
    limitations_found: Optional[List[str]]


# Question 11: Benefits vs Harms
class BenefitsHarmsDetails(BaseModel):
    type: str
    findings_suggest: str
    clinical_implications: str
    limitations_found: Optional[List[str]]


class BenefitsHarmsQuestion(BaseModel):
    question: str
    answer: AnswerType
    details: BenefitsHarmsDetails
    score: str
    limitations_found: Optional[List[str]]


# Section C: Applicability
class SectionCApplicability(BaseModel):
    question_9_results_applicable: ApplicabilityQuestion
    question_10_outcomes_considered: OutcomesConsideredQuestion
    question_11_benefits_worth_harms: BenefitsHarmsQuestion
    limitations_found: Optional[List[str]]


# Main CASP Evaluation
class CASPEvaluation(BaseModel):
    checklist_used: ChecklistType
    evaluation_date: str
    section_a_validity: SectionAValidity
    section_b_results: SectionBResults
    section_c_applicability: SectionCApplicability
    limitations_found: Optional[List[str]]


# Additional Quality Assessment Models
class BiasAssessment(BaseModel):
    risk: RiskLevel
    notes: str
    limitations_found: Optional[List[str]]


class InternalValidity(BaseModel):
    selection_bias: BiasAssessment
    performance_bias: BiasAssessment
    detection_bias: BiasAssessment
    attrition_bias: BiasAssessment
    reporting_bias: BiasAssessment
    limitations_found: Optional[List[str]]


class ExternalValidity(BaseModel):
    animal_to_human_translation: str
    population_representativeness: str
    intervention_feasibility: str
    limitations_found: Optional[List[str]]


class StatisticalRigor(BaseModel):
    appropriate_tests: bool
    multiple_testing_correction: str
    sample_size_justification: str
    power_calculation: str
    limitations_found: Optional[List[str]]


class MechanisticStrength(BaseModel):
    causality_evidence: List[str]
    bradford_hill_criteria_met: int
    limitations_found: Optional[List[str]]


class AdditionalQualityAssessment(BaseModel):
    internal_validity: InternalValidity
    external_validity: ExternalValidity
    statistical_rigor: StatisticalRigor
    mechanistic_strength: MechanisticStrength
    limitations_found: Optional[List[str]]


# Overall Assessment
class OverallAssessment(BaseModel):
    total_applicable_questions: int
    total_score: float
    percentage_score: float
    quality_rating: QualityRating
    key_strengths: List[str]
    key_limitations: List[str]
    reliability_conclusion: str
    recommendations: List[str]
    limitations_found: Optional[List[str]]


# Root Model
class CASPArticleEvaluation(BaseModel):
    article_metadata: ArticleMetadata
    casp_evaluation: CASPEvaluation
    additional_quality_assessment: AdditionalQualityAssessment
    overall_assessment: OverallAssessment
