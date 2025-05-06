import React, { useState, useEffect, useRef } from 'react';
import { WellnessEntry, WellnessMetric } from './types';
import WellnessGraph from './components/WellnessGraph';
import MetricInput from './components/MetricInput';
import DaysSinceLastEntry from './components/DaysSinceLastEntry';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import { getRank } from './utils/rankSystem';
import RankBadge from './components/RankBadge';

const DEFAULT_METRICS = [
  { id: '1', name: 'Mental Wellbeing', value: 5 },
  { id: '2', name: 'Energy Levels', value: 5 },
  { id: '3', name: 'Mood', value: 5 },
  { id: '4', name: 'Sleep Quality', value: 5 },
  { id: '5', name: 'Stress Levels', value: 5 },
  { id: '6', name: 'Physical Wellbeing', value: 5 },
  { id: '7', name: 'Exercise Habits', value: 5 },
  { id: '8', name: 'Nutrition', value: 5 },
  { id: '9', name: 'Water Consumption', value: 5 },
];

const INSPIRATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen. - Unknown",
  "Your body hears everything your mind says. - Naomi Judd",
  "Most people run a race to see who is fastest. I run a race to see who has the most guts. - Steve Prefontaine",
  "Those who do not find time for exercise will have to find time for illness. - Edward Smith-Stanley",
  "The difference between the impossible and the possible lies in a person's determination. - Tommy Lasorda",
  "Strength does not come from physical capacity. It comes from an indomitable will. - Mahatma Gandhi",
  "Champions keep playing until they get it right. - Billie Jean King",
  "Success is what comes after you stop making excuses. - Luis Galarza",
  "Don't count the days, make the days count. - Muhammad Ali",
  "The only way to define your limits is by going beyond them. - Arthur C. Clarke",
  "Exercise should be regarded as a tribute to the heart. - Gene Tunney",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "If something stands between you and your success, move it. Never be denied. - Dwayne Johnson",
  "Pain is temporary. Quitting lasts forever. - Lance Armstrong",
  "Energy and persistence conquer all things. - Benjamin Franklin",
  "Do something today that your future self will thank you for. - Sean Patrick Flanery",
  "Motivation is what gets you started. Habit is what keeps you going. - Jim Ryun",
  "A year from now you may wish you had started today. - Karen Lamb",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
  "Fitness is not about being better than someone else. It's about being better than you used to be. - Khloe Kardashian",
  "You have to expect things of yourself before you can do them. - Michael Jordan",
  "Sweat is fat crying. - Anonymous",
  "Push yourself because no one else is going to do it for you. - Unknown",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It always seems impossible until it's done. - Nelson Mandela",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "The groundwork for all happiness is good health. - Leigh Hunt",
  "A fit body, a calm mind, a house full of love, these things cannot be bought. - Naval Ravikant",
  "Movement is a medicine for creating change in a person's physical, emotional, and mental states. - Carol Welch",
  "Discipline is the bridge between goals and accomplishment. - Jim Rohn",
  "Don't limit your challenges. Challenge your limits. - Jerry Dunn",
  "A champion is someone who gets up when they can't. - Jack Dempsey",
  "Your health account, your bank account, they're the same thing. The more you put in, the more you can take out. - Jack LaLanne",
  "Dead last finish is greater than did not finish, which trumps did not start. - Unknown",
  "Today I will do what others won't, so tomorrow I can accomplish what others can't. - Jerry Rice",
  "There's no secret formula. I lift heavy, work hard, and aim to be the best. - Ronnie Coleman",
  "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
  "Fitness is like a relationship. You can't cheat and expect it to work. - Unknown",
  "Take care of your body. It's the only place you have to live. - Jim Rohn",
  "You don't have to be extreme, just consistent. - Unknown",
  "Some people want it to happen, some wish it would happen, others make it happen. - Michael Jordan",
  "Fall in love with taking care of yourself. - Unknown",
  "Stop waiting for motivation. Get up and get it done. - Unknown",
  "Willpower is like a muscle: the more you train it, the stronger it gets. - Unknown",
  "You are only one workout away from a good mood. - Unknown",
  "Strength grows in the moments when you think you can't go on but you keep going anyway. - Unknown",
  "The body achieves what the mind believes. - Napoleon Hill",
  "Success starts with self-discipline. - Unknown",
  "Excuses don't burn calories. - Unknown",
  "Train insane or remain the same. - Jillian Michaels",
  "Be stronger than your strongest excuse. - Unknown",
  "Health is the greatest possession. - Lao Tzu",
  "The best project you'll ever work on is you. - Unknown",
  "You don't get the ass you want by sitting on it. - Unknown",
  "Fitness is not about being better than someone else… it's about being better than you used to be. - Unknown",
  "Champions aren't made in the gyms. Champions are made from something they have deep inside them, a desire, a dream, a vision. - Muhammad Ali",
  "Work hard in silence. Let success be your noise. - Frank Ocean",
  "Little by little, a little becomes a lot. - Tanzanian proverb",
  "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
  "You don't have to go fast, you just have to go. - Unknown",
  "Even if you fall on your face, you're still moving forward. - Victor Kiam",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Action is the foundational key to all success. - Pablo Picasso",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The pain you feel today will be the strength you feel tomorrow. - Unknown",
  "Do what you have to do until you can do what you want to do. - Oprah Winfrey",
  "A river cuts through rock not because of its power, but because of its persistence. - James N. Watkins",
  "Success isn't always about greatness. It's about consistency. - Dwayne Johnson",
  "You can have results or excuses. Not both. - Arnold Schwarzenegger",
  "Wake up with determination. Go to bed with satisfaction. - Unknown",
  "Don't fear failure. Fear being in the exact same place next year as you are today. - Unknown",
  "Mindset is what separates the best from the rest. - Unknown",
  "Never say never because limits, like fears, are often just an illusion. - Michael Jordan",
  "What hurts today makes you stronger tomorrow. - Jay Cutler",
  "You are the only one who can limit your greatness. - Unknown",
  "Don't count the reps. Make the reps count. - Muhammad Ali",
  "Being defeated is often a temporary condition. Giving up is what makes it permanent. - Marilyn vos Savant",
  "Either you run the day or the day runs you. - Jim Rohn",
  "Make each day your masterpiece. - John Wooden",
  "Act as if what you do makes a difference. It does. - William James",
  "You don't find willpower, you create it. - Unknown",
  "Don't limit yourself. Many people limit themselves to what they think they can do. - Mary Kay Ash",
  "You are your only limit. - Unknown",
  "Create healthy habits, not restrictions. - Unknown",
  "When you feel like quitting, remember why you started. - Unknown",
  "One workout at a time. One day at a time. One step at a time. - Unknown",
  "Fitness is not seasonal. It's a lifestyle. - Unknown",
];

