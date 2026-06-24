# 🦟 EPISENCE — Unified Project Documentation

## Project Overview
**EPISENCE** is a high-fidelity, government-grade epidemiological surveillance and predictive analytics platform. It is designed to empower health officials with real-time insights into disease outbreaks (such as Dengue, Malaria, and Zika) by fusing environmental data, hospital reports, and community-driven indicators.

The platform moves beyond reactive monitoring to **proactive forecasting**, using Machine Learning to predict outbreak risks 7 days in advance.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Command Center)
- **Framework**: React 18 with TypeScript.
- **Styling**: Tailwind CSS v4 with a custom "Institutional Government" design system.
- **State Management**: Zustand (Global state, auth, and real-time updates).
- **Visualization**: 
  - **Leaflet.js**: Interactive geospatial risk heatmaps.
  - **Recharts**: High-density analytical trends and meteorological correlations.
- **Real-time**: WebSocket integration for instant UI updates upon new reports or alerts.

### Backend (Intelligence Hub)
- **Framework**: FastAPI (Python).
- **Data Persistence**: Lightweight JSON-based document store for high-speed prototyping and demo stability.
- **Security**: JWT-based Authentication with secure password hashing.
- **Communication**: 
  - **WebSockets**: Real-time broadcast engine.
  - **Twilio API**: Automated and manual SMS broadcast system for emergency alerts.

### AI/ML Engine
- **Models**: Random Forest Regressor & XGBoost.
- **Forecasting**: 7-day predictive risk scoring based on lag-indicators.
- **Data Engineering**: Automated pipeline for normalizing hospital surges, weather anomalies (Rainfall/Humidity), and community reporting density.

---

## 🚀 Core Features

### 1. Real-Time Surveillance Dashboard
The central command hub providing a birds-eye view of regional health:
- **Risk Heatmap**: Geospatial visualization of ward-level risk using color-coded intensities (Green to Critical Red).
- **Key Metric Ribbon**: Instant access to total active zones, critical alerts, and regional risk averages.
- **Live Alert Feed**: A real-time ticker of system-generated warnings.

### 2. Predictive Analytics Command Center
A deep-dive interface for data-driven decision making:
- **7-Day Outbreak Forecast**: ML-driven predictions of case surges before they happen.
- **Meteorological Correlation**: Side-by-side comparison of rainfall/temperature vs. infection rates.
- **Model Performance Transparency**: Access to feature importance rankings (e.g., showing how much "Humidity" is driving the current risk).

### 3. Community Water Reporting (Citizen Science)
Empowers citizens to act as "first sensors":
- **GPS-Tagged Reporting**: Users can report stagnant water or breeding sites with precise coordinates.
- **Instant Sync**: Reports submitted via the mobile-friendly interface appear on the official dashboard via WebSockets within milliseconds.
- **Severity Ranking**: Helps officials prioritize inspections based on reported risk.

### 4. Emergency SMS Broadcast System
Closing the loop between detection and action:
- **Targeted Alerts**: Ability to send SMS notifications to hospital administrators and field officers.
- **Manual Override**: Decoupled trigger system ensuring alerts are verified by human officials before broadcasting.
- **Twilio Integration**: Enterprise-grade messaging infrastructure.

### 5. Hospital Resource & Case Management
- **Surge Tracking**: Digital logging of daily case counts per disease.
- **Resource Allocation**: Visualization of bed availability and medical stock in relation to predicted outbreaks.
- **Historical Trends**: Long-term data analysis to identify seasonal patterns.

---

## 🧠 The "Hybrid Risk Engine" Logic
EPISENCE uses a unique three-pillar scoring system:
1.  **Environmental Pressure (30%)**: High rainfall + High humidity + Optimal temperature for mosquito breeding.
2.  **Community Density (25%)**: Frequency and severity of "Water Reports" in a specific zone.
3.  **Epidemiological Surge (45%)**: Current hospital admission rates and rate-of-change (velocity) of cases.

**Prediction Output**: A 0-100 normalized risk score, classified into:
- 🟢 **LOW (0-25)**: Routine monitoring.
- 🟡 **MODERATE (26-50)**: Precautionary inspections.
- 🟠 **HIGH (51-75)**: Targeted vector control (spraying/fogging).
- 🔴 **CRITICAL (76-100)**: Emergency broadcast and hospital mobilization.

---

## 🛠️ Developer & Demo Tools
- **Outbreak Simulator**: `demo_outbreak.ps1` script to instantly inject a surge into any zone for live demonstrations.
- **ML Training Suite**: `train_and_report.py` to retrain models and generate accuracy metrics (R², MAE, RMSE).
- **Diagnostic Tools**: Dedicated SMS and configuration debuggers to ensure production readiness.

---
*Created by the EPISENCE Engineering DINKKY SHADANI, PREM BORSE, HARSHADA VARULE*
