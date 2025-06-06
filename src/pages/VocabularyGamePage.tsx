import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, KanjiGrade } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';
import { progressService } from '@/services/progressService';

interface Sentence {
  id: string;
  english: string;
  japanese: string;
  jaKanji: { [key in KanjiGrade]: string };
  words: string[];
  emoji: string;
  category: string;
}

const sentences: Sentence[] = [
  // Daily Life - 日常生活
  {
    id: '1',
    english: 'I eat breakfast every morning.',
    japanese: 'わたしは まいあさ あさごはんを たべます。',
    jaKanji: {
      1: 'わたしは まいあさ あさごはんを たべます。',
      2: 'わたしは 毎朝 あさごはんを 食べます。',
      3: 'わたしは 毎朝 朝ごはんを 食べます。',
      4: 'わたしは 毎朝 朝ご飯を 食べます。',
      5: 'わたしは 毎朝 朝ご飯を 食べます。',
      6: '私は 毎朝 朝ご飯を 食べます。',
    },
    words: ['I', 'eat', 'breakfast', 'every', 'morning'],
    emoji: '🍳',
    category: 'daily',
  },
  {
    id: '2',
    english: 'My mother makes delicious cookies.',
    japanese: 'おかあさんは おいしい クッキーを つくります。',
    jaKanji: {
      1: 'おかあさんは おいしい クッキーを つくります。',
      2: 'お母さんは おいしい クッキーを 作ります。',
      3: 'お母さんは 美味しい クッキーを 作ります。',
      4: 'お母さんは 美味しい クッキーを 作ります。',
      5: 'お母さんは 美味しい クッキーを 作ります。',
      6: 'お母さんは 美味しい クッキーを 作ります。',
    },
    words: ['My', 'mother', 'makes', 'delicious', 'cookies'],
    emoji: '🍪',
    category: 'daily',
  },
  {
    id: '3',
    english: 'I brush my teeth before bed.',
    japanese: 'わたしは ねるまえに はを みがきます。',
    jaKanji: {
      1: 'わたしは ねるまえに はを みがきます。',
      2: 'わたしは ねる前に 歯を みがきます。',
      3: 'わたしは 寝る前に 歯を みがきます。',
      4: 'わたしは 寝る前に 歯を みがきます。',
      5: 'わたしは 寝る前に 歯を みがきます。',
      6: '私は 寝る前に 歯を 磨きます。',
    },
    words: ['I', 'brush', 'my', 'teeth', 'before', 'bed'],
    emoji: '🪥',
    category: 'daily',
  },
  {
    id: '4',
    english: 'We play games after school.',
    japanese: 'わたしたちは がっこうのあとで ゲームを します。',
    jaKanji: {
      1: 'わたしたちは 学校のあとで ゲームを します。',
      2: 'わたしたちは 学校の後で ゲームを します。',
      3: 'わたしたちは 学校の後で ゲームを します。',
      4: 'わたしたちは 学校の後で ゲームを します。',
      5: 'わたしたちは 学校の後で ゲームを します。',
      6: '私たちは 学校の後で ゲームを します。',
    },
    words: ['We', 'play', 'games', 'after', 'school'],
    emoji: '🎮',
    category: 'daily',
  },

  // School - 学校
  {
    id: '5',
    english: 'I study English at school every day.',
    japanese: 'わたしは まいにち がっこうで えいごを べんきょうします。',
    jaKanji: {
      1: 'わたしは まい日 学校で えいごを べんきょうします。',
      2: 'わたしは 毎日 学校で えいごを べんきょうします。',
      3: 'わたしは 毎日 学校で えいごを 勉強します。',
      4: 'わたしは 毎日 学校で 英語を 勉強します。',
      5: 'わたしは 毎日 学校で 英語を 勉強します。',
      6: '私は 毎日 学校で 英語を 勉強します。',
    },
    words: ['I', 'study', 'English', 'at', 'school', 'every', 'day'],
    emoji: '📝',
    category: 'school',
  },
  {
    id: '6',
    english: 'My teacher is very kind and helpful.',
    japanese: 'せんせいは とても やさしくて たすけてくれます。',
    jaKanji: {
      1: '先生は とても やさしくて たすけてくれます。',
      2: '先生は とても やさしくて たすけてくれます。',
      3: '先生は とても やさしくて 助けてくれます。',
      4: '先生は とても やさしくて 助けてくれます。',
      5: '先生は とても やさしくて 助けてくれます。',
      6: '先生は とても 優しくて 助けてくれます。',
    },
    words: ['My', 'teacher', 'is', 'very', 'kind', 'and', 'helpful'],
    emoji: '👩‍🏫',
    category: 'school',
  },
  {
    id: '7',
    english: 'I like to read books in the library.',
    japanese: 'わたしは としょかんで ほんを よむのが すきです。',
    jaKanji: {
      1: 'わたしは としょかんで 本を よむのが すきです。',
      2: 'わたしは 図書かんで 本を 読むのが すきです。',
      3: 'わたしは 図書かんで 本を 読むのが すきです。',
      4: 'わたしは 図書館で 本を 読むのが 好きです。',
      5: 'わたしは 図書館で 本を 読むのが 好きです。',
      6: '私は 図書館で 本を 読むのが 好きです。',
    },
    words: ['I', 'like', 'to', 'read', 'books', 'in', 'the', 'library'],
    emoji: '📖',
    category: 'school',
  },
  {
    id: '8',
    english: 'We have lunch with our friends.',
    japanese: 'わたしたちは ともだちと おひるごはんを たべます。',
    jaKanji: {
      1: 'わたしたちは ともだちと おひるごはんを たべます。',
      2: 'わたしたちは 友だちと お昼ごはんを 食べます。',
      3: 'わたしたちは 友だちと お昼ごはんを 食べます。',
      4: 'わたしたちは 友達と お昼ご飯を 食べます。',
      5: 'わたしたちは 友達と お昼ご飯を 食べます。',
      6: '私たちは 友達と お昼ご飯を 食べます。',
    },
    words: ['We', 'have', 'lunch', 'with', 'our', 'friends'],
    emoji: '🍱',
    category: 'school',
  },

  // Animals & Nature - 動物と自然
  {
    id: '9',
    english: 'The big dog runs in the park.',
    japanese: 'おおきな いぬが こうえんで はしります。',
    jaKanji: {
      1: '大きな 犬が こうえんで はしります。',
      2: '大きな 犬が 公園で 走ります。',
      3: '大きな 犬が 公園で 走ります。',
      4: '大きな 犬が 公園で 走ります。',
      5: '大きな 犬が 公園で 走ります。',
      6: '大きな 犬が 公園で 走ります。',
    },
    words: ['The', 'big', 'dog', 'runs', 'in', 'the', 'park'],
    emoji: '🐕',
    category: 'nature',
  },
  {
    id: '10',
    english: 'Beautiful flowers bloom in the spring.',
    japanese: 'きれいな はなが はるに さきます。',
    jaKanji: {
      1: 'きれいな 花が はるに さきます。',
      2: 'きれいな 花が 春に さきます。',
      3: '美しい 花が 春に さきます。',
      4: '美しい 花が 春に さきます。',
      5: '美しい 花が 春に さきます。',
      6: '美しい 花が 春に さきます。',
    },
    words: ['Beautiful', 'flowers', 'bloom', 'in', 'the', 'spring'],
    emoji: '🌸',
    category: 'nature',
  },
  {
    id: '11',
    english: 'Birds sing happy songs every morning.',
    japanese: 'とりたちは まいあさ たのしい うたを うたいます。',
    jaKanji: {
      1: 'とりたちは まいあさ たのしい うたを うたいます。',
      2: '鳥たちは 毎朝 楽しい 歌を 歌います。',
      3: '鳥たちは 毎朝 楽しい 歌を 歌います。',
      4: '鳥達は 毎朝 楽しい 歌を 歌います。',
      5: '鳥達は 毎朝 楽しい 歌を 歌います。',
      6: '鳥達は 毎朝 楽しい 歌を 歌います。',
    },
    words: ['Birds', 'sing', 'happy', 'songs', 'every', 'morning'],
    emoji: '🐦',
    category: 'nature',
  },
  {
    id: '12',
    english: 'I can see many stars at night.',
    japanese: 'よるに たくさんの ほしが みえます。',
    jaKanji: {
      1: 'よるに たくさんの ほしが 見えます。',
      2: '夜に たくさんの 星が 見えます。',
      3: '夜に たくさんの 星が 見えます。',
      4: '夜に たくさんの 星が 見えます。',
      5: '夜に たくさんの 星が 見えます。',
      6: '夜に たくさんの 星が 見えます。',
    },
    words: ['I', 'can', 'see', 'many', 'stars', 'at', 'night'],
    emoji: '⭐',
    category: 'nature',
  },

  // Family & Friends - 家族と友達
  {
    id: '13',
    english: 'My family goes to the beach in summer.',
    japanese: 'かぞくは なつに うみに いきます。',
    jaKanji: {
      1: 'かぞくは なつに うみに 行きます。',
      2: '家ぞくは 夏に うみに 行きます。',
      3: '家族は 夏に 海に 行きます。',
      4: '家族は 夏に 海に 行きます。',
      5: '家族は 夏に 海に 行きます。',
      6: '家族は 夏に 海に 行きます。',
    },
    words: ['My', 'family', 'goes', 'to', 'the', 'beach', 'in', 'summer'],
    emoji: '🏖️',
    category: 'family',
  },
  {
    id: '14',
    english: 'I help my father wash the car.',
    japanese: 'わたしは おとうさんの くるまあらいを てつだいます。',
    jaKanji: {
      1: 'わたしは お父さんの 車あらいを 手つだいます。',
      2: 'わたしは お父さんの 車あらいを 手つだいます。',
      3: 'わたしは お父さんの 車あらいを 手つだいます。',
      4: 'わたしは お父さんの 車あらいを 手伝います。',
      5: 'わたしは お父さんの 車あらいを 手伝います。',
      6: '私は お父さんの 車洗いを 手伝います。',
    },
    words: ['I', 'help', 'my', 'father', 'wash', 'the', 'car'],
    emoji: '🚗',
    category: 'family',
  },
  {
    id: '15',
    english: 'My best friend and I play together.',
    japanese: 'しんゆうと わたしは いっしょに あそびます。',
    jaKanji: {
      1: 'しんゆうと わたしは いっしょに あそびます。',
      2: 'しん友と わたしは いっしょに あそびます。',
      3: 'しん友と わたしは 一しょに 遊びます。',
      4: '親友と わたしは 一緒に 遊びます。',
      5: '親友と わたしは 一緒に 遊びます。',
      6: '親友と 私は 一緒に 遊びます。',
    },
    words: ['My', 'best', 'friend', 'and', 'I', 'play', 'together'],
    emoji: '👫',
    category: 'family',
  },

  // Sports & Activities - スポーツと活動
  {
    id: '16',
    english: 'I play soccer with my friends.',
    japanese: 'ともだちと サッカーを します。',
    jaKanji: {
      1: 'ともだちと サッカーを します。',
      2: '友だちと サッカーを します。',
      3: '友だちと サッカーを します。',
      4: '友達と サッカーを します。',
      5: '友達と サッカーを します。',
      6: '友達と サッカーを します。',
    },
    words: ['I', 'play', 'soccer', 'with', 'my', 'friends'],
    emoji: '⚽',
    category: 'sports',
  },
  {
    id: '17',
    english: 'She swims very fast in the pool.',
    japanese: 'かのじょは プールで とても はやく およぎます。',
    jaKanji: {
      1: 'かのじょは プールで とても はやく およぎます。',
      2: '彼女は プールで とても 早く およぎます。',
      3: '彼女は プールで とても 早く およぎます。',
      4: '彼女は プールで とても 早く 泳ぎます。',
      5: '彼女は プールで とても 早く 泳ぎます。',
      6: '彼女は プールで とても 早く 泳ぎます。',
    },
    words: ['She', 'swims', 'very', 'fast', 'in', 'the', 'pool'],
    emoji: '🏊‍♀️',
    category: 'sports',
  },
  {
    id: '18',
    english: 'We practice basketball every week.',
    japanese: 'わたしたちは まいしゅう バスケットボールを れんしゅうします。',
    jaKanji: {
      1: 'わたしたちは まいしゅう バスケットボールを れんしゅうします。',
      2: 'わたしたちは 毎しゅう バスケットボールを れんしゅうします。',
      3: 'わたしたちは 毎週 バスケットボールを れんしゅうします。',
      4: 'わたしたちは 毎週 バスケットボールを 練習します。',
      5: 'わたしたちは 毎週 バスケットボールを 練習します。',
      6: '私たちは 毎週 バスケットボールを 練習します。',
    },
    words: ['We', 'practice', 'basketball', 'every', 'week'],
    emoji: '🏀',
    category: 'sports',
  },
  {
    id: '19',
    english: 'My brother likes to ride his bike.',
    japanese: 'あには じてんしゃに のるのが すきです。',
    jaKanji: {
      1: 'あには じてんしゃに のるのが すきです。',
      2: '兄は 自てん車に のるのが すきです。',
      3: '兄は 自転車に のるのが すきです。',
      4: '兄は 自転車に 乗るのが 好きです。',
      5: '兄は 自転車に 乗るのが 好きです。',
      6: '兄は 自転車に 乗るのが 好きです。',
    },
    words: ['My', 'brother', 'likes', 'to', 'ride', 'his', 'bike'],
    emoji: '🚴‍♂️',
    category: 'sports',
  },
  {
    id: '20',
    english: 'They run around the track together.',
    japanese: 'かれらは いっしょに トラックを はしります。',
    jaKanji: {
      1: 'かれらは いっしょに トラックを はしります。',
      2: '彼らは 一しょに トラックを 走ります。',
      3: '彼らは 一緒に トラックを 走ります。',
      4: '彼らは 一緒に トラックを 走ります。',
      5: '彼らは 一緒に トラックを 走ります。',
      6: '彼らは 一緒に トラックを 走ります。',
    },
    words: ['They', 'run', 'around', 'the', 'track', 'together'],
    emoji: '🏃‍♂️',
    category: 'sports',
  },

  // Food & Cooking - 食べ物と料理
  {
    id: '21',
    english: 'I like to eat ice cream in summer.',
    japanese: 'なつに アイスクリームを たべるのが すきです。',
    jaKanji: {
      1: 'なつに アイスクリームを たべるのが すきです。',
      2: '夏に アイスクリームを 食べるのが すきです。',
      3: '夏に アイスクリームを 食べるのが すきです。',
      4: '夏に アイスクリームを 食べるのが 好きです。',
      5: '夏に アイスクリームを 食べるのが 好きです。',
      6: '夏に アイスクリームを 食べるのが 好きです。',
    },
    words: ['I', 'like', 'to', 'eat', 'ice', 'cream', 'in', 'summer'],
    emoji: '🍦',
    category: 'food',
  },
  {
    id: '22',
    english: 'My grandmother makes the best cake.',
    japanese: 'おばあちゃんは いちばん おいしい ケーキを つくります。',
    jaKanji: {
      1: 'おばあちゃんは 一ばん おいしい ケーキを つくります。',
      2: 'おばあちゃんは 一番 おいしい ケーキを 作ります。',
      3: 'おばあちゃんは 一番 美味しい ケーキを 作ります。',
      4: 'お祖母ちゃんは 一番 美味しい ケーキを 作ります。',
      5: 'お祖母ちゃんは 一番 美味しい ケーキを 作ります。',
      6: 'お祖母ちゃんは 一番 美味しい ケーキを 作ります。',
    },
    words: ['My', 'grandmother', 'makes', 'the', 'best', 'cake'],
    emoji: '🍰',
    category: 'food',
  },
  {
    id: '23',
    english: 'We grow fresh vegetables in our garden.',
    japanese: 'わたしたちは にわで あたらしい やさいを そだてます。',
    jaKanji: {
      1: 'わたしたちは にわで あたらしい やさいを そだてます。',
      2: 'わたしたちは 庭で 新しい やさいを 育てます。',
      3: 'わたしたちは 庭で 新しい 野菜を 育てます。',
      4: 'わたしたちは 庭で 新しい 野菜を 育てます。',
      5: 'わたしたちは 庭で 新しい 野菜を 育てます。',
      6: '私たちは 庭で 新しい 野菜を 育てます。',
    },
    words: ['We', 'grow', 'fresh', 'vegetables', 'in', 'our', 'garden'],
    emoji: '🥬',
    category: 'food',
  },
  {
    id: '24',
    english: 'She drinks milk every morning.',
    japanese: 'かのじょは まいあさ ぎゅうにゅうを のみます。',
    jaKanji: {
      1: 'かのじょは まいあさ ぎゅうにゅうを のみます。',
      2: '彼女は 毎朝 ぎゅうにゅうを 飲みます。',
      3: '彼女は 毎朝 牛にゅうを 飲みます。',
      4: '彼女は 毎朝 牛乳を 飲みます。',
      5: '彼女は 毎朝 牛乳を 飲みます。',
      6: '彼女は 毎朝 牛乳を 飲みます。',
    },
    words: ['She', 'drinks', 'milk', 'every', 'morning'],
    emoji: '🥛',
    category: 'food',
  },
  {
    id: '25',
    english: 'Pizza is my favorite food.',
    japanese: 'ピザは わたしの いちばんすきな たべものです。',
    jaKanji: {
      1: 'ピザは わたしの 一ばんすきな 食べ物です。',
      2: 'ピザは わたしの 一番すきな 食べ物です。',
      3: 'ピザは わたしの 一番すきな 食べ物です。',
      4: 'ピザは わたしの 一番好きな 食べ物です。',
      5: 'ピザは わたしの 一番好きな 食べ物です。',
      6: 'ピザは 私の 一番好きな 食べ物です。',
    },
    words: ['Pizza', 'is', 'my', 'favorite', 'food'],
    emoji: '🍕',
    category: 'food',
  },

  // Transportation - 交通
  {
    id: '26',
    english: 'I take the bus to school.',
    japanese: 'わたしは バスで がっこうに いきます。',
    jaKanji: {
      1: 'わたしは バスで 学校に 行きます。',
      2: 'わたしは バスで 学校に 行きます。',
      3: 'わたしは バスで 学校に 行きます。',
      4: 'わたしは バスで 学校に 行きます。',
      5: 'わたしは バスで 学校に 行きます。',
      6: '私は バスで 学校に 行きます。',
    },
    words: ['I', 'take', 'the', 'bus', 'to', 'school'],
    emoji: '🚌',
    category: 'transport',
  },
  {
    id: '27',
    english: 'The train moves very fast.',
    japanese: 'でんしゃは とても はやく うごきます。',
    jaKanji: {
      1: 'でんしゃは とても はやく うごきます。',
      2: '電車は とても 早く うごきます。',
      3: '電車は とても 早く 動きます。',
      4: '電車は とても 早く 動きます。',
      5: '電車は とても 早く 動きます。',
      6: '電車は とても 早く 動きます。',
    },
    words: ['The', 'train', 'moves', 'very', 'fast'],
    emoji: '🚆',
    category: 'transport',
  },
  {
    id: '28',
    english: 'We flew on an airplane yesterday.',
    japanese: 'わたしたちは きのう ひこうきに のりました。',
    jaKanji: {
      1: 'わたしたちは きのう ひこうきに のりました。',
      2: 'わたしたちは きのう ひこうきに 乗りました。',
      3: 'わたしたちは 昨日 ひこうきに 乗りました。',
      4: 'わたしたちは 昨日 飛行機に 乗りました。',
      5: 'わたしたちは 昨日 飛行機に 乗りました。',
      6: '私たちは 昨日 飛行機に 乗りました。',
    },
    words: ['We', 'flew', 'on', 'an', 'airplane', 'yesterday'],
    emoji: '✈️',
    category: 'transport',
  },
  {
    id: '29',
    english: 'The red car drives down the street.',
    japanese: 'あかい くるまが みちを はしります。',
    jaKanji: {
      1: '赤い 車が みちを 走ります。',
      2: '赤い 車が 道を 走ります。',
      3: '赤い 車が 道を 走ります。',
      4: '赤い 車が 道を 走ります。',
      5: '赤い 車が 道を 走ります。',
      6: '赤い 車が 道を 走ります。',
    },
    words: ['The', 'red', 'car', 'drives', 'down', 'the', 'street'],
    emoji: '🚗',
    category: 'transport',
  },
  {
    id: '30',
    english: 'My sister rides her bicycle to work.',
    japanese: 'あねは じてんしゃで しごとに いきます。',
    jaKanji: {
      1: 'あねは じてんしゃで しごとに 行きます。',
      2: '姉は 自てん車で 仕事に 行きます。',
      3: '姉は 自転車で 仕事に 行きます。',
      4: '姉は 自転車で 仕事に 行きます。',
      5: '姉は 自転車で 仕事に 行きます。',
      6: '姉は 自転車で 仕事に 行きます。',
    },
    words: ['My', 'sister', 'rides', 'her', 'bicycle', 'to', 'work'],
    emoji: '🚲',
    category: 'transport',
  },

  // Weather - 天気
  {
    id: '31',
    english: 'It is sunny and warm today.',
    japanese: 'きょうは はれていて あたたかいです。',
    jaKanji: {
      1: '今日は はれていて あたたかいです。',
      2: '今日は はれていて 暖かいです。',
      3: '今日は 晴れていて 暖かいです。',
      4: '今日は 晴れていて 暖かいです。',
      5: '今日は 晴れていて 暖かいです。',
      6: '今日は 晴れていて 暖かいです。',
    },
    words: ['It', 'is', 'sunny', 'and', 'warm', 'today'],
    emoji: '☀️',
    category: 'weather',
  },
  {
    id: '32',
    english: 'The rain falls from dark clouds.',
    japanese: 'くらい くもから あめが ふります。',
    jaKanji: {
      1: 'くらい 雲から 雨が ふります。',
      2: '暗い 雲から 雨が ふります。',
      3: '暗い 雲から 雨が 降ります。',
      4: '暗い 雲から 雨が 降ります。',
      5: '暗い 雲から 雨が 降ります。',
      6: '暗い 雲から 雨が 降ります。',
    },
    words: ['The', 'rain', 'falls', 'from', 'dark', 'clouds'],
    emoji: '🌧️',
    category: 'weather',
  },
  {
    id: '33',
    english: 'Snow covers the ground in winter.',
    japanese: 'ふゆに ゆきが じめんを おおいます。',
    jaKanji: {
      1: '冬に 雪が じめんを おおいます。',
      2: '冬に 雪が 地めんを おおいます。',
      3: '冬に 雪が 地面を おおいます。',
      4: '冬に 雪が 地面を 覆います。',
      5: '冬に 雪が 地面を 覆います。',
      6: '冬に 雪が 地面を 覆います。',
    },
    words: ['Snow', 'covers', 'the', 'ground', 'in', 'winter'],
    emoji: '❄️',
    category: 'weather',
  },
  {
    id: '34',
    english: 'The wind blows through the trees.',
    japanese: 'かぜが きのあいだを ふきます。',
    jaKanji: {
      1: 'かぜが 木のあいだを ふきます。',
      2: '風が 木のあいだを ふきます。',
      3: '風が 木の間を ふきます。',
      4: '風が 木の間を 吹きます。',
      5: '風が 木の間を 吹きます。',
      6: '風が 木の間を 吹きます。',
    },
    words: ['The', 'wind', 'blows', 'through', 'the', 'trees'],
    emoji: '💨',
    category: 'weather',
  },
  {
    id: '35',
    english: 'Lightning flashes in the storm.',
    japanese: 'あらしのとき いなずまが ひかります。',
    jaKanji: {
      1: 'あらしのとき いなずまが ひかります。',
      2: 'あらしの時 いなずまが 光ります。',
      3: '嵐の時 いなずまが 光ります。',
      4: '嵐の時 稲ずまが 光ります。',
      5: '嵐の時 稲妻が 光ります。',
      6: '嵐の時 稲妻が 光ります。',
    },
    words: ['Lightning', 'flashes', 'in', 'the', 'storm'],
    emoji: '⚡',
    category: 'weather',
  },

  // Colors & Art - 色と芸術
  {
    id: '36',
    english: 'I paint with bright red colors.',
    japanese: 'わたしは あかるい あかいろで えを かきます。',
    jaKanji: {
      1: 'わたしは あかるい 赤いろで えを かきます。',
      2: 'わたしは 明るい 赤色で えを かきます。',
      3: 'わたしは 明るい 赤色で 絵を かきます。',
      4: 'わたしは 明るい 赤色で 絵を 描きます。',
      5: 'わたしは 明るい 赤色で 絵を 描きます。',
      6: '私は 明るい 赤色で 絵を 描きます。',
    },
    words: ['I', 'paint', 'with', 'bright', 'red', 'colors'],
    emoji: '🎨',
    category: 'art',
  },
  {
    id: '37',
    english: 'The blue sky looks beautiful today.',
    japanese: 'あおい そらが きょう うつくしく みえます。',
    jaKanji: {
      1: '青い 空が 今日 うつくしく 見えます。',
      2: '青い 空が 今日 美しく 見えます。',
      3: '青い 空が 今日 美しく 見えます。',
      4: '青い 空が 今日 美しく 見えます。',
      5: '青い 空が 今日 美しく 見えます。',
      6: '青い 空が 今日 美しく 見えます。',
    },
    words: ['The', 'blue', 'sky', 'looks', 'beautiful', 'today'],
    emoji: '🟦',
    category: 'art',
  },
  {
    id: '38',
    english: 'Green grass grows in the field.',
    japanese: 'みどりの くさが はたけに はえます。',
    jaKanji: {
      1: 'みどりの 草が はたけに はえます。',
      2: '緑の 草が 畑に はえます。',
      3: '緑の 草が 畑に 生えます。',
      4: '緑の 草が 畑に 生えます。',
      5: '緑の 草が 畑に 生えます。',
      6: '緑の 草が 畑に 生えます。',
    },
    words: ['Green', 'grass', 'grows', 'in', 'the', 'field'],
    emoji: '🟢',
    category: 'art',
  },
  {
    id: '39',
    english: 'She draws yellow flowers in her book.',
    japanese: 'かのじょは ほんに きいろい はなを かきます。',
    jaKanji: {
      1: 'かのじょは 本に 黄いろい 花を かきます。',
      2: '彼女は 本に 黄色い 花を かきます。',
      3: '彼女は 本に 黄色い 花を かきます。',
      4: '彼女は 本に 黄色い 花を 描きます。',
      5: '彼女は 本に 黄色い 花を 描きます。',
      6: '彼女は 本に 黄色い 花を 描きます。',
    },
    words: ['She', 'draws', 'yellow', 'flowers', 'in', 'her', 'book'],
    emoji: '🟡',
    category: 'art',
  },
  {
    id: '40',
    english: 'Purple balloons float in the air.',
    japanese: 'むらさきの ふうせんが そらに うかびます。',
    jaKanji: {
      1: 'むらさきの ふうせんが 空に うかびます。',
      2: 'むらさきの ふうせんが 空に うかびます。',
      3: '紫の ふうせんが 空に うかびます。',
      4: '紫の 風船が 空に 浮かびます。',
      5: '紫の 風船が 空に 浮かびます。',
      6: '紫の 風船が 空に 浮かびます。',
    },
    words: ['Purple', 'balloons', 'float', 'in', 'the', 'air'],
    emoji: '🟣',
    category: 'art',
  },

  // Music & Dance - 音楽とダンス
  {
    id: '41',
    english: 'I play the piano at home.',
    japanese: 'わたしは いえで ピアノを ひきます。',
    jaKanji: {
      1: 'わたしは 家で ピアノを ひきます。',
      2: 'わたしは 家で ピアノを ひきます。',
      3: 'わたしは 家で ピアノを ひきます。',
      4: 'わたしは 家で ピアノを 弾きます。',
      5: 'わたしは 家で ピアノを 弾きます。',
      6: '私は 家で ピアノを 弾きます。',
    },
    words: ['I', 'play', 'the', 'piano', 'at', 'home'],
    emoji: '🎹',
    category: 'music',
  },
  {
    id: '42',
    english: 'She sings a beautiful song.',
    japanese: 'かのじょは うつくしい うたを うたいます。',
    jaKanji: {
      1: 'かのじょは うつくしい 歌を うたいます。',
      2: '彼女は 美しい 歌を 歌います。',
      3: '彼女は 美しい 歌を 歌います。',
      4: '彼女は 美しい 歌を 歌います。',
      5: '彼女は 美しい 歌を 歌います。',
      6: '彼女は 美しい 歌を 歌います。',
    },
    words: ['She', 'sings', 'a', 'beautiful', 'song'],
    emoji: '🎵',
    category: 'music',
  },
  {
    id: '43',
    english: 'We dance to the happy music.',
    japanese: 'わたしたちは たのしい おんがくに あわせて おどります。',
    jaKanji: {
      1: 'わたしたちは たのしい 音がくに 合わせて おどります。',
      2: 'わたしたちは 楽しい 音楽に 合わせて おどります。',
      3: 'わたしたちは 楽しい 音楽に 合わせて おどります。',
      4: 'わたしたちは 楽しい 音楽に 合わせて 踊ります。',
      5: 'わたしたちは 楽しい 音楽に 合わせて 踊ります。',
      6: '私たちは 楽しい 音楽に 合わせて 踊ります。',
    },
    words: ['We', 'dance', 'to', 'the', 'happy', 'music'],
    emoji: '💃',
    category: 'music',
  },
  {
    id: '44',
    english: 'The guitar makes lovely sounds.',
    japanese: 'ギターは すてきな おとを だします。',
    jaKanji: {
      1: 'ギターは すてきな 音を 出します。',
      2: 'ギターは すてきな 音を 出します。',
      3: 'ギターは 素てきな 音を 出します。',
      4: 'ギターは 素敵な 音を 出します。',
      5: 'ギターは 素敵な 音を 出します。',
      6: 'ギターは 素敵な 音を 出します。',
    },
    words: ['The', 'guitar', 'makes', 'lovely', 'sounds'],
    emoji: '🎸',
    category: 'music',
  },
  {
    id: '45',
    english: 'My friend plays drums very well.',
    japanese: 'ともだちは ドラムを とても じょうずに たたきます。',
    jaKanji: {
      1: 'ともだちは ドラムを とても じょうずに たたきます。',
      2: '友だちは ドラムを とても じょうずに たたきます。',
      3: '友だちは ドラムを とても 上手に たたきます。',
      4: '友達は ドラムを とても 上手に 叩きます。',
      5: '友達は ドラムを とても 上手に 叩きます。',
      6: '友達は ドラムを とても 上手に 叩きます。',
    },
    words: ['My', 'friend', 'plays', 'drums', 'very', 'well'],
    emoji: '🥁',
    category: 'music',
  },

  // Time & Calendar - 時間とカレンダー
  {
    id: '46',
    english: "I wake up at seven o'clock.",
    japanese: 'わたしは しちじに おきます。',
    jaKanji: {
      1: 'わたしは 七じに おきます。',
      2: 'わたしは 七時に おきます。',
      3: 'わたしは 七時に おきます。',
      4: 'わたしは 七時に 起きます。',
      5: 'わたしは 七時に 起きます。',
      6: '私は 七時に 起きます。',
    },
    words: ['I', 'wake', 'up', 'at', 'seven', "o'clock"],
    emoji: '⏰',
    category: 'time',
  },
  {
    id: '47',
    english: 'Today is Monday morning.',
    japanese: 'きょうは げつようびの あさです。',
    jaKanji: {
      1: '今日は げつ曜日の 朝です。',
      2: '今日は 月曜日の 朝です。',
      3: '今日は 月曜日の 朝です。',
      4: '今日は 月曜日の 朝です。',
      5: '今日は 月曜日の 朝です。',
      6: '今日は 月曜日の 朝です。',
    },
    words: ['Today', 'is', 'Monday', 'morning'],
    emoji: '📅',
    category: 'time',
  },
  {
    id: '48',
    english: 'We have dinner at six thirty.',
    japanese: 'わたしたちは ろくじはんに ばんごはんを たべます。',
    jaKanji: {
      1: 'わたしたちは 六じはんに ばんごはんを たべます。',
      2: 'わたしたちは 六時はんに 晩ごはんを 食べます。',
      3: 'わたしたちは 六時半に 晩ごはんを 食べます。',
      4: 'わたしたちは 六時半に 晩ご飯を 食べます。',
      5: 'わたしたちは 六時半に 晩ご飯を 食べます。',
      6: '私たちは 六時半に 晩ご飯を 食べます。',
    },
    words: ['We', 'have', 'dinner', 'at', 'six', 'thirty'],
    emoji: '🕕',
    category: 'time',
  },
  {
    id: '49',
    english: 'My birthday is in December.',
    japanese: 'わたしの たんじょうびは じゅうにがつです。',
    jaKanji: {
      1: 'わたしの たんじょう日は 十二月です。',
      2: 'わたしの 誕生日は 十二月です。',
      3: 'わたしの 誕生日は 十二月です。',
      4: 'わたしの 誕生日は 十二月です。',
      5: 'わたしの 誕生日は 十二月です。',
      6: '私の 誕生日は 十二月です。',
    },
    words: ['My', 'birthday', 'is', 'in', 'December'],
    emoji: '🎂',
    category: 'time',
  },
  {
    id: '50',
    english: 'Spring comes after winter ends.',
    japanese: 'ふゆが おわると はるが きます。',
    jaKanji: {
      1: '冬が おわると 春が 来ます。',
      2: '冬が 終わると 春が 来ます。',
      3: '冬が 終わると 春が 来ます。',
      4: '冬が 終わると 春が 来ます。',
      5: '冬が 終わると 春が 来ます。',
      6: '冬が 終わると 春が 来ます。',
    },
    words: ['Spring', 'comes', 'after', 'winter', 'ends'],
    emoji: '🌸',
    category: 'time',
  },

  // Animals - 動物 (続き)
  {
    id: '51',
    english: 'The cat sleeps in the warm sun.',
    japanese: 'ねこは あたたかい おひさまの なかで ねています。',
    jaKanji: {
      1: '猫は あたたかい お日さまの 中で ねています。',
      2: '猫は 暖かい お日様の 中で ねています。',
      3: '猫は 暖かい お日様の 中で 寝ています。',
      4: '猫は 暖かい お日様の 中で 寝ています。',
      5: '猫は 暖かい お日様の 中で 寝ています。',
      6: '猫は 暖かい お日様の 中で 寝ています。',
    },
    words: ['The', 'cat', 'sleeps', 'in', 'the', 'warm', 'sun'],
    emoji: '🐱',
    category: 'nature',
  },
  {
    id: '52',
    english: 'Fish swim quickly in the river.',
    japanese: 'さかなは かわで はやく およぎます。',
    jaKanji: {
      1: '魚は 川で 早く およぎます。',
      2: '魚は 川で 早く およぎます。',
      3: '魚は 川で 早く およぎます。',
      4: '魚は 川で 早く 泳ぎます。',
      5: '魚は 川で 早く 泳ぎます。',
      6: '魚は 川で 早く 泳ぎます。',
    },
    words: ['Fish', 'swim', 'quickly', 'in', 'the', 'river'],
    emoji: '🐟',
    category: 'nature',
  },
  {
    id: '53',
    english: 'The elephant has a long trunk.',
    japanese: 'ぞうは ながい はなを もっています。',
    jaKanji: {
      1: 'ぞうは 長い 鼻を もっています。',
      2: 'ぞうは 長い 鼻を 持っています。',
      3: '象は 長い 鼻を 持っています。',
      4: '象は 長い 鼻を 持っています。',
      5: '象は 長い 鼻を 持っています。',
      6: '象は 長い 鼻を 持っています。',
    },
    words: ['The', 'elephant', 'has', 'a', 'long', 'trunk'],
    emoji: '🐘',
    category: 'nature',
  },
  {
    id: '54',
    english: 'Rabbits hop across the grass.',
    japanese: 'うさぎは くさのうえを ぴょんぴょんと はねます。',
    jaKanji: {
      1: 'うさぎは 草の上を ぴょんぴょんと はねます。',
      2: 'うさぎは 草の上を ぴょんぴょんと はねます。',
      3: 'うさぎは 草の上を ぴょんぴょんと はねます。',
      4: 'うさぎは 草の上を ぴょんぴょんと 跳ねます。',
      5: 'うさぎは 草の上を ぴょんぴょんと 跳ねます。',
      6: '兎は 草の上を ぴょんぴょんと 跳ねます。',
    },
    words: ['Rabbits', 'hop', 'across', 'the', 'grass'],
    emoji: '🐰',
    category: 'nature',
  },
  {
    id: '55',
    english: 'The monkey swings from tree to tree.',
    japanese: 'さるは きから きへと ブランコのように とびうつります。',
    jaKanji: {
      1: 'さるは 木から 木へと ブランコのように とびうつります。',
      2: 'さるは 木から 木へと ブランコのように とびうつります。',
      3: '猿は 木から 木へと ブランコのように とびうつります。',
      4: '猿は 木から 木へと ブランコのように 飛び移ります。',
      5: '猿は 木から 木へと ブランコのように 飛び移ります。',
      6: '猿は 木から 木へと ブランコのように 飛び移ります。',
    },
    words: ['The', 'monkey', 'swings', 'from', 'tree', 'to', 'tree'],
    emoji: '🐒',
    category: 'nature',
  },

  // Emotions & Feelings - 感情
  {
    id: '56',
    english: 'I feel happy when I see my friends.',
    japanese: 'ともだちに あうと うれしく なります。',
    jaKanji: {
      1: 'ともだちに 会うと うれしく なります。',
      2: '友だちに 会うと うれしく なります。',
      3: '友だちに 会うと うれしく なります。',
      4: '友達に 会うと 嬉しく なります。',
      5: '友達に 会うと 嬉しく なります。',
      6: '友達に 会うと 嬉しく なります。',
    },
    words: ['I', 'feel', 'happy', 'when', 'I', 'see', 'my', 'friends'],
    emoji: '😊',
    category: 'feelings',
  },
  {
    id: '57',
    english: 'She is sad because her toy broke.',
    japanese: 'おもちゃが こわれたので かのじょは かなしんでいます。',
    jaKanji: {
      1: 'おもちゃが こわれたので かのじょは かなしんでいます。',
      2: 'おもちゃが こわれたので 彼女は 悲しんでいます。',
      3: 'おもちゃが 壊れたので 彼女は 悲しんでいます。',
      4: 'おもちゃが 壊れたので 彼女は 悲しんでいます。',
      5: 'おもちゃが 壊れたので 彼女は 悲しんでいます。',
      6: 'おもちゃが 壊れたので 彼女は 悲しんでいます。',
    },
    words: ['She', 'is', 'sad', 'because', 'her', 'toy', 'broke'],
    emoji: '😢',
    category: 'feelings',
  },
  {
    id: '58',
    english: 'We get excited about the school trip.',
    japanese: 'わたしたちは しゅうがくりょこうが たのしみです。',
    jaKanji: {
      1: 'わたしたちは しゅうがくりょこうが 楽しみです。',
      2: 'わたしたちは 修学りょこうが 楽しみです。',
      3: 'わたしたちは 修学旅行が 楽しみです。',
      4: 'わたしたちは 修学旅行が 楽しみです。',
      5: 'わたしたちは 修学旅行が 楽しみです。',
      6: '私たちは 修学旅行が 楽しみです。',
    },
    words: ['We', 'get', 'excited', 'about', 'the', 'school', 'trip'],
    emoji: '🤩',
    category: 'feelings',
  },
  {
    id: '59',
    english: 'My little brother feels scared of the dark.',
    japanese: 'おとうとは くらやみを こわがります。',
    jaKanji: {
      1: 'おとうとは くらやみを こわがります。',
      2: '弟は くらやみを こわがります。',
      3: '弟は 暗やみを こわがります。',
      4: '弟は 暗闇を 怖がります。',
      5: '弟は 暗闇を 怖がります。',
      6: '弟は 暗闇を 怖がります。',
    },
    words: ['My', 'little', 'brother', 'feels', 'scared', 'of', 'the', 'dark'],
    emoji: '😨',
    category: 'feelings',
  },
  {
    id: '60',
    english: 'The baby laughs when tickled.',
    japanese: 'あかちゃんは くすぐられると わらいます。',
    jaKanji: {
      1: '赤ちゃんは くすぐられると 笑います。',
      2: '赤ちゃんは くすぐられると 笑います。',
      3: '赤ちゃんは くすぐられると 笑います。',
      4: '赤ちゃんは くすぐられると 笑います。',
      5: '赤ちゃんは くすぐられると 笑います。',
      6: '赤ちゃんは くすぐられると 笑います。',
    },
    words: ['The', 'baby', 'laughs', 'when', 'tickled'],
    emoji: '😂',
    category: 'feelings',
  },

  // House & Rooms - 家と部屋
  {
    id: '61',
    english: 'My bedroom has a big window.',
    japanese: 'わたしの しんしつには おおきな まどが あります。',
    jaKanji: {
      1: 'わたしの しんしつには 大きな まどが あります。',
      2: 'わたしの 寝室には 大きな 窓が あります。',
      3: 'わたしの 寝室には 大きな 窓が あります。',
      4: 'わたしの 寝室には 大きな 窓が あります。',
      5: 'わたしの 寝室には 大きな 窓が あります。',
      6: '私の 寝室には 大きな 窓が あります。',
    },
    words: ['My', 'bedroom', 'has', 'a', 'big', 'window'],
    emoji: '🏠',
    category: 'house',
  },
  {
    id: '62',
    english: 'We eat meals in the kitchen.',
    japanese: 'わたしたちは だいどころで しょくじを します。',
    jaKanji: {
      1: 'わたしたちは だいどころで しょくじを します。',
      2: 'わたしたちは 台所で 食事を します。',
      3: 'わたしたちは 台所で 食事を します。',
      4: 'わたしたちは 台所で 食事を します。',
      5: 'わたしたちは 台所で 食事を します。',
      6: '私たちは 台所で 食事を します。',
    },
    words: ['We', 'eat', 'meals', 'in', 'the', 'kitchen'],
    emoji: '🍽️',
    category: 'house',
  },
  {
    id: '63',
    english: 'The living room has comfortable chairs.',
    japanese: 'いまには らくな いすが あります。',
    jaKanji: {
      1: 'いまには らくな いすが あります。',
      2: '居間には 楽な いすが あります。',
      3: '居間には 楽な 椅子が あります。',
      4: '居間には 楽な 椅子が あります。',
      5: '居間には 楽な 椅子が あります。',
      6: '居間には 楽な 椅子が あります。',
    },
    words: ['The', 'living', 'room', 'has', 'comfortable', 'chairs'],
    emoji: '🪑',
    category: 'house',
  },
  {
    id: '64',
    english: 'I take a bath in the bathroom.',
    japanese: 'わたしは おふろばで おふろに はいります。',
    jaKanji: {
      1: 'わたしは おふろ場で おふろに 入ります。',
      2: 'わたしは お風ろ場で お風ろに 入ります。',
      3: 'わたしは お風呂場で お風呂に 入ります。',
      4: 'わたしは お風呂場で お風呂に 入ります。',
      5: 'わたしは お風呂場で お風呂に 入ります。',
      6: '私は お風呂場で お風呂に 入ります。',
    },
    words: ['I', 'take', 'a', 'bath', 'in', 'the', 'bathroom'],
    emoji: '🛁',
    category: 'house',
  },
  {
    id: '65',
    english: 'The garden behind our house is beautiful.',
    japanese: 'いえの うしろの にわは うつくしいです。',
    jaKanji: {
      1: '家の うしろの 庭は うつくしいです。',
      2: '家の 後ろの 庭は 美しいです。',
      3: '家の 後ろの 庭は 美しいです。',
      4: '家の 後ろの 庭は 美しいです。',
      5: '家の 後ろの 庭は 美しいです。',
      6: '家の 後ろの 庭は 美しいです。',
    },
    words: ['The', 'garden', 'behind', 'our', 'house', 'is', 'beautiful'],
    emoji: '🌺',
    category: 'house',
  },

  // Technology & Gadgets - 技術
  {
    id: '66',
    english: 'I use a computer for homework.',
    japanese: 'わたしは しゅくだいに コンピューターを つかいます。',
    jaKanji: {
      1: 'わたしは しゅくだいに コンピューターを つかいます。',
      2: 'わたしは 宿だいに コンピューターを 使います。',
      3: 'わたしは 宿題に コンピューターを 使います。',
      4: 'わたしは 宿題に コンピューターを 使います。',
      5: 'わたしは 宿題に コンピューターを 使います。',
      6: '私は 宿題に コンピューターを 使います。',
    },
    words: ['I', 'use', 'a', 'computer', 'for', 'homework'],
    emoji: '💻',
    category: 'technology',
  },
  {
    id: '67',
    english: 'My phone rings when friends call.',
    japanese: 'ともだちが でんわすると でんわが なります。',
    jaKanji: {
      1: 'ともだちが 電話すると 電話が 鳴ります。',
      2: '友だちが 電話すると 電話が 鳴ります。',
      3: '友だちが 電話すると 電話が 鳴ります。',
      4: '友達が 電話すると 電話が 鳴ります。',
      5: '友達が 電話すると 電話が 鳴ります。',
      6: '友達が 電話すると 電話が 鳴ります。',
    },
    words: ['My', 'phone', 'rings', 'when', 'friends', 'call'],
    emoji: '📱',
    category: 'technology',
  },
  {
    id: '68',
    english: 'We watch movies on the television.',
    japanese: 'わたしたちは テレビで えいがを みます。',
    jaKanji: {
      1: 'わたしたちは テレビで えいがを 見ます。',
      2: 'わたしたちは テレビで 映がを 見ます。',
      3: 'わたしたちは テレビで 映画を 見ます。',
      4: 'わたしたちは テレビで 映画を 見ます。',
      5: 'わたしたちは テレビで 映画を 見ます。',
      6: '私たちは テレビで 映画を 見ます。',
    },
    words: ['We', 'watch', 'movies', 'on', 'the', 'television'],
    emoji: '📺',
    category: 'technology',
  },
  {
    id: '69',
    english: 'The camera takes beautiful pictures.',
    japanese: 'カメラは うつくしい しゃしんを とります。',
    jaKanji: {
      1: 'カメラは うつくしい しゃしんを とります。',
      2: 'カメラは 美しい しゃしんを とります。',
      3: 'カメラは 美しい 写真を とります。',
      4: 'カメラは 美しい 写真を 撮ります。',
      5: 'カメラは 美しい 写真を 撮ります。',
      6: 'カメラは 美しい 写真を 撮ります。',
    },
    words: ['The', 'camera', 'takes', 'beautiful', 'pictures'],
    emoji: '📷',
    category: 'technology',
  },
  {
    id: '70',
    english: 'Video games are fun to play.',
    japanese: 'ビデオゲームは あそぶのが たのしいです。',
    jaKanji: {
      1: 'ビデオゲームは あそぶのが 楽しいです。',
      2: 'ビデオゲームは 遊ぶのが 楽しいです。',
      3: 'ビデオゲームは 遊ぶのが 楽しいです。',
      4: 'ビデオゲームは 遊ぶのが 楽しいです。',
      5: 'ビデオゲームは 遊ぶのが 楽しいです。',
      6: 'ビデオゲームは 遊ぶのが 楽しいです。',
    },
    words: ['Video', 'games', 'are', 'fun', 'to', 'play'],
    emoji: '🎮',
    category: 'technology',
  },

  // Clothes & Fashion - 服装
  {
    id: '71',
    english: 'I wear my favorite blue shirt.',
    japanese: 'わたしは すきな あおい シャツを きます。',
    jaKanji: {
      1: 'わたしは すきな 青い シャツを きます。',
      2: 'わたしは すきな 青い シャツを 着ます。',
      3: 'わたしは 好きな 青い シャツを 着ます。',
      4: 'わたしは 好きな 青い シャツを 着ます。',
      5: 'わたしは 好きな 青い シャツを 着ます。',
      6: '私は 好きな 青い シャツを 着ます。',
    },
    words: ['I', 'wear', 'my', 'favorite', 'blue', 'shirt'],
    emoji: '👕',
    category: 'clothes',
  },
  {
    id: '72',
    english: 'Her red dress looks very pretty.',
    japanese: 'かのじょの あかい ドレスは とても きれいです。',
    jaKanji: {
      1: 'かのじょの 赤い ドレスは とても きれいです。',
      2: '彼女の 赤い ドレスは とても きれいです。',
      3: '彼女の 赤い ドレスは とても きれいです。',
      4: '彼女の 赤い ドレスは とても きれいです。',
      5: '彼女の 赤い ドレスは とても 綺麗です。',
      6: '彼女の 赤い ドレスは とても 綺麗です。',
    },
    words: ['Her', 'red', 'dress', 'looks', 'very', 'pretty'],
    emoji: '👗',
    category: 'clothes',
  },
  {
    id: '73',
    english: 'We put on warm coats in winter.',
    japanese: 'ふゆには あたたかい コートを きます。',
    jaKanji: {
      1: '冬には あたたかい コートを 着ます。',
      2: '冬には 暖かい コートを 着ます。',
      3: '冬には 暖かい コートを 着ます。',
      4: '冬には 暖かい コートを 着ます。',
      5: '冬には 暖かい コートを 着ます。',
      6: '冬には 暖かい コートを 着ます。',
    },
    words: ['We', 'put', 'on', 'warm', 'coats', 'in', 'winter'],
    emoji: '🧥',
    category: 'clothes',
  },
  {
    id: '74',
    english: 'My new shoes are very comfortable.',
    japanese: 'わたしの あたらしい くつは とても らくです。',
    jaKanji: {
      1: 'わたしの 新しい くつは とても らくです。',
      2: 'わたしの 新しい 靴は とても 楽です。',
      3: 'わたしの 新しい 靴は とても 楽です。',
      4: 'わたしの 新しい 靴は とても 楽です。',
      5: 'わたしの 新しい 靴は とても 楽です。',
      6: '私の 新しい 靴は とても 楽です。',
    },
    words: ['My', 'new', 'shoes', 'are', 'very', 'comfortable'],
    emoji: '👟',
    category: 'clothes',
  },
  {
    id: '75',
    english: 'The hat protects me from the sun.',
    japanese: 'ぼうしは たいようから わたしを まもります。',
    jaKanji: {
      1: 'ぼうしは 太ようから わたしを 守ります。',
      2: 'ぼうしは 太陽から わたしを 守ります。',
      3: '帽子は 太陽から わたしを 守ります。',
      4: '帽子は 太陽から わたしを 守ります。',
      5: '帽子は 太陽から わたしを 守ります。',
      6: '帽子は 太陽から 私を 守ります。',
    },
    words: ['The', 'hat', 'protects', 'me', 'from', 'the', 'sun'],
    emoji: '🧢',
    category: 'clothes',
  },

  // Health & Body - 健康と体
  {
    id: '76',
    english: 'I exercise to stay healthy and strong.',
    japanese: 'わたしは けんこうで つよくいるために うんどうします。',
    jaKanji: {
      1: 'わたしは けんこうで つよくいるために うんどうします。',
      2: 'わたしは 健こうで 強くいるために 運動します。',
      3: 'わたしは 健康で 強くいるために 運動します。',
      4: 'わたしは 健康で 強くいるために 運動します。',
      5: 'わたしは 健康で 強くいるために 運動します。',
      6: '私は 健康で 強くいるために 運動します。',
    },
    words: ['I', 'exercise', 'to', 'stay', 'healthy', 'and', 'strong'],
    emoji: '💪',
    category: 'health',
  },
  {
    id: '77',
    english: 'My eyes are brown and my hair is black.',
    japanese: 'わたしの めは ちゃいろで かみは くろいです。',
    jaKanji: {
      1: 'わたしの 目は ちゃいろで 髪は 黒いです。',
      2: 'わたしの 目は 茶いろで 髪は 黒いです。',
      3: 'わたしの 目は 茶色で 髪は 黒いです。',
      4: 'わたしの 目は 茶色で 髪は 黒いです。',
      5: 'わたしの 目は 茶色で 髪は 黒いです。',
      6: '私の 目は 茶色で 髪は 黒いです。',
    },
    words: ['My', 'eyes', 'are', 'brown', 'and', 'my', 'hair', 'is', 'black'],
    emoji: '👁️',
    category: 'health',
  },
  {
    id: '78',
    english: 'I wash my hands before eating.',
    japanese: 'わたしは たべるまえに てを あらいます。',
    jaKanji: {
      1: 'わたしは 食べるまえに 手を 洗います。',
      2: 'わたしは 食べる前に 手を 洗います。',
      3: 'わたしは 食べる前に 手を 洗います。',
      4: 'わたしは 食べる前に 手を 洗います。',
      5: 'わたしは 食べる前に 手を 洗います。',
      6: '私は 食べる前に 手を 洗います。',
    },
    words: ['I', 'wash', 'my', 'hands', 'before', 'eating'],
    emoji: '🧼',
    category: 'health',
  },
  {
    id: '79',
    english: 'The doctor checks if I am feeling well.',
    japanese: 'おいしゃさんは わたしが げんきかを しらべます。',
    jaKanji: {
      1: 'おいしゃさんは わたしが 元気かを 調べます。',
      2: 'お医者さんは わたしが 元気かを 調べます。',
      3: 'お医者さんは わたしが 元気かを 調べます。',
      4: 'お医者さんは わたしが 元気かを 調べます。',
      5: 'お医者さんは わたしが 元気かを 調べます。',
      6: 'お医者さんは 私が 元気かを 調べます。',
    },
    words: ['The', 'doctor', 'checks', 'if', 'I', 'am', 'feeling', 'well'],
    emoji: '👨‍⚕️',
    category: 'health',
  },
  {
    id: '80',
    english: 'I need to sleep eight hours every night.',
    japanese: 'わたしは まいばん はちじかん ねなければなりません。',
    jaKanji: {
      1: 'わたしは まいばん 八じかん ねなければなりません。',
      2: 'わたしは 毎ばん 八時間 ねなければなりません。',
      3: 'わたしは 毎晩 八時間 ねなければなりません。',
      4: 'わたしは 毎晩 八時間 寝なければなりません。',
      5: 'わたしは 毎晩 八時間 寝なければなりません。',
      6: '私は 毎晩 八時間 寝なければなりません。',
    },
    words: ['I', 'need', 'to', 'sleep', 'eight', 'hours', 'every', 'night'],
    emoji: '😴',
    category: 'health',
  },

  // Numbers & Math - 数字と算数
  {
    id: '81',
    english: 'I have ten fingers on my hands.',
    japanese: 'わたしの てには じゅっぽんの ゆびが あります。',
    jaKanji: {
      1: 'わたしの 手には 十ぽんの 指が あります。',
      2: 'わたしの 手には 十本の 指が あります。',
      3: 'わたしの 手には 十本の 指が あります。',
      4: 'わたしの 手には 十本の 指が あります。',
      5: 'わたしの 手には 十本の 指が あります。',
      6: '私の 手には 十本の 指が あります。',
    },
    words: ['I', 'have', 'ten', 'fingers', 'on', 'my', 'hands'],
    emoji: '✋',
    category: 'numbers',
  },
  {
    id: '82',
    english: 'Two plus three equals five.',
    japanese: 'にたす さんは ごです。',
    jaKanji: {
      1: '二たす 三は 五です。',
      2: '二たす 三は 五です。',
      3: '二足す 三は 五です。',
      4: '二足す 三は 五です。',
      5: '二足す 三は 五です。',
      6: '二足す 三は 五です。',
    },
    words: ['Two', 'plus', 'three', 'equals', 'five'],
    emoji: '➕',
    category: 'numbers',
  },
  {
    id: '83',
    english: 'She counts from one to twenty.',
    japanese: 'かのじょは いちから にじゅうまで かぞえます。',
    jaKanji: {
      1: 'かのじょは 一から 二十まで 数えます。',
      2: '彼女は 一から 二十まで 数えます。',
      3: '彼女は 一から 二十まで 数えます。',
      4: '彼女は 一から 二十まで 数えます。',
      5: '彼女は 一から 二十まで 数えます。',
      6: '彼女は 一から 二十まで 数えます。',
    },
    words: ['She', 'counts', 'from', 'one', 'to', 'twenty'],
    emoji: '🔢',
    category: 'numbers',
  },
  {
    id: '84',
    english: 'There are seven days in one week.',
    japanese: 'いっしゅうかんには なのかが あります。',
    jaKanji: {
      1: '一しゅうかんには 七日が あります。',
      2: '一週かんには 七日が あります。',
      3: '一週間には 七日が あります。',
      4: '一週間には 七日が あります。',
      5: '一週間には 七日が あります。',
      6: '一週間には 七日が あります。',
    },
    words: ['There', 'are', 'seven', 'days', 'in', 'one', 'week'],
    emoji: '📅',
    category: 'numbers',
  },
  {
    id: '85',
    english: 'I can solve this math problem easily.',
    japanese: 'わたしは この さんすうの もんだいを かんたんに とけます。',
    jaKanji: {
      1: 'わたしは この 算すうの 問だいを かんたんに とけます。',
      2: 'わたしは この 算数の 問題を かんたんに とけます。',
      3: 'わたしは この 算数の 問題を 簡単に とけます。',
      4: 'わたしは この 算数の 問題を 簡単に 解けます。',
      5: 'わたしは この 算数の 問題を 簡単に 解けます。',
      6: '私は この 算数の 問題を 簡単に 解けます。',
    },
    words: ['I', 'can', 'solve', 'this', 'math', 'problem', 'easily'],
    emoji: '🧮',
    category: 'numbers',
  },

  // Hobbies & Interests - 趣味
  {
    id: '86',
    english: 'I collect colorful stamps from different countries.',
    japanese: 'わたしは いろいろな くにの カラフルな きってを あつめます。',
    jaKanji: {
      1: 'わたしは いろいろな 国の カラフルな 切手を 集めます。',
      2: 'わたしは いろいろな 国の カラフルな 切手を 集めます。',
      3: 'わたしは 色々な 国の カラフルな 切手を 集めます。',
      4: 'わたしは 色々な 国の カラフルな 切手を 集めます。',
      5: 'わたしは 色々な 国の カラフルな 切手を 集めます。',
      6: '私は 色々な 国の カラフルな 切手を 集めます。',
    },
    words: ['I', 'collect', 'colorful', 'stamps', 'from', 'different', 'countries'],
    emoji: '📮',
    category: 'hobbies',
  },
  {
    id: '87',
    english: 'She enjoys knitting scarves for her family.',
    japanese: 'かのじょは かぞくのために マフラーを あむのが すきです。',
    jaKanji: {
      1: 'かのじょは 家ぞくのために マフラーを あむのが すきです。',
      2: '彼女は 家族のために マフラーを あむのが すきです。',
      3: '彼女は 家族のために マフラーを 編むのが すきです。',
      4: '彼女は 家族のために マフラーを 編むのが 好きです。',
      5: '彼女は 家族のために マフラーを 編むのが 好きです。',
      6: '彼女は 家族のために マフラーを 編むのが 好きです。',
    },
    words: ['She', 'enjoys', 'knitting', 'scarves', 'for', 'her', 'family'],
    emoji: '🧶',
    category: 'hobbies',
  },
  {
    id: '88',
    english: 'We like to go fishing by the lake.',
    japanese: 'わたしたちは みずうみで つりを するのが すきです。',
    jaKanji: {
      1: 'わたしたちは みずうみで つりを するのが すきです。',
      2: 'わたしたちは 湖で つりを するのが すきです。',
      3: 'わたしたちは 湖で つりを するのが すきです。',
      4: 'わたしたちは 湖で 釣りを するのが 好きです。',
      5: 'わたしたちは 湖で 釣りを するのが 好きです。',
      6: '私たちは 湖で 釣りを するのが 好きです。',
    },
    words: ['We', 'like', 'to', 'go', 'fishing', 'by', 'the', 'lake'],
    emoji: '🎣',
    category: 'hobbies',
  },
  {
    id: '89',
    english: 'My grandfather loves to work in his garden.',
    japanese: 'おじいちゃんは にわしごとが だいすきです。',
    jaKanji: {
      1: 'おじいちゃんは 庭しごとが 大すきです。',
      2: 'おじいちゃんは 庭仕事が 大好きです。',
      3: 'おじいちゃんは 庭仕事が 大好きです。',
      4: 'お祖父ちゃんは 庭仕事が 大好きです。',
      5: 'お祖父ちゃんは 庭仕事が 大好きです。',
      6: 'お祖父ちゃんは 庭仕事が 大好きです。',
    },
    words: ['My', 'grandfather', 'loves', 'to', 'work', 'in', 'his', 'garden'],
    emoji: '👴',
    category: 'hobbies',
  },
  {
    id: '90',
    english: 'I build model airplanes in my free time.',
    japanese: 'わたしは ひまなときに もけいひこうきを つくります。',
    jaKanji: {
      1: 'わたしは ひまな時に 模けいひこうきを 作ります。',
      2: 'わたしは ひまな時に 模けい飛行機を 作ります。',
      3: 'わたしは 暇な時に 模型飛行機を 作ります。',
      4: 'わたしは 暇な時に 模型飛行機を 作ります。',
      5: 'わたしは 暇な時に 模型飛行機を 作ります。',
      6: '私は 暇な時に 模型飛行機を 作ります。',
    },
    words: ['I', 'build', 'model', 'airplanes', 'in', 'my', 'free', 'time'],
    emoji: '✈️',
    category: 'hobbies',
  },

  // Shopping & Money - 買い物とお金
  {
    id: '91',
    english: 'I save money to buy a new bicycle.',
    japanese: 'わたしは あたらしい じてんしゃを かうために おかねを ためます。',
    jaKanji: {
      1: 'わたしは 新しい 自てん車を 買うために お金を ためます。',
      2: 'わたしは 新しい 自転車を 買うために お金を ためます。',
      3: 'わたしは 新しい 自転車を 買うために お金を ためます。',
      4: 'わたしは 新しい 自転車を 買うために お金を 貯めます。',
      5: 'わたしは 新しい 自転車を 買うために お金を 貯めます。',
      6: '私は 新しい 自転車を 買うために お金を 貯めます。',
    },
    words: ['I', 'save', 'money', 'to', 'buy', 'a', 'new', 'bicycle'],
    emoji: '💰',
    category: 'shopping',
  },
  {
    id: '92',
    english: 'We go to the store to buy groceries.',
    japanese: 'わたしたちは しょくりょうひんを かいに みせに いきます。',
    jaKanji: {
      1: 'わたしたちは 食りょうひんを 買いに 店に 行きます。',
      2: 'わたしたちは 食料ひんを 買いに 店に 行きます。',
      3: 'わたしたちは 食料品を 買いに 店に 行きます。',
      4: 'わたしたちは 食料品を 買いに 店に 行きます。',
      5: 'わたしたちは 食料品を 買いに 店に 行きます。',
      6: '私たちは 食料品を 買いに 店に 行きます。',
    },
    words: ['We', 'go', 'to', 'the', 'store', 'to', 'buy', 'groceries'],
    emoji: '🛒',
    category: 'shopping',
  },
  {
    id: '93',
    english: 'The toy costs five dollars.',
    japanese: 'そのおもちゃは ごドルです。',
    jaKanji: {
      1: 'そのおもちゃは 五ドルです。',
      2: 'そのおもちゃは 五ドルです。',
      3: 'そのおもちゃは 五ドルです。',
      4: 'そのおもちゃは 五ドルです。',
      5: 'そのおもちゃは 五ドルです。',
      6: 'そのおもちゃは 五ドルです。',
    },
    words: ['The', 'toy', 'costs', 'five', 'dollars'],
    emoji: '🧸',
    category: 'shopping',
  },
  {
    id: '94',
    english: 'She pays with her credit card.',
    japanese: 'かのじょは クレジットカードで はらいます。',
    jaKanji: {
      1: 'かのじょは クレジットカードで はらいます。',
      2: '彼女は クレジットカードで はらいます。',
      3: '彼女は クレジットカードで はらいます。',
      4: '彼女は クレジットカードで 払います。',
      5: '彼女は クレジットカードで 払います。',
      6: '彼女は クレジットカードで 払います。',
    },
    words: ['She', 'pays', 'with', 'her', 'credit', 'card'],
    emoji: '💳',
    category: 'shopping',
  },
  {
    id: '95',
    english: 'The shopping mall has many different stores.',
    japanese: 'ショッピングモールには いろいろな みせが あります。',
    jaKanji: {
      1: 'ショッピングモールには いろいろな 店が あります。',
      2: 'ショッピングモールには いろいろな 店が あります。',
      3: 'ショッピングモールには 色々な 店が あります。',
      4: 'ショッピングモールには 色々な 店が あります。',
      5: 'ショッピングモールには 色々な 店が あります。',
      6: 'ショッピングモールには 色々な 店が あります。',
    },
    words: ['The', 'shopping', 'mall', 'has', 'many', 'different', 'stores'],
    emoji: '🏬',
    category: 'shopping',
  },

  // Seasons & Holidays - 季節と祝日
  {
    id: '96',
    english: 'We celebrate Christmas with our family.',
    japanese: 'わたしたちは かぞくと クリスマスを おいわいします。',
    jaKanji: {
      1: 'わたしたちは 家ぞくと クリスマスを おいわいします。',
      2: 'わたしたちは 家族と クリスマスを おいわいします。',
      3: 'わたしたちは 家族と クリスマスを おいわいします。',
      4: 'わたしたちは 家族と クリスマスを お祝いします。',
      5: 'わたしたちは 家族と クリスマスを お祝いします。',
      6: '私たちは 家族と クリスマスを お祝いします。',
    },
    words: ['We', 'celebrate', 'Christmas', 'with', 'our', 'family'],
    emoji: '🎄',
    category: 'holidays',
  },
  {
    id: '97',
    english: 'Halloween is my favorite scary holiday.',
    japanese: 'ハロウィンは わたしの いちばんすきな こわい やすみです。',
    jaKanji: {
      1: 'ハロウィンは わたしの 一ばんすきな こわい やすみです。',
      2: 'ハロウィンは わたしの 一番すきな こわい 休みです。',
      3: 'ハロウィンは わたしの 一番すきな 怖い 休みです。',
      4: 'ハロウィンは わたしの 一番好きな 怖い 休みです。',
      5: 'ハロウィンは わたしの 一番好きな 怖い 休みです。',
      6: 'ハロウィンは 私の 一番好きな 怖い 休みです。',
    },
    words: ['Halloween', 'is', 'my', 'favorite', 'scary', 'holiday'],
    emoji: '🎃',
    category: 'holidays',
  },
  {
    id: '98',
    english: 'Summer vacation lasts for two months.',
    japanese: 'なつやすみは にかげつ つづきます。',
    jaKanji: {
      1: '夏やすみは 二か月 つづきます。',
      2: '夏休みは 二か月 つづきます。',
      3: '夏休みは 二ヶ月 つづきます。',
      4: '夏休みは 二ヶ月 続きます。',
      5: '夏休みは 二ヶ月 続きます。',
      6: '夏休みは 二ヶ月 続きます。',
    },
    words: ['Summer', 'vacation', 'lasts', 'for', 'two', 'months'],
    emoji: '🏖️',
    category: 'holidays',
  },
  {
    id: '99',
    english: 'Spring flowers bloom everywhere in the park.',
    japanese: 'はるになると こうえんの いたるところで はながさきます。',
    jaKanji: {
      1: '春になると 公園の いたるところで 花がさきます。',
      2: '春になると 公園の いたるところで 花が さきます。',
      3: '春になると 公園の 至る所で 花が さきます。',
      4: '春になると 公園の 至る所で 花が 咲きます。',
      5: '春になると 公園の 至る所で 花が 咲きます。',
      6: '春になると 公園の 至る所で 花が 咲きます。',
    },
    words: ['Spring', 'flowers', 'bloom', 'everywhere', 'in', 'the', 'park'],
    emoji: '🌺',
    category: 'holidays',
  },
  {
    id: '100',
    english: 'New Year brings hope and new beginnings.',
    japanese: 'しんねんは きぼうと あたらしい はじまりを もたらします。',
    jaKanji: {
      1: '新年は 希ぼうと 新しい はじまりを もたらします。',
      2: '新年は 希望と 新しい はじまりを もたらします。',
      3: '新年は 希望と 新しい 始まりを もたらします。',
      4: '新年は 希望と 新しい 始まりを もたらします。',
      5: '新年は 希望と 新しい 始まりを もたらします。',
      6: '新年は 希望と 新しい 始まりを もたらします。',
    },
    words: ['New', 'Year', 'brings', 'hope', 'and', 'new', 'beginnings'],
    emoji: '🎊',
    category: 'holidays',
  },
];

