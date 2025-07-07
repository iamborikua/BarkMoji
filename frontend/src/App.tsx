import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import barkmojiLogo from './assets/barkmoji-logo.png';

const MOODS = [
  { emoji: "😤", caption: "I need attention. NOW.", mood: "demanding" },
  { emoji: "🕵️", caption: "Just heard something suspicious.", mood: "suspicious" },
  { emoji: "💅", caption: "Feeling cute, might bark at nothing later.", mood: "sassy" },
  { emoji: "🌀", caption: "Zoomies detected. Brace yourself.", mood: "chaotic" },
  { emoji: "💥", caption: "Pet me or I riot.", mood: "rebellious" },
  { emoji: "🦸", caption: "Barked so loud, even the Avengers heard it.", mood: "heroic" },
  { emoji: "🧙‍♂️", caption: "Barkus Maximus: The wizard of woofs.", mood: "magical" },
  { emoji: "🦴", caption: "Will trade secrets for treats.", mood: "scheming" },
  { emoji: "😎", caption: "Too cool to fetch.", mood: "cool" },
  { emoji: "👑", caption: "Bow down, peasants. The king has barked.", mood: "royal" },
  { emoji: "🦄", caption: "Barked at a unicorn. Again.", mood: "imaginative" },
  { emoji: "🎤", caption: "This is my Grammy moment.", mood: "dramatic" },
  { emoji: "🧟", caption: "Barked at the mailman. Again. Still suspicious.", mood: "paranoid" },
  { emoji: "🛸", caption: "Aliens? Bark first, ask questions later.", mood: "paranoid" },
  { emoji: "🍕", caption: "Heard a pizza box open. Must investigate.", mood: "hungry" },
  { emoji: "💤", caption: "Barked in my sleep. Dreaming of squirrels.", mood: "sleepy" },
  { emoji: "🎬", caption: "Oscar-worthy bark. Someone call Spielberg.", mood: "dramatic" },
  { emoji: "🦸‍♀️", caption: "Barkwoman saves the day (again).", mood: "heroic" },
  { emoji: "🧊", caption: "Cool as ice, loud as thunder.", mood: "cool" },
  { emoji: "💃", caption: "Did a little bark and a little dance.", mood: "playful" },
  // New, super funny moods:
  { emoji: "🦮", caption: "Professional squirrel chaser, amateur napper.", mood: "playful" },
  { emoji: "🧀", caption: "Heard cheese. Activated turbo bark mode.", mood: "hungry" },
  { emoji: "🦆", caption: "Barked at a duck. Duck unfazed.", mood: "confused" },
  { emoji: "🛋️", caption: "Guarding the couch. No intruders allowed.", mood: "protective" },
  { emoji: "🦹", caption: "Secretly plotting to steal socks.", mood: "scheming" },
  { emoji: "🧸", caption: "Cuddly on the outside, chaos on the inside.", mood: "chaotic" },
  { emoji: "🦔", caption: "Sniffed a hedgehog. Existential crisis ensued.", mood: "confused" },
  { emoji: "🦖", caption: "Tiny bark, big dino energy.", mood: "dramatic" },
  { emoji: "🧹", caption: "Barked at the broom. Broom won.", mood: "sassy" },
  { emoji: "🦦", caption: "Otterly confused by my own tail.", mood: "confused" },
  { emoji: "🦋", caption: "Chased a butterfly. Lost. Again.", mood: "playful" },
  { emoji: "🦚", caption: "Peacocked around the yard. Barked for applause.", mood: "dramatic" },
  { emoji: "🦨", caption: "Barked at a skunk. Immediate regret.", mood: "regretful" },
  { emoji: "🦦", caption: "Otterly ridiculous today.", mood: "silly" },
  { emoji: "🦥", caption: "Moved 2 feet. Need a nap.", mood: "sleepy" },
  { emoji: "🦝", caption: "Trash panda spotted. Bark mode: MAXIMUM.", mood: "excited" },
  { emoji: "🦑", caption: "Barked at the vacuum. It barked back.", mood: "confused" },
  { emoji: "🦚", caption: "Strutted my stuff. Barked for the paparazzi.", mood: "dramatic" },
  { emoji: "🦦", caption: "Otterly in love with my own bark.", mood: "silly" },
  { emoji: "🦦", caption: "Otterly lost in the moment.", mood: "silly" },
  { emoji: "🦦", caption: "Otterly dramatic today.", mood: "dramatic" },
  { emoji: "🦦", caption: "Otterly playful and proud.", mood: "playful" },
  { emoji: "🦦", caption: "Otterly sleepy after all that barking.", mood: "sleepy" },
  { emoji: "🦦", caption: "Otterly hungry for treats.", mood: "hungry" },
  { emoji: "🦦", caption: "Otterly sassy and loving it.", mood: "sassy" },
  { emoji: "🦦", caption: "Otterly suspicious of the mailman.", mood: "suspicious" },
  { emoji: "🦦", caption: "Otterly heroic, saved the day (again).", mood: "heroic" },
  { emoji: "🦦", caption: "Otterly cool, too cool to fetch.", mood: "cool" },
  { emoji: "🦦", caption: "Otterly regal, bow down peasants.", mood: "royal" },
  { emoji: "🦦", caption: "Otterly magical, wizard of woofs.", mood: "magical" },
  { emoji: "🦦", caption: "Otterly rebellious, pet me or I riot.", mood: "rebellious" },
  { emoji: "🦦", caption: "Otterly demanding, I need attention NOW.", mood: "demanding" },
  { emoji: "🦦", caption: "Otterly imaginative, barked at a unicorn.", mood: "imaginative" },
  { emoji: "🦦", caption: "Otterly paranoid, barked at the mailman.", mood: "paranoid" },
  { emoji: "🦦", caption: "Otterly protective, guarding the couch.", mood: "protective" },
  { emoji: "🦦", caption: "Otterly regretful, barked at a skunk.", mood: "regretful" },
  { emoji: "🦦", caption: "Otterly excited, trash panda spotted!", mood: "excited" },
  { emoji: "🦦", caption: "Otterly confused, barked at the vacuum.", mood: "confused" },
  { emoji: "🦦", caption: "Otterly dramatic, strutted for the paparazzi.", mood: "dramatic" },
];

