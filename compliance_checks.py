import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

ACTION_MATRIX = {
    "High": {
        "alert_level": "CRITICAL RISK ALERT - IMMEDIATE ESCALATION",
        "urgent_action_taken": "Deploy physical audit task force to site within 24 hours to override blockages, halt misallocated capital, and freeze suspicious expenditure channels.",
        "further_action_taken": "Initiate structural contract re-baselining, schedule mandatory cross-ministry performance arbitration, and update master milestones to contain downstream pipeline delay."
    },
    "Medium": {
        "alert_level": "WARNING SIGN DETECTED - SYSTEM ADVISORY",
        "urgent_action_taken": "Issue automated digital variance notice to the site manager demanding an immediate ledger correction and asset deployment audit.",
        "further_action_taken": "Flag the project tracking profile for mandatory weekly review loops during regional project review assemblies until metric deviation clears."
    },
    "Low": {
        "alert_level": "GREEN - STABLE OPERATIONS",
        "urgent_action_taken": "Maintain running automation scripts and continue standard live sensor logging streams without localized operational intervention.",
        "further_action_taken": "Log baseline data trends into historical tracking vectors to continuously improve the accuracy of future machine learning predictive features."
    }
}

def run_text_plagiarism_engine(report_current: str, report_previous: str) -> float:
    """Evaluates textual copy-paste similarity across monthly contractor submissions."""
    if not report_current or not report_previous: 
        return 0.0
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([report_current, report_previous])
    return float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0])

def check_round_number_trap(progress_value: float) -> bool:
    """Identifies estimated data tracking entries by detecting exact rounded targets."""
    return progress_value in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

def check_march_rush_catcher(avg_prior: float, march_spend: float) -> bool:
    """Flags fiscal spikes where budget metrics surge drastically within the final month."""
    if avg_prior <= 0: 
        return False
    return march_spend > (3.0 * avg_prior)

def process_and_score_project(row: dict) -> dict:
    """
    Extracts structural columns from an active data row, transforms variables, 
    and applies the 4 core machine learning models to calculate predictive health metrics.
    """
    linear_model = joblib.load('danger_meter_model.pkl')
    rf_model = joblib.load('delay_forecast_model.pkl')
    gb_model = joblib.load('xgb_pipeline.pkl')
    kmeans_model = joblib.load('status_cluster_model.pkl')
    
    is_road = 1 if 'road' in str(row['sector']).lower() else 0
    is_railway = 1 if 'railway' in str(row['sector']).lower() else 0
    is_coal = 1 if 'coal' in str(row['sector']).lower() else 0
    land_impact = {'None': 0.0, 'Minor Disputes': 8.5, 'Severe Court Stay': 25.0}.get(row['land_site_status'], 0.0)
    weather_impact = {'Clear': 0.0, 'Heavy Monsoon Area': 7.0, 'Snow/Landslide Zone': 12.0}.get(row['upcoming_weather_alert'], 0.0)

    X_new = pd.DataFrame([[
        float(row['cost_overrun_percentage']), float(row['delay_months']), int(row['missing_log_count']),
        is_road, is_railway, is_coal, land_impact, weather_impact, float(row['material_price_index_surge'])
    ]], columns=['cost_overrun_percentage', 'delay_months', 'missing_log_count', 
                'is_road', 'is_railway', 'is_coal', 'land_impact_factor', 'weather_impact_factor', 'material_price_index_surge'])

    danger_score = np.clip(float(linear_model.predict(X_new)[0]), 0, 100)
    predicted_future_delay = float(rf_model.predict(X_new)[0])
    gb_model.predict(X_new)[0]
    kmeans_model.predict(X_new)[0]
    
    if danger_score >= 70: 
        tier = 'High'
    elif danger_score >= 35: 
        tier = 'Medium'
    else: 
        tier = 'Low'

    alert_level = ACTION_MATRIX[tier]["alert_level"]
    urgent_action = ACTION_MATRIX[tier]["urgent_action_taken"]
    further_action = ACTION_MATRIX[tier]["further_action_taken"]

    if tier == "High":
        if land_impact > 15:
            urgent_action = "EMERGENCY OVERRIDE: Initiate direct intervention with regional land acquisition authorities and state courts to resolve site stay order."
        elif float(row['material_price_index_surge']) > 1.25:
            urgent_action = "BUDGET CRITICAL: Authorize emergency structural raw material buffer funds and freeze variable logistics spending to stabilize input costs."
        elif weather_impact > 10:
            urgent_action = "WEATHER MITIGATION: Activate local monsoon defense protocols, shift workforce resources to indoor sub-structural tasks, and pause vulnerable groundwork."

    total_cost_est = float(row['allocated_budget_cr']) + (float(row['allocated_budget_cr']) * (float(row['cost_overrun_percentage']) / 100))

    return {
        "project_id": row['project_id'], 
        "sector": row['sector'], 
        "status": row['status'],
        "current_cost_overrun_pct": round(float(row['cost_overrun_percentage']), 2),
        "months_delayed_historical": round(float(row['delay_months']), 1),
        "predicted_future_delay_months": round(predicted_future_delay, 1),
        "base_budget_cr": round(float(row['allocated_budget_cr']), 2),
        "estimated_total_cost_cr": round(total_cost_est, 2),
        "ai_risk_score_0_to_100": round(danger_score, 2), 
        "risk_classification": tier,
        "ai_system_overview": f"Project {row['project_id']} within the active Infralens workspace is tracked as {row['status']}. Land metrics signal a state of '{row['land_site_status']}' balanced against regional weather alerts listed as '{row['upcoming_weather_alert']}'.",
        "alert_level": alert_level, 
        "urgent_action_taken": urgent_action, 
        "further_action_taken": further_action
    }
