import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface LearningStatsProps {
  weeklyData: Array<{
    day: string;
    activities: number;
    score: number;
  }>;
  categoryProgress: Array<{
    category: string;
    completed: number;
    total: number;
  }>;
  timeDistribution: Array<{
    activity: string;
    minutes: number;
  }>;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function LearningStats({
  weeklyData,
  categoryProgress,
  timeDistribution,
}: LearningStatsProps): JSX.Element {
  const { language } = useLanguage();

  const dayNames = useMemo(() => {
    if (language === 'ja') {
      return {
        Mon: 'げつ',
        Tue: 'か',
        Wed: 'すい',
        Thu: 'もく',
        Fri: 'きん',
        Sat: 'ど',
        Sun: 'にち',
      };
    }
    return {
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
      Sun: 'Sun',
    };
  }, [language]);

  const activityNames = useMemo(() => {
    if (language === 'ja') {
      return {
        spelling: 'スペル',
        vocabulary: 'たんご',
        stories: 'おはなし',
        sentences: 'ぶんしょう',
      };
    }
    return {
      spelling: 'Spelling',
      vocabulary: 'Vocabulary',
      stories: 'Stories',
      sentences: 'Sentences',
    };
  }, [language]);

  const formatWeeklyData = weeklyData.map((item) => ({
    ...item,
    day: dayNames[item.day as keyof typeof dayNames] || item.day,
  }));

  const formatTimeData = timeDistribution.map((item) => ({
    ...item,
    activity: activityNames[item.activity as keyof typeof activityNames] || item.activity,
  }));

  const formatCategoryData = categoryProgress.map((item) => ({
    ...item,
    percentage: Math.round((item.completed / item.total) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'ja' ? 'しゅうかん かつどう' : 'Weekly Activity'} 📊
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={formatWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="activities" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Progress Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'ja' ? 'スコア しんちょく' : 'Score Progress'} 📈
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formatWeeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Distribution Pie Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'ja' ? 'がくしゅう じかん ぶんぷ' : 'Study Time Distribution'} ⏱️
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={formatTimeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ activity, percent }) => `${activity} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="minutes"
            >
              {formatTimeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {language === 'ja' ? 'カテゴリー べつ しんちょく' : 'Progress by Category'} 🎯
        </h3>
        <div className="space-y-3">
          {formatCategoryData.map((category, index) => (
            <div key={category.category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {activityNames[category.category as keyof typeof activityNames] ||
                    category.category}
                </span>
                <span className="text-sm text-gray-500">
                  {category.completed} / {category.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}