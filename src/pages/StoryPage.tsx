import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, KanjiGrade } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';
import { KanjiGradeSelector } from '@/components/KanjiGradeSelector';

interface Story {
  id: string;
  title: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  description: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  lesson: { en: string; ja: string; jaKanji: { [key in KanjiGrade]: string } };
  category: 'moral' | 'friendship' | 'nature' | 'responsibility' | 'courage' | 'patience';
  minGrade: KanjiGrade;
  pages: {
    text: { en: string; ja: string };
    jaKanji: { [key in KanjiGrade]: string };
    emoji: string;
  }[];
}

const stories: Story[] = [
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
          3: '昔むかし、森に 白いうさぎが 住んでいました。',
          4: '昔々、森に 白いうさぎが 住んでいました。',
          5: '昔々、森に 白いうさぎが 住んでいました。',
          6: '昔々、森に 白いうさぎが 住んでいました。',
        },
        emoji: '🐰',
      },
      {
        text: {
          en: 'One day, the rabbit found many delicious carrots in the garden.',
          ja: 'あるひ、うさぎは はたけで おいしいにんじんを たくさん みつけました。',
        },
        jaKanji: {
          1: 'ある日、うさぎは はたけで おいしいにんじんを たくさん みつけました。',
          2: 'ある日、うさぎは 畑で おいしいにんじんを たくさん 見つけました。',
          3: 'ある日、うさぎは 畑で おいしい人参を たくさん 見つけました。',
          4: 'ある日、うさぎは 畑で おいしい人参を たくさん 見つけました。',
          5: 'ある日、うさぎは 畑で おいしい人参を たくさん 見つけました。',
          6: 'ある日、うさぎは 畑で おいしい人参を たくさん 見つけました。',
        },
        emoji: '🥕',
      },
      {
        text: {
          en: 'A hungry squirrel came by and asked, "May I have one carrot, please?"',
          ja: 'おなかのすいた りすが きて、「にんじんを ひとつ もらえませんか」と ききました。',
        },
        jaKanji: {
          1: 'おなかのすいた りすが 来て、「にんじんを 一つ もらえませんか」と ききました。',
          2: 'おなかのすいた りすが 来て、「にんじんを 一つ もらえませんか」と 聞きました。',
          3: 'おなかのすいた りすが 来て、「人参を 一つ もらえませんか」と 聞きました。',
          4: 'お腹のすいた りすが 来て、「人参を 一つ もらえませんか」と 聞きました。',
          5: 'お腹の空いた りすが 来て、「人参を 一つ もらえませんか」と 聞きました。',
          6: 'お腹の空いた 栗鼠が 来て、「人参を 一つ もらえませんか」と 聞きました。',
        },
        emoji: '🐿️',
      },
      {
        text: {
          en: 'The kind rabbit smiled and said, "Of course! Take as many as you need."',
          ja: 'やさしいうさぎは にっこりして、「もちろん！ひつようなだけ もっていってね」と いいました。',
        },
        jaKanji: {
          1: 'やさしいうさぎは にっこりして、「もちろん！ひつような だけ もっていってね」と 言いました。',
          2: 'やさしいうさぎは にっこりして、「もちろん！必要な だけ 持っていってね」と 言いました。',
          3: '優しいうさぎは にっこりして、「もちろん！必要な だけ 持っていってね」と 言いました。',
          4: '優しいうさぎは にっこりして、「もちろん！必要な だけ 持って行ってね」と 言いました。',
          5: '優しいうさぎは にっこりして、「もちろん！必要な だけ 持って行ってね」と 言いました。',
          6: '優しい兎は にっこりして、「もちろん！必要な だけ 持って行ってね」と 言いました。',
        },
        emoji: '😊',
      },
      {
        text: {
          en: 'Soon, more hungry animals came to the rabbit.',
          ja: 'すぐに、もっと おなかのすいた どうぶつたちが うさぎのところに きました。',
        },
        jaKanji: {
          1: 'すぐに、もっと おなかのすいた どうぶつたちが うさぎの ところに 来ました。',
          2: 'すぐに、もっと おなかのすいた 動物たちが うさぎの ところに 来ました。',
          3: 'すぐに、もっと おなかのすいた 動物たちが うさぎの 所に 来ました。',
          4: 'すぐに、もっと お腹のすいた 動物たちが うさぎの 所に 来ました。',
          5: 'すぐに、もっと お腹の空いた 動物たちが うさぎの 所に 来ました。',
          6: 'すぐに、もっと お腹の空いた 動物達が 兎の 所に 来ました。',
        },
        emoji: '🦝🦔🐦',
      },
      {
        text: {
          en: 'The rabbit shared all the carrots with everyone happily.',
          ja: 'うさぎは みんなに にんじんを ぜんぶ わけてあげました。',
        },
        jaKanji: {
          1: 'うさぎは みんなに にんじんを 全部 分けてあげました。',
          2: 'うさぎは みんなに 人じんを 全部 分けてあげました。',
          3: 'うさぎは みんなに 人参を 全部 分けてあげました。',
          4: 'うさぎは 皆に 人参を 全部 分けてあげました。',
          5: 'うさぎは 皆に 人参を 全部 分けてあげました。',
          6: '兎は 皆に 人参を 全部 分けてあげました。',
        },
        emoji: '🥕🥕🥕',
      },
      {
        text: {
          en: 'The next day, all the animals brought gifts to thank the rabbit.',
          ja: 'つぎのひ、どうぶつたちは うさぎに おれいの プレゼントを もってきました。',
        },
        jaKanji: {
          1: '次の日、どうぶつたちは うさぎに おれいの プレゼントを もってきました。',
          2: '次の日、動物たちは うさぎに おれいの プレゼントを 持ってきました。',
          3: '次の日、動物たちは うさぎに お礼の プレゼントを 持ってきました。',
          4: '次の日、動物たちは うさぎに お礼の プレゼントを 持って来ました。',
          5: '翌日、動物たちは うさぎに お礼の プレゼントを 持って来ました。',
          6: '翌日、動物達は 兎に お礼の プレゼントを 持って来ました。',
        },
        emoji: '🎁',
      },
      {
        text: {
          en: 'The rabbit learned that sharing brings happiness to everyone!',
          ja: 'うさぎは わけあうことが みんなを しあわせにすることを まなびました！',
        },
        jaKanji: {
          1: 'うさぎは 分けあうことが みんなを しあわせにすることを 学びました！',
          2: 'うさぎは 分け合うことが みんなを 幸せにすることを 学びました！',
          3: 'うさぎは 分け合うことが みんなを 幸せにすることを 学びました！',
          4: 'うさぎは 分け合うことが 皆を 幸せにすることを 学びました！',
          5: 'うさぎは 分け合うことが 皆を 幸せにすることを 学びました！',
          6: '兎は 分け合うことが 皆を 幸せにすることを 学びました！',
        },
        emoji: '💝',
      },
    ],
  },
  {
    id: '2',
    title: {
      en: 'The Rainbow After Rain',
      ja: 'あめのあとのにじ',
      jaKanji: {
        1: '雨のあとの にじ',
        2: '雨の後の にじ',
        3: '雨の後の 虹',
        4: '雨の後の 虹',
        5: '雨の後の 虹',
        6: '雨の後の 虹',
      },
    },
    description: {
      en: 'Learn about weather and finding beauty after difficulties',
      ja: 'てんきと こまったあとの うつくしさを まなぼう',
      jaKanji: {
        1: 'てんきと こまったあとの 美しさを 学ぼう',
        2: '天気と 困った後の 美しさを 学ぼう',
        3: '天気と 困った後の 美しさを 学ぼう',
        4: '天気と 困った後の 美しさを 学ぼう',
        5: '天気と 困った後の 美しさを 学ぼう',
        6: '天気と 困った後の 美しさを 学ぼう',
      },
    },
    lesson: {
      en: 'After every storm comes a rainbow - be patient and hopeful',
      ja: 'どんな あらしの あとにも にじが でます - しんぼうづよく きぼうを もって',
      jaKanji: {
        1: 'どんな あらしの あとにも にじが 出ます - しんぼう強く 希ぼうを もって',
        2: 'どんな あらしの 後にも にじが 出ます - 辛抱強く 希望を 持って',
        3: 'どんな 嵐の 後にも 虹が 出ます - 辛抱強く 希望を 持って',
        4: 'どんな 嵐の 後にも 虹が 出ます - 辛抱強く 希望を 持って',
        5: 'どんな 嵐の 後にも 虹が 出ます - 辛抱強く 希望を 持って',
        6: 'どんな 嵐の 後にも 虹が 出ます - 辛抱強く 希望を 持って',
      },
    },
    category: 'patience',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'It was a rainy day, and Yuki felt sad looking out the window.',
          ja: 'あめのひでした。ゆきちゃんは まどから そとをみて かなしくなりました。',
        },
        jaKanji: {
          1: '雨の日でした。ゆきちゃんは まどから 外を見て かなしくなりました。',
          2: '雨の日でした。ゆきちゃんは 窓から 外を見て 悲しくなりました。',
          3: '雨の日でした。ゆきちゃんは 窓から 外を見て 悲しくなりました。',
          4: '雨の日でした。ゆきちゃんは 窓から 外を見て 悲しくなりました。',
          5: '雨の日でした。ゆきちゃんは 窓から 外を見て 悲しくなりました。',
          6: '雨の日でした。ゆきちゃんは 窓から 外を見て 悲しくなりました。',
        },
        emoji: '🌧️',
      },
      {
        text: {
          en: '"I wanted to play in the park today," she said to her mother.',
          ja: '「きょうは こうえんで あそびたかったのに」と おかあさんに いいました。',
        },
        jaKanji: {
          1: '「今日は こうえんで あそびたかったのに」と お母さんに 言いました。',
          2: '「今日は 公園で あそびたかったのに」と お母さんに 言いました。',
          3: '「今日は 公園で 遊びたかったのに」と お母さんに 言いました。',
          4: '「今日は 公園で 遊びたかったのに」と お母さんに 言いました。',
          5: '「今日は 公園で 遊びたかったのに」と お母さんに 言いました。',
          6: '「今日は 公園で 遊びたかったのに」と お母さんに 言いました。',
        },
        emoji: '😢',
      },
      {
        text: {
          en: 'Her mother smiled and said, "Rain helps flowers grow and gives us water to drink."',
          ja: 'おかあさんは ほほえんで、「あめは おはなを そだてて、のむ みずを くれるのよ」と いいました。',
        },
        jaKanji: {
          1: 'お母さんは ほほえんで、「雨は お花を そだてて、のむ 水を くれるのよ」と 言いました。',
          2: 'お母さんは ほほえんで、「雨は お花を 育てて、飲む 水を くれるのよ」と 言いました。',
          3: 'お母さんは 微笑んで、「雨は お花を 育てて、飲む 水を くれるのよ」と 言いました。',
          4: 'お母さんは 微笑んで、「雨は お花を 育てて、飲む 水を くれるのよ」と 言いました。',
          5: 'お母さんは 微笑んで、「雨は お花を 育てて、飲む 水を くれるのよ」と 言いました。',
          6: 'お母さんは 微笑んで、「雨は お花を 育てて、飲む 水を くれるのよ」と 言いました。',
        },
        emoji: '🌻',
      },
      {
        text: {
          en: 'They read books together and made cookies while waiting for the rain to stop.',
          ja: 'あめが やむのを まちながら、いっしょに ほんを よんで クッキーを つくりました。',
        },
        jaKanji: {
          1: '雨が やむのを 待ちながら、いっしょに 本を 読んで クッキーを 作りました。',
          2: '雨が やむのを 待ちながら、一緒に 本を 読んで クッキーを 作りました。',
          3: '雨が 止むのを 待ちながら、一緒に 本を 読んで クッキーを 作りました。',
          4: '雨が 止むのを 待ちながら、一緒に 本を 読んで クッキーを 作りました。',
          5: '雨が 止むのを 待ちながら、一緒に 本を 読んで クッキーを 作りました。',
          6: '雨が 止むのを 待ちながら、一緒に 本を 読んで クッキーを 作りました。',
        },
        emoji: '📚🍪',
      },
      {
        text: {
          en: 'When the rain stopped, the sun came out from behind the clouds.',
          ja: 'あめが やむと、たいようが くもの うしろから でてきました。',
        },
        jaKanji: {
          1: '雨が やむと、太ようが 雲の うしろから 出てきました。',
          2: '雨が やむと、太陽が 雲の 後ろから 出てきました。',
          3: '雨が 止むと、太陽が 雲の 後ろから 出てきました。',
          4: '雨が 止むと、太陽が 雲の 後ろから 出て来ました。',
          5: '雨が 止むと、太陽が 雲の 後ろから 出て来ました。',
          6: '雨が 止むと、太陽が 雲の 後ろから 出て来ました。',
        },
        emoji: '☀️',
      },
      {
        text: {
          en: '"Look, Yuki!" her mother called. "Come see this!"',
          ja: '「みて、ゆきちゃん！」おかあさんが よびました。「これを みにきて！」',
        },
        jaKanji: {
          1: '「見て、ゆきちゃん！」お母さんが よびました。「これを 見に来て！」',
          2: '「見て、ゆきちゃん！」お母さんが 呼びました。「これを 見に来て！」',
          3: '「見て、ゆきちゃん！」お母さんが 呼びました。「これを 見に来て！」',
          4: '「見て、ゆきちゃん！」お母さんが 呼びました。「これを 見に来て！」',
          5: '「見て、ゆきちゃん！」お母さんが 呼びました。「これを 見に来て！」',
          6: '「見て、ゆきちゃん！」お母さんが 呼びました。「これを 見に来て！」',
        },
        emoji: '👀',
      },
      {
        text: {
          en: 'A beautiful rainbow appeared in the sky with seven colors!',
          ja: 'そらに ななつの いろの うつくしい にじが あらわれました！',
        },
        jaKanji: {
          1: '空に 七つの 色の うつくしい にじが あらわれました！',
          2: '空に 七つの 色の 美しい にじが 現れました！',
          3: '空に 七つの 色の 美しい 虹が 現れました！',
          4: '空に 七つの 色の 美しい 虹が 現れました！',
          5: '空に 七つの 色の 美しい 虹が 現れました！',
          6: '空に 七つの 色の 美しい 虹が 現れました！',
        },
        emoji: '🌈',
      },
      {
        text: {
          en: 'Yuki learned that after rain comes sunshine, and sometimes beautiful surprises!',
          ja: 'ゆきちゃんは あめのあとには おひさまが でて、ときどき すてきな サプライズが あることを まなびました！',
        },
        jaKanji: {
          1: 'ゆきちゃんは 雨のあとには お日さまが 出て、時々 すてきな サプライズが あることを 学びました！',
          2: 'ゆきちゃんは 雨の後には お日様が 出て、時々 すてきな サプライズが あることを 学びました！',
          3: 'ゆきちゃんは 雨の後には お日様が 出て、時々 素敵な サプライズが あることを 学びました！',
          4: 'ゆきちゃんは 雨の後には お日様が 出て、時々 素敵な サプライズが あることを 学びました！',
          5: 'ゆきちゃんは 雨の後には お日様が 出て、時々 素敵な サプライズが あることを 学びました！',
          6: 'ゆきちゃんは 雨の後には お日様が 出て、時々 素敵な サプライズが あることを 学びました！',
        },
        emoji: '✨',
      },
    ],
  },
  {
    id: '3',
    title: {
      en: 'The Honest Boy',
      ja: 'しょうじきな おとこのこ',
      jaKanji: {
        1: '正じきな 男の子',
        2: '正直な 男の子',
        3: '正直な 男の子',
        4: '正直な 男の子',
        5: '正直な 男の子',
        6: '正直な 男の子',
      },
    },
    description: {
      en: 'Learn about honesty and trust',
      ja: 'しょうじきさと しんらいについて まなぼう',
      jaKanji: {
        1: '正じきさと 信らいについて 学ぼう',
        2: '正直さと 信らいについて 学ぼう',
        3: '正直さと 信頼について 学ぼう',
        4: '正直さと 信頼について 学ぼう',
        5: '正直さと 信頼について 学ぼう',
        6: '正直さと 信頼について 学ぼう',
      },
    },
    lesson: {
      en: 'Honesty is always the best choice',
      ja: 'しょうじきで いることが いつも いちばん',
      jaKanji: {
        1: '正じきで いることが いつも 一ばん',
        2: '正直で いることが いつも 一番',
        3: '正直で いることが いつも 一番',
        4: '正直で いることが 何時も 一番',
        5: '正直で いることが 何時も 一番',
        6: '正直で 居ることが 何時も 一番',
      },
    },
    category: 'moral',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'Ken found a wallet on the playground after school.',
          ja: 'けんくんは がっこうの あとで こうていで さいふを みつけました。',
        },
        jaKanji: {
          1: 'けんくんは 学校の あとで こうていで さいふを みつけました。',
          2: 'けんくんは 学校の 後で 校ていで さいふを 見つけました。',
          3: 'けんくんは 学校の 後で 校庭で 財布を 見つけました。',
          4: 'けんくんは 学校の 後で 校庭で 財布を 見つけました。',
          5: 'けんくんは 学校の 後で 校庭で 財布を 見つけました。',
          6: 'けんくんは 学校の 後で 校庭で 財布を 見つけました。',
        },
        emoji: '💰',
      },
      {
        text: {
          en: 'Inside was a lot of money and a student ID card.',
          ja: 'なかには たくさんの おかねと がくせいしょうが はいっていました。',
        },
        jaKanji: {
          1: '中には たくさんの おかねと 学生しょうが 入っていました。',
          2: '中には たくさんの お金と 学生しょうが 入っていました。',
          3: '中には たくさんの お金と 学生証が 入っていました。',
          4: '中には たくさんの お金と 学生証が 入っていました。',
          5: '中には たくさんの お金と 学生証が 入っていました。',
          6: '中には たくさんの お金と 学生証が 入っていました。',
        },
        emoji: '💳',
      },
      {
        text: {
          en: 'His friend said, "Let\'s use it to buy video games!"',
          ja: 'ともだちは「これで ビデオゲームを かおうよ！」と いいました。',
        },
        jaKanji: {
          1: '友だちは「これで ビデオゲームを かおうよ！」と 言いました。',
          2: '友だちは「これで ビデオゲームを 買おうよ！」と 言いました。',
          3: '友達は「これで ビデオゲームを 買おうよ！」と 言いました。',
          4: '友達は「これで ビデオゲームを 買おうよ！」と 言いました。',
          5: '友達は「これで ビデオゲームを 買おうよ！」と 言いました。',
          6: '友達は「これで ビデオゲームを 買おうよ！」と 言いました。',
        },
        emoji: '🎮',
      },
      {
        text: {
          en: 'But Ken shook his head. "This belongs to someone else."',
          ja: 'でも けんくんは くびを ふりました。「これは ほかのひとの ものだよ。」',
        },
        jaKanji: {
          1: 'でも けんくんは 首を ふりました。「これは ほかの人の ものだよ。」',
          2: 'でも けんくんは 首を ふりました。「これは 他の人の ものだよ。」',
          3: 'でも けんくんは 首を 振りました。「これは 他の人の ものだよ。」',
          4: 'でも けんくんは 首を 振りました。「これは 他の人の 物だよ。」',
          5: 'でも けんくんは 首を 振りました。「これは 他の人の 物だよ。」',
          6: 'でも けんくんは 首を 振りました。「これは 他の人の 物だよ。」',
        },
        emoji: '🙅‍♂️',
      },
      {
        text: {
          en: "Ken took the wallet to the teacher's office right away.",
          ja: 'けんくんは すぐに さいふを しょくいんしつに もっていきました。',
        },
        jaKanji: {
          1: 'けんくんは すぐに さいふを しょくいんしつに 持っていきました。',
          2: 'けんくんは すぐに 財ふを 職いん室に 持っていきました。',
          3: 'けんくんは すぐに 財布を 職員室に 持って行きました。',
          4: 'けんくんは すぐに 財布を 職員室に 持って行きました。',
          5: 'けんくんは すぐに 財布を 職員室に 持って行きました。',
          6: 'けんくんは すぐに 財布を 職員室に 持って行きました。',
        },
        emoji: '🏫',
      },
      {
        text: {
          en: 'The next day, a crying student came to thank Ken.',
          ja: 'つぎのひ、ないていた がくせいが けんくんに おれいを いいにきました。',
        },
        jaKanji: {
          1: '次の日、ないていた 学生が けんくんに おれいを 言いに来ました。',
          2: '次の日、泣いていた 学生が けんくんに お礼を 言いに来ました。',
          3: '次の日、泣いていた 学生が けんくんに お礼を 言いに来ました。',
          4: '次の日、泣いていた 学生が けんくんに お礼を 言いに来ました。',
          5: '翌日、泣いていた 学生が けんくんに お礼を 言いに来ました。',
          6: '翌日、泣いていた 学生が けんくんに お礼を 言いに来ました。',
        },
        emoji: '😢',
      },
      {
        text: {
          en: '"Thank you! That money was for my grandmother\'s medicine."',
          ja: '「ありがとう！ あのおかねは おばあちゃんの くすりのためでした。」',
        },
        jaKanji: {
          1: '「ありがとう！ あのお金は おばあちゃんの くすりのためでした。」',
          2: '「ありがとう！ あのお金は おばあちゃんの 薬のためでした。」',
          3: '「ありがとう！ あのお金は おばあちゃんの 薬のためでした。」',
          4: '「ありがとう！ あのお金は お祖母ちゃんの 薬のためでした。」',
          5: '「ありがとう！ あのお金は お祖母ちゃんの 薬のためでした。」',
          6: '「ありがとう！ あのお金は お祖母ちゃんの 薬の為でした。」',
        },
        emoji: '💊',
      },
      {
        text: {
          en: 'Ken felt proud. Being honest made him a hero!',
          ja: 'けんくんは ほこらしく かんじました。しょうじきで いることが かれを ヒーローに しました！',
        },
        jaKanji: {
          1: 'けんくんは ほこらしく かんじました。正じきで いることが かれを ヒーローに しました！',
          2: 'けんくんは 誇らしく 感じました。正直で いることが 彼を ヒーローに しました！',
          3: 'けんくんは 誇らしく 感じました。正直で いることが 彼を ヒーローに しました！',
          4: 'けんくんは 誇らしく 感じました。正直で いることが 彼を ヒーローに しました！',
          5: 'けんくんは 誇らしく 感じました。正直で いることが 彼を ヒーローに しました！',
          6: 'けんくんは 誇らしく 感じました。正直で いることが 彼を ヒーローに しました！',
        },
        emoji: '🦸‍♂️',
      },
    ],
  },
  {
    id: '4',
    title: {
      en: 'The Brave Little Mouse',
      ja: 'ゆうかんな ちいさな ねずみ',
      jaKanji: {
        1: 'ゆうかんな 小さな ねずみ',
        2: 'ゆうかんな 小さな ねずみ',
        3: '勇かんな 小さな ねずみ',
        4: '勇敢な 小さな 鼠',
        5: '勇敢な 小さな 鼠',
        6: '勇敢な 小さな 鼠',
      },
    },
    description: {
      en: 'Learn about courage and helping others',
      ja: 'ゆうきと たすけあいについて まなぼう',
      jaKanji: {
        1: 'ゆうきと 助けあいについて 学ぼう',
        2: '勇気と 助け合いについて 学ぼう',
        3: '勇気と 助け合いについて 学ぼう',
        4: '勇気と 助け合いについて 学ぼう',
        5: '勇気と 助け合いについて 学ぼう',
        6: '勇気と 助け合いについて 学ぼう',
      },
    },
    lesson: {
      en: 'Even the smallest can be the bravest',
      ja: 'ちいさくても ゆうかんに なれる',
      jaKanji: {
        1: '小さくても ゆうかんに なれる',
        2: '小さくても 勇かんに なれる',
        3: '小さくても 勇敢に なれる',
        4: '小さくても 勇敢に なれる',
        5: '小さくても 勇敢に なれる',
        6: '小さくても 勇敢に なれる',
      },
    },
    category: 'courage',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'A tiny mouse lived in a hole under a big tree.',
          ja: 'ちいさな ねずみが おおきな きの したの あなに すんでいました。',
        },
        jaKanji: {
          1: '小さな ねずみが 大きな 木の 下の あなに すんでいました。',
          2: '小さな ねずみが 大きな 木の 下の あなに 住んでいました。',
          3: '小さな ねずみが 大きな 木の 下の 穴に 住んでいました。',
          4: '小さな 鼠が 大きな 木の 下の 穴に 住んでいました。',
          5: '小さな 鼠が 大きな 木の 下の 穴に 住んでいました。',
          6: '小さな 鼠が 大きな 木の 下の 穴に 住んでいました。',
        },
        emoji: '🐭',
      },
      {
        text: {
          en: "One day, he heard a lion crying for help in a hunter's net.",
          ja: 'あるひ、かりゅうどの あみに かかった ライオンが たすけを もとめて ないているのを ききました。',
        },
        jaKanji: {
          1: 'ある日、かりゅうどの あみに かかった ライオンが 助けを もとめて ないているのを 聞きました。',
          2: 'ある日、かりゅうどの 網に かかった ライオンが 助けを 求めて 泣いているのを 聞きました。',
          3: 'ある日、狩人の 網に かかった ライオンが 助けを 求めて 泣いているのを 聞きました。',
          4: 'ある日、狩人の 網に かかった ライオンが 助けを 求めて 泣いているのを 聞きました。',
          5: 'ある日、狩人の 網に かかった ライオンが 助けを 求めて 泣いているのを 聞きました。',
          6: 'ある日、狩人の 網に 掛かった 獅子が 助けを 求めて 泣いているのを 聞きました。',
        },
        emoji: '🦁',
      },
      {
        text: {
          en: 'All the animals were too scared to help the king of the jungle.',
          ja: 'どうぶつたちは みんな こわくて ジャングルの おうさまを たすけられませんでした。',
        },
        jaKanji: {
          1: 'どうぶつたちは みんな こわくて ジャングルの 王さまを 助けられませんでした。',
          2: '動物たちは みんな 怖くて ジャングルの 王様を 助けられませんでした。',
          3: '動物たちは みんな 怖くて ジャングルの 王様を 助けられませんでした。',
          4: '動物たちは 皆 怖くて ジャングルの 王様を 助けられませんでした。',
          5: '動物達は 皆 怖くて ジャングルの 王様を 助けられませんでした。',
          6: '動物達は 皆 怖くて ジャングルの 王様を 助けられませんでした。',
        },
        emoji: '😨',
      },
      {
        text: {
          en: 'But the little mouse bravely ran to the lion.',
          ja: 'でも ちいさな ねずみは ゆうかんに ライオンの ところへ はしりました。',
        },
        jaKanji: {
          1: 'でも 小さな ねずみは ゆうかんに ライオンの ところへ 走りました。',
          2: 'でも 小さな ねずみは 勇かんに ライオンの ところへ 走りました。',
          3: 'でも 小さな ねずみは 勇敢に ライオンの 所へ 走りました。',
          4: 'でも 小さな 鼠は 勇敢に ライオンの 所へ 走りました。',
          5: 'でも 小さな 鼠は 勇敢に ライオンの 所へ 走りました。',
          6: 'でも 小さな 鼠は 勇敢に 獅子の 所へ 走りました。',
        },
        emoji: '🏃‍♂️',
      },
      {
        text: {
          en: 'With his tiny teeth, he chewed through the thick ropes.',
          ja: 'ちいさな はで、あつい ロープを かみきりました。',
        },
        jaKanji: {
          1: '小さな 歯で、あつい ロープを かみきりました。',
          2: '小さな 歯で、厚い ロープを かみ切りました。',
          3: '小さな 歯で、厚い ロープを 噛み切りました。',
          4: '小さな 歯で、太い ロープを 噛み切りました。',
          5: '小さな 歯で、太い ロープを 噛み切りました。',
          6: '小さな 歯で、太い ロープを 噛み切りました。',
        },
        emoji: '✂️',
      },
      {
        text: {
          en: 'Finally, the lion was free! "Thank you, brave little friend!"',
          ja: 'ついに、ライオンは じゆうに なりました！「ありがとう、ゆうかんな ちいさな ともだち！」',
        },
        jaKanji: {
          1: 'ついに、ライオンは 自ゆうに なりました！「ありがとう、ゆうかんな 小さな 友だち！」',
          2: 'ついに、ライオンは 自由に なりました！「ありがとう、勇かんな 小さな 友だち！」',
          3: 'ついに、ライオンは 自由に なりました！「ありがとう、勇敢な 小さな 友達！」',
          4: '遂に、ライオンは 自由に なりました！「ありがとう、勇敢な 小さな 友達！」',
          5: '遂に、ライオンは 自由に なりました！「ありがとう、勇敢な 小さな 友達！」',
          6: '遂に、獅子は 自由に なりました！「ありがとう、勇敢な 小さな 友達！」',
        },
        emoji: '🎉',
      },
      {
        text: {
          en: 'From that day on, they became the best of friends.',
          ja: 'そのひから、かれらは いちばんの ともだちに なりました。',
        },
        jaKanji: {
          1: 'その日から、かれらは 一ばんの 友だちに なりました。',
          2: 'その日から、彼らは 一番の 友だちに なりました。',
          3: 'その日から、彼らは 一番の 友達に なりました。',
          4: 'その日から、彼らは 一番の 友達に なりました。',
          5: 'その日から、彼らは 一番の 友達に なりました。',
          6: 'その日から、彼らは 一番の 友達に なりました。',
        },
        emoji: '👫',
      },
      {
        text: {
          en: 'The mouse learned that courage comes from the heart, not size!',
          ja: 'ねずみは ゆうきは おおきさではなく こころから くることを まなびました！',
        },
        jaKanji: {
          1: 'ねずみは ゆうきは 大きさではなく 心から くることを 学びました！',
          2: 'ねずみは 勇気は 大きさではなく 心から 来ることを 学びました！',
          3: 'ねずみは 勇気は 大きさではなく 心から 来ることを 学びました！',
          4: '鼠は 勇気は 大きさではなく 心から 来ることを 学びました！',
          5: '鼠は 勇気は 大きさではなく 心から 来ることを 学びました！',
          6: '鼠は 勇気は 大きさではなく 心から 来ることを 学びました！',
        },
        emoji: '❤️',
      },
    ],
  },
  {
    id: '5',
    title: {
      en: 'The Responsible Ant',
      ja: 'せきにんかんの ある あり',
      jaKanji: {
        1: 'せきにんかんの ある あり',
        2: 'せきにんかんの ある あり',
        3: '責任かんの ある あり',
        4: '責任感の ある あり',
        5: '責任感の ある 蟻',
        6: '責任感の ある 蟻',
      },
    },
    description: {
      en: 'Learn about responsibility and preparation',
      ja: 'せきにんと じゅんびについて まなぼう',
      jaKanji: {
        1: 'せきにんと じゅんびについて 学ぼう',
        2: 'せきにんと 準びについて 学ぼう',
        3: '責任と 準備について 学ぼう',
        4: '責任と 準備について 学ぼう',
        5: '責任と 準備について 学ぼう',
        6: '責任と 準備について 学ぼう',
      },
    },
    lesson: {
      en: 'Working hard today makes tomorrow easier',
      ja: 'きょう がんばることが あしたを らくに します',
      jaKanji: {
        1: '今日 がんばることが あしたを らくに します',
        2: '今日 がんばることが 明日を らくに します',
        3: '今日 頑張ることが 明日を 楽に します',
        4: '今日 頑張ることが 明日を 楽に します',
        5: '今日 頑張ることが 明日を 楽に します',
        6: '今日 頑張ることが 明日を 楽に します',
      },
    },
    category: 'responsibility',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'In summer, an ant worked hard collecting food every day.',
          ja: 'なつに、ありは まいにち いっしょうけんめい たべものを あつめていました。',
        },
        jaKanji: {
          1: '夏に、ありは 毎日 いっしょうけんめい 食べものを あつめていました。',
          2: '夏に、ありは 毎日 一生けんめい 食べ物を 集めていました。',
          3: '夏に、ありは 毎日 一生懸命 食べ物を 集めていました。',
          4: '夏に、蟻は 毎日 一生懸命 食べ物を 集めていました。',
          5: '夏に、蟻は 毎日 一生懸命 食べ物を 集めていました。',
          6: '夏に、蟻は 毎日 一生懸命 食べ物を 集めていました。',
        },
        emoji: '🐜',
      },
      {
        text: {
          en: 'A grasshopper laughed, "Why work? Come play and sing!"',
          ja: 'キリギリスは わらいました。「なぜ はたらくの？ あそんで うたおうよ！」',
        },
        jaKanji: {
          1: 'キリギリスは 笑いました。「なぜ はたらくの？ あそんで 歌おうよ！」',
          2: 'キリギリスは 笑いました。「なぜ 働くの？ 遊んで 歌おうよ！」',
          3: 'キリギリスは 笑いました。「なぜ 働くの？ 遊んで 歌おうよ！」',
          4: 'キリギリスは 笑いました。「何故 働くの？ 遊んで 歌おうよ！」',
          5: 'キリギリスは 笑いました。「何故 働くの？ 遊んで 歌おうよ！」',
          6: '螽斯は 笑いました。「何故 働くの？ 遊んで 歌おうよ！」',
        },
        emoji: '🦗',
      },
      {
        text: {
          en: 'The ant replied, "Winter is coming. We must prepare!"',
          ja: 'ありは こたえました。「ふゆが きます。じゅんびを しなければ！」',
        },
        jaKanji: {
          1: 'ありは 答えました。「冬が 来ます。じゅんびを しなければ！」',
          2: 'ありは 答えました。「冬が 来ます。準備を しなければ！」',
          3: 'ありは 答えました。「冬が 来ます。準備を しなければ！」',
          4: '蟻は 答えました。「冬が 来ます。準備を しなければ！」',
          5: '蟻は 答えました。「冬が 来ます。準備を しなければ！」',
          6: '蟻は 答えました。「冬が 来ます。準備を しなければ！」',
        },
        emoji: '❄️',
      },
      {
        text: {
          en: 'The grasshopper kept playing while the ant kept working.',
          ja: 'キリギリスは あそびつづけ、ありは はたらきつづけました。',
        },
        jaKanji: {
          1: 'キリギリスは あそび続け、ありは はたらき続けました。',
          2: 'キリギリスは 遊び続け、ありは 働き続けました。',
          3: 'キリギリスは 遊び続け、ありは 働き続けました。',
          4: 'キリギリスは 遊び続け、蟻は 働き続けました。',
          5: 'キリギリスは 遊び続け、蟻は 働き続けました。',
          6: '螽斯は 遊び続け、蟻は 働き続けました。',
        },
        emoji: '🎵',
      },
      {
        text: {
          en: 'When winter came, snow covered everything white.',
          ja: 'ふゆが きて、ゆきが すべてを しろく おおいました。',
        },
        jaKanji: {
          1: '冬が 来て、雪が すべてを 白く おおいました。',
          2: '冬が 来て、雪が 全てを 白く おおいました。',
          3: '冬が 来て、雪が 全てを 白く 覆いました。',
          4: '冬が 来て、雪が 全てを 白く 覆いました。',
          5: '冬が 来て、雪が 全てを 白く 覆いました。',
          6: '冬が 来て、雪が 全てを 白く 覆いました。',
        },
        emoji: '⛄',
      },
      {
        text: {
          en: 'The ant was warm with plenty of food in his home.',
          ja: 'ありは いえに たくさんの たべものが あって あたたかでした。',
        },
        jaKanji: {
          1: 'ありは 家に たくさんの 食べ物が あって あたたかでした。',
          2: 'ありは 家に たくさんの 食べ物が あって 暖かでした。',
          3: 'ありは 家に たくさんの 食べ物が あって 暖かでした。',
          4: '蟻は 家に たくさんの 食べ物が あって 暖かでした。',
          5: '蟻は 家に たくさんの 食べ物が あって 暖かでした。',
          6: '蟻は 家に たくさんの 食べ物が 有って 暖かでした。',
        },
        emoji: '🏠',
      },
      {
        text: {
          en: 'The cold grasshopper knocked, "Please help me!"',
          ja: 'さむい キリギリスが ノックしました。「たすけて ください！」',
        },
        jaKanji: {
          1: '寒い キリギリスが ノックしました。「助けて ください！」',
          2: '寒い キリギリスが ノックしました。「助けて ください！」',
          3: '寒い キリギリスが ノックしました。「助けて 下さい！」',
          4: '寒い キリギリスが ノックしました。「助けて 下さい！」',
          5: '寒い キリギリスが ノックしました。「助けて 下さい！」',
          6: '寒い 螽斯が ノックしました。「助けて 下さい！」',
        },
        emoji: '🥶',
      },
      {
        text: {
          en: 'The kind ant shared his food and taught about responsibility.',
          ja: 'やさしい ありは たべものを わけて、せきにんについて おしえました。',
        },
        jaKanji: {
          1: 'やさしい ありは 食べ物を 分けて、せきにんについて 教えました。',
          2: '優しい ありは 食べ物を 分けて、責任について 教えました。',
          3: '優しい ありは 食べ物を 分けて、責任について 教えました。',
          4: '優しい 蟻は 食べ物を 分けて、責任について 教えました。',
          5: '優しい 蟻は 食べ物を 分けて、責任について 教えました。',
          6: '優しい 蟻は 食べ物を 分けて、責任に就いて 教えました。',
        },
        emoji: '🤝',
      },
    ],
  },
  {
    id: '6',
    title: {
      en: 'The Tree of Friendship',
      ja: 'ゆうじょうの き',
      jaKanji: {
        1: 'ゆうじょうの 木',
        2: 'ゆうじょうの 木',
        3: '友じょうの 木',
        4: '友情の 木',
        5: '友情の 木',
        6: '友情の 木',
      },
    },
    description: {
      en: 'Learn about nurturing friendships',
      ja: 'ゆうじょうを そだてることを まなぼう',
      jaKanji: {
        1: 'ゆうじょうを そだてることを 学ぼう',
        2: 'ゆうじょうを 育てることを 学ぼう',
        3: '友じょうを 育てることを 学ぼう',
        4: '友情を 育てることを 学ぼう',
        5: '友情を 育てることを 学ぼう',
        6: '友情を 育てることを 学ぼう',
      },
    },
    lesson: {
      en: 'Friendship grows when we care for each other',
      ja: 'おたがいを たいせつに すると ゆうじょうは そだちます',
      jaKanji: {
        1: 'おたがいを 大せつに すると ゆうじょうは そだちます',
        2: 'お互いを 大切に すると ゆうじょうは 育ちます',
        3: 'お互いを 大切に すると 友じょうは 育ちます',
        4: 'お互いを 大切に すると 友情は 育ちます',
        5: 'お互いを 大切に すると 友情は 育ちます',
        6: 'お互いを 大切に すると 友情は 育ちます',
      },
    },
    category: 'friendship',
    minGrade: 1,
    pages: [
      {
        text: {
          en: 'Two children planted a small tree together in the park.',
          ja: 'ふたりの こどもが こうえんに ちいさな きを いっしょに うえました。',
        },
        jaKanji: {
          1: '二人の 子どもが こうえんに 小さな 木を いっしょに うえました。',
          2: '二人の 子どもが 公園に 小さな 木を 一緒に 植えました。',
          3: '二人の 子供が 公園に 小さな 木を 一緒に 植えました。',
          4: '二人の 子供が 公園に 小さな 木を 一緒に 植えました。',
          5: '二人の 子供が 公園に 小さな 木を 一緒に 植えました。',
          6: '二人の 子供が 公園に 小さな 木を 一緒に 植えました。',
        },
        emoji: '🌱',
      },
      {
        text: {
          en: '"Let\'s call it our Friendship Tree!" said Mika.',
          ja: '「これを ゆうじょうの きと よぼう！」と みかちゃんが いいました。',
        },
        jaKanji: {
          1: '「これを ゆうじょうの 木と よぼう！」と みかちゃんが 言いました。',
          2: '「これを 友じょうの 木と 呼ぼう！」と みかちゃんが 言いました。',
          3: '「これを 友情の 木と 呼ぼう！」と みかちゃんが 言いました。',
          4: '「これを 友情の 木と 呼ぼう！」と みかちゃんが 言いました。',
          5: '「これを 友情の 木と 呼ぼう！」と みかちゃんが 言いました。',
          6: '「これを 友情の 木と 呼ぼう！」と みかちゃんが 言いました。',
        },
        emoji: '👧',
      },
      {
        text: {
          en: 'Every day, they watered it and talked to it together.',
          ja: 'まいにち、ふたりで みずを やって、きに はなしかけました。',
        },
        jaKanji: {
          1: '毎日、二人で 水を やって、木に 話しかけました。',
          2: '毎日、二人で 水を やって、木に 話しかけました。',
          3: '毎日、二人で 水を やって、木に 話し掛けました。',
          4: '毎日、二人で 水を 遣って、木に 話し掛けました。',
          5: '毎日、二人で 水を 遣って、木に 話し掛けました。',
          6: '毎日、二人で 水を 遣って、木に 話し掛けました。',
        },
        emoji: '💧',
      },
      {
        text: {
          en: 'Sometimes they had arguments, but always made up.',
          ja: 'ときどき けんかも しましたが、いつも なかなおりしました。',
        },
        jaKanji: {
          1: '時々 けんかも しましたが、いつも なか直りしました。',
          2: '時々 けんかも しましたが、いつも 仲直りしました。',
          3: '時々 喧嘩も しましたが、いつも 仲直りしました。',
          4: '時々 喧嘩も しましたが、何時も 仲直りしました。',
          5: '時々 喧嘩も しましたが、何時も 仲直りしました。',
          6: '時々 喧嘩も しましたが、何時も 仲直りしました。',
        },
        emoji: '🤗',
      },
      {
        text: {
          en: 'Years passed, and the tree grew tall and strong.',
          ja: 'なんねんも たって、きは たかく つよく そだちました。',
        },
        jaKanji: {
          1: '何年も たって、木は 高く つよく そだちました。',
          2: '何年も たって、木は 高く 強く 育ちました。',
          3: '何年も 経って、木は 高く 強く 育ちました。',
          4: '何年も 経って、木は 高く 強く 育ちました。',
          5: '何年も 経って、木は 高く 強く 育ちました。',
          6: '何年も 経って、木は 高く 強く 育ちました。',
        },
        emoji: '🌳',
      },
      {
        text: {
          en: 'Their friendship grew strong too, just like the tree.',
          ja: 'ふたりの ゆうじょうも きのように つよく そだちました。',
        },
        jaKanji: {
          1: '二人の ゆうじょうも 木のように つよく そだちました。',
          2: '二人の 友じょうも 木のように 強く 育ちました。',
          3: '二人の 友情も 木のように 強く 育ちました。',
          4: '二人の 友情も 木の様に 強く 育ちました。',
          5: '二人の 友情も 木の様に 強く 育ちました。',
          6: '二人の 友情も 木の様に 強く 育ちました。',
        },
        emoji: '💕',
      },
      {
        text: {
          en: 'Now children play under their tree, seeing true friendship.',
          ja: 'いま こどもたちが そのきの したで あそび、ほんとうの ゆうじょうを みています。',
        },
        jaKanji: {
          1: '今 子どもたちが その木の 下で あそび、本とうの ゆうじょうを 見ています。',
          2: '今 子どもたちが その木の 下で 遊び、本当の 友じょうを 見ています。',
          3: '今 子供たちが その木の 下で 遊び、本当の 友情を 見ています。',
          4: '今 子供達が その木の 下で 遊び、本当の 友情を 見ています。',
          5: '今 子供達が その木の 下で 遊び、本当の 友情を 見ています。',
          6: '今 子供達が 其の木の 下で 遊び、本当の 友情を 見ています。',
        },
        emoji: '🌈',
      },
      {
        text: {
          en: 'They learned that friendship needs care to grow strong!',
          ja: 'ゆうじょうは つよく そだつために ケアが ひつようだと まなびました！',
        },
        jaKanji: {
          1: 'ゆうじょうは つよく そだつために ケアが ひつようだと 学びました！',
          2: '友じょうは 強く 育つために ケアが 必要だと 学びました！',
          3: '友情は 強く 育つために ケアが 必要だと 学びました！',
          4: '友情は 強く 育つ為に ケアが 必要だと 学びました！',
          5: '友情は 強く 育つ為に ケアが 必要だと 学びました！',
          6: '友情は 強く 育つ為に ケアが 必要だと 学びました！',
        },
        emoji: '🌟',
      },
    ],
  },
];

