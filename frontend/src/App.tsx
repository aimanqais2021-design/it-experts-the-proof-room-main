import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProofRoomPage } from './pages/ProofRoomPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ServicesPage } from './pages/ServicesPage';
import { FreeReviewPage } from './pages/FreeReviewPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#090B10] text-[#F1E9D8]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/proof-room" element={<ProofRoomPage />} />
              <Route path="/projects" element={<ProofRoomPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/free-review" element={<FreeReviewPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
