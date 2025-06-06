import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { FlashCard } from '@/components/FlashCard';

interface VocabularyWord {
  id: string;
  english: string;
  japanese: string;
  romaji: string;
  category: string;
  image: string;
  emoji: string;
  example?: {
    english: string;
    japanese: string;
  };
}

const vocabularyWords: VocabularyWord[] = [
  // Basic Foods - 食べ物
  {
    id: '1',
    english: 'apple',
    japanese: 'りんご',
    romaji: 'ringo',
    category: 'food',
    image: '/images/apple.jpg',
    emoji: '🍎',
    example: {
      english: 'I like red apples.',
      japanese: 'あかい りんごが すきです。',
    },
  },
  {
    id: '2',
    english: 'banana',
    japanese: 'バナナ',
    romaji: 'banana',
    category: 'food',
    image: '/images/banana.jpg',
    emoji: '🍌',
    example: {
      english: 'Bananas are yellow.',
      japanese: 'バナナは きいろです。',
    },
  },
  {
    id: '3',
    english: 'milk',
    japanese: 'ぎゅうにゅう',
    romaji: 'gyuunyuu',
    category: 'food',
    image: '/images/milk.jpg',
    emoji: '🥛',
    example: {
      english: 'I drink milk every day.',
      japanese: 'まいにち ぎゅうにゅうを のみます。',
    },
  },
  {
    id: '4',
    english: 'bread',
    japanese: 'パン',
    romaji: 'pan',
    category: 'food',
    image: '/images/bread.jpg',
    emoji: '🍞',
    example: {
      english: 'I eat bread for breakfast.',
      japanese: 'あさごはんに パンを たべます。',
    },
  },
  {
    id: '5',
    english: 'rice',
    japanese: 'ごはん',
    romaji: 'gohan',
    category: 'food',
    image: '/images/rice.jpg',
    emoji: '🍚',
    example: {
      english: 'We eat rice for dinner.',
      japanese: 'ばんごはんに ごはんを たべます。',
    },
  },
  {
    id: '6',
    english: 'egg',
    japanese: 'たまご',
    romaji: 'tamago',
    category: 'food',
    image: '/images/egg.jpg',
    emoji: '🥚',
    example: {
      english: 'I like boiled eggs.',
      japanese: 'ゆでたまごが すきです。',
    },
  },
  {
    id: '7',
    english: 'orange',
    japanese: 'オレンジ',
    romaji: 'orenji',
    category: 'food',
    image: '/images/orange.jpg',
    emoji: '🍊',
    example: {
      english: 'Oranges are sweet.',
      japanese: 'オレンジは あまいです。',
    },
  },
  {
    id: '8',
    english: 'water',
    japanese: 'みず',
    romaji: 'mizu',
    category: 'food',
    image: '/images/water.jpg',
    emoji: '💧',
    example: {
      english: 'Water is good for you.',
      japanese: 'みずは からだに いいです。',
    },
  },
  {
    id: '9',
    english: 'cheese',
    japanese: 'チーズ',
    romaji: 'chiizu',
    category: 'food',
    image: '/images/cheese.jpg',
    emoji: '🧀',
    example: {
      english: 'I put cheese on my sandwich.',
      japanese: 'サンドイッチに チーズを いれます。',
    },
  },
  {
    id: '10',
    english: 'cookie',
    japanese: 'クッキー',
    romaji: 'kukkii',
    category: 'food',
    image: '/images/cookie.jpg',
    emoji: '🍪',
    example: {
      english: 'Cookies are sweet snacks.',
      japanese: 'クッキーは あまい おやつです。',
    },
  },
  // Animals - 動物
  {
    id: '11',
    english: 'cat',
    japanese: 'ねこ',
    romaji: 'neko',
    category: 'animals',
    image: '/images/cat.jpg',
    emoji: '🐱',
    example: {
      english: 'The cat is sleeping.',
      japanese: 'ねこが ねています。',
    },
  },
  {
    id: '12',
    english: 'dog',
    japanese: 'いぬ',
    romaji: 'inu',
    category: 'animals',
    image: '/images/dog.jpg',
    emoji: '🐶',
    example: {
      english: 'My dog is very cute.',
      japanese: 'わたしの いぬは とても かわいいです。',
    },
  },
  {
    id: '13',
    english: 'bird',
    japanese: 'とり',
    romaji: 'tori',
    category: 'animals',
    image: '/images/bird.jpg',
    emoji: '🐦',
    example: {
      english: 'Birds can fly in the sky.',
      japanese: 'とりは そらを とべます。',
    },
  },
  {
    id: '14',
    english: 'fish',
    japanese: 'さかな',
    romaji: 'sakana',
    category: 'animals',
    image: '/images/fish.jpg',
    emoji: '🐟',
    example: {
      english: 'Fish live in the water.',
      japanese: 'さかなは みずの なかに すんでいます。',
    },
  },
  {
    id: '15',
    english: 'rabbit',
    japanese: 'うさぎ',
    romaji: 'usagi',
    category: 'animals',
    image: '/images/rabbit.jpg',
    emoji: '🐰',
    example: {
      english: 'Rabbits have long ears.',
      japanese: 'うさぎは ながい みみが あります。',
    },
  },
  {
    id: '16',
    english: 'elephant',
    japanese: 'ぞう',
    romaji: 'zou',
    category: 'animals',
    image: '/images/elephant.jpg',
    emoji: '🐘',
    example: {
      english: 'Elephants are big.',
      japanese: 'ぞうは おおきいです。',
    },
  },
  {
    id: '17',
    english: 'lion',
    japanese: 'ライオン',
    romaji: 'raion',
    category: 'animals',
    image: '/images/lion.jpg',
    emoji: '🦁',
    example: {
      english: 'Lions are strong.',
      japanese: 'ライオンは つよいです。',
    },
  },
  {
    id: '18',
    english: 'bear',
    japanese: 'くま',
    romaji: 'kuma',
    category: 'animals',
    image: '/images/bear.jpg',
    emoji: '🐻',
    example: {
      english: 'Bears live in the forest.',
      japanese: 'くまは もりに すんでいます。',
    },
  },
  {
    id: '19',
    english: 'monkey',
    japanese: 'さる',
    romaji: 'saru',
    category: 'animals',
    image: '/images/monkey.jpg',
    emoji: '🐵',
    example: {
      english: 'Monkeys like bananas.',
      japanese: 'さるは バナナが すきです。',
    },
  },
  {
    id: '20',
    english: 'panda',
    japanese: 'パンダ',
    romaji: 'panda',
    category: 'animals',
    image: '/images/panda.jpg',
    emoji: '🐼',
    example: {
      english: 'Pandas eat bamboo.',
      japanese: 'パンダは たけを たべます。',
    },
  },
  // Colors - 色
  {
    id: '21',
    english: 'red',
    japanese: 'あか',
    romaji: 'aka',
    category: 'colors',
    image: '/images/red.jpg',
    emoji: '🔴',
    example: {
      english: 'The apple is red.',
      japanese: 'りんごは あかいです。',
    },
  },
  {
    id: '22',
    english: 'blue',
    japanese: 'あお',
    romaji: 'ao',
    category: 'colors',
    image: '/images/blue.jpg',
    emoji: '🔵',
    example: {
      english: 'The sky is blue.',
      japanese: 'そらは あおいです。',
    },
  },
  {
    id: '23',
    english: 'yellow',
    japanese: 'きいろ',
    romaji: 'kiiro',
    category: 'colors',
    image: '/images/yellow.jpg',
    emoji: '🟡',
    example: {
      english: 'The sun is yellow.',
      japanese: 'たいようは きいろです。',
    },
  },
  {
    id: '24',
    english: 'green',
    japanese: 'みどり',
    romaji: 'midori',
    category: 'colors',
    image: '/images/green.jpg',
    emoji: '🟢',
    example: {
      english: 'Leaves are green.',
      japanese: 'はっぱは みどりです。',
    },
  },
  {
    id: '25',
    english: 'white',
    japanese: 'しろ',
    romaji: 'shiro',
    category: 'colors',
    image: '/images/white.jpg',
    emoji: '⚪',
    example: {
      english: 'Snow is white.',
      japanese: 'ゆきは しろいです。',
    },
  },
  {
    id: '26',
    english: 'black',
    japanese: 'くろ',
    romaji: 'kuro',
    category: 'colors',
    image: '/images/black.jpg',
    emoji: '⚫',
    example: {
      english: 'My shoes are black.',
      japanese: 'わたしの くつは くろいです。',
    },
  },
  {
    id: '27',
    english: 'pink',
    japanese: 'ピンク',
    romaji: 'pinku',
    category: 'colors',
    image: '/images/pink.jpg',
    emoji: '🩷',
    example: {
      english: 'The flower is pink.',
      japanese: 'はなは ピンクです。',
    },
  },
  {
    id: '28',
    english: 'purple',
    japanese: 'むらさき',
    romaji: 'murasaki',
    category: 'colors',
    image: '/images/purple.jpg',
    emoji: '🟣',
    example: {
      english: 'Grapes are purple.',
      japanese: 'ぶどうは むらさきです。',
    },
  },
  {
    id: '29',
    english: 'orange',
    japanese: 'オレンジいろ',
    romaji: 'orenji iro',
    category: 'colors',
    image: '/images/orange-color.jpg',
    emoji: '🟠',
    example: {
      english: 'The sunset is orange.',
      japanese: 'ゆうひは オレンジいろです。',
    },
  },
  {
    id: '30',
    english: 'brown',
    japanese: 'ちゃいろ',
    romaji: 'chairo',
    category: 'colors',
    image: '/images/brown.jpg',
    emoji: '🟤',
    example: {
      english: 'Wood is brown.',
      japanese: 'きは ちゃいろです。',
    },
  },
  // Family - 家族
  {
    id: '31',
    english: 'mother',
    japanese: 'おかあさん',
    romaji: 'okaasan',
    category: 'family',
    image: '/images/mother.jpg',
    emoji: '👩',
    example: {
      english: 'My mother is kind.',
      japanese: 'わたしの おかあさんは やさしいです。',
    },
  },
  {
    id: '32',
    english: 'father',
    japanese: 'おとうさん',
    romaji: 'otousan',
    category: 'family',
    image: '/images/father.jpg',
    emoji: '👨',
    example: {
      english: 'My father works hard.',
      japanese: 'わたしの おとうさんは よく はたらきます。',
    },
  },
  {
    id: '33',
    english: 'sister',
    japanese: 'いもうと',
    romaji: 'imouto',
    category: 'family',
    image: '/images/sister.jpg',
    emoji: '👧',
    example: {
      english: 'My sister likes dolls.',
      japanese: 'わたしの いもうとは にんぎょうが すきです。',
    },
  },
  {
    id: '34',
    english: 'brother',
    japanese: 'おとうと',
    romaji: 'otouto',
    category: 'family',
    image: '/images/brother.jpg',
    emoji: '👦',
    example: {
      english: 'My brother plays soccer.',
      japanese: 'わたしの おとうとは サッカーを します。',
    },
  },
  {
    id: '35',
    english: 'grandmother',
    japanese: 'おばあさん',
    romaji: 'obaasan',
    category: 'family',
    image: '/images/grandmother.jpg',
    emoji: '👵',
    example: {
      english: 'My grandmother tells stories.',
      japanese: 'おばあさんは おはなしを してくれます。',
    },
  },
  {
    id: '36',
    english: 'grandfather',
    japanese: 'おじいさん',
    romaji: 'ojiisan',
    category: 'family',
    image: '/images/grandfather.jpg',
    emoji: '👴',
    example: {
      english: 'My grandfather likes fishing.',
      japanese: 'おじいさんは つりが すきです。',
    },
  },
  {
    id: '37',
    english: 'baby',
    japanese: 'あかちゃん',
    romaji: 'akachan',
    category: 'family',
    image: '/images/baby.jpg',
    emoji: '👶',
    example: {
      english: 'The baby is sleeping.',
      japanese: 'あかちゃんが ねています。',
    },
  },
  {
    id: '38',
    english: 'friend',
    japanese: 'ともだち',
    romaji: 'tomodachi',
    category: 'family',
    image: '/images/friend.jpg',
    emoji: '👫',
    example: {
      english: 'I play with my friends.',
      japanese: 'ともだちと あそびます。',
    },
  },
  {
    id: '39',
    english: 'teacher',
    japanese: 'せんせい',
    romaji: 'sensei',
    category: 'family',
    image: '/images/teacher.jpg',
    emoji: '👨‍🏫',
    example: {
      english: 'My teacher is nice.',
      japanese: 'せんせいは やさしいです。',
    },
  },
  {
    id: '40',
    english: 'family',
    japanese: 'かぞく',
    romaji: 'kazoku',
    category: 'family',
    image: '/images/family.jpg',
    emoji: '👨‍👩‍👧‍👦',
    example: {
      english: 'I love my family.',
      japanese: 'かぞくが だいすきです。',
    },
  },
  // School - 学校
  {
    id: '41',
    english: 'book',
    japanese: 'ほん',
    romaji: 'hon',
    category: 'school',
    image: '/images/book.jpg',
    emoji: '📚',
    example: {
      english: 'I read a book every night.',
      japanese: 'まいばん ほんを よみます。',
    },
  },
  {
    id: '42',
    english: 'pencil',
    japanese: 'えんぴつ',
    romaji: 'enpitsu',
    category: 'school',
    image: '/images/pencil.jpg',
    emoji: '✏️',
    example: {
      english: 'I write with a pencil.',
      japanese: 'えんぴつで かきます。',
    },
  },
  {
    id: '43',
    english: 'school',
    japanese: 'がっこう',
    romaji: 'gakkou',
    category: 'school',
    image: '/images/school.jpg',
    emoji: '🏫',
    example: {
      english: 'I go to school every day.',
      japanese: 'まいにち がっこうに いきます。',
    },
  },
  {
    id: '44',
    english: 'eraser',
    japanese: 'けしゴム',
    romaji: 'keshigomu',
    category: 'school',
    image: '/images/eraser.jpg',
    emoji: '🧽',
    example: {
      english: 'I use an eraser to fix mistakes.',
      japanese: 'まちがいを けしゴムで けします。',
    },
  },
  {
    id: '45',
    english: 'notebook',
    japanese: 'ノート',
    romaji: 'nooto',
    category: 'school',
    image: '/images/notebook.jpg',
    emoji: '📓',
    example: {
      english: 'I write in my notebook.',
      japanese: 'ノートに かきます。',
    },
  },
  {
    id: '46',
    english: 'backpack',
    japanese: 'ランドセル',
    romaji: 'randoseru',
    category: 'school',
    image: '/images/backpack.jpg',
    emoji: '🎒',
    example: {
      english: 'I carry my backpack to school.',
      japanese: 'ランドセルを もって がっこうに いきます。',
    },
  },
  {
    id: '47',
    english: 'desk',
    japanese: 'つくえ',
    romaji: 'tsukue',
    category: 'school',
    image: '/images/desk.jpg',
    emoji: '🪑',
    example: {
      english: 'I study at my desk.',
      japanese: 'つくえで べんきょうします。',
    },
  },
  {
    id: '48',
    english: 'chair',
    japanese: 'いす',
    romaji: 'isu',
    category: 'school',
    image: '/images/chair.jpg',
    emoji: '🪑',
    example: {
      english: 'I sit on the chair.',
      japanese: 'いすに すわります。',
    },
  },
  {
    id: '49',
    english: 'classroom',
    japanese: 'きょうしつ',
    romaji: 'kyoushitsu',
    category: 'school',
    image: '/images/classroom.jpg',
    emoji: '🏫',
    example: {
      english: 'We study in the classroom.',
      japanese: 'きょうしつで べんきょうします。',
    },
  },
  {
    id: '50',
    english: 'homework',
    japanese: 'しゅくだい',
    romaji: 'shukudai',
    category: 'school',
    image: '/images/homework.jpg',
    emoji: '📝',
    example: {
      english: 'I do my homework after school.',
      japanese: 'がっこうの あとで しゅくだいを します。',
    },
  },
  // Body Parts - 体の部分
  {
    id: '51',
    english: 'head',
    japanese: 'あたま',
    romaji: 'atama',
    category: 'body',
    image: '/images/head.jpg',
    emoji: '👤',
    example: {
      english: 'I wear a hat on my head.',
      japanese: 'あたまに ぼうしを かぶります。',
    },
  },
  {
    id: '52',
    english: 'eye',
    japanese: 'め',
    romaji: 'me',
    category: 'body',
    image: '/images/eye.jpg',
    emoji: '👁️',
    example: {
      english: 'I see with my eyes.',
      japanese: 'めで みます。',
    },
  },
  {
    id: '53',
    english: 'nose',
    japanese: 'はな',
    romaji: 'hana',
    category: 'body',
    image: '/images/nose.jpg',
    emoji: '👃',
    example: {
      english: 'I smell with my nose.',
      japanese: 'はなで においを かぎます。',
    },
  },
  {
    id: '54',
    english: 'mouth',
    japanese: 'くち',
    romaji: 'kuchi',
    category: 'body',
    image: '/images/mouth.jpg',
    emoji: '👄',
    example: {
      english: 'I eat with my mouth.',
      japanese: 'くちで たべます。',
    },
  },
  {
    id: '55',
    english: 'ear',
    japanese: 'みみ',
    romaji: 'mimi',
    category: 'body',
    image: '/images/ear.jpg',
    emoji: '👂',
    example: {
      english: 'I hear with my ears.',
      japanese: 'みみで ききます。',
    },
  },
  {
    id: '56',
    english: 'hand',
    japanese: 'て',
    romaji: 'te',
    category: 'body',
    image: '/images/hand.jpg',
    emoji: '✋',
    example: {
      english: 'I write with my hand.',
      japanese: 'てで かきます。',
    },
  },
  {
    id: '57',
    english: 'foot',
    japanese: 'あし',
    romaji: 'ashi',
    category: 'body',
    image: '/images/foot.jpg',
    emoji: '🦶',
    example: {
      english: 'I walk with my feet.',
      japanese: 'あしで あるきます。',
    },
  },
  {
    id: '58',
    english: 'hair',
    japanese: 'かみのけ',
    romaji: 'kaminoke',
    category: 'body',
    image: '/images/hair.jpg',
    emoji: '💇',
    example: {
      english: 'I brush my hair.',
      japanese: 'かみのけを とかします。',
    },
  },
  {
    id: '59',
    english: 'teeth',
    japanese: 'は',
    romaji: 'ha',
    category: 'body',
    image: '/images/teeth.jpg',
    emoji: '🦷',
    example: {
      english: 'I brush my teeth.',
      japanese: 'はを みがきます。',
    },
  },
  {
    id: '60',
    english: 'finger',
    japanese: 'ゆび',
    romaji: 'yubi',
    category: 'body',
    image: '/images/finger.jpg',
    emoji: '👆',
    example: {
      english: 'I have five fingers.',
      japanese: 'ゆびが ５ほん あります。',
    },
  },
  // Nature - 自然
  {
    id: '61',
    english: 'sun',
    japanese: 'たいよう',
    romaji: 'taiyou',
    category: 'nature',
    image: '/images/sun.jpg',
    emoji: '☀️',
    example: {
      english: 'The sun is bright.',
      japanese: 'たいようは あかるいです。',
    },
  },
  {
    id: '62',
    english: 'moon',
    japanese: 'つき',
    romaji: 'tsuki',
    category: 'nature',
    image: '/images/moon.jpg',
    emoji: '🌙',
    example: {
      english: 'The moon comes out at night.',
      japanese: 'つきは よるに でます。',
    },
  },
  {
    id: '63',
    english: 'star',
    japanese: 'ほし',
    romaji: 'hoshi',
    category: 'nature',
    image: '/images/star.jpg',
    emoji: '⭐',
    example: {
      english: 'Stars shine at night.',
      japanese: 'ほしは よるに ひかります。',
    },
  },
  {
    id: '64',
    english: 'cloud',
    japanese: 'くも',
    romaji: 'kumo',
    category: 'nature',
    image: '/images/cloud.jpg',
    emoji: '☁️',
    example: {
      english: 'Clouds are in the sky.',
      japanese: 'くもは そらに あります。',
    },
  },
  {
    id: '65',
    english: 'rain',
    japanese: 'あめ',
    romaji: 'ame',
    category: 'nature',
    image: '/images/rain.jpg',
    emoji: '🌧️',
    example: {
      english: 'Rain falls from the sky.',
      japanese: 'あめは そらから ふります。',
    },
  },
  {
    id: '66',
    english: 'snow',
    japanese: 'ゆき',
    romaji: 'yuki',
    category: 'nature',
    image: '/images/snow.jpg',
    emoji: '❄️',
    example: {
      english: 'Snow is cold.',
      japanese: 'ゆきは つめたいです。',
    },
  },
  {
    id: '67',
    english: 'tree',
    japanese: 'き',
    romaji: 'ki',
    category: 'nature',
    image: '/images/tree.jpg',
    emoji: '🌳',
    example: {
      english: 'Trees are tall.',
      japanese: 'きは たかいです。',
    },
  },
  {
    id: '68',
    english: 'flower',
    japanese: 'はな',
    romaji: 'hana',
    category: 'nature',
    image: '/images/flower.jpg',
    emoji: '🌸',
    example: {
      english: 'Flowers are beautiful.',
      japanese: 'はなは きれいです。',
    },
  },
  {
    id: '69',
    english: 'mountain',
    japanese: 'やま',
    romaji: 'yama',
    category: 'nature',
    image: '/images/mountain.jpg',
    emoji: '⛰️',
    example: {
      english: 'Mountains are high.',
      japanese: 'やまは たかいです。',
    },
  },
  {
    id: '70',
    english: 'river',
    japanese: 'かわ',
    romaji: 'kawa',
    category: 'nature',
    image: '/images/river.jpg',
    emoji: '🏞️',
    example: {
      english: 'Fish swim in the river.',
      japanese: 'さかなは かわで およぎます。',
    },
  },
  // Daily Items - 日用品
  {
    id: '71',
    english: 'house',
    japanese: 'いえ',
    romaji: 'ie',
    category: 'items',
    image: '/images/house.jpg',
    emoji: '🏠',
    example: {
      english: 'I live in a house.',
      japanese: 'いえに すんでいます。',
    },
  },
  {
    id: '72',
    english: 'door',
    japanese: 'ドア',
    romaji: 'doa',
    category: 'items',
    image: '/images/door.jpg',
    emoji: '🚪',
    example: {
      english: 'I open the door.',
      japanese: 'ドアを あけます。',
    },
  },
  {
    id: '73',
    english: 'window',
    japanese: 'まど',
    romaji: 'mado',
    category: 'items',
    image: '/images/window.jpg',
    emoji: '🪟',
    example: {
      english: 'I look out the window.',
      japanese: 'まどから そとを みます。',
    },
  },
  {
    id: '74',
    english: 'clock',
    japanese: 'とけい',
    romaji: 'tokei',
    category: 'items',
    image: '/images/clock.jpg',
    emoji: '🕐',
    example: {
      english: 'The clock shows the time.',
      japanese: 'とけいは じかんを おしえます。',
    },
  },
  {
    id: '75',
    english: 'bed',
    japanese: 'ベッド',
    romaji: 'beddo',
    category: 'items',
    image: '/images/bed.jpg',
    emoji: '🛏️',
    example: {
      english: 'I sleep in my bed.',
      japanese: 'ベッドで ねます。',
    },
  },
  {
    id: '76',
    english: 'table',
    japanese: 'テーブル',
    romaji: 'teeburu',
    category: 'items',
    image: '/images/table.jpg',
    emoji: '🪑',
    example: {
      english: 'We eat at the table.',
      japanese: 'テーブルで たべます。',
    },
  },
  {
    id: '77',
    english: 'cup',
    japanese: 'カップ',
    romaji: 'kappu',
    category: 'items',
    image: '/images/cup.jpg',
    emoji: '☕',
    example: {
      english: 'I drink from a cup.',
      japanese: 'カップで のみます。',
    },
  },
  {
    id: '78',
    english: 'plate',
    japanese: 'おさら',
    romaji: 'osara',
    category: 'items',
    image: '/images/plate.jpg',
    emoji: '🍽️',
    example: {
      english: 'Food goes on the plate.',
      japanese: 'たべものは おさらに のせます。',
    },
  },
  {
    id: '79',
    english: 'spoon',
    japanese: 'スプーン',
    romaji: 'supuun',
    category: 'items',
    image: '/images/spoon.jpg',
    emoji: '🥄',
    example: {
      english: 'I eat soup with a spoon.',
      japanese: 'スプーンで スープを たべます。',
    },
  },
  {
    id: '80',
    english: 'fork',
    japanese: 'フォーク',
    romaji: 'fooku',
    category: 'items',
    image: '/images/fork.jpg',
    emoji: '🍴',
    example: {
      english: 'I eat pasta with a fork.',
      japanese: 'フォークで パスタを たべます。',
    },
  },
  // Activities - 活動
  {
    id: '81',
    english: 'run',
    japanese: 'はしる',
    romaji: 'hashiru',
    category: 'activities',
    image: '/images/run.jpg',
    emoji: '🏃',
    example: {
      english: 'I like to run fast.',
      japanese: 'はやく はしるのが すきです。',
    },
  },
  {
    id: '82',
    english: 'walk',
    japanese: 'あるく',
    romaji: 'aruku',
    category: 'activities',
    image: '/images/walk.jpg',
    emoji: '🚶',
    example: {
      english: 'I walk to school.',
      japanese: 'がっこうまで あるきます。',
    },
  },
  {
    id: '83',
    english: 'jump',
    japanese: 'とぶ',
    romaji: 'tobu',
    category: 'activities',
    image: '/images/jump.jpg',
    emoji: '🤸',
    example: {
      english: 'I can jump high.',
      japanese: 'たかく とべます。',
    },
  },
  {
    id: '84',
    english: 'swim',
    japanese: 'およぐ',
    romaji: 'oyogu',
    category: 'activities',
    image: '/images/swim.jpg',
    emoji: '🏊',
    example: {
      english: 'I swim in the pool.',
      japanese: 'プールで およぎます。',
    },
  },
  {
    id: '85',
    english: 'dance',
    japanese: 'おどる',
    romaji: 'odoru',
    category: 'activities',
    image: '/images/dance.jpg',
    emoji: '💃',
    example: {
      english: 'I love to dance.',
      japanese: 'おどるのが だいすきです。',
    },
  },
  {
    id: '86',
    english: 'sing',
    japanese: 'うたう',
    romaji: 'utau',
    category: 'activities',
    image: '/images/sing.jpg',
    emoji: '🎤',
    example: {
      english: 'I sing songs.',
      japanese: 'うたを うたいます。',
    },
  },
  {
    id: '87',
    english: 'read',
    japanese: 'よむ',
    romaji: 'yomu',
    category: 'activities',
    image: '/images/read.jpg',
    emoji: '📖',
    example: {
      english: 'I read books.',
      japanese: 'ほんを よみます。',
    },
  },
  {
    id: '88',
    english: 'write',
    japanese: 'かく',
    romaji: 'kaku',
    category: 'activities',
    image: '/images/write.jpg',
    emoji: '✍️',
    example: {
      english: 'I write letters.',
      japanese: 'てがみを かきます。',
    },
  },
  {
    id: '89',
    english: 'draw',
    japanese: 'えをかく',
    romaji: 'e wo kaku',
    category: 'activities',
    image: '/images/draw.jpg',
    emoji: '🎨',
    example: {
      english: 'I draw pictures.',
      japanese: 'えを かきます。',
    },
  },
  {
    id: '90',
    english: 'play',
    japanese: 'あそぶ',
    romaji: 'asobu',
    category: 'activities',
    image: '/images/play.jpg',
    emoji: '🎮',
    example: {
      english: 'I play with friends.',
      japanese: 'ともだちと あそびます。',
    },
  },
  // Numbers - 数字
  {
    id: '91',
    english: 'one',
    japanese: 'いち',
    romaji: 'ichi',
    category: 'numbers',
    image: '/images/one.jpg',
    emoji: '1️⃣',
    example: {
      english: 'I have one apple.',
      japanese: 'りんごが いっこ あります。',
    },
  },
  {
    id: '92',
    english: 'two',
    japanese: 'に',
    romaji: 'ni',
    category: 'numbers',
    image: '/images/two.jpg',
    emoji: '2️⃣',
    example: {
      english: 'I see two birds.',
      japanese: 'とりが にわ みえます。',
    },
  },
  {
    id: '93',
    english: 'three',
    japanese: 'さん',
    romaji: 'san',
    category: 'numbers',
    image: '/images/three.jpg',
    emoji: '3️⃣',
    example: {
      english: 'I have three books.',
      japanese: 'ほんが さんさつ あります。',
    },
  },
  {
    id: '94',
    english: 'four',
    japanese: 'よん',
    romaji: 'yon',
    category: 'numbers',
    image: '/images/four.jpg',
    emoji: '4️⃣',
    example: {
      english: 'There are four seasons.',
      japanese: 'きせつは よっつ あります。',
    },
  },
  {
    id: '95',
    english: 'five',
    japanese: 'ご',
    romaji: 'go',
    category: 'numbers',
    image: '/images/five.jpg',
    emoji: '5️⃣',
    example: {
      english: 'I have five fingers.',
      japanese: 'ゆびが ごほん あります。',
    },
  },
  {
    id: '96',
    english: 'six',
    japanese: 'ろく',
    romaji: 'roku',
    category: 'numbers',
    image: '/images/six.jpg',
    emoji: '6️⃣',
    example: {
      english: 'I wake up at six.',
      japanese: 'ろくじに おきます。',
    },
  },
  {
    id: '97',
    english: 'seven',
    japanese: 'なな',
    romaji: 'nana',
    category: 'numbers',
    image: '/images/seven.jpg',
    emoji: '7️⃣',
    example: {
      english: 'There are seven days.',
      japanese: 'いっしゅうかんは なのか あります。',
    },
  },
  {
    id: '98',
    english: 'eight',
    japanese: 'はち',
    romaji: 'hachi',
    category: 'numbers',
    image: '/images/eight.jpg',
    emoji: '8️⃣',
    example: {
      english: 'I am eight years old.',
      japanese: 'わたしは はっさいです。',
    },
  },
  {
    id: '99',
    english: 'nine',
    japanese: 'きゅう',
    romaji: 'kyuu',
    category: 'numbers',
    image: '/images/nine.jpg',
    emoji: '9️⃣',
    example: {
      english: 'School starts at nine.',
      japanese: 'がっこうは くじに はじまります。',
    },
  },
  {
    id: '100',
    english: 'ten',
    japanese: 'じゅう',
    romaji: 'juu',
    category: 'numbers',
    image: '/images/ten.jpg',
    emoji: '🔟',
    example: {
      english: 'I count to ten.',
      japanese: 'じゅうまで かぞえます。',
    },
  },
];

