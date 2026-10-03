export type Choice = {
  text: string;
  isCorrect: boolean;
  impact: number;
  feedback: string;
};

export type Step = {
  title: string;
  context: string;
  choices: Choice[];
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: Step[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "soko-bargaining",
    title: "Bargaining at the Market",
    description: "Negotiate a fair price for a hand-carved mask at a local craft market.",
    category: "Shopping",
    steps: [
      {
        title: "The Initial Greeting",
        context: "You've spotted a beautiful hand-carved mask. An older gentleman (Mzee) is sitting by the stall. How do you start?",
        choices: [
          { text: "Habari yako mzee?", isCorrect: true, impact: 25, feedback: "Excellent! Respecting elders (Heshima) is the best start." },
          { text: "Nipe bei ya hii.", isCorrect: false, impact: -10, feedback: "Too blunt! It's rude to talk business before saying hello." }
        ]
      },
      {
        title: "Asking the Price",
        context: "He responds warmly. Now, how do you ask what the mask costs?",
        choices: [
          { text: "Hii ni shilingi ngapi?", isCorrect: true, impact: 25, feedback: "Perfect. You're asking politely 'How many shillings is this?'" },
          { text: "Kwanini ghali hivi?", isCorrect: false, impact: -15, feedback: "Careful! Asking 'Why is it so expensive?' before hearing the price is aggressive." }
        ]
      },
      {
        title: "The Counter-Offer",
        context: "He says it's 50,000 TZS. You want to ask for a small discount. What do you say?",
        choices: [
          { text: "Punguza kidogo basi?", isCorrect: true, impact: 25, feedback: "Great! Adding 'basi' makes it a friendly request rather than a demand." },
          { text: "Hiyo ni bei mbaya!", isCorrect: false, impact: -20, feedback: "Ouch. Calling his price a 'bad price' is insulting to his craftsmanship." }
        ]
      },
      {
        title: "Closing the Deal",
        context: "He agrees to 40,000 TZS. You hand over the cash. How do you finish?",
        choices: [
          { text: "Asante sana!", isCorrect: true, impact: 25, feedback: "Perfect! You've made a friend and got a fair price." },
          { text: "Haya, nimeenda.", isCorrect: false, impact: -5, feedback: "A bit cold. In a market, a 'thank you' goes a long way." }
        ]
      }
    ]
  },
  {
    id: "customer-care",
    title: "Customer Care Agent",
    description: "Call customer support to resolve an issue with your internet bundle.",
    category: "Services",
    steps: [
      {
        title: "Explaining the Issue",
        context: "The agent answers: 'Karibu, nikusaidie vipi?' (Welcome, how can I help?). How do you explain your internet isn't working?",
        choices: [
          { text: "Mtandao wangu haufanyi kazi unavyo faa", isCorrect: true, impact: 30, feedback: "Good! 'Mtandao wangu haufanyi kazi unavyo faa' means 'My network isn't working as it should'." },
          { text: "Mbona mnaniibia pesa?", isCorrect: false, impact: -20, feedback: "Very aggressive! Accusing them of stealing right away won't help you." }
        ]
      },
      {
        title: "Providing Details",
        context: "The agent asks: 'Tafadhali nipe namba yako ya simu.' (Please give me your phone number).",
        choices: [
          { text: "Namba yangu ni...", isCorrect: true, impact: 35, feedback: "Polite and direct." },
          { text: "Si unayo hapo kwenye mfumo?", isCorrect: false, impact: -15, feedback: "Saying 'Don't you have it in your system?' is dismissive and rude." }
        ]
      },
      {
        title: "Resolution",
        context: "The agent resets your connection and asks you to restart your phone.",
        choices: [
          { text: "Sawa, asante kwa msaada.", isCorrect: true, impact: 35, feedback: "Perfectly polite closing thanking them for their help." },
          { text: "Bora, ilikuwa inakera sana.", isCorrect: false, impact: -10, feedback: "Complaining at the end leaves a bad impression." }
        ]
      }
    ]
  },
  {
    id: "sharing-milestone",
    title: "Sharing a Personal Milestone",
    description: "You just got a promotion at work and want to share the good news with a close friend.",
    category: "Social",
    steps: [
      {
        title: "Breaking the News",
        context: "You meet your friend at a cafe. How do you share the news?",
        choices: [
          { text: "Nina habari njema! Nimepandishwa cheo.", isCorrect: true, impact: 35, feedback: "Awesome! 'I have good news! I have been promoted.'" },
          { text: "Mimi ni bosi sasa, wewe bado.", isCorrect: false, impact: -20, feedback: "Too arrogant! Don't put your friend down to lift yourself up." }
        ]
      },
      {
        title: "Responding to Congratulations",
        context: "Your friend says: 'Hongera sana rafiki yangu!' (Congratulations my friend!).",
        choices: [
          { text: "Asante sana! Nimefurahi mno.", isCorrect: true, impact: 35, feedback: "Great! Showing gratitude and sharing your joy." },
          { text: "Najua, nilistahili.", isCorrect: false, impact: -15, feedback: "Saying 'I know, I deserved it' can sound a bit haughty in Swahili culture." }
        ]
      },
      {
        title: "Celebrating Together",
        context: "You want to offer to buy them a drink to celebrate.",
        choices: [
          { text: "Leo ninalipa, agiza chochote.", isCorrect: true, impact: 30, feedback: "Very generous! 'Today I am paying, order anything.'" },
          { text: "Nunua vinywaji, mimi nimepanda cheo.", isCorrect: false, impact: -20, feedback: "Telling them to buy drinks because you got promoted is backwards and rude!" }
        ]
      }
    ]
  },
  {
    id: "public-transport",
    title: "Navigating the Daladala",
    description: "Pay your fare and ask the conductor to drop you at your stop.",
    category: "Travel",
    steps: [
      {
        title: "Paying the Fare",
        context: "The conductor (konda) approaches and says 'Nauli tafadhali' (Fare please).",
        choices: [
          { text: "Nauli yangu hii hapa.", isCorrect: true, impact: 30, feedback: "Correct and polite. 'Here is my fare.'" },
          { text: "Subiri kwanza.", isCorrect: false, impact: -10, feedback: "'Wait first' can annoy a busy conductor." }
        ]
      },
      {
        title: "Asking for Change",
        context: "You gave a 10,000 note, but your fare is 500. You need your change (chenji).",
        choices: [
          { text: "Naomba chenji yangu ya elfu kumi.", isCorrect: true, impact: 35, feedback: "Perfect. Asking politely for your change." },
          { text: "We konda, lete hela yangu!", isCorrect: false, impact: -20, feedback: "Too aggressive. Calling him 'We konda' and demanding money will start a fight." }
        ]
      },
      {
        title: "Alighting",
        context: "Your stop is approaching.",
        choices: [
          { text: "Shusha kijiweni tafadhali.", isCorrect: true, impact: 35, feedback: "Standard way to ask to be dropped at the next stop." },
          { text: "Simamisha gari sasa hivi!", isCorrect: false, impact: -15, feedback: "'Stop the car right now!' is demanding and dangerous in traffic." }
        ]
      }
    ]
  },
  {
    id: "restaurant-ordering",
    title: "At the Restaurant",
    description: "Order a meal and ask for the bill at a local eatery.",
    category: "Dining",
    steps: [
      {
        title: "Getting the Menu",
        context: "You sit down at a table. The waiter approaches.",
        choices: [
          { text: "Naomba menu tafadhali.", isCorrect: true, impact: 30, feedback: "Polite request for the menu." },
          { text: "Niletee chakula chap chap!", isCorrect: false, impact: -15, feedback: "Demanding food 'chop chop' (quickly) is very disrespectful." }
        ]
      },
      {
        title: "Placing the Order",
        context: "The waiter asks what you'd like to eat.",
        choices: [
          { text: "Niletee wali maharage na maji baridi.", isCorrect: true, impact: 35, feedback: "Clear and polite. 'Bring me rice with beans and cold water.'" },
          { text: "Kuna nini kizuri hapa?", isCorrect: false, impact: -5, feedback: "Not terribly wrong, but can be confusing if you already have the menu." }
        ]
      },
      {
        title: "Asking for the Bill",
        context: "You've finished your delicious meal and want to leave.",
        choices: [
          { text: "Naomba bili tafadhali.", isCorrect: true, impact: 35, feedback: "The standard and polite way to ask for the bill." },
          { text: "Nalipa shilingi ngapi leo?", isCorrect: false, impact: -10, feedback: "A bit informal. 'Naomba bili' is more standard in a restaurant." }
        ]
      }
    ]
  },
  {
    id: "asking-directions",
    title: "Asking for Directions",
    description: "You are lost and need to ask a local for directions to the hospital.",
    category: "Travel",
    steps: [
      {
        title: "Getting Attention",
        context: "You see someone walking by. How do you stop them to ask?",
        choices: [
          { text: "Samahani, naweza kuuliza swali?", isCorrect: true, impact: 35, feedback: "'Excuse me, can I ask a question?' Very polite." },
          { text: "Wewe! Njoo hapa.", isCorrect: false, impact: -25, feedback: "'You! Come here.' Extremely rude." }
        ]
      },
      {
        title: "Asking the Question",
        context: "They stop and say 'Ndio, karibu'.",
        choices: [
          { text: "Hospitali ya mkoa iko wapi?", isCorrect: true, impact: 35, feedback: "Clear and direct. 'Where is the regional hospital?'" },
          { text: "Nimepotea, nisaidie.", isCorrect: false, impact: -10, feedback: "While true, it's better to state exactly what you are looking for." }
        ]
      },
      {
        title: "Showing Gratitude",
        context: "They give you directions: 'Nenda moja kwa moja, kisha kunja kulia.'",
        choices: [
          { text: "Asante sana kwa msaada wako.", isCorrect: true, impact: 30, feedback: "Thanking them for their help." },
          { text: "Sawa.", isCorrect: false, impact: -10, feedback: "Too brief. Always say 'Asante' (Thank you)." }
        ]
      }
    ]
  },
  {
    id: "supermarket-shopping",
    title: "At the Supermarket",
    description: "Buy everyday groceries and interact with the cashier.",
    category: "Shopping",
    steps: [
      {
        title: "Finding an Item",
        context: "You can't find the sugar. You ask an attendant.",
        choices: [
          { text: "Samahani, sukari iko wapi?", isCorrect: true, impact: 30, feedback: "Polite and clear." },
          { text: "Sukari iko wapi?", isCorrect: false, impact: -10, feedback: "Forgot 'Samahani' (Excuse me). It's always better to start with it." }
        ]
      },
      {
        title: "At the Counter",
        context: "You place your items on the counter. The cashier greets you: 'Karibu'.",
        choices: [
          { text: "Asante.", isCorrect: true, impact: 30, feedback: "A simple 'Thank you' is the correct response to 'Karibu'." },
          { text: "Fanya haraka.", isCorrect: false, impact: -20, feedback: "'Hurry up' is very rude." }
        ]
      },
      {
        title: "Paying",
        context: "The total is 15,000 TZS. You hand them a card.",
        choices: [
          { text: "Nalipa kwa kadi.", isCorrect: true, impact: 40, feedback: "Perfect. 'I am paying by card.'" },
          { text: "Chukua kadi.", isCorrect: false, impact: -15, feedback: "'Take the card' is a bit too commanding." }
        ]
      }
    ]
  },
  {
    id: "hospital-visit",
    title: "At the Hospital",
    description: "Describe your symptoms to a doctor or nurse.",
    category: "Health",
    steps: [
      {
        title: "Greeting the Doctor",
        context: "You enter the consultation room.",
        choices: [
          { text: "Shikamoo daktari. / Habari daktari.", isCorrect: true, impact: 30, feedback: "Respectful greeting to a professional." },
          { text: "Nipe dawa.", isCorrect: false, impact: -25, feedback: "You can't demand medicine before even being diagnosed!" }
        ]
      },
      {
        title: "Describing Symptoms",
        context: "The doctor asks: 'Unasumbuliwa na nini?' (What is troubling you?).",
        choices: [
          { text: "Nasikia maumivu ya kichwa na homa.", isCorrect: true, impact: 40, feedback: "Clear description: 'I feel a headache and fever.'" },
          { text: "Sijisikii vizuri tu.", isCorrect: false, impact: -10, feedback: "Too vague. 'I just don't feel well' doesn't help the doctor much." }
        ]
      },
      {
        title: "Receiving Prescription",
        context: "The doctor writes a prescription and explains how to take the medicine.",
        choices: [
          { text: "Sawa, nimeelewa. Asante.", isCorrect: true, impact: 30, feedback: "Politely confirming you understand the instructions." },
          { text: "Hizi dawa ni nyingi sana.", isCorrect: false, impact: -10, feedback: "Complaining about the prescription can come across as uncooperative." }
        ]
      }
    ]
  },
  {
    id: "workplace-meeting",
    title: "At the Workplace",
    description: "Greet your colleagues and discuss a project update.",
    category: "Professional",
    steps: [
      {
        title: "Morning Greeting",
        context: "You arrive at the office and see your manager.",
        choices: [
          { text: "Habari za asubuhi bosi?", isCorrect: true, impact: 30, feedback: "Professional and polite morning greeting." },
          { text: "Mambo vipi bosi?", isCorrect: false, impact: -15, feedback: "Too casual for most professional environments in Swahili culture." }
        ]
      },
      {
        title: "Project Update",
        context: "The manager asks about the status of the weekly report.",
        choices: [
          { text: "Ripoti ipo tayari, nitakutumia sasa hivi.", isCorrect: true, impact: 40, feedback: "Great! 'The report is ready, I will send it to you right now.'" },
          { text: "Bado sijamaliza, nilisahau.", isCorrect: false, impact: -20, feedback: "Unprofessional to just say 'I haven't finished, I forgot'." }
        ]
      },
      {
        title: "Ending the Conversation",
        context: "The manager says 'Sawa, kazi njema' (Okay, have a good work day).",
        choices: [
          { text: "Asante, na kwako pia.", isCorrect: true, impact: 30, feedback: "'Thank you, and to you too.' A perfect professional closing." },
          { text: "Haya.", isCorrect: false, impact: -10, feedback: "Too brief and dismissive." }
        ]
      }
    ]
  },
  {
    id: "introducing-yourself",
    title: "Introducing Yourself",
    description: "Meet someone new at a social gathering and introduce yourself.",
    category: "Social",
    steps: [
      {
        title: "The Icebreaker",
        context: "You are at a community event and sit next to someone you don't know.",
        choices: [
          { text: "Hujambo? Naitwa [Jina Lako].", isCorrect: true, impact: 35, feedback: "A warm and standard introduction. 'Hello, my name is...'" },
          { text: "Wewe ni nani?", isCorrect: false, impact: -20, feedback: "'Who are you?' is too direct and abrupt." }
        ]
      },
      {
        title: "Asking About Them",
        context: "They reply: 'Sijambo, mimi ni Ali. Nimefurahi kukutana nawe.'",
        choices: [
          { text: "Na mimi pia. Unatokea wapi?", isCorrect: true, impact: 35, feedback: "Polite reciprocation and a nice follow-up question: 'Me too. Where are you from?'" },
          { text: "Sawa.", isCorrect: false, impact: -15, feedback: "A one-word 'Okay' ends the conversation awkwardly." }
        ]
      },
      {
        title: "Parting Ways",
        context: "The event is starting and you need to end the chat.",
        choices: [
          { text: "Tutaongea baadaye, karibu.", isCorrect: true, impact: 30, feedback: "'We will talk later, welcome.' Friendly parting." },
          { text: "Naondoka sasa.", isCorrect: false, impact: -10, feedback: "'I am leaving now' is a bit abrupt without a nice sign-off." }
        ]
      }
    ]
  }
];
