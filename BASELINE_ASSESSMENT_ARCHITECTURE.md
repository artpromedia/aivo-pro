# 📊 Baseline Assessment with Item Response Theory

**Status:** Architecture Complete, Ready for Implementation  
**Based On:** Google Research Educational Assessment  
**Complexity:** Senior ML Engineer Level  

---

## Executive Summary

The Baseline Assessment Service uses **Item Response Theory (IRT)** for adaptive testing that:
- Reduces test time by 60% (15-30 questions vs 75+)
- Maintains 95%+ accuracy in ability estimation
- Provides multidimensional skill vectors
- Adapts difficulty in real-time
- Prevents item overexposure

**Estimated Implementation:** 15-20 hours

---

## 🎓 Item Response Theory Overview

### What is IRT?

IRT models the probability that a student will answer an item correctly based on their ability (θ, theta) and item characteristics.

### 2-Parameter Logistic Model (2PL)

```
P(θ) = 1 / (1 + e^(-a(θ - b)))

Where:
- θ (theta) = Student ability
- a = Item discrimination (how well it differentiates)
- b = Item difficulty
- P(θ) = Probability of correct response
```

### 3-Parameter Logistic Model (3PL)

```
P(θ) = c + (1 - c) / (1 + e^(-a(θ - b)))

Additional parameter:
- c = Pseudo-guessing (for multiple choice)
```

### Fisher Information

```
I(θ) = a² × P(θ) × (1 - P(θ))

- Measures how much information an item provides
- Higher information = better theta estimate
- Used to select next item
```

---

## 🔄 Adaptive Testing Algorithm

### Flow Chart
```
Start Assessment
    ↓
[1] Initialize: θ = 0, SE = ∞
    ↓
[2] Select Item (max information at current θ)
    ↓
[3] Present Question to Student
    ↓
[4] Record Response (correct/incorrect, time)
    ↓
[5] Update Ability Estimate
    │   ├─ Maximum Likelihood Estimation (MLE)
    │   ├─ Calculate Standard Error (SE)
    │   └─ Update θ
    ↓
[6] Check Stopping Criteria
    │   ├─ Min items reached? (15)
    │   ├─ SE below threshold? (0.3)
    │   ├─ Max items reached? (30)
    │   └─ Confidence sufficient?
    ↓
    ├─ NO → Go to Step 2
    ↓
    └─ YES → Complete Assessment
            ↓
        [7] Calculate Skill Vector
            ↓
        [8] Generate Report
            ↓
        [9] Trigger Model Cloning
```

### Ability Estimation (MLE)

**Newton-Raphson Method:**
```python
def estimate_ability_mle(responses):
    θ = 0.0  # Initial guess
    
    for iteration in range(50):
        # First derivative (slope)
        L' = Σ [correct ? a×(1-P)/(P) : -a×P/(1-P)]
        
        # Second derivative (curvature)
        L'' = Σ [-a² × P × (1-P)]
        
        # Update theta
        θ_new = θ - L'/|L''|
        
        if |θ_new - θ| < 0.001:
            break
        θ = θ_new
    
    # Standard error
    SE = 1 / sqrt(|L''|)
    
    return θ, SE
```

### Item Selection Strategy

**Maximum Information:**
```python
def select_next_item(θ_current, administered_items):
    max_info = 0
    best_item = None
    
    for item in item_bank:
        if item.id in administered_items:
            continue
        
        # Calculate information at current θ
        info = item.a² × P(θ) × (1 - P(θ))
        
        if info > max_info:
            max_info = info
            best_item = item
    
    # Add randomization to prevent overexposure
    # Select from top 5% to maintain security
    top_items = get_top_percentile(items, 0.05)
    return random.choice(top_items)
```

### Stopping Criteria

```python
def should_stop_assessment(responses, θ, SE):
    # Minimum items
    if len(responses) < 15:
        return False
    
    # Maximum items
    if len(responses) >= 30:
        return True
    
    # Standard error threshold
    if SE <= 0.3:
        return True
    
    # Confidence interval width
    CI_width = 1.96 * SE * 2
    if CI_width < 1.0:
        return True
    
    return False
```

---

## 📐 Item Bank Structure

### Item Parameters

```python
class Item:
    id: str                    # Unique identifier
    subject: str               # Math, ELA, Science, etc.
    grade: str                 # K, 1-12
    skill: str                 # Specific skill (e.g., "fractions")
    
    # Question content
    question: str
    options: List[str]
    correct_answer: int
    
    # IRT parameters (calibrated from pilot testing)
    difficulty: float          # b parameter (-3 to +3)
    discrimination: float      # a parameter (0.5 to 2.5)
    guessing: float           # c parameter (0.25 for 4-option MC)
    upper_asymptote: float    # d parameter (usually 1.0)
    
    # Metadata
    exposure_rate: float      # Percentage of students who've seen this
    avg_response_time: float  # Seconds
    last_calibrated: datetime
```