const categories = [
  { id: 'all', name: { en: 'All Words', ja: 'すべての ことば' }, emoji: '📝' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎' },
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱' },
  { id: 'colors', name: { en: 'Colors', ja: 'いろ' }, emoji: '🌈' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫' },
  { id: 'body', name: { en: 'Body Parts', ja: 'からだの ぶぶん' }, emoji: '👤' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳' },
  { id: 'items', name: { en: 'Daily Items', ja: 'にちようひん' }, emoji: '🏠' },
  { id: 'activities', name: { en: 'Activities', ja: 'かつどう' }, emoji: '🏃' },
  { id: 'numbers', name: { en: 'Numbers', ja: 'すうじ' }, emoji: '🔢' },
];

export function FlashCardPage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound } = useAudio();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const filteredWords =
    selectedCategory === 'all'
      ? vocabularyWords
      : vocabularyWords.filter((word) => word.category === selectedCategory);

  // Shuffle array based on current hour
  const shuffleArrayWithSeed = (array: typeof vocabularyWords, seed: number): typeof vocabularyWords => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    
    // Use seed to generate pseudo-random numbers
    const random = (index: number): number => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    while (currentIndex > 0) {
      const randomIndex = Math.floor(random(currentIndex) * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    return shuffled;
  };

  // Get shuffled words based on current hour
  const getShuffledWords = (): typeof vocabularyWords => {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60)); // Current hour since epoch
    return shuffleArrayWithSeed(filteredWords, currentHour);
  };

  const shuffledWords = getShuffledWords();
  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const handleCategorySelect = async (categoryId: string): Promise<void> => {
    await playSound('click');
    setSelectedCategory(categoryId);
    setGameStarted(false);
  };

  const handleStartGame = async (): Promise<void> => {
    await playSound('click');
    setGameStarted(true);
  };

  const handleNext = (): void => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleBackToMenu = async (): Promise<void> => {
    await playSound('click');
    setGameStarted(false);
    setCurrentIndex(0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              ←
            </button>
            <h1 className="text-3xl font-display font-bold text-gray-800">
              {language === 'ja' ? 'たんごカード' : 'Flash Cards'} 📚
            </h1>
            <div className="w-10" />
          </div>

          {/* カテゴリー選択 */}
          <motion.div initial={false} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'ja' ? 'カテゴリーを えらんでね' : 'Choose a Category'}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  initial={false}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    p-6 rounded-2xl transition-all hover:scale-105
                    ${
                      selectedCategory === category.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-800 hover:bg-purple-50 shadow-md'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="font-medium">
                    {language === 'ja' ? category.name.ja : category.name.en}
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {category.id === 'all'
                      ? vocabularyWords.length
                      : vocabularyWords.filter((w) => w.category === category.id).length}{' '}
                    {language === 'ja' ? 'ことば' : 'words'}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={false}
              onClick={handleStartGame}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'ja' ? 'はじめる！' : 'Start Learning!'} ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackToMenu}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to menu"
          >
            ←
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            {categories.find((c) => c.id === selectedCategory)?.emoji}{' '}
            {language === 'ja'
              ? categories.find((c) => c.id === selectedCategory)?.name.ja
              : categories.find((c) => c.id === selectedCategory)?.name.en}
          </h1>
          <div className="w-10" />
        </div>

        {/* フラッシュカード */}
        <motion.div initial={false} className="flex justify-center">
          <FlashCard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentIndex === 0}
            isLast={currentIndex === shuffledWords.length - 1}
            currentIndex={currentIndex}
            totalCount={shuffledWords.length}
          />
        </motion.div>

        {/* 完了メッセージ */}
        {currentIndex === shuffledWords.length - 1 && (
          <motion.div initial={false} className="text-center mt-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold text-gray-800">
              {language === 'ja' ? 'おつかれさま！' : 'Great job!'}
            </p>
            <p className="text-gray-600">
              {language === 'ja'
                ? 'すべての たんごを おぼえましたね！'
                : "You've reviewed all the words!"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
