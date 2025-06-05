import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioProvider } from './contexts/AudioContext';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { VocabularyGamePage } from './pages/VocabularyGamePage';
import { FlashCardPage } from './pages/FlashCardPage';
import { SpellingGamePage } from './pages/SpellingGamePage';
import { StoryPage } from './pages/StoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { config } from './config';

function App(): JSX.Element {
  return (
    <LanguageProvider>
      <AudioProvider>
        <Router basename={config.baseUrl}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/games/vocabulary" element={<VocabularyGamePage />} />
            <Route path="/games/flashcards" element={<FlashCardPage />} />
            <Route path="/games/spelling" element={<SpellingGamePage />} />
            <Route path="/games/stories" element={<StoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </Router>
      </AudioProvider>
    </LanguageProvider>
  );
}

export default App;
