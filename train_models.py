import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.cluster import KMeans

# CONFIGURATION ARCHITECTURE SPECIFICATION
csv_file_name = None  

print("Initializing Ingestion Protocol and Training Core Infralens ML Architecture...")

if csv_file_name is not None:
    df_db = pd.read_csv(csv_file_name)
    print(f"Data file successfully loaded from repository path: {csv_file_name}")
else:
    print("Primary database path empty. Executing data synthesis framework for 1981 project records...")
    np.random.seed(42)
    n_samples = 1981
    sectors = np.random.choice(['Road (MoRTH)', 'Railway', 'Coal'], size=n_samples, p=[0.34, 0.33, 0.33])
    project_status = np.random.choice(['Completed', 'Ongoing', 'Delayed'], size=n_samples, p=[0.20, 0.50, 0.30])
    land_issues = np.random.choice(['None', 'Minor Disputes', 'Severe Court Stay'], size=n_samples, p=[0.60, 0.25, 0.15])
    weather_risk = np.random.choice(['Clear', 'Heavy Monsoon Area', 'Snow/Landslide Zone'], size=n_samples, p=[0.70, 0.20, 0.10])

    production_database = {
        'project_id': [f"PRJ-{str(i).zfill(4)}" for i in range(1, n_samples + 1)],
        'sector': sectors,
        'status': project_status,
        'allocated_budget_cr': np.random.uniform(100, 8000, n_samples),
        'march_expenditure_cr': np.random.uniform(5, 500, n_samples),
        'avg_monthly_expenditure_cr': np.random.uniform(5, 100, n_samples),
        'cost_overrun_percentage': np.random.uniform(0, 120, n_samples),
        'delay_months': np.random.uniform(0, 48, n_samples),
        'missing_log_count': np.random.randint(0, 15, n_samples),
        'reported_physical_progress': np.random.choice([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], size=n_samples),
        'material_price_index_surge': np.random.uniform(1.0, 1.45, n_samples), 
        'land_site_status': land_issues,
        'upcoming_weather_alert': weather_risk,
        'avg_prior_spend': np.random.uniform(10, 80, n_samples),
        'march_spend': np.random.uniform(10, 350, n_samples),
        'current_report': ["Work is proceeding normally as scheduled."] * n_samples,
        'previous_report': ["Work is proceeding normally as scheduled."] * n_samples
    }
    df_db = pd.DataFrame(production_database)

# FEATURE ENGINEERING AND VECTOR CONVERSIONS
df_db['is_road'] = (df_db['sector'].str.contains('Road', case=False)).astype(int)
df_db['is_railway'] = (df_db['sector'].str.contains('Railway', case=False)).astype(int)
df_db['is_coal'] = (df_db['sector'].str.contains('Coal', case=False)).astype(int)
df_db['land_impact_factor'] = df_db['land_site_status'].map({'None': 0.0, 'Minor Disputes': 8.5, 'Severe Court Stay': 25.0})
df_db['weather_impact_factor'] = df_db['upcoming_weather_alert'].map({'Clear': 0.0, 'Heavy Monsoon Area': 7.0, 'Snow/Landslide Zone': 12.0})

# TARGET CALCULATION EQUATIONS
df_db['danger_score'] = (
    df_db['cost_overrun_percentage'] * 0.25 + 
    df_db['delay_months'] * 1.0 + 
    df_db['missing_log_count'] * 1.5 + 
    df_db['is_road'] * 3.0 +
    df_db['land_impact_factor'] +
    df_db['weather_impact_factor'] +
    (df_db['material_price_index_surge'] - 1.0) * 50.0  
)
df_db['danger_score'] = np.clip(df_db['danger_score'], 0, 100)
df_db['is_critical_failure'] = (df_db['danger_score'] > 75).astype(int)

def assign_risk_tier(score):
    if score >= 70: 
        return 'High'
    elif score >= 35: 
        return 'Medium'
    return 'Low'
df_db['risk_tier'] = df_db['danger_score'].apply(assign_risk_tier)

# CONCURRENT MODEL TRAINING PIPELINES
X = df_db[['cost_overrun_percentage', 'delay_months', 'missing_log_count', 
           'is_road', 'is_railway', 'is_coal', 'land_impact_factor', 'weather_impact_factor', 'material_price_index_surge']]

linear_model = LinearRegression().fit(X, df_db['danger_score'])
rf_model = RandomForestRegressor(n_estimators=50, max_depth=6, random_state=42).fit(X, df_db['delay_months'])
gb_model = GradientBoostingClassifier(max_depth=5, n_estimators=50, random_state=42).fit(X, df_db['is_critical_failure'])
kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10).fit(X)

# BINARY STORAGE EXPORT
joblib.dump(linear_model, 'danger_meter_model.pkl')
joblib.dump(rf_model, 'delay_forecast_model.pkl')
joblib.dump(gb_model, 'xgb_pipeline.pkl')
joblib.dump(kmeans_model, 'status_cluster_model.pkl')

# DATA REPOSITORY STORAGE SYNCHRONIZATION
df_db.to_csv('infralens_production_database.csv', index=False)
print("Serialization complete. Binary files and 'infralens_production_database.csv' successfully exported to workspace.")
