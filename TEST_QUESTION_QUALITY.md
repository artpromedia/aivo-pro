# Testing Question Quality

## Issue Found
Questions showing up as "Sample SEL content" with poor options like:
- "All of the above"
- "None of the above"  
- "answer (incorrect)"
- "answer"

This indicates the `generateOptions()` fallback helper is being used, meaning the AI service returned incomplete data.

## Changes Made (Commit 0707a42)

### 1. Enhanced Curriculum-Content-Service Request
Added detailed prompt and validation:
```typescript
const assessmentPrompt = `Create a ${difficulty} ${subject} question for grade ${grade}.

REQUIREMENTS:
- Clear, specific, age-appropriate question
- Exactly 4 multiple choice options
- Only ONE correct option
- Plausible wrong options
- Realistic scenarios for SEL/Speech
- Clear problems for Math
- Context for Reading/ELA
- Grade-appropriate concepts

Format as multiple choice with clear options.`;
```

### 2. Quality Validation
Reject poor responses and fallback to next source:
```typescript
// Validate question
if (question.includes('Sample') || question.length < 10) {
  throw new Error('Invalid question format');
}

// Validate options
if (!options || options.length < 4 || 
    options.includes('answer') || 
    options.includes('All of the above')) {
  throw new Error('Invalid options');
}
```

### 3. LocalAI Enhanced Prompts
Added subject-specific examples:

**SEL Example:**
> "Your friend looks sad at recess. What is the BEST way to show empathy?"
> - "Ask them how they're feeling and listen" ✓
> - "Ignore them and play with someone else"
> - "Tell them to stop being sad"
> - "Laugh to cheer them up"

**Math Example:**
> "Sarah has 12 cookies and wants to share them equally with 3 friends. How many cookies will each person get?"
> - "3 cookies"
> - "4 cookies" ✓
> - "5 cookies"
> - "6 cookies"

### 4. Better JSON Parsing
Handle markdown code blocks:
```typescript
// Extract JSON from ```json ... ``` blocks
const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
if (jsonMatch) {
  jsonContent = jsonMatch[1];
}
```

### 5. Detailed Logging
Track which source provides questions:
- `📦 Curriculum-content-svc response:` - Raw API response
- `📝 Question data:` - Parsed question object
- `✅ Generated quality AI question from curriculum-content-svc` - Success
- `⚠️ Poor quality question, trying LocalAI` - Fallback triggered
- `🤖 LocalAI response:` - LocalAI raw output

## How to Test

### 1. Open Browser Console
Navigate to http://localhost:5179 and open DevTools Console

### 2. Start Baseline Assessment
Look for these logs:
```
🆔 New assessment session: session_XXX
🎯 Generating question for: {grade: 9, subject: "SEL", difficulty: "medium"}
📦 Curriculum-content-svc response: {...}
📝 Question data: {...}
```

### 3. Check Question Quality

**GOOD Question Example:**
```
Question: "When working on a group project, your teammate disagrees with your idea. 
What is the most respectful way to respond?"

Options:
A) Listen to their perspective and try to find a compromise
B) Insist your idea is better without discussion
C) Stop participating in the project
D) Complain to the teacher about your teammate
```

**BAD Question Example (What we're fixing):**
```
Question: "Sample SEL content"

Options:
A) All of the above
B) None of the above
C) answer (incorrect)
D) answer
```

### 4. Test Across Subjects
Complete questions for:
- ✅ Math - Should have specific numbers and scenarios
- ✅ Reading/ELA - Should have context and specific examples
- ✅ Science - Should have grade-appropriate concepts
- ✅ SEL - Should have realistic social scenarios
- ✅ Speech Therapy - Should have specific sounds/words

### 5. Verify Source Priority
Check console to see which source is used:
1. ✅ Curriculum-Content-Service (Port 8006)
2. 🔄 LocalAI (Port 8080)
3. 🆘 AIVO Brain (Port 8001/8014)
4. 📚 Mock Questions (High quality, 500+ questions)

## Debugging Commands

### Check Curriculum-Content-Service
```bash
# Health check
curl http://localhost:8006/health

# Test question generation
curl -X POST http://localhost:8006/v1/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "SEL",
    "grade_level": "9",
    "difficulty": 0.5,
    "content_type": "assessment",
    "format": "multiple_choice",
    "count": 1
  }'
```

### Check LocalAI
```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ibm-granite.granite-4.0-1b",
    "messages": [
      {
        "role": "user",
        "content": "Create a grade 9 SEL multiple choice question about empathy with 4 options."
      }
    ],
    "temperature": 0.8,
    "max_tokens": 400
  }'
```

## Expected Improvements

### Before
- ❌ Generic "Sample content" questions
- ❌ Poor options like "All of the above"
- ❌ No context or scenarios
- ❌ Difficult to answer meaningfully

### After
- ✅ Specific, detailed questions
- ✅ Realistic, grade-appropriate options
- ✅ Clear context and scenarios
- ✅ Plausible wrong answers
- ✅ Fallback to quality mock questions if AI fails

## Mock Question Quality
If all AI services fail, the mock questions are already high quality:

**Example Grade 9 SEL Question:**
```
Question: "A classmate is being bullied and asks you not to tell anyone. What should you do?"

Options:
- "Keep their secret no matter what"
- "Talk to a trusted adult to get them help" ✓
- "Ignore the situation"
- "Tell all your friends about it"
```

These are from the 500+ curated questions in the questionPools.

## Next Steps

1. ✅ Test baseline assessment in browser
2. ✅ Check console logs for which source is used
3. ✅ Verify questions have proper context
4. ✅ Ensure options are realistic and specific
5. ✅ Test multiple subjects (Math, Reading, Science, SEL, Speech)
6. ⏳ If issues persist, check curriculum-content-svc API contract
7. ⏳ May need to update service to return proper format

## Status: 🔄 Testing Required

Changes deployed. Please test the baseline assessment and report if questions now have proper context and realistic options.

Check console for:
- Which AI source is being used
- Raw API responses
- Any validation errors
- Fallback triggers