function getRandomMood() {
  return MOODS[Math.floor(Math.random() * MOODS.length)];
}

const funFont = "font-[\'Fredoka\',_cursive]";

// Mood history type now includes date
const getToday = () => new Date().toISOString().slice(0, 10);

type MoodEntry = { emoji: string; mood: string; date: string };

// Add dog name onboarding
const getDogName = () => localStorage.getItem('barkmoji-dog-name') || '';

// Add dog breed onboarding
const getDogBreed = () => localStorage.getItem('barkmoji-dog-breed') || '';

// GlassCard component for glassmorphic UI
type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  key?: string | number;
};
function GlassCard({ children, className = "", style, key }: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-3xl shadow-xl p-6 ${className} card-fade-slide`}
      style={style}
      key={key}
    >
      {children}
    </div>
  );
}

// Update color palette to match BarkMoji logo
const logoOrange = '#F9B233';
const logoBrown = '#7A4F13';
const logoDark = '#2D1C0B';

// ConfettiBurst component
function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<any[]>([]);
  useEffect(() => {
    if (trigger) {
      // Generate 18 confetti pieces with random color/angle
      const colors = ["#F9B233", "#7A4F13", "#2D1C0B", "#FFF6E5", "#f472b6", "#60a5fa"];
      setPieces(
        Array.from({ length: 18 }, () => ({
          color: colors[Math.floor(Math.random() * colors.length)],
          left: Math.random() * 80 + 10,
          delay: Math.random() * 0.2,
          rotate: Math.random() * 360,
        }))
      );
      const timeout = setTimeout(() => setPieces([]), 900);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);
  return (
    <>{pieces.map((p, i) => (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${p.left}%`,
          top: '60%',
          background: p.color,
          transform: `rotate(${p.rotate}deg)`,
          animation: `confetti-burst 0.9s cubic-bezier(.4,0,.2,1) ${p.delay}s both`,
        }}
      />
    ))}</>
  );
}

// Update HomeButton to accept an optional 'inline' prop. If true, render as a normal button (not fixed), else keep fixed style.
function HomeButton({ onClick, inline = false }: { onClick: () => void; inline?: boolean }) {
  return (
    <button
      className={
        inline
          ? "glass-card rounded-full p-3 shadow-lg transition-all hover:scale-105 active:scale-95 a11y-focus self-center"
          : "fixed top-4 left-4 z-20 glass-card rounded-full p-3 shadow-lg transition-all hover:scale-105 active:scale-95 a11y-focus"
      }
      style={inline ? { backdropFilter: 'blur(18px) saturate(1.2)', background: 'rgba(255,255,255,0.32)', border: '1.5px solid #fff3d1' } : { backdropFilter: 'blur(18px) saturate(1.2)', background: 'rgba(255,255,255,0.32)', border: '1.5px solid #fff3d1' }}
      aria-label="Go to Home"
      onClick={onClick}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7A4F13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5L12 5l9 6.5" />
        <path d="M5 10.5V19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V10.5" />
      </svg>
    </button>
  );
}

// Helper to get last 7 days as YYYY-MM-DD
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

