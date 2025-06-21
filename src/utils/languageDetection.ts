/**
 * テキストから言語を自動検出する
 * @param text 検出対象のテキスト
 * @returns 'ja' | 'en'
 */
export function detectLanguage(text: string): 'ja' | 'en' {
  // 空文字やスペースのみの場合は英語をデフォルトとする
  const trimmedText = text.trim();
  if (!trimmedText) {
    return 'en';
  }

  // ひらがな、カタカナ、漢字（CJK統合漢字）の正規表現
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

  // 日本語文字が含まれている場合は日本語
  if (japaneseRegex.test(trimmedText)) {
    return 'ja';
  }

  // 英語のアルファベットが含まれている場合は英語
  const englishRegex = /[a-zA-Z]/;
  if (englishRegex.test(trimmedText)) {
    return 'en';
  }

  // どちらでもない場合（数字のみなど）は英語をデフォルトとする
  return 'en';
}

/**
 * 言語に応じて最適な音声を選択する
 * @param lang 言語コード
 * @returns 最適な音声設定
 */
export function getOptimalVoiceSettings(lang: 'ja' | 'en'): {
  lang: string;
  voiceURI?: string;
  rate: number;
  pitch: number;
} {
  if (lang === 'ja') {
    return {
      lang: 'ja-JP',
      rate: 0.7, // 日本語は少し遅めに
      pitch: 1.0, // 日本語は自然なピッチで
    };
  } else {
    return {
      lang: 'en-US',
      rate: 0.8, // 英語は標準的な速度で
      pitch: 1.1, // 英語は少し高めのピッチで子供向けに
    };
  }
}

/**
 * 利用可能な音声から最適なものを選択する
 * @param lang 言語コード
 * @returns 最適な音声、またはnull
 */
export function findBestVoice(lang: 'ja' | 'en'): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();

  // voices が undefined または null の場合は null を返す
  if (voices === null || voices === undefined || !Array.isArray(voices)) {
    return null;
  }

  const targetLang = lang === 'ja' ? 'ja' : 'en';

  // 1. 完全に一致する言語の音声を探す
  const exactMatch = voices.find(
    (voice) =>
      voice !== null &&
      voice !== undefined &&
      voice.lang !== null &&
      voice.lang !== undefined &&
      voice.lang.toLowerCase().startsWith(targetLang) &&
      voice.localService,
  );
  if (exactMatch !== undefined) {
    return exactMatch;
  }

  // 2. 言語が一致する音声を探す（ローカルでなくても）
  const langMatch = voices.find(
    (voice) =>
      voice !== null &&
      voice !== undefined &&
      voice.lang !== null &&
      voice.lang !== undefined &&
      voice.lang.toLowerCase().startsWith(targetLang),
  );
  if (langMatch !== undefined) {
    return langMatch;
  }

  // 3. デフォルトの音声を使用
  const defaultVoice = voices.find(
    (voice) => voice !== null && voice !== undefined && voice.default === true,
  );
  if (defaultVoice !== undefined) {
    return defaultVoice;
  }

  return voices.length > 0 ? voices[0] : null;
}
