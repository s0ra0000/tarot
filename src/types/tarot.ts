// types/tarot.ts

export interface TarotCard {
  name: string;
  number: string;
  arcana: string;
  suit: string;
  img: string;
  fortune_telling: string[];
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  Archetype: string;
  "Hebrew Alphabet": string;
  Numerology: string;
  Elemental: string;
  MythicalSpiritual: string;
  "Questions to Ask": string[];
}

export interface TranslateResponse {
  translatedText: string;
}

export interface ChatGPTResponse {
  response: string;
}
