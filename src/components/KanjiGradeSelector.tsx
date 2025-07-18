import { useLanguage, KanjiGrade } from '@/contexts/LanguageContext';
import { useAudio } from '@/contexts/AudioContext';

export function KanjiGradeSelector(): JSX.Element | null {
  const { language, kanjiGrade, setKanjiGrade, t } = useLanguage();
  const { playSound } = useAudio();

  // Only show for Japanese language
  if (language !== 'ja') {
    return null;
  }

  const handleGradeChange = async (grade: KanjiGrade): Promise<void> => {
    await playSound('click');
    setKanjiGrade(grade);
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
      <span className="text-sm font-medium text-gray-700">{t('kanjiLevel')}:</span>
      <select
        value={kanjiGrade}
        onChange={(e) => handleGradeChange(Number(e.target.value) as KanjiGrade)}
        className="text-sm px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value={1}>{t('grade1')}</option>
        <option value={2}>{t('grade2')}</option>
        <option value={3}>{t('grade3')}</option>
        <option value={4}>{t('grade4')}</option>
        <option value={5}>{t('grade5')}</option>
        <option value={6}>{t('grade6')}</option>
      </select>
    </div>
  );
}