// Utility to capitalize first letter
function capitalizeFirst(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add profile data type
interface DogProfile {
  name: string;
  breed: string;
  age: string;
  weight: string;
  favoriteToy: string;
  favoriteTreat: string;
  personality: string;
  notes: string;
  photo: string; // base64
}

const getDogProfile = (): DogProfile => {
  const raw = localStorage.getItem('barkmoji-dog-profile');
  if (!raw) return { name: '', breed: '', age: '', weight: '', favoriteToy: '', favoriteTreat: '', personality: '', notes: '', photo: '' };
  try { return JSON.parse(raw); } catch { return { name: '', breed: '', age: '', weight: '', favoriteToy: '', favoriteTreat: '', personality: '', notes: '', photo: '' }; }
};

// SharePage component
function SharePage() {
  const { shareId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [share, setShare] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shareId) return;
    setLoading(true);
    fetch(`/api/share/${shareId}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setShare(data);
        setLoading(false);
      })
      .catch(async err => {
        let msg = 'Could not fetch share.';
        if (err.json) {
          const e = await err.json();
          msg = e.error || msg;
        }
        setError(msg);
        setLoading(false);
      });
  }, [shareId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <img src={barkmojiLogo} alt="BarkMoji logo" className="w-28 h-28 mb-4 animate-bounce-slow" />
      <p className="text-xl font-bold text-pink-600 mb-2">Generating the doggy drama...</p>
      <span className="text-4xl animate-spin-slow">🐾</span>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <img src={barkmojiLogo} alt="BarkMoji logo" className="w-28 h-28 mb-4 animate-bounce-slow" />
      <p className="text-xl font-bold text-pink-600 mb-2">{error}</p>
      <span className="text-4xl">😅</span>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <img src={barkmojiLogo} alt="BarkMoji logo" className="w-24 h-24 mb-2 drop-shadow-lg" />
      <div className="glass-card rounded-3xl p-6 shadow-xl flex flex-col items-center w-full max-w-md mb-6">
        <img src={share.imageUrl} alt="Dog mood" className="w-full max-w-xs rounded-2xl mb-4 border-4 border-yellow-100 shadow-lg" />
        <div className="text-3xl mb-2">{share.moodData?.emoji}</div>
        <div className="text-xl font-extrabold text-pink-700 mb-2 text-center">{share.name} says: {share.moodData?.caption}</div>
        <div className="text-base text-blue-700 mb-1">Breed: <span className="font-bold capitalize">{share.breed}</span></div>
        <div className="text-base text-blue-700 mb-4">Age: <span className="font-bold">{share.age}</span></div>
        <button className="button" onClick={() => {
          const a = document.createElement('a');
          a.href = share.imageUrl;
          a.download = `${share.name || 'dog'}-barkmoji.png`;
          a.click();
        }}>Download Image</button>
        <a
          className="button-secondary mt-2"
          href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20dog%20${encodeURIComponent(share.name)}'s%20BarkMoji%20mood!%20🐶%20${encodeURIComponent(share.moodData?.caption)}%20${window.location.href}`}
          target="_blank" rel="noopener noreferrer"
        >Share on Twitter/X</a>
        <a
          className="button-secondary mt-2"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank" rel="noopener noreferrer"
        >Share on Facebook</a>
        <button
          className="mt-6 bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-200 hover:from-pink-300 hover:to-blue-300 text-pink-700 font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all active:scale-95 button-press button-glow"
          onClick={() => navigate('/')}
        >
          ← Back to BarkMoji
        </button>
      </div>
    </div>
  );
}

