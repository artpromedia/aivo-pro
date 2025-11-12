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

  constructor() {
    // Use local AI endpoints
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.aivoBaseUrl = import.meta.env.VITE_AIVO_BRAIN_URL || 'http://localhost:8001';
  }

  async generateQuestion(request: QuestionRequest): Promise<AssessmentResponse> {
    try {
      // First try to use LocalAI directly for question generation
      const localAIResponse = await fetch('http://localhost:8080/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'ibm-granite.granite-4.0-1b', // Use the loaded LocalAI model
          messages: [{
            role: 'system',
            content: `You are an educational assessment expert. Create a ${request.difficulty || 'medium'} difficulty ${request.subject} question appropriate for grade ${request.grade}. 

Return your response in this exact JSON format:
{
  "question": "Your question here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer": "Option 1",
  "explanation": "Brief explanation of why this is correct"
}`
          }, {
            role: 'user', 
            content: `Create a ${request.subject} question for grade ${request.grade} at ${request.difficulty} difficulty level.`
          }],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (localAIResponse.ok) {
        const data = await localAIResponse.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          try {
            const questionData = JSON.parse(content);
            return {
              question: {
                id: `ai_${Date.now()}`,
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
            console.warn('Failed to parse AI response:', parseError);
          }
        }
      }
    } catch (error) {
      console.warn('LocalAI not available, trying AIVO Brain:', error);
    }

    try {
      // Fallback to AIVO Brain service
      const response = await fetch(`${this.aivoBaseUrl}/generate-assessment-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade_level: request.grade,
          subject: request.subject,
          previous_performance: request.previousAnswers || [],
          difficulty_preference: request.difficulty || 'medium',
          adaptive: true
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          question: {
            id: `ai_${Date.now()}`,
            subject: data.subject || request.subject,
            question: data.question,
            options: data.options || data.choices,
            correctAnswer: data.correct_answer,
            difficulty: data.difficulty || request.difficulty || 'medium',
            gradeLevel: request.grade,
            explanation: data.explanation
          },
          nextSubject: data.next_subject,
          adjustedDifficulty: data.adjusted_difficulty
        };
      }
    } catch (error) {
      console.warn('AIVO Brain not available, falling back to enhanced mock questions:', error);
    }

    // Fallback to enhanced mock questions based on grade and performance
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
      }
    };

    // Get appropriate question
    const gradeKey = grade.toString();
    const subjectQuestions = questionPools[subject as keyof typeof questionPools];
    
    // Enhanced fallback logic - try different grades and subjects if needed
    let selectedQuestion: any = null;
    let actualGrade = grade;
    let actualSubject = subject;
    
    if (subjectQuestions && subjectQuestions[gradeKey as keyof typeof subjectQuestions]) {
      const difficultyQuestions = subjectQuestions[gradeKey as keyof typeof subjectQuestions][difficulty];
      if (difficultyQuestions && difficultyQuestions.length > 0) {
        selectedQuestion = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
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
            selectedQuestion = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
            actualGrade = tryGrade;
            break;
          }
        }
      }
    }
    
    // If still no question, try different subjects
    if (!selectedQuestion) {
      const subjectsToTry = ['Math', 'Reading', 'Science'];
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
                selectedQuestion = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
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
      selectedQuestion = {
        q: 'What is 1 + 1?',
        options: ['1', '2', '3', '4'],
        correct: '2'
      };
      actualGrade = 1;
      actualSubject = 'Math';
    }

    return {
      question: {
        id: `mock_${Date.now()}`,
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
    const subjects = ['Math', 'Reading', 'Science'];
    
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