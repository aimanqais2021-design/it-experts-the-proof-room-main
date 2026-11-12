import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, CheckCircle, Terminal, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl, WHATSAPP_PHONE } from '../data/fallbackData';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#C9A45C]/20 bg-[#090B10] pt-14 pb-10 text-sm text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A45C] text-[#090B10]">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-lg font-bold text-[#F1E9D8]">IT EXPERTS</span>
            </div>
            <p className="mt-2 text-xs font-semibold tracking-wider text-[#C9A45C]">
              {t('YOUR IT WORLD. OUR EXPERTISE.', 'عالمك التقني.. خبرتنا الموثقة.')}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              {t(
                "THE PROOF ROOM: Don't take our word for it. See what we can build. Verified AI, Computer Vision, NLP, Full-Stack, Networking, and Research engineering.",
                'غرفة الإثبات: لا تكتفِ بكلامنا، شاهد ما نبنيه بالأدلة الموثقة في الذكاء الاصطناعي، الرؤية الحاسوبية، تطبيقات الويب، الشبكات، والبحث العلمي.'
              )}
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
              {t('Platform Navigation', 'روابط المنصة')}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/proof-room" className="hover:text-[#C9A45C] transition">
                  {t('The Proof Room (12 Verified Projects)', 'غرفة الإثبات (12 مشروعاً موثقاً)')}
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-[#C9A45C] transition">
                  {t('Interactive Technical Challenges', 'التحديات التقنية التفاعلية')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#C9A45C] transition">
                  {t('Engineering & Academic Services', 'الخدمات الهندسية والأكاديمية')}
                </Link>
              </li>
              <li>
                <Link to="/free-review" className="hover:text-[#C9A45C] transition">
                  {t('Free Initial Tech Check', 'الفحص التقني الأولي المجاني')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C9A45C] transition">
                  {t('Free Revision Policy', 'سياسة التعديلات المجانية')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
              {t('Verification Guarantees', 'ضمانات التحقق والجودة')}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('SHA-256 Verified Execution Evidence', 'أدلة تشغيل موثقة بتوقيع SHA-256')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('Free Revisions Within Agreed Scope', 'تعديلات مجانية ضمن النطاق المتفق عليه')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[#C9A45C]" />
                <span>{t('Open-Source License Attribution', 'توثيق كامل للتراخيص والمصادر المفتوحة')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-[#C9A45C]" />
                <Link to="/admin" className="hover:text-[#C9A45C]">
                  {t('Private Administration Portal', 'بوابة الإدارة المحمية')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
              {t('Direct Engineering Desk', 'التواصل المباشر مع المهندسين')}
            </h3>
            <p className="mt-3 text-xs text-gray-300">
              {t('WhatsApp Direct Line:', 'الخط المباشر عبر واتساب:')}
            </p>
            <p className="mt-1 font-mono text-sm font-bold text-[#F1E9D8]" dir="ltr">
              {WHATSAPP_PHONE}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t('Chat on WhatsApp Now', 'تحدث معنا عبر واتساب الآن')}</span>
              </a>
              <Link
                to="/free-review"
                className="inline-flex items-center justify-center rounded-lg border border-[#C9A45C]/40 bg-[#171A20] px-4 py-2 text-xs font-semibold text-[#C9A45C] hover:bg-[#C9A45C]/10 transition"
              >
                {t('Submit Project Specification', 'إرسال تفاصيل المشروع للتقييم المجاني')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} IT EXPERTS — THE PROOF ROOM. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            {t(
              'Built with React 18, TypeScript, Tailwind CSS, FastAPI & Verified Local GPU Execution.',
              'تم البناء باستخدام React 18 و TypeScript و FastAPI مع توثيق التنفيذ الفعلي.'
            )}
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Direct Contact"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">{t('WhatsApp Engineer', 'تواصل واتساب')}</span>
      </a>
    </footer>
  );
};
