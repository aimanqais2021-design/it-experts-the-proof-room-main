import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, CheckCircle2, Award, FileCheck2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RevisionBanner } from '../components/RevisionBanner';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="luxury-card rounded-2xl p-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
          {t('ABOUT IT EXPERTS // THE PROOF ROOM', 'عن منصة IT EXPERTS // غرفة الإثبات')}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F1E9D8]">
          {t(
            'Engineering Authority Built on Verifiable Proof, Not Empty Claims',
            'ريادة هندسية قائمة على الأدلة التقنية الموثقة وليس الوعود النظرية'
          )}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
          {t(
            'IT EXPERTS was founded to bridge the gap between complex academic research requirements and enterprise-grade software delivery. Instead of generic marketing templates, we built THE PROOF ROOM — where every project is executed, benchmarked, and presented with cryptographic SHA-256 evidence.',
            'تأسست منصة IT EXPERTS لسد الفجوة بين المتطلبات البحثية والأكاديمية المتقدمة وبين معايير هندسة البرمجيات المؤسسية. بدلاً من الشعارات التسويقية العامة، بنينا "غرفة الإثبات" حيث يتم تشغيل كل مشروع فعلياً وتوثيق نتائجه رقمياً.'
          )}
        </p>
      </div>

      {/* Methodology */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <Cpu className="h-8 w-8 text-[#C9A45C]" />
          <h2 className="text-lg font-bold text-[#F1E9D8]">
            {t('01. Isolated Hardware Execution', '01. تشغيل فعلي على عتاد متخصص')}
          </h2>
          <p className="text-xs leading-relaxed text-gray-300">
            {t(
              'Every AI, Computer Vision, NLP, and Simulation pipeline is executed in isolated environments using NVIDIA RTX GPU acceleration and Python 3.12 scientific stacks.',
              'يتم تشغيل كافة نماذج الذكاء الاصطناعي والرؤية الحاسوبية والمحاكاة في بيئات معزولة باستخدام تسريع معالجات الرسوميات NVIDIA RTX وحزم بايثون العلمية.'
            )}
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <FileCheck2 className="h-8 w-8 text-[#C9A45C]" />
          <h2 className="text-lg font-bold text-[#F1E9D8]">
            {t('02. Transparent License Attribution', '02. شفافية التراخيص والمصادر')}
          </h2>
          <p className="text-xs leading-relaxed text-gray-300">
            {t(
              'We respect open-source engineering. Every adapted benchmark in The Proof Room clearly documents its upstream reference repository, license (MIT, BSD-3, Apache-2.0, AGPL-3.0), and selection rationale.',
              'نلتزم بأخلاقيات المصادر المفتوحة، حيث يوثق كل مشروع في غرفة الإثبات المستودع المرجعي ونوع الترخيص وسبب الاختيار الهندسي.'
            )}
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-6 space-y-3">
          <Award className="h-8 w-8 text-[#C9A45C]" />
          <h2 className="text-lg font-bold text-[#F1E9D8]">
            {t('03. Walkthrough & Defense Readiness', '03. جاهزية كاملة للمناقشة والتسليم')}
          </h2>
          <p className="text-xs leading-relaxed text-gray-300">
            {t(
              'We ensure university students and technical teams understand every line of code, mathematical equation, and architectural trade-off in their delivered solution.',
              'نحرص على تمكين الباحثين والطلاب والفرق التقنية من فهم كل سطر برمجي ومعادلة رياضية وقرار معماري في المشروع المسلم.'
            )}
          </p>
        </div>
      </div>

      {/* Dedicated Revision Policy Section */}
      <RevisionBanner />
    </div>
  );
};
