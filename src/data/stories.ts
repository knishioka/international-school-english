import type { Story } from '@/types/vocabulary';

/**
 * お話ページ用のストーリーデータ
 * Stories for story page
 */
export const stories: Story[] = [
  {
    id: '1',
    title: {
      en: 'The Kind Rabbit',
      ja: 'やさしいうさぎ',
      jaKanji: {
        1: 'やさしい うさぎ',
        2: 'やさしい うさぎ',
        3: '優しい うさぎ',
        4: '優しい 兎',
        5: '優しい 兎',
        6: '優しい 兎',
      },
    },
    description: {
      en: 'Learn about kindness and sharing',
      ja: 'やさしさと わけあうことを まなぼう',
      jaKanji: {
        1: 'やさしさと 分けあうことを 学ぼう',
        2: 'やさしさと 分け合うことを 学ぼう',
        3: '優しさと 分け合うことを 学ぼう',
        4: '優しさと 分け合うことを 学ぼう',
        5: '優しさと 分け合うことを 学ぼう',
        6: '優しさと 分け合うことを 学ぼう',
      },
    },
    lesson: {
      en: 'Sharing with others brings happiness to everyone',
      ja: 'みんなと わけあうことは みんなを しあわせに します',
      jaKanji: {
        1: 'みんなと 分けあうことは みんなを しあわせに します',
        2: 'みんなと 分け合うことは みんなを 幸せに します',
        3: '皆と 分け合うことは 皆を 幸せに します',
        4: '皆と 分け合うことは 皆を 幸せに します',
        5: '皆と 分け合うことは 皆を 幸せに します',
        6: '皆と 分け合うことは 皆を 幸せに します',
      },
    },
    category: 'moral',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'Once upon a time, there lived a white rabbit in the forest.',
          ja: 'むかしむかし、もりに しろいうさぎが すんでいました。',
        },
        jaKanji: {
          1: 'むかしむかし、もりに 白いうさぎが すんでいました。',
          2: 'むかしむかし、森に 白いうさぎが すんでいました。',
          3: '昔々、森に 白いうさぎが 住んでいました。',
          4: '昔々、森に 白い兎が 住んでいました。',
          5: '昔々、森に 白い兎が 住んでいました。',
          6: '昔々、森に 白い兎が 住んでいました。',
        },
        emoji: '🐰',
      },
      {
        text: {
          en: 'The rabbit found many carrots and wanted to share them.',
          ja: 'うさぎは たくさんの にんじんを みつけて、みんなと わけたいと おもいました。',
        },
        jaKanji: {
          1: 'うさぎは たくさんの にんじんを みつけて、みんなと 分けたいと 思いました。',
          2: 'うさぎは たくさんの にんじんを 見つけて、みんなと 分けたいと 思いました。',
          3: 'うさぎは たくさんの 人参を 見つけて、皆と 分けたいと 思いました。',
          4: '兎は たくさんの 人参を 見つけて、皆と 分けたいと 思いました。',
          5: '兎は たくさんの 人参を 見つけて、皆と 分けたいと 思いました。',
          6: '兎は たくさんの 人参を 見つけて、皆と 分けたいと 思いました。',
        },
        emoji: '🥕',
      },
      {
        text: {
          en: 'All the forest animals were very happy and grateful.',
          ja: 'もりの どうぶつたちは とても よろこんで、かんしゃしました。',
        },
        jaKanji: {
          1: '森の どうぶつたちは とても よろこんで、かんしゃしました。',
          2: '森の 動物たちは とても よろこんで、感しゃしました。',
          3: '森の 動物たちは とても 喜んで、感謝しました。',
          4: '森の 動物たちは とても 喜んで、感謝しました。',
          5: '森の 動物たちは とても 喜んで、感謝しました。',
          6: '森の 動物たちは とても 喜んで、感謝しました。',
        },
        emoji: '🌟',
      },
    ],
  },
  {
    id: '2',
    title: {
      en: "The Little Bird's Adventure",
      ja: 'ちいさなとりの ぼうけん',
      jaKanji: {
        1: 'ちいさな とりの ぼうけん',
        2: 'ちいさな 鳥の ぼうけん',
        3: '小さな 鳥の 冒険',
        4: '小さな 鳥の 冒険',
        5: '小さな 鳥の 冒険',
        6: '小さな 鳥の 冒険',
      },
    },
    description: {
      en: 'A story about courage and friendship',
      ja: 'ゆうきと ゆうじょうの おはなし',
      jaKanji: {
        1: 'ゆうきと ゆうじょうの おはなし',
        2: 'ゆうきと ゆうじょうの お話',
        3: '勇気と 友情の お話',
        4: '勇気と 友情の お話',
        5: '勇気と 友情の お話',
        6: '勇気と 友情の お話',
      },
    },
    lesson: {
      en: 'Being brave helps us make new friends',
      ja: 'ゆうきを だすことで あたらしい ともだちが できます',
      jaKanji: {
        1: 'ゆうきを だすことで あたらしい 友だちが できます',
        2: 'ゆうきを 出すことで 新しい 友だちが できます',
        3: '勇気を 出すことで 新しい 友達が できます',
        4: '勇気を 出すことで 新しい 友達が できます',
        5: '勇気を 出すことで 新しい 友達が できます',
        6: '勇気を 出すことで 新しい 友達が できます',
      },
    },
    category: 'courage',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'A little bird wanted to fly to the big tree.',
          ja: 'ちいさなとりは おおきなきに とびたいと おもいました。',
        },
        jaKanji: {
          1: 'ちいさな とりは 大きな きに とびたいと 思いました。',
          2: 'ちいさな 鳥は 大きな 木に とびたいと 思いました。',
          3: '小さな 鳥は 大きな 木に 飛びたいと 思いました。',
          4: '小さな 鳥は 大きな 木に 飛びたいと 思いました。',
          5: '小さな 鳥は 大きな 木に 飛びたいと 思いました。',
          6: '小さな 鳥は 大きな 木に 飛びたいと 思いました。',
        },
        emoji: '🐦',
      },
      {
        text: {
          en: 'The bird was scared, but tried anyway.',
          ja: 'とりは こわかったけれど、がんばって ちょうせんしました。',
        },
        jaKanji: {
          1: '鳥は こわかったけれど、がんばって ちょうせんしました。',
          2: '鳥は こわかったけれど、がんばって ちょうせんしました。',
          3: '鳥は 怖かったけれど、頑張って 挑戦しました。',
          4: '鳥は 怖かったけれど、頑張って 挑戦しました。',
          5: '鳥は 怖かったけれど、頑張って 挑戦しました。',
          6: '鳥は 怖かったけれど、頑張って 挑戦しました。',
        },
        emoji: '💪',
      },
      {
        text: {
          en: 'The bird successfully flew and made many friends.',
          ja: 'とりは じょうずに とべて、たくさんの ともだちが できました。',
        },
        jaKanji: {
          1: '鳥は じょうずに とべて、たくさんの 友だちが できました。',
          2: '鳥は 上手に 飛べて、たくさんの 友だちが できました。',
          3: '鳥は 上手に 飛べて、たくさんの 友達が できました。',
          4: '鳥は 上手に 飛べて、たくさんの 友達が できました。',
          5: '鳥は 上手に 飛べて、たくさんの 友達が できました。',
          6: '鳥は 上手に 飛べて、たくさんの 友達が できました。',
        },
        emoji: '🎉',
      },
    ],
  },
  {
    id: '3',
    title: {
      en: 'The Magic Garden',
      ja: 'まほうの にわ',
      jaKanji: {
        1: 'まほうの にわ',
        2: 'まほうの 庭',
        3: '魔法の 庭',
        4: '魔法の 庭',
        5: '魔法の 庭',
        6: '魔法の 庭',
      },
    },
    description: {
      en: 'A story about patience and growth',
      ja: 'がまんと せいちょうの おはなし',
      jaKanji: {
        1: 'がまんと せいちょうの お話',
        2: 'がまんと 成ちょうの お話',
        3: '我慢と 成長の お話',
        4: '我慢と 成長の お話',
        5: '我慢と 成長の お話',
        6: '我慢と 成長の お話',
      },
    },
    lesson: {
      en: 'Good things come to those who wait and work hard',
      ja: 'まって がんばる ひとには いいことが おこります',
      jaKanji: {
        1: '待って がんばる 人には いいことが おこります',
        2: '待って 頑張る 人には いいことが おこります',
        3: '待って 頑張る 人には いいことが 起こります',
        4: '待って 頑張る 人には 良いことが 起こります',
        5: '待って 頑張る 人には 良いことが 起こります',
        6: '待って 頑張る 人には 良いことが 起こります',
      },
    },
    category: 'patience',
    minGrade: 2,
    pages: [
      {
        text: {
          en: 'A girl planted seeds in her garden every day.',
          ja: 'おんなのこは まいにち にわに たねを うえました。',
        },
        jaKanji: {
          1: '女の子は 毎日 にわに たねを うえました。',
          2: '女の子は 毎日 庭に 種を うえました。',
          3: '女の子は 毎日 庭に 種を 植えました。',
          4: '女の子は 毎日 庭に 種を 植えました。',
          5: '女の子は 毎日 庭に 種を 植えました。',
          6: '女の子は 毎日 庭に 種を 植えました。',
        },
        emoji: '🌱',
      },
      {
        text: {
          en: 'She watered them and waited patiently.',
          ja: 'みずを あげて、しんぼうづよく まちました。',
        },
        jaKanji: {
          1: '水を あげて、しんぼうづよく 待ちました。',
          2: '水を あげて、しんぼう強く 待ちました。',
          3: '水を あげて、忍耐強く 待ちました。',
          4: '水を あげて、忍耐強く 待ちました。',
          5: '水を あげて、忍耐強く 待ちました。',
          6: '水を あげて、忍耐強く 待ちました。',
        },
        emoji: '💧',
      },
      {
        text: {
          en: 'Beautiful flowers bloomed all over the garden.',
          ja: 'にわじゅうに きれいな はなが さきました。',
        },
        jaKanji: {
          1: '庭じゅうに きれいな 花が さきました。',
          2: '庭中に きれいな 花が さきました。',
          3: '庭中に 美しい 花が 咲きました。',
          4: '庭中に 美しい 花が 咲きました。',
          5: '庭中に 美しい 花が 咲きました。',
          6: '庭中に 美しい 花が 咲きました。',
        },
        emoji: '🌸',
      },
    ],
  },
];

