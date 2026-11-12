import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CHALLENGES, getWhatsAppUrl } from '../data/fallbackData';
import { ChallengeItem } from '../types';

export const ChallengesPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [challenges, setChallenges] = useState<ChallengeItem[]>(FALLBACK_CHALLENGES);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/challenges')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setChallenges(data);
      })
      .catch(() => {
        // Fallback already populated
      });
  }, []);

  const handleSelectOption = (challengeId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [challengeId]: optionId }));
  };

  const handleVerify = (challengeId: string) => {
    if (!selectedAnswers[challengeId]) return;
    setSubmittedMap((prev) => ({ ...prev, [challengeId]: true }));
    fetch('/api/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: challengeId,
        selected_option: selectedAnswers[challengeId],
        language: lang,
      }),
    }).catch(() => {});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="luxury-card rounded-2xl p-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3.5 py-1 text-xs font-bold text-[#C9A45C]">
          <Terminal className="h-3.5 w-3.5" />
          <span>{t('INTERACTIVE ENGINEERING CHALLENGES', 'التحديات الهندسية التفاعلية')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            'Experience How IT EXPERTS Diagnoses Complex Technical Problems',
            'اختبر كيف يشخص فريق IT EXPERTS المشكلات البرمجية والهندسية المعقدة'
          )}
        </h1>
        <p className="max-w-3xl text-sm text-gray-300">
          {t(
            'Test yourself across 5 real-world scenarios in Python Debugging, SQL Query Indexing, AI Class Imbalance, OSPF Network Routing, and Algorithmic Optimization. Submit any answer to see the full architectural explanation immediately. Note: These challenges are purely educational demonstrations — you can contact us or request a Free Tech Check at any time!',
            'جرب حل 5 تحديات تقنية في بايثون، قواعد البيانات SQL، الذكاء الاصطناعي، توجيه الشبكات، والخوارزميات. يظهر الشرح الهندسي الكامل فور الإجابة. ملاحظة: هذه التحديات للعرض التفاعلي فقط ولا تشكل أي عائق للتواصل المباشر معنا في أي وقت!'
          )}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/free-review"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A45C] px-5 py-2.5 text-xs font-bold text-[#090B10]"
          >
            <span>{t('Skip Straight to Free Tech Check', 'انتقل مباشرة لطلب الفحص التقني المجاني')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('Chat With an Engineer Now', 'تحدث مع مهندس الآن عبر واتساب')}</span>
          </a>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-8">
        {challenges.map((ch) => {
          const picked = selectedAnswers[ch.id];
          const isSubmitted = submittedMap[ch.id];
          const isCorrect = picked === ch.correct_option;

          return (
            <div key={ch.id} className="luxury-card rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-3 py-1 text-xs font-bold text-[#C9A45C]">
                  {lang === 'ar' ? ch.domain_ar : ch.domain_en}
                </span>
                <span className="font-mono text-xs text-gray-400">{ch.id}</span>
              </div>

              <h2 className="text-xl font-bold text-[#F1E9D8]">
                {lang === 'ar' ? ch.title_ar : ch.title_en}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300">
                {lang === 'ar' ? ch.scenario_ar : ch.scenario_en}
              </p>

              {/* Code Block */}
              <pre
                dir="ltr"
                className="overflow-x-auto rounded-xl border border-white/10 bg-[#090B10] p-4 font-mono text-xs leading-relaxed text-emerald-300"
              >
                <code>{ch.code_snippet}</code>
              </pre>

              <p className="text-sm font-bold text-[#C9A45C]">
                {lang === 'ar' ? ch.question_ar : ch.question_en}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {ch.options.map((opt) => {
                  const active = picked === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(ch.id, opt.id)}
                      className={`w-full text-start rounded-xl border p-4 text-xs sm:text-sm transition flex items-start gap-3 ${
                        active
                          ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#F1E9D8]'
                          : 'border-white/10 bg-[#090B10]/70 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#C9A45C]/50 bg-[#090B10] font-mono text-xs font-bold text-[#C9A45C]">
                        {opt.id}
                      </span>
                      <span className="leading-relaxed">
                        {lang === 'ar' ? opt.text_ar : opt.text_en}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  disabled={!picked}
                  onClick={() => handleVerify(ch.id)}
                  className="rounded-xl bg-[#C9A45C] px-6 py-2.5 text-xs font-bold text-[#090B10] disabled:opacity-40 hover:bg-[#E4C580] transition"
                >
                  {t('Submit & Reveal Architectural Solution', 'تحقق من الإجابة واعرض التفسير الهندسي')}
                </button>
              </div>

              {/* Instant Explanation Box */}
              {isSubmitted && (
                <div
                  className={`rounded-xl border p-5 space-y-2 ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/30'
                      : 'border-amber-500/40 bg-amber-950/30'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-400">
                          {t(
                            `Spot On! Option ${ch.correct_option} is the verified engineering solution.`,
                            `إجابة صحيحة! الخيار ${ch.correct_option} هو الحل الهندسي المعتمد.`
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-amber-400" />
                        <span className="text-amber-400">
                          {t(
                            `Good attempt! The correct production answer is Option ${ch.correct_option}.`,
                            `محاولة جيدة! الإجابة الهندسية الصحيحة هي الخيار ${ch.correct_option}.`
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-200">
                    {lang === 'ar' ? ch.explanation_ar : ch.explanation_en}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
