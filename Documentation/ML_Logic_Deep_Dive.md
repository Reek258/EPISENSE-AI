# ML Logic Deep Dive: The Mathematical Reasoning of EPISENCE

This document explains the specific logic, formulas, and epidemiological reasoning behind the features and algorithms used in the model.

---

## 1. Feature Engineering Logic: Transforming Raw Data into Signal

### A. EWMA (Exponential Weighted Moving Average)
**Formula**: $EWMA_t = \alpha \cdot X_t + (1 - \alpha) EWMA_{t-1}$
*   **How it's implemented**: `df.ewm(span=7).mean()`
*   **The Logic**: Outbreaks of diseases like Dengue grow exponentially. A standard Simple Moving Average (SMA) treats 7 days ago and today with equal importance. EWMA gives **exponentially more weight** to the most recent days.
*   **Why it works**: It allows the model to detect a "steepening curve" (an outbreak) much faster than a standard average, which would be "lagged" by older, lower numbers.

### B. Heat-Humidity Interaction Index
**Formula**: $Index = Temperature \times Humidity$
*   **How it's implemented**: `df['temp'] * df['humidity']`
*   **The Logic**: Mosquitoes (vectors) do not react to temperature and humidity in isolation. High heat with 0% humidity (desert) kills mosquitoes; high humidity with 0°C (tundra) kills them too.
*   **Why it works**: By multiplying them, we create a feature that only "spikes" when **both** conditions are optimal for breeding. This interaction term is a much stronger predictor than the two variables used separately.

### C. Incubation-Based Lags (7d & 14d)
**Logic**: The incubation period for Dengue is typically 4–10 days. 
*   **How it's implemented**: `.shift(7)` and `.shift(14)`
*   **Why it works**: A spike in mosquitoes today won't show up in hospital records for at least 7 days. By lagging the case counts, we align the "cause" (weather) with the "effect" (hospital admissions) in the model's training timeline.

---

## 2. Algorithmic Logic: Why Gradient Boosting?

### A. Residual-Based Learning
**Logic**: Unlike Random Forest (which averages trees), Gradient Boosting builds trees **sequentially**. 
*   Tree 1 tries to predict the Risk Score.
*   Tree 2 tries to predict the **error (residual)** of Tree 1.
*   Tree 3 tries to predict the error of Tree 2.
*   **Benefit**: This makes the model extremely aggressive at correcting small errors, leading to much higher precision in complex, non-linear epidemiological patterns.

### B. Huber Loss: The "Robust" Guardrail
**Logic**: Standard regression uses MSE (Mean Squared Error), which squares the error ($E^2$). This means an outlier (a single massive reporting error) can wildly distort the entire model.
*   **How it's implemented**: `loss='huber'`
*   **The Math**: Huber loss is quadratic ($E^2$) for small errors but **linear** ($|E|$) for large errors. 
*   **Why it works**: In epidemiology, hospital data is often "noisy" (missing reports one day, a massive dump the next). Huber loss treats these massive spikes as "less important" than the consistent small trends, preventing the model from overreacting to bad data.

---

## 3. Validation Logic: Eliminating "Look-Ahead Bias"

### TimeSeriesSplit vs. K-Fold
**The Logic**: In a standard K-Fold split, you might train on data from 2024 to predict 2023. In the real world, this is impossible. This is called **Look-Ahead Bias**.
*   **Implementation**: `TimeSeriesSplit(n_splits=5)`
*   **The Logic**: We only ever train on $[t_0, t_n]$ to predict $[t_{n+1}]$. 
*   **Why it works**: This is the only way to get an "honest" accuracy score. If the model can't predict the next month using the previous six, it's not ready for production.

---

## 4. Forecasting Logic: The "Risk Window"
**Logic**: The `composite_score` is shifted backwards by 7 days.
*   **How**: `df['target'] = df['score'].shift(-7)`
*   **The Logic**: This forces the model to find patterns *today* that correlate with the risk *next week*. This 7-day "horizon" is selected to give health officials enough time to deploy mosquito fogging or alert hospitals before the peak arrives.
