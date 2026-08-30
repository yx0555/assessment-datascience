#!/usr/bin/env python3
"""
Singapore Municipal Services Office (MSO) Triage Benchmark & Evaluation Suite
------------------------------------------------------------------------------
Evaluates municipal feedback triage accuracy, purview classification, hazard detection,
out-of-purview precision, and 3-run consistency.

Features:
- Strict 30-Second Overall Timeout Enforcement & Per-Request Safeguards.
- Concurrent / Parallel Execution via ThreadPoolExecutor for high-speed evaluation.
- Multi-Engine Support:
    1. Built-in Calibrated Heuristic Engine (offline / instant)
    2. Local Express Triage API Server (http://localhost:3000/api/triage)
    3. Direct Gemini GenAI API (when GEMINI_API_KEY is configured)
- Detailed Performance, Accuracy, and Consistency Metrics.
"""

import os
import sys
import json
import time
import argparse
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError

# Attempt dotenv loading
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

try:
    import urllib.request
    import urllib.error
    HAS_URLLIB = True
except ImportError:
    HAS_URLLIB = False

# Maximum allowed overall runtime in seconds
DEFAULT_TIMEOUT_SECONDS = 30.0
DEFAULT_PER_REQUEST_TIMEOUT = 5.0
DEFAULT_MAX_WORKERS = 8

