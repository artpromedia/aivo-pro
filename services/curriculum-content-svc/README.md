# Curriculum Content Service

## Overview
Comprehensive K-12 educational content management system supporting **all subjects** across **multiple international educational systems**.

## Quick Start

### Start Service
```powershell
docker compose up -d curriculum-content
```

### Health Check
```powershell
curl http://localhost:8006/health
```

## API Endpoints

### 1. Generate Content
```http
POST /v1/content/generate
Content-Type: application/json

{
  "subject": "mathematics",
  "grade_level": "grade_5",
  "skill_code": "fractions_addition",
  "difficulty": 0.6,
  "content_type": "problem",
  "count": 5,
  "curriculum_system": "us_common_core"
}
```

**Response**:
```json
{
  "contents": [
    {
      "id": "uuid",
      "subject": "mathematics",
      "grade_level": "grade_5",
      "difficulty": 0.6,
      "content": {
        "question": "Add 2/3 + 1/4",
        "answer": "11/12",
        "steps": ["Find LCD", "Convert", "Add"],
        "hint": "Common denominator is 12"
      }
    }
  ]
}
```

### 2. List All Subjects
```http
GET /v1/subjects
```

Returns all 40+ subjects organized by category:
- **Core**: Mathematics, Science, English, Social Studies
- **Science**: Biology, Chemistry, Physics, Earth Science
- **Languages**: Spanish, French, Mandarin, Arabic, German, Portuguese, Swahili
- **Arts**: Art, Music, Drama, Literature
- **Technology**: Computer Science, Coding, Robotics
- **Life Skills**: PE, Health, SEL

### 3. List Curriculum Systems
```http
GET /v1/curriculum-systems
```

Returns all 15+ educational systems by region:
- **Americas**: US Common Core, US State Standards, Canadian
- **Europe**: UK National, GCSE, A-Level, European Bacc, German, French
- **International**: IB PYP, IB MYP, IB DP
- **Asia**: Chinese National, Japanese, Singapore
- **Middle East**: GCC, Saudi, UAE
- **Africa**: African Union, South African CAPS, Kenyan CBC, Nigerian

### 4. Get Standards
```http
GET /v1/standards/{system}/{subject}/{grade}
```

Example:
```http
GET /v1/standards/us_common_core/mathematics/grade_5
```

### 5. Get Skills
```http
GET /v1/skills/{subject}?grade_level=grade_5
```

## Supported Content

### Mathematics (K-12)
- **Elementary**: Counting, Addition, Subtraction, Multiplication, Division, Fractions, Decimals, Geometry
- **Middle School**: Ratios, Proportions, Percentages, Pre-Algebra, Statistics
- **High School**: Algebra I/II, Geometry, Trigonometry, Calculus, Statistics

### Science (K-12)
- **Elementary**: Life Science, Physical Science, Earth Science
- **Middle School**: Biology Basics, Chemistry Basics, Physics Basics
- **High School**: Biology, Chemistry, Physics (full courses)

### English/Language Arts (K-12)
- **Reading**: Phonics, Comprehension, Literary Analysis
- **Writing**: Creative, Narrative, Expository, Argumentative
- **Language**: Grammar, Vocabulary, Mechanics

### Social Studies (K-12)
- **History**: US History, World History, Ancient Civilizations
- **Geography**: Physical, Human, World Regions
- **Civics**: Government, Democracy, Rights
- **Economics**: Personal Finance, Micro, Macro

### World Languages
- Spanish, French, Mandarin Chinese, Arabic, German, Portuguese, Swahili

### Arts & Humanities
- Visual Arts, Music, Drama, Literature

### Technology
- Computer Science, Programming, Digital Literacy, Robotics

### Physical Education & Health
- Fitness, Sports, Nutrition, Mental Health

## Database Schema

### Core Tables
- **curriculum_standards**: Standards mapping (CCSS, UK National, IB, etc.)
- **skills**: Atomic learning skills with prerequisites
- **learning_contents**: Content items with IRT parameters
- **lesson_plans**: Structured lesson plans
- **assessment_bank**: Tests, quizzes, assessments
- **subject_scopes**: Scope & sequence documents
- **content_templates**: AI generation templates

