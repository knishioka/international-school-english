# International School English Learning App / インターナショナルスクール英語学習アプリ

[![CI Status](https://github.com/knishioka/international-school-english/workflows/CI/badge.svg)](https://github.com/knishioka/international-school-english/actions/workflows/ci.yml)
[![Deploy Status](https://github.com/knishioka/international-school-english/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/knishioka/international-school-english/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-green)](https://knishioka.github.io/international-school-english/)

A bilingual (Japanese/English) educational web application designed for Japanese children attending international schools to learn English through interactive games and stories.

インターナショナルスクールに通う日本人の子供向けの、インタラクティブなゲームと物語を通じて英語を学ぶバイリンガル（日本語/英語）教育ウェブアプリケーションです。

## 🎮 Play the App / アプリで遊ぶ

🌐 **Live Demo / デモサイト**: [https://knishioka.github.io/international-school-english/](https://knishioka.github.io/international-school-english/)

You can try the app directly in your browser without any installation!  
インストール不要で、ブラウザから直接アプリをお試しいただけます！

## 🌟 Features / 機能

### 🎮 Interactive Learning Games / インタラクティブな学習ゲーム
- **Flash Cards (単語カード)**: Learn vocabulary with 3D flip animations and pronunciation
- **Spelling Game (スペルチェック)**: Practice spelling with difficulty levels and hints
- **Sentence Practice (文章練習)**: Build English sentences by arranging words in the correct order
- **Story Reading (物語)**: Educational stories with moral lessons, page-flip animations, and auto-play feature

### 🈁 Kanji Grade Level System / 漢字学年別システム
- Adjustable kanji levels (Grade 1-6) for Japanese text
- Ensures age-appropriate kanji usage based on Japanese Ministry of Education guidelines
- Same content displayed with different kanji complexity

### 🌐 Bilingual Support / バイリンガル対応
- Full Japanese and English language support
- Easy language switching
- Context-appropriate translations

### 📊 Progress Tracking / 学習進捗管理
- Track learning progress for each game
- Achievement system with visual rewards
- Progress indicators and statistics
- Data persisted locally for privacy

## 🚀 Getting Started / はじめに

### Prerequisites / 前提条件
- Node.js 18+ 
- npm or yarn

### Installation / インストール

```bash
# Clone the repository
git clone https://github.com/knishioka/international-school-english.git
cd international-school-english

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production / 本番ビルド

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing / テスト

```bash
# Run all tests (unit + E2E)
npm test

# Run unit tests only
npm run test:unit

# Run E2E tests (production build on port 4173)
npm run test:e2e

# Run E2E tests with development server (for debugging)
npm run test:e2e:dev

# Run E2E tests with custom port
VITE_TEST_PORT=5000 npm run test:e2e
```

### Port Management / ポート管理
The app uses different ports for development and testing to avoid conflicts:
- Development server: Port 3000 (configurable via `VITE_PORT`)
- E2E test server: Port 4173 (configurable via `VITE_TEST_PORT`)

See [Port Management Guide](docs/PORT_MANAGEMENT.md) for details.

## 📁 Project Structure / プロジェクト構成

```
grade-1-english/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/         # React contexts (Language, Audio)
│   ├── data/            # Static data and kanji reference
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── tests/
│   └── e2e/            # End-to-end tests
├── docs/               # Documentation
│   ├── KANJI_REFERENCE.md
│   └── KANJI_IMPLEMENTATION_GUIDE.md
└── public/             # Static assets
```

## 🎯 Key Features Explained / 主要機能の説明

### Kanji Grade System / 漢字学年システム
The app displays Japanese text with kanji appropriate to the selected grade level:
- **Grade 1**: Mostly hiragana with basic 80 kanji
- **Grade 2**: 240 cumulative kanji
- **Grade 3-6**: Progressively more complex kanji

Example:
- Grade 1: `わたしは まいあさ あさごはんを たべます。`
- Grade 3: `私は 毎朝 朝ごはんを 食べます。`
- Grade 6: `私は 毎朝 朝ご飯を 食べます。`

### Sentence Practice Game / 文章練習ゲーム
Students learn sentence structure by:
1. Viewing a sentence in Japanese
2. Selecting English words in the correct order
3. Receiving immediate feedback
4. Progressing through different categories (Daily Life, School, Nature, Family)

## 🛠️ Technology Stack / 技術スタック

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Jest & React Testing Library** - Unit testing
- **Playwright** - E2E testing

## 📝 Development Guidelines / 開発ガイドライン

### Code Quality / コード品質
- ESLint and Prettier for code formatting
- Husky for pre-commit hooks
- TypeScript strict mode enabled
- Comprehensive test coverage

### Commit Convention / コミット規約
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring

## 🤝 Contributing / 貢献

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License / ライセンス

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors / 著者

- **Ken Nishioka** - Initial work - [knishioka](https://github.com/knishioka)

## 🙏 Acknowledgments / 謝辞

- Japanese Ministry of Education for kanji curriculum guidelines
- All contributors and testers

## 📞 Support / サポート

For support, please open an issue in the GitHub repository.

---

Made with ❤️ for first-grade English learners / 小学1年生の英語学習者のために作られました