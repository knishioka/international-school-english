import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface SpellingWord {
  id: string;
  word: string;
  japanese: string;
  category: string;
  hint: string;
  image: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const spellingWords: SpellingWord[] = [
  // Easy words - 3-4 letters
  {
    id: '1',
    word: 'cat',
    japanese: 'ねこ',
    category: 'animals',
    hint: 'A furry pet that says "meow"',
    image: '/images/cat.jpg',
    emoji: '🐱',
    difficulty: 'easy',
  },
  {
    id: '2',
    word: 'dog',
    japanese: 'いぬ',
    category: 'animals',
    hint: 'A loyal pet that barks',
    image: '/images/dog.jpg',
    emoji: '🐶',
    difficulty: 'easy',
  },
  {
    id: '3',
    word: 'sun',
    japanese: 'たいよう',
    category: 'nature',
    hint: 'Bright yellow thing in the sky',
    image: '/images/sun.jpg',
    emoji: '☀️',
    difficulty: 'easy',
  },
  {
    id: '4',
    word: 'red',
    japanese: 'あか',
    category: 'colors',
    hint: 'The color of strawberries',
    image: '/images/red.jpg',
    emoji: '🔴',
    difficulty: 'easy',
  },
  {
    id: '5',
    word: 'book',
    japanese: 'ほん',
    category: 'school',
    hint: 'You read this to learn',
    image: '/images/book.jpg',
    emoji: '📚',
    difficulty: 'easy',
  },

  // Medium words - 5-6 letters
  {
    id: '6',
    word: 'apple',
    japanese: 'りんご',
    category: 'food',
    hint: 'A red or green fruit',
    image: '/images/apple.jpg',
    emoji: '🍎',
    difficulty: 'medium',
  },
  {
    id: '7',
    word: 'water',
    japanese: 'みず',
    category: 'nature',
    hint: 'Clear liquid we drink',
    image: '/images/water.jpg',
    emoji: '💧',
    difficulty: 'medium',
  },
  {
    id: '8',
    word: 'house',
    japanese: 'いえ',
    category: 'family',
    hint: 'Where families live',
    image: '/images/house.jpg',
    emoji: '🏠',
    difficulty: 'medium',
  },
  {
    id: '9',
    word: 'happy',
    japanese: 'うれしい',
    category: 'feelings',
    hint: 'How you feel when something good happens',
    image: '/images/happy.jpg',
    emoji: '😊',
    difficulty: 'medium',
  },
  {
    id: '10',
    word: 'flower',
    japanese: 'はな',
    category: 'nature',
    hint: 'Beautiful thing that grows in gardens',
    image: '/images/flower.jpg',
    emoji: '🌸',
    difficulty: 'medium',
  },

  // Hard words - 7+ letters
  {
    id: '11',
    word: 'elephant',
    japanese: 'ぞう',
    category: 'animals',
    hint: 'Large gray animal with a trunk',
    image: '/images/elephant.jpg',
    emoji: '🐘',
    difficulty: 'hard',
  },
  {
    id: '12',
    word: 'rainbow',
    japanese: 'にじ',
    category: 'nature',
    hint: 'Colorful arc in the sky after rain',
    image: '/images/rainbow.jpg',
    emoji: '🌈',
    difficulty: 'hard',
  },
  {
    id: '13',
    word: 'sandwich',
    japanese: 'サンドイッチ',
    category: 'food',
    hint: 'Food with bread on top and bottom',
    image: '/images/sandwich.jpg',
    emoji: '🥪',
    difficulty: 'hard',
  },
  {
    id: '14',
    word: 'computer',
    japanese: 'コンピューター',
    category: 'school',
    hint: 'Electronic device for work and games',
    image: '/images/computer.jpg',
    emoji: '💻',
    difficulty: 'hard',
  },
  {
    id: '15',
    word: 'butterfly',
    japanese: 'ちょう',
    category: 'animals',
    hint: 'Colorful insect with wings',
    image: '/images/butterfly.jpg',
    emoji: '🦋',
    difficulty: 'hard',
  },

  // Additional Easy words (16-40)
  {
    id: '16',
    word: 'bed',
    japanese: 'ベッド',
    category: 'family',
    hint: 'Where you sleep at night',
    image: '/images/bed.jpg',
    emoji: '🛏️',
    difficulty: 'easy',
  },
  {
    id: '17',
    word: 'egg',
    japanese: 'たまご',
    category: 'food',
    hint: 'Chickens lay these',
    image: '/images/egg.jpg',
    emoji: '🥚',
    difficulty: 'easy',
  },
  {
    id: '18',
    word: 'toy',
    japanese: 'おもちゃ',
    category: 'school',
    hint: 'Children play with this',
    image: '/images/toy.jpg',
    emoji: '🧸',
    difficulty: 'easy',
  },
  {
    id: '19',
    word: 'box',
    japanese: 'はこ',
    category: 'school',
    hint: 'Container to store things',
    image: '/images/box.jpg',
    emoji: '📦',
    difficulty: 'easy',
  },
  {
    id: '20',
    word: 'cow',
    japanese: 'うし',
    category: 'animals',
    hint: 'Farm animal that gives milk',
    image: '/images/cow.jpg',
    emoji: '🐄',
    difficulty: 'easy',
  },
  {
    id: '21',
    word: 'pig',
    japanese: 'ぶた',
    category: 'animals',
    hint: 'Pink farm animal',
    image: '/images/pig.jpg',
    emoji: '🐷',
    difficulty: 'easy',
  },
  {
    id: '22',
    word: 'tea',
    japanese: 'おちゃ',
    category: 'food',
    hint: 'Hot drink in a cup',
    image: '/images/tea.jpg',
    emoji: '🍵',
    difficulty: 'easy',
  },
  {
    id: '23',
    word: 'hat',
    japanese: 'ぼうし',
    category: 'family',
    hint: 'You wear this on your head',
    image: '/images/hat.jpg',
    emoji: '🎩',
    difficulty: 'easy',
  },
  {
    id: '24',
    word: 'map',
    japanese: 'ちず',
    category: 'school',
    hint: 'Shows where places are',
    image: '/images/map.jpg',
    emoji: '🗺️',
    difficulty: 'easy',
  },
  {
    id: '25',
    word: 'pen',
    japanese: 'ペン',
    category: 'school',
    hint: 'Writing tool with ink',
    image: '/images/pen.jpg',
    emoji: '🖊️',
    difficulty: 'easy',
  },
  {
    id: '26',
    word: 'cup',
    japanese: 'カップ',
    category: 'food',
    hint: 'You drink from this',
    image: '/images/cup.jpg',
    emoji: '☕',
    difficulty: 'easy',
  },
  {
    id: '27',
    word: 'zoo',
    japanese: 'どうぶつえん',
    category: 'animals',
    hint: 'Place to see many animals',
    image: '/images/zoo.jpg',
    emoji: '🦁',
    difficulty: 'easy',
  },
  {
    id: '28',
    word: 'ice',
    japanese: 'こおり',
    category: 'nature',
    hint: 'Frozen water',
    image: '/images/ice.jpg',
    emoji: '🧊',
    difficulty: 'easy',
  },
  {
    id: '29',
    word: 'key',
    japanese: 'かぎ',
    category: 'family',
    hint: 'Opens doors',
    image: '/images/key.jpg',
    emoji: '🔑',
    difficulty: 'easy',
  },
  {
    id: '30',
    word: 'sky',
    japanese: 'そら',
    category: 'nature',
    hint: 'Blue space above us',
    image: '/images/sky.jpg',
    emoji: '🌌',
    difficulty: 'easy',
  },
  {
    id: '31',
    word: 'ant',
    japanese: 'あり',
    category: 'animals',
    hint: 'Tiny working insect',
    image: '/images/ant.jpg',
    emoji: '🐜',
    difficulty: 'easy',
  },
  {
    id: '32',
    word: 'bee',
    japanese: 'はち',
    category: 'animals',
    hint: 'Makes honey',
    image: '/images/bee.jpg',
    emoji: '🐝',
    difficulty: 'easy',
  },
  {
    id: '33',
    word: 'owl',
    japanese: 'ふくろう',
    category: 'animals',
    hint: 'Night bird that hoots',
    image: '/images/owl.jpg',
    emoji: '🦉',
    difficulty: 'easy',
  },
  {
    id: '34',
    word: 'bag',
    japanese: 'かばん',
    category: 'school',
    hint: 'Carries your things',
    image: '/images/bag.jpg',
    emoji: '👜',
    difficulty: 'easy',
  },
  {
    id: '35',
    word: 'car',
    japanese: 'くるま',
    category: 'family',
    hint: 'Vehicle on four wheels',
    image: '/images/car.jpg',
    emoji: '🚗',
    difficulty: 'easy',
  },
  {
    id: '36',
    word: 'bus',
    japanese: 'バス',
    category: 'school',
    hint: 'Big vehicle for many people',
    image: '/images/bus.jpg',
    emoji: '🚌',
    difficulty: 'easy',
  },
  {
    id: '37',
    word: 'bat',
    japanese: 'こうもり',
    category: 'animals',
    hint: 'Flying animal that sleeps upside down',
    image: '/images/bat.jpg',
    emoji: '🦇',
    difficulty: 'easy',
  },
  {
    id: '38',
    word: 'fox',
    japanese: 'きつね',
    category: 'animals',
    hint: 'Orange forest animal',
    image: '/images/fox.jpg',
    emoji: '🦊',
    difficulty: 'easy',
  },
  {
    id: '39',
    word: 'mud',
    japanese: 'どろ',
    category: 'nature',
    hint: 'Wet dirt',
    image: '/images/mud.jpg',
    emoji: '🟫',
    difficulty: 'easy',
  },
  {
    id: '40',
    word: 'nut',
    japanese: 'ナッツ',
    category: 'food',
    hint: 'Squirrels love to eat these',
    image: '/images/nut.jpg',
    emoji: '🥜',
    difficulty: 'easy',
  },

  // Additional Medium words (41-70)
  {
    id: '41',
    word: 'beach',
    japanese: 'ビーチ',
    category: 'nature',
    hint: 'Sandy place by the ocean',
    image: '/images/beach.jpg',
    emoji: '🏖️',
    difficulty: 'medium',
  },
  {
    id: '42',
    word: 'bread',
    japanese: 'パン',
    category: 'food',
    hint: 'Made from flour, used for sandwiches',
    image: '/images/bread.jpg',
    emoji: '🍞',
    difficulty: 'medium',
  },
  {
    id: '43',
    word: 'chair',
    japanese: 'いす',
    category: 'school',
    hint: 'You sit on this',
    image: '/images/chair.jpg',
    emoji: '🪑',
    difficulty: 'medium',
  },
  {
    id: '44',
    word: 'clock',
    japanese: 'とけい',
    category: 'school',
    hint: 'Tells you the time',
    image: '/images/clock.jpg',
    emoji: '🕐',
    difficulty: 'medium',
  },
  {
    id: '45',
    word: 'cloud',
    japanese: 'くも',
    category: 'nature',
    hint: 'White fluffy thing in the sky',
    image: '/images/cloud.jpg',
    emoji: '☁️',
    difficulty: 'medium',
  },
  {
    id: '46',
    word: 'dance',
    japanese: 'ダンス',
    category: 'school',
    hint: 'Moving to music',
    image: '/images/dance.jpg',
    emoji: '💃',
    difficulty: 'medium',
  },
  {
    id: '47',
    word: 'dream',
    japanese: 'ゆめ',
    category: 'family',
    hint: 'What happens when you sleep',
    image: '/images/dream.jpg',
    emoji: '💭',
    difficulty: 'medium',
  },
  {
    id: '48',
    word: 'earth',
    japanese: 'ちきゅう',
    category: 'nature',
    hint: 'Our planet',
    image: '/images/earth.jpg',
    emoji: '🌍',
    difficulty: 'medium',
  },
  {
    id: '49',
    word: 'fruit',
    japanese: 'くだもの',
    category: 'food',
    hint: 'Sweet healthy food from trees',
    image: '/images/fruit.jpg',
    emoji: '🍇',
    difficulty: 'medium',
  },
  {
    id: '50',
    word: 'grass',
    japanese: 'くさ',
    category: 'nature',
    hint: 'Green plant on the ground',
    image: '/images/grass.jpg',
    emoji: '🌱',
    difficulty: 'medium',
  },
  {
    id: '51',
    word: 'heart',
    japanese: 'ハート',
    category: 'family',
    hint: 'Shape that means love',
    image: '/images/heart.jpg',
    emoji: '❤️',
    difficulty: 'medium',
  },
  {
    id: '52',
    word: 'honey',
    japanese: 'はちみつ',
    category: 'food',
    hint: 'Sweet golden liquid from bees',
    image: '/images/honey.jpg',
    emoji: '🍯',
    difficulty: 'medium',
  },
  {
    id: '53',
    word: 'juice',
    japanese: 'ジュース',
    category: 'food',
    hint: 'Drink made from fruits',
    image: '/images/juice.jpg',
    emoji: '🧃',
    difficulty: 'medium',
  },
  {
    id: '54',
    word: 'light',
    japanese: 'ひかり',
    category: 'nature',
    hint: 'Opposite of dark',
    image: '/images/light.jpg',
    emoji: '💡',
    difficulty: 'medium',
  },
  {
    id: '55',
    word: 'mouse',
    japanese: 'ねずみ',
    category: 'animals',
    hint: 'Small animal that likes cheese',
    image: '/images/mouse.jpg',
    emoji: '🐭',
    difficulty: 'medium',
  },
  {
    id: '56',
    word: 'music',
    japanese: 'おんがく',
    category: 'school',
    hint: 'Sounds that make melodies',
    image: '/images/music.jpg',
    emoji: '🎵',
    difficulty: 'medium',
  },
  {
    id: '57',
    word: 'night',
    japanese: 'よる',
    category: 'nature',
    hint: 'When the moon is out',
    image: '/images/night.jpg',
    emoji: '🌙',
    difficulty: 'medium',
  },
  {
    id: '58',
    word: 'ocean',
    japanese: 'うみ',
    category: 'nature',
    hint: 'Big body of salt water',
    image: '/images/ocean.jpg',
    emoji: '🌊',
    difficulty: 'medium',
  },
  {
    id: '59',
    word: 'paper',
    japanese: 'かみ',
    category: 'school',
    hint: 'You write on this',
    image: '/images/paper.jpg',
    emoji: '📄',
    difficulty: 'medium',
  },
  {
    id: '60',
    word: 'party',
    japanese: 'パーティー',
    category: 'family',
    hint: 'Fun celebration with friends',
    image: '/images/party.jpg',
    emoji: '🎉',
    difficulty: 'medium',
  },
  {
    id: '61',
    word: 'pizza',
    japanese: 'ピザ',
    category: 'food',
    hint: 'Round food with cheese and toppings',
    image: '/images/pizza.jpg',
    emoji: '🍕',
    difficulty: 'medium',
  },
  {
    id: '62',
    word: 'plant',
    japanese: 'しょくぶつ',
    category: 'nature',
    hint: 'Living green thing that grows',
    image: '/images/plant.jpg',
    emoji: '🌿',
    difficulty: 'medium',
  },
  {
    id: '63',
    word: 'river',
    japanese: 'かわ',
    category: 'nature',
    hint: 'Long flowing water',
    image: '/images/river.jpg',
    emoji: '🏞️',
    difficulty: 'medium',
  },
  {
    id: '64',
    word: 'robot',
    japanese: 'ロボット',
    category: 'school',
    hint: 'Machine that can move and work',
    image: '/images/robot.jpg',
    emoji: '🤖',
    difficulty: 'medium',
  },
  {
    id: '65',
    word: 'snake',
    japanese: 'へび',
    category: 'animals',
    hint: 'Long animal with no legs',
    image: '/images/snake.jpg',
    emoji: '🐍',
    difficulty: 'medium',
  },
  {
    id: '66',
    word: 'space',
    japanese: 'うちゅう',
    category: 'nature',
    hint: 'Where stars and planets are',
    image: '/images/space.jpg',
    emoji: '🚀',
    difficulty: 'medium',
  },
  {
    id: '67',
    word: 'sport',
    japanese: 'スポーツ',
    category: 'school',
    hint: 'Physical games and activities',
    image: '/images/sport.jpg',
    emoji: '⚽',
    difficulty: 'medium',
  },
  {
    id: '68',
    word: 'stone',
    japanese: 'いし',
    category: 'nature',
    hint: 'Hard rock you find on ground',
    image: '/images/stone.jpg',
    emoji: '🪨',
    difficulty: 'medium',
  },
  {
    id: '69',
    word: 'table',
    japanese: 'テーブル',
    category: 'family',
    hint: 'You eat meals on this',
    image: '/images/table.jpg',
    emoji: '🪑',
    difficulty: 'medium',
  },
  {
    id: '70',
    word: 'tooth',
    japanese: 'は',
    category: 'family',
    hint: 'White thing in your mouth for chewing',
    image: '/images/tooth.jpg',
    emoji: '🦷',
    difficulty: 'medium',
  },

  // Additional Hard words (71-100)
  {
    id: '71',
    word: 'airplane',
    japanese: 'ひこうき',
    category: 'family',
    hint: 'Flies people through the sky',
    image: '/images/airplane.jpg',
    emoji: '✈️',
    difficulty: 'hard',
  },
  {
    id: '72',
    word: 'birthday',
    japanese: 'たんじょうび',
    category: 'family',
    hint: 'Special day you were born',
    image: '/images/birthday.jpg',
    emoji: '🎂',
    difficulty: 'hard',
  },
  {
    id: '73',
    word: 'breakfast',
    japanese: 'あさごはん',
    category: 'food',
    hint: 'First meal of the day',
    image: '/images/breakfast.jpg',
    emoji: '🥞',
    difficulty: 'hard',
  },
  {
    id: '74',
    word: 'calendar',
    japanese: 'カレンダー',
    category: 'school',
    hint: 'Shows days and months',
    image: '/images/calendar.jpg',
    emoji: '📅',
    difficulty: 'hard',
  },
  {
    id: '75',
    word: 'chocolate',
    japanese: 'チョコレート',
    category: 'food',
    hint: 'Sweet brown candy',
    image: '/images/chocolate.jpg',
    emoji: '🍫',
    difficulty: 'hard',
  },
  {
    id: '76',
    word: 'dinosaur',
    japanese: 'きょうりゅう',
    category: 'animals',
    hint: 'Big animal from long ago',
    image: '/images/dinosaur.jpg',
    emoji: '🦕',
    difficulty: 'hard',
  },
  {
    id: '77',
    word: 'elephant',
    japanese: 'ぞう',
    category: 'animals',
    hint: 'Big gray animal with trunk',
    image: '/images/elephant.jpg',
    emoji: '🐘',
    difficulty: 'hard',
  },
  {
    id: '78',
    word: 'exercise',
    japanese: 'うんどう',
    category: 'school',
    hint: 'Physical activity to stay healthy',
    image: '/images/exercise.jpg',
    emoji: '🏃',
    difficulty: 'hard',
  },
  {
    id: '79',
    word: 'favorite',
    japanese: 'おきにいり',
    category: 'family',
    hint: 'The one you like best',
    image: '/images/favorite.jpg',
    emoji: '⭐',
    difficulty: 'hard',
  },
  {
    id: '80',
    word: 'festival',
    japanese: 'まつり',
    category: 'family',
    hint: 'Big celebration event',
    image: '/images/festival.jpg',
    emoji: '🎊',
    difficulty: 'hard',
  },
  {
    id: '81',
    word: 'football',
    japanese: 'フットボール',
    category: 'school',
    hint: 'Sport with kicking a ball',
    image: '/images/football.jpg',
    emoji: '⚽',
    difficulty: 'hard',
  },
  {
    id: '82',
    word: 'hospital',
    japanese: 'びょういん',
    category: 'family',
    hint: 'Where doctors help sick people',
    image: '/images/hospital.jpg',
    emoji: '🏥',
    difficulty: 'hard',
  },
  {
    id: '83',
    word: 'Internet',
    japanese: 'インターネット',
    category: 'school',
    hint: 'Global computer network',
    image: '/images/internet.jpg',
    emoji: '🌐',
    difficulty: 'hard',
  },
  {
    id: '84',
    word: 'kangaroo',
    japanese: 'カンガルー',
    category: 'animals',
    hint: 'Australian animal that hops',
    image: '/images/kangaroo.jpg',
    emoji: '🦘',
    difficulty: 'hard',
  },
  {
    id: '85',
    word: 'keyboard',
    japanese: 'キーボード',
    category: 'school',
    hint: 'You type on this',
    image: '/images/keyboard.jpg',
    emoji: '⌨️',
    difficulty: 'hard',
  },
  {
    id: '86',
    word: 'lunchbox',
    japanese: 'おべんとうばこ',
    category: 'school',
    hint: 'Container for your midday meal',
    image: '/images/lunchbox.jpg',
    emoji: '🍱',
    difficulty: 'hard',
  },
  {
    id: '87',
    word: 'medicine',
    japanese: 'くすり',
    category: 'family',
    hint: 'Helps you feel better when sick',
    image: '/images/medicine.jpg',
    emoji: '💊',
    difficulty: 'hard',
  },
  {
    id: '88',
    word: 'mountain',
    japanese: 'やま',
    category: 'nature',
    hint: 'Very tall land formation',
    image: '/images/mountain.jpg',
    emoji: '🏔️',
    difficulty: 'hard',
  },
  {
    id: '89',
    word: 'mushroom',
    japanese: 'きのこ',
    category: 'food',
    hint: 'Fungus that grows in forests',
    image: '/images/mushroom.jpg',
    emoji: '🍄',
    difficulty: 'hard',
  },
  {
    id: '90',
    word: 'notebook',
    japanese: 'ノート',
    category: 'school',
    hint: 'Book for writing notes',
    image: '/images/notebook.jpg',
    emoji: '📓',
    difficulty: 'hard',
  },
  {
    id: '91',
    word: 'painting',
    japanese: 'えがく',
    category: 'school',
    hint: 'Art made with brushes and colors',
    image: '/images/painting.jpg',
    emoji: '🎨',
    difficulty: 'hard',
  },
  {
    id: '92',
    word: 'penguin',
    japanese: 'ペンギン',
    category: 'animals',
    hint: 'Black and white bird that swims',
    image: '/images/penguin.jpg',
    emoji: '🐧',
    difficulty: 'hard',
  },
  {
    id: '93',
    word: 'sandwich',
    japanese: 'サンドイッチ',
    category: 'food',
    hint: 'Food between two pieces of bread',
    image: '/images/sandwich.jpg',
    emoji: '🥪',
    difficulty: 'hard',
  },
  {
    id: '94',
    word: 'scissors',
    japanese: 'はさみ',
    category: 'school',
    hint: 'Tool for cutting paper',
    image: '/images/scissors.jpg',
    emoji: '✂️',
    difficulty: 'hard',
  },
  {
    id: '95',
    word: 'shopping',
    japanese: 'かいもの',
    category: 'family',
    hint: 'Buying things at stores',
    image: '/images/shopping.jpg',
    emoji: '🛒',
    difficulty: 'hard',
  },
  {
    id: '96',
    word: 'squirrel',
    japanese: 'りす',
    category: 'animals',
    hint: 'Small animal that collects nuts',
    image: '/images/squirrel.jpg',
    emoji: '🐿️',
    difficulty: 'hard',
  },
  {
    id: '97',
    word: 'sunshine',
    japanese: 'ひざし',
    category: 'nature',
    hint: 'Light from the sun',
    image: '/images/sunshine.jpg',
    emoji: '☀️',
    difficulty: 'hard',
  },
  {
    id: '98',
    word: 'swimming',
    japanese: 'すいえい',
    category: 'school',
    hint: 'Moving through water',
    image: '/images/swimming.jpg',
    emoji: '🏊',
    difficulty: 'hard',
  },
  {
    id: '99',
    word: 'treasure',
    japanese: 'たからもの',
    category: 'family',
    hint: 'Valuable hidden things',
    image: '/images/treasure.jpg',
    emoji: '💎',
    difficulty: 'hard',
  },
  {
    id: '100',
    word: 'umbrella',
    japanese: 'かさ',
    category: 'family',
    hint: 'Keeps you dry in the rain',
    image: '/images/umbrella.jpg',
    emoji: '☂️',
    difficulty: 'hard',
  },
];

const difficulties = [
  { id: 'easy', name: { en: 'Easy (3-4 letters)', ja: 'かんたん (3-4もじ)' }, emoji: '😊' },
  { id: 'medium', name: { en: 'Medium (5-6 letters)', ja: 'ふつう (5-6もじ)' }, emoji: '🤔' },
  { id: 'hard', name: { en: 'Hard (7+ letters)', ja: 'むずかしい (7もじ以上)' }, emoji: '🤯' },
];

export function SpellingGamePage(): JSX.Element {
  const { language } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState<SpellingWord | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredWords = spellingWords.filter((word) => word.difficulty === selectedDifficulty);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted, currentWord]);

  const startGame = (): void => {
    const words = filteredWords;
    if (words.length > 0) {
      setCurrentWord(words[0]);
      setCurrentIndex(0);
      setGameStarted(true);
      setUserInput('');
      setShowHint(false);
      setIsCorrect(null);
      setScore(0);
    }
  };

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    navigate('/home');
  };

  const handleDifficultySelect = async (difficulty: 'easy' | 'medium' | 'hard'): Promise<void> => {
    await playSound('click');
    setSelectedDifficulty(difficulty);
    setGameStarted(false);
  };

  const handleInputChange = (value: string): void => {
    setUserInput(value.toLowerCase());
  };

  const handleSubmit = async (): Promise<void> => {
    if (!currentWord || userInput.trim() === '') {
      return;
    }

    const correct = userInput.trim() === currentWord.word;
    setIsCorrect(correct);

    if (correct) {
      await playSound('success');
      // Add delay for iOS compatibility
      setTimeout(() => {
        speak(currentWord.word, 'en');
      }, 100);

      // Calculate score based on difficulty and hint usage
      let points = 10;
      if (selectedDifficulty === 'medium') {
        points = 15;
      }
      if (selectedDifficulty === 'hard') {
        points = 20;
      }
      if (!showHint) {
        points += 5;
      } // Bonus for not using hint

      setScore(score + points);
    } else {
      await playSound('error');
    }
  };

  const handleNext = async (): Promise<void> => {
    await playSound('click');

    const nextIndex = currentIndex + 1;
    if (nextIndex < filteredWords.length) {
      setCurrentWord(filteredWords[nextIndex]);
      setCurrentIndex(nextIndex);
      setUserInput('');
      setShowHint(false);
      setIsCorrect(null);
    } else {
      // Game completed
      setGameStarted(false);
    }
  };

  const handlePlayAudio = async (): Promise<void> => {
    if (!currentWord) {
      return;
    }
    await playSound('click');
    // Add a small delay for better iOS compatibility
    setTimeout(() => {
      speak(currentWord.word, 'en');
    }, 100);
  };

  const toggleHint = async (): Promise<void> => {
    await playSound('click');
    setShowHint(!showHint);
  };

  const handleTryAgain = async (): Promise<void> => {
    await playSound('click');
    setUserInput('');
    setIsCorrect(null);
  };

  const handleAlphabetClick = async (letter: string): Promise<void> => {
    await playSound('click');
    if (isCorrect === null) {
      setUserInput(userInput + letter.toLowerCase());
    }
  };

  const handleBackspace = async (): Promise<void> => {
    await playSound('click');
    if (isCorrect === null && userInput.length > 0) {
      setUserInput(userInput.slice(0, -1));
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
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
              {language === 'ja' ? 'スペルチェック' : 'Spelling Game'} ✏️
            </h1>
            <div className="w-10" />
          </div>

          {/* 難易度選択 */}
          <motion.div initial={false} className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'ja' ? 'レベルを えらんでね' : 'Choose Your Level'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty.id}
                  initial={false}
                  onClick={() =>
                    handleDifficultySelect(difficulty.id as 'easy' | 'medium' | 'hard')
                  }
                  className={`
                    p-6 rounded-2xl transition-all hover:scale-105
                    ${
                      selectedDifficulty === difficulty.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-800 hover:bg-blue-50 shadow-md'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{difficulty.emoji}</div>
                  <div className="font-medium">
                    {language === 'ja' ? difficulty.name.ja : difficulty.name.en}
                  </div>
                  <div className="text-sm mt-1 opacity-75">
                    {spellingWords.filter((w) => w.difficulty === difficulty.id).length}{' '}
                    {language === 'ja' ? 'ことば' : 'words'}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={false}
              transition={{ delay: 0.5 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-bold rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'ja' ? 'はじめる！' : 'Start Game!'} 🚀
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setGameStarted(false)}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back to menu"
          >
            ←
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-800">
            {language === 'ja' ? 'スペルチェック' : 'Spelling Game'}
          </h1>
          <div className="text-lg font-bold text-blue-600">Score: {score}</div>
        </div>

        {/* プログレス */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'ja' ? 'しんちょく' : 'Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {filteredWords.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <motion.div initial={false} className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* 単語情報 */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{currentWord.emoji}</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{currentWord.japanese}</div>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handlePlayAudio}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔊 {language === 'ja' ? 'きく' : 'Listen'}
              </button>
              <button
                onClick={toggleHint}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                💡 {language === 'ja' ? 'ヒント' : 'Hint'}
              </button>
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-gray-600 italic mb-4"
              >
                {currentWord.hint}
              </motion.div>
            )}
          </div>

          {/* 入力エリア */}
          <div className="max-w-md mx-auto">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              {language === 'ja' ? 'スペルを いれてね:' : 'Type the spelling:'}
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center font-mono"
              placeholder={language === 'ja' ? 'ここに かいてね...' : 'Type here...'}
              disabled={isCorrect !== null}
            />

            {/* ヒント表示: 文字数 */}
            <div className="text-center mt-2 text-gray-500">
              {currentWord.word.length} {language === 'ja' ? 'もじ' : 'letters'}
            </div>

            {/* アルファベットボタン */}
            <div className="mt-6">
              <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleAlphabetClick(letter)}
                    disabled={isCorrect !== null}
                    className={`
                      p-3 text-lg font-bold rounded-lg transition-all
                      ${
                        isCorrect !== null
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm'
                      }
                    `}
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  disabled={isCorrect !== null || userInput.length === 0}
                  className={`
                    col-span-2 p-3 text-lg font-bold rounded-lg transition-all
                    ${
                      isCorrect !== null || userInput.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm'
                    }
                  `}
                >
                  ⌫
                </button>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center mt-6">
            {isCorrect === null ? (
              <button
                onClick={handleSubmit}
                disabled={userInput.trim() === ''}
                className={`
                  px-8 py-3 rounded-full text-lg font-medium transition-all
                  ${
                    userInput.trim() === ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                  }
                `}
              >
                {language === 'ja' ? 'こたえをみる' : 'Check Answer'}
              </button>
            ) : (
              <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    px-6 py-3 rounded-full text-lg font-medium
                    ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}
                >
                  {isCorrect
                    ? language === 'ja'
                      ? 'せいかい！ 🎉'
                      : 'Correct! 🎉'
                    : language === 'ja'
                      ? 'ちがうよ 😅'
                      : 'Try again 😅'}
                </motion.div>

                {isCorrect ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    {currentIndex === filteredWords.length - 1
                      ? language === 'ja'
                        ? 'おわり'
                        : 'Finish'
                      : language === 'ja'
                        ? 'つぎへ'
                        : 'Next'}
                  </button>
                ) : (
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
                  >
                    {language === 'ja' ? 'もういちど' : 'Try Again'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 正解表示 */}
          {isCorrect === false && (
            <motion.div initial={false} className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-gray-700">
                {language === 'ja' ? 'せいかい:' : 'Correct spelling:'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{currentWord.word}</p>
            </motion.div>
          )}
        </motion.div>

        {/* 完了画面 */}
        <AnimatePresence>
          {currentIndex === filteredWords.length - 1 && isCorrect === true && (
            <motion.div initial={false} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'ja' ? 'おつかれさま！' : 'Great Job!'}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                {language === 'ja' ? `スコア: ${score} てん！` : `Final Score: ${score} points!`}
              </p>
              <button
                onClick={() => setGameStarted(false)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                {language === 'ja' ? 'もういちど' : 'Play Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
