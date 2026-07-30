import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import * as XLSX from 'npm:xlsx@0.18.5';

const HEADERS = {
  he: [
    'תאריך', 'שפה',
    'שם הילד/ה', 'מגדר', 'קישור לתמונת הילד/ה', 'אישור צילום (תמונה)',
    'הכוח הכי גדול שלך', 'הורה - מה הכוח שאתם רואים בו/בה',
    'איך מרגישים לקראת כיתה א', 'הורה - איזה רגש מגיע אליכם',
    'מה נראה קצת מפחיד', 'איך מרגישים בפרידות', 'הורה - מילה/משפט שיכולים לעזור',
    'האדם שהכי אוהב/ת לבלות איתו/ה', 'הורה - מה אותו/ה אדם חושב על כיתה א׳',
    'חברים מהגן שגם עולים לכיתה א', 'אח/ות גדול/ה - מה אמר/ה',
    'תמונה משפחתית 1 - קרבה', 'תמונה משפחתית 1 - קישור',
    'תמונה משפחתית 2 - קרבה', 'תמונה משפחתית 2 - קישור',
    'מה הכי אוהבים לעשות', 'גיבור/ה שהכי אוהב/ת', 'כשקצת לא בנוח - מה הכי עוזר',
    'מה הכי מחכים לו/לה בכיתה א', 'הורה - ממה הייתם מתרגשים בגיל הזה',
    'איזה דבר אחד קצת מדאיג', 'ביקרתם כבר בבית הספר',
    'מה אתה/את מאחל/ת לעצמך', 'הורה - משאלה נוספת',
    'מה לדעתך ההורה שלך מאחל לך', 'הורה - הרגע לומר לו/ה ישירות',
    'אימייל לקשר', 'טלפון לקשר', 'קישור לסיפור', 'אימייל נשלח'
  ],
  en: [
    'Timestamp', 'Language',
    "Child's Name", 'Gender', "Child's Photo Link", 'Photo Consent',
    'Biggest Strength', 'Parent - Strength you see in them',
    'Feelings about starting kindergarten', 'Parent - What feeling comes up for you',
    'What seems a little scary', 'How separations feel', 'Parent - Word/sentence that could help',
    'Person they love spending time with most', 'Parent - What that person thinks about kindergarten',
    'Friends from kindergarten also going', 'Older sibling - What they said',
    'Family Photo 1 - Relationship', 'Family Photo 1 - Link',
    'Family Photo 2 - Relationship', 'Family Photo 2 - Link',
    'What they love doing most', 'Hero/heroine they love', 'When uncomfortable - What helps most',
    'Most looking forward to in kindergarten', 'Parent - What you would have been excited about',
    'One thing that is a bit worrying', 'Visited the school yet',
    'What they wish for themselves', 'Parent - Additional wish',
    'What they think their parent wishes for them', 'Parent - The moment to tell them directly',
    'Contact Email', 'Contact Phone', 'Story Link', 'Email Sent'
  ]
};

const SAMPLE_ROW = {
  he: [
    '2026-07-30 18:00', 'עברית',
    'נועה', 'ילדה', 'https://storage.example.com/child_photo.jpg', 'כן',
    'לעזור', 'אנחנו ראינו כמה את/ה עוזר/ת לחברים',
    'קצת מפחד/ת', 'גם אנחנו קצת מתרגשים',
    'פרידה מאמא/אבא, לא למצוא חברים', 'קצת קשה', 'זה בסדר להרגיש כך, אנחנו כאן איתך',
    'אמא/אבא', 'אנחנו ממש שמחים על כיתה א',
    'חברה שלי דנה', 'אח גדול אמר שזה כיף',
    'אמא', 'https://storage.example.com/mom.jpg',
    'סבתא', 'https://storage.example.com/grandma.jpg',
    'לצייר/ליצור, לשחק בחוץ, לשיר/לרקוד', 'ספיידרמן', 'חיבוק',
    'חברים חדשים', 'היינו מתרגשים מהתיק החדש',
    'שלא אדע לקרוא', 'פעם אחת',
    'חבר טוב', 'שתהיה לי גם חברה חדשה',
    'שתהיה שמח/ה', 'אנחנו כל כך גאים בך ואוהבים אותך',
    'parent@example.com', '050-1234567', 'https://storyleap.example.com/story/kita-1001', 'TRUE'
  ],
  en: [
    '2026-07-30 18:00', 'English',
    'Noah', 'Boy', 'https://storage.example.com/child_photo.jpg', 'Yes',
    'Helping', 'We see how much you help your friends',
    'A little scared', 'I feel a bit excited too',
    'Separation from mom/dad, Not making friends', 'A little hard', "It's okay to feel this way, we're here with you",
    'Mom/Dad', 'We are so happy about kindergarten',
    'My friend Mia', 'Older brother said it is fun',
    'Mom', 'https://storage.example.com/mom.jpg',
    'Grandma', 'https://storage.example.com/grandma.jpg',
    'Drawing/Creating, Playing outside, Singing/Dancing', 'Spider-Man', 'Hug',
    'New friends', 'I was excited about the new backpack',
    'Not knowing how to read', 'Once',
    'A good friend', 'That I also make a new friend',
    'To be happy', 'We are so proud of you and love you',
    'parent@example.com', '+1-555-0123', 'https://storyleap.example.com/story/kindergarten-1001', 'TRUE'
  ]
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const lang = body.lang === 'he' ? 'he' : 'en';

    const sheetData = [HEADERS[lang], SAMPLE_ROW[lang]];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, lang === 'he' ? 'כיתה א' : 'Kindergarten');

    const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const filename = lang === 'he' ? 'StoryLeap_KitaAlef_Hebrew_Sample.xlsx' : 'StoryLeap_Kindergarten_English_Sample.xlsx';

    return Response.json({ filename, base64 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}