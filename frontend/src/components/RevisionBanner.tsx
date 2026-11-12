import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RevisionBanner: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t('100% Free Revisions in Scope', 'تعديلات مجانية 100% ضمن النطاق المتفق عليه'),
      desc: t(
        'Every adjustment, parameter tuning, or refinement within your original agreed project scope carries zero extra cost.',
        'جميع التعديلات وضبط المعاملات والتحسينات ضمن النطاق الفني المتفق عليه مجانية تماماً بدون أي رسوم إضافية.'
      ),
    },
    {
      title: t('Zero-Cost Defect & Bug Fixes', 'إصلاح مجاني لأي أخطاء أو نواقص برمجية'),
      desc: t(
        'Any runtime error, edge-case bug, or incomplete agreed requirement is resolved immediately free of charge.',
        'تتم معالجة أي أخطاء برمجية أو استكمال أي متطلبات متفق عليها فوراً وبشكل مجاني بالكامل.'
      ),
    },
    {
      title: t('Continuous Follow-Up Until Approval', 'متابعة مستمرة حتى الاعتماد النهائي'),
      desc: t(
        'We stay with you through testing, code walkthroughs, and final validation until your deliverable is approved.',
        'نبقى معك خطوة بخطوة خلال الاختبار وشرح الكود والمراجعة حتى يتم اعتماد مشروعك النهائي بنجاح.'
      ),
    },
    {
      title: t('Transparent Scope & Honest Integrity', 'شفافية النطاق ونزاهة هندسية وأكاديمية'),
      desc: t(
        'New features outside the original scope are quoted transparently. We guarantee working software — never misleading grade promises.',
        'الإضافات الجديدة خارج الاتفاق الأولي تسعّر بوضوح، ونضمن كوداً يعمل فعلياً وتوثيقاً علمياً دون وعود درجات مضللة.'
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#C9A45C]/40 bg-gradient-to-br from-[#171A20] via-[#12151B] to-[#090B10] p-6 sm:p-10 shadow-goldGlow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-[#C9A45C]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3.5 py-1 text-xs font-bold tracking-wider text-[#C9A45C]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('IRONCLAD CLIENT PROTECTION POLICY', 'سياسة ضمان العميل والتعديلات المجانية')}</span>
          </div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-[#F1E9D8]">
            {t("WE DON'T LEAVE YOU HALFWAY.", 'لا نتركك في منتصف الطريق.')}
          </h2>
          <p className="mt-1 text-lg font-bold text-[#C9A45C]">
            {t('FREE REVISIONS — NO EXTRA FEES.', 'تعديلات مجانية — بدون أي رسوم إضافية.')}
          </p>
        </div>

        <Link
          to="/free-review"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#C9A45C] px-6 py-3.5 text-sm font-bold text-[#090B10] shadow-goldGlow hover:bg-[#E4C580] transition"
        >
          <span>{t('Start With a Free Tech Check', 'ابدأ بفحص تقني مجاني لمشروعك')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {pillars.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 rounded-xl border border-white/5 bg-[#090B10]/70 p-4"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A45C]" />
            <div>
              <h3 className="text-sm font-bold text-[#F1E9D8]">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
