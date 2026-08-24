// Content for the Feelings Explorer activity.
//
// Authored once, read at runtime, never generated.
//
// STRUCTURE — and why it differs from the classic feelings wheel.
// The printed wheel drills from a core emotion into ever finer *emotion words*
// (anger → bitterness → resentment). That vocabulary is adult, and it answers
// "what exactly am I feeling" rather than "why".
//
// Here the third level is the *situation* instead:
//
//   core emotion  →  the more precise feeling  →  what actually happened
//   כעס            →  קנאה                      →  רוצה מה שיש לו
//
// A child can recognize a situation far more easily than they can pick between
// "מרמור" and "התמרמרות", and the path they end up with is an explanation they
// can say out loud to a parent.
//
// The validating text (`means`) and the conversation opener (`question`) live on
// the BRANCH, not the leaf. One well-written paragraph per feeling beats 72
// thin ones, and the meaning of a feeling does not really change with the situation.

export const CORE = [
  {
    id: 'anger',
    emoji: '😠',
    color: '#D4718A',
    he: { label: 'כעס' },
    en: { label: 'Anger' },
    branches: [
      {
        id: 'frustration',
        emoji: '😤',
        he: {
          label: 'תסכול',
          means: 'תסכול מגיע כשמנסים מאוד ולא מצליחים. הוא סימן שאכפת לך — לא סימן שנכשלת.',
          question: 'מה היה עוזר לך לנסות שוב אחר כך?',
        },
        en: {
          label: 'Frustration',
          means: 'Frustration shows up when you try hard and it does not work. It is a sign that you care, not a sign that you failed.',
          question: 'What would help you try again later?',
        },
        leaves: [
          { id: 'tried', he: 'ניסיתי ולא הצליח', en: 'I tried and it did not work' },
          { id: 'too_long', he: 'זה לוקח יותר מדי זמן', en: 'It is taking far too long' },
          { id: 'not_understood', he: 'אף אחד לא מבין אותי', en: 'Nobody understands me' },
        ],
      },
      {
        id: 'jealousy',
        emoji: '😒',
        he: {
          label: 'קנאה',
          means: 'קנאה היא רגש נורמלי לגמרי, גם אם לא נעים להודות בו. היא מופיעה בדרך כלל כשמשהו חשוב לך מאוד.',
          question: 'מה בדיוק היית רוצה שיהיה גם לך?',
        },
        en: {
          label: 'Jealousy',
          means: 'Jealousy is a completely normal feeling, even if it is uncomfortable to admit. It usually shows up when something matters a lot to you.',
          question: 'What exactly would you like to have too?',
        },
        leaves: [
          { id: 'wants_theirs', he: 'רוצה מה שיש לו', en: 'I want what they have' },
          { id: 'loved_more', he: 'מרגיש שאוהבים אותו יותר', en: 'It feels like they are loved more' },
          { id: 'allowed', he: 'לו מותר ולי אסור', en: 'They are allowed and I am not' },
        ],
      },
      {
        id: 'hurt',
        emoji: '😞',
        he: {
          label: 'עלבון',
          means: 'עלבון כואב כי הוא נוגע בדיוק במקום שבו אכפת לך מה חושבים עליך.',
          question: 'מה היית רוצה שיגידו לך במקום?',
        },
        en: {
          label: 'Feeling hurt',
          means: 'Being hurt stings because it touches exactly the place where you care what others think of you.',
          question: 'What would you have wanted them to say instead?',
        },
        leaves: [
          { id: 'laughed', he: 'צחקו עליי', en: 'They laughed at me' },
          { id: 'said_mean', he: 'אמרו לי משהו פוגע', en: 'Someone said something hurtful' },
          { id: 'ignored', he: 'התעלמו ממני', en: 'They ignored me' },
        ],
      },
      {
        id: 'injustice',
        emoji: '⚖️',
        he: {
          label: 'חוסר צדק',
          means: 'התחושה שמשהו לא הוגן היא אחת החזקות שיש. היא מראה שיש לך תחושת צדק חזקה.',
          question: 'מה היה הופך את זה להוגן בעיניך?',
        },
        en: {
          label: 'Unfairness',
          means: 'The feeling that something is unfair is one of the strongest there is. It shows you have a strong sense of justice.',
          question: 'What would have made it fair in your eyes?',
        },
        leaves: [
          { id: 'blamed', he: 'האשימו אותי בלי סיבה', en: 'I was blamed for no reason' },
          { id: 'only_me', he: 'הענישו רק אותי', en: 'Only I got punished' },
          { id: 'no_explain', he: 'לא נתנו לי להסביר', en: 'They would not let me explain' },
        ],
      },
    ],
  },

  {
    id: 'fear',
    emoji: '😨',
    color: '#E89B8C',
    he: { label: 'פחד' },
    en: { label: 'Fear' },
    branches: [
      {
        id: 'worry',
        emoji: '😟',
        he: {
          label: 'דאגה',
          means: 'דאגה היא המחשבה שמשהו רע יקרה. רוב הדברים שאנחנו דואגים להם לא קורים בסוף.',
          question: 'מה הכי עוזר לך כשאת/ה דואג/ת?',
        },
        en: {
          label: 'Worry',
          means: 'Worry is the thought that something bad will happen. Most of the things we worry about never end up happening.',
          question: 'What helps you most when you worry?',
        },
        leaves: [
          { id: 'something_bad', he: 'משהו רע יקרה', en: 'Something bad will happen' },
          { id: 'will_fail', he: 'לא אצליח במשהו', en: 'I will not manage something' },
          { id: 'someone_hurt', he: 'מישהו שאני אוהב ייפגע', en: 'Someone I love will get hurt' },
        ],
      },
      {
        id: 'startle',
        emoji: '😱',
        he: {
          label: 'בהלה',
          means: 'בהלה קורית מהר מאוד ועוברת מהר יחסית. הגוף פשוט נבהל לפני שהספקת לחשוב.',
          question: 'מה עזר לגוף שלך להירגע אחר כך?',
        },
        en: {
          label: 'Being startled',
          means: 'Being startled happens very fast and passes fairly fast. Your body jumped before you had time to think.',
          question: 'What helped your body settle down afterwards?',
        },
        leaves: [
          { id: 'sudden', he: 'משהו קרה פתאום', en: 'Something happened suddenly' },
          { id: 'loud', he: 'רעש חזק הפתיע אותי', en: 'A loud noise surprised me' },
          { id: 'unclear', he: 'לא ידעתי מה קורה', en: 'I did not know what was going on' },
        ],
      },
      {
        id: 'insecurity',
        emoji: '😬',
        he: {
          label: 'חוסר ביטחון',
          means: 'חוסר ביטחון מופיע בדיוק כשעושים משהו חדש. הוא לא אומר שאת/ה לא מסוגל/ת.',
          question: 'מה כבר הצלחת פעם, למרות שלא היית בטוח/ה?',
        },
        en: {
          label: 'Feeling unsure',
          means: 'Feeling unsure shows up exactly when you do something new. It does not mean you cannot do it.',
          question: 'What did you once manage, even though you were not sure?',
        },
        leaves: [
          { id: 'expectations', he: 'לא יודע מה מצפים ממני', en: 'I do not know what is expected of me' },
          { id: 'everyone_knows', he: 'כולם יודעים חוץ ממני', en: 'Everyone knows except me' },
          { id: 'not_good_enough', he: 'אני לא מספיק טוב בזה', en: 'I am not good enough at this' },
        ],
      },
      {
        id: 'shyness',
        emoji: '😳',
        he: {
          label: 'ביישנות',
          means: 'ביישנות היא לא חיסרון. הרבה אנשים מרגישים אותה, גם כאלה שנראים בטוחים בעצמם.',
          question: 'מה היה עוזר לך להרגיש קצת יותר בנוח שם?',
        },
        en: {
          label: 'Shyness',
          means: 'Shyness is not a flaw. Many people feel it, including ones who look very confident.',
          question: 'What would help you feel a little more comfortable there?',
        },
        leaves: [
          { id: 'watched', he: 'כולם מסתכלים עליי', en: 'Everyone is looking at me' },
          { id: 'nobody_known', he: 'לא מכיר אף אחד כאן', en: 'I do not know anyone here' },
          { id: 'wrong_thing', he: 'מפחד להגיד משהו לא נכון', en: 'I am afraid of saying the wrong thing' },
        ],
      },
    ],
  },

  {
    id: 'love',
    emoji: '🥰',
    color: '#E8C9A0',
    he: { label: 'אהבה' },
    en: { label: 'Love' },
    branches: [
      {
        id: 'affection',
        emoji: '🤗',
        he: {
          label: 'חיבה',
          means: 'חיבה היא הרצון להיות קרוב למישהו. זה אחד הרגשות הכי טובים שיש.',
          question: 'איך את/ה מראה למישהו שאת/ה אוהב/ת אותו?',
        },
        en: {
          label: 'Affection',
          means: 'Affection is wanting to be close to someone. It is one of the best feelings there is.',
          question: 'How do you show someone that you love them?',
        },
        leaves: [
          { id: 'want_near', he: 'רוצה להיות ליד מישהו', en: 'I want to be near someone' },
          { id: 'miss', he: 'מתגעגע למישהו', en: 'I miss someone' },
          { id: 'comfortable', he: 'נעים לי איתו', en: 'I feel good around them' },
        ],
      },
      {
        id: 'belonging',
        emoji: '🫂',
        he: {
          label: 'שייכות',
          means: 'שייכות היא התחושה שיש לך מקום. כל אחד צריך אותה, בכל גיל.',
          question: 'איפה את/ה מרגיש/ה הכי שייך/ת?',
        },
        en: {
          label: 'Belonging',
          means: 'Belonging is the feeling that you have a place. Everyone needs it, at every age.',
          question: 'Where do you feel you belong most?',
        },
        leaves: [
          { id: 'wanted', he: 'רוצים אותי בקבוצה', en: 'They want me in the group' },
          { id: 'have_place', he: 'יש לי מקום', en: 'I have a place' },
          { id: 'saved_seat', he: 'מישהו שמר לי מקום', en: 'Someone saved me a seat' },
        ],
      },
      {
        id: 'appreciation',
        emoji: '🌟',
        he: {
          label: 'הערכה',
          means: 'הערכה מופיעה כשמישהו עשה משהו בשבילך, או פשוט שם לב אליך.',
          question: 'למי היית רוצה להגיד תודה היום?',
        },
        en: {
          label: 'Appreciation',
          means: 'Appreciation shows up when someone did something for you, or simply noticed you.',
          question: 'Who would you like to thank today?',
        },
        leaves: [
          { id: 'did_for_me', he: 'מישהו עשה בשבילי משהו', en: 'Someone did something for me' },
          { id: 'noticed', he: 'שמו לב אליי', en: 'Someone noticed me' },
          { id: 'believed', he: 'מישהו האמין בי', en: 'Someone believed in me' },
        ],
      },
      {
        id: 'safety',
        emoji: '🏡',
        he: {
          label: 'ביטחון',
          means: 'ביטחון הוא לדעת שיש מי שישמור עליך. הוא הבסיס לכל שאר הרגשות הטובים.',
          question: 'מי הכי גורם לך להרגיש בטוח/ה?',
        },
        en: {
          label: 'Feeling safe',
          means: 'Feeling safe is knowing someone will look after you. It is the base for all the other good feelings.',
          question: 'Who makes you feel safest?',
        },
        leaves: [
          { id: 'someone_guards', he: 'יש מי שישמור עליי', en: 'Someone will look after me' },
          { id: 'safe_place', he: 'יש מקום שאני בטוח בו', en: 'There is a place where I feel safe' },
          { id: 'always_returns', he: 'מישהו תמיד חוזר', en: 'Someone always comes back' },
        ],
      },
    ],
  },

  {
    id: 'joy',
    emoji: '😄',
    color: '#9DCB8F',
    he: { label: 'שמחה' },
    en: { label: 'Joy' },
    branches: [
      {
        id: 'pride',
        emoji: '🦁',
        he: {
          label: 'גאווה',
          means: 'גאווה היא ההרגשה שהצלחת במשהו בכוחות עצמך. מותר להיות גאה — זו לא התרברבות.',
          question: 'מה עוד היית רוצה להצליח לעשות לבד?',
        },
        en: {
          label: 'Pride',
          means: 'Pride is the feeling of having managed something on your own. It is allowed to feel proud — that is not showing off.',
          question: 'What else would you like to manage on your own?',
        },
        leaves: [
          { id: 'hard_thing', he: 'הצלחתי במשהו קשה', en: 'I managed something hard' },
          { id: 'by_myself', he: 'עשיתי את זה לבד', en: 'I did it by myself' },
          { id: 'did_not_quit', he: 'לא ויתרתי', en: 'I did not give up' },
        ],
      },
      {
        id: 'excitement',
        emoji: '🤩',
        he: {
          label: 'התרגשות',
          means: 'התרגשות היא שמחה שעוד לא קרתה. בגלל זה היא מרגישה בבטן.',
          question: 'למה את/ה הכי מחכה?',
        },
        en: {
          label: 'Excitement',
          means: 'Excitement is joy that has not happened yet. That is why you feel it in your tummy.',
          question: 'What are you looking forward to most?',
        },
        leaves: [
          { id: 'good_coming', he: 'משהו טוב עומד לקרות', en: 'Something good is about to happen' },
          { id: 'waited_long', he: 'מחכה למשהו כבר הרבה זמן', en: 'I have been waiting a long time' },
          { id: 'new_special', he: 'משהו חדש ומיוחד', en: 'Something new and special' },
        ],
      },
      {
        id: 'delight',
        emoji: '🎉',
        he: {
          label: 'הנאה',
          means: 'הנאה היא פשוט להרגיש טוב עכשיו, בלי סיבה מיוחדת. וזה מספיק.',
          question: 'מה עוד עושה לך טוב ככה?',
        },
        en: {
          label: 'Delight',
          means: 'Delight is simply feeling good right now, for no special reason. And that is enough.',
          question: 'What else makes you feel this good?',
        },
        leaves: [
          { id: 'fun_now', he: 'כיף לי עכשיו', en: 'I am having fun right now' },
          { id: 'love_doing', he: 'אני עושה משהו שאני אוהב', en: 'I am doing something I love' },
          { id: 'laughed', he: 'צחקתי הרבה', en: 'I laughed a lot' },
        ],
      },
      {
        id: 'peace',
        emoji: '😌',
        he: {
          label: 'רוגע',
          means: 'רוגע הוא שמחה שקטה. הוא לא רועש, אבל הוא אחד הדברים הכי טובים שיש.',
          question: 'מתי בדרך כלל את/ה מרגיש/ה ככה?',
        },
        en: {
          label: 'Peacefulness',
          means: 'Peacefulness is quiet joy. It is not loud, but it is one of the best things there is.',
          question: 'When do you usually feel like this?',
        },
        leaves: [
          { id: 'all_ok', he: 'הכול בסדר עכשיו', en: 'Everything is okay right now' },
          { id: 'no_rush', he: 'אין לאן למהר', en: 'There is nowhere to rush to' },
          { id: 'body_good', he: 'נעים לי בגוף', en: 'My body feels good' },
        ],
      },
    ],
  },

  {
    id: 'surprise',
    emoji: '😮',
    color: '#9FB3DE',
    he: { label: 'הפתעה' },
    en: { label: 'Surprise' },
    branches: [
      {
        id: 'astonishment',
        emoji: '😲',
        he: {
          label: 'תדהמה',
          means: 'תדהמה קורית כשמשהו יוצא שונה לגמרי ממה שציפית. לוקח למוח רגע להבין.',
          question: 'מה חשבת שיקרה במקום?',
        },
        en: {
          label: 'Astonishment',
          means: 'Astonishment happens when something turns out completely different from what you expected. Your brain needs a moment to catch up.',
          question: 'What did you think would happen instead?',
        },
        leaves: [
          { id: 'unbelievable', he: 'לא האמנתי שזה קרה', en: 'I could not believe it happened' },
          { id: 'opposite', he: 'זה היה הפוך ממה שחשבתי', en: 'It was the opposite of what I thought' },
          { id: 'confusing_first', he: 'לא הבנתי בהתחלה', en: 'I did not understand at first' },
        ],
      },
      {
        id: 'curiosity',
        emoji: '🔍',
        he: {
          label: 'סקרנות',
          means: 'סקרנות היא הפתעה שהופכת לרצון לדעת עוד. ככה לומדים דברים חדשים.',
          question: 'מה הכי היית רוצה לגלות על זה?',
        },
        en: {
          label: 'Curiosity',
          means: 'Curiosity is surprise that turns into wanting to know more. That is how new things get learned.',
          question: 'What would you most like to find out about it?',
        },
        leaves: [
          { id: 'want_more', he: 'רוצה לדעת עוד', en: 'I want to know more' },
          { id: 'new_thing', he: 'יש כאן משהו שלא הכרתי', en: 'There is something here I did not know' },
          { id: 'want_try', he: 'רוצה לנסות את זה', en: 'I want to try it' },
        ],
      },
      {
        id: 'confusion',
        emoji: '😕',
        he: {
          label: 'בלבול',
          means: 'בלבול זה בסדר גמור. אפשר להרגיש שני דברים ביחד, וזה לא אומר שמשהו לא בסדר.',
          question: 'איזה שני דברים את/ה מרגיש/ה עכשיו?',
        },
        en: {
          label: 'Confusion',
          means: 'Confusion is completely fine. You can feel two things at once, and it does not mean something is wrong.',
          question: 'Which two things are you feeling right now?',
        },
        leaves: [
          { id: 'unclear', he: 'לא ברור לי מה קורה', en: 'I am not clear on what is happening' },
          { id: 'two_things', he: 'אני מרגיש שני דברים ביחד', en: 'I am feeling two things at once' },
          { id: 'dont_know', he: 'לא יודע מה להרגיש', en: 'I do not know what to feel' },
        ],
      },
      {
        id: 'wonder',
        emoji: '✨',
        he: {
          label: 'התלהבות',
          means: 'התלהבות היא הפתעה טובה. היא מראה שמשהו באמת נגע בך.',
          question: 'למי היית רוצה לספר על זה?',
        },
        en: {
          label: 'Wonder',
          means: 'Wonder is a good surprise. It shows that something really touched you.',
          question: 'Who would you like to tell about it?',
        },
        leaves: [
          { id: 'good_surprise', he: 'קיבלתי הפתעה טובה', en: 'I got a lovely surprise' },
          { id: 'better_than', he: 'יצא יותר טוב ממה שציפיתי', en: 'It turned out better than I expected' },
          { id: 'remembered', he: 'מישהו זכר משהו חשוב לי', en: 'Someone remembered something important to me' },
        ],
      },
    ],
  },

  {
    id: 'sadness',
    emoji: '😢',
    color: '#7FC5C0',
    he: { label: 'עצב' },
    en: { label: 'Sadness' },
    branches: [
      {
        id: 'loneliness',
        emoji: '🥺',
        he: {
          label: 'בדידות',
          means: 'בדידות לא אומרת שאף אחד לא אוהב אותך. היא אומרת שחסר לך מישהו עכשיו.',
          question: 'עם מי היית הכי רוצה להיות עכשיו?',
        },
        en: {
          label: 'Loneliness',
          means: 'Loneliness does not mean nobody loves you. It means you are missing someone right now.',
          question: 'Who would you most like to be with right now?',
        },
        leaves: [
          { id: 'no_one_play', he: 'אין לי עם מי לשחק', en: 'I have nobody to play with' },
          { id: 'left_out', he: 'כולם ביחד חוץ ממני', en: 'Everyone is together except me' },
          { id: 'no_one_tell', he: 'אין לי למי לספר', en: 'I have nobody to tell' },
        ],
      },
      {
        id: 'disappointment',
        emoji: '😞',
        he: {
          label: 'אכזבה',
          means: 'אכזבה מגיעה כשציפית למשהו והוא לא קרה. ככל שרצית יותר, כך היא גדולה יותר.',
          question: 'מה היית רוצה שיקרה במקום?',
        },
        en: {
          label: 'Disappointment',
          means: 'Disappointment comes when you expected something and it did not happen. The more you wanted it, the bigger it feels.',
          question: 'What would you have wanted to happen instead?',
        },
        leaves: [
          { id: 'didnt_happen', he: 'ציפיתי למשהו והוא לא קרה', en: 'I expected something and it did not happen' },
          { id: 'broken_promise', he: 'מישהו הבטיח ולא קיים', en: 'Someone promised and did not keep it' },
          { id: 'didnt_get', he: 'רציתי מאוד ולא קיבלתי', en: 'I really wanted it and did not get it' },
        ],
      },
      {
        id: 'longing',
        emoji: '💭',
        he: {
          label: 'געגוע',
          means: 'געגוע הוא עצב מעורבב באהבה. מתגעגעים רק למה שהיה טוב.',
          question: 'מה הדבר שהכי מתגעגע/ת אליו?',
        },
        en: {
          label: 'Longing',
          means: 'Longing is sadness mixed with love. You only long for what was good.',
          question: 'What is the thing you miss most?',
        },
        leaves: [
          { id: 'far_away', he: 'מישהו רחוק ממני', en: 'Someone is far away from me' },
          { id: 'ended', he: 'היה משהו טוב ונגמר', en: 'Something good ended' },
          { id: 'like_before', he: 'רוצה שיהיה כמו שהיה', en: 'I want it to be like it was' },
        ],
      },
      {
        id: 'helplessness',
        emoji: '😔',
        he: {
          label: 'חוסר אונים',
          means: 'התחושה שאי אפשר לשנות משהו היא כבדה מאוד. חשוב לדעת שלא צריך להתמודד איתה לבד.',
          question: 'איזה מבוגר יכול לעזור לך עם זה?',
        },
        en: {
          label: 'Helplessness',
          means: 'The feeling that something cannot be changed is very heavy. It is important to know you do not have to carry it alone.',
          question: 'Which grown-up could help you with this?',
        },
        leaves: [
          { id: 'cant_change', he: 'לא יכול לשנות את זה', en: 'I cannot change it' },
          { id: 'tried_all', he: 'ניסיתי הכול', en: 'I tried everything' },
          { id: 'no_one_helps', he: 'אף אחד לא יכול לעזור', en: 'Nobody can help' },
        ],
      },
    ],
  },
];

