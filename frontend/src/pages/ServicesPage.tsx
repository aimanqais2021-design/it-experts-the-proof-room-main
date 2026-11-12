import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_SERVICES, getWhatsAppUrl } from '../data/fallbackData';
import { ServiceItem } from '../types';
import { RevisionBanner } from '../components/RevisionBanner';

export const ServicesPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="luxury-card rounded-2xl p-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3.5 py-1 text-xs font-bold text-[#C9A45C]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('ENGINEERING & ACADEMIC SOLUTIONS CATALOG', 'دليل الخدمات الهندسية والأكاديمية المتكاملة')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            'Production-Grade Engineering Across 6 Core Technology Pillars',
            'حلول هندسية وبحثية بمستوى إنتاجي عبر 6 ركائز تقنية رئيسية'
          )}
        </h1>
        <p className="max-w-3xl text-sm text-gray-300">
          {t(
            'Every engagement includes clean source code, reproducible environment configurations, quantitative evaluation reports, and walkthrough sessions — protected by our Free Revision Policy.',
            'يشمل كل مشروع كوداً مصدرياً منظماً، وإعدادات بيئة قابلة لإعادة التشغيل، وتقارير تقييم رقمية، وجلسات شرح مفصلة — مع شمول كافة المشاريع بسياسة التعديلات المجانية.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((srv) => (
          <div key={srv.slug} className="luxury-card rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A45C]/15 text-[#C9A45C]">
                  <Layers className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-[#C9A45C]/40 bg-[#090B10] px-3 py-1 font-mono text-xs font-bold text-[#C9A45C]">
                  {srv.starting_timeline}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#F1E9D8]">
                {lang === 'ar' ? srv.title_ar : srv.title_en}
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                {lang === 'ar' ? srv.description_ar : srv.description_en}
              </p>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9A45C] mb-2">
                  {t('Standard Deliverables:', 'المخرجات القياسية المشمولة:')}
                </div>
                <ul className="space-y-2 text-xs text-gray-300">
                  {(lang === 'ar' ? srv.deliverables_ar : srv.deliverables_en).map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                to="/free-review"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A45C] py-2.5 text-xs font-bold text-[#090B10] hover:bg-[#E4C580] transition"
              >
                <span>{t('Request Free Assessment', 'اطلب تقييماً مجانياً لهذه الخدمة')}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href={getWhatsAppUrl(`Hello IT EXPERTS! I want to inquire about service: ${srv.title_en}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t('Inquire on WhatsApp', 'استفسر عبر واتساب')}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <RevisionBanner />
    </div>
  );
};
