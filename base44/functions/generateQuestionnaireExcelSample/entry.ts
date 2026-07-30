import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import * as XLSX from 'npm:xlsx@0.18.5';

const HEADERS = {
  he: [
    'חותמת זמן', 'שפה', 'מזהה הזמנה', 'מזהה משתמש (אימייל)', 'מחיר', 'מטבע', 'קרדיטים שנוצלו',
    'שם הילד/ה', 'גיל', 'מגדר', 'קישור לתמונת הילד/ה', 'אישור הורה (תמונת ילד/ה)',
    'קישור לתמונת ההורה', 'מי בתמונה (אמא/אבא)', 'עולם הסיפור', 'אתגר רגשי',
    'תיאור הטריגר', 'תגובת הילד/ה', 'מה הילד/ה אוהב/ת', 'אימייל לקשר', 'טלפון לקשר',
    'קישור לסיפור', 'אימייל נשלח'
  ],
  en: [
    'Timestamp', 'Language', 'Order ID', 'User ID (Email)', 'Price', 'Currency', 'Credits Used',
    "Child's Name", 'Age', 'Gender', "Child's Photo Link", 'Parent Consent (Child Photo)',
    "Parent's Photo Link", 'Whose Photo (Mom/Dad)', 'Story World', 'Emotional Challenge',
    'Trigger Description', "Child's Reaction", 'What the Child Loves', 'Contact Email', 'Contact Phone',
    'Story Link', 'Email Sent'
  ]
};

const SAMPLE_ROW = {
  he: [
    '2026-07-30 16:36', 'עברית', 'ORD-10234', 'parent@example.com', 149, 'ILS', 110,
    'נועה', 6, 'ילדה', 'https://storage.example.com/child_photo.jpg', 'כן',
    'https://storage.example.com/parent_photo.jpg', 'אמא', 'חלל', 'פחדים',
    'לילה בחושך מפחיד אותה', 'בכי', 'ציור וריקוד', 'parent@example.com', '050-1234567',
    'https://storyleap.example.com/story/10234', 'TRUE'
  ],
  en: [
    '2026-07-30 16:36', 'English', 'ORD-10234', 'parent@example.com', 40, 'USD', 110,
    'Noah', 6, 'Boy', 'https://storage.example.com/child_photo.jpg', 'Yes',
    'https://storage.example.com/parent_photo.jpg', 'Mom', 'Space', 'Fears',
    'He is scared of the dark at night', 'Crying', 'Drawing and dancing', 'parent@example.com', '+1-555-0123',
    'https://storyleap.example.com/story/10234', 'TRUE'
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
    XLSX.utils.book_append_sheet(workbook, worksheet, lang === 'he' ? 'שאלון' : 'Questionnaire');

    const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const filename = lang === 'he' ? 'StoryLeap_Questionnaire_Hebrew_Sample.xlsx' : 'StoryLeap_Questionnaire_English_Sample.xlsx';

    return Response.json({ filename, base64 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}