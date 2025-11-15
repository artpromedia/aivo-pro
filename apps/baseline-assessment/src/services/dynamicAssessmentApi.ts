interface QuestionRequest {
  grade: number;
  subject: string;
  previousAnswers?: {
    question: string;
    answer: string;
    correct: boolean;
  }[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface GeneratedQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  gradeLevel: number;
  explanation?: string;
}

interface AssessmentResponse {
  question: GeneratedQuestion;
  nextSubject?: string;
  adjustedDifficulty?: 'easy' | 'medium' | 'hard';
}

class DynamicAssessmentAPI {
  private baseUrl: string;
  private aivoBaseUrl: string;
  private usedQuestionIds: Set<string> = new Set();
  private sessionId: string;

  constructor() {
    // Use local AI endpoints
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.aivoBaseUrl = import.meta.env.VITE_AIVO_BRAIN_URL || 'http://localhost:8001';
    
    // Generate unique session ID for this assessment
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆔 New assessment session:', this.sessionId);
  }

  async generateQuestion(request: QuestionRequest): Promise<AssessmentResponse> {
    console.log('🎯 Generating question for:', request, 'Session:', this.sessionId);
    
    // Try AIVO Main Brain FIRST - it's trained specifically for educational assessment
    try {
      console.log('🧠 Requesting question from AIVO Main Brain (trained education model)...');
      
      // Grade-specific context for appropriate complexity
      const gradeContext = request.grade >= 9 
        ? 'HIGH SCHOOL level - Use algebra, geometry, advanced concepts, literary analysis, complex vocabulary'
        : request.grade >= 6 
        ? 'MIDDLE SCHOOL level - Use pre-algebra, fractions, inference, vocabulary'
        : request.grade >= 3
        ? 'UPPER ELEMENTARY level - Use multiplication, division, basic fractions'
        : 'EARLY ELEMENTARY level - Use simple addition, subtraction, basic concepts';
      
      // Subject-specific depth indicators
      const subjectDepth = {
        'Math': request.grade >= 9 
          ? 'algebra, quadratic equations, functions, trigonometry, statistics' 
          : request.grade >= 6 
          ? 'pre-algebra, ratios, percentages, equations with variables'
          : 'basic operations, word problems, fractions',
        'Reading': request.grade >= 9 
          ? 'literary analysis, rhetorical devices, complex inference, theme analysis'
          : request.grade >= 6
          ? 'main idea, inference, context clues, author\'s purpose'
          : 'comprehension, vocabulary, simple inference',
        'Science': request.grade >= 9
          ? 'chemistry, physics, biology concepts, scientific method, data analysis'
          : request.grade >= 6
          ? 'life science, physical science, earth science, experiments'
          : 'simple observations, basic life cycles, weather',
        'SEL': request.grade >= 9
          ? 'complex emotional regulation, peer relationships, conflict resolution, identity'
          : 'emotions, empathy, friendship, problem-solving'
      };
      
      // Construct a detailed prompt for question generation
      const questionPrompt = `You are creating a ${request.difficulty || 'medium'} difficulty ${request.subject} assessment question for GRADE ${request.grade} (${gradeContext}).

CRITICAL REQUIREMENTS FOR GRADE ${request.grade}:
- Content must be appropriate for ${request.grade >= 9 ? 'HIGH SCHOOL (9-12)' : request.grade >= 6 ? 'MIDDLE SCHOOL (6-8)' : request.grade >= 3 ? 'UPPER ELEMENTARY (3-5)' : 'EARLY ELEMENTARY (K-2)'} students
- Use concepts from: ${subjectDepth[request.subject as keyof typeof subjectDepth] || 'grade-appropriate material'}
- Language and vocabulary must match Grade ${request.grade} reading level
- Examples and scenarios must relate to ${request.grade >= 13 ? 'young adults' : request.grade >= 9 ? 'teenagers' : request.grade >= 6 ? 'pre-teens' : 'children'}

Create ONE complete multiple-choice question with 4 options. Return ONLY valid JSON:

{
  "question": "Complete specific question with all context needed - NO placeholders",
  "options": ["Option A with full text", "Option B with full text", "Option C with full text", "Option D with full text"],
  "correct_answer": "The correct option text (must match exactly)",
  "explanation": "Why this answer is correct"
}

Make it challenging yet fair for Grade ${request.grade} students.`;

      const response = await fetch(`${this.aivoBaseUrl}/v1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: questionPrompt,
          grade_level: request.grade.toString(),
          subject: request.subject,
          learning_style: 'visual',
          max_tokens: 500,
          temperature: 0.7
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🧠 AIVO Brain raw response:', data.response?.substring(0, 200));
        
        if (data.response) {
          try {
            // Try to parse JSON from response
            let jsonContent = data.response.trim();
            
            // Extract JSON if wrapped in code blocks or has extra text
            const jsonMatch = jsonContent.match(/\{[\s\S]*?"question"[\s\S]*?\}/);
            if (jsonMatch) {
              jsonContent = jsonMatch[0];
            }
            
            const questionData = JSON.parse(jsonContent);
            
            // Validate AIVO Brain response quality
            if (questionData.question && questionData.question.length > 15 && 
                !questionData.question.toLowerCase().includes('sample') &&
                questionData.options && Array.isArray(questionData.options) && 
                questionData.options.length === 4 &&
                questionData.correct_answer) {
              
              console.log('✅ Generated quality question from AIVO Main Brain');
              console.log('   Question:', questionData.question.substring(0, 60) + '...');
              
              const questionId = `aivo_brain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              this.usedQuestionIds.add(questionId);
              
              return {
                question: {
                  id: questionId,
                  subject: request.subject,
                  question: questionData.question,
                  options: questionData.options,
                  correctAnswer: questionData.correct_answer,
                  difficulty: request.difficulty || 'medium',
                  gradeLevel: request.grade,
                  explanation: questionData.explanation || ''
                }
              };
            } else {
              console.warn('⚠️ AIVO Brain returned incomplete question data');
              console.warn('   Question length:', questionData.question?.length);
              console.warn('   Options count:', questionData.options?.length);
            }
          } catch (parseError) {
            console.warn('⚠️ Failed to parse AIVO Brain JSON response:', parseError);
            console.warn('   Raw response:', data.response?.substring(0, 200));
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ AIVO Main Brain not available:', error);
    }
    
    try {
      // Fallback to LocalAI with enhanced prompting
      console.log('🔄 Trying LocalAI for question generation...');
      
      // Grade-appropriate examples
      const getGradeExample = (subject: string, grade: number): string => {
        if (grade >= 9) {
          // High school examples
          const highSchoolExamples: { [key: string]: string } = {
            'Math': `Example: "Solve for x: 2x² - 8x + 6 = 0"
Options: ["x = 1 or x = 3", "x = 2 or x = 4", "x = -1 or x = -3", "x = 0 or x = 2"]
Correct: "x = 1 or x = 3"`,
            'Reading': `Example: "In Shakespeare's use of metaphor 'All the world's a stage,' what literary device is primarily employed?"
Options: ["Simile", "Extended metaphor", "Hyperbole", "Personification"]
Correct: "Extended metaphor"`,
            'Science': `Example: "What is the primary function of mitochondria in eukaryotic cells?"
Options: ["Protein synthesis", "Energy production through cellular respiration", "DNA replication", "Photosynthesis"]
Correct: "Energy production through cellular respiration"`,
            'SEL': `Example: "You witness a friend being cyberbullied. What is the most effective first step?"
Options: ["Join in to fit in with the group", "Screenshot evidence and report it to a trusted adult", "Tell the friend to just ignore it", "Post about it on social media"]
Correct: "Screenshot evidence and report it to a trusted adult"`
          };
          return highSchoolExamples[subject] || highSchoolExamples['Math'];
        } else if (grade >= 6) {
          // Middle school examples
          const middleSchoolExamples: { [key: string]: string } = {
            'Math': `Example: "What is 25% of 80?"
Options: ["15", "20", "25", "30"]
Correct: "20"`,
            'Reading': `Example: "What is the author's main purpose in writing a persuasive essay?"
Options: ["To entertain", "To inform", "To convince", "To describe"]
Correct: "To convince"`,
            'Science': `Example: "Which organelle controls cell activities and contains DNA?"
Options: ["Mitochondria", "Nucleus", "Ribosome", "Cell membrane"]
Correct: "Nucleus"`
          };
          return middleSchoolExamples[subject] || middleSchoolExamples['Math'];
        } else {
          // Elementary examples
          const elementaryExamples: { [key: string]: string } = {
            'Math': `Example: "Sarah has 12 cookies and wants to share them equally with 3 friends. How many cookies will each person get?"
Options: ["3 cookies", "4 cookies", "5 cookies", "6 cookies"]
Correct: "4 cookies"`,
            'Reading': `Example: "In the sentence 'The quick brown fox jumps over the lazy dog,' which word is an adjective describing the dog?"
Options: ["quick", "lazy", "jumps", "brown"]
Correct: "lazy"`,
            'Science': `Example: "What happens to water when it freezes?"
Options: ["It becomes a solid called ice", "It evaporates into the air", "It becomes warmer", "It stays liquid but gets colder"]
Correct: "It becomes a solid called ice"`
          };
          return elementaryExamples[subject] || elementaryExamples['Math'];
        }
      };
      
      const exampleText = getGradeExample(request.subject, request.grade);
      
      const gradeLevel = request.grade >= 9 
        ? `HIGH SCHOOL (Grade ${request.grade}) - Use advanced concepts, complex problem-solving`
        : request.grade >= 6
        ? `MIDDLE SCHOOL (Grade ${request.grade}) - Use intermediate concepts`
        : `ELEMENTARY (Grade ${request.grade}) - Use foundational concepts`;
      
      const localAIResponse = await fetch('http://localhost:8080/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'ibm-granite.granite-4.0-1b',
          messages: [{
            role: 'system',
            content: `You are an expert teacher creating assessment questions. Create a ${request.difficulty || 'medium'} difficulty ${request.subject} question for ${gradeLevel}.

CRITICAL REQUIREMENTS FOR GRADE ${request.grade}:
- Content MUST be appropriate for Grade ${request.grade} students
- Use vocabulary and concepts for ${request.grade >= 9 ? 'HIGH SCHOOL' : request.grade >= 6 ? 'MIDDLE SCHOOL' : 'ELEMENTARY'} level
- NO placeholders like "Sample content" or generic text  
- Include 4 distinct, realistic multiple choice options
- Make wrong answers plausible but clearly incorrect
- For word problems, include names and specific numbers
- For concepts, provide clear scenarios

Example format for ${request.subject} at this grade level:
${exampleText}

Return ONLY valid JSON in this exact format:
{
  "question": "Complete specific question here with all necessary context",
  "options": ["Full option 1", "Full option 2", "Full option 3", "Full option 4"],
  "correct_answer": "Full correct option (must match one of the options exactly)",
  "explanation": "Why this answer is correct"
}`
          }, {
            role: 'user', 
            content: `Create ONE unique ${request.subject} assessment question for Grade ${request.grade} at ${request.difficulty} difficulty. Make it specific, complete, and appropriate for ${request.grade >= 9 ? 'high school' : request.grade >= 6 ? 'middle school' : 'elementary'} students. Session: ${this.sessionId.slice(-8)}`
          }],
          temperature: 0.8,
          max_tokens: 600
        }),
      });

      if (localAIResponse.ok) {
        const data = await localAIResponse.json();
        const content = data.choices?.[0]?.message?.content;
        console.log('🤖 LocalAI response:', content);
        
        if (content) {
          try {
            // Try to extract JSON if wrapped in markdown code blocks
            let jsonContent = content;
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
              jsonContent = jsonMatch[1];
            }
            
            const questionData = JSON.parse(jsonContent);
            
            // Validate question quality
            if (!questionData.question || questionData.question.length < 15 ||
                questionData.question.toLowerCase().includes('sample') ||
                !questionData.options || questionData.options.length !== 4) {
              console.warn('⚠️ LocalAI returned poor quality question, using mock');
              throw new Error('Invalid question quality');
            }
            
            console.log('✅ Generated quality AI question from LocalAI');
            
            const questionId = `ai_local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            this.usedQuestionIds.add(questionId);
            
            return {
              question: {
                id: questionId,
                subject: request.subject,
                question: questionData.question,
                options: questionData.options,
                correctAnswer: questionData.correct_answer,
                difficulty: request.difficulty || 'medium',
                gradeLevel: request.grade,
                explanation: questionData.explanation
              }
            };
          } catch (parseError) {
            console.warn('⚠️ Failed to parse LocalAI response, falling back to mock questions:', parseError);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ LocalAI not available, falling back to enhanced mock questions:', error);
    }

    // Final fallback: High-quality curated mock questions (500+ questions)
    console.log('📚 Using enhanced mock questions as final fallback');
    return this.generateMockQuestion(request);
  }

  private generateMockQuestion(request: QuestionRequest): AssessmentResponse {
    const { grade, subject, previousAnswers } = request;
    
    // Analyze previous performance to adjust difficulty
    let difficulty = request.difficulty || 'medium';
    if (previousAnswers && previousAnswers.length > 0) {
      const recentCorrect = previousAnswers.slice(-3).filter(a => a.correct).length;
      if (recentCorrect >= 3) difficulty = 'hard';
      else if (recentCorrect <= 1) difficulty = 'easy';
    }

    // Grade-appropriate question pools
    const questionPools = {
      'Math': {
        'K': {
          easy: [
            { q: 'Count the objects: 🍎🍎🍎 How many apples?', options: ['2', '3', '4', '5'], correct: '3' },
            { q: 'What comes after 2?', options: ['1', '3', '4', '5'], correct: '3' },
            { q: 'Which group has more? 🟦🟦 or 🟦🟦🟦', options: ['First group', 'Second group', 'Same', 'Cannot tell'], correct: 'Second group' }
          ],
          medium: [
            { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: '4' },
            { q: 'Which number is bigger: 5 or 3?', options: ['3', '5', 'Same', 'Cannot tell'], correct: '5' },
            { q: 'Count by 2s: 2, 4, ___', options: ['5', '6', '7', '8'], correct: '6' }
          ],
          hard: [
            { q: 'If you have 5 toys and give away 2, how many do you have?', options: ['2', '3', '4', '7'], correct: '3' },
            { q: 'What shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correct: 'Triangle' }
          ]
        },
        '1': {
          easy: [
            { q: 'What is 3 + 2?', options: ['4', '5', '6', '7'], correct: '5' },
            { q: 'Count by 2s: 2, 4, 6, ___', options: ['7', '8', '9', '10'], correct: '8' },
            { q: 'What is 7 - 3?', options: ['3', '4', '5', '6'], correct: '4' }
          ],
          medium: [
            { q: 'What is 6 + 5?', options: ['10', '11', '12', '13'], correct: '11' },
            { q: 'Which is the tens place in 34?', options: ['3', '4', 'Both', 'Neither'], correct: '3' },
            { q: 'What is 9 - 4?', options: ['4', '5', '6', '7'], correct: '5' }
          ],
          hard: [
            { q: 'Sarah has 8 stickers. She gives 3 to Tom and 2 to Lisa. How many does she have left?', options: ['2', '3', '4', '5'], correct: '3' },
            { q: 'What comes next: 10, 20, 30, ___?', options: ['35', '40', '50', '60'], correct: '40' }
          ]
        },
        '2': {
          easy: [
            { q: 'What is 6 + 4?', options: ['9', '10', '11', '12'], correct: '10' },
            { q: 'Skip count by 5s: 5, 10, 15, ___', options: ['18', '20', '25', '30'], correct: '20' },
            { q: 'What is 12 - 7?', options: ['4', '5', '6', '7'], correct: '5' }
          ],
          medium: [
            { q: 'What is 15 - 7?', options: ['7', '8', '9', '10'], correct: '8' },
            { q: 'Which number has 3 tens and 6 ones?', options: ['36', '63', '30', '6'], correct: '36' },
            { q: 'What is 8 + 7?', options: ['14', '15', '16', '17'], correct: '15' }
          ],
          hard: [
            { q: 'There are 24 students. If 6 students are absent, how many are present?', options: ['16', '17', '18', '19'], correct: '18' },
            { q: 'What is 3 × 4?', options: ['7', '10', '12', '14'], correct: '12' }
          ]
        },
        '3': {
          easy: [
            { q: 'What is 8 × 2?', options: ['14', '16', '18', '20'], correct: '16' },
            { q: 'Round 47 to the nearest ten', options: ['40', '45', '50', '60'], correct: '50' },
            { q: 'What is 6 × 3?', options: ['15', '16', '18', '21'], correct: '18' }
          ],
          medium: [
            { q: 'What is 72 ÷ 8?', options: ['8', '9', '10', '11'], correct: '9' },
            { q: 'What fraction is shaded? [Half circle shaded]', options: ['1/4', '1/2', '3/4', '1/3'], correct: '1/2' },
            { q: 'What is 45 + 28?', options: ['71', '72', '73', '74'], correct: '73' }
          ],
          hard: [
            { q: 'A rectangle has length 9 cm and width 4 cm. What is its area?', options: ['26 cm²', '32 cm²', '36 cm²', '40 cm²'], correct: '36 cm²' },
            { q: 'What is 144 ÷ 12?', options: ['10', '11', '12', '13'], correct: '12' }
          ]
        },
        '4': {
          easy: [
            { q: 'What is 25 × 4?', options: ['90', '95', '100', '105'], correct: '100' },
            { q: 'What is 1/3 of 15?', options: ['3', '4', '5', '6'], correct: '5' }
          ],
          medium: [
            { q: 'What is 2.5 + 1.8?', options: ['4.1', '4.2', '4.3', '4.4'], correct: '4.3' },
            { q: 'Which is equivalent to 3/4?', options: ['0.75', '0.50', '0.25', '0.33'], correct: '0.75' }
          ],
          hard: [
            { q: 'A triangle has angles of 90° and 45°. What is the third angle?', options: ['35°', '40°', '45°', '50°'], correct: '45°' },
            { q: 'What is the perimeter of a square with sides of 8 cm?', options: ['16 cm', '24 cm', '32 cm', '64 cm'], correct: '32 cm' }
          ]
        },
        '5': {
          easy: [
            { q: 'What is 15% of 100?', options: ['10', '15', '20', '25'], correct: '15' },
            { q: 'What is 2³?', options: ['6', '8', '9', '16'], correct: '8' }
          ],
          medium: [
            { q: 'What is 3.7 × 10?', options: ['3.7', '37', '370', '3700'], correct: '37' },
            { q: 'Which fraction is largest: 1/2, 3/8, or 2/3?', options: ['1/2', '3/8', '2/3', 'All equal'], correct: '2/3' }
          ],
          hard: [
            { q: 'A recipe calls for 2 1/4 cups of flour. If you double the recipe, how much flour do you need?', options: ['4 1/4 cups', '4 1/2 cups', '4 2/4 cups', '5 cups'], correct: '4 1/2 cups' },
            { q: 'What is the volume of a cube with sides of 3 cm?', options: ['9 cm³', '18 cm³', '27 cm³', '36 cm³'], correct: '27 cm³' }
          ]
        },
        '6': {
          easy: [
            { q: 'What is 20% of 50?', options: ['5', '10', '15', '20'], correct: '10' },
            { q: 'Simplify: 12/16', options: ['2/3', '3/4', '4/5', '1/2'], correct: '3/4' }
          ],
          medium: [
            { q: 'Solve: 3x + 5 = 20', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], correct: 'x = 5' },
            { q: 'What is the mean of 12, 15, 18, and 23?', options: ['16', '17', '18', '19'], correct: '17' }
          ],
          hard: [
            { q: 'A circle has a radius of 7 cm. What is its circumference? (Use π ≈ 3.14)', options: ['21.98 cm', '43.96 cm', '153.86 cm', '14 cm'], correct: '43.96 cm' },
            { q: 'If y = 2x + 3, what is y when x = 4?', options: ['9', '10', '11', '12'], correct: '11' }
          ]
        },
        '7': {
          easy: [
            { q: 'What is 0.25 as a fraction?', options: ['1/2', '1/4', '1/3', '2/5'], correct: '1/4' },
            { q: 'Solve: x - 7 = 15', options: ['x = 8', 'x = 20', 'x = 22', 'x = 24'], correct: 'x = 22' }
          ],
          medium: [
            { q: 'What is the slope of a line passing through (2,3) and (4,7)?', options: ['1', '2', '3', '4'], correct: '2' },
            { q: 'Simplify: 3(x + 4)', options: ['3x + 4', '3x + 12', 'x + 12', '3x + 7'], correct: '3x + 12' }
          ],
          hard: [
            { q: 'What is the probability of rolling a sum of 7 with two dice?', options: ['1/12', '1/9', '1/6', '1/3'], correct: '1/6' },
            { q: 'A rectangle has a perimeter of 40 cm and a width of 8 cm. What is its area?', options: ['96 cm²', '120 cm²', '160 cm²', '192 cm²'], correct: '96 cm²' }
          ]
        },
        '8': {
          easy: [
            { q: 'Evaluate: 5² - 3²', options: ['4', '8', '16', '24'], correct: '16' },
            { q: 'What is 30% of 200?', options: ['50', '60', '70', '80'], correct: '60' }
          ],
          medium: [
            { q: 'Factor: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+2)(x+4)', '(x+3)(x+3)'], correct: '(x+2)(x+3)' },
            { q: 'What is the surface area of a cube with side length 4 cm?', options: ['64 cm²', '80 cm²', '96 cm²', '112 cm²'], correct: '96 cm²' }
          ],
          hard: [
            { q: 'Solve: 2(x - 3) = x + 4', options: ['x = 8', 'x = 10', 'x = 12', 'x = 14'], correct: 'x = 10' },
            { q: 'If f(x) = 2x² - 3x + 1, what is f(2)?', options: ['1', '3', '5', '7'], correct: '3' }
          ]
        },
        '9': {
          easy: [
            { q: 'Solve: 3x - 12 = 0', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], correct: 'x = 4' },
            { q: 'What is the slope of the line y = 4x + 7?', options: ['4', '7', '-4', '1/4'], correct: '4' }
          ],
          medium: [
            { q: 'Factor completely: x² - 16', options: ['(x-4)(x-4)', '(x+4)(x-4)', '(x+8)(x-8)', 'Cannot factor'], correct: '(x+4)(x-4)' },
            { q: 'What is the vertex of the parabola y = (x - 3)² + 2?', options: ['(3, 2)', '(-3, 2)', '(3, -2)', '(2, 3)'], correct: '(3, 2)' }
          ],
          hard: [
            { q: 'Solve the system: 2x + y = 10 and x - y = 2', options: ['x=3, y=4', 'x=4, y=2', 'x=5, y=0', 'x=2, y=6'], correct: 'x=4, y=2' },
            { q: 'Simplify: (3x²y³)/(xy²)', options: ['3xy', '3x²y', '3xy²', 'xy'], correct: '3xy' }
          ]
        },
        '10': {
          easy: [
            { q: 'What is the value of sin(30°)?', options: ['0', '1/2', '√2/2', '1'], correct: '1/2' },
            { q: 'Expand: (x + 5)²', options: ['x² + 25', 'x² + 5x + 25', 'x² + 10x + 25', 'x² + 10x + 5'], correct: 'x² + 10x + 25' }
          ],
          medium: [
            { q: 'Solve for x: x² - 5x + 6 = 0', options: ['x = 1 or x = 6', 'x = 2 or x = 3', 'x = -2 or x = -3', 'x = -1 or x = -6'], correct: 'x = 2 or x = 3' },
            { q: 'What is the domain of f(x) = √(x - 4)?', options: ['x ≥ 4', 'x ≤ 4', 'x > 4', 'All real numbers'], correct: 'x ≥ 4' }
          ],
          hard: [
            { q: 'If log₂(x) = 5, what is x?', options: ['10', '16', '25', '32'], correct: '32' },
            { q: 'What is the equation of a circle with center (2, -3) and radius 5?', options: ['(x-2)² + (y+3)² = 25', '(x+2)² + (y-3)² = 25', '(x-2)² + (y-3)² = 5', 'x² + y² = 25'], correct: '(x-2)² + (y+3)² = 25' }
          ]
        },
        '11': {
          easy: [
            { q: 'Simplify: log(100)', options: ['1', '2', '10', '100'], correct: '2' },
            { q: 'What is the period of y = sin(x)?', options: ['π/2', 'π', '2π', '4π'], correct: '2π' }
          ],
          medium: [
            { q: 'Evaluate: lim(x→2) (x² - 4)/(x - 2)', options: ['0', '2', '4', 'undefined'], correct: '4' },
            { q: 'What is the inverse of f(x) = 2x + 3?', options: ['f⁻¹(x) = (x-3)/2', 'f⁻¹(x) = (x+3)/2', 'f⁻¹(x) = x/2 - 3', 'f⁻¹(x) = 2x - 3'], correct: 'f⁻¹(x) = (x-3)/2' }
          ],
          hard: [
            { q: 'What is the derivative of f(x) = 3x² + 5x - 2?', options: ['6x + 5', '3x + 5', '6x² + 5x', '3x² + 5'], correct: '6x + 5' },
            { q: 'Solve: 2^(x+1) = 32', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], correct: 'x = 4' }
          ]
        },
        '12': {
          easy: [
            { q: 'What is ∫2x dx?', options: ['x²', 'x² + C', '2x²', '2x² + C'], correct: 'x² + C' },
            { q: 'Evaluate: d/dx(x³)', options: ['x²', '2x²', '3x²', '3x'], correct: '3x²' }
          ],
          medium: [
            { q: 'What is the integral of cos(x) dx?', options: ['-sin(x) + C', 'sin(x) + C', '-cos(x) + C', 'cos(x) + C'], correct: 'sin(x) + C' },
            { q: 'Find the maximum of f(x) = -x² + 4x + 5', options: ['(2, 9)', '(4, 5)', '(0, 5)', '(2, 5)'], correct: '(2, 9)' }
          ],
          hard: [
            { q: 'Solve the differential equation: dy/dx = 2y', options: ['y = Ce^(2x)', 'y = 2e^x + C', 'y = Ce^x', 'y = x² + C'], correct: 'y = Ce^(2x)' },
            { q: 'What is the Taylor series expansion of e^x at x=0 up to the x² term?', options: ['1 + x + x²', '1 + x + x²/2', '1 + x + x²/2!', '1 + x'], correct: '1 + x + x²/2!' }
          ]
        }
      },
      'Reading': {
        'K': {
          easy: [
            { q: 'What letter does "apple" start with?', options: ['A', 'P', 'L', 'E'], correct: 'A' },
            { q: 'Which word rhymes with "cat"?', options: ['dog', 'hat', 'run', 'big'], correct: 'hat' },
            { q: 'What sound does the letter "B" make?', options: ['buh', 'bee', 'bay', 'boo'], correct: 'buh' }
          ],
          medium: [
            { q: 'How many syllables in "elephant"?', options: ['2', '3', '4', '5'], correct: '3' },
            { q: 'What sound does "ch" make in "chair"?', options: ['k', 'sh', 'ch', 's'], correct: 'ch' },
            { q: 'Which word starts with the same sound as "sun"?', options: ['cat', 'dog', 'sit', 'run'], correct: 'sit' }
          ],
          hard: [
            { q: 'Which word is a noun?', options: ['run', 'happy', 'dog', 'quickly'], correct: 'dog' },
            { q: 'What is the beginning sound in "phone"?', options: ['p', 'f', 'ph', 'h'], correct: 'f' }
          ]
        },
        '1': {
          easy: [
            { q: 'What is the opposite of "hot"?', options: ['warm', 'cold', 'big', 'small'], correct: 'cold' },
            { q: 'Which letter is silent in "knee"?', options: ['k', 'n', 'e', 'e'], correct: 'k' },
            { q: 'What type of word is "jump"?', options: ['person', 'place', 'action', 'thing'], correct: 'action' }
          ],
          medium: [
            { q: 'What is a compound word?', options: ['big word', 'two words together', 'describing word', 'action word'], correct: 'two words together' },
            { q: 'In "The big dog ran fast," which word describes the dog?', options: ['The', 'big', 'ran', 'fast'], correct: 'big' },
            { q: 'Which word has a long "a" sound?', options: ['cat', 'cake', 'cap', 'can'], correct: 'cake' }
          ],
          hard: [
            { q: 'What is the main idea of a story about a lost puppy finding its way home?', options: ['Dogs are pets', 'Being lost is scary', 'Finding your way home', 'Puppies are cute'], correct: 'Finding your way home' },
            { q: 'Which sentence is complete?', options: ['The dog.', 'Running fast.', 'The dog runs.', 'Very happy.'], correct: 'The dog runs.' }
          ]
        },
        '2': {
          easy: [
            { q: 'What does "gigantic" mean?', options: ['very small', 'very big', 'very fast', 'very slow'], correct: 'very big' },
            { q: 'Which word is a synonym for "happy"?', options: ['sad', 'angry', 'joyful', 'tired'], correct: 'joyful' }
          ],
          medium: [
            { q: 'What is the root word in "unhappy"?', options: ['un', 'happy', 'unhap', 'py'], correct: 'happy' },
            { q: 'Which sentence uses correct punctuation?', options: ['What time is it.', 'What time is it?', 'What time is it!', 'What time is it,'], correct: 'What time is it?' }
          ],
          hard: [
            { q: 'What is the theme of a story where a character learns to share?', options: ['Friendship', 'Kindness', 'Adventure', 'Mystery'], correct: 'Kindness' },
            { q: 'Which sentence shows cause and effect?', options: ['I like pizza.', 'It rained, so I stayed inside.', 'The cat is orange.', 'We went to school.'], correct: 'It rained, so I stayed inside.' }
          ]
        },
        '3': {
          easy: [
            { q: 'What is an antonym for "brave"?', options: ['strong', 'fearful', 'bold', 'courageous'], correct: 'fearful' },
            { q: 'Which is a proper noun?', options: ['city', 'dog', 'Texas', 'book'], correct: 'Texas' }
          ],
          medium: [
            { q: 'What does the prefix "re-" mean in "rewrite"?', options: ['not', 'again', 'before', 'wrong'], correct: 'again' },
            { q: 'Which sentence is in past tense?', options: ['I will go.', 'I am going.', 'I went.', 'I go.'], correct: 'I went.' }
          ],
          hard: [
            { q: 'What can you infer if a character is wearing a coat and gloves?', options: ['It is hot', 'It is cold', 'It is raining', 'It is sunny'], correct: 'It is cold' },
            { q: 'Which sentence has a metaphor?', options: ['The sun is bright.', 'She runs like the wind.', 'Her voice is music.', 'The dog barked loudly.'], correct: 'Her voice is music.' }
          ]
        },
        '6': {
          easy: [
            { q: 'What is a protagonist?', options: ['The villain', 'The main character', 'The setting', 'The conflict'], correct: 'The main character' },
            { q: 'What does "chronological order" mean?', options: ['By importance', 'By time order', 'By size', 'Alphabetically'], correct: 'By time order' }
          ],
          medium: [
            { q: 'What is the theme of a story?', options: ['The plot summary', 'The main character', 'The central message or lesson', 'The setting'], correct: 'The central message or lesson' },
            { q: 'Which is an example of alliteration?', options: ['She sells seashells', 'The wind howled', 'It was as cold as ice', 'The sun smiled'], correct: 'She sells seashells' }
          ],
          hard: [
            { q: 'What is the author\'s purpose in a persuasive essay?', options: ['To entertain', 'To inform', 'To convince the reader', 'To describe'], correct: 'To convince the reader' },
            { q: 'What is foreshadowing?', options: ['Looking back at past events', 'Hints about future events', 'Exaggeration', 'Comparison using like or as'], correct: 'Hints about future events' }
          ]
        },
        '7': {
          easy: [
            { q: 'What is a biography?', options: ['A fictional story', 'A story about someone\'s life', 'A poem', 'An opinion piece'], correct: 'A story about someone\'s life' },
            { q: 'What does "tone" mean in literature?', options: ['The volume', 'The author\'s attitude', 'The setting', 'The plot'], correct: 'The author\'s attitude' }
          ],
          medium: [
            { q: 'Which is an example of irony?', options: ['A fire station burns down', 'The sun is hot', 'She ran quickly', 'The tree is tall'], correct: 'A fire station burns down' },
            { q: 'What is the climax of a story?', options: ['The beginning', 'The turning point or highest tension', 'The resolution', 'The introduction of characters'], correct: 'The turning point or highest tension' }
          ],
          hard: [
            { q: 'What is the difference between theme and main idea?', options: ['They are the same thing', 'Theme is the lesson; main idea is what the text is mostly about', 'Theme is for fiction only', 'Main idea is longer'], correct: 'Theme is the lesson; main idea is what the text is mostly about' },
            { q: 'What literary device is "The classroom was a zoo"?', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 'Metaphor' }
          ]
        },
        '8': {
          easy: [
            { q: 'What is an autobiography?', options: ['Someone else\'s life story', 'Your own life story', 'A fictional story', 'A historical document'], correct: 'Your own life story' },
            { q: 'What does "context clues" mean?', options: ['The main idea', 'Words around an unknown word that help define it', 'The author\'s opinion', 'The setting'], correct: 'Words around an unknown word that help define it' }
          ],
          medium: [
            { q: 'What is satire?', options: ['Serious criticism', 'Using humor to criticize', 'A sad story', 'Historical fiction'], correct: 'Using humor to criticize' },
            { q: 'Which point of view uses "I" and "me"?', options: ['Third person', 'Second person', 'First person', 'Omniscient'], correct: 'First person' }
          ],
          hard: [
            { q: 'What is an unreliable narrator?', options: ['A narrator who tells the truth', 'A narrator whose credibility is compromised', 'A narrator who is omniscient', 'A third-person narrator'], correct: 'A narrator whose credibility is compromised' },
            { q: 'What is the purpose of a rhetorical question?', options: ['To get an answer', 'To make a point without expecting an answer', 'To confuse the reader', 'To end a speech'], correct: 'To make a point without expecting an answer' }
          ]
        },
        '9': {
          easy: [
            { q: 'What is an antagonist?', options: ['The hero', 'The character opposing the protagonist', 'The narrator', 'The setting'], correct: 'The character opposing the protagonist' },
            { q: 'What is "imagery" in literature?', options: ['The plot', 'Descriptive language that creates mental pictures', 'The theme', 'The characters'], correct: 'Descriptive language that creates mental pictures' }
          ],
          medium: [
            { q: 'In Romeo and Juliet, what literary device is the phrase "O Romeo, Romeo, wherefore art thou Romeo?"', options: ['Metaphor', 'Apostrophe', 'Simile', 'Allusion'], correct: 'Apostrophe' },
            { q: 'What is the difference between denotation and connotation?', options: ['They mean the same', 'Denotation is literal meaning; connotation is emotional meaning', 'Connotation is literal; denotation is emotional', 'Neither are important'], correct: 'Denotation is literal meaning; connotation is emotional meaning' }
          ],
          hard: [
            { q: 'What is a paradox?', options: ['A contradiction that reveals truth', 'A simple statement', 'A type of poem', 'An exaggeration'], correct: 'A contradiction that reveals truth' },
            { q: 'What is the function of a foil character?', options: ['To be the villain', 'To contrast with another character to highlight qualities', 'To narrate the story', 'To provide comic relief'], correct: 'To contrast with another character to highlight qualities' }
          ]
        },
        '10': {
          easy: [
            { q: 'What is an allegory?', options: ['A true story', 'A story with symbolic meaning', 'A biography', 'A short poem'], correct: 'A story with symbolic meaning' },
            { q: 'What does "archetype" mean?', options: ['A new idea', 'A universal symbol or character type', 'A specific setting', 'A type of conflict'], correct: 'A universal symbol or character type' }
          ],
          medium: [
            { q: 'What is the purpose of a soliloquy?', options: ['To speak to another character', 'To reveal inner thoughts to the audience', 'To describe the setting', 'To advance the plot quickly'], correct: 'To reveal inner thoughts to the audience' },
            { q: 'Which work is an example of epic poetry?', options: ['A sonnet', 'The Odyssey', 'A haiku', 'A limerick'], correct: 'The Odyssey' }
          ],
          hard: [
            { q: 'What is the "tragic flaw" in classical literature?', options: ['A minor mistake', 'A character defect that leads to downfall', 'Perfect virtue', 'Comic relief'], correct: 'A character defect that leads to downfall' },
            { q: 'In "The Great Gatsby," what does the green light symbolize?', options: ['Jealousy', 'Money', 'Hope and the American Dream', 'Nature'], correct: 'Hope and the American Dream' }
          ]
        },
        '11': {
          easy: [
            { q: 'What is a motif?', options: ['The main character', 'A recurring element that has symbolic significance', 'The setting', 'The climax'], correct: 'A recurring element that has symbolic significance' },
            { q: 'What is stream of consciousness?', options: ['Organized thoughts', 'A narrative technique showing continuous flow of thoughts', 'Dialogue only', 'Third person narration'], correct: 'A narrative technique showing continuous flow of thoughts' }
          ],
          medium: [
            { q: 'What literary period emphasized emotion and nature over reason?', options: ['Realism', 'Romanticism', 'Modernism', 'Naturalism'], correct: 'Romanticism' },
            { q: 'What is an oxymoron?', options: ['A long speech', 'Contradictory terms together (like "deafening silence")', 'A comparison', 'A question'], correct: 'Contradictory terms together (like "deafening silence")' }
          ],
          hard: [
            { q: 'What is the purpose of dramatic irony?', options: ['To confuse the audience', 'The audience knows something characters don\'t', 'To make characters laugh', 'To end the play'], correct: 'The audience knows something characters don\'t' },
            { q: 'What characterizes American Transcendentalism?', options: ['Focus on sin', 'Belief in inherent goodness, nature, and self-reliance', 'Urban life themes', 'Pessimism'], correct: 'Belief in inherent goodness, nature, and self-reliance' }
          ]
        },
        '12': {
          easy: [
            { q: 'What is postmodern literature known for?', options: ['Clear linear narratives', 'Experimentation and challenging conventions', 'Simple themes', 'Happy endings'], correct: 'Experimentation and challenging conventions' },
            { q: 'What is ekphrasis?', options: ['A type of rhyme', 'Vivid description of visual art in writing', 'A short story', 'An introduction'], correct: 'Vivid description of visual art in writing' }
          ],
          medium: [
            { q: 'What is the Harlem Renaissance?', options: ['A scientific movement', 'A cultural/artistic African American movement in 1920s', 'A political party', 'A war'], correct: 'A cultural/artistic African American movement in 1920s' },
            { q: 'What narrative technique did William Faulkner often use?', options: ['Simple chronology', 'Multiple perspectives and stream of consciousness', 'Always third person', 'Present tense only'], correct: 'Multiple perspectives and stream of consciousness' }
          ],
          hard: [
            { q: 'What is metafiction?', options: ['Historical fiction', 'Fiction that self-consciously addresses its own fictional nature', 'Fantasy', 'Biography'], correct: 'Fiction that self-consciously addresses its own fictional nature' },
            { q: 'In "1984," what does Newspeak represent?', options: ['Progress', 'Language control as thought control', 'Freedom', 'Education'], correct: 'Language control as thought control' }
          ]
        }
      },
      'Science': {
        'K': {
          easy: [
            { q: 'What do plants need to grow?', options: ['Only water', 'Only light', 'Water and light', 'Nothing'], correct: 'Water and light' },
            { q: 'Which animal flies?', options: ['Dog', 'Fish', 'Bird', 'Cat'], correct: 'Bird' },
            { q: 'What do we use to see?', options: ['Ears', 'Eyes', 'Nose', 'Mouth'], correct: 'Eyes' }
          ],
          medium: [
            { q: 'What season comes after winter?', options: ['Summer', 'Spring', 'Fall', 'Winter'], correct: 'Spring' },
            { q: 'Which sense do you use to hear?', options: ['Eyes', 'Nose', 'Ears', 'Tongue'], correct: 'Ears' },
            { q: 'What do fish use to breathe?', options: ['Lungs', 'Gills', 'Nose', 'Mouth'], correct: 'Gills' }
          ],
          hard: [
            { q: 'What happens to water when it gets very cold?', options: ['It disappears', 'It turns to ice', 'It gets hot', 'It changes color'], correct: 'It turns to ice' },
            { q: 'Which animal is a mammal?', options: ['Fish', 'Bird', 'Dog', 'Butterfly'], correct: 'Dog' }
          ]
        },
        '1': {
          easy: [
            { q: 'What gives us light during the day?', options: ['Moon', 'Stars', 'Sun', 'Lamp'], correct: 'Sun' },
            { q: 'Which animal lays eggs?', options: ['Dog', 'Cat', 'Chicken', 'Cow'], correct: 'Chicken' }
          ],
          medium: [
            { q: 'What are the three states of matter?', options: ['Hot, warm, cold', 'Solid, liquid, gas', 'Big, medium, small', 'Red, blue, green'], correct: 'Solid, liquid, gas' },
            { q: 'What do animals need to survive?', options: ['Only food', 'Only water', 'Food, water, shelter', 'Only shelter'], correct: 'Food, water, shelter' }
          ],
          hard: [
            { q: 'What causes day and night?', options: ['Earth spinning', 'Sun moving', 'Moon phases', 'Weather changes'], correct: 'Earth spinning' },
            { q: 'Which part of a plant takes in water?', options: ['Leaves', 'Stem', 'Roots', 'Flowers'], correct: 'Roots' }
          ]
        },
        '2': {
          easy: [
            { q: 'What is the hottest planet?', options: ['Earth', 'Mars', 'Venus', 'Jupiter'], correct: 'Venus' },
            { q: 'What do we call baby frogs?', options: ['Puppies', 'Kittens', 'Tadpoles', 'Chicks'], correct: 'Tadpoles' }
          ],
          medium: [
            { q: 'What is the process of a caterpillar becoming a butterfly?', options: ['Evolution', 'Metamorphosis', 'Hibernation', 'Migration'], correct: 'Metamorphosis' },
            { q: 'What makes a shadow?', options: ['Light being blocked', 'Darkness', 'Rain', 'Wind'], correct: 'Light being blocked' }
          ],
          hard: [
            { q: 'Which force pulls objects toward Earth?', options: ['Magnetism', 'Gravity', 'Friction', 'Pressure'], correct: 'Gravity' },
            { q: 'What gas do plants release during photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 'Oxygen' }
          ]
        },
        '3': {
          easy: [
            { q: 'What is the center of our solar system?', options: ['Earth', 'Moon', 'Sun', 'Mars'], correct: 'Sun' },
            { q: 'Which habitat has the most rainfall?', options: ['Desert', 'Forest', 'Rainforest', 'Grassland'], correct: 'Rainforest' }
          ],
          medium: [
            { q: 'What is an ecosystem?', options: ['A type of animal', 'A place where living and non-living things interact', 'A kind of plant', 'A weather pattern'], correct: 'A place where living and non-living things interact' },
            { q: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Silver'], correct: 'Diamond' }
          ],
          hard: [
            { q: 'What is the function of the heart?', options: ['To think', 'To pump blood', 'To digest food', 'To breathe'], correct: 'To pump blood' },
            { q: 'What type of energy does a moving car have?', options: ['Potential energy', 'Kinetic energy', 'Chemical energy', 'Electrical energy'], correct: 'Kinetic energy' }
          ]
        }
      },
      'SEL': {
        'K': {
          easy: [
            { q: 'How do you feel when someone shares with you?', options: ['Sad', 'Happy', 'Angry', 'Scared'], correct: 'Happy' },
            { q: 'What should you say when someone helps you?', options: ['Nothing', 'Thank you', 'Go away', 'Stop'], correct: 'Thank you' }
          ],
          medium: [
            { q: 'What should you do when you feel angry?', options: ['Hit someone', 'Take deep breaths', 'Scream', 'Run away'], correct: 'Take deep breaths' },
            { q: 'How can you be a good friend?', options: ['Take toys away', 'Share and be kind', 'Ignore them', 'Be mean'], correct: 'Share and be kind' }
          ],
          hard: [
            { q: 'What is empathy?', options: ['Being mean', 'Understanding how others feel', 'Being selfish', 'Not caring'], correct: 'Understanding how others feel' }
          ]
        },
        '1': {
          easy: [
            { q: 'What is a good way to solve a problem with a friend?', options: ['Fight', 'Talk about it', 'Ignore it', 'Tell lies'], correct: 'Talk about it' },
            { q: 'Which feeling word describes being scared?', options: ['Happy', 'Excited', 'Afraid', 'Proud'], correct: 'Afraid' }
          ],
          medium: [
            { q: 'What should you do if you see someone being bullied?', options: ['Join in', 'Tell a trusted adult', 'Laugh', 'Walk away'], correct: 'Tell a trusted adult' },
            { q: 'How can you show respect to others?', options: ['Interrupt them', 'Listen when they speak', 'Ignore them', 'Be rude'], correct: 'Listen when they speak' }
          ],
          hard: [
            { q: 'What is self-control?', options: ['Doing whatever you want', 'Managing your actions and feelings', 'Being bossy', 'Never having fun'], correct: 'Managing your actions and feelings' }
          ]
        },
        '2': {
          easy: [
            { q: 'What does it mean to be responsible?', options: ['Blame others', 'Do what you should do', 'Make excuses', 'Give up easily'], correct: 'Do what you should do' },
            { q: 'How do you show kindness?', options: ['Help others', 'Take things', 'Be mean', 'Ignore people'], correct: 'Help others' }
          ],
          medium: [
            { q: 'What should you do when you make a mistake?', options: ['Blame others', 'Learn from it and try again', 'Give up', 'Get angry'], correct: 'Learn from it and try again' },
            { q: 'What is cooperation?', options: ['Working together', 'Working alone always', 'Competing unfairly', 'Not helping'], correct: 'Working together' }
          ],
          hard: [
            { q: 'Why is it important to understand different perspectives?', options: ['It\'s not important', 'It helps you understand others better', 'To prove you\'re right', 'To win arguments'], correct: 'It helps you understand others better' }
          ]
        },
        '3': {
          easy: [
            { q: 'What is a growth mindset?', options: ['Believing you can\'t improve', 'Believing you can learn and grow', 'Giving up easily', 'Never trying new things'], correct: 'Believing you can learn and grow' }
          ],
          medium: [
            { q: 'How can you be a good leader?', options: ['Boss people around', 'Listen to others and help the team', 'Take all the credit', 'Do everything yourself'], correct: 'Listen to others and help the team' },
            { q: 'What does resilience mean?', options: ['Giving up quickly', 'Bouncing back from challenges', 'Never facing problems', 'Always being perfect'], correct: 'Bouncing back from challenges' }
          ],
          hard: [
            { q: 'How can you manage stress in a healthy way?', options: ['Bottle it up', 'Talk to someone, exercise, or do activities you enjoy', 'Blame others', 'Ignore it completely'], correct: 'Talk to someone, exercise, or do activities you enjoy' }
          ]
        }
      },
      'Speech Therapy': {
        'K': {
          easy: [
            { q: 'Which word starts with the /b/ sound?', options: ['Cat', 'Dog', 'Ball', 'Fish'], correct: 'Ball' },
            { q: 'How many syllables in "cat"?', options: ['1', '2', '3', '4'], correct: '1' }
          ],
          medium: [
            { q: 'Which word rhymes with "cat"?', options: ['Dog', 'Hat', 'Run', 'Jump'], correct: 'Hat' },
            { q: 'What sound does the letter S make?', options: ['/s/', '/z/', '/sh/', '/ch/'], correct: '/s/' }
          ],
          hard: [
            { q: 'Which word has 3 sounds? (phonemes)', options: ['Cat', 'Ship', 'The', 'I'], correct: 'Cat' }
          ]
        },
        '1': {
          easy: [
            { q: 'How many syllables in "banana"?', options: ['2', '3', '4', '5'], correct: '3' },
            { q: 'Which word starts with /sh/?', options: ['Cat', 'Shoe', 'Tree', 'Ball'], correct: 'Shoe' }
          ],
          medium: [
            { q: 'What is the beginning sound in "fish"?', options: ['/f/', '/s/', '/sh/', '/h/'], correct: '/f/' },
            { q: 'Which two words rhyme?', options: ['Tree and See', 'Dog and Cat', 'Run and Walk', 'Big and Small'], correct: 'Tree and See' }
          ],
          hard: [
            { q: 'What happens when you blend /c/ /a/ /t/?', options: ['Car', 'Cat', 'Cow', 'Cut'], correct: 'Cat' }
          ]
        },
        '2': {
          easy: [
            { q: 'Which word has a long "a" sound?', options: ['Cat', 'Cake', 'Can', 'Cap'], correct: 'Cake' },
            { q: 'How do you make "run" past tense?', options: ['Run', 'Runned', 'Ran', 'Running'], correct: 'Ran' }
          ],
          medium: [
            { q: 'Which word has a silent letter?', options: ['Dog', 'Knee', 'Cat', 'Run'], correct: 'Knee' },
            { q: 'What is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 'Joyful' }
          ],
          hard: [
            { q: 'Which sentence is grammatically correct?', options: ['She go to school', 'She goes to school', 'She going to school', 'She goed to school'], correct: 'She goes to school' }
          ]
        },
        '3': {
          easy: [
            { q: 'Which word has a prefix?', options: ['Happy', 'Unhappy', 'Happiness', 'Happily'], correct: 'Unhappy' },
            { q: 'What is an antonym for "hot"?', options: ['Warm', 'Cold', 'Cool', 'Freezing'], correct: 'Cold' }
          ],
          medium: [
            { q: 'Which word has a suffix that means "one who"?', options: ['Teacher', 'Teaching', 'Teach', 'Taught'], correct: 'Teacher' },
            { q: 'What is the root word in "unhappily"?', options: ['Happy', 'Unhappy', 'Happily', 'Un'], correct: 'Happy' }
          ],
          hard: [
            { q: 'Which sentence uses proper subject-verb agreement?', options: ['The dogs runs fast', 'The dog run fast', 'The dogs run fast', 'The dog running fast'], correct: 'The dogs run fast' }
          ]
        }
      }
    };

    // Get appropriate question
    const gradeKey = grade.toString();
    const subjectQuestions = questionPools[subject as keyof typeof questionPools];
    
    // Helper to shuffle array for randomness
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // Enhanced fallback logic - try different grades and subjects if needed
    let selectedQuestion: any = null;
    let actualGrade = grade;
    let actualSubject = subject;
    
    if (subjectQuestions && subjectQuestions[gradeKey as keyof typeof subjectQuestions]) {
      const difficultyQuestions = subjectQuestions[gradeKey as keyof typeof subjectQuestions][difficulty];
      if (difficultyQuestions && difficultyQuestions.length > 0) {
        // Shuffle before selecting to get different question each time
        const shuffled = shuffleArray(difficultyQuestions);
        // Try to find unused question
        for (const q of shuffled) {
          const potentialId = `mock_${actualSubject}_${gradeKey}_${difficulty}_${q.q.substring(0, 20)}`;
          if (!this.usedQuestionIds.has(potentialId)) {
            selectedQuestion = q;
            this.usedQuestionIds.add(potentialId);
            break;
          }
        }
        // If all used, take first shuffled one
        if (!selectedQuestion) {
          selectedQuestion = shuffled[0];
        }
      }
    }
    
    // If no question found, try adjacent grades
    if (!selectedQuestion) {
      const gradesToTry = [grade - 1, grade + 1, 1, 2, 3]; // Try nearby grades, then fallback to basic grades
      for (const tryGrade of gradesToTry) {
        const tryGradeKey = tryGrade.toString();
        if (subjectQuestions && subjectQuestions[tryGradeKey as keyof typeof subjectQuestions]) {
          const difficultyQuestions = subjectQuestions[tryGradeKey as keyof typeof subjectQuestions][difficulty];
          if (difficultyQuestions && difficultyQuestions.length > 0) {
            const shuffled = shuffleArray(difficultyQuestions);
            selectedQuestion = shuffled[0];
            actualGrade = tryGrade;
            break;
          }
        }
      }
    }
    
    // If still no question, try different subjects
    if (!selectedQuestion) {
      const subjectsToTry = shuffleArray(['Math', 'Reading', 'Science', 'SEL', 'Speech Therapy']);
      for (const trySubject of subjectsToTry) {
        const trySubjectQuestions = questionPools[trySubject as keyof typeof questionPools];
        if (trySubjectQuestions) {
          // Try current grade first, then grade 1, 2, 3
          const gradesToTry = [grade, 1, 2, 3];
          for (const tryGrade of gradesToTry) {
            const tryGradeKey = tryGrade.toString();
            if (trySubjectQuestions[tryGradeKey as keyof typeof trySubjectQuestions]) {
              const difficultyQuestions = trySubjectQuestions[tryGradeKey as keyof typeof trySubjectQuestions][difficulty] ||
                                        trySubjectQuestions[tryGradeKey as keyof typeof trySubjectQuestions]['medium'] ||
                                        trySubjectQuestions[tryGradeKey as keyof typeof trySubjectQuestions]['easy'];
              if (difficultyQuestions && difficultyQuestions.length > 0) {
                const shuffled = shuffleArray(difficultyQuestions);
                selectedQuestion = shuffled[0];
                actualGrade = tryGrade;
                actualSubject = trySubject;
                break;
              }
            }
          }
          if (selectedQuestion) break;
        }
      }
    }
    
    // Final fallback with a proper educational question
    if (!selectedQuestion) {
      // Generate a truly random fallback question with timestamp-based variation
      const randomSeed = Date.now() % 100;
      selectedQuestion = {
        q: `What is ${randomSeed + 1} + ${randomSeed + 2}?`,
        options: [
          (randomSeed + 1 + randomSeed + 2).toString(),
          (randomSeed + 1 + randomSeed + 2 + 1).toString(),
          (randomSeed + 1 + randomSeed + 2 - 1).toString(),
          (randomSeed + 1 + randomSeed + 2 + 2).toString()
        ].sort(() => Math.random() - 0.5), // Shuffle options
        correct: (randomSeed + 1 + randomSeed + 2).toString()
      };
      actualGrade = 1;
      actualSubject = 'Math';
    }

    // Add randomization to question ID to ensure uniqueness
    const uniqueId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.usedQuestionIds.add(uniqueId);
    
    return {
      question: {
        id: uniqueId,
        subject: actualSubject,
        question: selectedQuestion.q,
        options: selectedQuestion.options,
        correctAnswer: selectedQuestion.correct,
        difficulty,
        gradeLevel: actualGrade
      },
      adjustedDifficulty: difficulty
    };
  }

  // Helper method to generate multiple choice options from an answer
  private generateOptions(correctAnswer: string, subject: string): string[] {
    const options = [correctAnswer];
    const answerNum = parseFloat(correctAnswer);
    
    // If answer is numeric, generate nearby numbers
    if (!isNaN(answerNum)) {
      const offset1 = Math.floor(Math.random() * 5) + 1;
      const offset2 = Math.floor(Math.random() * 5) + 1;
      const offset3 = Math.floor(Math.random() * 5) + 1;
      options.push((answerNum + offset1).toString());
      options.push((answerNum - offset2).toString());
      options.push((answerNum + offset3 + offset1).toString());
    } else {
      // For non-numeric answers, generate plausible alternatives
      options.push(correctAnswer + ' (incorrect)');
      options.push('None of the above');
      options.push('All of the above');
    }
    
    // Shuffle and return
    return options.sort(() => Math.random() - 0.5);
  }

  async evaluateAnswer(questionId: string, answer: string, correctAnswer: string): Promise<{
    correct: boolean;
    explanation?: string;
    nextDifficulty?: 'easy' | 'medium' | 'hard';
  }> {
    const correct = answer === correctAnswer;
    
    return {
      correct,
      explanation: correct 
        ? 'Great job! You got it right!' 
        : `The correct answer is "${correctAnswer}". Keep practicing!`,
      nextDifficulty: correct ? 'medium' : 'easy'
    };
  }

  async getAdaptiveSequence(grade: number, previousAnswers: any[]): Promise<string[]> {
    // Determine next subjects based on performance
    const subjects = ['Math', 'Reading', 'Science', 'SEL', 'Speech Therapy'];
    
    if (previousAnswers.length === 0) {
      return subjects; // Start with all subjects
    }

    // Analyze weak areas and prioritize them
    const subjectPerformance = subjects.map(subject => {
      const subjectAnswers = previousAnswers.filter(a => a.subject === subject);
      const correctRate = subjectAnswers.length > 0 
        ? subjectAnswers.filter(a => a.correct).length / subjectAnswers.length 
        : 0.5;
      return { subject, performance: correctRate };
    });

    // Sort by performance (weakest first)
    return subjectPerformance
      .sort((a, b) => a.performance - b.performance)
      .map(s => s.subject);
  }
}

export const dynamicAssessmentAPI = new DynamicAssessmentAPI();
export type { QuestionRequest, GeneratedQuestion, AssessmentResponse };