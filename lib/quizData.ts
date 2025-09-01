export interface QuizQuestion {
  id: string
  questionType: 'TEXT' | 'IMAGE_REVEAL'
  prompt: string
  imageUrl?: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

export const quizData: Record<string, QuizQuestion[]> = {
  'technology-ai': [
    {
      id: 'tech-1',
      questionType: 'TEXT',
      prompt: 'Which programming language was created by Guido van Rossum and is known for its simplicity and readability?',
      options: ['Java', 'Python', 'JavaScript', 'C++'],
      correctAnswer: 1,
      explanation: 'Python was created by Guido van Rossum in 1991 and is known for its clean, readable syntax.',
      difficulty: 'easy',
      category: 'Technology & AI'
    },
    {
      id: 'tech-2',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What is this AI model architecture?',
      imageUrl: '/images/quiz/transformer-architecture.jpg',
      options: ['CNN', 'Transformer', 'RNN', 'GAN'],
      correctAnswer: 1,
      explanation: 'This is the Transformer architecture, which revolutionized natural language processing.',
      difficulty: 'medium',
      category: 'Technology & AI'
    },
    {
      id: 'tech-3',
      questionType: 'TEXT',
      prompt: 'What does API stand for in software development?',
      options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Program Interface', 'Application Process Integration'],
      correctAnswer: 0,
      explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate.',
      difficulty: 'easy',
      category: 'Technology & AI'
    },
    {
      id: 'tech-4',
      questionType: 'IMAGE_REVEAL',
      prompt: 'Which famous tech company logo is this?',
      imageUrl: '/images/quiz/apple-logo.jpg',
      options: ['Microsoft', 'Apple', 'Google', 'Amazon'],
      correctAnswer: 1,
      explanation: 'This is the Apple logo, one of the most recognizable tech company logos.',
      difficulty: 'easy',
      category: 'Technology & AI'
    },
    {
      id: 'tech-5',
      questionType: 'TEXT',
      prompt: 'What is the primary function of a blockchain?',
      options: ['To store data', 'To create a decentralized ledger', 'To mine cryptocurrency', 'To process transactions'],
      correctAnswer: 1,
      explanation: 'Blockchain creates a decentralized, immutable ledger that records transactions across multiple computers.',
      difficulty: 'medium',
      category: 'Technology & AI'
    }
  ],
  'science-discovery': [
    {
      id: 'sci-1',
      questionType: 'TEXT',
      prompt: 'What is the chemical symbol for gold?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      correctAnswer: 1,
      explanation: 'Au comes from the Latin word "aurum" meaning gold.',
      difficulty: 'easy',
      category: 'Science & Discovery'
    },
    {
      id: 'sci-2',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What planet is this?',
      imageUrl: '/images/quiz/mars-planet.jpg',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      explanation: 'This is Mars, the red planet, known for its distinctive reddish appearance.',
      difficulty: 'easy',
      category: 'Science & Discovery'
    },
    {
      id: 'sci-3',
      questionType: 'TEXT',
      prompt: 'What is the largest organ in the human body?',
      options: ['Heart', 'Brain', 'Liver', 'Skin'],
      correctAnswer: 3,
      explanation: 'The skin is the largest organ, covering approximately 20 square feet in adults.',
      difficulty: 'easy',
      category: 'Science & Discovery'
    },
    {
      id: 'sci-4',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What famous scientist is this?',
      imageUrl: '/images/quiz/einstein.jpg',
      options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Marie Curie'],
      correctAnswer: 1,
      explanation: 'This is Albert Einstein, one of the most famous physicists in history.',
      difficulty: 'easy',
      category: 'Science & Discovery'
    },
    {
      id: 'sci-5',
      questionType: 'TEXT',
      prompt: 'What is the speed of light in a vacuum?',
      options: ['299,792 km/s', '199,792 km/s', '399,792 km/s', '499,792 km/s'],
      correctAnswer: 0,
      explanation: 'The speed of light in a vacuum is approximately 299,792 kilometers per second.',
      difficulty: 'medium',
      category: 'Science & Discovery'
    }
  ],
  'history-culture': [
    {
      id: 'hist-1',
      questionType: 'TEXT',
      prompt: 'In which year did World War II end?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2,
      explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.',
      difficulty: 'easy',
      category: 'History & Culture'
    },
    {
      id: 'hist-2',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What ancient wonder is this?',
      imageUrl: '/images/quiz/pyramids.jpg',
      options: ['Colosseum', 'Pyramids of Giza', 'Parthenon', 'Stonehenge'],
      correctAnswer: 1,
      explanation: 'These are the Pyramids of Giza, one of the Seven Wonders of the Ancient World.',
      difficulty: 'easy',
      category: 'History & Culture'
    },
    {
      id: 'hist-3',
      questionType: 'TEXT',
      prompt: 'Who was the first President of the United States?',
      options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'],
      correctAnswer: 2,
      explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.',
      difficulty: 'easy',
      category: 'History & Culture'
    },
    {
      id: 'hist-4',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What famous painting is this?',
      imageUrl: '/images/quiz/mona-lisa.jpg',
      options: ['The Starry Night', 'Mona Lisa', 'The Scream', 'Girl with a Pearl Earring'],
      correctAnswer: 1,
      explanation: 'This is the Mona Lisa, painted by Leonardo da Vinci in the early 16th century.',
      difficulty: 'easy',
      category: 'History & Culture'
    },
    {
      id: 'hist-5',
      questionType: 'TEXT',
      prompt: 'What year did the Berlin Wall fall?',
      options: ['1987', '1988', '1989', '1990'],
      correctAnswer: 2,
      explanation: 'The Berlin Wall fell on November 9, 1989, marking the end of the Cold War era.',
      difficulty: 'medium',
      category: 'History & Culture'
    }
  ],
  'geography-travel': [
    {
      id: 'geo-1',
      questionType: 'TEXT',
      prompt: 'What is the capital of Japan?',
      options: ['Kyoto', 'Osaka', 'Tokyo', 'Yokohama'],
      correctAnswer: 2,
      explanation: 'Tokyo is the capital and largest city of Japan.',
      difficulty: 'easy',
      category: 'Geography & Travel'
    },
    {
      id: 'geo-2',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What famous landmark is this?',
      imageUrl: '/images/quiz/eiffel-tower.jpg',
      options: ['Big Ben', 'Eiffel Tower', 'Leaning Tower of Pisa', 'Statue of Liberty'],
      correctAnswer: 1,
      explanation: 'This is the Eiffel Tower, an iconic symbol of Paris, France.',
      difficulty: 'easy',
      category: 'Geography & Travel'
    },
    {
      id: 'geo-3',
      questionType: 'TEXT',
      prompt: 'Which is the largest continent by area?',
      options: ['Africa', 'Asia', 'North America', 'Europe'],
      correctAnswer: 1,
      explanation: 'Asia is the largest continent, covering about 30% of Earth\'s land area.',
      difficulty: 'easy',
      category: 'Geography & Travel'
    },
    {
      id: 'geo-4',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What country\'s flag is this?',
      imageUrl: '/images/quiz/brazil-flag.jpg',
      options: ['Argentina', 'Brazil', 'Colombia', 'Peru'],
      correctAnswer: 1,
      explanation: 'This is the flag of Brazil, featuring a green field with a yellow diamond and blue circle.',
      difficulty: 'medium',
      category: 'Geography & Travel'
    },
    {
      id: 'geo-5',
      questionType: 'TEXT',
      prompt: 'What is the highest mountain in the world?',
      options: ['K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse'],
      correctAnswer: 1,
      explanation: 'Mount Everest is the highest mountain above sea level at 8,848 meters.',
      difficulty: 'easy',
      category: 'Geography & Travel'
    }
  ],
  'entertainment-sports': [
    {
      id: 'ent-1',
      questionType: 'TEXT',
      prompt: 'Who directed the movie "Titanic"?',
      options: ['Steven Spielberg', 'James Cameron', 'Christopher Nolan', 'Quentin Tarantino'],
      correctAnswer: 1,
      explanation: 'James Cameron directed "Titanic" which won 11 Academy Awards.',
      difficulty: 'easy',
      category: 'Entertainment & Sports'
    },
    {
      id: 'ent-2',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What famous athlete is this?',
      imageUrl: '/images/quiz/messi.jpg',
      options: ['Cristiano Ronaldo', 'Lionel Messi', 'Neymar', 'Mbappé'],
      correctAnswer: 1,
      explanation: 'This is Lionel Messi, one of the greatest football players of all time.',
      difficulty: 'easy',
      category: 'Entertainment & Sports'
    },
    {
      id: 'ent-3',
      questionType: 'TEXT',
      prompt: 'Which band released the album "The Dark Side of the Moon"?',
      options: ['The Beatles', 'Pink Floyd', 'Led Zeppelin', 'The Rolling Stones'],
      correctAnswer: 1,
      explanation: 'Pink Floyd released "The Dark Side of the Moon" in 1973.',
      difficulty: 'medium',
      category: 'Entertainment & Sports'
    },
    {
      id: 'ent-4',
      questionType: 'IMAGE_REVEAL',
      prompt: 'What movie poster is this?',
      imageUrl: '/images/quiz/avengers.jpg',
      options: ['Iron Man', 'The Avengers', 'Captain America', 'Thor'],
      correctAnswer: 1,
      explanation: 'This is the poster for "The Avengers" (2012), the first Marvel team-up movie.',
      difficulty: 'easy',
      category: 'Entertainment & Sports'
    },
    {
      id: 'ent-5',
      questionType: 'TEXT',
      prompt: 'In which year did the first FIFA World Cup take place?',
      options: ['1930', '1934', '1938', '1950'],
      correctAnswer: 0,
      explanation: 'The first FIFA World Cup was held in Uruguay in 1930.',
      difficulty: 'medium',
      category: 'Entertainment & Sports'
    }
  ]
}

export const getQuizQuestions = (category: string): QuizQuestion[] => {
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return quizData[categoryKey] || []
}

export const getRandomQuestions = (category: string, count: number = 10): QuizQuestion[] => {
  const questions = getQuizQuestions(category)
  const shuffled = questions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
