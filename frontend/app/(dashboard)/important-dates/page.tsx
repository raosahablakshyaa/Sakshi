'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Filter, Lock, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface ImportantDate {
  date: string;
  event: string;
  period: string;
  upsRelevance: string;
  category: string;
}

const IMPORTANT_DATES: ImportantDate[] = [
  // Ancient India
  { date: '2300 BCE', event: 'Indus Valley Civilization flourished', period: 'Ancient', upsRelevance: 'Foundation of Indian civilization, urban planning, seals', category: 'Ancient India' },
  { date: '1500 BCE', event: 'Vedic Period begins', period: 'Ancient', upsRelevance: 'Vedas, Aryans, caste system origins, Sanskrit literature', category: 'Ancient India' },
  { date: '600 BCE', event: 'Mahavira (Jainism) and Buddha (Buddhism) born', period: 'Ancient', upsRelevance: 'Religious movements, philosophy, social reforms', category: 'Ancient India' },
  { date: '322 BCE', event: 'Mauryan Empire founded by Chandragupta Maurya', period: 'Ancient', upsRelevance: 'First pan-Indian empire, Kautilya\'s Arthashastra, administration', category: 'Ancient India' },
  { date: '268 BCE', event: 'Ashoka becomes Mauryan Emperor', period: 'Ancient', upsRelevance: 'Edicts of Ashoka, Buddhism spread, non-violence policy', category: 'Ancient India' },
  { date: '185 BCE', event: 'Mauryan Empire ends, Shunga dynasty begins', period: 'Ancient', upsRelevance: 'Political fragmentation, regional kingdoms', category: 'Ancient India' },
  { date: '78 CE', event: 'Kanishka becomes Kushan Emperor', period: 'Ancient', upsRelevance: 'Silk Road trade, Buddhism patronage, cultural synthesis', category: 'Ancient India' },
  { date: '320 CE', event: 'Gupta Empire founded by Chandragupta I', period: 'Ancient', upsRelevance: 'Golden Age of India, art, science, mathematics, literature', category: 'Ancient India' },
  { date: '380 CE', event: 'Chandragupta II (Vikramaditya) becomes Gupta Emperor', period: 'Ancient', upsRelevance: 'Peak of Gupta prosperity, Kalidasa, Aryabhata', category: 'Ancient India' },
  { date: '550 CE', event: 'Gupta Empire declines', period: 'Ancient', upsRelevance: 'End of classical age, regional kingdoms emerge', category: 'Ancient India' },

  // Medieval India
  { date: '712 CE', event: 'Muhammad bin Qasim invades Sindh', period: 'Medieval', upsRelevance: 'First Muslim invasion, Islamic influence begins', category: 'Medieval India' },
  { date: '1000 CE', event: 'Mahmud of Ghazni\'s invasions begin', period: 'Medieval', upsRelevance: 'Turkish invasions, temple destruction, cultural conflict', category: 'Medieval India' },
  { date: '1192 CE', event: 'Battle of Tarain - Muhammad of Ghor defeats Prithviraj Chauhan', period: 'Medieval', upsRelevance: 'End of Hindu kingdoms, Delhi Sultanate foundation', category: 'Medieval India' },
  { date: '1206 CE', event: 'Delhi Sultanate established by Qutb-ud-din Aibak', period: 'Medieval', upsRelevance: 'Islamic rule in India, Indo-Islamic culture', category: 'Medieval India' },
  { date: '1336 CE', event: 'Vijayanagara Empire founded', period: 'Medieval', upsRelevance: 'Hindu resistance, South Indian power, art and architecture', category: 'Medieval India' },
  { date: '1526 CE', event: 'Battle of Panipat - Babur defeats Ibrahim Lodi, Mughal Empire begins', period: 'Medieval', upsRelevance: 'Mughal rule, Indo-Islamic synthesis, administration', category: 'Medieval India' },
  { date: '1556 CE', event: 'Akbar becomes Mughal Emperor', period: 'Medieval', upsRelevance: 'Religious tolerance, Mansabdari system, cultural integration', category: 'Medieval India' },
  { date: '1605 CE', event: 'Jahangir becomes Mughal Emperor', period: 'Medieval', upsRelevance: 'Art patronage, Nur Jahan\'s influence, cultural peak', category: 'Medieval India' },
  { date: '1658 CE', event: 'Aurangzeb becomes Mughal Emperor', period: 'Medieval', upsRelevance: 'Religious orthodoxy, Deccan expansion, empire decline begins', category: 'Medieval India' },
  { date: '1707 CE', event: 'Aurangzeb dies, Mughal Empire begins decline', period: 'Medieval', upsRelevance: 'Regional kingdoms rise, British opportunity', category: 'Medieval India' },

  // Modern India - British Period
  { date: '1600 CE', event: 'East India Company chartered', period: 'Modern', upsRelevance: 'British commercial interest in India begins', category: 'British India' },
  { date: '1757 CE', event: 'Battle of Plassey - Clive defeats Siraj-ud-Daulah', period: 'Modern', upsRelevance: 'British political control begins, Bengal under British rule', category: 'British India' },
  { date: '1764 CE', event: 'Battle of Buxar - British consolidate power', period: 'Modern', upsRelevance: 'British supremacy in North India established', category: 'British India' },
  { date: '1857 CE', event: 'Indian Rebellion (Sepoy Mutiny)', period: 'Modern', upsRelevance: 'First war of independence, British response, direct rule begins', category: 'British India' },
  { date: '1858 CE', event: 'British Crown takes direct control from East India Company', period: 'Modern', upsRelevance: 'India becomes British colony, Viceroy system', category: 'British India' },
  { date: '1885 CE', event: 'Indian National Congress founded', period: 'Modern', upsRelevance: 'Organized independence movement begins', category: 'British India' },
  { date: '1905 CE', event: 'Partition of Bengal by Curzon', period: 'Modern', upsRelevance: 'Swadeshi movement, nationalist awakening', category: 'British India' },
  { date: '1906 CE', event: 'Muslim League founded', period: 'Modern', upsRelevance: 'Separate Muslim political representation', category: 'British India' },
  { date: '1911 CE', event: 'Delhi Durbar - George V visits India', period: 'Modern', upsRelevance: 'Bengal partition reversed, Delhi becomes capital', category: 'British India' },
  { date: '1919 CE', event: 'Jallianwala Bagh Massacre', period: 'Modern', upsRelevance: 'Turning point in independence movement, Rowlatt Act', category: 'British India' },
  { date: '1920 CE', event: 'Non-Cooperation Movement launched by Gandhi', period: 'Modern', upsRelevance: 'Mass civil disobedience, Khilafat movement', category: 'British India' },
  { date: '1930 CE', event: 'Salt March by Gandhi', period: 'Modern', upsRelevance: 'Civil Disobedience Movement, iconic protest', category: 'British India' },
  { date: '1942 CE', event: 'Quit India Movement launched', period: 'Modern', upsRelevance: 'Final push for independence, mass participation', category: 'British India' },
  { date: '1945 CE', event: 'World War II ends, independence negotiations begin', period: 'Modern', upsRelevance: 'Britain weakened, independence imminent', category: 'British India' },

  // Independence & Constitution
  { date: '15 August 1947', event: 'India gains independence', period: 'Modern', upsRelevance: 'End of colonial rule, nation-state formation', category: 'Independence' },
  { date: '26 January 1950', event: 'Indian Constitution comes into effect, India becomes Republic', period: 'Modern', upsRelevance: 'Sovereign democratic republic, Dr. Ambedkar\'s contribution', category: 'Constitution' },
  { date: '26 November 1949', event: 'Constitution adopted by Constituent Assembly', period: 'Modern', upsRelevance: 'Drafting process, fundamental rights, directive principles', category: 'Constitution' },
  { date: '1952 CE', event: 'First General Elections held', period: 'Modern', upsRelevance: 'Universal adult suffrage, democratic foundation', category: 'Constitution' },
  { date: '1956 CE', event: 'States Reorganization Act - states reorganized on linguistic basis', period: 'Modern', upsRelevance: 'Federal structure, regional autonomy', category: 'Constitution' },

  // Economic & Social
  { date: '1961 CE', event: 'Goa liberation from Portuguese rule', period: 'Modern', upsRelevance: 'End of colonialism in India, military operation', category: 'Modern India' },
  { date: '1962 CE', event: 'Sino-Indian War', period: 'Modern', upsRelevance: 'Border dispute, military preparedness, geopolitics', category: 'Modern India' },
  { date: '1965 CE', event: 'Indo-Pakistani War', period: 'Modern', upsRelevance: 'Kashmir conflict, military strategy', category: 'Modern India' },
  { date: '1966 CE', event: 'Green Revolution begins under Lal Bahadur Shastri', period: 'Modern', upsRelevance: 'Agricultural transformation, food security', category: 'Economy' },
  { date: '1969 CE', event: 'Bank Nationalization', period: 'Modern', upsRelevance: 'Socialist policies, financial sector control', category: 'Economy' },
  { date: '1971 CE', event: 'Indo-Pakistani War, Bangladesh independence', period: 'Modern', upsRelevance: 'Military victory, geopolitical shift, humanitarian crisis', category: 'Modern India' },
  { date: '1974 CE', event: 'Pokharan-I Nuclear Test', period: 'Modern', upsRelevance: 'Nuclear capability, strategic autonomy', category: 'Modern India' },
  { date: '1975 CE', event: 'Emergency declared by Indira Gandhi', period: 'Modern', upsRelevance: 'Constitutional crisis, democratic test, civil liberties', category: 'Modern India' },
  { date: '1977 CE', event: 'Emergency ends, Janata Party wins elections', period: 'Modern', upsRelevance: 'Democratic resilience, first non-Congress government', category: 'Modern India' },
  { date: '1984 CE', event: 'Operation Blue Star, Bhopal Gas Tragedy', period: 'Modern', upsRelevance: 'Religious conflict, industrial disaster, environmental crisis', category: 'Modern India' },
  { date: '1991 CE', event: 'Economic Liberalization begins', period: 'Modern', upsRelevance: 'LPG reforms, market economy, globalization', category: 'Economy' },
  { date: '1998 CE', event: 'Pokharan-II Nuclear Tests', period: 'Modern', upsRelevance: 'Nuclear power status, strategic deterrence', category: 'Modern India' },
  { date: '2008 CE', event: '26/11 Mumbai Terror Attacks', period: 'Modern', upsRelevance: 'National security, terrorism, international relations', category: 'Modern India' },
  { date: '2014 CE', event: 'Narendra Modi becomes Prime Minister', period: 'Modern', upsRelevance: 'Political shift, Make in India, development agenda', category: 'Modern India' },
  { date: '2019 CE', event: 'Article 370 abrogation in Jammu & Kashmir', period: 'Modern', upsRelevance: 'Constitutional amendment, territorial integration', category: 'Modern India' },
  { date: '2020 CE', event: 'COVID-19 Pandemic in India', period: 'Modern', upsRelevance: 'Public health crisis, economic impact, governance', category: 'Modern India' },

  // International Days
  { date: '26 January', event: 'Republic Day', period: 'Modern', upsRelevance: 'Constitution Day, national celebration, military parade', category: 'International Days' },
  { date: '8 March', event: 'International Women\'s Day', period: 'Modern', upsRelevance: 'Gender equality, women empowerment, social issues', category: 'International Days' },
  { date: '22 April', event: 'Earth Day', period: 'Modern', upsRelevance: 'Environmental protection, climate change, sustainability', category: 'International Days' },
  { date: '1 May', event: 'International Labour Day', period: 'Modern', upsRelevance: 'Workers\' rights, labor laws, social justice', category: 'International Days' },
  { date: '5 June', event: 'World Environment Day', period: 'Modern', upsRelevance: 'Environmental conservation, pollution, climate action', category: 'International Days' },
  { date: '21 June', event: 'International Yoga Day', period: 'Modern', upsRelevance: 'Indian cultural heritage, health, wellness', category: 'International Days' },
  { date: '15 August', event: 'Independence Day', period: 'Modern', upsRelevance: 'National pride, freedom struggle, patriotism', category: 'International Days' },
  { date: '2 October', event: 'Gandhi Jayanti', period: 'Modern', upsRelevance: 'Non-violence, civil disobedience, Gandhian philosophy', category: 'International Days' },
  { date: '24 October', event: 'United Nations Day', period: 'Modern', upsRelevance: 'International cooperation, global governance', category: 'International Days' },
  { date: '14 November', event: 'Children\'s Day (Nehru Jayanti)', period: 'Modern', upsRelevance: 'Child welfare, education, youth development', category: 'International Days' },
  { date: '25 December', event: 'Christmas', period: 'Modern', upsRelevance: 'Religious diversity, secular India, cultural harmony', category: 'International Days' },
];