export const UI = {
  he: {
    title: 'למה אני מרגיש/ה ככה?',
    subtitle: 'בוחרים רגש, ואז מתקרבים אליו צעד-צעד — עד שמגלים מה בדיוק קרה.',
    centerStart: 'מה אני מרגיש/ה?',
    centerBranch: 'איזה כעס יותר מדויק?',
    stepCore: 'איזה רגש הכי קרוב למה שאת/ה מרגיש/ה?',
    stepBranch: 'איזה מהם מדויק יותר?',
    stepLeaf: 'ומה קרה?',
    otherOption: 'משהו אחר',
    otherMeans: 'לפעמים אין מילה מוכנה למה שקרה, וזה בסדר גמור. גם "משהו אחר" זו תשובה.',
    back: 'צעד אחורה',
    restart: 'להתחיל מהתחלה',
    print: 'להדפיס',
    resultTitle: 'מה שגילית',
    feelingIs: 'הרגש',
    becauseOf: 'ומה שקרה',
    talkAbout: 'שאלה לשיחה',
    parentTipLabel: 'טיפ להורה',
    parentTip: 'המסלול שהילד/ה הגיע/ה אליו חשוב יותר מהמילה בסוף. "כעס ← קנאה ← לו מותר ולי אסור" זה משפט שילד יכול להגיד בקול — וזה בדיוק מה שקשה בלי הכלי הזה.',
    backToActivities: 'חזרה למקום הפעילויות',
  },
  en: {
    title: 'Why Do I Feel This Way?',
    subtitle: 'Pick a feeling, then step closer to it — until you find what exactly happened.',
    centerStart: 'What am I feeling?',
    centerBranch: 'Which one is closer?',
    stepCore: 'Which feeling is closest to what you feel?',
    stepBranch: 'Which one is more exact?',
    stepLeaf: 'And what happened?',
    otherOption: 'Something else',
    otherMeans: 'Sometimes there is no ready-made word for what happened, and that is completely fine. "Something else" is an answer too.',
    back: 'One step back',
    restart: 'Start over',
    print: 'Print',
    resultTitle: 'What you found',
    feelingIs: 'The feeling',
    becauseOf: 'What happened',
    talkAbout: 'A question to talk about',
    parentTipLabel: 'Tip for parents',
    parentTip: 'The path your child arrived at matters more than the final word. "Anger → jealousy → they are allowed and I am not" is a sentence a child can say out loud — and that is exactly what is hard without this tool.',
    backToActivities: 'Back to the Activity Place',
  },
};

export const META = {
  he: {
    title: 'למה אני מרגיש ככה? | גלגל רגשות אינטראקטיבי לילדים | StoryLeap',
    description: 'גלגל רגשות אינטראקטיבי וחינמי לילדים. בוחרים רגש, מתקרבים אליו צעד-צעד, ומגלים מה בדיוק קרה. ללא הרשמה.',
  },
  en: {
    title: 'Why Do I Feel This Way? | Interactive Feelings Wheel for Kids | StoryLeap',
    description: 'A free interactive feelings wheel for children. Pick a feeling, step closer to it, and discover what exactly happened. No signup.',
  },
};
