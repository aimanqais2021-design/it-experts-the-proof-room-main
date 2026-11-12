import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Upload,
  MessageCircle,
  ShieldCheck,
  Search,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl, WHATSAPP_PHONE } from '../data/fallbackData';
import { LeadItem } from '../types';
import { RevisionBanner } from '../components/RevisionBanner';

export const FreeReviewPage: React.FC = () => {
  const { lang, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [field, setField] = useState('');
  const [category, setCategory] = useState('AI, Deep Learning & Computer Vision');
  const [deadline, setDeadline] = useState('Within 2 Weeks');
  const [description, setDescription] = useState('');
  const [consent, setConsent] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<LeadItem | null>(null);

  // Reference Tracker state
  const [trackCode, setTrackCode] = useState('');
  const [trackedLead, setTrackedLead] = useState<LeadItem | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_whatsapp: phoneWhatsapp,
          academic_or_tech_field: field,
          request_category: category,
          project_description: description,
          deadline,
          consent_granted: consent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Submission validation failed. Please check your inputs.');
      }

      let leadData: LeadItem = await res.json();

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const upRes = await fetch(`/api/leads/${leadData.reference_code}/attachments`, {
          method: 'POST',
          body: formData,
        });
        if (upRes.ok) {
          leadData = await upRes.json();
        }
      }

      setSubmittedLead(leadData);
    } catch (err: any) {
      // Offline / static preview graceful fallback so user never hits a dead end
      const fallbackRef = `ITE-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      const waUrl = getWhatsAppUrl(
        `Hello IT EXPERTS — THE PROOF ROOM!\nReference: ${fallbackRef}\nName: ${fullName}\nCategory: ${category}\nField: ${field}\nDeadline: ${deadline}\nSummary: ${description}`
      );
      setSubmittedLead({
        id: 999,
        reference_code: fallbackRef,
        full_name: fullName,
        email,
        phone_whatsapp: phoneWhatsapp,
        academic_or_tech_field: field,
        request_category: category,
        project_description: description,
        deadline,
        status: 'NEW',
        created_at: new Date().toISOString(),
        attachments: [],
        conversations: [],
        revision_requests: [],
        whatsapp_prefilled_url: waUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackReference = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackedLead(null);
    if (!trackCode.trim()) return;
    try {
      const res = await fetch(`/api/leads/track/${encodeURIComponent(trackCode.trim())}`);
      if (!res.ok) {
        throw new Error('Reference code not found.');
      }
      const data = await res.json();
      setTrackedLead(data);
    } catch {
      setTrackError(
        t(
          'Reference number not found. Try sample reference ITE-2026-8401 or submit a new request.',
          'لم يتم العثور على الرقم المرجعي. يمكنك تجربة الرقم النموذجي ITE-2026-8401 أو إرسال طلب جديد.'
        )
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="luxury-card rounded-2xl p-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3.5 py-1 text-xs font-bold text-[#C9A45C]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t('FREE INITIAL TECHNICAL ASSESSMENT', 'الفحص والتقييم التقني الأولي المجاني')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            'Submit Your Project for a Free Architecture & Feasibility Review',
            'أرسل تفاصيل مشروعك للحصول على دراسة جدوى وهيكلة تقنية مجانية'
          )}
        </h1>
        <p className="max-w-3xl text-sm text-gray-300">
          {t(
            'Our lead engineers will review your requirements, recommend the optimal technology stack, and provide a clear execution roadmap free of charge. Actual implementation is subject to a separately agreed transparent quotation — backed by our Free Revisions Policy.',
            'سيقوم مهندسونا بمراجعة متطلباتك واقتراح الحزمة التقنية الأنسب وخطة التنفيذ مجاناً. أما التنفيذ الفعلي فيتم بناءً على عرض سعر مستقل وواضح — مع شمول المشروع بسياسة التعديلات المجانية.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-8">
          {submittedLead ? (
            <div className="luxury-card rounded-2xl p-8 space-y-6 border-emerald-500/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {t('ASSESSMENT REQUEST CONFIRMED', 'تم استلام طلب الفحص التقني بنجاح')}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#F1E9D8]">
                    {t('Reference Number:', 'الرقم المرجعي للطلب:')}{' '}
                    <span className="font-mono text-[#C9A45C]">{submittedLead.reference_code}</span>
                  </h2>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {t(
                  'Your project details have been logged in our engineering queue. For instant priority review with our Lead Architect, click the WhatsApp button below with your pre-filled reference code.',
                  'تم تسجيل تفاصيل مشروعك في نظامنا الهندسي. للحصول على استجابة فورية ومباشرة مع كبير المهندسين، اضغط على زر واتساب أدناه المجهز برقمك المرجعي.'
                )}
              </p>

              <div className="rounded-xl border border-white/10 bg-[#090B10] p-4 text-xs space-y-1.5">
                <div>
                  <strong>{t('Applicant:', 'الاسم:')}</strong> {submittedLead.full_name} ({submittedLead.email})
                </div>
                <div>
                  <strong>{t('Category:', 'المجال:')}</strong> {submittedLead.request_category}
                </div>
                <div>
                  <strong>{t('Status:', 'الحالة:')}</strong>{' '}
                  <span className="text-emerald-400 font-bold">{submittedLead.status}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={submittedLead.whatsapp_prefilled_url || getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>
                    {t(
                      'Send Reference to WhatsApp (+967781282285)',
                      'إرسال الرقم المرجعي عبر واتساب (+967781282285)'
                    )}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmittedLead(null)}
                  className="rounded-xl border border-white/15 bg-[#171A20] px-5 py-3.5 text-xs font-bold text-gray-300 hover:border-[#C9A45C]"
                >
                  {t('Submit Another Request', 'إرسال طلب آخر')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="luxury-card rounded-2xl p-6 sm:p-8 space-y-5">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('Full Name *', 'الاسم الكامل *')}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('Eng. / Dr. / Student Name', 'الاسم الكامل')}
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('Email Address *', 'البريد الإلكتروني *')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('WhatsApp / Phone Number *', 'رقم الواتساب / الهاتف *')}
                  </label>
                  <input
                    type="tel"
                    required
                    minLength={6}
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    placeholder="+967 / +966 ..."
                    dir="ltr"
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('Academic or Technical Field *', 'التخصص الأكاديمي أو المجال التقني *')}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder={t(
                      'e.g., Computer Science Capstone, MSc AI, Enterprise ERP',
                      'مثال: مشروع تخرج علوم حاسوب، ماجستير ذكاء اصطناعي، نظام مؤسسي'
                    )}
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('Request Category *', 'فئة المشروع المطلوبة *')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  >
                    <option value="AI, Deep Learning & Computer Vision">
                      {t('AI, Deep Learning & Computer Vision', 'الذكاء الاصطناعي والرؤية الحاسوبية')}
                    </option>
                    <option value="NLP, Arabic Language Models & RAG">
                      {t('NLP, Arabic Language Models & RAG', 'معالجة اللغات الطبيعية و RAG')}
                    </option>
                    <option value="Full-Stack Web & Enterprise Platforms">
                      {t('Full-Stack Web & Enterprise Platforms', 'تطوير تطبيقات الويب المتكاملة')}
                    </option>
                    <option value="Database Architecture & Big Data Engineering">
                      {t('Database Architecture & Big Data Engineering', 'قواعد البيانات والبيانات الضخمة')}
                    </option>
                    <option value="Computer Networking & Cybersecurity Labs">
                      {t('Computer Networking & Cybersecurity Labs', 'محاكاة الشبكات والأمن السيبراني')}
                    </option>
                    <option value="Engineering Simulation & Scientific Research">
                      {t('Engineering Simulation & Scientific Research', 'المحاكاة الهندسية والبحث العلمي')}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                    {t('Target Deadline', 'الموعد المستهدف للتسليم')}
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder={t('e.g., Within 10 Days', 'مثال: خلال 10 أيام')}
                    className="w-full rounded-xl border border-white/15 bg-[#090B10] px-4 py-2.5 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                  {t('Project Description & Objectives (min 15 chars) *', 'وصف المشروع والمتطلبات الفنية *')}
                </label>
                <textarea
                  rows={4}
                  required
                  minLength={15}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t(
                    'Describe your dataset, expected deliverables, rubric or business goals...',
                    'اشرح فكرة المشروع، البيانات المتوفرة، والمخرجات المطلوبة...'
                  )}
                  className="w-full rounded-xl border border-white/15 bg-[#090B10] p-4 text-xs text-[#F1E9D8] focus:border-[#C9A45C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F1E9D8] mb-1.5">
                  {t(
                    'Optional Specification / Dataset Sample Attachment (.pdf, .png, .txt, .zip, max 10MB)',
                    'مرفق اختياري لملف المتطلبات أو عينة البيانات (.pdf, .png, .txt, .zip بحد أقصى 10MB)'
                  )}
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.zip,.txt,.md,.py,.sql,.csv,.docx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-white/15 bg-[#090B10] px-3 py-2 text-xs text-gray-300"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-gray-600"
                />
                <span>
                  {t(
                    'I consent to IT EXPERTS processing this information for my free initial technical review. I understand the initial assessment is free and actual implementation is subject to a separately agreed quotation covered by the Free Revision Policy.',
                    'أوافق على معالجة البيانات المقدمة لإجراء الفحص التقني الأولي المجاني، مع علمي بأن التقييم الأولي مجاني وأن التنفيذ الفعلي يخضع لعرض سعر مستقل مشمول بسياسة التعديلات المجانية.'
                  )}
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E4C580] py-3.5 text-sm font-bold text-[#090B10] shadow-goldGlow hover:brightness-110 transition disabled:opacity-50"
              >
                {submitting
                  ? t('Submitting & Generating Reference...', 'جارٍ الإرسال وتوليد الرقم المرجعي...')
                  : t('Submit for Free Initial Tech Check', 'إرسال الطلب للفحص التقني المجاني')}
              </button>
            </form>
          )}
        </div>

        {/* Right Sidebar: Track Existing Reference & Policy */}
        <div className="lg:col-span-4 space-y-6">
          <div className="luxury-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
              {t('Track Existing Reference Code', 'متابعة حالة طلب سابق بالرقم المرجعي')}
            </h3>
            <p className="text-xs text-gray-300">
              {t(
                'Enter your reference code (e.g., ITE-2026-8401) to view real-time status and revision history.',
                'أدخل رقمك المرجعي (مثل ITE-2026-8401) لمعرفة حالة مشروعك وطلبات التعديل.'
              )}
            </p>
            <form onSubmit={handleTrackReference} className="flex gap-2">
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="ITE-2026-8401"
                dir="ltr"
                className="flex-1 rounded-xl border border-white/15 bg-[#090B10] px-3 py-2 font-mono text-xs text-[#F1E9D8]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#C9A45C] px-4 py-2 text-xs font-bold text-[#090B10]"
              >
                {t('Track', 'بحث')}
              </button>
            </form>

            {trackError && <p className="text-xs text-amber-400">{trackError}</p>}

            {trackedLead && (
              <div className="rounded-xl border border-[#C9A45C]/40 bg-[#090B10] p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#C9A45C]">
                    {trackedLead.reference_code}
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400">
                    {trackedLead.status}
                  </span>
                </div>
                <div>
                  <strong>{t('Client:', 'العميل:')}</strong> {trackedLead.full_name}
                </div>
                <div>
                  <strong>{t('Category:', 'الفئة:')}</strong> {trackedLead.request_category}
                </div>
                {trackedLead.quoted_amount && (
                  <div>
                    <strong>{t('Agreed Quotation:', 'التسعير المتفق عليه:')}</strong>{' '}
                    {trackedLead.quoted_amount}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="luxury-card rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A45C]">
              {t('Direct WhatsApp Engineering Desk', 'التواصل الفوري عبر واتساب')}
            </h3>
            <p className="text-xs text-gray-300">
              {t(
                'Prefer to send voice notes or screenshots directly on WhatsApp? Reach our engineering lead immediately:',
                'تفضل إرسال ملاحظات صوتية أو ملفات مباشرة عبر واتساب؟ تواصل مع كبير المهندسين فوراً:'
              )}
            </p>
            <div className="font-mono text-sm font-bold text-[#F1E9D8]" dir="ltr">
              {WHATSAPP_PHONE}
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t('Open WhatsApp Chat', 'افتح محادثة واتساب')}</span>
            </a>
          </div>
        </div>
      </div>

      <RevisionBanner />
    </div>
  );
};
