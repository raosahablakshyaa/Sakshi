'use client';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, BookOpen, Link as LinkIcon, Loader2, Plus, Trash2, Activity as ActivityIcon, CheckCircle, XCircle } from 'lucide-react';

interface Student {
  _id: string;
  name: string;
  email: string;
  username: string;
  currentClass: number;
  totalQuestionsAttempted: number;
  totalCorrect: number;
  streak: number;
  lastActiveDate: string;
}

interface ChapterVideo {
  subject: string;
  class: number;
  chapter: string;
  videoUrl: string;
  videoTitle: string;
}

interface ActivityLog {
  _id: string;
  userName: string;
  userClass: number;
  activityType: string;
  subject: string;
  isCorrect: boolean;
  timestamp: string;
}

const NCERT_STRUCTURE: Record<string, Record<number, string[]>> = {
  History: {
    6: ['What, Where, How and When?', 'On The Trail of the Earliest People', 'From Gathering to Growing Food', 'In the Earliest Cities', 'What Books and Burials Tell Us', 'Kingdoms, Kings and an Early Republic', 'New Questions and Ideas', 'Ashoka, The Emperor Who Gave Up War', 'Vital Villages, Thriving Towns', 'Traders, Kings and Pilgrims', 'New Empires and Kingdoms', 'Buildings, Paintings and Books'],
    7: ['Tracing Changes Through a Thousand Years', 'New Kings and Kingdoms', 'The Delhi Sultans', 'The Mughal Empire', 'Rulers and Buildings', 'Towns, Traders and Craftspersons', 'Tribes, Nomads and Settled Communities', 'Devotional Paths to the Divine', 'The Making of Regional Cultures', 'Eighteenth-Century Political Formations'],
    8: ['How, When and Where', 'From Trade to Territory', 'Ruling the Countryside', 'Tribals, Dikus and the Vision of a Golden Age', 'When People Rebel', 'Weavers, Iron Smelters and Factory Owners', 'Civilising the "Native", Educating the Nation', 'Women, Caste and Reform', 'The Making of the National Movement', 'India After Independence'],
    9: ['The French Revolution', 'Socialism in Europe and the Russian Revolution', 'Nazism and the Rise of Hitler', 'Forest Society and Colonialism', 'Pastoralists in the Modern World'],
    10: ['The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World', 'The Age of Industrialisation', 'Print Culture and the Modern World'],
    11: ['From the Beginning of Time', 'Early Societies', 'An Empire Across Three Continents', 'The Central Islamic Lands', 'Nomadic Empires', 'The Three Orders', 'Changing Cultural Traditions', 'Confrontation of Cultures', 'The Industrial Revolution', 'Displacing Indigenous Peoples', 'Paths to Modernisation'],
    12: ['Bricks, Beads and Bones', 'Kings, Farmers and Towns', 'Kinship, Caste and Class', 'Thinkers, Beliefs and Buildings', 'Through the Eyes of Travellers', 'Bhakti-Sufi Traditions', 'An Imperial Capital: Vijayanagara', 'Peasants, Zamindars and the State', 'Kings and Chronicles', 'Colonialism and the Countryside', 'Rebels and the Raj', 'Colonial Cities', 'Mahatma Gandhi and the Nationalist Movement', 'Understanding Partition', 'Framing the Constitution']
  },
  Geography: {
    6: ['The Earth in the Solar System', 'Globe: Latitudes and Longitudes', 'Motions of the Earth', 'Maps', 'Major Domains of the Earth', 'Major Landforms of the Earth', 'Our Country – India', 'India: Climate, Vegetation and Wildlife'],
    7: ['Environment', 'Inside Our Earth', 'Our Changing Earth', 'Air', 'Water', 'Natural Vegetation and Wildlife', 'Human Environment – Settlement, Transport and Communication', 'Human-Environment Interactions', 'Life in the Temperate Grasslands', 'Life in the Deserts'],
    8: ['Resources', 'Land, Soil, Water, Natural Vegetation and Wildlife Resources', 'Mineral and Power Resources', 'Agriculture', 'Industries', 'Human Resources'],
    9: ['India – Size and Location', 'Physical Features of India', 'Drainage', 'Climate', 'Natural Vegetation and Wildlife', 'Population'],
    10: ['Resources and Development', 'Forest and Wildlife Resources', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources', 'Manufacturing Industries', 'Lifelines of National Economy'],
    11: ['Geography as a Discipline', 'The Origin and Evolution of the Earth', 'Interior of the Earth', 'Distribution of Oceans and Continents', 'Minerals and Rocks', 'Geomorphic Processes', 'Landforms and their Evolution', 'Composition and Structure of Atmosphere', 'Solar Radiation, Heat Balance and Temperature', 'Atmospheric Circulation and Weather Systems', 'Water in the Atmosphere', 'World Climate and Climate Change', 'Water (Oceans)', 'Movements of Ocean Water', 'Life on the Earth', 'Biodiversity and Conservation'],
    12: ['Population: Distribution, Density, Growth and Composition', 'Migration: Types, Causes and Consequences', 'Human Development', 'Human Settlements', 'Land Resources and Agriculture', 'Water Resources', 'Mineral and Energy Resources', 'Manufacturing Industries', 'Planning and Sustainable Development', 'Transport and Communication', 'International Trade', 'Geographical Perspective on Selected Issues and Problems']
  },
  'Political Science': {
    6: ['Understanding Diversity', 'Diversity and Discrimination', 'What is Government?', 'Key Elements of a Democratic Government', 'Panchayati Raj', 'Rural Administration', 'Urban Administration', 'Rural Livelihoods', 'Urban Livelihoods'],
    7: ['On Equality', 'Role of the Government in Health', 'How the State Government Works', 'Growing up as Boys and Girls', 'Women Change the World', 'Understanding Media', 'Understanding Advertising', 'Markets Around Us', 'A Shirt in the Market'],
    8: ['The Indian Constitution', 'Understanding Secularism', 'Why Do We Need a Parliament?', 'Understanding Laws', 'Judiciary', 'Understanding Our Criminal Justice System', 'Understanding Marginalisation', 'Confronting Marginalisation', 'Public Facilities', 'Law and Social Justice'],
    9: ['What is Democracy? Why Democracy?', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights'],
    10: ['Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste', 'Popular Struggles and Movements', 'Political Parties', 'Outcomes of Democracy', 'Challenges to Democracy'],
    11: ['Constitution: Why and How?', 'Rights in the Indian Constitution', 'Election and Representation', 'Executive', 'Legislature', 'Judiciary', 'Federalism', 'Local Governments', 'Constitution as a Living Document', 'The Philosophy of the Constitution'],
    12: ['Challenges of Nation Building', 'Era of One-Party Dominance', 'Politics of Planned Development', 'India\'s External Relations', 'Challenges to and Restoration of the Congress System', 'The Crisis of Democratic Order', 'Rise of Popular Movements', 'Regional Aspirations', 'Recent Developments in Indian Politics']
  },
  Economics: {
    9: ['The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India'],
    10: ['Development', 'Sectors of the Indian Economy', 'Money and Credit', 'Globalisation and the Indian Economy', 'Consumer Rights'],
    11: ['Introduction to Economics', 'Collection, Organisation and Presentation of Data', 'Statistical Tools and Interpretation', 'Developing Projects in Economics'],
    12: ['Introduction to Macroeconomics', 'National Income Accounting', 'Money and Banking', 'Determination of Income and Employment', 'Government Budget and the Economy', 'Open Economy Macroeconomics']
  },
  Science: {
    6: ['Food: Where Does It Come From?', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials into Groups', 'Separation of Substances', 'Changes Around Us', 'Getting to Know Plants', 'Body Movements', 'The Living Organisms and Their Surroundings', 'Motion and Measurement of Distances', 'Light, Shadows and Reflections', 'Electricity and Circuits', 'Fun with Magnets', 'Water', 'Air Around Us', 'Garbage In, Garbage Out'],
    7: ['Nutrition in Plants', 'Nutrition in Animals', 'Fibre to Fabric', 'Heat', 'Acids, Bases and Salts', 'Physical and Chemical Changes', 'Weather, Climate and Adaptations', 'Winds, Storms and Cyclones', 'Soil', 'Respiration in Organisms', 'Transportation in Animals and Plants', 'Reproduction in Plants', 'Motion and Time', 'Electric Current and Its Effects', 'Light', 'Water: A Precious Resource', 'Forests: Our Lifeline', 'Wastewater Story'],
    8: ['Crop Production and Management', 'Microorganisms', 'Synthetic Fibres and Plastics', 'Materials: Metals and Non-Metals', 'Coal and Petroleum', 'Combustion and Flame', 'Conservation of Plants and Animals', 'Cell Structure and Functions', 'Reproduction in Animals', 'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound', 'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light', 'Stars and the Solar System', 'Pollution of Air and Water'],
    9: ['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of the Atom', 'The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Why Do We Fall Ill?', 'Natural Resources', 'Improvement in Food Resources'],
    10: ['Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Life Processes', 'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity and Evolution', 'Light – Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Our Environment', 'Management of Natural Resources']
  }
};

export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activity' | 'students' | 'videos'>('activity');
  const [videoForm, setVideoForm] = useState({ subject: '', class: 7, chapter: '', videoUrl: '', videoTitle: '' });
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [chapters, setChapters] = useState<string[]>([]);

  useEffect(() => {
    loadStudents();
    loadActivities();
    loadVideos();
    
    // Refresh activity feed every 5 seconds
    const interval = setInterval(loadActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update chapters when subject or class changes
  useEffect(() => {
    if (videoForm.subject && videoForm.class) {
      const subjectChapters = NCERT_STRUCTURE[videoForm.subject]?.[videoForm.class] || [];
      setChapters(subjectChapters);
      setVideoForm(prev => ({ ...prev, chapter: '' }));
    } else {
      setChapters([]);
    }
  }, [videoForm.subject, videoForm.class]);

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem('sm_token');
      const res = await fetch('http://localhost:8080/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const token = localStorage.getItem('sm_token');
      const res = await fetch('http://localhost:8080/api/admin/activity-feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('sm_token');
      const res = await fetch('http://localhost:8080/api/admin/chapter-videos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoLoading(true);
    try {
      const token = localStorage.getItem('sm_token');
      const res = await fetch('http://localhost:8080/api/admin/chapter-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoForm)
      });
      if (res.ok) {
        setVideoForm({ subject: '', class: 7, chapter: '', videoUrl: '', videoTitle: '' });
        setChapters([]);
        loadVideos();
      }
    } catch (err) {
      console.error('Error adding video:', err);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const token = localStorage.getItem('sm_token');
      const res = await fetch(`http://localhost:8080/api/admin/chapter-videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadVideos();
      }
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const totalAccuracy = students.length > 0
    ? Math.round((students.reduce((sum, s) => sum + (s.totalCorrect || 0), 0) / students.reduce((sum, s) => sum + (s.totalQuestionsAttempted || 0), 0)) * 100) || 0
    : 0;

  const avgStreak = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.streak || 0), 0) / students.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-2">📊 Admin Dashboard</h1>
        <p className="text-[#8888aa]">Monitor students and manage resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888aa] text-sm">Total Students</p>
              <p className="text-3xl font-black text-[#6c63ff]">{students.length}</p>
            </div>
            <Users size={32} className="text-[#6c63ff] opacity-50" />
          </div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888aa] text-sm">Platform Accuracy</p>
              <p className="text-3xl font-black text-[#22c55e]">{totalAccuracy}%</p>
            </div>
            <TrendingUp size={32} className="text-[#22c55e] opacity-50" />
          </div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888aa] text-sm">Avg Streak</p>
              <p className="text-3xl font-black text-[#f5c842]">{avgStreak} days</p>
            </div>
            <Clock size={32} className="text-[#f5c842] opacity-50" />
          </div>
        </div>
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888aa] text-sm">Live Activities</p>
              <p className="text-3xl font-black text-[#06b6d4]">{activities.length}</p>
            </div>
            <ActivityIcon size={32} className="text-[#06b6d4] opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2a2a3d]">
        <button onClick={() => setActiveTab('activity')}
          className={`px-4 py-3 font-semibold text-sm transition-all ${activeTab === 'activity' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-[#8888aa]'}`}>
          🔴 Live Activity ({activities.length})
        </button>
        <button onClick={() => setActiveTab('students')}
          className={`px-4 py-3 font-semibold text-sm transition-all ${activeTab === 'students' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-[#8888aa]'}`}>
          👥 Students ({students.length})
        </button>
        <button onClick={() => setActiveTab('videos')}
          className={`px-4 py-3 font-semibold text-sm transition-all ${activeTab === 'videos' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-[#8888aa]'}`}>
          🎥 NCERT Videos ({videos.length})
        </button>
      </div>

      {/* Activity Feed Tab */}
      {activeTab === 'activity' && (
        <div className="glass p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">📡 Real-Time Student Activity</h2>
          {activities.length === 0 ? (
            <p className="text-[#8888aa] text-center py-8">No activity yet. Students will appear here when they solve questions!</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#1a1a28] rounded-lg border border-[#2a2a3d] hover:border-[#6c63ff]/50 transition">
                  <div className="flex items-center gap-3 flex-1">
                    {activity.isCorrect ? (
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{activity.userName}</p>
                      <p className="text-xs text-[#8888aa]">
                        Class {activity.userClass} • {activity.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[#8888aa]">
                      {new Date(activity.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`text-xs font-bold ${activity.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {activity.isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="glass p-6 rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="spinner text-[#6c63ff]" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-[#8888aa] text-center py-8">No students yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3d]">
                    <th className="text-left py-3 px-4 text-[#8888aa]">Name</th>
                    <th className="text-left py-3 px-4 text-[#8888aa]">Username</th>
                    <th className="text-left py-3 px-4 text-[#8888aa]">Class</th>
                    <th className="text-center py-3 px-4 text-[#8888aa]">Questions</th>
                    <th className="text-center py-3 px-4 text-[#8888aa]">Accuracy</th>
                    <th className="text-center py-3 px-4 text-[#8888aa]">Streak</th>
                    <th className="text-left py-3 px-4 text-[#8888aa]">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const accuracy = student.totalQuestionsAttempted > 0
                      ? Math.round((student.totalCorrect / student.totalQuestionsAttempted) * 100)
                      : 0;
                    return (
                      <tr key={student._id} className="border-b border-[#2a2a3d] hover:bg-[#1a1a28] transition">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-[#8888aa]">@{student.username}</td>
                        <td className="py-3 px-4 text-[#8888aa]">Class {student.currentClass}</td>
                        <td className="py-3 px-4 text-center text-[#6c63ff] font-semibold">{student.totalQuestionsAttempted}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-semibold ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {accuracy}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-[#f5c842] font-semibold">🔥 {student.streak}</td>
                        <td className="py-3 px-4 text-[#8888aa] text-xs">
                          {new Date(student.lastActiveDate).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Add Video Form */}
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus size={20} /> Add NCERT Chapter Video
            </h2>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#8888aa] mb-1 block">Subject</label>
                  <select value={videoForm.subject} onChange={e => setVideoForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field w-full" required>
                    <option value="">Select Subject</option>
                    {Object.keys(NCERT_STRUCTURE).map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#8888aa] mb-1 block">Class</label>
                  <select value={videoForm.class} onChange={e => setVideoForm(prev => ({ ...prev, class: parseInt(e.target.value) }))}
                    className="input-field w-full" required>
                    {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#8888aa] mb-1 block">Chapter Name</label>
                <select value={videoForm.chapter} onChange={e => setVideoForm(prev => ({ ...prev, chapter: e.target.value }))}
                  className="input-field w-full" required disabled={chapters.length === 0}>
                  <option value="">
                    {chapters.length === 0 ? 'Select Subject & Class first' : 'Select Chapter'}
                  </option>
                  {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[#8888aa] mb-1 block">Video Title</label>
                <input type="text" value={videoForm.videoTitle} onChange={e => setVideoForm(prev => ({ ...prev, videoTitle: e.target.value }))}
                  className="input-field w-full" placeholder="e.g., French Revolution Explained" required />
              </div>
              <div>
                <label className="text-sm text-[#8888aa] mb-1 block">YouTube URL</label>
                <input type="url" value={videoForm.videoUrl} onChange={e => setVideoForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="input-field w-full" placeholder="https://www.youtube.com/watch?v=..." required />
              </div>
              <button type="submit" disabled={videoLoading || !videoForm.chapter} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {videoLoading ? <><Loader2 size={16} className="spinner" /> Adding...</> : <><Plus size={16} /> Add Video</>}
              </button>
            </form>
          </div>

          {/* Videos List */}
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">📚 Chapter Videos</h2>
            {videos.length === 0 ? (
              <p className="text-[#8888aa] text-center py-8">No videos added yet</p>
            ) : (
              <div className="space-y-3">
                {videos.map((video, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 bg-[#1a1a28] rounded-lg border border-[#2a2a3d] hover:border-[#6c63ff]/50 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-primary text-xs">{video.subject}</span>
                        <span className="badge badge-gold text-xs">Class {video.class}</span>
                      </div>
                      <h3 className="font-semibold mb-1">{video.chapter}</h3>
                      <p className="text-sm text-[#8888aa] mb-2">{video.videoTitle}</p>
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6c63ff] hover:underline flex items-center gap-1">
                        <LinkIcon size={12} /> Watch on YouTube
                      </a>
                    </div>
                    <button onClick={() => handleDeleteVideo(idx.toString())} className="text-red-400 hover:text-red-300 transition p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
