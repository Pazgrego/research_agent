import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, AlertTriangle, FileText, Beaker, Users, TrendingUp, 
  ChevronDown, ChevronUp, Activity, Target, Award, AlertCircle,
  Microscope, BookOpen, ShieldAlert, FlaskConical, XCircle
} from 'lucide-react';

const ContextAwareDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCards, setExpandedCards] = useState({});

  // Enhanced data from JSON with study type detection
  const data = {
    metadata: {
      title: "Artificial sweeteners induce glucose intolerance by altering the gut microbiota",
      authors: ["Jotham Suez", "Tal Korem", "David Zeevi", "Gili Zilberman-Schapira", "Christoph A. Thaiss", "Ori Maza", "David Israeli", "Niv Zmora", "Shlomit Gilad", "Adina Weinberger", "Yael Kuperman", "Alon Harmelin", "Ilana Kolodkin-Gal", "Hagit Shapiro", "Zamir Halpern", "Eran Segal", "Eran Elinav"],
      journal: "Nature",
      year: 2014,
      doi: "10.1038/nature13793",
      studyType: "ORIGINAL_ARTICLE", // Derived from "Mixed methods (animal intervention, human observational, human intervention)"
      studyTypeLabel: "Original Research Article (Mixed Methods)"
    },
    quality: {
      score: 59.1,
      rating: "MODERATE",
      totalQuestions: 11,
      totalScore: 6.5
    },
    pico: {
      population: "Lean and obese C57Bl/6 mice, outbred Swiss Webster mice, germ-free mice; non-diabetic human individuals (long-term NAS consumers, non-consumers, and healthy volunteers not normally consuming NAS).",
      intervention: "Consumption of non-caloric artificial sweeteners (NAS) - saccharin, sucralose, aspartame (commercial formulations and pure saccharin).",
      comparator: "Water, glucose, sucrose (in mice); non-NAS consumers, baseline (in humans).",
      outcomes: "Glucose intolerance (OGTT, AUC, HbA1C%), gut microbiota composition (16S rRNA, shotgun metagenomics) and function (glycan degradation pathways, SCFA levels), metabolic parameters (weight, waist-to-hip ratio, fasting blood glucose, ALT)."
    },
    casp: {
      validity: [
        {
          question: "Did the trial address a clearly focused issue?",
          answer: "YES",
          score: 1.0,
          notes: "The study clearly defines the population, intervention, comparator, and outcomes across both animal and human components."
        },
        {
          question: "Was the assignment of patients to treatments randomised?",
          answer: "PARTIAL",
          score: 0.5,
          concerns: ["Human studies were not randomized, limiting causal inference for the observational cohort and generalizability for the small intervention cohort."]
        },
        {
          question: "Were all patients who entered the trial properly accounted for at its conclusion?",
          answer: "YES",
          score: 1.0,
          notes: "All mice and human participants who entered the trial were accounted for at its conclusion, with no exclusions reported."
        }
      ],
      results: [
        {
          question: "Were patients, health workers and study personnel blind to treatment?",
          answer: "NO",
          score: 0.0,
          biasRisk: "HIGH",
          concerns: ["Lack of blinding in both animal and human studies could introduce performance and detection bias, potentially influencing outcomes or their assessment."]
        },
        {
          question: "Were the groups similar at the start of the trial?",
          answer: "PARTIAL",
          score: 0.5,
          notes: "While animal groups were similar due to randomization, the human observational study had inherent baseline differences, and the human intervention study relied on within-subject comparisons rather than between-group similarity."
        },
        {
          question: "Aside from the experimental intervention, were the groups treated equally?",
          answer: "YES",
          score: 1.0,
          notes: "Compared mouse groups were always fed from the same batch of diet."
        },
        {
          question: "How large was the treatment effect?",
          answer: "YES",
          score: 1.0,
          notes: "The study demonstrated significant and biologically relevant treatment effects across multiple endpoints."
        },
        {
          question: "How precise was the estimate of the treatment effect?",
          answer: "PARTIAL",
          score: 0.5,
          concerns: ["Many effect sizes reported without confidence intervals, limiting assessment of precision."]
        },
        {
          question: "Can the results be applied in your context?",
          answer: "PARTIAL",
          score: 0.5,
          notes: "Caution is warranted in extrapolating findings to diverse human populations beyond the study cohort."
        },
        {
          question: "Were all clinically important outcomes considered?",
          answer: "PARTIAL",
          score: 0.5,
          notes: "Study focused on glucose intolerance and microbiota; long-term clinical health outcomes were not assessed."
        },
        {
          question: "Are the benefits worth the harms and costs?",
          answer: "NO",
          score: 0.0,
          notes: "Study suggests potential harms may outweigh perceived benefits of NAS consumption."
        }
      ]
    },
    strengths: [
      "Comprehensive approach combining animal models (lean, obese, germ-free) and human studies (observational, short-term intervention).",
      "Strong mechanistic evidence through antibiotic treatment and fecal microbiota transplantation demonstrating causality of gut microbiota in NAS-induced glucose intolerance.",
      "Identification of specific microbial compositional and functional alterations linked to the metabolic phenotype.",
      "Replication of findings across different NAS types, doses, and mouse strains enhances the robustness of the animal data."
    ],
    limitations: [
      "Lack of blinding in animal and human studies, increasing the risk of performance and detection bias.",
      "The human observational study is correlational, with inherent baseline differences between groups that, despite statistical adjustment, limit definitive causal inference.",
      "The human intervention study had a very small sample size (N=7) and short duration (7 days), limiting the generalizability and long-term causal inference of these specific findings.",
      "Absence of explicit power calculations for sample sizes across study components.",
      "Lack of confidence intervals for many reported effect sizes, which would provide a clearer measure of precision."
    ],
    conclusion: "The study provides moderate quality evidence suggesting that artificial sweeteners induce glucose intolerance by altering the gut microbiota in both mice and humans. The mechanistic evidence from animal models is strong and causally links microbiota changes to metabolic derangements. The human data, while supportive and providing initial causal insights from the intervention study, is limited by study design (observational, small intervention cohort, lack of blinding) and thus has lower certainty of evidence.",
    scientificJustification: {
      gradeRationale: "The GRADE quality rating of MODERATE (59.1%) reflects a careful balance between the study's significant strengths and notable limitations. The animal work demonstrates strong mechanistic plausibility with robust experimental design, including randomization, multiple model systems, and causality testing through fecal transplantation. However, the human evidence—critical for clinical translation—is substantially weaker. The observational cohort provides only correlational data with confounding risks, while the interventional human study, though showing causal potential, suffers from a critically small sample size (N=7) and brief duration (7 days). This limited human evidence prevents a HIGH quality rating despite excellent mechanistic insights.",
      keyDowngrades: [
        {
          factor: "Small Human Sample Size (N=7)",
          impact: "Major downgrade",
          explanation: "The interventional human component included only 7 participants over 7 days. This severely limits statistical power, generalizability, and the ability to detect heterogeneous treatment effects across diverse populations. For GRADE assessment, inadequate sample size is a critical limitation that downgrades certainty of evidence."
        },
        {
          factor: "Lack of Blinding",
          impact: "Moderate downgrade",
          explanation: "Neither participants nor personnel were blinded in any study component. This introduces substantial risk of performance and detection bias, particularly concerning subjective outcomes or behavioral modifications that could influence metabolic parameters."
        },
        {
          factor: "Indirectness of Evidence",
          impact: "Minor downgrade",
          explanation: "Heavy reliance on animal models creates indirectness when extrapolating to human clinical outcomes. While mechanistic insights are valuable, cross-species translation requires cautious interpretation, especially for complex metabolic phenotypes."
        }
      ],
      upgradeConsiderations: [
        {
          factor: "Strong Mechanistic Evidence",
          rationale: "Fecal microbiota transplantation experiments provide compelling causal evidence linking microbiome alterations to metabolic phenotype. This mechanistic coherence partially offsets concerns about human sample size."
        },
        {
          factor: "Dose-Response and Consistency",
          rationale: "Effects observed across multiple NAS types, doses, and mouse strains demonstrate consistency and suggest biological plausibility, strengthening confidence in findings."
        }
      ]
    },
    missingOutcomes: [
      {
        category: "Long-term Safety & Efficacy",
        gaps: [
          "No long-term follow-up data beyond 7 days in human intervention study",
          "Cardiovascular outcomes not assessed despite known metabolic-cardiovascular links",
          "Renal function and kidney disease progression not evaluated",
          "Neurological or cognitive effects of chronic NAS exposure not measured",
          "Cancer risk or tumor progression markers not investigated"
        ],
        criticalityLevel: "HIGH"
      },
      {
        category: "Population Diversity & Generalizability",
        gaps: [
          "Pediatric populations completely excluded despite widespread NAS consumption in children",
          "Pregnant or lactating women not studied, despite potential developmental effects",
          "Individuals with pre-existing diabetes or metabolic syndrome underrepresented",
          "No stratification by genetic background, ethnicity, or baseline microbiome composition",
          "Elderly populations (>65 years) not specifically examined"
        ],
        criticalityLevel: "HIGH"
      },
      {
        category: "Mechanistic & Biological Pathways",
        gaps: [
          "Specific bacterial species or strains responsible for metabolic effects not definitively identified",
          "Host immune system interactions with altered microbiota not characterized",
          "Metabolomic profiling incomplete—many bacterial metabolites not measured",
          "Epigenetic modifications or gene expression changes in human tissues not assessed",
          "Dose-response relationships in humans not established"
        ],
        criticalityLevel: "MODERATE"
      },
      {
        category: "Clinical & Patient-Centered Outcomes",
        gaps: [
          "Quality of life measures not included",
          "Adherence and acceptability of NAS restriction not evaluated",
          "Socioeconomic factors influencing NAS consumption patterns not considered",
          "Cost-effectiveness analysis of NAS avoidance strategies absent",
          "Patient preferences and values regarding NAS use not explored"
        ],
        criticalityLevel: "MODERATE"
      },
      {
        category: "Safety Monitoring",
        gaps: [
          "Adverse events systematically monitored only for exclusion criteria (pregnancy), not comprehensively tracked",
          "Hepatotoxicity markers measured but not emphasized as primary safety outcome",
          "Gut barrier integrity and intestinal permeability not assessed",
          "Potential for microbiome-mediated drug interactions not investigated"
        ],
        criticalityLevel: "MODERATE"
      }
    ]
  };

  // Study type configuration
  const studyTypeConfig = {
    ORIGINAL_ARTICLE: {
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-600'
    },
    SYSTEMATIC_REVIEW: {
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-900',
      accentColor: 'text-purple-600'
    },
    NARRATIVE_REVIEW: {
      color: 'teal',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300',
      textColor: 'text-teal-900',
      accentColor: 'text-teal-600'
    }
  };

  const currentTheme = studyTypeConfig[data.metadata.studyType];

  // Dynamic tab configuration based on study type
  const tabConfigs = {
    ORIGINAL_ARTICLE: [
      { id: 'overview', label: 'Overview', icon: Award },
      { id: 'pico', label: 'PICO Framework', icon: Users },
      { id: 'casp', label: 'CASP Quality', icon: Beaker },
      { id: 'grade', label: 'GRADE Evidence', icon: FileText },
      { id: 'missing', label: 'Gap Analysis', icon: AlertCircle }
    ],
    SYSTEMATIC_REVIEW: [
      { id: 'overview', label: 'Overview', icon: Award },
      { id: 'pico', label: 'PICO Framework', icon: Users },
      { id: 'prisma', label: 'PRISMA/AMSTAR', icon: BookOpen },
      { id: 'grade', label: 'GRADE Evidence', icon: FileText },
      { id: 'missing', label: 'Gap Analysis', icon: AlertCircle }
    ],
    NARRATIVE_REVIEW: [
      { id: 'overview', label: 'Overview', icon: Award },
      { id: 'scope', label: 'Scope (PICO)', icon: Users },
      { id: 'sanra', label: 'SANRA Analysis', icon: Microscope },
      { id: 'evidence', label: 'Evidence Quality', icon: FileText },
      { id: 'missing', label: 'Gap Analysis', icon: AlertCircle }
    ]
  };

  const tabs = tabConfigs[data.metadata.studyType];

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getQualityColor = (rating) => {
    switch(rating) {
      case 'HIGH': return 'text-green-600 bg-green-50 border-green-200';
      case 'MODERATE': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'LOW': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCriticalityColor = (level) => {
    switch(level) {
      case 'HIGH': return 'border-red-300 bg-red-50 text-red-900';
      case 'MODERATE': return 'border-orange-300 bg-orange-50 text-orange-900';
      case 'LOW': return 'border-yellow-300 bg-yellow-50 text-yellow-900';
      default: return 'border-gray-300 bg-gray-50 text-gray-900';
    }
  };

  const getAnswerBadge = (answer) => {
    const colors = {
      'YES': 'bg-green-100 text-green-800 border-green-300',
      'PARTIAL': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'NO': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[answer] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const CircularProgress = ({ percentage, size = 140 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    const color = percentage >= 75 ? '#16a34a' : percentage >= 50 ? '#ea580c' : '#dc2626';

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{percentage}%</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Quality</span>
        </div>
      </div>
    );
  };

  const ExpandableCard = ({ id, title, icon: Icon, children, variant = 'default' }) => {
    const isExpanded = expandedCards[id];
    const colors = {
      strength: 'border-green-200 bg-green-50',
      limitation: 'border-red-200 bg-red-50',
      default: 'border-gray-200 bg-white'
    };

    return (
      <div className={`border rounded-lg ${colors[variant]} transition-all duration-200`}>
        <button
          onClick={() => toggleCard(id)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Header Card with Study Type Badge */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900 flex-1">{data.metadata.title}</h2>
          <div className={`px-4 py-2 rounded-lg border-2 ${currentTheme.bgColor} ${currentTheme.borderColor} flex-shrink-0`}>
            <div className="flex items-center gap-2">
              <FlaskConical className={`w-5 h-5 ${currentTheme.accentColor}`} />
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Study Type</div>
                <div className={`text-sm font-bold ${currentTheme.textColor}`}>{data.metadata.studyTypeLabel}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Journal:</span>
            <span className="ml-2 font-medium">{data.metadata.journal}</span>
          </div>
          <div>
            <span className="text-gray-500">Year:</span>
            <span className="ml-2 font-medium">{data.metadata.year}</span>
          </div>
          <div>
            <span className="text-gray-500">DOI:</span>
            <span className="ml-2 font-medium text-blue-600">{data.metadata.doi}</span>
          </div>
        </div>
      </div>

      {/* Quality Score Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Overall Quality Assessment
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getQualityColor(data.quality.rating)}`}>
              <span className="text-sm font-bold uppercase tracking-wide">{data.quality.rating} Quality</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              CASP Score: {data.quality.totalScore} / {data.quality.totalQuestions} applicable questions
            </p>
          </div>
          <div className="flex-shrink-0">
            <CircularProgress percentage={data.quality.score} />
          </div>
        </div>
      </div>

      {/* Scientific Justification Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <Microscope className="w-5 h-5 text-indigo-600" />
          Scientific Logic & Justification
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-sm text-indigo-800 mb-2">Why MODERATE Quality (59.1%)?</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.scientificJustification.gradeRationale}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Key Factors Downgrading Evidence Quality
            </h4>
            <div className="space-y-2">
              {data.scientificJustification.keyDowngrades.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-red-400">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900">{item.factor}</span>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                      {item.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Factors Supporting Evidence Quality
            </h4>
            <div className="space-y-2">
              {data.scientificJustification.upgradeConsiderations.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border-l-4 border-green-400">
                  <span className="font-semibold text-sm text-gray-900 block mb-1">{item.factor}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Key Findings Summary
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{data.conclusion}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Strengths ({data.strengths.length})
            </h4>
            <ul className="space-y-2">
              {data.strengths.slice(0, 2).map((strength, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-green-600 flex-shrink-0">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Limitations ({data.limitations.length})
            </h4>
            <ul className="space-y-2">
              {data.limitations.slice(0, 2).map((limitation, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-red-600 flex-shrink-0">•</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const PICOTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          PICO Framework - Clinical Context
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Population
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pico.population}</p>
          </div>
          
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-sm text-green-900 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Intervention
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pico.intervention}</p>
          </div>
          
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="font-semibold text-sm text-purple-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Comparator
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pico.comparator}</p>
          </div>
          
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h4 className="font-semibold text-sm text-orange-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Outcomes
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.pico.outcomes}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const CASPTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-purple-600" />
          CASP Critical Appraisal - Validity & Results
        </h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-sm text-gray-700 mb-4 uppercase tracking-wide">Section A: Validity</h4>
          <div className="space-y-3">
            {data.casp.validity.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1">{item.question}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAnswerBadge(item.answer)}`}>
                    {item.answer}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span>Score: <strong>{item.score}</strong> / 1.0</span>
                  <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.score === 1 ? 'bg-green-500' : item.score === 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">{item.notes}</p>
                )}
                {item.concerns && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{item.concerns[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-4 uppercase tracking-wide">Section B: Results & Clinical Utility</h4>
          <div className="space-y-3">
            {data.casp.results.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1">{item.question}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAnswerBadge(item.answer)}`}>
                    {item.answer}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span>Score: <strong>{item.score}</strong> / 1.0</span>
                  <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.score === 1 ? 'bg-green-500' : item.score === 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                </div>
                {item.biasRisk && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-red-700">Bias Risk: {item.biasRisk}</span>
                  </div>
                )}
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">{item.notes}</p>
                )}
                {item.concerns && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{item.concerns[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const GRADETab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          GRADE Evidence Quality Assessment
        </h3>
        
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-sm text-orange-900 mb-2">Evidence Certainty Conclusion</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{data.conclusion}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Study Strengths
            </h4>
            <div className="space-y-2">
              {data.strengths.map((strength, idx) => (
                <ExpandableCard 
                  key={`strength-${idx}`}
                  id={`strength-${idx}`}
                  title={`Strength ${idx + 1}`}
                  icon={CheckCircle}
                  variant="strength"
                >
                  {strength}
                </ExpandableCard>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Study Limitations
            </h4>
            <div className="space-y-2">
              {data.limitations.map((limitation, idx) => (
                <ExpandableCard 
                  key={`limitation-${idx}`}
                  id={`limitation-${idx}`}
                  title={idx === 2 ? "Critical: Small Human Sample (N=7)" : `Limitation ${idx + 1}`}
                  icon={AlertTriangle}
                  variant="limitation"
                >
                  {limitation}
                </ExpandableCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MissingOutcomesTab = () => (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Critical Evidence Gaps Identified</h3>
            <p className="text-sm text-red-800 leading-relaxed">
              The following outcomes and populations were not adequately addressed in this study, 
              limiting the comprehensiveness of evidence and potential clinical applicability. 
              These gaps represent important areas for future research.
            </p>
          </div>
        </div>
      </div>

      {/* Gap Categories */}
      {data.missingOutcomes.map((category, idx) => (
        <div key={idx} className={`border-2 rounded-lg p-6 ${getCriticalityColor(category.criticalityLevel)}`}>
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {category.category}
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 
              ${category.criticalityLevel === 'HIGH' ? 'bg-red-100 border-red-400 text-red-900' : 
                category.criticalityLevel === 'MODERATE' ? 'bg-orange-100 border-orange-400 text-orange-900' : 
                'bg-yellow-100 border-yellow-400 text-yellow-900'}`}>
              {category.criticalityLevel} PRIORITY
            </span>
          </div>
          <ul className="space-y-2">
            {category.gaps.map((gap, gapIdx) => (
              <li key={gapIdx} className="flex items-start gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Summary Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Implications for Future Research
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Addressing these gaps through well-designed, adequately powered studies with diverse populations 
          and comprehensive outcome assessment will strengthen the evidence base and enable more confident 
          clinical recommendations regarding artificial sweetener consumption and metabolic health.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Analysis Dashboard</h1>
          <p className="text-gray-600">Context-Aware Quality Assessment & Evidence Synthesis</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? `${currentTheme.bgColor} ${currentTheme.accentColor} border-b-2 ${currentTheme.borderColor}`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'pico' && <PICOTab />}
          {activeTab === 'scope' && <PICOTab />}
          {activeTab === 'casp' && <CASPTab />}
          {activeTab === 'grade' && <GRADETab />}
          {activeTab === 'evidence' && <GRADETab />}
          {activeTab === 'missing' && <MissingOutcomesTab />}
        </div>
      </div>
    </div>
  );
};

export default ContextAwareDashboard;