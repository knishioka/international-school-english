import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AudioProvider } from './contexts/AudioContext';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';

function App(): JSX.Element {
  return (
    <LanguageProvider>
      <AudioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </Router>
      </AudioProvider>
    </LanguageProvider>
  );
}

export default App;