// Main App with routing
function MainApp() {
  const [screen, setScreen] = useState<'landing' | 'record' | 'processing' | 'result'>('landing');
  const [result, setResult] = useState<{emoji: string; caption: string; mood: string} | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('barkmoji-mood-history');
    return stored ? JSON.parse(stored) : [];
  });
  const [recording, setRecording] = useState(false);
  const [barkDetected, setBarkDetected] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [processingMsg, setProcessingMsg] = useState('');

  // Animate transitions (simple fade/slide)
  const transition = "transition-all duration-500 ease-in-out";

  // Track if user is first time (show onboarding tip)
  const [showTip, setShowTip] = useState(() => {
    return !localStorage.getItem('barkmoji-onboarded');
  });
  useEffect(() => {
    if (!showTip) localStorage.setItem('barkmoji-onboarded', '1');
  }, [showTip]);

  // Simulate processing
  // 1. Remove the random mood selection in the processing effect
  // React.useEffect(() => {
  //   if (screen === 'processing') {
  //     const timeout = setTimeout(() => {
  //       const mood = getRandomMood();
  //       setResult(mood);
  //       setMoodHistory(prev => [{ emoji: mood.emoji, mood: mood.mood, date: getToday() }, ...prev].slice(0, 5));
  //       setScreen('result');
  //     }, 1500);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [screen]);

  // Clean up audio context and streams
  useEffect(() => {
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Reset barkDetected when returning to record screen
  useEffect(() => {
    if (screen === 'record') {
      setBarkDetected(false);
    }
  }, [screen]);

  // Persist moodHistory to localStorage
  useEffect(() => {
    localStorage.setItem('barkmoji-mood-history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Bark detection logic (now with pitch/frequency analysis)
  const startRecording = async () => {
    setMicError(null);
    setBarkDetected(false);
    setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.fftSize);
      let barkFound = false;
      let barkPitch = 0;
      let barkVolume = 0;
      let barkStart = 0;
      let barkEnd = 0;
      let lastAboveThreshold = 0;
      const THRESHOLD = 0.13; // Bark volume threshold
      const MIN_BARK_DURATION = 80; // ms
      const MAX_BARK_DURATION = 800; // ms
      const BARK_FREQ_MIN = 250; // Hz
      const BARK_FREQ_MAX = 1200; // Hz
      const sampleRate = audioContext.sampleRate;

      function autoCorrelate(buf: Uint8Array, sampleRate: number) {
        // Basic autocorrelation for pitch detection
        let SIZE = buf.length;
        let rms = 0;
        for (let i = 0; i < SIZE; i++) {
          let val = (buf[i] - 128) / 128;
          rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1;
        let r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for (let i = 0; i < SIZE / 2; i++) {
          if (Math.abs((buf[i] - 128) / 128) < thres) { r1 = i; break; }
        }
        for (let i = 1; i < SIZE / 2; i++) {
          if (Math.abs((buf[SIZE - i] - 128) / 128) < thres) { r2 = SIZE - i; break; }
        }
        buf = buf.slice(r1, r2);
        SIZE = buf.length;
        let c = new Array(SIZE).fill(0);
        for (let i = 0; i < SIZE; i++) {
          for (let j = 0; j < SIZE - i; j++) {
            c[i] = c[i] + ((buf[j] - 128) / 128) * ((buf[j + i] - 128) / 128);
          }
        }
        let d = 0; while (c[d] > c[d + 1]) d++;
        let maxval = -1, maxpos = -1;
        for (let i = d; i < SIZE; i++) {
          if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
        }
        let T0 = maxpos;
        if (T0 === 0) return -1;
        return sampleRate / T0;
      }

      const checkVolume = () => {
        analyser.getByteTimeDomainData(dataArray);
        // Calculate RMS (root mean square) volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        // Only analyze if above threshold
        if (rms > THRESHOLD) {
          if (!barkFound) {
            barkStart = performance.now();
            barkFound = true;
            // Estimate pitch
            const pitch = autoCorrelate(dataArray, sampleRate);
            barkPitch = pitch;
            barkVolume = rms;
          }
          lastAboveThreshold = performance.now();
        } else {
          if (barkFound && (performance.now() - lastAboveThreshold > 40)) {
            barkEnd = performance.now();
            const duration = barkEnd - barkStart;
            // Bark must be short and in dog pitch range
            if (
              duration > MIN_BARK_DURATION &&
              duration < MAX_BARK_DURATION &&
              barkPitch > BARK_FREQ_MIN &&
              barkPitch < BARK_FREQ_MAX
            ) {
              setBarkDetected(true);
              setProcessingMsg(`Sniffing the air... Reading ${capitalizeFirst(dogName) ? capitalizeFirst(dogName) + "'s" : "your dog's"} bark and decoding the doggy drama!`);
              setScreen('processing');
              setTimeout(() => {
                stopRecording();
                // Mood rules: high pitch = playful, low pitch = warning, mid = sassy
                let moodType = 'chaotic';
                if (barkPitch > 800) moodType = 'playful';
                else if (barkPitch < 400) moodType = 'suspicious';
                else if (barkVolume > 0.2) moodType = 'rebellious';
                else moodType = 'sassy';
                // Pick a random mood from that type, fallback to any
                const filtered = MOODS.filter(m => m.mood === moodType);
                const mood = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : getRandomMood();
                setResult(mood);
                setMoodHistory(prev => [{ emoji: mood.emoji, mood: mood.mood, date: getToday() }, ...prev].slice(0, 5));
                setScreen('result');
              }, 2000);
              return;
            } else {
              // Not a bark: just reset and keep listening
              barkFound = false;
            }
          }
        }
        rafRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err) {
      setMicError('Microphone not available or permission denied.');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    if (audioContextRef.current) audioContextRef.current.close();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  // For UI: filter today's moods, get last 3, and calculate average
  const today = getToday();
  const todaysMoods = moodHistory.filter(m => m.date === today).slice(0, 3);
  const moodCount: Record<string, { count: number; emoji: string }> = {};
  todaysMoods.forEach(m => {
    if (!moodCount[m.mood]) moodCount[m.mood] = { count: 0, emoji: m.emoji };
    moodCount[m.mood].count++;
  });
  let avgMood = null;
  if (todaysMoods.length > 0) {
    const sorted = Object.entries(moodCount).sort((a, b) => b[1].count - a[1].count);
    avgMood = { mood: sorted[0][0], emoji: sorted[0][1].emoji };
  }

  // Add dog name onboarding
  const [dogName, setDogName] = useState(getDogName());
  const [dogBreed, setDogBreed] = useState(getDogBreed());
  const [showOnboarding, setShowOnboarding] = useState(!getDogName() || !getDogBreed());
  const [nameInput, setNameInput] = useState('');
  const [breedInput, setBreedInput] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(1);

  // Save dog name and breed to localStorage and state
  const handleSetDogName = () => {
    if (nameInput.trim()) {
      const capName = capitalizeFirst(nameInput.trim());
      localStorage.setItem('barkmoji-dog-name', capName);
      setDogName(capName);
      setOnboardingStep(2);
    }
  };
  const handleSetDogBreed = () => {
    if (breedInput.trim()) {
      localStorage.setItem('barkmoji-dog-breed', breedInput.trim());
      setDogBreed(breedInput.trim());
      setShowOnboarding(false);
    }
  };
  // Change dog name or breed
  const handleChangeDogName = () => {
    localStorage.removeItem('barkmoji-dog-name');
    localStorage.removeItem('barkmoji-dog-breed');
    setDogName('');
    setDogBreed('');
    setShowOnboarding(true);
    setNameInput('');
    setBreedInput('');
    setOnboardingStep(1);
  };

  // Add at the top:
  const [emojiPopIndexes, setEmojiPopIndexes] = useState<number[]>([]);
  useEffect(() => {
    // When today's moods change, trigger pop animation for each
    setEmojiPopIndexes(todaysMoods.map((_, i) => i));
    const timeout = setTimeout(() => setEmojiPopIndexes([]), 600);
    return () => clearTimeout(timeout);
  }, [todaysMoods.length]);

  // In the main App function, after other hooks:
  const [showConfetti] = useState(false);

  // Add state for weekly report modal
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  // Add state for profile
  const [showProfile, setShowProfile] = useState(false);
  const [dogProfile, setDogProfile] = useState<DogProfile>(getDogProfile());
  const [profileEdit, setProfileEdit] = useState<DogProfile>(dogProfile);

  // Handle profile field change
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileEdit(prev => ({ ...prev, [name]: value }));
  };
  // Handle photo upload
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setProfileEdit(prev => ({ ...prev, photo: ev.target?.result as string || '' }));
    };
    reader.readAsDataURL(file);
  };
  // Save profile
  const saveProfile = () => {
    setDogProfile(profileEdit);
    localStorage.setItem('barkmoji-dog-profile', JSON.stringify(profileEdit));
    setShowProfile(false);
  };
  // Cancel edit
  const cancelProfile = () => {
    setProfileEdit(dogProfile);
    setShowProfile(false);
  };

  // Add state for share loading and error
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');
  const navigate = useNavigate();

  // Share handler
  const handleShare = async () => {
    if (!result) return;
    setShareLoading(true);
    setShareError('');
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dogName,
          breed: dogBreed || 'breed n/a',
          age: dogProfile?.age || '',
          mood: result.mood,
          moodData: result
        })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Share failed');
      const data = await res.json();
      navigate(`/share/${data.shareId}`);
    } catch (err: any) {
      setShareError(err.message || 'Share failed. Try again!');
    } finally {
      setShareLoading(false);
    }
  };

  // Add state for average mood share loading
  const [avgShareLoading, setAvgShareLoading] = useState(false);

  // Main screens
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: "transparent" }}>
      {/* Animated, pulsating gradient background (base layer) */}
      <div className="fixed inset-0 -z-20 animate-pulse-gradient bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-100" />
      {/* Main app content, ensure z-index > 0 for all content */}
      <div className="relative z-10">
        <div className={`min-h-screen flex flex-col items-center justify-between ${funFont} px-4 pt-8 pb-8 relative`}>  
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <span className="absolute left-8 top-10 text-4xl paw-float-1">🐾</span>
            <span className="absolute right-10 top-1/3 text-3xl paw-float-2">🐾</span>
            <span className="absolute left-1/4 bottom-10 text-5xl paw-float-3">🐾</span>
            <span className="absolute right-1/4 bottom-20 text-2xl paw-float-4">🐾</span>
          </div>
          {/* Onboarding Screen */}
          {showOnboarding && (
            <div className="flex flex-col items-center justify-center min-h-screen w-full">
              <GlassCard key={onboardingStep} className="w-full max-w-sm flex flex-col items-center gap-4 card-fade-slide">
                <div className="flex flex-col items-center w-full mb-2">
                  <img src={barkmojiLogo} alt="BarkMoji logo" className="w-36 h-36 mb-2 drop-shadow-lg animate-bounce-slow" />
                  <p className="text-xl text-center font-extrabold mb-6" style={{ color: logoBrown, fontFamily: 'Fredoka, cursive', letterSpacing: '0.01em' }}>
                    Turn your dog's bark into a fun emoji mood and caption!
                  </p>
                </div>
                {onboardingStep === 1 && (
                  <>
                    <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow" style={{ color: logoBrown }}>
                      What's your dog's name?
                    </h2>
                    <input
                      className="mt-2 mb-4 px-4 py-3 rounded-full border-2 border-pink-200 text-lg text-center focus:outline-none focus:border-pink-400 bg-white/80 shadow"
                      type="text"
                      placeholder="e.g. Bella"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      maxLength={18}
                      autoFocus
                    />
                    <button
                      className="bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-200 hover:from-pink-400 hover:to-blue-300 text-pink-700 font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all active:scale-95 button-press button-glow"
                      onClick={handleSetDogName}
                      disabled={!nameInput.trim()}
                    >
                      Next
                    </button>
                  </>
                )}
                {onboardingStep === 2 && (
                  <>
                    <h2 className="text-3xl font-extrabold text-blue-400 mb-2 text-center drop-shadow">What breed is {capitalizeFirst(nameInput) || capitalizeFirst(dogName)}?</h2>
                    <input
                      className="mt-2 mb-4 px-4 py-3 rounded-full border-2 border-blue-200 text-lg text-center focus:outline-none focus:border-blue-400 bg-white/80 shadow"
                      type="text"
                      placeholder="e.g. golden retriever"
                      value={breedInput}
                      onChange={e => setBreedInput(e.target.value)}
                      maxLength={24}
                      autoFocus
                    />
                    <button
                      className="bg-gradient-to-r from-blue-200 via-yellow-200 to-pink-200 hover:from-blue-300 hover:to-pink-300 text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all active:scale-95 button-press button-glow"
                      onClick={handleSetDogBreed}
                      disabled={!breedInput.trim()}
                    >
                      Let's go!
                    </button>
                  </>
                )}
              </GlassCard>
            </div>
          )}
          {/* Main Content */}
          {!showOnboarding && (
            <>
            <div className="flex flex-col items-center w-full flex-1 justify-center">
              {/* Landing Page */}
              {screen === 'landing' && (
                <GlassCard key="landing" className="w-full max-w-md flex flex-col items-center gap-4 mt-8 mb-8 mx-auto card-fade-slide">
                  <img
                    src={barkmojiLogo}
                    alt="BarkMoji logo"
                    className="w-36 h-36 animate-bounce-slow drop-shadow-lg"
                  />
                  <p className="text-xl" style={{ color: logoBrown }}>Turn {capitalizeFirst(dogName) ? `${capitalizeFirst(dogName)}'s` : "your dog's"} bark into an emoji mood.</p>
                  {showTip && (
                    <div className="bg-white/70 rounded-xl px-5 py-3 mb-2 text-blue-700 text-center text-base shadow animate-pop">
                      <span role="img" aria-label="tip">💡</span> Tap the mic and let your dog bark!<br/>
                      <button className="mt-2 text-pink-500 underline text-sm" onClick={() => setShowTip(false)}>Got it!</button>
                    </div>
                  )}
                  <button
                    className="w-full max-w-xs font-extrabold py-4 rounded-full shadow-xl text-2xl transition-all active:scale-95 button-press button-glow mb-2 mt-2"
                    style={{
                      background: `linear-gradient(90deg, ${logoOrange} 0%, #fff3d1 100%)`,
                      color: logoDark
                    }}
                    onClick={() => setScreen('record')}
                  >
                    Start BarkMoji-ing
                  </button>
                  <div className="flex flex-col gap-3 w-full mt-4 mb-2">
                    <button
                      className="button button-secondary flex items-center justify-center gap-2 w-full max-w-xs mx-auto text-lg font-bold py-3 px-6 rounded-full shadow"
                      style={{ color: logoBrown, borderColor: logoOrange, background: 'rgba(255,255,255,0.85)' }}
                      onClick={handleChangeDogName}
                      aria-label="Change dog's name"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ color: logoOrange }}>edit</span>
                      Change dog's name
                    </button>
                    <button
                      className="button button-secondary flex items-center justify-center gap-2 w-full max-w-xs mx-auto text-lg font-bold py-3 px-6 rounded-full shadow"
                      style={{ color: logoBrown, borderColor: logoOrange, background: 'rgba(255,255,255,0.85)' }}
                      onClick={() => setShowProfile(true)}
                      aria-label="View or edit dog profile"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ color: logoOrange }}>pets</span>
                      View/Edit Dog Profile
                    </button>
                  </div>
                </GlassCard>
              )}
            </div>
            {/* Today's Moods Card at the bottom */}
            {screen === 'landing' && todaysMoods.length > 0 && (
              <GlassCard key="todays-moods" className="w-full max-w-md text-center mb-2 mt-4 flex flex-col items-center gap-4 mx-auto card-fade-slide" style={{ borderColor: logoOrange }}>
                <h3 className="text-xl font-bold mb-1" style={{ color: logoBrown }}>Today's Moods</h3>
                {/* Emoji bubble timeline */}
                <div className="flex flex-row justify-center gap-4 w-full mb-1">
                  {todaysMoods.map((m, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full bg-white/60 backdrop-blur-md border-2 flex items-center justify-center text-2xl shadow emoji-wiggle ${emojiPopIndexes.includes(i) ? 'emoji-pop' : ''}`} style={{ borderColor: logoOrange }}>
                        {m.emoji}
                      </div>
                      <span className="mt-2 px-3 py-1 rounded-full font-bold text-xs shadow-sm capitalize" style={{ background: '#fff3d1', color: logoBrown }}>{m.mood}</span>
                    </div>
                  ))}
                </div>
                {/* Average mood badge */}
                {avgMood && (
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-3xl mb-1">👑</span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-lg shadow capitalize" style={{ background: logoOrange, color: logoDark }}>
                      {avgMood.emoji} {avgMood.mood}
                    </span>
                    <span className="text-sm mt-1" style={{ color: logoBrown, opacity: 0.7 }}>Average Mood Today</span>
                    <button
                      className="mt-3 flex items-center gap-2 bg-gradient-to-r from-yellow-200 via-pink-100 to-blue-200 hover:from-yellow-300 hover:to-blue-300 text-yellow-800 font-bold py-2 px-5 rounded-full shadow transition-all active:scale-95 button-press button-glow"
                      onClick={async () => {
                        if (avgShareLoading) return;
                        setAvgShareLoading(true);
                        try {
                          const res = await fetch('/api/share', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: dogName,
                              breed: dogBreed || 'breed n/a',
                              age: dogProfile?.age || '',
                              mood: avgMood.mood,
                              moodData: avgMood
                            })
                          });
                          if (!res.ok) throw new Error((await res.json()).error || 'Share failed');
                          const data = await res.json();
                          navigate(`/share/${data.shareId}`);
                        } catch (err) {
                          alert('Failed to share average mood. Try again!');
                        } finally {
                          setAvgShareLoading(false);
                        }
                      }}
                      aria-label="Share average mood today"
                      disabled={avgShareLoading}
                    >
                      <svg width="22" height="22" fill="none" stroke="#7A4F13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      {avgShareLoading ? 'Sharing...' : 'Share'}
                    </button>
                  </div>
                )}
                <div className="w-full flex flex-col items-center mt-4">
                  <button
                    className="bg-gradient-to-r from-orange-200 via-yellow-100 to-pink-100 hover:from-orange-300 hover:to-pink-200 text-orange-900 font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all active:scale-95 button-press button-glow"
                    onClick={() => setShowWeeklyReport(true)}
                  >
                    📅 Weekly Mood Report
                  </button>
                </div>
              </GlassCard>
            )}
            {/* Record Screen */}
            {screen === 'record' && (
              <GlassCard key="record" className={`flex flex-col items-center justify-center min-h-screen w-full ${transition} opacity-100 card-fade-slide`}>
                <HomeButton onClick={() => setScreen('landing')} inline />
                <h2 className="text-3xl font-extrabold text-blue-400 mb-6 mt-4 text-center drop-shadow">Let's hear that bark{capitalizeFirst(dogName) ? `, ${capitalizeFirst(dogName)}` : ""}! <span role="img" aria-label="dog mic">🐶🎤</span></h2>
                <div className="relative flex flex-col items-center justify-center mb-8">
                  {barkDetected && (
                    <span className="mb-4 text-pink-600 font-extrabold text-2xl drop-shadow-[0_2px_6px_white] animate-pop z-10">Bark detected!</span>
                  )}
                  <button
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex items-center justify-center shadow-xl text-6xl border-4 border-pink-300 focus:outline-none transition-all active:scale-95 button-press button-glow`}
                    onClick={recording ? undefined : startRecording}
                    aria-label="Record Bark"
                    disabled={recording}
                  >
                    <span className="material-symbols-outlined text-pink-700 text-6xl">
                      {recording ? 'stop_circle' : 'mic'}
                    </span>
                  </button>
                  {recording && !barkDetected && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-blue-400 animate-pulse text-lg">Listening…</span>
                  )}
                </div>
                {micError && <div className="text-red-500 text-center mt-2">{micError}</div>}
              </GlassCard>
            )}
            {/* Processing Screen */}
            {screen === 'processing' && (
              <GlassCard key="processing" className="flex flex-col items-center justify-center min-h-screen w-full card-fade-slide">
                <span className="text-7xl animate-wag-tail mb-6">🐶</span>
                <h2 className="text-2xl font-extrabold text-center mb-4" style={{ color: logoBrown }}>{processingMsg}</h2>
                <div className="flex flex-row gap-2 mt-2 animate-pulse">
                  <span className="text-3xl paw-float-1">🐾</span>
                  <span className="text-3xl paw-float-2">🐾</span>
                  <span className="text-3xl paw-float-3">🐾</span>
                </div>
              </GlassCard>
            )}
            {/* Result Screen */}
            {screen === 'result' && result && (
              <GlassCard key="result" className={`flex flex-col items-center justify-center min-h-screen w-full ${transition} opacity-100 card-fade-slide`}>
                <div className="w-full flex flex-col items-center" style={{ marginBottom: '-1.5rem' }}>
                  <div style={{ marginBottom: '2.5rem', marginTop: '0.5rem' }}>
                    <HomeButton onClick={() => setScreen('landing')} inline />
                  </div>
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 via-pink-100 to-blue-200 flex items-center justify-center mb-6 shadow-lg animate-pop mood-emoji-pop">
                    <span className="text-7xl">{result.emoji}</span>
                  </div>
                </div>
                <p className="text-2xl text-pink-600 font-extrabold mb-4 text-center drop-shadow-lg mood-caption-fade">{capitalizeFirst(dogName) ? `${capitalizeFirst(dogName)} says: ` : ''}{result.caption}</p>
                <div className="text-blue-500 text-base mb-4">Breed: <span className="font-bold capitalize">{capitalizeFirst(dogBreed)}</span></div>
                <div className="flex flex-col items-center w-full mb-8">
                  <button
                    className="bg-gradient-to-r from-yellow-200 via-pink-100 to-blue-200 hover:from-yellow-300 hover:to-blue-300 text-yellow-800 font-bold py-2 px-6 rounded-full shadow text-lg transition-all active:scale-95 button-press button-glow mb-4"
                    onClick={handleShare}
                    disabled={shareLoading}
                  >
                    {shareLoading ? 'Generating Share...' : 'Share this Mood!'}
                  </button>
                  {shareError && <div className="text-pink-600 font-bold mt-2">{shareError} 🐾</div>}
                  <button
                    className="bg-gradient-to-r from-blue-200 via-yellow-200 to-pink-200 hover:from-blue-300 hover:to-pink-300 text-blue-700 font-bold py-2 px-6 rounded-full shadow text-lg transition-all active:scale-95 button-press button-glow"
                    onClick={() => setScreen('landing')}
                  >
                    Go back
                  </button>
                </div>
                <ConfettiBurst trigger={showConfetti} />
              </GlassCard>
            )}
            </>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }
        @keyframes pop { 0% { transform: scale(0.7); opacity: 0.5; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        .animate-pop { animation: pop 0.5s; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 #f472b6; } 50% { box-shadow: 0 0 30px 10px #f472b6; } }
        .animate-pulse-glow { animation: pulse-glow 1.2s infinite; }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 1.5s linear infinite; }
        @keyframes gradient-move { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient-move { background-size: 200% 200%; animation: gradient-move 8s ease-in-out infinite; }
        @keyframes wag-tail { 0%, 100% { transform: rotate(-18deg); } 50% { transform: rotate(18deg); } }
        .animate-wag-tail { animation: wag-tail 1.2s infinite; }
        @keyframes float-paw { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-float-paw { animation: float-paw 4s ease-in-out infinite; }
        @keyframes float-paw2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-float-paw2 { animation: float-paw2 5s ease-in-out infinite; }
        @keyframes float-paw3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        .animate-float-paw3 { animation: float-paw3 6s ease-in-out infinite; }
        @keyframes float-paw4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .animate-float-paw4 { animation: float-paw4 7s ease-in-out infinite; }
        @keyframes pulse-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-pulse-gradient {
          background-size: 200% 200%;
          animation: pulse-gradient 12s ease-in-out infinite;
        }
      `}</style>
      {/* Google Fonts: Fredoka */}
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&display=swap" rel="stylesheet" />
      {/* Material Symbols for mic/stop icons */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

      {showWeeklyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full relative flex flex-col items-center p-8 shadow-2xl" style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid #fff3d1', backdropFilter: 'blur(18px) saturate(1.2)' }}>
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-pink-400 transition"
              onClick={() => setShowWeeklyReport(false)}
              aria-label="Close weekly report"
            >
              ×
        </button>
            <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2" style={{ color: '#7A4F13', fontFamily: 'Fredoka, cursive' }}>
              <span>📅</span> Weekly Mood Report
            </h2>
            {/* Weekly mood summary */}
            <div className="w-full mb-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: logoOrange, fontFamily: 'Fredoka, cursive' }}>Last 7 Days</h3>
              <div className="flex flex-col gap-3">
                {getLast7Days().map(date => {
                  const moods = moodHistory.filter(m => m.date === date);
                  return (
                    <div key={date} className="flex flex-col sm:flex-row sm:items-center gap-2 text-base">
                      <span className="w-24 font-mono text-xs sm:text-sm" style={{ minWidth: '5.5rem', color: '#7A4F13', opacity: 0.85 }}>{date}</span>
                      <div className="flex flex-wrap gap-2 mt-1 sm:mt-0 w-full overflow-x-auto px-1">
                        {moods.length > 0 ? (
                          moods.map((m, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full shadow glass-card font-bold text-sm" style={{ background: 'rgba(249,178,51,0.13)', border: `1.5px solid ${logoOrange}`, color: '#7A4F13', fontFamily: 'Fredoka, cursive' }}>
                              {m.emoji} {m.mood}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-xs" style={{ color: '#7A4F13', opacity: 0.5 }}>No data</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Comic and summary will go here */}
            <div className="text-center mt-4" style={{ color: '#7A4F13', opacity: 0.7, fontFamily: 'Fredoka, cursive' }}>(Comic coming soon!)</div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 items-center glass-card profile-modal-card" style={{ background: 'rgba(255,255,255,0.92)', border: '1.5px solid #fff3d1', boxShadow: '0 8px 32px 0 rgba(41, 30, 10, 0.13)' }}>
            <h2 className="text-2xl font-extrabold mb-2 text-center" style={{ color: logoBrown, fontFamily: 'Fredoka, cursive', letterSpacing: '0.01em', textShadow: '0 2px 8px #fff6e5cc' }}>
              {(profileEdit.name || dogName) ? `${capitalizeFirst(profileEdit.name || dogName)}'s Profile` : 'Dog Profile'}
            </h2>
            <div className="flex flex-col items-center w-full gap-3 max-w-sm mx-auto">
              <label className="w-28 h-28 rounded-full bg-white/70 border-2 border-pink-200 flex items-center justify-center overflow-hidden shadow mb-2 cursor-pointer hover:border-pink-400 transition profile-modal-img">
                {profileEdit.photo ? (
                  <img src={profileEdit.photo} alt="Dog" className="object-cover w-full h-full border-4 border-white/80 shadow-lg rounded-full" style={{ boxShadow: '0 4px 18px 0 #f472b655' }} />
                ) : (
                  <span className="text-5xl text-pink-300">🐶</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <input name="name" value={profileEdit.name} onChange={handleProfileChange} placeholder="Name" className="input-profile" maxLength={18} />
              <input name="breed" value={profileEdit.breed} onChange={handleProfileChange} placeholder="Breed" className="input-profile" maxLength={24} />
              <input name="age" value={profileEdit.age} onChange={handleProfileChange} placeholder="Age" className="input-profile" maxLength={8} />
              <input name="weight" value={profileEdit.weight} onChange={handleProfileChange} placeholder="Weight (lbs/kg)" className="input-profile" maxLength={8} />
              <input name="favoriteToy" value={profileEdit.favoriteToy} onChange={handleProfileChange} placeholder="Favorite Toy" className="input-profile" maxLength={24} />
              <input name="favoriteTreat" value={profileEdit.favoriteTreat} onChange={handleProfileChange} placeholder="Favorite Treat" className="input-profile" maxLength={24} />
              <input name="personality" value={profileEdit.personality} onChange={handleProfileChange} placeholder="Personality" className="input-profile" maxLength={32} />
              <textarea name="notes" value={profileEdit.notes} onChange={handleProfileChange} placeholder="Notes" className="input-profile" rows={2} maxLength={64} />
            </div>
            <div className="flex flex-row justify-center gap-4 mt-6 w-full">
              <button type="button" className="profile-modal-btn-save" onClick={saveProfile}>Save</button>
              <button type="button" className="profile-modal-btn-cancel" onClick={cancelProfile}>Cancel</button>
            </div>
          </GlassCard>
        </div>
      )}
      </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/share/:shareId" element={<SharePage />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}