/**
 * ストーリーカテゴリー情報
 */
export const storyCategories = [
  {
    id: 'all',
    name: { en: 'All Stories', ja: 'すべてのおはなし' },
    emoji: '📚',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
  {
    id: 'moral',
    name: { en: 'Moral Stories', ja: 'どうとくのはなし' },
    emoji: '💝',
    color: 'bg-pink-100',
  },
  {
    id: 'friendship',
    name: { en: 'Friendship', ja: 'ゆうじょう' },
    emoji: '👫',
    color: 'bg-yellow-100',
  },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
  { id: 'courage', name: { en: 'Courage', ja: 'ゆうき' }, emoji: '🦁', color: 'bg-orange-100' },
  { id: 'patience', name: { en: 'Patience', ja: 'がまん' }, emoji: '⏰', color: 'bg-blue-100' },
  {
    id: 'responsibility',
    name: { en: 'Responsibility', ja: 'せきにん' },
    emoji: '🎯',
    color: 'bg-red-100',
  },
  {
    id: 'imagination',
    name: { en: 'Imagination', ja: 'そうぞうりょく' },
    emoji: '🌈',
    color: 'bg-purple-100',
  },
  { id: 'empathy', name: { en: 'Empathy', ja: 'おもいやり' }, emoji: '❤️', color: 'bg-indigo-100' },
  {
    id: 'self-esteem',
    name: { en: 'Self-esteem', ja: 'じしん' },
    emoji: '⭐',
    color: 'bg-gray-100',
  },
];

/**
 * カテゴリー別のフィルタリング関数
 */
export function getStoriesByCategory(category: string): Story[] {
  if (category === 'all') {
    return stories;
  }
  return stories.filter((story) => story.category === category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getStoryCategories(): string[] {
  const categories = Array.from(new Set(stories.map((story) => story.category)));
  return ['all', ...categories];
}