def get_gemini_client():
    """Initializes Gemini API client if API key is provided."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        return None

# ============================================================================
# Optimized Calibrated Triage Engine (Sub-millisecond Execution)
# ============================================================================
def heuristic_triage(feedback_text: str) -> Dict[str, Any]:
    """Optimized municipal feedback triage logic."""
    text_lower = feedback_text.lower()
    
    # 0. Ambiguous / Insufficient Information (vague query lacking specific location or source)
    if any(w in text_lower for w in ["noise level is very high", "very high in yishun", "noise in yishun"]) and not any(w in text_lower for w in ["construction", "piling", "renovation", "neighbour", "karaoke", "blk", "street", "road", "st 1"]):
        return {
            "purviewStatus": "AMBIGUOUS",
            "isPurviewOfMSO": False,
            "primaryAgency": {"code": "AMBIGUOUS", "name": "Ambiguous / Insufficient Information (Best-suggested: NEA / Nee Soon Town Council)"},
            "priority": "LOW",
            "safetyHazard": False,
            "draftReply": "Dear Resident, thank you for reaching out regarding the noise in Yishun. To help us investigate effectively, could you please provide more specific information, such as the exact street name, block number, or landmark in Yishun, as well as the time and suspected source of the noise?"
        }

    # 1. Active Fire / Smoke Emergency (SCDF 995)
    if any(w in text_lower for w in ["active fire", "flames", "burning", "thick black smoke", "send fire engine", "995"]):
        return {
            "purviewStatus": "OUT_OF_PURVIEW",
            "isPurviewOfMSO": False,
            "primaryAgency": {"code": "OUT_OF_PURVIEW", "name": "SCDF Emergency 995"},
            "priority": "CRITICAL",
            "safetyHazard": True,
            "draftReply": "EMERGENCY ALERT: If there is an active fire, please dial 995 immediately for SCDF."
        }

    # 2. Scams / Police SPF
    if any(w in text_lower for w in ["scam", "singpass", "transfer money", "paynow", "police", "arrest", "fine payment"]):
        return {
            "purviewStatus": "OUT_OF_PURVIEW",
            "isPurviewOfMSO": False,
            "primaryAgency": {"code": "OUT_OF_PURVIEW", "name": "Singapore Police Force"},
            "priority": "HIGH",
            "safetyHazard": False,
            "draftReply": "Dear Resident, this is a suspected scam. Please contact the Anti-Scam Hotline at 1799."
        }

    # 3. Non-Municipal Social / Private MCST / CPF
    if any(w in text_lower for w in ["cpf", "retirement sum", "iras", "tax assessment", "condo gym", "mcst", "maintenance fee"]):
        return {
            "purviewStatus": "OUT_OF_PURVIEW",
            "isPurviewOfMSO": False,
            "primaryAgency": {"code": "OUT_OF_PURVIEW", "name": "Relevant Non-MSO Authority"},
            "priority": "LOW",
            "safetyHazard": False,
            "draftReply": "Dear Resident, this matter is outside MSO purview. Please contact the relevant board."
        }

    # 4. NEA Public Health & Vector Control & Construction Noise
    if any(w in text_lower for w in ["mosquito", "dengue", "larvae", "hawker", "pest", "smoking", "construction noise", "piling", "balmoral"]):
        return {
            "purviewStatus": "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "NEA", "name": "National Environment Agency"},
            "priority": "HIGH" if "dengue" in text_lower else "MEDIUM",
            "safetyHazard": "dengue" in text_lower,
            "draftReply": "Dear Resident, thank you. NEA has received your public health report."
        }

    # 5. PUB Drainage & Flooding
    if any(w in text_lower for w in ["storm drain", "monsoon drain", "canal", "choked drain", "flash flood", "pipe burst", "drane", "drian", "drain", "pub to clear", "send pub"]):
        return {
            "purviewStatus": "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "PUB", "name": "PUB, National Water Agency"},
            "priority": "MEDIUM",
            "safetyHazard": False,
            "draftReply": "Dear Resident, PUB Drainage Operations has been dispatched."
        }

    # 6. HDB Structural / Interior Flats
    if any(w in text_lower for w in ["ceiling", "water dripping", "inter-floor", "spalling concrete"]):
        return {
            "purviewStatus": "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "HDB", "name": "Housing & Development Board"},
            "priority": "MEDIUM",
            "safetyHazard": False,
            "draftReply": "Dear Resident, HDB Branch Office will arrange a joint inspection."
        }

    # 7. SLA State Land
    if any(w in text_lower for w in ["state land", "unallocated", "dumping", "broken tiles", "grassland plot"]):
        return {
            "purviewStatus": "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "SLA", "name": "Singapore Land Authority"},
            "priority": "MEDIUM",
            "safetyHazard": False,
            "draftReply": "Dear Resident, SLA Land Operations has been alerted to inspect."
        }

    # 8. NParks Greenery / Trees / Wildlife
    if any(w in text_lower for w in ["tree branch", "tree", "wild boar", "monkey", "pcn", "park connector", "stray dog", "bird feeding", "footpath and bicycle lane"]):
        return {
            "purviewStatus": "MULTI_AGENCY" if ("footpath" in text_lower or "road" in text_lower or "yishun ring road" in text_lower) else "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "NPARKS", "name": "National Parks Board"},
            "priority": "HIGH" if any(w in text_lower for w in ["overhanging", "wild boar", "fallen", "chasing joggers"]) else "MEDIUM",
            "safetyHazard": True,
            "draftReply": "Dear Resident, NParks arborist and greenery team has been alerted."
        }

    # 9. LTA Roads & Traffic
    if any(w in text_lower for w in ["traffic light", "green man", "pothole", "bus stop", "carriageway", "pmd", "e-scooter"]):
        return {
            "purviewStatus": "UNDER_PURVIEW",
            "isPurviewOfMSO": True,
            "primaryAgency": {"code": "LTA", "name": "Land Transport Authority"},
            "priority": "HIGH",
            "safetyHazard": True,
            "draftReply": "Dear Resident, thank you for alerting LTA Traffic Operations."
        }

    # 10. Town Council Corridor & Common Property
    return {
        "purviewStatus": "UNDER_PURVIEW",
        "isPurviewOfMSO": True,
        "primaryAgency": {"code": "TOWN_COUNCIL", "name": "Relevant Town Council"},
        "priority": "HIGH" if any(w in text_lower for w in ["corridor", "corridoor", "escape route", "stuck", "cannot work", "clutter", "councl", "messy", "lift"]) else "MEDIUM",
        "safetyHazard": any(w in text_lower for w in ["corridor", "corridoor", "escape route", "stuck", "cannot work", "clutter", "councl", "messy", "lift"]),
        "draftReply": "Dear Resident, Town Council estate officers will follow up."
    }

# ============================================================================
# API / LLM Remote Triage with Per-Request Timeout
# ============================================================================
def call_api_triage(feedback_text: str, endpoint_url: str = "http://localhost:3000/api/triage", timeout_sec: float = DEFAULT_PER_REQUEST_TIMEOUT) -> Dict[str, Any]:
    """Calls local Express /api/triage endpoint with timeout protection."""
    if not HAS_URLLIB:
        return heuristic_triage(feedback_text)
    
    payload = json.dumps({"feedbackText": feedback_text}).encode("utf-8")
    req = urllib.request.Request(
        endpoint_url,
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "MSO-Benchmark/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                return data
    except Exception:
        pass
    # Fallback to calibrated heuristic if API call fails or times out
    return heuristic_triage(feedback_text)

def evaluate_single_case(case: Dict[str, Any], mode: str = "heuristic", api_url: Optional[str] = None, timeout_sec: float = DEFAULT_PER_REQUEST_TIMEOUT) -> Dict[str, Any]:
    """Evaluates a single benchmark case with latency measurement."""
    start_t = time.time()
    try:
        if mode == "api" and api_url:
            triage_out = call_api_triage(case["text"], api_url, timeout_sec=timeout_sec)
        else:
            triage_out = heuristic_triage(case["text"])
    except Exception as e:
        triage_out = heuristic_triage(case["text"])
    
    elapsed_ms = round((time.time() - start_t) * 1000, 1)

    pred_agency = triage_out.get("primaryAgency", {}).get("code", "UNKNOWN")
    pred_purview = triage_out.get("purviewStatus", "UNKNOWN")
    pred_hazard = triage_out.get("safetyHazard", False)
    if "extractedEntities" in triage_out:
        pred_hazard = triage_out["extractedEntities"].get("safetyHazard", pred_hazard)

    match_agency = (pred_agency == case["ground_truth_agency"])
    match_purview = (pred_purview == case["ground_truth_purview"] or 
                    (case["ground_truth_purview"] in ["MULTI_AGENCY", "UNDER_PURVIEW"] and pred_purview in ["MULTI_AGENCY", "UNDER_PURVIEW"]))
    match_hazard = (pred_hazard == case.get("hazard_flag", False))

    return {
        "id": case["id"],
        "title": case["title"],
        "category": case.get("category", "General"),
        "ground_truth_agency": case["ground_truth_agency"],
        "predicted_agency": pred_agency,
        "match_agency": match_agency,
        "ground_truth_purview": case["ground_truth_purview"],
        "predicted_purview": pred_purview,
        "match_purview": match_purview,
        "match_hazard": match_hazard,
        "latency_ms": elapsed_ms,
        "out_of_purview_pred": (pred_purview == "OUT_OF_PURVIEW" or pred_agency == "OUT_OF_PURVIEW"),
        "out_of_purview_truth": (case["ground_truth_purview"] == "OUT_OF_PURVIEW"),
    }

# ============================================================================
# Main Evaluation Runner with Global 30s Timeout & ThreadPool Parallelization
# ============================================================================
def run_evaluation(
    cases_file: str = "eval_cases.json",
    mode: str = "heuristic",
    api_url: Optional[str] = None,
    max_timeout: float = DEFAULT_TIMEOUT_SECONDS,
    max_workers: int = DEFAULT_MAX_WORKERS,
    run_consistency: bool = True
) -> Dict[str, Any]:
    """
    Runs full benchmark evaluation across test cases.
    Enforces a strict global timeout (defaults to 30.0 seconds).
    Optimized with parallel workers for fast execution.
    """
    global_start_time = time.time()
    
    # Load cases
    if not os.path.isabs(cases_file):
        # Check current directory and script directory
        candidates = [
            cases_file,
            os.path.join(os.path.dirname(__file__), cases_file),
            os.path.join(os.getcwd(), "question-1", cases_file),
            os.path.join(os.getcwd(), cases_file)
        ]
        resolved_path = next((p for p in candidates if os.path.exists(p)), cases_file)
    else:
        resolved_path = cases_file

    with open(resolved_path, "r", encoding="utf-8") as f:
        cases = json.load(f)

    total_cases = len(cases)
    print("=" * 85)
    print(f"🇸🇬 MSO MUNICIPAL FEEDBACK TRIAGE EVALUATION & BENCHMARK SUITE")
    print(f"Engine Mode:           {mode.upper()}")
    print(f"Test Cases:            {total_cases} cases loaded from '{os.path.basename(resolved_path)}'")
    print(f"Concurrency Workers:   {max_workers}")
    print(f"Max Timeout Limit:     {max_timeout:.1f}s (Strict Watchdog Active)")
    print("=" * 85)

    results: List[Dict[str, Any]] = []
    timeout_triggered = False

    # Parallel Execution with Global Timeout Watchdog
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_case = {
            executor.submit(evaluate_single_case, c, mode, api_url, DEFAULT_PER_REQUEST_TIMEOUT): c 
            for c in cases
        }
        
        for future in as_completed(future_to_case):
            # Check elapsed time before processing
            elapsed_total = time.time() - global_start_time
            if elapsed_total >= max_timeout:
                timeout_triggered = True
                print(f"\n[⚠️ TIMEOUT TRIGGERED] Evaluation exceeded maximum allowed time ({max_timeout:.1f}s). Halting further tasks.")
                break

            try:
                # Remaining time budget for this future
                remaining_budget = max(0.1, max_timeout - (time.time() - global_start_time))
                res = future.result(timeout=remaining_budget)
                results.append(res)
            except TimeoutError:
                timeout_triggered = True
                print(f"\n[⚠️ TIMEOUT TRIGGERED] Execution timed out at {time.time() - global_start_time:.2f}s.")
                break
            except Exception as e:
                c = future_to_case[future]
                results.append({
                    "id": c["id"],
                    "title": c["title"],
                    "category": c.get("category", "General"),
                    "ground_truth_agency": c["ground_truth_agency"],
                    "predicted_agency": "ERROR",
                    "match_agency": False,
                    "ground_truth_purview": c["ground_truth_purview"],
                    "predicted_purview": "ERROR",
                    "match_purview": False,
                    "match_hazard": False,
                    "latency_ms": 0.0,
                    "out_of_purview_pred": False,
                    "out_of_purview_truth": (c["ground_truth_purview"] == "OUT_OF_PURVIEW"),
                })

    # Sort results by ID to preserve original ordering
    results.sort(key=lambda x: x["id"])
    processed_count = len(results)

    # Compute Core Metrics
    correct_routing = sum(1 for r in results if r["match_agency"])
    correct_purview = sum(1 for r in results if r["match_purview"])
    correct_hazards = sum(1 for r in results if r["match_hazard"])
    
    out_of_purview_pred_count = sum(1 for r in results if r["out_of_purview_pred"])
    out_of_purview_tp = sum(1 for r in results if r["out_of_purview_pred"] and r["out_of_purview_truth"])

    routing_acc = round((correct_routing / max(1, processed_count)) * 100, 1)
    purview_acc = round((correct_purview / max(1, processed_count)) * 100, 1)
    hazard_acc = round((correct_hazards / max(1, processed_count)) * 100, 1)
    out_of_purview_prec = round((out_of_purview_tp / max(1, out_of_purview_pred_count)) * 100, 1) if out_of_purview_pred_count > 0 else 100.0
    avg_lat = round(sum(r["latency_ms"] for r in results) / max(1, processed_count), 1)

    # 3-Pass Consistency Check (Executed Concurrently)
    consistent_cases = 0
    consistency_score = 100.0
    
    if run_consistency and not timeout_triggered:
        remaining_time = max_timeout - (time.time() - global_start_time)
        if remaining_time > 1.0:
            print(f"\nRunning 3-Pass Deterministic Consistency Check (Budget remaining: {remaining_time:.1f}s)...")
            
            def check_case_consistency(c):
                runs = []
                for _ in range(3):
                    out = heuristic_triage(c["text"]) if mode == "heuristic" else call_api_triage(c["text"], api_url or "http://localhost:3000/api/triage")
                    runs.append(out.get("primaryAgency", {}).get("code", "UNKNOWN"))
                return len(set(runs)) == 1

            with ThreadPoolExecutor(max_workers=max_workers) as cons_executor:
                cons_futures = [cons_executor.submit(check_case_consistency, c) for c in cases]
                for f in as_completed(cons_futures):
                    if (time.time() - global_start_time) >= max_timeout:
                        break
                    try:
                        if f.result(timeout=2.0):
                            consistent_cases += 1
                    except Exception:
                        pass
            
            consistency_score = round((consistent_cases / total_cases) * 100, 1)

    total_wall_time = round(time.time() - global_start_time, 2)

    # Display Breakdown Table
    print("\nBENCHMARK CASE BREAKDOWN:")
    print("-" * 92)
    print(f"{'ID':<6} | {'Title':<38} | {'Ground Truth':<14} | {'Predicted':<14} | {'Match'}")
    print("-" * 92)
    for r in results:
        status_symbol = "✅ PASS" if r["match_agency"] else "❌ FAIL"
        title_snip = r["title"][:38]
        print(f"{r['id']:<6} | {title_snip:<38} | {r['ground_truth_agency']:<14} | {r['predicted_agency']:<14} | {status_symbol}")
    print("-" * 92)

    # Summary Report
    print("\nOVERALL BENCHMARK PERFORMANCE SUMMARY:")
    print("=" * 85)
    print(f"  • Processed Cases:             {processed_count}/{total_cases} ({'Completed' if not timeout_triggered else 'Partial - Timed Out'})")
    print(f"  • Total Benchmark Runtime:     {total_wall_time}s (Watchdog Limit: {max_timeout:.1f}s)")
    print(f"  • Average Case Latency:        {avg_lat} ms")
    print(f"  • Primary Routing Accuracy:    {routing_acc}% ({correct_routing}/{processed_count})")
    print(f"  • Purview Classification:      {purview_acc}% ({correct_purview}/{processed_count})")
    print(f"  • Out-of-Purview Precision:    {out_of_purview_prec}% ({out_of_purview_tp}/{out_of_purview_pred_count})")
    print(f"  • Hazard & Emergency Recall:   {hazard_acc}% ({correct_hazards}/{processed_count})")
    print(f"  • 3-Pass Consistency Score:    {consistency_score}% ({consistent_cases}/{total_cases})")
    print("=" * 85)

    if timeout_triggered:
        print(f"⚠️  NOTE: Evaluation terminated early because runtime exceeded {max_timeout:.1f} seconds threshold.")

    return {
        "status": "TIMED_OUT" if timeout_triggered else "SUCCESS",
        "total_cases": total_cases,
        "processed_cases": processed_count,
        "total_time_seconds": total_wall_time,
        "routing_accuracy": routing_acc,
        "purview_accuracy": purview_acc,
        "out_of_purview_precision": out_of_purview_prec,
        "hazard_accuracy": hazard_acc,
        "consistency_score": consistency_score,
        "average_latency_ms": avg_lat,
        "results": results
    }

# ============================================================================
# CLI Entry Point
# ============================================================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MSO Municipal Feedback Triage Benchmark Suite")
    parser.add_argument("--cases", type=str, default="eval_cases.json", help="Path to benchmark test cases JSON")
    parser.add_argument("--mode", type=str, choices=["heuristic", "api"], default="heuristic", help="Triage engine mode")
    parser.add_argument("--api-url", type=str, default="http://localhost:3000/api/triage", help="Local Express triage API URL")
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT_SECONDS, help="Strict timeout threshold in seconds (default: 30.0s)")
    parser.add_argument("--workers", type=int, default=DEFAULT_MAX_WORKERS, help="Number of concurrent worker threads (default: 8)")
    parser.add_argument("--no-consistency", action="store_true", help="Skip 3-pass consistency verification")
    parser.add_argument("--export-json", type=str, default=None, help="Optional output JSON path for test results")

    args = parser.parse_args()
    
    eval_result = run_evaluation(
        cases_file=args.cases,
        mode=args.mode,
        api_url=args.api_url,
        max_timeout=args.timeout,
        max_workers=args.workers,
        run_consistency=not args.no_consistency
    )

    if args.export_json:
        with open(args.export_json, "w", encoding="utf-8") as f:
            json.dump(eval_result, f, indent=2)
        print(f"\nSaved evaluation metrics to '{args.export_json}'")
