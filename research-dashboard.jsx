import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, FileText, Beaker, Users, TrendingUp, ChevronDown, ChevronUp, Activity, Target, Award } from 'lucide-react';

const ResearchDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCards, setExpandedCards] = useState({});

  // Data from JSON
  const data = {
    metadata: {
      title: "Artificial sweeteners induce glucose intolerance by altering the gut microbiota",
      authors: ["Jotham Suez", "Tal Korem", "David Zeevi", "Gili Zilberman-Schapira", "Christoph A. Thaiss", "Ori Maza", "David Israeli", "Niv Zmora", "Shlomit Gilad", "Adina Weinberger", "Yael Kuperman", "Alon Harmelin", "Ilana Kolodkin-Gal", "Hagit Shapiro", "Zamir Halpern", "Eran Segal", "Eran Elinav"],
      journal: "Nature",
      year: 2014,
      doi: "10.1038/nature13793"
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
    conclusion: "The study provides moderate quality evidence suggesting that artificial sweeteners induce glucose intolerance by altering the gut microbiota in both mice and humans. The mechanistic evidence from animal models is strong and causally links microbiota changes to metabolic derangements. The human data, while supportive and providing initial causal insights from the intervention study, is limited by study design (observational, small intervention cohort, lack of blinding) and thus has lower certainty of evidence."
  };

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
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{data.metadata.title}</h2>
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

      {/* Key Findings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Key Findings
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

  const MethodologyTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-purple-600" />
          CASP Critical Appraisal - Validity & Results
        </h3>
        
        {/* Section A: Validity */}
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

        {/* Section B: Results */}
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

  const ClinicalContextTab = () => (
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

  const EvidenceTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          GRADE Evidence Quality
        </h3>
        
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-sm text-orange-900 mb-2">Reliability Conclusion</h4>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'methodology', label: 'Methodology (CASP)', icon: Beaker },
    { id: 'clinical', label: 'Clinical Context (PICO)', icon: Users },
    { id: 'evidence', label: 'Evidence (GRADE)', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Analysis Dashboard</h1>
          <p className="text-gray-600">CASP Critical Appraisal & Quality Assessment</p>
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
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
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
          {activeTab === 'methodology' && <MethodologyTab />}
          {activeTab === 'clinical' && <ClinicalContextTab />}
          {activeTab === 'evidence' && <EvidenceTab />}
        </div>
      </div>
    </div>
  );
};

export default ResearchDashboard;