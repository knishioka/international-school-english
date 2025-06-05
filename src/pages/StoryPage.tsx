import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, KanjiGrade } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

interface Story {
  id: string;
  title: { en: string; ja: string };
  description: { en: string; ja: string };
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
    title: { en: 'The Kind Rabbit', ja: 'やさしいうさぎ' },
    description: {
      en: 'Learn about kindness and sharing',
      ja: 'やさしさと わけあうことを まなぼう',
    },
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
    title: { en: 'The Rainbow After Rain', ja: 'あめのあとのにじ' },
    description: {
      en: 'Learn about weather and finding beauty after difficulties',
      ja: 'てんきと こまったあとの うつくしさを まなぼう',
    },
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
];

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
                ? selectedStory.title.ja
                : selectedStory.title.en
              : t('stories')}{' '}
            📖
          </h1>
          <div className="w-10" />
        </div>

        {!selectedStory ? (
          // ストーリー選択画面
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
                  {language === 'ja' ? story.title.ja : story.title.en}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'ja' ? story.description.ja : story.description.en}
                </p>
                <div className="flex gap-2">
                  {story.pages.map((page, index) => (
                    <span key={index} className="text-2xl">
                      {page.emoji}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
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
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