function App() {
  const [metrics, setMetrics] = useState<WellnessMetric[]>(DEFAULT_METRICS);
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [quote, setQuote] = useState('');
  const [session, setSession] = useState(supabase.auth.getSession());
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchEntries();
    }
  }, [session]);

  useEffect(() => {
    setQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
  }, []);

  const fetchEntries = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('wellness_entries')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching entries:', error);
      return;
    }

    setEntries(data || []);
  };

  const handleMetricChange = (id: string, value: number) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, value } : m));
  };

  const handleSubmit = async () => {
    if (!session?.user) return;

    const newEntry = {
      user_id: session.user.id,
      timestamp: new Date().toISOString(),
      metrics: metrics,
    };

    const { error } = await supabase
      .from('wellness_entries')
      .insert([newEntry]);

    if (error) {
      console.error('Error saving entry:', error);
      return;
    }

    await fetchEntries();
    setMetrics(DEFAULT_METRICS);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 10000);

    if (graphRef.current && entries.length > 0) {
      graphRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setEntries([]);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Auth onSignIn={() => {}} />;
  }

  const latestEntry = entries[entries.length - 1];
  const currentRank = latestEntry ? getRank(
    latestEntry.metrics.reduce((acc, m) => 
      acc + (m.name === 'Stress Levels' ? 11 - m.value : m.value), 0
    ) / latestEntry.metrics.length
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Wellness Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {entries.length > 0 && (
              <>
                <DaysSinceLastEntry lastEntryDate={entries[entries.length - 1].timestamp} />
                {currentRank && <RankBadge rank={currentRank} />}
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>

        {entries.length > 0 && (
          <div ref={graphRef} className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
            <WellnessGraph entries={entries} />
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Rank Your Wellness</h2>
          <p className="flex-1 font-medium">1 lowest and 10 highest</p>
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map(metric => (
              <MetricInput
                key={metric.id}
                metric={metric}
                onChange={(value) => handleMetricChange(metric.id, value)}
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSubmitted ? 'Rank Submitted' : 'Submit Rank'}
          </button>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm">
          <p className="text-center text-lg italic text-yellow-800">{quote}</p>
        </div>
      </div>
    </div>
  );
}

export default App;