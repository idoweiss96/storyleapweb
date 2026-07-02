import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '../LanguageContext';

export default function TermsOfUseModal({ open, onOpenChange }) {
  const { lang } = useLanguage();
  const isHe = lang === 'he';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col" dir={isHe ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#1E293B' }}>
            {isHe ? 'תנאי שימוש – העלאת תמונת ילד/ה' : 'Terms of Use – Child Photo Upload'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-2" style={{ maxHeight: '60vh' }}>
          <div className="text-sm text-slate-700 leading-relaxed space-y-4">
            {isHe ? (
              <>
                <section>
                  <h3 className="font-bold text-slate-800 mb-1">1. הסכמה להעלאת תמונה</h3>
                  <p>
                    בהעלותך תמונה של הילד/ה למערכת StoryLeap, את/ה מצהיר/ה בזאת כי הינך הורה או אפוטרופוס חוקי של הילד/ה המופיע/ה בתמונה, וכי ברשותך הסמכות המלאה להעניק את ההסכמה לשימוש בתמונה בהתאם לתנאים אלה.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">2. מטרת השימוש בתמונה</h3>
                  <p>
                    התמונה תשמש אך ורק לשם יצירת סיפור אישי ומותאם עבור הילד/ה. לא נעשה שימוש בתמונה לכל מטרה שיווקית, פרסומית, מסחרית או אחרת, ללא הסכמתך המפורשת בכתב מראש.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">3. שמירת התמונה ומחיקתה</h3>
                  <p>
                    אנו מתחייבים כי התמונה תאוחסן במאגר המאובטח שלנו לתקופה שלא תעלה על חודש אחד (30 ימים) ממועד ההעלאה. בתום תקופה זו, או עם השלמת יצירת הסיפור (לפי המוקדם), התמונה תימחק באופן מלא וקבוע מכל מאגרי המידע שלנו, לרבות גיבויים, ולא ניתן יהיה לשחזרה.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">4. שיתוף מידע עם צדדים שלישיים</h3>
                  <p>
                    התמונה ופרטי הילד/ה לא יועברו, יימכרו או ישותפו עם כל צד שלישי, למעט ספקי שירותים חיצוניים המסייעים בתהליך יצירת הסיפור (כגון שירותי בינה מלאכותית), וזאת אך ורק לשם ביצוע השירות ובכפוף להסכמי סודיות מחמירים. ספקים אלו מחויבים למחוק את המידע לאחר השימוש.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">5. אבטחת מידע</h3>
                  <p>
                    אנו נוקטים באמצעים טכניים וארגוניים סבירים להגנה על התמונה ועל פרטיך האישיים מפני גישה לא מורשית, שינוי או השמדה. עם זאת, יובהר כי אין אבטחה מוחלטת באינטרנט.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">6. זכות ביטול ומחיקה מוקדמת</h3>
                  <p>
                    בכל עת, וטרם תום תקופת החודש, רשאי/ת לפנות אלינו בבקשה למחיקה מיידית של התמונה ממאגרינו, ואנו נפעל למחוק את התמונה בהקדם האפשרי, לא יאוחר מ-7 ימי עסקים ממועד הבקשה.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">7. שמירת הסיפור המוגמר</h3>
                  <p>
                    לאחר מחיקת התמונה, הסיפור שנוצר יישמר בחשבונך ויישאר זמין עבורך. הסיפור אינו מכיל את התמונה המקורית, אלא תוכן טקסטואלי בלבד.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">8. שינויים בתנאי השימוש</h3>
                  <p>
                    אנו רשאים לעדכן תנאים אלה מעת לעת. הגרסה המעודכנת תפורסם בעמוד זה, והמשך השימוש בשירות לאחר העדכון מהווה הסכמה לתנאים המעודכנים.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">9. יישוב מחלוקות ודין חל</h3>
                  <p>
                    תנאים אלה כפופים לדיני מדינת ישראל. כל מחלוקת הנוגעת לתנאים אלה תידון בבתי המשפט המוסמכים בישראל, ככל שלא נקבע אחרת בחקיקה.
                  </p>
                </section>

                <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  בסימון תיבת ההסכמה בטופס, את/ה מאשר/ת כי קראת את תנאי השימוש והבנת אותם במלואם.
                </p>
              </>
            ) : (
              <>
                <section>
                  <h3 className="font-bold text-slate-800 mb-1">1. Consent to Photo Upload</h3>
                  <p>
                    By uploading a photo of your child to the StoryLeap platform, you represent and warrant that you are the parent or legal guardian of the child depicted in the photo, and that you have full authority to provide consent for the use of the photo under these terms.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">2. Purpose of Use</h3>
                  <p>
                    The photo will be used solely for the purpose of creating a personalized story for your child. We will not use the photo for any marketing, promotional, commercial, or other purpose without your prior explicit written consent.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">3. Photo Retention and Deletion</h3>
                  <p>
                    We commit to storing the photo in our secure database for a period not exceeding one month (30 days) from the date of upload. Upon expiration of this period, or upon completion of the story (whichever is earlier), the photo will be permanently and irrevocably deleted from all of our databases, including backups, and cannot be recovered.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">4. Information Sharing with Third Parties</h3>
                  <p>
                    The photo and your child's details will not be transferred, sold, or shared with any third party, except for external service providers who assist in the story creation process (such as AI services), solely for the purpose of providing the service and subject to strict confidentiality agreements. Such providers are required to delete the information after use.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">5. Data Security</h3>
                  <p>
                    We take reasonable technical and organizational measures to protect the photo and your personal information from unauthorized access, alteration, or destruction. However, please note that no security on the internet is absolute.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">6. Right to Cancel and Early Deletion</h3>
                  <p>
                    At any time, and prior to the expiration of the one-month period, you may request immediate deletion of the photo from our database, and we will act to delete the photo as soon as possible, no later than 7 business days from the date of the request.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">7. Retention of the Finished Story</h3>
                  <p>
                    After the photo is deleted, the created story will remain saved in your account and available to you. The story does not contain the original photo, but textual content only.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">8. Changes to Terms of Use</h3>
                  <p>
                    We may update these terms from time to time. The updated version will be published on this page, and continued use of the service after the update constitutes agreement to the updated terms.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-slate-800 mb-1">9. Dispute Resolution and Governing Law</h3>
                  <p>
                    These terms are governed by the laws of the State of Israel. Any dispute relating to these terms will be heard in the competent courts in Israel, unless otherwise provided by law.
                  </p>
                </section>

                <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  By checking the consent box in the form, you confirm that you have read and fully understood the Terms of Use.
                </p>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}