const categories = [
  { id: 'all', name: { en: 'All Sentences', ja: 'すべてのぶんしょう' }, emoji: '📝' },
  { id: 'daily', name: { en: 'Daily Life', ja: 'にちじょう' }, emoji: '🏠' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦' },
  { id: 'sports', name: { en: 'Sports', ja: 'スポーツ' }, emoji: '⚽' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎' },
  { id: 'transport', name: { en: 'Transportation', ja: 'のりもの' }, emoji: '🚌' },
  { id: 'weather', name: { en: 'Weather', ja: 'てんき' }, emoji: '☀️' },
  { id: 'art', name: { en: 'Colors & Art', ja: 'いろとげいじゅつ' }, emoji: '🎨' },
  { id: 'music', name: { en: 'Music', ja: 'おんがく' }, emoji: '🎵' },
  { id: 'time', name: { en: 'Time', ja: 'じかん' }, emoji: '⏰' },
  { id: 'feelings', name: { en: 'Feelings', ja: 'きもち' }, emoji: '😊' },
  { id: 'house', name: { en: 'House', ja: 'いえ' }, emoji: '🏠' },
  { id: 'technology', name: { en: 'Technology', ja: 'ぎじゅつ' }, emoji: '💻' },
  { id: 'clothes', name: { en: 'Clothes', ja: 'ふく' }, emoji: '👕' },
  { id: 'health', name: { en: 'Health', ja: 'けんこう' }, emoji: '💪' },
  { id: 'numbers', name: { en: 'Numbers', ja: 'すうじ' }, emoji: '🔢' },
  { id: 'hobbies', name: { en: 'Hobbies', ja: 'しゅみ' }, emoji: '🎯' },
  { id: 'shopping', name: { en: 'Shopping', ja: 'かいもの' }, emoji: '🛒' },
  { id: 'holidays', name: { en: 'Holidays', ja: 'きゅうじつ' }, emoji: '🎉' },
];

interface WordOrderGame {
  sentence: Sentence;
  shuffledWords: string[];
  selectedWords: string[];
  isCorrect: boolean | null;
}

export function VocabularyGamePage(): JSX.Element {
  const { language, kanjiGrade } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentGame, setCurrentGame] = useState<WordOrderGame | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name ?? '');
  }, []);

  const filteredSentences =
    selectedCategory === 'all'
      ? sentences
      : sentences.filter((item) => item.category === selectedCategory);

  // ページネーション計算
  const totalPages = Math.ceil(filteredSentences.length / itemsPerPage);
  const paginatedSentences = filteredSentences.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  // カテゴリ変更時にページをリセット
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = (sentence: Sentence): void => {
    setCurrentGame({
      sentence,
      shuffledWords: shuffleArray(sentence.words),
      selectedWords: [],
      isCorrect: null,
    });
    setHintLevel(0);
  };

  const handleWordClick = async (word: string, fromSelected: boolean): Promise<void> => {
    if (!currentGame || currentGame.isCorrect !== null) {
      return;
    }

    await playSound('click');

    if (fromSelected) {
      // 選択済みから削除
      const index = currentGame.selectedWords.indexOf(word);
      if (index > -1) {
        const newSelected = [...currentGame.selectedWords];
        newSelected.splice(index, 1);
        setCurrentGame({ ...currentGame, selectedWords: newSelected });
      }
    } else {
      // 選択に追加
      setCurrentGame({
        ...currentGame,
        selectedWords: [...currentGame.selectedWords, word],
      });
    }
  };

  const handleUndo = async (): Promise<void> => {
    if (!currentGame || currentGame.selectedWords.length === 0 || currentGame.isCorrect !== null) {
      return;
    }

    await playSound('click');

    // 最後に選択した単語を削除
    const newSelected = [...currentGame.selectedWords];
    newSelected.pop();
    setCurrentGame({ ...currentGame, selectedWords: newSelected });
  };

  const checkAnswer = async (): Promise<void> => {
    if (!currentGame) {
      return;
    }

    // Remove punctuation from the sentence for comparison
    const sentenceWithoutPunctuation = currentGame.sentence.english.replace(/[.,!?]/g, '');
    const userAnswer = currentGame.selectedWords.join(' ');
    const isCorrect = userAnswer === sentenceWithoutPunctuation;
    setCurrentGame({ ...currentGame, isCorrect });

    // Calculate score based on correctness, sentence length, and hint level
    const baseScore = isCorrect ? currentGame.sentence.words.length * 10 : 5;
    const hintPenalty = isCorrect ? hintLevel * 10 : 0; // -10 points per hint level
    const bonusScore = isCorrect && hintLevel === 0 ? 20 : 0; // Bonus for no hints
    const totalScore = Math.max(baseScore - hintPenalty + bonusScore, 10); // Minimum 10 points

    if (isCorrect) {
      setScore(score + totalScore);
    }

    // Save progress to localStorage
    if (userName.length > 0) {
      progressService.updateSentencePracticeProgress(
        userName,
        currentGame.sentence.id,
        isCorrect,
        totalScore,
      );
    }

    if (isCorrect) {
      await playSound('success');
      speak(currentGame.sentence.english, 'en');
    } else {
      await playSound('error');
    }
  };

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const handleCategoryChange = async (categoryId: string): Promise<void> => {
    await playSound('click');
    setSelectedCategory(categoryId);
    setCurrentGame(null);
  };

  const playAudio = async (): Promise<void> => {
    if (!currentGame) {
      return;
    }
    await playSound('click');
    speak(currentGame.sentence.english, 'en');
  };

  const getHintText = (): string => {
    if (!currentGame) {
      return '';
    }

    const { sentence } = currentGame;

    switch (hintLevel) {
      case 1:
        // Level 1: Number of words and basic structure
        return language === 'ja'
          ? `${sentence.words.length}個の単語を使います。`
          : `Use ${sentence.words.length} words to make the sentence.`;

      case 2: {
        // Level 2: First word and sentence type
        const sentenceType = sentence.english.endsWith('?')
          ? language === 'ja'
            ? '質問文'
            : 'question'
          : sentence.english.endsWith('!')
            ? language === 'ja'
              ? '感嘆文'
              : 'exclamation'
            : language === 'ja'
              ? '平叙文'
              : 'statement';
        return language === 'ja'
          ? `最初の単語は「${sentence.words[0]}」です。これは${sentenceType}です。`
          : `The first word is "${sentence.words[0]}". This is a ${sentenceType}.`;
      }

      case 3: {
        // Level 3: First half of the sentence
        const halfLength = Math.ceil(sentence.words.length / 2);
        const firstHalf = sentence.words.slice(0, halfLength).join(' ');
        return language === 'ja' ? `文の前半: ${firstHalf}...` : `First half: ${firstHalf}...`;
      }

      default:
        return '';
    }
  };

  const showNextHint = async (): Promise<void> => {
    await playSound('click');
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1);
    }
  };

  const nextSentence = async (): Promise<void> => {
    await playSound('click');
    setCurrentGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to home"
          >
            ←
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            {language === 'ja' ? 'ぶんしょうれんしゅう' : 'Sentence Practice'} 📝
          </h1>
          <div className="text-lg font-bold text-purple-600">Score: {score}</div>
        </div>

        {!currentGame ? (
          <>
            {/* 漢字レベル選択 */}
            <div className="flex justify-center mb-4">
              <KanjiGradeSelector />
            </div>

            {/* カテゴリー選択 */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-purple-100'
                    }
                  `}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {language === 'ja' ? category.name.ja : category.name.en}
                </button>
              ))}
            </div>

            {/* 文章選択グリッド */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {paginatedSentences.map((sentence, index) => (
                  <motion.button
                    key={sentence.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame(sentence)}
                    className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all"
                  >
                    <div className="text-4xl mb-3">{sentence.emoji}</div>
                    <div className="text-base font-medium text-gray-800 mb-2">
                      {sentence.english}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ja' ? sentence.jaKanji[kanjiGrade] : sentence.english}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ページネーションコントロール */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                >
                  {language === 'ja' ? 'まえ' : 'Previous'}
                </button>
                <span className="text-gray-700">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
                >
                  {language === 'ja' ? 'つぎ' : 'Next'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* ゲーム画面 */
          <div className="max-w-4xl mx-auto">
            {/* 問題文 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{currentGame.sentence.emoji}</div>
                <div className="flex gap-2">
                  <button
                    onClick={playAudio}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🔊 {language === 'ja' ? 'きく' : 'Listen'}
                  </button>
                  <button
                    onClick={showNextHint}
                    disabled={hintLevel >= 3}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      hintLevel >= 3
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    💡 {language === 'ja' ? `ヒント (${hintLevel}/3)` : `Hint (${hintLevel}/3)`}
                  </button>
                </div>
              </div>

              <div className="text-xl text-gray-800 mb-2">
                {language === 'ja'
                  ? currentGame.sentence.jaKanji[kanjiGrade]
                  : currentGame.sentence.english}
              </div>

              {hintLevel > 0 && (
                <motion.div
                  key={hintLevel}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-yellow-50 rounded-lg"
                >
                  <div className="text-sm font-medium text-yellow-800 mb-1">
                    {language === 'ja' ? `ヒントレベル ${hintLevel}` : `Hint Level ${hintLevel}`}
                  </div>
                  <div className="text-base text-gray-700">{getHintText()}</div>
                </motion.div>
              )}
            </div>

            {/* 選択した単語 */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 min-h-[80px]">
              <div className="flex flex-wrap gap-2">
                {currentGame.selectedWords.length === 0 ? (
                  <p className="text-gray-500 italic">
                    {language === 'ja' ? 'ことばを えらんでね' : 'Select words to make a sentence'}
                  </p>
                ) : (
                  currentGame.selectedWords.map((word, index) => (
                    <motion.button
                      key={`selected-${index}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word, true)}
                      className="px-4 py-2 bg-white rounded-lg shadow text-lg font-medium hover:shadow-lg transition-all"
                      disabled={currentGame.isCorrect !== null}
                    >
                      {word}
                    </motion.button>
                  ))
                )}
              </div>

              {/* 戻るボタン */}
              {currentGame.selectedWords.length > 0 && currentGame.isCorrect === null && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleUndo}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    ⤺ {language === 'ja' ? 'もどす' : 'Undo'}
                  </button>
                </div>
              )}
            </div>

            {/* 選択可能な単語 */}
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {currentGame.shuffledWords.map((word, index) => {
                  const isUsed = currentGame.selectedWords.includes(word);
                  const count = currentGame.shuffledWords.filter((w) => w === word).length;
                  const usedCount = currentGame.selectedWords.filter((w) => w === word).length;
                  const isAvailable = usedCount < count;

                  if (!isAvailable) {
                    return null;
                  }

                  return (
                    <motion.button
                      key={`word-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWordClick(word, false)}
                      className={`
                        px-4 py-2 rounded-lg text-lg font-medium transition-all
                        ${
                          isUsed
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
                        }
                      `}
                      disabled={currentGame.isCorrect !== null}
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-center gap-4">
              {currentGame.isCorrect === null ? (
                <button
                  onClick={checkAnswer}
                  disabled={currentGame.selectedWords.length === 0}
                  className={`
                    px-8 py-3 rounded-full text-lg font-medium transition-all
                    ${
                      currentGame.selectedWords.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                    }
                  `}
                >
                  {language === 'ja' ? 'こたえをみる' : 'Check Answer'}
                </button>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
                      px-6 py-3 rounded-full text-lg font-medium
                      ${
                        currentGame.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }
                    `}
                  >
                    {currentGame.isCorrect
                      ? language === 'ja'
                        ? 'せいかい！ 🎉'
                        : 'Correct! 🎉'
                      : language === 'ja'
                        ? 'もういちど 💪'
                        : 'Try again 💪'}
                  </motion.div>
                  <button
                    onClick={nextSentence}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    {language === 'ja' ? 'つぎへ' : 'Next'}
                  </button>
                </>
              )}
            </div>

            {/* 正解表示 */}
            {currentGame.isCorrect === false && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 rounded-lg text-center"
              >
                <p className="text-gray-700">
                  {language === 'ja' ? 'せいかい:' : 'Correct answer:'}
                </p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {currentGame.sentence.english}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
