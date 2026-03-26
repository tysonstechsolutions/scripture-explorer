// Study notes system - multiple layers of understanding to foster unity and depth

export interface StudyNotes {
  passage: string; // e.g., "John 3:16" or "Genesis 1"

  // CONTEXT - Understanding the setting
  context: {
    historical: string;    // What was happening when written
    cultural: string;      // Customs, daily life, practices
    literary: string;      // Genre, structure, author's purpose
    geographic?: string;   // Where it took place
    audience: string;      // Who was the original audience
  };

  // PERSPECTIVES - Fostering unity through understanding
  perspectives: {
    commonGround: string[];           // What ALL Christians agree on
    differentViews?: {
      view: string;
      traditions: string[];           // Which traditions hold this
      reasoning: string;              // Why they believe this
      heartBehind: string;           // The good intention behind it
    }[];
    unityNote: string;               // How we can still be united
  };

  // DEEP DIVE - Scholarly insights made accessible
  deepDive: {
    keyWords?: {
      word: string;
      original: string;              // Hebrew/Greek
      meaning: string;
      significance: string;
    }[];
    crossReferences: {
      reference: string;
      connection: string;
    }[];
    themes: string[];                // Major biblical themes present
    symbols?: {
      symbol: string;
      meaning: string;
    }[];
  };

  // APPLICATION - Making it personal
  application: {
    thenAndNow: {
      originalMeaning: string;
      modernApplication: string;
    };
    reflectionQuestions: string[];
    prayerPrompt: string;
    actionStep: string;
  };

  // CONNECTIONS - Seeing the big picture
  connections: {
    relatedStories?: string[];
    prophecyLinks?: {
      oldTestament: string;
      newTestament: string;
      connection: string;
    }[];
    jesusConnection: string;         // How does this point to Christ
    bigPicture: string;              // Where this fits in God's story
  };

  // DIFFICULT QUESTIONS - Honest engagement
  difficultQuestions?: {
    question: string;
    honestAnswer: string;
    whatWeKnow: string;
    whatWeTrust: string;             // Faith response
  }[];
}

// For generating AI study notes
export interface StudyPromptContext {
  book: string;
  chapter: number;
  verse?: number;
  content: string;
  translation: string;
}
