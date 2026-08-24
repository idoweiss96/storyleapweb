// Content for the Emotion Wheel activity.
//
// Everything the activity ever shows is authored here, once. Nothing is generated
// at runtime and nothing is fetched — the wheel works offline and forever.
// Each emotion carries three prompts that are cycled through on repeat landings,
// so playing again stays fresh without a single model call.

export const EMOTIONS = [
  {
    id: 'joy',
    color: '#FFC94D',
    emoji: '😄',
    he: {
      label: 'שמחה',
      prompts: [
        'מתי הרגשת שמחה בפעם האחרונה?',
        'מה גורם לך לחייך בלי בכלל לשים לב?',
        'עם מי הכי כיף לך לשמוח יחד?',
      ],
    },
    en: {
      label: 'Happy',
      prompts: [
        'When did you last feel happy?',
        'What makes you smile without even noticing?',
        'Who is the most fun to be happy with?',
      ],
    },
  },
  {
    id: 'sad',
    color: '#7BA7D9',
    emoji: '😢',
    he: {
      label: 'עצב',
      prompts: [
        'מה עוזר לך כשאת/ה עצוב/ה?',
        'איפה בגוף את/ה מרגיש/ה את העצב?',
        'למי את/ה הכי אוהב/ת לספר כשקשה לך?',
      ],
    },
    en: {
      label: 'Sad',
      prompts: [
        'What helps you when you feel sad?',
        'Where in your body do you feel the sadness?',
        'Who do you most like telling when things are hard?',
      ],
    },
  },
  {
    id: 'anger',
    color: '#FF8A6B',
    emoji: '😠',
    he: {
      label: 'כעס',
      prompts: [
        'מה קורה לגוף שלך כשאת/ה כועס/ת?',
        'מה עוזר לכעס להירגע?',
        'על מה כעסת השבוע?',
      ],
    },
    en: {
      label: 'Angry',
      prompts: [
        'What happens in your body when you get angry?',
        'What helps the anger calm down?',
        'What made you angry this week?',
      ],
    },
  },
  {
    id: 'calm',
    color: '#6FD0C4',
    emoji: '😌',
    he: {
      label: 'רוגע',
      prompts: [
        'איפה את/ה מרגיש/ה הכי רגוע/ה?',
        'מה עוזר לך להירגע לפני השינה?',
        'איך נראה רגע רגוע אצלך?',
      ],
    },
    en: {
      label: 'Calm',
      prompts: [
        'Where do you feel calmest?',
        'What helps you settle down before bed?',
        'What does a calm moment look like for you?',
      ],
    },
  },
  {
    id: 'excited',
    color: '#FF6FB5',
    emoji: '🤩',
    he: {
      label: 'התרגשות',
      prompts: [
        'למה את/ה הכי מחכה עכשיו?',
        'מה מרגש אותך כל כך שקשה לחכות?',
        'איך מרגישה התרגשות בבטן?',
      ],
    },
    en: {
      label: 'Excited',
      prompts: [
        'What are you looking forward to most right now?',
        'What excites you so much it is hard to wait?',
        'How does excitement feel in your tummy?',
      ],
    },
  },
  {
    id: 'scared',
    color: '#9B8FD8',
    emoji: '😨',
    he: {
      label: 'פחד',
      prompts: [
        'ממה קצת פחדת, ובכל זאת עשית?',
        'מי עוזר לך כשאת/ה מפחד/ת?',
        'מה את/ה אומר/ת לעצמך כשמשהו מפחיד?',
      ],
    },
    en: {
      label: 'Scared',
      prompts: [
        'What were you a little scared of, but did anyway?',
        'Who helps you when you feel scared?',
        'What do you tell yourself when something is scary?',
      ],
    },
  },
  {
    id: 'proud',
    color: '#7DCE82',
    emoji: '🦁',
    he: {
      label: 'גאווה',
      prompts: [
        'במה את/ה הכי גאה בעצמך?',
        'מה למדת לעשות לבד לאחרונה?',
        'איזה דבר קטן הצלחת אחרי שניסית שוב?',
      ],
    },
    en: {
      label: 'Proud',
      prompts: [
        'What are you proudest of about yourself?',
        'What did you recently learn to do on your own?',
        'What small thing worked out after you tried again?',
      ],
    },
  },
  {
    id: 'confused',
    color: '#B0B7C9',
    emoji: '😕',
    he: {
      label: 'בלבול',
      prompts: [
        'מתי הרגשת שאת/ה לא בטוח/ה מה את/ה מרגיש/ה?',
        'מה עוזר כשהכול מבולבל בפנים?',
        'אפשר להרגיש שני רגשות ביחד? מתי זה קרה לך?',
      ],
    },
    en: {
      label: 'Confused',
      prompts: [
        'When did you feel unsure about what you were feeling?',
        'What helps when everything feels mixed up inside?',
        'Can you feel two things at once? When did that happen?',
      ],
    },
  },
];

export const UI = {
  he: {
    title: 'גלגל הרגשות',
    subtitle: 'מסובבים את הגלגל, ומדברים על הרגש שיצא. אין תשובות נכונות.',
    spin: 'לסובב את הגלגל',
    spinning: 'מסתובב...',
    again: 'לסובב שוב',
    landedOn: 'יצא לך',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'אין כאן תשובה נכונה או לא נכונה. מספיק להקשיב, ולשתף גם רגע אחד שלכם.',
    back: 'חזרה למקום הפעילויות',
    instructions: 'לחצו על הכפתור כדי לסובב',
  },
  en: {
    title: 'The Emotion Wheel',
    subtitle: 'Spin the wheel, then talk about the feeling it lands on. There are no right answers.',
    spin: 'Spin the wheel',
    spinning: 'Spinning...',
    again: 'Spin again',
    landedOn: 'You got',
    parentTipLabel: 'Tip for parents',
    parentTip: 'There is no right or wrong answer here. Listening is enough — and sharing one moment of your own.',
    back: 'Back to the Activity Place',
    instructions: 'Press the button to spin',
  },
};

export const META = {
  he: {
    title: 'גלגל הרגשות | משחק חינמי לילדים | StoryLeap',
    description: 'משחק חינמי שעוזר לילדים לזהות ולדבר על רגשות. מסובבים את הגלגל ומקבלים שאלה פותחת שיחה. ללא הרשמה.',
  },
  en: {
    title: 'The Emotion Wheel | Free Game for Kids | StoryLeap',
    description: 'A free game that helps children name and talk about feelings. Spin the wheel and get a conversation-opening question. No signup.',
  },
};
