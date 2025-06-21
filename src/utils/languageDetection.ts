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
      rate: 0.85, // 日本語は自然な速度で
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

  // 言語にマッチする音声をすべて取得
  const matchingVoices = voices.filter(
    (voice) =>
      voice !== null &&
      voice !== undefined &&
      voice.lang !== null &&
      voice.lang !== undefined &&
      voice.lang.toLowerCase().startsWith(targetLang),
  );

  if (matchingVoices.length === 0) {
    // マッチする音声がない場合はデフォルトまたは最初の音声を返す
    const defaultVoice = voices.find(
      (voice) => voice !== null && voice !== undefined && voice.default === true,
    );
    return defaultVoice !== undefined ? defaultVoice : voices.length > 0 ? voices[0] : null;
  }

  // 日本語音声の場合、特別な優先順位で選択
  if (lang === 'ja') {
    return selectBestJapaneseVoice(matchingVoices);
  } else {
    return selectBestEnglishVoice(matchingVoices);
  }
}

/**
 * 日本語音声の中から最適なものを選択
 * @param voices 日本語音声のリスト
 * @returns 最適な日本語音声
 */
function selectBestJapaneseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice {
  // 1. 高品質な日本語音声を優先（ニューラルやプレミアム音声）
  const highQualityVoice = voices.find((voice) => {
    const name = voice.name.toLowerCase();
    return (
      name.includes('enhanced') ||
      name.includes('premium') ||
      name.includes('neural') ||
      name.includes('高品質') ||
      name.includes('premium') ||
      // iOS/macOSの高品質日本語音声
      name.includes('kyoko') ||
      name.includes('otoya') ||
      name.includes('siri') ||
      // Windowsの高品質日本語音声
      name.includes('haruka') ||
      name.includes('ichiro') ||
      name.includes('sayaka')
    );
  });

  if (highQualityVoice !== undefined) {
    return highQualityVoice;
  }

  // 2. ローカル音声を優先
  const localVoice = voices.find((voice) => voice.localService);
  if (localVoice !== undefined) {
    return localVoice;
  }

  // 3. デフォルト音声
  const defaultVoice = voices.find((voice) => voice.default);
  if (defaultVoice !== undefined) {
    return defaultVoice;
  }

  // 4. 最初の音声を返す
  return voices[0];
}

/**
 * 英語音声の中から最適なものを選択
 * @param voices 英語音声のリスト
 * @returns 最適な英語音声
 */
function selectBestEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice {
  // 1. ローカル音声を優先
  const localVoice = voices.find((voice) => voice.localService);
  if (localVoice !== undefined) {
    return localVoice;
  }

  // 2. US英語を優先
  const usVoice = voices.find((voice) => voice.lang.toLowerCase().includes('en-us'));
  if (usVoice !== undefined) {
    return usVoice;
  }

  // 3. デフォルト音声
  const defaultVoice = voices.find((voice) => voice.default);
  if (defaultVoice !== undefined) {
    return defaultVoice;
  }

  // 4. 最初の音声を返す
  return voices[0];
}