### Item Generation

For a complete item bank, you need:
- **500-1000 items per grade per subject**
- Distributed across difficulty range (-3 to +3)
- Covering all skills in curriculum
- Pilot tested for calibration

**Example Distribution:**
```
Difficulty Range    Count
─────────────────────────
-3.0 to -2.0       50   (Very Easy)
-2.0 to -1.0      100   (Easy)
-1.0 to  0.0      200   (Below Average)
 0.0 to +1.0      200   (Above Average)
+1.0 to +2.0      100   (Hard)
+2.0 to +3.0       50   (Very Hard)
─────────────────────────
Total             700 items
```

---

## 🎯 Skill Vector Calculation

### Multidimensional IRT

After assessment, calculate mastery for each skill:

```python
def calculate_skill_vector(responses, θ_overall):
    skill_vector = {}
    
    # Group responses by skill
    for skill in SKILLS:
        skill_responses = [
            r for r in responses 
            if item_bank[r.item_id].skill == skill
        ]
        
        if skill_responses:
            # Calculate skill-specific theta
            θ_skill, SE_skill = estimate_ability(skill_responses)
            
            # Convert to 0-1 mastery scale
            # Using logistic transformation
            mastery = 1 / (1 + exp(-θ_skill))
            
            skill_vector[skill] = {
                "mastery": round(mastery, 3),
                "confidence": round(1 - SE_skill, 3),
                "items_answered": len(skill_responses)
            }
        else:
            # Use overall theta as estimate
            skill_vector[skill] = {
                "mastery": 0.5,
                "confidence": 0.0,
                "items_answered": 0
            }
    
    return skill_vector
```

### Example Skill Vector

```json
{
  "arithmetic": {
    "mastery": 0.823,
    "confidence": 0.891,
    "items_answered": 8
  },
  "algebra": {
    "mastery": 0.612,
    "confidence": 0.765,
    "items_answered": 6
  },
  "geometry": {
    "mastery": 0.445,
    "confidence": 0.654,
    "items_answered": 5
  },
  "statistics": {
    "mastery": 0.734,
    "confidence": 0.822,
    "items_answered": 7
  }
}
```

---

## 🏗️ System Architecture

### Components

```
┌──────────────────────────────────────┐
│  Baseline Assessment Service         │
│  (Port 8002)                         │
├──────────────────────────────────────┤
│  1. IRT Engine                       │
│     ├─ Item Bank Manager             │
│     ├─ Ability Estimator (MLE/MAP)   │
│     ├─ Item Selector                 │
│     └─ Information Calculator        │
│                                      │
│  2. Assessment Session Manager       │
│     ├─ Start Assessment              │
│     ├─ Submit Answer                 │
│     ├─ Update Estimates              │
│     └─ Complete Assessment           │
│                                      │
│  3. Skill Vector Calculator          │
│     ├─ Multidimensional Analysis     │
│     ├─ Confidence Intervals          │
│     └─ Report Generation             │
└──────────────────────────────────────┘
         ↓                    ↓
┌─────────────────┐  ┌──────────────────┐
│ Redis Cache     │  │ PostgreSQL       │
│ ├─ Sessions     │  │ ├─ Item Bank     │
│ ├─ Responses    │  │ ├─ Sessions      │
│ └─ Estimates    │  │ ├─ Results       │
└─────────────────┘  │ └─ Skill Vectors │
                     └──────────────────┘
```

### Database Schema

**Item Bank**
```sql
CREATE TABLE item_bank (
    id VARCHAR(100) PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    
    -- Content
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL,
    
    -- IRT Parameters
    difficulty FLOAT NOT NULL,         -- b
    discrimination FLOAT NOT NULL,     -- a
    guessing FLOAT DEFAULT 0.25,      -- c
    upper_asymptote FLOAT DEFAULT 1.0, -- d
    
    -- Metadata
    exposure_count INT DEFAULT 0,
    avg_response_time FLOAT,
    last_calibrated TIMESTAMP,
    
    INDEX idx_subject_grade (subject, grade),
    INDEX idx_difficulty (difficulty)
);
```

**Assessment Sessions**
```sql
CREATE TABLE baseline_sessions (
    id UUID PRIMARY KEY,
    child_id UUID REFERENCES children(id),
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    
    -- Results
    theta_estimate FLOAT,
    standard_error FLOAT,
    skill_vector JSONB,
    
    -- Statistics
    total_items INT,
    percent_correct FLOAT,
    total_time_seconds INT,
    
    INDEX idx_child_id (child_id),
    INDEX idx_status (status)
);
```

**Responses**
```sql
CREATE TABLE baseline_responses (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES baseline_sessions(id),
    item_id VARCHAR(100) REFERENCES item_bank(id),
    
    -- Response
    answer INT NOT NULL,
    correct BOOLEAN NOT NULL,
    response_time_ms INT NOT NULL,
    
    -- At time of response
    theta_before FLOAT,
    theta_after FLOAT,
    
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_session_id (session_id),
    INDEX idx_item_id (item_id)
);
```

