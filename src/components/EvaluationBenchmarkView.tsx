import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Layers, 
  BarChart3, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { MSO_AGENCIES } from '../data/agencies';
import { AgencyCode } from '../types';

interface BenchmarkCase {
  id: string;
  title: string;
  text: string;
  ground_truth_purview: string;
  ground_truth_agency: string;
  category: string;
  hazard_flag?: boolean;
  notes: string;
}

const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: "TC-01",
    title: "Corridor Clutter & Obstruction (Singlish + Typos)",
    text: "Eh hello, blk 432 ang mo kio ave 10 #08-112 common corridoor damn messy sia! Neighbour put so many cardbord boxes, brokn bicycle n wood planks until pathway left very narrow cannot walk. If got fire how to run? Pls ask town councl come chk n clear asap!",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "TOWN_COUNCIL",
    category: "Estate Cleanliness & Common Property",
    hazard_flag: true,
    notes: "HDB common corridor is managed by Town Council. Singlish particles and typos tested."
  },
  {
    id: "TC-02",
    title: "Faulty Traffic Signal at Tampines School Junction",
    text: "The pedestrian green man signal at junction of Tampines Ave 4 and Tampines St 21 (near Blk 201D) has not been turning green for the past 2 days. Primary school children from nearby school are forced to dash across road during heavy morning traffic, very dangerous!",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "LTA",
    category: "Roads & Traffic Signals",
    hazard_flag: true,
    notes: "Traffic lights & public road crossings are managed by LTA."
  },
  {
    id: "TC-03",
    title: "Severe Mosquito Breeding in Stagnant Canal Verge",
    text: "Behind Sixth Avenue MRT along Bukit Timah canal verge, got big puddle of stagnant muddy water with hundreds of active mosquito larvae wriggling around. Our estate already had 3 dengue cases reported this month, please check urgently.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "NEA",
    category: "Vector Control & Public Health",
    hazard_flag: true,
    notes: "Mosquito larvae and Dengue vector control falls under NEA purview."
  },
  {
    id: "TC-04",
    title: "Dangerous Overhanging Roadside Tree Branch",
    text: "There is a huge, cracked tree branch hanging precariously above the public bus shelter (Bus Stop ID: 41021) along Upper Bukit Timah Road right after heavy thunderstorms yesterday. It looks like it could snap and crash onto commuters.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "NPARKS",
    category: "Greenery & Roadside Trees",
    hazard_flag: true,
    notes: "Trees along public roads and roadside verges are managed by NParks."
  },
  {
    id: "TC-05",
    title: "Inter-floor Ceiling Water Leakage in HDB Flat",
    text: "I am the owner of Blk 118 Jurong East St 13 #04-32. Since last week, dirty water has been continuously dripping from my master bedroom ceiling, coming from unit directly above #05-32. The upstairs owner refuses to open door. The ceiling plaster is turning mouldy.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "HDB",
    category: "Public Housing Structural Maintenance",
    hazard_flag: false,
    notes: "Inter-floor ceiling leaks within HDB flats are handled by HDB Branch Office."
  },
  {
    id: "TC-06",
    title: "Choked Storm Drain & Flash Flooding Risk (Singlish + Typos)",
    "text": "Balestier road outside shophouse 280 the roadside drane grating totally chok already la. Full of dried leavs, rubbish and plasic cups. Everytime rain heavy sure water overflow come out flood the whole walkawy. Pls send pub to clear the drian fast.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "PUB",
    category: "Drainage & Flood Management",
    hazard_flag: false,
    notes: "Public storm drains and flood prevention fall under PUB. Tested with Singlish phrasing & typos."
  },
  {
    id: "TC-07",
    title: "Illegal Dumping of Construction Waste on State Land",
    text: "Someone has dumped several lorry loads of broken tiles, discarded concrete slabs, and rotting furniture on the open grassland plot beside Jalan Kayu (near the expressway slip road). The plot has an SLA boundary signboard.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "SLA",
    category: "State Land Management",
    hazard_flag: false,
    notes: "Unallocated state land and illegal dumping on state plots fall under SLA."
  },
  {
    id: "TC-08",
    title: "Wild Boar Intrusion at Ulu Pandan PCN",
    text: "A sounder of 5 wild boars has been aggressively foraging and chasing joggers along the Ulu Pandan Park Connector near Sunset Way every evening. Some people are feeding them apples.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "NPARKS",
    category: "Wildlife & Animal Management",
    hazard_flag: true,
    notes: "Park connector greenery and wildlife management fall under NParks (AVS)."
  },
  {
    id: "TC-09",
    title: "Scam Call Impersonating Municipal Officer",
    "text": "I received an automated call claiming to be from OneService Compliance Unit. The caller stated I have an unpaid fine of $850 for illegal littering and threatened arrest unless I transferred money to a PayNow UEN account and gave my Singpass OTP.",
    ground_truth_purview: "OUT_OF_PURVIEW",
    ground_truth_agency: "OUT_OF_PURVIEW",
    category: "Non-Municipal / Criminal Scam",
    hazard_flag: false,
    notes: "Scams and criminal fraud are non-municipal; strictly under Police (SPF)."
  },
  {
    id: "TC-10",
    title: "Private Condominium Gym Maintenance Dispute",
    text: "The managing agent and MCST council of my private condominium in River Valley has refused to repair the broken air-conditioning in our resident gym for 6 months despite collecting our monthly maintenance fee of $480. Can the government fine them?",
    ground_truth_purview: "OUT_OF_PURVIEW",
    ground_truth_agency: "OUT_OF_PURVIEW",
    category: "Non-Municipal / Private Property",
    hazard_flag: false,
    notes: "Internal private strata management disputes are outside MSO purview."
  },
  {
    id: "TC-11",
    title: "CPF Payout and Retirement Sum Enquiry",
    text: "Why hasn't my monthly CPF Retirement Sum Scheme payout of $650 been credited into my POSB bank account this month? I tried calling CPF Board but line was busy.",
    ground_truth_purview: "OUT_OF_PURVIEW",
    ground_truth_agency: "OUT_OF_PURVIEW",
    category: "Non-Municipal / Social Security",
    hazard_flag: false,
    notes: "CPF enquiries are non-municipal financial matters."
  },
  {
    id: "TC-12",
    title: "Singlish / Colloquial Feedback: Lift breakdown at Bedok",
    text: "Eh OneService, the lift B at Blk 214 Bedok North St 1 cannot work again lah! Keep stuck at level 4. My 80yo grandmother cannot walk stairs to go polyclinic. Settle fast please!",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "TOWN_COUNCIL",
    category: "Estate Lift Maintenance",
    hazard_flag: true,
    notes: "Singlish colloquial feedback; lift maintenance belongs to Town Council."
  },
  {
    id: "TC-13",
    title: "Multi-Agency: Fallen Branch on Public Road Verge near HDB Boundary",
    text: "Heavy rain caused a big tree branch to fall right across the footpath and bicycle lane between Blk 310 Yishun Ring Road and the main road bus stop. Part of it is on the grass verge and part is blocking the roadside walkway.",
    ground_truth_purview: "MULTI_AGENCY",
    ground_truth_agency: "NPARKS",
    category: "Multi-Agency Greenery & Footpath",
    hazard_flag: true,
    notes: "Multi-agency coordination involving NParks roadside tree, TC boundary, and LTA footpath."
  },
  {
    id: "TC-14",
    title: "Private Construction Site Noise after 10pm",
    text: "The construction site along Balmoral Road has been doing loud concrete piling and heavy drilling past 11:30 PM for the last three nights. The vibrating noise is unbearable and violates legal quiet hours.",
    ground_truth_purview: "UNDER_PURVIEW",
    ground_truth_agency: "NEA",
    category: "Construction Noise Regulation",
    hazard_flag: false,
    notes: "Construction noise limits are regulated and enforced by NEA."
  },
  {
    id: "TC-15",
    title: "Active Fire Emergency (Critical Edge Case)",
    text: "THERE IS THICK BLACK SMOKE AND FLAMES COMING OUT OF THE RUBBISH CHUTE ROOM AT BLK 55 SIMEI STREET 1 LEVEL 1! SEND FIRE ENGINE IMMEDIATELY!",
    ground_truth_purview: "OUT_OF_PURVIEW",
    ground_truth_agency: "OUT_OF_PURVIEW",
    category: "Emergency 995 / Non-Municipal Routine",
    hazard_flag: true,
    notes: "Active fire emergency requires immediate 995 SCDF activation."
  },
  {
    id: "TC-16",
    title: "Vague / Ambiguous Feedback: Noise Level in Yishun",
    text: "Noise level is very high in Yishun",
    ground_truth_purview: "AMBIGUOUS",
    ground_truth_agency: "AMBIGUOUS",
    category: "Ambiguous / Insufficient Information",
    hazard_flag: false,
    notes: "Vague feedback lacking specific location and noise source; requires citizen clarification reply before routing."
  }
];

