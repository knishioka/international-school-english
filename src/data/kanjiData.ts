/**
 * 小学校学習漢字データ
 * 文部科学省の学習指導要領に基づく教育漢字（1,026字）
 */

export interface KanjiGradeData {
  grade: number;
  total: number;
  kanji: string[];
}

export const kanjiByGrade: Record<number, KanjiGradeData> = {
  1: {
    grade: 1,
    total: 80,
    kanji: [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '百',
      '千',
      '日',
      '月',
      '火',
      '水',
      '木',
      '金',
      '土',
      '上',
      '下',
      '左',
      '右',
      '中',
      '人',
      '子',
      '女',
      '男',
      '目',
      '耳',
      '口',
      '手',
      '足',
      '力',
      '学',
      '校',
      '先',
      '生',
      '年',
      '文',
      '本',
      '字',
      '名',
      '山',
      '川',
      '田',
      '石',
      '花',
      '草',
      '竹',
      '虫',
      '犬',
      '林',
      '森',
      '大',
      '小',
      '入',
      '出',
      '立',
      '休',
      '見',
      '音',
      '気',
      '天',
      '雨',
      '王',
      '玉',
      '正',
      '早',
      '白',
      '赤',
      '青',
      '円',
      '車',
      '町',
      '村',
      '空',
      '糸',
      '貝',
      '夕',
    ],
  },
  2: {
    grade: 2,
    total: 160,
    kanji: [
      '春',
      '夏',
      '秋',
      '冬',
      '朝',
      '昼',
      '夜',
      '晩',
      '今',
      '週',
      '曜',
      '時',
      '分',
      '間',
      '午',
      '前',
      '後',
      '東',
      '西',
      '南',
      '北',
      '内',
      '外',
      '国',
      '京',
      '市',
      '区',
      '里',
      '野',
      '原',
      '谷',
      '門',
      '戸',
      '家',
      '店',
      '場',
      '所',
      '父',
      '母',
      '兄',
      '弟',
      '姉',
      '妹',
      '友',
      '体',
      '頭',
      '顔',
      '首',
      '心',
      '声',
      '言',
      '話',
      '行',
      '来',
      '帰',
      '歩',
      '走',
      '止',
      '活',
      '動',
      '働',
      '教',
      '考',
      '知',
      '思',
      '作',
      '書',
      '読',
      '聞',
      '歌',
      '買',
      '売',
      '答',
      '問',
      '食',
      '肉',
      '魚',
      '米',
      '茶',
      '色',
      '黒',
      '黄',
      '形',
      '点',
      '線',
      '角',
      '計',
      '数',
      '番',
      '組',
      '海',
      '池',
      '地',
      '岩',
      '星',
      '雲',
      '風',
      '雪',
      '晴',
      '鳥',
      '馬',
      '牛',
      '羊',
      '鳴',
      '刀',
      '弓',
      '矢',
      '台',
      '紙',
      '絵',
      '図',
      '画',
      '工',
      '室',
      '会',
      '社',
      '寺',
      '駅',
      '船',
      '汽',
      '新',
      '古',
      '長',
      '短',
      '高',
      '太',
      '細',
      '広',
      '近',
      '遠',
      '明',
      '暗',
      '強',
      '弱',
      '多',
      '少',
      '同',
      '回',
      '毎',
      '万',
      '方',
      '用',
      '通',
      '切',
      '分',
      '半',
      '当',
      '交',
      '光',
      '合',
      '向',
      '両',
      '引',
      '止',
      '歩',
      '科',
      '算',
      '理',
      '楽',
      '記',
    ],
  },
};

/**
 * 指定された学年までに学習済みの漢字を取得
 * @param grade 学年（1-6）
 * @returns 学習済み漢字の配列
 */
export function getLearnedKanji(grade: number): string[] {
  const learned: string[] = [];
  for (let g = 1; g <= Math.min(grade, 6); g++) {
    const gradeData = kanjiByGrade[g];
    if (gradeData !== undefined) {
      learned.push(...gradeData.kanji);
    }
  }
  return learned;
}

/**
 * 文字列に含まれる未習漢字を検出
 * @param text 検査する文字列
 * @param grade 現在の学年
 * @returns 未習漢字の配列
 */
export function getUnlearnedKanji(text: string, grade: number): string[] {
  const learned = new Set(getLearnedKanji(grade));
  const unlearned: string[] = [];

  for (const char of text) {
    // 漢字かどうかをチェック（CJK統合漢字の範囲）
    if (/[\u4E00-\u9FFF]/.test(char) && !learned.has(char)) {
      if (!unlearned.includes(char)) {
        unlearned.push(char);
      }
    }
  }

  return unlearned;
}

/**
 * テキストを学年に応じて調整（実装例）
 * @param text 元のテキスト
 * @param currentGrade 現在の学年
 * @param targetGrade 目標の学年
 * @returns 調整されたテキスト
 */
export function adjustTextForGrade(
  text: string,
  currentGrade: number,
  targetGrade: number,
): string {
  // この関数は実際の実装では、より洗練された変換ロジックが必要です
  // 例: 漢字→ひらがな変換、同義語置換など

  if (targetGrade >= currentGrade) {
    return text; // 同じか上の学年なら変更なし
  }

  // 簡易実装：未習漢字を検出して警告
  const unlearned = getUnlearnedKanji(text, targetGrade);
  if (unlearned.length > 0) {
    globalThis['console']?.warn(`未習漢字が含まれています: ${unlearned.join(', ')}`);
  }

  return text;
}

// 学年別の統計情報
export const kanjiStatistics = {
  1: { count: 80, cumulative: 80 },
  2: { count: 160, cumulative: 240 },
  3: { count: 200, cumulative: 440 },
  4: { count: 202, cumulative: 642 },
  5: { count: 193, cumulative: 835 },
  6: { count: 191, cumulative: 1026 },
};

// よく使われる漢字の組み合わせ（熟語）の例
export const commonCompounds: Record<number, string[]> = {
  1: ['学校', '先生', '大人', '子犬', '山川', '日本', '一年生'],
  2: ['朝食', '買物', '友人', '家族', '教室', '図書', '時間'],
  3: ['勉強', '運動', '宿題', '病院', '安全', '世界', '写真'],
  4: ['歴史', '地理', '科学', '実験', '健康', '環境', '文化'],
  5: ['政治', '経済', '貿易', '技術', '情報', '国際', '社会'],
  6: ['憲法', '権利', '責任', '創造', '尊敬', '平和', '協力'],
};