const ADMIN_CREDENTIALS = [
  { id: 1, email: 'lakshyayadav314@gmail.com', password: 'Raosahab_lakshya@2506', role: 'Super Admin' },
  { id: 2, email: 'admin@sakshi.com', password: 'Admin@2506', role: 'Admin' },
  { id: 3, email: 'mentor@sakshi.com', password: 'Mentor@2506', role: 'Content Admin' },
];

export default function ImportantDatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPasswords, setShowPasswords] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['All', ...new Set(IMPORTANT_DATES.map(d => d.category))];

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDates = useMemo(() => {
    return IMPORTANT_DATES.filter(date => {
      const matchesSearch = 
        date.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        date.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        date.upsRelevance.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || date.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Important Dates
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base">Master all historically significant dates for IAS preparation</p>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 sm:w-5 h-4 sm:h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by event, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-slate-500 flex-shrink-0" />
            <div className="flex gap-1 sm:gap-2 flex-nowrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap text-xs sm:text-sm transition ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6 text-slate-400 text-xs sm:text-sm">
          Showing <span className="text-purple-400 font-semibold">{filteredDates.length}</span> dates
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {filteredDates.length > 0 ? (
            filteredDates.map((date, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-3 sm:p-4 md:p-5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition duration-300"
              >
                {/* Date */}
                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 break-words">{date.date}</span>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full flex-shrink-0">
                    {date.category}
                  </span>
                </div>

                {/* Event */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition line-clamp-2">
                  {date.event}
                </h3>

                {/* UPSC Relevance */}
                <div className="bg-slate-900/50 rounded p-2 sm:p-3 border-l-2 border-purple-500">
                  <p className="text-xs sm:text-sm text-slate-300">
                    <span className="text-purple-400 font-semibold">UPSC:</span> {date.upsRelevance}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              <Calendar className="w-8 sm:w-12 h-8 sm:h-12 text-slate-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-400 text-sm sm:text-lg">No dates found matching your search</p>
            </div>
          )}
        </div>

        {/* Study Tips */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">📚 Study Tips</h3>
          <ul className="text-slate-300 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <li>✓ Focus on dates with high UPSC relevance first</li>
            <li>✓ Group dates by period to understand historical context</li>
            <li>✓ Connect dates with current affairs for better retention</li>
            <li>✓ Practice chronological ordering of events</li>
            <li>✓ Use mnemonics to remember important years</li>
          </ul>
        </div>

        {/* Admin Panel Toggle */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-300 transition text-xs sm:text-sm active:scale-95"
          >
            <Lock className="w-4 h-4 flex-shrink-0" />
            {showAdminPanel ? 'Hide' : 'Show'} Admin
          </button>
        </div>

        {/* Admin Panel */}
        {showAdminPanel && (
          <div className="mt-6 sm:mt-8 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Lock className="w-5 sm:w-6 h-5 sm:h-6 text-red-400 flex-shrink-0" />
              <h3 className="text-lg sm:text-2xl font-bold text-red-300">Admin Login</h3>
            </div>
            <p className="text-slate-400 mb-4 sm:mb-6 text-xs sm:text-sm">⚠️ Limited to 3 admin users. Use these credentials to access the admin dashboard.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {ADMIN_CREDENTIALS.map((admin) => (
                <div
                  key={admin.id}
                  className="bg-slate-800/50 border border-red-500/30 rounded-lg p-3 sm:p-4 hover:border-red-500/50 transition"
                >
                  {/* Role Badge */}
                  <div className="mb-3">
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full font-semibold inline-block">
                      {admin.role}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm text-purple-300 bg-slate-900/50 px-2 py-1 rounded flex-1 break-all">
                        {admin.email}
                      </code>
                      <button
                        onClick={() => copyToClipboard(admin.email, admin.id * 10)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition flex-shrink-0 active:scale-90"
                        title="Copy email"
                      >
                        {copiedId === admin.id * 10 ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Password</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm text-purple-300 bg-slate-900/50 px-2 py-1 rounded flex-1 break-all">
                        {showPasswords.includes(admin.id) ? admin.password : '••••••••••••'}
                      </code>
                      <button
                        onClick={() => togglePasswordVisibility(admin.id)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition flex-shrink-0 active:scale-90"
                        title="Toggle password visibility"
                      >
                        {showPasswords.includes(admin.id) ? (
                          <EyeOff className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(admin.password, admin.id * 20)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition flex-shrink-0 active:scale-90"
                        title="Copy password"
                      >
                        {copiedId === admin.id * 20 ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-4 sm:mt-6 bg-slate-900/50 border border-slate-700 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">📋 How to Use:</h4>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Copy email and password from above</li>
                <li>Navigate to <span className="text-purple-400 font-mono">/admin</span> page</li>
                <li>Login with your admin credentials</li>
                <li>Access admin dashboard to manage platform</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