interface EvalResultItem {
  id: string;
  title: string;
  category: string;
  groundTruthAgency: string;
  predictedAgency: string;
  routingPass: boolean;
  purviewPass: boolean;
  hazardPass: boolean;
  latencyMs: number;
  consistencyPass?: boolean;
  consistencyRuns?: string[];
}

export const EvaluationBenchmarkView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isConsistencyTesting, setIsConsistencyTesting] = useState(false);
  const [results, setResults] = useState<EvalResultItem[] | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [consistencyScore, setConsistencyScore] = useState<number | null>(null);

  const runEvaluation = async () => {
    setIsRunning(true);
    setCurrentProgress(0);
    const evalResults: EvalResultItem[] = [];

    for (let i = 0; i < BENCHMARK_CASES.length; i++) {
      const tc = BENCHMARK_CASES[i];
      const startT = performance.now();
      
      try {
        const res = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedbackText: tc.text })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - startT);

        const predAgency = data.primaryAgency?.code || 'UNKNOWN';
        const predPurview = data.purviewStatus || 'UNKNOWN';
        const predHazard = !!data.extractedEntities?.safetyHazard;

        const routingPass = (predAgency === tc.ground_truth_agency);
        const purviewPass = (predPurview === tc.ground_truth_purview || 
                             (tc.ground_truth_purview === 'MULTI_AGENCY' && ['MULTI_AGENCY', 'UNDER_PURVIEW'].includes(predPurview)));
        const hazardPass = (predHazard === !!tc.hazard_flag);

        evalResults.push({
          id: tc.id,
          title: tc.title,
          category: tc.category,
          groundTruthAgency: tc.ground_truth_agency,
          predictedAgency: predAgency,
          routingPass,
          purviewPass,
          hazardPass,
          latencyMs: latency
        });
      } catch (err) {
        evalResults.push({
          id: tc.id,
          title: tc.title,
          category: tc.category,
          groundTruthAgency: tc.ground_truth_agency,
          predictedAgency: 'ERROR',
          routingPass: false,
          purviewPass: false,
          hazardPass: false,
          latencyMs: 0
        });
      }

      setCurrentProgress(Math.round(((i + 1) / BENCHMARK_CASES.length) * 100));
    }

    setResults(evalResults);
    setIsRunning(false);
  };

  const runConsistencyTest = async () => {
    setIsConsistencyTesting(true);
    setCurrentProgress(0);
    let matchedConsistent = 0;
    const updatedResults = results ? [...results] : [];

    for (let i = 0; i < BENCHMARK_CASES.length; i++) {
      const tc = BENCHMARK_CASES[i];
      const runs: string[] = [];

      for (let r = 0; r < 3; r++) {
        try {
          const res = await fetch('/api/triage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedbackText: tc.text })
          });
          const data = await res.json();
          runs.push(data.primaryAgency?.code || 'UNKNOWN');
        } catch {
          runs.push('ERROR');
        }
      }

      const isConsistent = runs.length === 3 && (new Set(runs).size === 1);
      if (isConsistent) matchedConsistent++;

      const existingIdx = updatedResults.findIndex(item => item.id === tc.id);
      if (existingIdx >= 0) {
        updatedResults[existingIdx].consistencyPass = isConsistent;
        updatedResults[existingIdx].consistencyRuns = runs;
      }

      setCurrentProgress(Math.round(((i + 1) / BENCHMARK_CASES.length) * 100));
    }

    setConsistencyScore(Math.round((matchedConsistent / BENCHMARK_CASES.length) * 100));
    if (updatedResults.length > 0) setResults(updatedResults);
    setIsConsistencyTesting(false);
  };

  const total = BENCHMARK_CASES.length;
  const routingAccuracy = results ? Math.round((results.filter(r => r.routingPass).length / total) * 100) : 0;
  const purviewAccuracy = results ? Math.round((results.filter(r => r.purviewPass).length / total) * 100) : 0;
  const outOfPurviewCases = BENCHMARK_CASES.filter(c => c.ground_truth_purview === 'OUT_OF_PURVIEW');
  const outOfPurviewPrecision = results ? (() => {
    const predictedOop = results.filter(r => r.predictedAgency === 'OUT_OF_PURVIEW');
    if (predictedOop.length === 0) return 100;
    const truePositiveOop = predictedOop.filter(r => r.groundTruthAgency === 'OUT_OF_PURVIEW').length;
    return Math.round((truePositiveOop / predictedOop.length) * 100);
  })() : 0;
  const avgLatency = results ? Math.round(results.reduce((a, b) => a + b.latencyMs, 0) / total) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Runner Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Benchmark Suite
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Municipal Triage LLM Evaluation Suite
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Evaluates the model against 15 curated ground-truth Singapore municipal scenarios across statutory jurisdictions, out-of-purview filters, emergency guardrails, and Singlish colloquial phrasing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-run-consistency-test"
              onClick={runConsistencyTest}
              disabled={isConsistencyTesting || isRunning}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all shadow-2xs ${
                isConsistencyTesting 
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 cursor-pointer'
              }`}
              title="Runs each test case 3 times to measure deterministic routing consistency"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConsistencyTesting ? 'animate-spin' : ''}`} />
              <span>{isConsistencyTesting ? `Consistency Testing (${currentProgress}%)...` : 'Run 3-Pass Consistency Test'}</span>
            </button>

            <button
              id="btn-run-full-evaluation"
              onClick={runEvaluation}
              disabled={isRunning || isConsistencyTesting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                isRunning 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating ({currentProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Full Benchmark (15 Cases)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        {results && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Routing Accuracy</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {routingAccuracy}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {results.filter(r => r.routingPass).length} / {total} cases passed
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Purview Precision</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {purviewAccuracy}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {results.filter(r => r.purviewPass).length} / {total} correctly categorized
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Out of Purview Precision</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {outOfPurviewPrecision}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Non-municipal accuracy
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Avg Response Time</span>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {avgLatency} ms
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Input to output (1m timeout)
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Consistency (3 Runs)</span>
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {consistencyScore !== null ? `${consistencyScore}%` : 'Pending'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {consistencyScore !== null ? 'Deterministic matches' : 'Click test above'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ground-Truth Test Case Evaluation Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {BENCHMARK_CASES.length} Standardized Scenarios
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Scenario Title & Category</th>
                <th className="py-2.5 px-4">Ground Truth</th>
                <th className="py-2.5 px-4">Model Routing</th>
                <th className="py-2.5 px-4 text-center">Routing Status</th>
                <th className="py-2.5 px-4 text-center">3-Pass Consistency</th>
                <th className="py-2.5 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BENCHMARK_CASES.map((tc) => {
                const evalItem = results?.find(r => r.id === tc.id);
                const gtAgency = MSO_AGENCIES[tc.ground_truth_agency as AgencyCode] || MSO_AGENCIES.OUT_OF_PURVIEW;
                const predAgency = evalItem ? (MSO_AGENCIES[evalItem.predictedAgency as AgencyCode] || MSO_AGENCIES.OUT_OF_PURVIEW) : null;

                return (
                  <tr key={tc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {tc.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tc.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tc.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${gtAgency.badgeColor}`}>
                        {gtAgency.shortName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {evalItem && predAgency ? (
                        <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${predAgency.badgeColor}`}>
                          {predAgency.shortName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending run...</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {evalItem ? (
                        evalItem.routingPass ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" /> FAIL
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {evalItem?.consistencyPass !== undefined ? (
                        evalItem.consistencyPass ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200" title={`Runs: ${evalItem.consistencyRuns?.join(', ')}`}>
                            <CheckCircle2 className="w-3 h-3" /> 3/3 MATCH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" title={`Runs: ${evalItem.consistencyRuns?.join(', ')}`}>
                            <AlertTriangle className="w-3 h-3" /> VARIES
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {evalItem ? `${evalItem.latencyMs}ms` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
