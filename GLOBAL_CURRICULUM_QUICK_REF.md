# Global Curriculum - Quick Reference Card

## Services

### Curriculum Content Service
- **Port**: 8006
- **Purpose**: Generate educational content aligned to international standards
- **Health**: `curl http://localhost:8006/health`

### Localization Service
- **Port**: 8010
- **Purpose**: Translate content to 50+ languages with cultural adaptation
- **Health**: `curl http://localhost:8010/health`

## Quick Start

```powershell
# Start services
docker compose up -d curriculum-content localization redis

# Verify health
curl http://localhost:8006/health
curl http://localhost:8010/health
```

## Common Use Cases

### 1. List All Subjects
```bash
curl http://localhost:8006/v1/subjects
```

### 2. Generate Math Content (US Common Core)
```bash
curl -X POST http://localhost:8006/v1/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "mathematics",
    "grade_level": "grade_5",
    "skill_code": "fractions",
    "difficulty": 0.6,
    "curriculum_system": "us_common_core",
    "count": 3
  }'
```

### 3. Translate to Spanish
```bash
curl -X POST http://localhost:8010/v1/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is 5 + 3?",
    "source_lang": "en",
    "target_lang": "es",
    "subject": "mathematics"
  }'
```

### 4. Adapt for Middle East
```bash
curl -X POST http://localhost:8010/v1/adapt \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "example": "Calculate interest on savings"
    },
    "target_culture": "middle_east",
    "adaptation_level": "moderate"
  }'
```

### 5. Get Cultural Rules
```bash
curl http://localhost:8010/v1/cultural-rules/china
```

## Key Statistics

- **Subjects**: 15+ (Math, Science, ELA, Social Studies, Arts, PE, CS, Health)
- **Languages**: 50+ (including all major world languages)
- **Curricula**: 15+ (US, UK, IB, China, Africa, Middle East, etc.)
- **Regions**: 7+ (Americas, Europe, Asia, Middle East, Africa, etc.)
- **Students**: 1+ billion addressable globally

## Subject Categories

- **STEM**: Math, Biology, Chemistry, Physics, Computer Science
- **Languages**: English, Spanish, French, Chinese, Arabic, 45+ more
- **Social Studies**: History, Geography, Civics, Economics
- **Arts**: Visual Arts, Music
- **Wellness**: Physical Education, Health
- **Technology**: Computer Science, Digital Literacy

## Curriculum Systems Supported

### Americas
- US Common Core, NGSS, State Standards
- Canadian Provincial Standards

### Europe
- UK National Curriculum, GCSE, A-Level
- European Baccalaureate, German Abitur, French Baccalauréat

### International
- IB (PYP, MYP, DP)
- Cambridge International

### Asia
- China National, Gaokao
- Singapore Syllabus
- Japanese Curriculum

### Middle East
- GCC Standards
- Saudi, UAE National Standards

### Africa
- South African CAPS
- WAEC (West Africa)
- Kenyan CBC

## Languages by Region

### Europe (18)
English, German, French, Spanish, Italian, Portuguese, Dutch, Polish, Russian, Ukrainian, Swedish, Norwegian, Danish, Finnish, Greek, Czech, Hungarian, Romanian

### Asia (9)
Chinese (Simplified & Traditional), Japanese, Korean, Vietnamese, Thai, Indonesian, Malay

### Middle East (5)
Arabic, Hebrew, Persian (Farsi), Turkish, Urdu

### Africa (7)
Swahili, Amharic, Hausa, Yoruba, Zulu, Xhosa, Afrikaans

### Americas (4)
English, Spanish, Portuguese, French

### South Asia (6)
Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati

## Cultural Adaptation Regions

1. **Middle East**: Religious sensitivity, Islamic banking, modest examples
2. **China**: Number symbolism (8 lucky, 4 unlucky), collectivism
3. **India**: Religious diversity, vegetarian options, cricket/Bollywood
4. **Africa**: Ubuntu philosophy, oral tradition, offline-friendly
5. **Latin America**: Family-centric, football culture, carnival traditions
6. **US**: Diversity, individualism, secular education
7. **Europe**: Multi-perspective history, metric system, diverse traditions

## API Endpoints Cheat Sheet

### Curriculum Content (8006)
```
GET  /health
GET  /v1/subjects
GET  /v1/curriculum-systems
GET  /v1/standards/{system}/{subject}/{grade}
GET  /v1/skills/{subject}?grade_level={grade}
POST /v1/content/generate
POST /v1/content/align
```

### Localization (8010)
```
GET  /health
GET  /v1/languages
GET  /v1/languages/{region}
GET  /v1/cultural-rules/{culture}
POST /v1/translate
POST /v1/translate/content
POST /v1/adapt
```

## Integration Example

```python
# Generate lesson
lesson = await curriculum_service.generate_lesson(
    subject="mathematics",
    topic="fractions",
    grade="grade_5",
    curriculum="us_common_core",
    language="en"
)

# Translate to Spanish
spanish_lesson = await localization_service.translate_content(
    content=lesson,
    source_lang="en",
    target_lang="es",
    subject="mathematics"
)

# Adapt for Latin America
adapted = await localization_service.adapt_content(
    content=spanish_lesson,
    target_culture="latin_america",
    adaptation_level="moderate"
)

# Deliver to student
await deliver_to_student(student_id, adapted)
```

## Files to Reference

- **Full Documentation**: `GLOBAL_CURRICULUM_ENHANCEMENT.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY_GLOBAL.md`
- **Curriculum Service README**: `services/curriculum-content-svc/README.md` (existing)
- **Localization Service README**: `services/localization-svc/README.md`
- **Subject Registry**: `services/curriculum-content-svc/src/subjects/subject_registry.py`
- **Curriculum Alignment**: `services/curriculum-content-svc/src/standards/curriculum_alignment.py`
- **Localization Main**: `services/localization-svc/src/main.py`

## Troubleshooting

### Services won't start
```powershell
# Check logs
docker compose logs curriculum-content
docker compose logs localization

# Rebuild
docker compose build curriculum-content localization
docker compose up -d
```

### Translation not working
- Check Redis is running: `docker compose ps redis`
- Check language code is valid: `curl http://localhost:8010/v1/languages`

### Standards not found
- Ensure curriculum system name is correct
- List available systems: `curl http://localhost:8006/v1/curriculum-systems`

## Performance Tips

- Translations are cached (1-hour TTL) for speed
- Use batch endpoints when generating multiple items
- Redis should have adequate memory for caching

## Next Steps

1. **Populate Standards Database**: Import 20,000+ educational standards
2. **Expand Terminology**: Add more subject-specific terms
3. **Test with Native Speakers**: Validate translation quality
4. **Build Admin Dashboard**: Content management interface
5. **Launch Pilot Markets**: Start with US, UK, Spain, China

---

**For complete details, see:** `GLOBAL_CURRICULUM_ENHANCEMENT.md`