### Skill Graph
Skills organized in directed acyclic graph (DAG):
```
addition_single_digit → addition_multi_digit → multiplication_basics
```

## Content Generation Examples

### Mathematics - Fractions
```powershell
Invoke-RestMethod -Uri "http://localhost:8006/v1/content/generate" `
  -Method Post -ContentType "application/json" `
  -Body '{"subject":"mathematics","grade_level":"grade_5","skill_code":"fractions_addition","difficulty":0.6,"count":3}'
```

### Science - Biology
```powershell
Invoke-RestMethod -Uri "http://localhost:8006/v1/content/generate" `
  -Method Post -ContentType "application/json" `
  -Body '{"subject":"biology","grade_level":"grade_10","skill_code":"cell_structure","difficulty":0.5,"count":5}'
```

### English - Grammar
```powershell
Invoke-RestMethod -Uri "http://localhost:8006/v1/content/generate" `
  -Method Post -ContentType "application/json" `
  -Body '{"subject":"english_language_arts","grade_level":"grade_6","skill_code":"grammar_verbs","difficulty":0.4,"count":10}'
```

## Architecture

### Subject Managers
Each subject has dedicated content generation logic:

1. **MathematicsManager**: Addition, multiplication, fractions, algebra, geometry
2. **ScienceManager**: Biology, chemistry, physics
3. **EnglishLanguageArtsManager**: Grammar, vocabulary, reading, writing
4. **SocialStudiesManager**: History, geography, civics, economics
5. **ForeignLanguageManager** (planned): Multi-language support
6. **ArtsManager** (planned): Visual arts, music, drama
7. **CSManager** (planned): Programming, coding
8. **PEManager** (planned): Fitness, health

### Technology Stack
- **Framework**: FastAPI 0.115.0
- **Database**: PostgreSQL + SQLAlchemy
- **Cache**: Redis
- **Search**: Elasticsearch (optional)
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Graph**: Neo4j (for skill dependencies)

## Environment Variables

```env
DATABASE_URL=postgresql+asyncpg://aivo:password@postgres:5432/aivo_curriculum
REDIS_URL=redis://redis:6379/4
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=ant-...

# Subjects
SUBJECTS=math,science,english,social_studies,languages,arts,pe,cs

# Educational Systems
ENABLE_US_COMMON_CORE=true
ENABLE_UK_NATIONAL=true
ENABLE_IB=true
ENABLE_CHINESE_NATIONAL=true
ENABLE_AFRICAN_SYSTEMS=true
ENABLE_MIDDLE_EAST_SYSTEMS=true
```

## Development

### Local Setup
```bash
cd services/curriculum-content-svc
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8006
```

### Run Tests
```bash
pytest tests/
```

### Database Migrations
```bash
alembic upgrade head
```

## Next Steps

### Pending Implementation
1. **Additional Subject Managers** (Languages, Arts, PE, CS)
2. **AI Content Generation** (OpenAI/Anthropic integration)
3. **Skill Graph** (Neo4j implementation)
4. **Standards Population** (Import all curriculum standards)
5. **Content Quality** (Review workflow, scoring)
6. **Localization** (Multi-language translation)

### Content Statistics (Target)
- **Subjects**: 40+
- **Educational Systems**: 15+
- **Skills**: 20,000+
- **Content Items**: 1,000,000+
- **Lesson Plans**: 50,000+
- **Assessments**: 100,000+

### Geographic Coverage
- **North America**: 63 jurisdictions (US states + Canadian provinces)
- **Europe**: 30+ countries
- **Asia**: 10+ countries
- **Middle East**: 6+ countries
- **Africa**: 20+ countries
- **Latin America**: 15+ countries

## Integration

### With Learning Session Service
```python
content = await curriculum_service.generate_content(
    subject="mathematics",
    grade="grade_5",
    skill="fractions_addition",
    difficulty=student_mastery_level
)
```

### With AIVO Brain
```python
curriculum_context = await curriculum_service.get_standards(
    system="us_common_core",
    subject="science",
    grade="grade_7"
)
```

## License
Proprietary - AIVO Learning Platform

## Support
For issues, contact the AIVO development team.

---

**The Curriculum Content Service is the educational foundation of AIVO, providing comprehensive K-12 content across all subjects and international educational systems.**
