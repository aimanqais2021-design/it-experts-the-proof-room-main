import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl, WHATSAPP_PHONE } from '../data/fallbackData';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  const quickTopics = [
    {
      label: t('AI & Computer Vision Thesis / Project', 'مشروع أو رسالة ذكاء اصطناعي ورؤية حاسوبية'),
      msg: 'Hello IT EXPERTS! I want to discuss an AI / Computer Vision project.',
    },
    {
      label: t('NLP, Arabic LLMs & Document RAG', 'مشروع معالجة لغات طبيعية ونظام RAG'),
      msg: 'Hello IT EXPERTS! I want to discuss an NLP / RAG Document Intelligence project.',
    },
    {
      label: t('Full-Stack Web & Database System', 'تطبيق ويب متكامل وقاعدة بيانات'),
      msg: 'Hello IT EXPERTS! I want to discuss a Full-Stack Web & Database platform.',
    },
    {
      label: t('Networking, Cybersecurity or Simulation Lab', 'محاكاة شبكات أو أمن سيبراني أو محاكاة هندسية'),
      msg: 'Hello IT EXPERTS! I want to discuss a Networking / Cybersecurity / Engineering Simulation project.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="luxury-card rounded-2xl p-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
          {t('DIRECT ENGINEERING CONCIERGE', 'مكتب التواصل الهندسي المباشر')}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            'Speak Directly With Our Lead Engineers',
            'تواصل مباشرة مع مهندسينا لمناقشة مشروعك'
          )}
        </h1>
        <p className="max-w-2xl text-sm text-gray-300">
          {t(
            'Reach us instantly via WhatsApp with pre-filled service messages or submit a structured Free Tech Check with attachments.',
            'تواصل معنا فوراً عبر واتساب برسائل مجهزة حسب نوع الخدمة، أو أرسل طلب فحص تقني مجاني مرفقاً بملفات مشروعك.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* WhatsApp Direct Card */}
        <div className="luxury-card rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F1E9D8]">
                {t('WhatsApp Priority Engineering Line', 'خط واتساب الهندسي السريع')}
              </h2>
              <p className="font-mono text-sm font-bold text-[#C9A45C]" dir="ltr">
                {WHATSAPP_PHONE}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300">
            {t(
              'Select your project domain below to launch WhatsApp with a pre-filled technical brief:',
              'اختر مجال مشروعك أدناه لفتح محادثة واتساب برسالة فنية مجهزة مسبقاً:'
            )}
          </p>

          <div className="space-y-2.5">
            {quickTopics.map((topic, idx) => (
              <a
                key={idx}
                href={getWhatsAppUrl(topic.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#090B10] px-4 py-3 text-xs font-semibold text-[#F1E9D8] hover:border-emerald-500/50 hover:text-emerald-400 transition"
              >
                <span>{topic.label}</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Structured Free Tech Check CTA */}
        <div className="luxury-card rounded-2xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#C9A45C]/15 px-3 py-1 text-xs font-bold text-[#C9A45C]">
              <Sparkles className="h-4 w-4" />
              <span>{t('STRUCTURED PROJECT INTAKE', 'نموذج الفحص التقني المهيكل')}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F1E9D8]">
              {t(
                'Have a PDF Specification, Rubric, or Dataset Sample?',
                'هل لديك ملف متطلبات PDF أو معايير تقييم أو عينة بيانات؟'
              )}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
              {t(
                'Use our Free Tech Check portal to upload your specification documents, receive an official tracking reference number (ITE-2026-XXXX), and get a complete feasibility assessment.',
                'استخدم بوابة الفحص التقني المجاني لرفع ملفات المواصفات والحصول على رقم مرجعي رسمي لتتبع حالة مشروعك وطلبات التعديل.'
              )}
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C9A45C]" />
                <span>{t('Average Response Time: Under 2 Hours', 'متوسط سرعة الاستجابة: أقل من ساعتين')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>
                  {t(
                    '100% Confidential Handling of Academic & Enterprise Files',
                    'سرية تامة وخصوصية كاملة لجميع الملفات الأكاديمية والمؤسسية'
                  )}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/free-review"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E4C580] py-3.5 text-sm font-bold text-[#090B10] shadow-goldGlow hover:brightness-110 transition"
          >
            <span>{t('Go to Free Tech Check Form', 'انتقل إلى نموذج الفحص التقني المجاني')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
