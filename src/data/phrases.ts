export interface Phrase {
  id: string;
  swahili_text: string;
  english_translation: string;
  phonetic_spelling: string;
  audio_url: string;
  politeness_rating: number;
  cultural_note: string;
  category: string;
}

export const CATEGORIES = [
  "Greetings & Basics",
  "Essentials",
  "Food & Drink",
  "Shopping",
  "Time & Direction",
  "Feelings & Opinions",
  "Noun Classes (M-Wa)",
  "Verbs",
  "Adverbs"
];

export const MOCK_PHRASES: Phrase[] = [
  {
    id: "1",
    swahili_text: "Shikamoo",
    english_translation: "I respect your age",
    phonetic_spelling: "Shee-kah-moh",
    audio_url: "/audio/shikamoo.mp3",
    politeness_rating: 5,
    cultural_note: "Greeting for elders. Always use this first.",
    category: "Greetings & Basics"
  },
  {
    id: "2",
    swahili_text: "Sitaki, asante",
    english_translation: "I don't want it, thank you",
    phonetic_spelling: "See-tah-kee ah-sahn-te",
    audio_url: "/audio/sitaki.mp3",
    politeness_rating: 3,
    cultural_note: "Firm but polite way to decline vendors.",
    category: "Essentials"
  },
  {
    id: "3",
    swahili_text: "Naomba maji",
    english_translation: "I'd like water",
    phonetic_spelling: "Nah-ohm-bah mah-jee",
    audio_url: "/audio/maji.mp3",
    politeness_rating: 4,
    cultural_note: "Polite request using 'Naomba' (I pray/ask for).",
    category: "Food & Drink"
  },
  {
    id: "4",
    swahili_text: "Punguza kidogo",
    english_translation: "Reduce price a little",
    phonetic_spelling: "Poon-goo-zah kee-doh-go",
    audio_url: "/audio/punguza.mp3",
    politeness_rating: 2,
    cultural_note: "Casual market slang for haggling.",
    category: "Shopping"
  },
  {
    id: "5",
    swahili_text: "Asante sana",
    english_translation: "Thank you very much",
    phonetic_spelling: "Ah-sahn-te sah-nah",
    audio_url: "/audio/asante.mp3",
    politeness_rating: 4,
    cultural_note: "Standard expression of gratitude.",
    category: "Greetings & Basics"
  },
  {
    id: "6",
    swahili_text: "Habari yako",
    english_translation: "How are you?",
    phonetic_spelling: "Hah-bah-ree yah-koh",
    audio_url: "/audio/habari.mp3",
    politeness_rating: 4,
    cultural_note: "A respectful standard greeting for 'What's your news?'",
    category: "Greetings & Basics"
  },
  {
    id: "7",
    swahili_text: "Jambo",
    english_translation: "Hello",
    phonetic_spelling: "Jahm-boh",
    audio_url: "/audio/jambo.mp3",
    politeness_rating: 3,
    cultural_note: "Tourist-friendly general greeting. Locals might use 'Mambo' or 'Habari'.",
    category: "Greetings & Basics"
  },
  {
    id: "8",
    swahili_text: "Karibu",
    english_translation: "Welcome / You're welcome",
    phonetic_spelling: "Kah-ree-boo",
    audio_url: "/audio/karibu.mp3",
    politeness_rating: 5,
    cultural_note: "Used to invite someone in or in response to 'Asante'.",
    category: "Greetings & Basics"
  },
  {
    id: "9",
    swahili_text: "Ndio",
    english_translation: "Yes",
    phonetic_spelling: "Nn-dee-oh",
    audio_url: "/audio/ndio.mp3",
    politeness_rating: 4,
    cultural_note: "General affirmation.",
    category: "Essentials"
  },
  {
    id: "10",
    swahili_text: "Hapana",
    english_translation: "No",
    phonetic_spelling: "Hah-pah-nah",
    audio_url: "/audio/hapana.mp3",
    politeness_rating: 3,
    cultural_note: "Direct negation. Add 'asante' to soften it.",
    category: "Essentials"
  },
  {
    id: "11",
    swahili_text: "Tafadhali",
    english_translation: "Please",
    phonetic_spelling: "Tah-fah-dhah-lee",
    audio_url: "/audio/tafadhali.mp3",
    politeness_rating: 5,
    cultural_note: "Essential word for polite requests.",
    category: "Essentials"
  },
  {
    id: "12",
    swahili_text: "Samahani",
    english_translation: "Excuse me / Sorry",
    phonetic_spelling: "Sah-mah-hah-nee",
    audio_url: "/audio/samahani.mp3",
    politeness_rating: 5,
    cultural_note: "Use to get attention or apologize.",
    category: "Essentials"
  },
  {
    id: "13",
    swahili_text: "Pole",
    english_translation: "Sorry (for your misfortune)",
    phonetic_spelling: "Poh-leh",
    audio_url: "/audio/pole.mp3",
    politeness_rating: 5,
    cultural_note: "An expression of empathy when someone is hurt, sick, or tired.",
    category: "Essentials"
  },
  {
    id: "14",
    swahili_text: "Kwaheri",
    english_translation: "Goodbye",
    phonetic_spelling: "Kwah-heh-ree",
    audio_url: "/audio/kwaheri.mp3",
    politeness_rating: 4,
    cultural_note: "Standard parting farewell.",
    category: "Greetings & Basics"
  },
  {
    id: "15",
    swahili_text: "Tutaonana",
    english_translation: "See you later",
    phonetic_spelling: "Too-tah-oh-nah-nah",
    audio_url: "/audio/tutaonana.mp3",
    politeness_rating: 4,
    cultural_note: "Casual 'we will see each other' farewell.",
    category: "Greetings & Basics"
  },
  {
    id: "16",
    swahili_text: "Sawa",
    english_translation: "Okay",
    phonetic_spelling: "Sah-wah",
    audio_url: "/audio/sawa.mp3",
    politeness_rating: 3,
    cultural_note: "The most common way to agree or say 'fine'.",
    category: "Essentials"
  },
  {
    id: "17",
    swahili_text: "Rafiki",
    english_translation: "Friend",
    phonetic_spelling: "Rah-fee-kee",
    audio_url: "/audio/rafiki.mp3",
    politeness_rating: 4,
    cultural_note: "Often used to address someone warmly.",
    category: "Greetings & Basics"
  },
  {
    id: "18",
    swahili_text: "Chakula",
    english_translation: "Food",
    phonetic_spelling: "Chah-koo-lah",
    audio_url: "/audio/chakula.mp3",
    politeness_rating: 3,
    cultural_note: "General word for food or a meal.",
    category: "Food & Drink"
  },
  {
    id: "19",
    swahili_text: "Nina njaa",
    english_translation: "I am hungry",
    phonetic_spelling: "Nee-nah nn-jah",
    audio_url: "/audio/njaa.mp3",
    politeness_rating: 3,
    cultural_note: "Literally 'I have hunger'.",
    category: "Food & Drink"
  },
  {
    id: "20",
    swahili_text: "Nina kiu",
    english_translation: "I am thirsty",
    phonetic_spelling: "Nee-nah kee-oo",
    audio_url: "/audio/kiu.mp3",
    politeness_rating: 3,
    cultural_note: "Literally 'I have thirst'.",
    category: "Food & Drink"
  },
  {
    id: "21",
    swahili_text: "Bei gani?",
    english_translation: "How much is this?",
    phonetic_spelling: "Bay gah-nee",
    audio_url: "/audio/bei.mp3",
    politeness_rating: 3,
    cultural_note: "Crucial phrase for markets.",
    category: "Shopping"
  },
  {
    id: "22",
    swahili_text: "Hapa",
    english_translation: "Here",
    phonetic_spelling: "Hah-pah",
    audio_url: "/audio/hapa.mp3",
    politeness_rating: 3,
    cultural_note: "Used for pointing or giving taxi directions ('stop here').",
    category: "Time & Direction"
  },
  {
    id: "23",
    swahili_text: "Kesho",
    english_translation: "Tomorrow",
    phonetic_spelling: "Keh-shoh",
    audio_url: "/audio/kesho.mp3",
    politeness_rating: 3,
    cultural_note: "Common in 'Tutaonana kesho' (See you tomorrow).",
    category: "Time & Direction"
  },
  {
    id: "24",
    swahili_text: "Sasa",
    english_translation: "Now",
    phonetic_spelling: "Sah-sah",
    audio_url: "/audio/sasa.mp3",
    politeness_rating: 3,
    cultural_note: "Used for time, or as slang 'Sasa?' meaning 'What's up?'",
    category: "Time & Direction"
  },
  {
    id: "25",
    swahili_text: "Baadaye",
    english_translation: "Later",
    phonetic_spelling: "Bah-dah-yeh",
    audio_url: "/audio/baadaye.mp3",
    politeness_rating: 3,
    cultural_note: "Often used in passing or to delay something.",
    category: "Time & Direction"
  },
  {
    id: "26",
    swahili_text: "Nzuri",
    english_translation: "Good / Fine",
    phonetic_spelling: "Nn-zoo-ree",
    audio_url: "/audio/nzuri.mp3",
    politeness_rating: 4,
    cultural_note: "Standard response to 'Habari?' (How are you?).",
    category: "Feelings & Opinions"
  },
  {
    id: "27",
    swahili_text: "Mbaya",
    english_translation: "Bad",
    phonetic_spelling: "Mm-bah-yah",
    audio_url: "/audio/mbaya.mp3",
    politeness_rating: 2,
    cultural_note: "Use carefully. Often used to describe 'Bei mbaya' (a bad/expensive price).",
    category: "Feelings & Opinions"
  },
  {
    id: "28",
    swahili_text: "Kidogo",
    english_translation: "A little",
    phonetic_spelling: "Kee-doh-goh",
    audio_url: "/audio/kidogo.mp3",
    politeness_rating: 3,
    cultural_note: "Useful when someone asks if you speak Swahili: 'Kidogo tu' (Just a little).",
    category: "Feelings & Opinions"
  },
  {
    id: "29",
    swahili_text: "Chakula kitamu",
    english_translation: "Delicious food",
    phonetic_spelling: "Chah-koo-lah kee-tah-moo",
    audio_url: "/audio/kitamu.mp3",
    politeness_rating: 5,
    cultural_note: "A great compliment to give any host or cook.",
    category: "Food & Drink"
  },
  {
    id: "30",
    swahili_text: "Nina furaha",
    english_translation: "I am happy",
    phonetic_spelling: "Nee-nah foo-rah-hah",
    audio_url: "/audio/furaha.mp3",
    politeness_rating: 4,
    cultural_note: "Share your positive feelings!",
    category: "Feelings & Opinions"
  },
  {
    id: "31",
    swahili_text: "Mtu",
    english_translation: "Person",
    phonetic_spelling: "Mm-too",
    audio_url: "/audio/mtu.mp3",
    politeness_rating: 3,
    cultural_note: "Noun Class 1 (M-wa) singular.",
    category: "Noun Classes (M-Wa)"
  },
  {
    id: "32",
    swahili_text: "Watu",
    english_translation: "People",
    phonetic_spelling: "Wah-too",
    audio_url: "/audio/watu.mp3",
    politeness_rating: 3,
    cultural_note: "Noun Class 2 (M-wa) plural.",
    category: "Noun Classes (M-Wa)"
  },
  {
    id: "33",
    swahili_text: "Mtoto",
    english_translation: "Child",
    phonetic_spelling: "Mm-toh-toh",
    audio_url: "/audio/mtoto.mp3",
    politeness_rating: 3,
    cultural_note: "Noun Class 1 (M-wa) singular.",
    category: "Noun Classes (M-Wa)"
  },
  {
    id: "34",
    swahili_text: "Watoto",
    english_translation: "Children",
    phonetic_spelling: "Wah-toh-toh",
    audio_url: "/audio/watoto.mp3",
    politeness_rating: 3,
    cultural_note: "Noun Class 2 (M-wa) plural.",
    category: "Noun Classes (M-Wa)"
  },
  {
    id: "35",
    swahili_text: "Kula",
    english_translation: "To eat",
    phonetic_spelling: "Koo-lah",
    audio_url: "/audio/kula.mp3",
    politeness_rating: 3,
    cultural_note: "A common infinitive verb.",
    category: "Verbs"
  },
  {
    id: "36",
    swahili_text: "Kunywa",
    english_translation: "To drink",
    phonetic_spelling: "Koo-nywah",
    audio_url: "/audio/kunywa.mp3",
    politeness_rating: 3,
    cultural_note: "A common infinitive verb.",
    category: "Verbs"
  },
  {
    id: "37",
    swahili_text: "Kwenda",
    english_translation: "To go",
    phonetic_spelling: "Kwen-dah",
    audio_url: "/audio/kwenda.mp3",
    politeness_rating: 3,
    cultural_note: "A common motion verb.",
    category: "Verbs"
  },
  {
    id: "38",
    swahili_text: "Kuona",
    english_translation: "To see",
    phonetic_spelling: "Koo-oh-nah",
    audio_url: "/audio/kuona.mp3",
    politeness_rating: 3,
    cultural_note: "Often used in 'Tutaonana' (We will see each other).",
    category: "Verbs"
  },
  {
    id: "39",
    swahili_text: "Haraka",
    english_translation: "Quickly",
    phonetic_spelling: "Hah-rah-kah",
    audio_url: "/audio/haraka.mp3",
    politeness_rating: 3,
    cultural_note: "Often used as 'Haraka haraka' (Hurry up).",
    category: "Adverbs"
  },
  {
    id: "40",
    swahili_text: "Polepole",
    english_translation: "Slowly",
    phonetic_spelling: "Poh-leh poh-leh",
    audio_url: "/audio/polepole.mp3",
    politeness_rating: 4,
    cultural_note: "'Polepole ndio mwendo' (Slowly is the way to go).",
    category: "Adverbs"
  },
  {
    id: "41",
    swahili_text: "Sana",
    english_translation: "Very / A lot",
    phonetic_spelling: "Sah-nah",
    audio_url: "/audio/sana.mp3",
    politeness_rating: 3,
    cultural_note: "Used to amplify adjectives, e.g., 'Asante sana'.",
    category: "Adverbs"
  },
  {
    id: "42",
    swahili_text: "Kweli",
    english_translation: "Truly / Really",
    phonetic_spelling: "Kweh-lee",
    audio_url: "/audio/kweli.mp3",
    politeness_rating: 3,
    cultural_note: "Can be used as an adverb or a question ('Kweli?').",
    category: "Adverbs"
  }
];