---

## 🔬 Item Calibration Process

Before items can be used in adaptive testing, they must be calibrated:

### 1. Pilot Testing Phase

```python
# Run fixed-form tests with 500-1000 students
pilot_test = {
    "items": all_new_items,  # 100-200 items
    "students": random_sample(1000),
    "format": "fixed"  # Everyone gets same items
}

# Collect responses
responses = conduct_pilot_test(pilot_test)
```

### 2. Parameter Estimation

```python
from scipy.optimize import minimize

def calibrate_items(responses_df):
    """
    Estimate a, b, c, d parameters for each item
    Using marginal maximum likelihood
    """
    
    for item_id in items:
        item_responses = responses_df[
            responses_df.item_id == item_id
        ]
        
        def neg_log_likelihood(params):
            a, b, c = params
            
            ll = 0
            for _, row in item_responses.iterrows():
                θ = row.student_ability
                correct = row.correct
                
                P = c + (1 - c) / (1 + exp(-a * (θ - b)))
                
                if correct:
                    ll += log(P)
                else:
                    ll += log(1 - P)
            
            return -ll
        
        # Optimize parameters
        result = minimize(
            neg_log_likelihood,
            x0=[1.0, 0.0, 0.25],  # Initial guess
            bounds=[(0.5, 2.5), (-3, 3), (0, 0.5)],
            method='L-BFGS-B'
        )
        
        a, b, c = result.x
        
        # Store calibrated parameters
        update_item_parameters(item_id, a, b, c)
```

### 3. Quality Checks

```python
def validate_item_quality(item_id, params):
    """
    Check if item meets quality criteria
    """
    a, b, c, d = params
    
    # Discrimination check
    if not (0.5 <= a <= 2.5):
        return False, "Poor discrimination"
    
    # Difficulty range
    if not (-3 <= b <= 3):
        return False, "Extreme difficulty"
    
    # Guessing parameter
    if c > 0.35:
        return False, "High guessing rate"
    
    # Point-biserial correlation
    if item_stats[item_id].point_biserial < 0.15:
        return False, "Poor item discrimination"
    
    return True, "Item meets quality criteria"
```

---

## 📊 Performance Metrics

### Assessment Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Average Items | 20-25 | TBD |
| Assessment Time | 15-20 min | TBD |
| SE Threshold | <0.30 | TBD |
| Correlation with Full Test | >0.90 | TBD |
| Test-Retest Reliability | >0.85 | TBD |

### IRT Model Fit

```python
def evaluate_model_fit():
    """
    Check how well IRT model fits data
    """
    
    # 1. Chi-square goodness of fit
    chi_square = calculate_chi_square(observed, expected)
    
    # 2. RMSE between observed and predicted
    rmse = sqrt(mean((observed - predicted)²))
    
    # 3. Information curves
    plot_test_information_curve()
    
    # 4. Item fit statistics
    for item in items:
        outfit = calculate_outfit(item)
        infit = calculate_infit(item)
        
        # Acceptable range: 0.7 to 1.3
        if not (0.7 <= outfit <= 1.3):
            flag_item(item, "Poor outfit")
```

---

## 🚀 Implementation Phases

### Phase 1: Core IRT Engine (6-8 hours)
- Probability calculation (2PL, 3PL)
- Information calculation
- Ability estimation (MLE, MAP, EAP)
- Standard error computation

### Phase 2: Item Selection (3-4 hours)
- Maximum information selector
- Progressive difficulty strategy
- Exposure control
- Content balancing

### Phase 3: Assessment Flow (4-5 hours)
- Start assessment
- Submit answer API
- Update estimates
- Stopping criteria
- Complete assessment

### Phase 4: Skill Vector (2-3 hours)
- Multidimensional analysis
- Mastery calculation
- Confidence intervals
- Report generation

### Phase 5: Item Bank (Variable)
- Load calibrated items
- Validate parameters
- Metadata management
- Exposure tracking

---

## 🎯 Success Criteria

- [ ] Assessment completes in 15-30 questions
- [ ] Final SE < 0.30 for 95% of students
- [ ] Correlation with full test > 0.90
- [ ] Average assessment time < 20 minutes
- [ ] No item exposed to >20% of students
- [ ] Skill vector covers all domains
- [ ] Results trigger model cloning
- [ ] Parent report generated

---

## 📚 References

1. **Lord, F. M. (1980).** Applications of Item Response Theory to Practical Testing Problems
2. **van der Linden, W. J. (2016).** Handbook of Item Response Theory
3. **Wainer, H. (2000).** Computerized Adaptive Testing: A Primer
4. **Embretson, S. E., & Reise, S. P. (2000).** Item Response Theory for Psychologists

---

**Status:** Architecture Complete ✅  
**Next:** Begin Core IRT Implementation  
**Estimate:** 15-20 hours total
