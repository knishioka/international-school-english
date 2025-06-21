import { detectLanguage, getOptimalVoiceSettings, findBestVoice } from '../languageDetection';

describe('languageDetection', () => {
  describe('detectLanguage', () => {
    it('日本語テキストを正しく検出する', () => {
      expect(detectLanguage('こんにちは')).toBe('ja');
      expect(detectLanguage('カタカナ')).toBe('ja');
      expect(detectLanguage('漢字')).toBe('ja');
      expect(detectLanguage('ひらがなとカタカナと漢字')).toBe('ja');
      expect(detectLanguage('Hello こんにちは')).toBe('ja'); // 混在の場合は日本語
    });

    it('英語テキストを正しく検出する', () => {
      expect(detectLanguage('Hello')).toBe('en');
      expect(detectLanguage('apple')).toBe('en');
      expect(detectLanguage('Good morning')).toBe('en');
      expect(detectLanguage('123 apple')).toBe('en');
    });

    it('空文字や特殊文字の場合は英語をデフォルトとする', () => {
      expect(detectLanguage('')).toBe('en');
      expect(detectLanguage('   ')).toBe('en');
      expect(detectLanguage('123')).toBe('en');
      expect(detectLanguage('!@#')).toBe('en');
    });
  });

  describe('getOptimalVoiceSettings', () => {
    it('日本語用の設定を返す', () => {
      const settings = getOptimalVoiceSettings('ja');
      expect(settings.lang).toBe('ja-JP');
      expect(settings.rate).toBe(0.85);
      expect(settings.pitch).toBe(1.0);
    });

    it('英語用の設定を返す', () => {
      const settings = getOptimalVoiceSettings('en');
      expect(settings.lang).toBe('en-US');
      expect(settings.rate).toBe(0.8);
      expect(settings.pitch).toBe(1.1);
    });
  });

  describe('findBestVoice', () => {
    const mockVoices = [
      { lang: 'en-US', localService: true, default: false, name: 'English US', voiceURI: 'en-us' },
      { lang: 'ja-JP', localService: true, default: false, name: 'Japanese', voiceURI: 'ja-jp' },
      { lang: 'en-GB', localService: false, default: true, name: 'English UK', voiceURI: 'en-gb' },
    ] as SpeechSynthesisVoice[];

    beforeEach(() => {
      Object.defineProperty(global, 'speechSynthesis', {
        value: {
          getVoices: jest.fn(() => mockVoices),
        },
        writable: true,
      });
    });

    it('日本語の最適な音声を見つける', () => {
      const voice = findBestVoice('ja');
      expect(voice?.lang).toBe('ja-JP');
      expect(voice?.localService).toBe(true);
    });

    it('英語の最適な音声を見つける', () => {
      const voice = findBestVoice('en');
      expect(voice?.lang).toBe('en-US');
      expect(voice?.localService).toBe(true);
    });

    it('speechSynthesisが利用できない場合はnullを返す', () => {
      // @ts-expect-error テスト用の意図的な型無視
      delete global.speechSynthesis;
      const voice = findBestVoice('en');
      expect(voice).toBeNull();
    });
  });
});