const getCategoryEmoji = (category: Story['category']): string => {
  const emojis = {
    moral: '⚖️',
    friendship: '🤝',
    nature: '🌿',
    responsibility: '📋',
    courage: '💪',
    patience: '⏰',
  };
  return emojis[category] || '📖';
};

const getCategoryName = (category: Story['category'], language: 'en' | 'ja'): string => {
  const names = {
    moral: { en: 'Moral', ja: 'どうとく' },
    friendship: { en: 'Friendship', ja: 'ゆうじょう' },
    nature: { en: 'Nature', ja: 'しぜん' },
    responsibility: { en: 'Responsibility', ja: 'せきにん' },
    courage: { en: 'Courage', ja: 'ゆうき' },
    patience: { en: 'Patience', ja: 'しんぼう' },
  };
  return names[category]?.[language] || 'Story';
};

export function StoryPage(): JSX.Element {
  const { t, language, kanjiGrade } = useLanguage();
  const { playSound, speak } = useAudio();
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const handleBack = async (): Promise<void> => {
    await playSound('click');
    if (selectedStory) {
      setSelectedStory(null);
      setCurrentPage(0);
    } else {
      navigate('/home');
    }
  };

  const handleStorySelect = async (story: Story): Promise<void> => {
    await playSound('click');
    setSelectedStory(story);
    setCurrentPage(0);
  };

  const handleNextPage = async (): Promise<void> => {
    if (!selectedStory) {
      return;
    }

    await playSound('click');
    if (currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = async (): Promise<void> => {
    await playSound('click');
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRead = async (): Promise<void> => {
    if (!selectedStory || isReading) {
      return;
    }

    setIsReading(true);
    await playSound('click');

    const currentPageData = selectedStory.pages[currentPage];
    const textToRead = language === 'ja' ? currentPageData.text.ja : currentPageData.text.en;

    speak(textToRead, language);

    // 読み上げ中の表示を3秒後に解除
    setTimeout(() => {
      setIsReading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-2xl p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            {selectedStory
              ? language === 'ja'
                ? selectedStory.title.jaKanji[kanjiGrade]
                : selectedStory.title.en
              : t('stories')}{' '}
            📖
          </h1>
          <div className="w-10" />
        </div>

        {!selectedStory ? (
          <>
            {/* 漢字レベル選択 */}
            <div className="flex justify-center mb-6">
              <KanjiGradeSelector />
            </div>

            {/* ストーリー選択画面 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <motion.button
                  key={story.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStorySelect(story)}
                  className="bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {language === 'ja' ? story.title.jaKanji[kanjiGrade] : story.title.en}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'ja'
                      ? story.description.jaKanji[kanjiGrade]
                      : story.description.en}
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-blue-800">
                      <span className="text-xs">📚 </span>
                      {language === 'ja' ? story.lesson.jaKanji[kanjiGrade] : story.lesson.en}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {story.pages.slice(0, 4).map((page, index) => (
                        <span key={index} className="text-2xl">
                          {page.emoji}
                        </span>
                      ))}
                      {story.pages.length > 4 && <span className="text-xl">...</span>}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getCategoryEmoji(story.category)} {getCategoryName(story.category, language)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          // ストーリー表示画面
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              {/* ページ内容 */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{selectedStory.pages[currentPage].emoji}</div>
                <p className="text-2xl font-medium text-gray-800 leading-relaxed">
                  {language === 'ja'
                    ? selectedStory.pages[currentPage].jaKanji[kanjiGrade]
                    : selectedStory.pages[currentPage].text.en}
                </p>
                {language === 'ja' && (
                  <p className="text-lg text-gray-500 mt-4">
                    {selectedStory.pages[currentPage].text.en}
                  </p>
                )}
              </div>

              {/* コントロール */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      currentPage === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                >
                  ←
                </button>

                <button
                  onClick={handleRead}
                  disabled={isReading}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all
                    ${
                      isReading
                        ? 'bg-yellow-300 text-gray-700 animate-pulse'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }
                  `}
                >
                  {isReading ? '🔊' : '▶️'}
                  {language === 'ja' ? 'よむ' : 'Read'}
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === selectedStory.pages.length - 1}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      currentPage === selectedStory.pages.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                >
                  →
                </button>
              </div>

              {/* ページインジケーター */}
              <div className="flex justify-center gap-2 mt-6">
                {selectedStory.pages.map((_, index) => (
                  <div
                    key={index}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${index === currentPage ? 'bg-blue-500 w-8' : 'bg-gray-300'}
                    `}
                  />
                ))}
              </div>

              {/* 最後のページで教訓を表示 */}
              {currentPage === selectedStory.pages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                    {language === 'ja' ? 'きょうの まなび' : "Today's Lesson"} 🌟
                  </h3>
                  <p className="text-center text-lg font-medium text-blue-800">
                    {language === 'ja'
                      ? selectedStory.lesson.jaKanji[kanjiGrade]
                      : selectedStory.lesson.en}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
