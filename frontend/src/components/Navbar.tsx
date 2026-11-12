import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Globe, Menu, X, Sparkles, MessageCircle, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../data/fallbackData';

export const Navbar: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('Home', 'الرئيسية') },
    { path: '/proof-room', label: t('The Proof Room', 'غرفة الإثبات') },
    { path: '/challenges', label: t('Challenges', 'التحديات التقنية') },
    { path: '/services', label: t('Services', 'خدماتنا') },
    { path: '/free-review', label: t('Free Tech Check', 'الفحص التقني المجاني') },
    { path: '/about', label: t('About & Policy', 'من نحن وسياسة التعديل') },
    { path: '/contact', label: t('Contact', 'تواصل معنا') },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#C9A45C]/25 bg-[#090B10]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A45C] to-[#9E7B36] text-[#090B10] shadow-goldGlow transition-transform group-hover:scale-105">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-wider text-[#F1E9D8]">
                IT EXPERTS
              </span>
              <span className="hidden rounded border border-[#C9A45C]/40 bg-[#C9A45C]/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#C9A45C] sm:inline-block">
                THE PROOF ROOM
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {t('YOUR IT WORLD. OUR EXPERTISE.', 'عالمك التقني.. خبرتنا الموثقة.')}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/40'
                  : 'text-[#F1E9D8]/80 hover:bg-[#171A20] hover:text-[#C9A45C]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={toggleLang}
            aria-label="Toggle Language"
            className="flex items-center gap-1.5 rounded-lg border border-[#C9A45C]/30 bg-[#171A20] px-3 py-2 text-xs font-semibold text-[#F1E9D8] hover:border-[#C9A45C] transition"
          >
            <Globe className="h-3.5 w-3.5 text-[#C9A45C]" />
            <span>{lang === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1 rounded-lg border border-gray-700 bg-[#171A20] px-2.5 py-2 text-xs text-gray-300 hover:border-[#C9A45C]/50 hover:text-[#C9A45C] transition"
            title="Admin Portal"
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{t('Admin', 'الإدارة')}</span>
          </Link>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>

          <Link
            to="/free-review"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#C9A45C] to-[#E4C580] px-4 py-2 text-xs font-bold text-[#090B10] shadow-goldGlow hover:brightness-110 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('Free Assessment', 'تقييم مجاني')}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={toggleLang}
            className="rounded-lg border border-[#C9A45C]/30 bg-[#171A20] px-2.5 py-1.5 text-xs font-semibold text-[#C9A45C]"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open Menu"
            className="rounded-lg border border-gray-800 bg-[#171A20] p-2 text-[#F1E9D8]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#C9A45C]/20 bg-[#090B10] px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30'
                    : 'text-[#F1E9D8]/85 hover:bg-[#171A20]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#171A20]"
            >
              {t('Admin Dashboard', 'لوحة الإدارة')}
            </Link>
            <div className="mt-2 flex gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-center text-xs font-bold text-emerald-400"
              >
                WhatsApp (+967781282285)
              </a>
              <Link
                to="/free-review"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg bg-[#C9A45C] py-2.5 text-center text-xs font-bold text-[#090B10]"
              >
                {t('Free Tech Check', 'فحص مجاني')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
