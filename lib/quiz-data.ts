import { QuizRound } from '../types/global';

// Technology Category Questions
export const TECHNOLOGY_QUIZZES: QuizRound[] = [
  {
    id: "tech-1",
    categoryId: "technology",
    questionType: "TEXT",
    prompt: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Personal Unit", "Computer Processing Unit"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "tech-2",
    categoryId: "technology",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=1",
    blurMaxPx: 24,
    options: ["Apple MacBook", "Dell XPS", "Lenovo ThinkPad", "HP Spectre"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "tech-3",
    categoryId: "technology",
    questionType: "TEXT",
    prompt: "Which programming language was created by Google?",
    options: ["Java", "Python", "Go", "Rust"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "tech-4",
    categoryId: "technology",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=2",
    blurMaxPx: 24,
    options: ["JavaScript", "Python", "React", "Node.js"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "tech-5",
    categoryId: "technology",
    questionType: "TEXT",
    prompt: "What is the main function of RAM?",
    options: ["Long-term storage", "Temporary memory", "Graphics processing", "Network connection"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "tech-6",
    categoryId: "technology",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=3",
    blurMaxPx: 24,
    options: ["Smartphone", "Tablet", "Laptop", "Desktop"],
    correctAnswer: 2,
    durationMs: 30000
  }
];

// Science Category Questions
export const SCIENCE_QUIZZES: QuizRound[] = [
  {
    id: "sci-1",
    categoryId: "science",
    questionType: "TEXT",
    prompt: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Fe", "Cu"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "sci-2",
    categoryId: "science",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=4",
    blurMaxPx: 24,
    options: ["Microscope", "Telescope", "Binoculars", "Magnifying glass"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "sci-3",
    categoryId: "science",
    questionType: "TEXT",
    prompt: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "sci-4",
    categoryId: "science",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=5",
    blurMaxPx: 24,
    options: ["DNA", "RNA", "Protein", "Enzyme"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "sci-5",
    categoryId: "science",
    questionType: "TEXT",
    prompt: "What is the largest organ in the human body?",
    options: ["Heart", "Brain", "Liver", "Skin"],
    correctAnswer: 3,
    durationMs: 30000
  },
  {
    id: "sci-6",
    categoryId: "science",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=6",
    blurMaxPx: 24,
    options: ["Test Tube", "Beaker", "Flask", "Petri Dish"],
    correctAnswer: 1,
    durationMs: 30000
  }
];

// History Category Questions
export const HISTORY_QUIZZES: QuizRound[] = [
  {
    id: "hist-1",
    categoryId: "history",
    questionType: "TEXT",
    prompt: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "hist-2",
    categoryId: "history",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=7",
    blurMaxPx: 24,
    options: ["Eiffel Tower", "Big Ben", "Colosseum", "Taj Mahal"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "hist-3",
    categoryId: "history",
    questionType: "TEXT",
    prompt: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "hist-4",
    categoryId: "history",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=8",
    blurMaxPx: 24,
    options: ["Pyramids of Giza", "Stonehenge", "Machu Picchu", "Petra"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "hist-5",
    categoryId: "history",
    questionType: "TEXT",
    prompt: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "hist-6",
    categoryId: "history",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=9",
    blurMaxPx: 24,
    options: ["Ancient Temple", "Castle", "Palace", "Fortress"],
    correctAnswer: 1,
    durationMs: 30000
  }
];

// Geography Category Questions
export const GEOGRAPHY_QUIZZES: QuizRound[] = [
  {
    id: "geo-1",
    categoryId: "geography",
    questionType: "TEXT",
    prompt: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "India"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "geo-2",
    categoryId: "geography",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=10",
    blurMaxPx: 24,
    options: ["France", "England", "Germany", "Italy"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "geo-3",
    categoryId: "geography",
    questionType: "TEXT",
    prompt: "What is the largest continent?",
    options: ["Africa", "North America", "Asia", "Europe"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "geo-4",
    categoryId: "geography",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=11",
    blurMaxPx: 24,
    options: ["Egypt", "Greece", "Turkey", "Morocco"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "geo-5",
    categoryId: "geography",
    questionType: "TEXT",
    prompt: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "geo-6",
    categoryId: "geography",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=12",
    blurMaxPx: 24,
    options: ["Mountain", "Volcano", "Hill", "Valley"],
    correctAnswer: 0,
    durationMs: 30000
  }
];

// Entertainment Category Questions
export const ENTERTAINMENT_QUIZZES: QuizRound[] = [
  {
    id: "ent-1",
    categoryId: "entertainment",
    questionType: "TEXT",
    prompt: "Who painted the 'Starry Night'?",
    options: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Salvador Dali"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "ent-2",
    categoryId: "entertainment",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=13",
    blurMaxPx: 24,
    options: ["Movie Theater", "Concert Hall", "Opera House", "Stadium"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "ent-3",
    categoryId: "entertainment",
    questionType: "TEXT",
    prompt: "Which band released 'Bohemian Rhapsody'?",
    options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "ent-4",
    categoryId: "entertainment",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=14",
    blurMaxPx: 24,
    options: ["Gaming Console", "Smartphone", "Laptop", "Tablet"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "ent-5",
    categoryId: "entertainment",
    questionType: "TEXT",
    prompt: "What year was the first Star Wars movie released?",
    options: ["1975", "1977", "1979", "1981"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "ent-6",
    categoryId: "entertainment",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=15",
    blurMaxPx: 24,
    options: ["Camera", "Microphone", "Speaker", "Headphones"],
    correctAnswer: 0,
    durationMs: 30000
  }
];

// Gaming Category Questions
export const GAMING_QUIZZES: QuizRound[] = [
  {
    id: "game-1",
    categoryId: "gaming",
    questionType: "TEXT",
    prompt: "Which company developed Minecraft?",
    options: ["Microsoft", "Mojang", "Notch", "EA"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "game-2",
    categoryId: "gaming",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=16",
    blurMaxPx: 24,
    options: ["PlayStation", "Xbox", "Nintendo Switch", "PC"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "game-3",
    categoryId: "gaming",
    questionType: "TEXT",
    prompt: "What year was the first PlayStation released?",
    options: ["1992", "1994", "1996", "1998"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "game-4",
    categoryId: "gaming",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=17",
    blurMaxPx: 24,
    options: ["Super Mario", "Sonic", "Pac-Man", "Tetris"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "game-5",
    categoryId: "gaming",
    questionType: "TEXT",
    prompt: "Which game features a character named Master Chief?",
    options: ["Call of Duty", "Halo", "Gears of War", "Destiny"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "game-6",
    categoryId: "gaming",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=18",
    blurMaxPx: 24,
    options: ["Game Controller", "Keyboard", "Mouse", "Joystick"],
    correctAnswer: 0,
    durationMs: 30000
  }
];

// Art & Design Category Questions
export const ART_DESIGN_QUIZZES: QuizRound[] = [
  {
    id: "art-1",
    categoryId: "art-design",
    questionType: "TEXT",
    prompt: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "art-2",
    categoryId: "art-design",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=19",
    blurMaxPx: 24,
    options: ["Ancient Temple", "Modern Museum", "Art Gallery", "Sculpture Garden"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "art-3",
    categoryId: "art-design",
    questionType: "TEXT",
    prompt: "What is the primary color that represents creativity?",
    options: ["Red", "Blue", "Yellow", "Green"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "art-4",
    categoryId: "art-design",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=20",
    blurMaxPx: 24,
    options: ["Paintbrush", "Pencil", "Marker", "Crayon"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "art-5",
    categoryId: "art-design",
    questionType: "TEXT",
    prompt: "Which art movement was led by Salvador Dali?",
    options: ["Impressionism", "Surrealism", "Cubism", "Abstract Expressionism"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "art-6",
    categoryId: "art-design",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=21",
    blurMaxPx: 24,
    options: ["Canvas", "Paper", "Wood", "Metal"],
    correctAnswer: 0,
    durationMs: 30000
  }
];

// Sports Category Questions
export const SPORTS_QUIZZES: QuizRound[] = [
  {
    id: "sport-1",
    categoryId: "sports",
    questionType: "TEXT",
    prompt: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Argentina", "Brazil", "Italy"],
    correctAnswer: 2,
    durationMs: 30000
  },
  {
    id: "sport-2",
    categoryId: "sports",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=22",
    blurMaxPx: 24,
    options: ["Soccer Ball", "Basketball", "Tennis Ball", "Baseball"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "sport-3",
    categoryId: "sports",
    questionType: "TEXT",
    prompt: "How many players are on a basketball court at once?",
    options: ["8", "10", "12", "14"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "sport-4",
    categoryId: "sports",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=23",
    blurMaxPx: 24,
    options: ["Tennis Court", "Basketball Court", "Volleyball Court", "Badminton Court"],
    correctAnswer: 1,
    durationMs: 30000
  },
  {
    id: "sport-5",
    categoryId: "sports",
    questionType: "TEXT",
    prompt: "Which city hosted the 2020 Olympics?",
    options: ["Tokyo", "Paris", "Los Angeles", "London"],
    correctAnswer: 0,
    durationMs: 30000
  },
  {
    id: "sport-6",
    categoryId: "sports",
    questionType: "IMAGE_REVEAL",
    imageUrl: "https://picsum.photos/800/600?random=24",
    blurMaxPx: 24,
    options: ["Trophy", "Medal", "Cup", "Ribbon"],
    correctAnswer: 0,
    durationMs: 30000
  }
];

// Helper function to get quizzes by category
export function getQuizzesByCategory(category: string): QuizRound[] {
  switch (category.toLowerCase()) {
    case 'technology':
      return TECHNOLOGY_QUIZZES;
    case 'science':
      return SCIENCE_QUIZZES;
    case 'history':
      return HISTORY_QUIZZES;
    case 'geography':
      return GEOGRAPHY_QUIZZES;
    case 'entertainment':
      return ENTERTAINMENT_QUIZZES;
    case 'gaming':
      return GAMING_QUIZZES;
    case 'art-design':
      return ART_DESIGN_QUIZZES;
    case 'sports':
      return SPORTS_QUIZZES;
    default:
      return TECHNOLOGY_QUIZZES; // fallback
  }
}

// Helper function to get a random subset of quizzes
export function getRandomQuizzes(category: string, count: number = 5): QuizRound[] {
  const allQuizzes = getQuizzesByCategory(category);
  const shuffled = [...allQuizzes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allQuizzes.length));
}
