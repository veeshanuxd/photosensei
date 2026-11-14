import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, useNavigate, useLocation } from 'react-router';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { ChevronLeft, Upload, Camera, Settings, Share, Grid3X3, Compass, BookOpen, BarChart3, CheckCircle, Lightbulb, Target, Users, Award, GraduationCap, Bell, Plus, ChevronRight, Zap, Star, Eye, Trash2 } from 'lucide-react';
import { 
  ScoreCard, 
  GenreChip, 
  LearningCard, 
  UploadBox, 
  AnalysisProgress, 
  OverallScore, 
  DrillCard, 
  SettingsToggle, 
  CritiqueCard, 
  OverlayButton,
  ThemeToggle,
  ExportCard,
  EmptyState,
  ErrorState,
  RadialScore,
  SegmentedTabs,
  SidePanelOverlays,
  ProgressInsightCard,
  StreakTracker,
  MiniTimelineChart,
  UserProfile,
  AdaptiveFeedback,
  LiveShootMode,
  LiveSessionCard,
  GenreModuleCard,
  GenreSelector,
  GenreBadge,
  DualScoreMeter,
  CommunityFeedbackCard,
  CommunityPostCard,
  ShareToCommunityDialog,
  EXIFInsightPanel,
  MicroLessonCard,
  BadgeCard,
  CertificationPathCard,
  ReflectionPromptCard,
  CertificatePreview,
  BottomTabBar,
  StatusBar,
  AnimatedScore,
  QuickActionCard,
  CritiqueRadarChart,
  CritiqueBarChart
} from './components/photosensei';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

type Screen = 'splash' | 'onboarding' | 'home' | 'home-empty' | 'loading' | 'loading-error' | 'upload-error' | 'result-a' | 'result-b' | 'details-a' | 'details-b' | 'overlays-a' | 'overlays-b' | 'learning' | 'learning-empty' | 'practice' | 'practice-empty' | 'settings' | 'export' | 'export-error' | 'missing-exif' | 'progress' | 'live-shoot' | 'live-session' | 'community' | 'community-post' | 'share-community' | 'learning-journey' | 'certification-path';

// Screens that should show the bottom tab bar
const TAB_BAR_SCREENS = new Set<Screen>(['home', 'home-empty', 'community', 'learning-journey', 'progress', 'settings', 'learning', 'practice', 'certification-path']);
// Screens that need no status bar
const NO_STATUS_BAR_SCREENS = new Set<Screen>(['splash', 'live-shoot']);

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

const classifyPhotoGenre = (filename: string, exif: { focalLength: string; aperture: string }) => {
  const name = filename.toLowerCase();
  if (name.includes('group') || name.includes('screenshot') || name.includes('friends') || name.includes('people') || name.includes('crowd')) {
    return 'People';
  }
  if (name.includes('nature') || name.includes('mountain') || name.includes('lake') || name.includes('sunset') || name.includes('sunrise') || name.includes('landscape') || name.includes('sea') || name.includes('river')) {
    return 'Nature';
  }
  if (name.includes('street') || name.includes('city') || name.includes('urban') || name.includes('road') || name.includes('car')) {
    return 'Street';
  }
  if (name.includes('food') || name.includes('plate') || name.includes('dish') || name.includes('coffee') || name.includes('cafe')) {
    return 'Food';
  }
  if (name.includes('animal') || name.includes('bird') || name.includes('wildlife') || name.includes('cat') || name.includes('dog') || name.includes('zoo')) {
    return 'Wildlife';
  }
  if (name.includes('building') || name.includes('architecture') || name.includes('house') || name.includes('temple') || name.includes('monument')) {
    return 'Architecture';
  }
  
  const focal = parseFloat(exif.focalLength) || 50;
  if (focal >= 150) return 'Wildlife';
  if (focal <= 24) return 'Nature';
  return 'Portrait';
};

const simulateCritique = (exif: { aperture: string; shutter: string; iso: string; focalLength: string }, genre: string, isGroupPhoto: boolean = false) => {
  let framing = 85;
  let composition = 83;
  let lighting = 80;
  let exposure = 82;
  const works: Array<{ title: string; content: string }> = [];
  const improve: Array<{ title: string; content: string }> = [];
  const reshoot: Array<{ title: string; content: string }> = [];

  const apertureVal = parseFloat(exif.aperture.replace('f/', '')) || 4.0;
  const isoVal = parseInt(exif.iso) || 400;
  
  let shutterVal = 125;
  if (exif.shutter.includes('/')) {
    shutterVal = parseInt(exif.shutter.split('/')[1]) || 125;
  } else {
    shutterVal = 1 / (parseFloat(exif.shutter) || 1);
  }
  
  const focalVal = parseFloat(exif.focalLength) || 85;

  if (isGroupPhoto) {
    // Group Portrait specialized critique logic
    if (apertureVal <= 2.8) {
      composition -= 15;
      improve.push({ 
        title: 'Aperture Too Wide (Shallow DoF)', 
        content: `Your aperture of ${exif.aperture} is too wide for a group portrait. With people aligned in layers, a shallow depth of field leaves some faces blurry. Use f/4.0 or f/5.6 to deepen the focus plane.` 
      });
      reshoot.push({ 
        title: 'Close Aperture to f/4.0', 
        content: 'Stop down to f/4.0 or f/5.6 so that every person from the front row to the back row is in sharp focus.' 
      });
    } else {
      composition += 5;
      works.push({ 
        title: 'Optimal Depth of Field', 
        content: `Excellent aperture choice of ${exif.aperture} for a group photo. This keeps all faces sharp while maintaining nice detail resolution.` 
      });
    }

    if (shutterVal < 200) {
      exposure -= 8;
      improve.push({ 
        title: 'Slow Shutter for Expressions', 
        content: `At ${exif.shutter}, any subject movement or laughter will introduce motion blur. Use a faster shutter speed like 1/200s or 1/250s for group candids.` 
      });
      reshoot.push({ 
        title: 'Increase Shutter to 1/250s', 
        content: 'Speed up your shutter to freeze smiles and gestures cleanly without hand shake or subject blur.' 
      });
    } else {
      exposure += 5;
      works.push({ 
        title: 'Candid Motion Frozen', 
        content: `Shutter speed of ${exif.shutter} is fast enough to freeze laughter and movement in a group portrait.` 
      });
    }

    works.push({ 
      title: 'Horizontal Alignment', 
      content: 'Group members are distributed evenly across the horizontal plane, filling the frame in a balanced composition.' 
    });
  } else if (genre === 'Landscape') {
    if (apertureVal >= 8.0 && apertureVal <= 16.0) {
      composition += 5;
      works.push({ title: 'Sharp Depth of Field', content: `Aperture ${exif.aperture} keeps both foreground elements and background vistas tack sharp.` });
    } else {
      composition -= 10;
      improve.push({ title: 'Too Wide Aperture', content: `Using ${exif.aperture} yields too shallow focus depth. Try f/8 or f/11 next time for a clean landscape focus plane.` });
      reshoot.push({ title: 'Aperture at f/8', content: 'Stop down to f/8 to get full detail depth across the scene.' });
    }

    if (isoVal <= 200) {
      exposure += 5;
      works.push({ title: 'Dynamic Range Optimized', content: `ISO ${exif.iso} ensures deep shadow recovery and no digital highlight clipping.` });
    } else {
      exposure -= 8;
      improve.push({ title: 'High Digital Noise', content: `ISO ${exif.iso} introduces sensor grain. Reduce ISO to 100 on a tripod for landscapes.` });
    }
  } else {
    if (apertureVal <= 2.8) {
      framing += 5;
      works.push({ title: 'Excellent bokeh separation', content: `Aperture ${exif.aperture} blurs details behind the subject for visual isolation.` });
    } else {
      composition -= 5;
      improve.push({ title: 'Distracting background details', content: `Aperture ${exif.aperture} leaves details sharp in the background. Open to f/2.8 for better portrait focus.` });
      reshoot.push({ title: 'Open aperture to f/2.8', content: 'Open the aperture to isolate the face with soft backdrop details.' });
    }

    if (shutterVal < focalVal) {
      exposure -= 10;
      improve.push({ title: 'Camera Shake Risk', content: `Shutter ${exif.shutter} is slower than your reciprocal focal length (${exif.focalLength}). Use a faster shutter to avoid blur.` });
      reshoot.push({ title: 'Faster Shutter Speed', content: `Increase shutter speed to 1/${Math.round(focalVal * 1.5)}s or faster.` });
    } else {
      exposure += 5;
      works.push({ title: 'Steady Capture Speed', content: `Shutter ${exif.shutter} is fast enough to ensure sharp details handheld with a ${exif.focalLength} lens.` });
    }
  }

  framing = Math.max(40, Math.min(98, framing));
  composition = Math.max(40, Math.min(98, composition));
  lighting = Math.max(40, Math.min(98, lighting));
  exposure = Math.max(40, Math.min(98, exposure));
  const overallScore = Math.round((framing + composition + lighting + exposure) / 4);

  return {
    overallScore,
    scores: { framing, composition, lighting, exposure },
    works: works.length > 0 ? works : [{ title: 'Balanced Composition', content: 'Good overall framing and alignment of subject details.' }],
    improve: improve.length > 0 ? improve : [{ title: 'Lighting Contrast', content: 'Consider adjusting angles relative to light source to avoid flat lighting.' }],
    reshoot: reshoot.length > 0 ? reshoot : [{ title: 'Refine Frame Position', content: 'Take a step left to align elements closer to third intersections.' }],
    genreAdvice: isGroupPhoto 
      ? `Group Portrait Mode: Critical photography basics: Aperture should be stopped down (f/4.0+) to expand depth-of-field, and shutter speed kept fast (1/200s+) to freeze multiple subjects.`
      : `Reviewed EXIF data: Aperture ${exif.aperture}, Shutter ${exif.shutter}, ISO ${exif.iso}, Focal Length ${exif.focalLength}.`,
    genreMetrics: isGroupPhoto
      ? [
          { label: 'Focus Depth & Sharpness', score: composition },
          { label: 'Expression Freeze', score: exposure }
        ]
      : [
          { label: 'Technical Accuracy', score: overallScore },
          { label: 'Settings Synergy', score: Math.round((exposure + composition) / 2) }
        ]
  };
};

function MainApp() {
  const navigateRouter = useNavigate();
  const location = useLocation();
  const path = location.pathname.substring(1);
  const currentScreen = (path || 'splash') as Screen;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    // Initialize theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const [currentPhoto, setCurrentPhoto] = useState<string>("https://images.unsplash.com/photo-1632776088367-d0709928731e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5JTIwd29tYW4lMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3MDM5NTUzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Portrait']);
  const [isGroupPhoto, setIsGroupPhoto] = useState<boolean>(false);
  const [currentEXIF, setCurrentEXIF] = useState<{
    aperture: string;
    shutter: string;
    iso: string;
    focalLength: string;
    cameraModel?: string;
    lensModel?: string;
  }>({
    aperture: 'f/2.8',
    shutter: '1/125s',
    iso: '400',
    focalLength: '85mm',
    cameraModel: 'Canon EOS R6',
    lensModel: 'RF85mm F2 Macro IS STM'
  });

  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>("image/jpeg");
  
  const [analysisResult, setAnalysisResult] = useState<{
    overallScore: number;
    scores: { framing: number; composition: number; lighting: number; exposure: number };
    works: Array<{ title: string; content: string }>;
    improve: Array<{ title: string; content: string }>;
    reshoot: Array<{ title: string; content: string }>;
    genreAdvice: string;
    genreMetrics: Array<{ label: string; score: number; advice?: string }>;
  } | null>(null);

  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const runGeminiAnalysis = async (base64: string, mime: string, activeGenre: string) => {
    setIsLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert photography coach. First, analyze the image to determine what photography genre/category it falls under (e.g. Portrait, Street, Landscape, Architecture, Food, Wildlife, People). 
Assess the photo across the four pillars of photography: Framing, Composition, Lighting, and Exposure.
Return a structured JSON output with the following schema:
{
  "detectedGenre": "string" (one of: Portrait, Street, Landscape, Architecture, Food, Wildlife, People),
  "overallScore": number (0-100),
  "framingScore": number (0-100),
  "compositionScore": number (0-100),
  "lightingScore": number (0-100),
  "exposureScore": number (0-100),
  "works": [
    { "title": "string", "content": "string" }
  ] (2-3 key positive points),
  "improve": [
    { "title": "string", "content": "string" }
  ] (2-3 key improvement points),
  "reshoot": [
    { "title": "string", "content": "string" }
  ] (2-3 key reshoot actionable steps),
  "genreAdvice": "string" (overall specific advice for this genre),
  "genreMetrics": [
    { "label": "string", "score": number, "advice": "string" }
  ] (3-4 specific metrics matching the active genre, e.g. for Portrait: "Eye Sharpness", "Skin Tones", etc.)
}
Note: Return ONLY the raw JSON object, without markdown wraps.`
                  },
                  {
                    inlineData: {
                      mimeType: mime,
                      data: base64
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const resData = await response.json();
      const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsed = JSON.parse(text);
      const detected = parsed.detectedGenre || activeGenre;
      setSelectedGenres([detected]);
      setIsGroupPhoto(detected === 'People');

      setAnalysisResult({
        overallScore: parsed.overallScore || 80,
        scores: {
          framing: parsed.framingScore || 80,
          composition: parsed.compositionScore || 80,
          lighting: parsed.lightingScore || 80,
          exposure: parsed.exposureScore || 80
        },
        works: parsed.works || [],
        improve: parsed.improve || [],
        reshoot: parsed.reshoot || [],
        genreAdvice: parsed.genreAdvice || '',
        genreMetrics: parsed.genreMetrics || []
      });
      
      navigate('result-a');
    } catch (err: any) {
      console.warn("Gemini analysis failed, utilizing local simulation fallback:", err);
      const localResult = simulateCritique(currentEXIF, activeGenre, isGroupPhoto);
      setAnalysisResult(localResult);
      setTimeout(() => {
        navigate('result-a');
      }, 1500);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCurrentPhoto(previewUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setPhotoBase64(base64Data);
      setPhotoMimeType(file.type);
    };
    reader.readAsDataURL(file);

    let apertureStr = 'f/2.8';
    let shutterStr = '1/125s';
    let isoStr = '400';
    let focalLengthStr = '85mm';
    let cameraModelStr = 'Smartphone';
    let lensModelStr = 'Built-in Lens';

    try {
      const ExifReader = (await import('exifreader')).default;
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      
      const aperture = tags.FNumber?.description ? `f/${tags.FNumber.description}` : undefined;
      
      let shutter = tags.ExposureTime?.description;
      if (shutter && !shutter.includes('/')) {
        const val = parseFloat(shutter);
        if (val > 0 && val < 1) {
          shutter = `1/${Math.round(1 / val)}s`;
        } else {
          shutter = `${shutter}s`;
        }
      } else if (shutter) {
        shutter = `${shutter}s`;
      }

      const iso = tags.ISOSpeedRatings?.description || tags.ISO?.description;
      const focalLength = tags.FocalLength?.description ? `${parseFloat(tags.FocalLength.description)}mm` : undefined;
      const cameraModel = tags.Model?.description;
      const lensModel = tags.LensModel?.description;

      if (aperture) apertureStr = aperture;
      if (shutter) shutterStr = shutter;
      if (iso) isoStr = iso;
      if (focalLength) focalLengthStr = focalLength;
      if (cameraModel) cameraModelStr = cameraModel;
      if (lensModel) lensModelStr = lensModel;

      setCurrentEXIF({
        aperture: apertureStr,
        shutter: shutterStr,
        iso: isoStr,
        focalLength: focalLengthStr,
        cameraModel: cameraModelStr,
        lensModel: lensModelStr
      });
    } catch (err) {
      console.warn("Could not read EXIF tags, using default placeholders:", err);
      setCurrentEXIF({
        aperture: apertureStr,
        shutter: shutterStr,
        iso: isoStr,
        focalLength: focalLengthStr,
        cameraModel: cameraModelStr,
        lensModel: lensModelStr
      });
    }

    const detectedGenre = classifyPhotoGenre(file.name, {
      focalLength: focalLengthStr,
      aperture: apertureStr
    });
    setSelectedGenres([detectedGenre]);
    setIsGroupPhoto(detectedGenre === 'People');

    navigate('loading');
  };

  useEffect(() => {
    if (currentScreen === 'loading') {
      const selectedGenre = selectedGenres[0] || 'Portrait';
      if (apiKey && photoBase64) {
        runGeminiAnalysis(photoBase64, photoMimeType, selectedGenre);
      } else {
        setIsLoadingAnalysis(false);
        const timer = setTimeout(() => {
          const localResult = simulateCritique(currentEXIF, selectedGenre, isGroupPhoto);
          setAnalysisResult(localResult);
          navigate('result-a');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentScreen, photoBase64, apiKey, currentEXIF, selectedGenres, isGroupPhoto]);

  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayStates, setOverlayStates] = useState({
    thirds: true,
    horizon: false,
    crop: false,
    lines: false
  });
  const [settingsStates, setSettingsStates] = useState({
    onDevice: true,
    analytics: false,
    photoStorage: true,
    includeOriginal: true,
    watermark: false,
    largeText: false,
    highContrast: false,
    reduceMotion: false
  });
  const [activeDetailTab, setActiveDetailTab] = useState('works');
  const [liveSessionCaptures, setLiveSessionCaptures] = useState<Array<{
    id: string;
    imageUrl: string;
    timestamp: string;
    exposureHint?: string;
    tilt?: number;
  }>>([]);
  const [selectedCommunityPost, setSelectedCommunityPost] = useState<string | null>(null);

  const processedPhotosRef = useRef<Set<string>>(new Set());

  // Sync photo results to history and update streak / stats
  useEffect(() => {
    if (currentScreen === 'result-a' || currentScreen === 'result-b') {
      if (!processedPhotosRef.current.has(currentPhoto)) {
        processedPhotosRef.current.add(currentPhoto);
        const score = analysisResult ? analysisResult.overallScore : 84;
        const scores = analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 };
        const genre = selectedGenres[0] || 'Portrait';

        setRecentPhotos(prev => [
          { url: currentPhoto, score, genre },
          ...prev
        ]);

        setUserProgressData(prev => {
          const nextStreak = prev.currentStreak + 1;
          const nextLongest = Math.max(prev.longestStreak, nextStreak);
          
          let weakest: 'Framing' | 'Composition' | 'Lighting' | 'Exposure' = 'Lighting';
          let minScore = scores.lighting;
          if (scores.framing < minScore) { weakest = 'Framing'; minScore = scores.framing; }
          if (scores.composition < minScore) { weakest = 'Composition'; minScore = scores.composition; }
          if (scores.exposure < minScore) { weakest = 'Exposure'; minScore = scores.exposure; }

          return {
            ...prev,
            currentStreak: nextStreak,
            longestStreak: nextLongest,
            totalUploads: prev.totalUploads + 1,
            timelineData: [
              ...prev.timelineData,
              { date: `${new Date().getMonth() + 1}/${new Date().getDate()}`, score }
            ],
            weakestArea: weakest
          };
        });
      }
    }
  }, [currentScreen, currentPhoto, analysisResult, selectedGenres]);
  const [communityFeedback, setCommunityFeedback] = useState<Record<string, Array<{
    id: string;
    author: string;
    feedback: string;
    upvotes: number;
    timestamp: string;
    isUpvoted: boolean;
    isAIHighlighted: boolean;
  }>>>({
    'post-1': [
      {
        id: 'fb-1',
        author: 'Sarah Mitchell',
        feedback: 'Love the natural lighting! The golden hour really brings out warmth in the skin tones. Maybe try getting a bit closer next time to make it more intimate.',
        upvotes: 24,
        timestamp: '2 hours ago',
        isUpvoted: false,
        isAIHighlighted: true
      },
      {
        id: 'fb-2',
        author: 'James Park',
        feedback: 'Great composition following rule of thirds. The eyes are perfectly sharp which is crucial for portraits.',
        upvotes: 18,
        timestamp: '4 hours ago',
        isUpvoted: true,
        isAIHighlighted: true
      },
      {
        id: 'fb-3',
        author: 'Emma Davis',
        feedback: 'Beautiful shot! The background blur really helps the subject stand out.',
        upvotes: 12,
        timestamp: '5 hours ago',
        isUpvoted: false,
        isAIHighlighted: false
      }
    ]
  });

  // Splash screen auto-dismiss
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => navigate('onboarding'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Navigate with transition
  const navigate = (screen: Screen) => {
    if (screen === currentScreen) return;
    setPreviousScreen(currentScreen);
    setIsTransitioning(true);
    setTimeout(() => {
      navigateRouter('/' + screen);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  // Bottom tab handler
  const handleTabChange = (tab: 'home' | 'live-shoot' | 'community' | 'learn' | 'profile') => {
    switch (tab) {
      case 'home': navigate('home'); break;
      case 'live-shoot': navigate('live-shoot'); break;
      case 'community': navigate('community'); break;
      case 'learn': navigate('learning-journey'); break;
      case 'profile': navigate('progress'); break;
    }
  };

  const getActiveTab = (): 'home' | 'live-shoot' | 'community' | 'learn' | 'profile' => {
    if (['home', 'home-empty'].includes(currentScreen)) return 'home';
    if (['community', 'community-post', 'share-community'].includes(currentScreen)) return 'community';
    if (['learning-journey', 'certification-path', 'learning', 'practice'].includes(currentScreen)) return 'learn';
    if (['progress', 'settings'].includes(currentScreen)) return 'profile';
    return 'home';
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // User progress data
  const [userProgressData, setUserProgressData] = useState({
    name: 'Alex Chen',
    currentStreak: 7,
    longestStreak: 14,
    totalUploads: 23,
    timelineData: [
      { date: '10/1', score: 68 },
      { date: '10/5', score: 72 },
      { date: '10/8', score: 75 },
      { date: '10/12', score: 78 },
      { date: '10/15', score: 76 },
      { date: '10/18', score: 82 },
      { date: '10/22', score: 84 },
      { date: '10/25', score: 87 }
    ],
    pillarTrends: {
      framing: { current: 82, improvement: 8, previousAvg: 76 },
      composition: { current: 85, improvement: 12, previousAvg: 76 },
      lighting: { current: 68, improvement: -5, previousAvg: 72 },
      exposure: { current: 81, improvement: 15, previousAvg: 70 }
    },
    weakestArea: 'Lighting' as const,
    recommendations: {
      Lighting: "Your lighting scores dipped this week. Try shooting during golden hour (1 hour before sunset) for more consistent results.",
      Composition: "Great progress! Keep exploring rule of thirds and negative space techniques.",
      Framing: "Your framing improved 8% this month! Continue using leading lines to guide viewers.",
      Exposure: "Excellent improvement! Your exposure control has become more consistent."
    }
  });

  // Genre-specific metrics data
  const genreMetrics: Record<string, { genre: 'Portrait' | 'Street' | 'Landscape' | 'Architecture' | 'Food' | 'Wildlife', metrics: any[], advice: string }> = {
    Portrait: {
      genre: 'Portrait',
      metrics: [
        { label: 'Eye Sharpness', score: 92, advice: 'Eyes are critically sharp' },
        { label: 'Skin Tone Accuracy', score: 78, advice: 'Slightly warm tones' },
        { label: 'Face Detection', score: 95 },
        { label: 'Catchlight Presence', score: 88, advice: 'Good catchlights add life' }
      ],
      advice: 'Move closer for an environmental portrait, or step back for more context. Consider using a reflector to fill shadows under the chin.'
    },
    Street: {
      genre: 'Street',
      metrics: [
        { label: 'Decisive Moment', score: 85, advice: 'Good timing' },
        { label: 'Subject Isolation', score: 72 },
        { label: 'Urban Context', score: 90, advice: 'Compelling story' },
        { label: 'Candid Authenticity', score: 88 }
      ],
      advice: 'Get closer to your subject for more impact. Wait for peak action or gestures that reveal character.'
    },
    Landscape: {
      genre: 'Landscape',
      metrics: [
        { label: 'Depth Layers', score: 82, advice: 'Good foreground-midground-background' },
        { label: 'Sky Balance', score: 75, advice: 'Consider a graduated ND filter' },
        { label: 'Foreground Interest', score: 68, advice: 'Add stronger foreground element' },
        { label: 'Horizon Placement', score: 90 }
      ],
      advice: 'Shoot during golden hour for warmer light. Include a strong foreground element to create depth and guide the viewer\'s eye.'
    },
    Architecture: {
      genre: 'Architecture',
      metrics: [
        { label: 'Vertical Lines', score: 88, advice: 'Minimal keystoning' },
        { label: 'Symmetry', score: 92, advice: 'Excellent symmetry' },
        { label: 'Perspective', score: 80 },
        { label: 'Detail Capture', score: 85 }
      ],
      advice: 'Use a tilt-shift lens or correct perspective in post. Shoot at different times for varied lighting.'
    },
    Food: {
      genre: 'Food',
      metrics: [
        { label: 'Color Saturation', score: 90, advice: 'Vibrant colors' },
        { label: 'Styling Quality', score: 78 },
        { label: 'Overhead Angle', score: 85, advice: 'Good angle for this dish' },
        { label: 'Background Clean', score: 72, advice: 'Simplify background' }
      ],
      advice: 'Shoot from 45deg for dishes with height. Use natural window light and a white reflector to fill shadows.'
    },
    Wildlife: {
      genre: 'Wildlife',
      metrics: [
        { label: 'Subject Sharpness', score: 95, advice: 'Critically sharp on eyes' },
        { label: 'Background Blur', score: 88 },
        { label: 'Behavioral Moment', score: 76, advice: 'Catch more dynamic poses' },
        { label: 'Subject Isolation', score: 92 }
      ],
      advice: 'Focus on the eyes. Use burst mode to capture peak action. Get lower to shoot at eye level with your subject.'
    }
  };

  // currentPhoto is now declared as dynamic React state
  const currentGenre: 'Portrait' | 'Street' | 'Landscape' | 'Architecture' | 'Food' | 'Wildlife' = 'Portrait';
  
  // Learning journey data
  const microLessons = [
    { id: '1', title: 'Golden Hour Lighting', description: 'Master the warm tones of sunrise and sunset', pillar: 'Lighting' as const, duration: '5 min', status: 'completed' as const, unlockedBy: 'Lighting weakness detected' },
    { id: '2', title: 'Rule of Thirds Mastery', description: 'Place subjects for maximum visual impact', pillar: 'Composition' as const, duration: '7 min', status: 'completed' as const, unlockedBy: 'Composition score below 80' },
    { id: '3', title: 'Natural Light Portraits', description: 'Use window light for flattering portraits', pillar: 'Lighting' as const, duration: '8 min', status: 'available' as const, unlockedBy: 'Portrait critique completed' },
    { id: '4', title: 'Leading Lines Technique', description: 'Guide viewers through your composition', pillar: 'Framing' as const, duration: '6 min', status: 'available' as const, unlockedBy: 'Framing analysis unlocked' },
    { id: '5', title: 'Exposure Triangle Basics', description: 'Balance aperture, shutter, and ISO', pillar: 'Exposure' as const, duration: '10 min', status: 'locked' as const, unlockedBy: 'Complete 3 more critiques' },
    { id: '6', title: 'Backlighting Techniques', description: 'Create dramatic silhouettes and rim light', pillar: 'Lighting' as const, duration: '7 min', status: 'locked' as const, unlockedBy: 'Complete Lighting badge' }
  ];

  const badges = [
    { title: 'Lighting Explorer', description: 'Complete 10 lighting lessons', pillar: 'Lighting' as const, progress: 7, total: 10, earned: false },
    { title: 'Composition Apprentice', description: 'Complete 10 composition lessons', pillar: 'Composition' as const, progress: 4, total: 10, earned: false },
    { title: 'Framing Master', description: 'Complete 10 framing lessons', pillar: 'Framing' as const, progress: 10, total: 10, earned: true, earnedDate: 'Oct 15, 2025' },
    { title: 'Exposure Expert', description: 'Complete 10 exposure lessons', pillar: 'Exposure' as const, progress: 2, total: 10, earned: false }
  ];

  const certifications = [
    {
      name: 'Photography Fundamentals',
      description: 'Master the essential skills of photography',
      totalLessons: 40,
      completedLessons: 23,
      badgesRequired: 4,
      badgesEarned: 1,
      unlocked: false
    },
    {
      name: 'Portrait Photography Pro',
      description: 'Specialize in portrait photography techniques',
      totalLessons: 30,
      completedLessons: 12,
      badgesRequired: 3,
      badgesEarned: 0,
      unlocked: false
    }
  ];

  const communityPosts = [
    {
      id: 'post-1',
      author: 'Alex Chen',
      imageUrl: currentPhoto,
      aiScore: 84,
      communityScore: 88,
      genre: 'Portrait' as const,
      timestamp: '6 hours ago',
      commentCount: 3
    },
    {
      id: 'post-2',
      author: 'Maria Garcia',
      imageUrl: "https://images.unsplash.com/photo-1547543542-c90f1844ff7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBwaG90b2dyYXBoeSUyMG1vdW50YWlucyUyMHN1bnJpc2V8ZW58MXx8fHwxNzcwMzk1NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      aiScore: 78,
      communityScore: 82,
      genre: 'Landscape' as const,
      timestamp: '1 day ago',
      commentCount: 7
    },
    {
      id: 'post-3',
      author: 'David Kim',
      imageUrl: "https://images.unsplash.com/photo-1704101596453-ba24698beb4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBwaG90b2dyYXBoeSUyMG1vZGVybiUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDM5NTUzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      aiScore: 92,
      communityScore: 90,
      genre: 'Architecture' as const,
      timestamp: '2 days ago',
      commentCount: 12
    }
  ];
  
  const [recentPhotos, setRecentPhotos] = useState([
    { url: currentPhoto, score: 85, genre: 'Portrait' },
    { url: "https://images.unsplash.com/photo-1547543542-c90f1844ff7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBwaG90b2dyYXBoeSUyMG1vdW50YWlucyUyMHN1bnJpc2V8ZW58MXx8fHwxNzcwMzk1NTM1fDA&ixlib=rb-4.1.0&q=80&w=200", score: 78, genre: 'Landscape' },
    { url: "https://images.unsplash.com/photo-1704101596453-ba24698beb4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBwaG90b2dyYXBoeSUyMG1vZGVybiUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDM5NTUzNXww&ixlib=rb-4.1.0&q=80&w=200", score: 92, genre: 'Architecture' },
    { url: currentPhoto, score: 73, genre: 'Macro' },
    { url: "https://images.unsplash.com/photo-1547543542-c90f1844ff7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBwaG90b2dyYXBoeSUyMG1vdW50YWlucyUyMHN1bnJpc2V8ZW58MXx8fHwxNzcwMzk1NTM1fDA&ixlib=rb-4.1.0&q=80&w=200", score: 81, genre: 'Night' }
  ]);

  const renderScreen = () => {
    switch (currentScreen) {
      // ==================== SPLASH ====================
      case 'splash':
        return (
          <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
            <img 
              src="/splash.jpg" 
              alt="PhotoSensei Splash" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute bottom-16 flex space-x-1.5 z-10">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
        );

      // ==================== ONBOARDING ====================
      case 'onboarding':
        return (
          <div className="flex flex-col min-h-screen bg-black text-white select-none">
            <div className="flex-1 px-6 pt-12 pb-6 flex flex-col justify-between">
              
              {/* Header Info */}
              <div className="text-center space-y-2 mt-4">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Onboarding • Stage {onboardingStep + 1} of 3</span>
                {onboardingStep === 0 && (
                  <>
                    <h1 className="text-white uppercase tracking-widest text-base font-bold mt-1">PhotoSensei</h1>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                      An AI photography coach decoding camera sensor inputs and visual composition rules.
                    </p>
                  </>
                )}
                {onboardingStep === 1 && (
                  <>
                    <h1 className="text-white uppercase tracking-widest text-base font-bold mt-1">Four Pillars of Critique</h1>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                      Evaluating every capture across critical structural parameters.
                    </p>
                  </>
                )}
                {onboardingStep === 2 && (
                  <>
                    <h1 className="text-white uppercase tracking-widest text-base font-bold mt-1">Adaptive Pathway</h1>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                      Dynamic micro-lessons tailored to your capture assessment scores.
                    </p>
                  </>
                )}
              </div>

              {/* Vector Abstract Graphic */}
              <div className="my-8 flex items-center justify-center">
                {onboardingStep === 0 && (
                  <svg className="w-44 h-44 text-white/90 animate-fade-in-up" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                    <circle cx="50" cy="50" r="35" strokeDasharray="1 2" className="opacity-30" />
                    <circle cx="50" cy="50" r="26" />
                    <path d="M50 24 L63 39" />
                    <path d="M63 39 L57 66" />
                    <path d="M57 66 L37 66" />
                    <path d="M37 66 L27 45" />
                    <path d="M27 45 L38 27" />
                    <path d="M38 27 L50 24" />
                    <line x1="50" y1="6" x2="50" y2="16" className="opacity-40" />
                    <line x1="94" y1="50" x2="84" y2="50" className="opacity-40" />
                    <line x1="50" y1="94" x2="50" y2="84" className="opacity-40" />
                    <line x1="6" y1="50" x2="16" y2="50" className="opacity-40" />
                  </svg>
                )}
                {onboardingStep === 1 && (
                  <svg className="w-44 h-44 text-white/90 animate-fade-in-up" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                    <line x1="33.3" y1="10" x2="33.3" y2="90" strokeDasharray="1 2" className="opacity-30" />
                    <line x1="66.6" y1="10" x2="66.6" y2="90" strokeDasharray="1 2" className="opacity-30" />
                    <line x1="10" y1="33.3" x2="90" y2="33.3" strokeDasharray="1 2" className="opacity-30" />
                    <line x1="10" y1="66.6" x2="90" y2="66.6" strokeDasharray="1 2" className="opacity-30" />
                    <path d="M10 65 Q30 50 50 60 T90 45" className="opacity-40" />
                    <line x1="10" y1="66.6" x2="90" y2="66.6" strokeWidth="0.5" className="opacity-80" />
                    <path d="M38 33.3 Q50 27 62 33.3 T38 33.3" />
                    <circle cx="50" cy="33.3" r="3.5" />
                  </svg>
                )}
                {onboardingStep === 2 && (
                  <svg className="w-44 h-44 text-white/90 animate-fade-in-up" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                    <path d="M15 80 C 35 80, 45 40, 65 30 S 80 15, 85 15" strokeWidth="1" />
                    <polygon points="50,42 52,48 58,48 53,52 55,58 50,54 45,58 47,52 42,48 48,48" className="opacity-50" />
                    <circle cx="15" cy="80" r="3" className="opacity-30" />
                    <circle cx="40" cy="65" r="3" className="opacity-50" />
                    <circle cx="65" cy="30" r="3" className="opacity-70" />
                    <line x1="15" y1="80" x2="40" y2="65" strokeDasharray="1 2" className="opacity-30" />
                    <line x1="40" y1="65" x2="65" y2="30" strokeDasharray="1 2" className="opacity-30" />
                  </svg>
                )}
              </div>

              {/* Slide Custom Interactive Features */}
              <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto w-full">
                {onboardingStep === 0 && (
                  <div className="space-y-3">
                    <div className="p-3 border border-white/5 bg-white/[0.02]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">EXIF Mechanical Analysis</h4>
                      <p className="text-xs text-muted-foreground mt-1">Read aperture, focal length, and ISO to evaluate hardware constraints.</p>
                    </div>
                    <div className="p-3 border border-white/5 bg-white/[0.02]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Vision Composition Grid</h4>
                      <p className="text-xs text-muted-foreground mt-1">Measure canvas alignment, horizon tilt, and spatial geometry balance.</p>
                    </div>
                  </div>
                )}
                {onboardingStep === 1 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 border border-white/5 bg-white/[0.02] text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white block">Framing</span>
                      <span className="text-xs text-muted-foreground mt-1 block">Crop boundaries</span>
                    </div>
                    <div className="p-3 border border-white/5 bg-white/[0.02] text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white block">Composition</span>
                      <span className="text-xs text-muted-foreground mt-1 block">Rule of thirds</span>
                    </div>
                    <div className="p-3 border border-white/5 bg-white/[0.02] text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white block">Lighting</span>
                      <span className="text-xs text-muted-foreground mt-1 block">Contrast limits</span>
                    </div>
                    <div className="p-3 border border-white/5 bg-white/[0.02] text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white block">Exposure</span>
                      <span className="text-xs text-muted-foreground mt-1 block">Value histograms</span>
                    </div>
                  </div>
                )}
                {onboardingStep === 2 && (
                  <div className="space-y-3">
                    <div className="p-3 border border-white/5 bg-white/[0.02]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Personalized Lessons</h4>
                      <p className="text-xs text-muted-foreground mt-1">Micro-lessons generated dynamically based on your weakest areas.</p>
                    </div>
                    <div className="p-3 border border-white/5 bg-white/[0.02]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Master Certification</h4>
                      <p className="text-xs text-muted-foreground mt-1">Earn badges and track your score progression from Amateur to Master.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom section */}
            <div className="px-6 pb-10 space-y-5">
              {/* Dots */}
              <div className="flex justify-center space-x-3">
                {[0, 1, 2].map((step) => (
                  <div 
                    key={step} 
                    className={`h-[1px] transition-all duration-300 ${
                      step === onboardingStep 
                        ? 'bg-white w-8' 
                        : 'bg-white/20 w-4'
                    }`} 
                  />
                ))}
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground text-xs uppercase tracking-wider rounded-none hover:bg-white/5" 
                  onClick={() => navigate('home')}
                >
                  Skip
                </Button>
                <Button 
                  className="flex-1 h-12 bg-foreground text-background font-semibold hover:bg-foreground/90 rounded-none tracking-wider uppercase text-xs"
                  onClick={() => {
                    if (onboardingStep < 2) {
                      setOnboardingStep(onboardingStep + 1);
                    } else {
                      navigate('home');
                    }
                  }}
                >
                  {onboardingStep < 2 ? 'Continue' : 'Get Started'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="px-5 pt-4 pb-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{getGreeting()}</span>
                <h1 className="text-foreground tracking-wider uppercase text-base font-bold mt-0.5">
                  {userProgressData.name.split(' ')[0]}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="w-9 h-9 bg-white/5 border border-white/5 hover:bg-white/10" onClick={() => navigate('settings')}>
                  <Settings className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>

            {/* Streak & Score Status Row */}
            <div className="grid grid-cols-3 border-y border-white/10 font-mono">
              <div className="py-3 px-1 text-center border-r border-white/10">
                <span className="block text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">STREAK</span>
                <span className="block text-xs font-bold text-foreground tracking-widest">{userProgressData.currentStreak} DAYS</span>
              </div>
              <div className="py-3 px-1 text-center border-r border-white/10">
                <span className="block text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">AVG SCORE</span>
                <span className="block text-xs font-bold text-foreground tracking-widest">{userProgressData.timelineData[userProgressData.timelineData.length - 1].score}</span>
              </div>
              <div className="py-3 px-1 text-center">
                <span className="block text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">WEAKEST</span>
                <span className="block text-xs font-bold text-foreground tracking-widest">{userProgressData.weakestArea}</span>
              </div>
            </div>

            {/* Hero Critique Cover */}
            <div 
              className="relative aspect-[4/5] bg-neutral-900 border border-white/5 cursor-pointer overflow-hidden group"
              onClick={() => navigate('result-a')}
            >
              <ImageWithFallback 
                src={currentPhoto}
                alt="Latest Critique Cover"
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute top-4 left-4 bg-black/75 border border-white/10 px-3 py-1 text-white font-mono text-xs uppercase tracking-widest">
                LATEST • {recentPhotos[0].genre}
              </div>
              
              {/* Overlay Metadata Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-stretch">
                <div className="flex-1 bg-black/75 border-y border-l border-white/10 p-3 flex flex-col justify-center space-y-0.5 min-w-0">
                  <span className="font-mono text-[10px] text-white/90 tracking-widest uppercase">
                    28mm • f/2.8 • 1/160s • ISO 200
                  </span>
                  <span className="text-[11px] text-white/70 leading-relaxed whitespace-normal break-words">
                    "{userProgressData.recommendations[userProgressData.weakestArea]}"
                  </span>
                </div>
                <div className="bg-white text-black font-bold text-2xl w-16 flex-shrink-0 flex items-center justify-center font-mono border-y border-r border-white/10">
                  {recentPhotos[0].score}
                </div>
              </div>
            </div>

            {/* Viewfinder Shutter Bar */}
            <div className="space-y-3">
              <button 
                className="w-full h-16 bg-white text-black font-semibold hover:bg-neutral-200 transition-all flex items-center justify-between px-5 uppercase tracking-wider text-xs"
                onClick={() => navigate('live-shoot')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  </div>
                  <span>Open Viewfinder</span>
                </div>
                <span className="font-mono text-xs text-black/50">LAUNCH CAMERA</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="h-14 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col justify-center px-4 space-y-0.5 text-left"
                  onClick={handleUploadClick}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Import File</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">EXIF Critique</span>
                </button>
                <button 
                  className="h-14 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col justify-center px-4 space-y-0.5 text-left"
                  onClick={() => navigate('live-session')}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Continuous Session</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Multi-Capture</span>
                </button>
              </div>
            </div>

            {/* Learning Shortcut */}
            <button 
              className="w-full p-4 bg-white/[0.02] border border-white/5 flex items-center space-x-3 active:scale-[0.99] transition-all hover:bg-white/[0.04]"
              onClick={() => navigate('learning-journey')}
            >
              <div className="w-9 h-9 bg-foreground text-background flex items-center justify-center flex-shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground">Learning Journey</h4>
                <p className="text-xs text-muted-foreground">23 lessons completed &middot; 1 badge earned</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Recent Critiques Journal Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Capture Journal</h2>
                <button className="text-xs uppercase tracking-wider text-white/70 hover:text-white" onClick={() => navigate('result-a')}>See Journal</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recentPhotos.slice(1).map((photo, i) => (
                  <div 
                    key={i} 
                    className="group/card relative border border-white/5 bg-white/[0.01] cursor-pointer hover:border-white/20 transition-all text-left"
                  >
                    <div 
                      className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentPhotos(prev => prev.filter((_, idx) => idx !== (i + 1)));
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </div>
                    <div onClick={() => { setCurrentPhoto(photo.url); navigate('result-a'); }}>
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
                        <ImageWithFallback 
                          src={photo.url}
                          alt={`${photo.genre} Capture`}
                          className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                        />
                      </div>
                      <div className="p-3 space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40 uppercase tracking-widest text-[9px]">{photo.genre}</span>
                          <span className="text-white font-bold text-xs">{photo.score}</span>
                        </div>
                        <div className="h-[2px] bg-white/10 w-full relative">
                          <div className="absolute left-0 top-0 h-full bg-white" style={{ width: `${photo.score}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ==================== HOME EMPTY ====================
      case 'home-empty':
        return (
          <div className="px-5 pt-2 pb-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{getGreeting()}</p>
                <h1 className="bg-gradient-to-r from-[#2962FF] to-[#00C853] bg-clip-text text-transparent" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  Welcome
                </h1>
              </div>
              <div className="flex items-center space-x-1">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('settings')}>
                  <Settings className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full h-14 bg-gradient-to-r from-[#2962FF] to-[#2962FF]/80 shadow-lg shadow-primary/20 rounded-xl"
              onClick={handleUploadClick}
            >
              <Upload className="h-5 w-5 mr-2.5" />
              Upload a Photo
            </Button>
            
            <UploadBox onClick={handleUploadClick} />
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-primary/20" onClick={handleUploadClick}>
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-accent/20" onClick={handleUploadClick}>
                Browse Files
              </Button>
            </div>
            
            <EmptyState
              icon="📷"
              title="No photos yet"
              description="Upload your first photo to get started with AI-powered critique and personalized feedback."
              actionLabel="Upload Photo"
              onAction={() => navigate('loading')}
            />
          </div>
        );

      case 'upload-error':
        return (
          <div className="px-5 pt-2 pb-4">
            <div className="flex items-center space-x-3 mb-6">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('home')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Upload Photo</h2>
            </div>
            <ErrorState
              title="Couldn't upload this photo"
              description="The file might be too large or in an unsupported format. Please try again with a different photo or check your connection."
              actionLabel="Try Again"
              onRetry={() => navigate('loading')}
              onCancel={() => navigate('home')}
            />
          </div>
        );

      // ==================== LOADING ====================
      case 'loading':
        return (
          <div className="px-5 pt-2 pb-4 flex flex-col justify-center min-h-[700px]">
            <div className="text-center space-y-6">
              <div className="w-40 h-52 bg-muted/50 rounded-2xl mx-auto flex items-center justify-center overflow-hidden relative">
                <ImageWithFallback
                  src={currentPhoto}
                  alt="Analyzing"
                  className="w-full h-full object-cover opacity-60"
                />
                {/* Scanning line effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent animate-pulse" />
              </div>
              
              <div className="space-y-1.5">
                <h2 className="font-semibold" style={{ fontSize: '1.25rem' }}>Analyzing Your Photo</h2>
                <p className="text-sm text-muted-foreground">Sit tight, this only takes a moment...</p>
              </div>
              
              <AnalysisProgress
                progress={67}
                currentStep="Processing composition..."
                steps={[
                  { name: 'Framing', status: 'complete' },
                  { name: 'Composition', status: 'complete' },
                  { name: 'Lighting', status: 'in-progress' },
                  { name: 'Exposure', status: 'pending' },
                  { name: 'Metadata', status: 'pending' }
                ]}
              />
              
              <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate('result-a')}>
                Skip to Results
              </Button>
            </div>
          </div>
        );

      case 'loading-error':
        return (
          <div className="px-5 pt-2 pb-4 flex flex-col justify-center min-h-[700px]">
            <ErrorState
              title="We couldn't analyze this image"
              description="This might be due to an unsupported file type or the image quality. Please check the file format and try again."
              actionLabel="Try Another Photo"
              onRetry={() => navigate('home')}
              onCancel={() => navigate('home')}
              variant="destructive"
            />
          </div>
        );

      // ==================== RESULTS ====================
      case 'result-a':
        return (
          <div className="pb-4">
            {/* Hero image with overlay header */}
            <div className="relative w-full h-64">
              <ImageWithFallback 
                src={currentPhoto}
                alt="Portrait to critique"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none bg-black/30 backdrop-blur-sm text-white" onClick={() => navigate('home')}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none bg-black/30 backdrop-blur-sm text-white" onClick={() => navigate('share-community')}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              {/* Genre badge on image */}
              <div className="absolute bottom-3 left-4 flex items-center space-x-2">
                <GenreChip label={selectedGenres[0] || "Portrait"} confidence={94} />
                <GenreBadge genre={selectedGenres[0] || "Portrait"} size="sm" showModule />
              </div>
            </div>
            
            <div className="px-5 mt-4 space-y-5 relative z-10">
              {/* Score Bar Chart */}
              <div className="flex justify-center p-3 bg-muted/10 border border-white/5">
                <CritiqueBarChart 
                  scores={analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 }}
                  overallScore={analysisResult ? analysisResult.overallScore : 84}
                  className="w-full"
                />
              </div>
              
              {/* Pillar Scores */}
              <div className="grid grid-cols-2 gap-2.5">
                <ScoreCard score={analysisResult ? analysisResult.scores.framing : 88} title="Framing" />
                <ScoreCard score={analysisResult ? analysisResult.scores.composition : 85} title="Composition" />
                <ScoreCard score={analysisResult ? analysisResult.scores.lighting : 76} title="Lighting" />
                <ScoreCard score={analysisResult ? analysisResult.scores.exposure : 87} title="Exposure" />
              </div>
              
              <GenreModuleCard
                genre={selectedGenres[0] || "Portrait"}
                metrics={analysisResult ? analysisResult.genreMetrics : []}
                contextualAdvice={analysisResult ? analysisResult.genreAdvice : ''}
              />
              
              {(() => {
                const scores = analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 };
                let weakestPillar: 'Framing' | 'Composition' | 'Lighting' | 'Exposure' = 'Lighting';
                let minScore = scores.lighting;
                if (scores.framing < minScore) { weakestPillar = 'Framing'; minScore = scores.framing; }
                if (scores.composition < minScore) { weakestPillar = 'Composition'; minScore = scores.composition; }
                if (scores.exposure < minScore) { weakestPillar = 'Exposure'; minScore = scores.exposure; }

                const advice = userProgressData.recommendations[weakestPillar] || "Focus on building stable frames using grid guides.";

                return (
                  <AdaptiveFeedback
                    weakestArea={weakestPillar}
                    currentScore={minScore}
                    targetScore={85}
                    personalizedTip={advice}
                  />
                );
              })()}
              
              <div className="space-y-2.5">
                <Button 
                  variant="leicaSolid"
                  className="w-full h-12 uppercase tracking-widest text-xs font-semibold" 
                  onClick={() => navigate('overlays-a')}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Show Visual Overlays
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('details-a')}>
                    Details
                  </Button>
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('share-community')}>
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('export')}>
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'result-b':
        return (
          <div className="pb-4">
            <div className="relative w-full h-64">
              <ImageWithFallback 
                src={currentPhoto}
                alt="Portrait to critique"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none bg-black/30 backdrop-blur-sm text-white" onClick={() => navigate('home')}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none bg-black/30 backdrop-blur-sm text-white" onClick={() => navigate('share-community')}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              {/* Genre badge on image */}
              <div className="absolute bottom-3 left-4 flex items-center space-x-2">
                <GenreChip label={selectedGenres[0] || "Portrait"} confidence={94} />
                <GenreBadge genre={selectedGenres[0] || "Portrait"} size="sm" showModule />
              </div>
            </div>
            
            <div className="px-5 mt-4 space-y-5 relative z-10">
              {/* Score Bar Chart */}
              <div className="flex justify-center p-3 bg-muted/10 border border-white/5">
                <CritiqueBarChart 
                  scores={analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 }}
                  overallScore={analysisResult ? analysisResult.overallScore : 84}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                <ScoreCard score={analysisResult ? analysisResult.scores.framing : 88} title="Framing" />
                <ScoreCard score={analysisResult ? analysisResult.scores.composition : 85} title="Composition" />
                <ScoreCard score={analysisResult ? analysisResult.scores.lighting : 76} title="Lighting" />
                <ScoreCard score={analysisResult ? analysisResult.scores.exposure : 87} title="Exposure" />
              </div>
              
              <GenreModuleCard
                genre={selectedGenres[0] || "Portrait"}
                metrics={analysisResult ? analysisResult.genreMetrics : []}
                contextualAdvice={analysisResult ? analysisResult.genreAdvice : ''}
              />
              
              {(() => {
                const scores = analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 };
                let weakestPillar: 'Framing' | 'Composition' | 'Lighting' | 'Exposure' = 'Lighting';
                let minScore = scores.lighting;
                if (scores.framing < minScore) { weakestPillar = 'Framing'; minScore = scores.framing; }
                if (scores.composition < minScore) { weakestPillar = 'Composition'; minScore = scores.composition; }
                if (scores.exposure < minScore) { weakestPillar = 'Exposure'; minScore = scores.exposure; }

                const advice = userProgressData.recommendations[weakestPillar] || "Focus on building stable frames using grid guides.";

                return (
                  <AdaptiveFeedback
                    weakestArea={weakestPillar}
                    currentScore={minScore}
                    targetScore={85}
                    personalizedTip={advice}
                  />
                );
              })()}
              
              <div className="space-y-2.5">
                <Button 
                  variant="leicaSolid"
                  className="w-full h-12 uppercase tracking-widest text-xs font-semibold" 
                  onClick={() => navigate('overlays-a')}
                >
                  Show Visual Overlays
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('details-a')}>
                    Details
                  </Button>
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('share-community')}>
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                  <Button variant="leica" className="h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('export')}>
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      // ==================== DETAILS ====================
      case 'details-a':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Detailed Critique</h2>
            </div>
            
            <div className="w-full h-28 bg-muted/50 rounded-2xl overflow-hidden">
              <ImageWithFallback src={currentPhoto} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
            
            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-10 rounded-xl bg-muted/50">
                <TabsTrigger value="works" className="text-xs rounded-lg">Works</TabsTrigger>
                <TabsTrigger value="improve" className="text-xs rounded-lg">Improve</TabsTrigger>
                <TabsTrigger value="reshoot" className="text-xs rounded-lg">Reshoot</TabsTrigger>
                <TabsTrigger value="exif" className="text-xs rounded-lg">EXIF</TabsTrigger>
              </TabsList>
              
              <TabsContent value="works" className="space-y-3 mt-4">
                {analysisResult ? (
                  analysisResult.works.map((item, index) => (
                    <CritiqueCard
                      key={index}
                      title={item.title}
                      content={item.content}
                      icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />}
                    />
                  ))
                ) : (
                  <>
                    <CritiqueCard
                      title="Strong Subject Focus"
                      content="The shallow depth of field effectively isolates your subject from the background, creating a professional portrait look."
                      icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />}
                    />
                    <CritiqueCard
                      title="Good Eye Contact"
                      content="The subject's direct gaze creates an immediate connection with the viewer, essential for compelling portraits."
                      icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />}
                    />
                    {selectedGenres.includes('Portrait') && (
                      <CritiqueCard
                        title="Eye Sharpness (Portrait Module)"
                        content="Eyes are critically sharp at 92/100. This is essential for portrait photography."
                        icon={<CheckCircle className="h-5 w-5 text-primary" />}
                      />
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="improve" className="space-y-3 mt-4">
                {analysisResult ? (
                  analysisResult.improve.map((item, index) => (
                    <CritiqueCard
                      key={index}
                      title={item.title}
                      content={item.content}
                      icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />}
                    />
                  ))
                ) : (
                  <>
                    <CritiqueCard
                      title="Lighting Direction"
                      content="Consider repositioning your subject to avoid harsh shadows under the eyes. Soft, even lighting would enhance the portrait."
                      icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />}
                    />
                    {selectedGenres.includes('Portrait') && (
                      <CritiqueCard
                        title="Skin Tone Accuracy (Portrait Module)"
                        content="Skin tones are slightly warm at 78/100. Consider cooling the white balance in post."
                        icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />}
                      />
                    )}
                    <CritiqueCard
                      title="Background Elements"
                      content="Some distracting elements compete for attention. Try to simplify or reposition for a cleaner composition."
                      icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="reshoot" className="space-y-3 mt-4">
                {analysisResult ? (
                  analysisResult.reshoot.map((item, index) => (
                    <CritiqueCard
                      key={index}
                      title={item.title}
                      content={item.content}
                      icon={<Target className="h-5 w-5 text-primary" />}
                    />
                  ))
                ) : (
                  <>
                    <CritiqueCard
                      title="Golden Hour Timing"
                      content="Try shooting during golden hour for warmer, more flattering natural light that eliminates harsh shadows."
                      icon={<Target className="h-5 w-5 text-primary" />}
                    />
                    {selectedGenres.includes('Portrait') && (
                      <CritiqueCard
                        title="Portrait Distance (Portrait Module)"
                        content="Move closer for an intimate portrait or step back for environmental context."
                        icon={<Target className="h-5 w-5 text-accent" />}
                      />
                    )}
                    <CritiqueCard
                      title="Reflector Usage"
                      content="Use a white reflector to bounce light into shadow areas of the face for more even illumination."
                      icon={<Target className="h-5 w-5 text-primary" />}
                    />
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="exif" className="space-y-3 mt-4">
                <Card className="p-4 space-y-3 bg-muted/30 border-none rounded-xl">
                  <h4 className="text-sm font-medium">Camera Settings</h4>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Aperture', value: currentEXIF.aperture },
                      { label: 'Shutter', value: currentEXIF.shutter },
                      { label: 'ISO', value: currentEXIF.iso },
                      { label: 'Focal', value: currentEXIF.focalLength }
                    ].map(item => (
                      <div key={item.label} className="space-y-1">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <EXIFInsightPanel
                  genre="Portrait"
                  currentSettings={currentEXIF}
                  currentPhoto={currentPhoto}
                  currentScore={84}
                />
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'details-b':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Detailed Critique</h2>
            </div>
            
            <div className="w-full h-28 bg-muted/50 rounded-2xl overflow-hidden">
              <ImageWithFallback src={currentPhoto} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
            
            <div className="space-y-4">
              <SegmentedTabs
                tabs={['What Works', 'Improve', 'Reshoot', 'EXIF']}
                activeTab={activeDetailTab === 'works' ? 'What Works' : 
                         activeDetailTab === 'improve' ? 'Improve' : 
                         activeDetailTab === 'reshoot' ? 'Reshoot' : 'EXIF'}
                onTabChange={(tab) => {
                  const tabMap: Record<string, string> = {
                    'What Works': 'works', 'Improve': 'improve', 'Reshoot': 'reshoot', 'EXIF': 'exif'
                  };
                  setActiveDetailTab(tabMap[tab]);
                }}
              />
              
              <div className="space-y-3">
                {activeDetailTab === 'works' && (
                  analysisResult ? (
                    analysisResult.works.map((item, index) => (
                      <CritiqueCard key={index} title={item.title} content={item.content} icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />} />
                    ))
                  ) : (
                    <>
                      <CritiqueCard title="Strong Subject Focus" content="The shallow depth of field effectively isolates your subject." icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />} />
                      <CritiqueCard title="Good Eye Contact" content="Direct gaze creates an immediate connection with the viewer." icon={<CheckCircle className="h-5 w-5 text-[#00C853]" />} />
                    </>
                  )
                )}
                {activeDetailTab === 'improve' && (
                  analysisResult ? (
                    analysisResult.improve.map((item, index) => (
                      <CritiqueCard key={index} title={item.title} content={item.content} icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />} />
                    ))
                  ) : (
                    <>
                      <CritiqueCard title="Lighting Direction" content="Reposition to avoid harsh shadows. Soft, even lighting would enhance the portrait." icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />} />
                      <CritiqueCard title="Background Elements" content="Simplify or reposition for a cleaner composition." icon={<Lightbulb className="h-5 w-5 text-[#FF6D00]" />} />
                    </>
                  )
                )}
                {activeDetailTab === 'reshoot' && (
                  analysisResult ? (
                    analysisResult.reshoot.map((item, index) => (
                      <CritiqueCard key={index} title={item.title} content={item.content} icon={<Target className="h-5 w-5 text-primary" />} />
                    ))
                  ) : (
                    <>
                      <CritiqueCard title="Golden Hour Timing" content="Try golden hour for warmer, flattering natural light." icon={<Target className="h-5 w-5 text-primary" />} />
                      <CritiqueCard title="Reflector Usage" content="Use a white reflector to fill shadow areas." icon={<Target className="h-5 w-5 text-primary" />} />
                    </>
                  )
                )}
                {activeDetailTab === 'exif' && (
                  <>
                    <Card className="p-4 space-y-3 bg-muted/30 border-none rounded-xl">
                      <h4 className="text-sm font-medium">Camera Settings</h4>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        {[
                          { label: 'Aperture', value: currentEXIF.aperture },
                          { label: 'Shutter', value: currentEXIF.shutter },
                          { label: 'ISO', value: currentEXIF.iso },
                          { label: 'Focal', value: currentEXIF.focalLength }
                        ].map(item => (
                          <div key={item.label} className="space-y-1">
                            <div className="text-xs text-muted-foreground">{item.label}</div>
                            <div className="text-sm font-semibold">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <EXIFInsightPanel genre="Portrait" currentSettings={currentEXIF} currentPhoto={currentPhoto} currentScore={84} />
                  </>
                )}
              </div>
            </div>
          </div>
        );

      // ==================== OVERLAYS ====================
      case 'overlays-a':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Visual Overlays</h2>
            </div>
            
            <div className="w-full h-60 rounded-2xl relative overflow-hidden shadow-lg">
              <ImageWithFallback src={currentPhoto} alt="Portrait with overlays" className="w-full h-full object-cover" />
              
              {overlayStates.thirds && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-primary/40 border-dashed" />
                  ))}
                </div>
              )}
              
              {overlayStates.horizon && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="w-full h-0.5 bg-accent shadow-lg" />
                  <div className="absolute right-3 bg-accent text-white px-2 py-0.5 rounded text-xs font-medium">-2.3deg</div>
                </div>
              )}
              
              {overlayStates.crop && (
                <div className="absolute inset-5 border-2 border-dashed border-warning rounded-lg pointer-events-none">
                  <div className="absolute -top-5 left-0 bg-warning text-white px-2 py-0.5 rounded text-xs font-medium">Suggested Crop</div>
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-warning rounded-full" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-warning rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full" />
                </div>
              )}
              
              {overlayStates.lines && (
                <>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#2962FF" />
                      </marker>
                    </defs>
                    <line x1="10" y1="80" x2="50" y2="20" stroke="#2962FF" strokeWidth="0.5" strokeDasharray="2,1" markerEnd="url(#arrow)" />
                    <line x1="90" y1="85" x2="50" y2="20" stroke="#2962FF" strokeWidth="0.5" strokeDasharray="2,1" markerEnd="url(#arrow)" />
                  </svg>
                  <div className="absolute top-3 left-3 bg-primary text-white px-2 py-0.5 rounded text-xs font-medium">Leading Lines</div>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <OverlayButton icon={<Grid3X3 className="h-5 w-5" />} label="Rule of Thirds" active={overlayStates.thirds} onClick={() => setOverlayStates(prev => ({ ...prev, thirds: !prev.thirds }))} />
              <OverlayButton icon={<div className="w-5 h-px bg-current rounded" />} label="Horizon Line" active={overlayStates.horizon} onClick={() => setOverlayStates(prev => ({ ...prev, horizon: !prev.horizon }))} />
              <OverlayButton icon={<div className="w-5 h-5 border-2 border-dashed border-current rounded" />} label="Crop Guide" active={overlayStates.crop} onClick={() => setOverlayStates(prev => ({ ...prev, crop: !prev.crop }))} />
              <OverlayButton icon={<Compass className="h-5 w-5" />} label="Leading Lines" active={overlayStates.lines} onClick={() => setOverlayStates(prev => ({ ...prev, lines: !prev.lines }))} />
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => setOverlayStates({ thirds: false, horizon: false, crop: false, lines: false })}>
                Reset All
              </Button>
              <Button className="h-11 rounded-xl" onClick={() => navigate('learning')}>
                Learn More
              </Button>
            </div>
          </div>
        );

      case 'overlays-b':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Visual Overlays</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <div className="w-full h-60 rounded-2xl relative overflow-hidden shadow-lg">
                  <ImageWithFallback src={currentPhoto} alt="Portrait with overlays" className="w-full h-full object-cover" />
                  {overlayStates.thirds && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-primary/40 border-dashed" />
                      ))}
                    </div>
                  )}
                  {overlayStates.horizon && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <div className="w-full h-0.5 bg-accent shadow-lg" />
                    </div>
                  )}
                </div>
              </div>
              
              <SidePanelOverlays
                overlayStates={overlayStates}
                onOverlayChange={(overlay, value) => setOverlayStates(prev => ({ ...prev, [overlay]: value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => setOverlayStates({ thirds: false, horizon: false, crop: false, lines: false })}>
                Reset All
              </Button>
              <Button className="h-11 rounded-xl" onClick={() => navigate('learning')}>
                Learn More
              </Button>
            </div>
          </div>
        );

      // ==================== LEARNING ====================
      case 'learning':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('overlays-a')}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-semibold">Learn Photography</h2>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => navigate('learning-journey')}>
                <Award className="h-3.5 w-3.5 mr-1" />
                Journey
              </Button>
            </div>
            
            <Card className="p-4 space-y-3 border-primary/10 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">Today's Micro-Lesson</h3>
              </div>
              <div className="aspect-video bg-muted/50 rounded-xl overflow-hidden">
                <ImageWithFallback 
                  src={currentPhoto}
                  alt="Rule of thirds"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary">Understanding the Rule of Thirds</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Learn how to position key elements along grid lines for more dynamic compositions.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium">5 min read</span>
                  <Button size="sm" className="h-7 text-xs bg-gradient-to-r from-primary to-accent rounded-lg">
                    Start Lesson
                  </Button>
                </div>
              </div>
            </Card>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Lesson Library</h3>
              <div className="flex space-x-3 overflow-x-auto pb-1 -mx-1 px-1">
                {[
                  { title: 'Portrait Lighting', description: 'Master natural light', duration: '8 min' },
                  { title: 'Street Photography', description: 'Capture candid moments', duration: '12 min' },
                  { title: 'Landscape Basics', description: 'Epic outdoor shots', duration: '15 min' },
                  { title: 'Night Photography', description: 'Low light mastery', duration: '18 min' }
                ].map((lesson, i) => (
                  <LearningCard key={i} title={lesson.title} description={lesson.description} duration={lesson.duration} />
                ))}
              </div>
            </div>
            
            <Card className="p-4 space-y-3 bg-muted/30 border-none rounded-xl">
              <blockquote className="text-sm italic leading-relaxed">"The best camera is the one that's with you."</blockquote>
              <cite className="text-xs text-muted-foreground">— Chase Jarvis</cite>
            </Card>
            
            <Button className="w-full h-11 rounded-xl" onClick={() => navigate('practice')}>
              View Practice Plan
            </Button>
          </div>
        );

      case 'learning-empty':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('overlays-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Learn Photography</h2>
            </div>
            <EmptyState icon="📚" title="No lessons unlocked yet" description="Upload photos to reveal personalized practice tips." actionLabel="Upload Photo" onAction={() => navigate('home')} />
          </div>
        );

      // ==================== PRACTICE ====================
      case 'practice':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('learning')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Practice Plan</h2>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Weekly Drills</h3>
              <div className="space-y-2.5">
                <DrillCard title="Rule of Thirds Practice" description="Take 10 photos using rule of thirds" completed={true} />
                <DrillCard title="Golden Hour Portraits" description="Capture 5 portraits during golden hour" completed={true} />
                <DrillCard title="Leading Lines Challenge" description="Find and photograph 8 leading lines" completed={false} />
                <DrillCard title="Depth of Field Experiment" description="Same subject at f/1.4, f/2.8, f/5.6, f/11" completed={false} />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Skill Progress</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { skill: 'Composition', score: 78, color: '#00C853' },
                  { skill: 'Lighting', score: 65, color: '#FF6D00' },
                  { skill: 'Framing', score: 82, color: '#2962FF' },
                  { skill: 'Exposure', score: 71, color: '#7C4DFF' }
                ].map((item) => (
                  <Card key={item.skill} className="p-4 text-center space-y-2 bg-muted/30 border-none rounded-xl">
                    <h4 className="text-xs text-muted-foreground uppercase tracking-wider">{item.skill}</h4>
                    <div className="tabular-nums" style={{ color: item.color, fontSize: '1.5rem', fontWeight: 700 }}>{item.score}</div>
                    <div className="w-full h-1.5 bg-muted rounded-full">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => navigate('learning-journey')}>
                <Award className="h-4 w-4 mr-1.5" />
                Journey
              </Button>
              <Button className="h-11 rounded-xl">Start Practice</Button>
            </div>
          </div>
        );

      case 'practice-empty':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('learning')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Practice Plan</h2>
            </div>
            <EmptyState icon="🎯" title="Drills unlock after 3 critiques" description="Upload more photos to unlock personalized practice drills." actionLabel="Upload Photo" onAction={() => navigate('home')} />
          </div>
        );

      case 'missing-exif':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Camera Data</h2>
            </div>
            <ErrorState title="No camera data found" description="This photo doesn't contain EXIF metadata. Here are general tips instead." actionLabel="View General Tips" onRetry={() => navigate('details-a')} onCancel={() => navigate('result-a')} variant="default" />
          </div>
        );

      // ==================== EXPORT ====================
      case 'export':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('result-a')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Export Critique Card</h2>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Preview</h3>
              <div className="flex justify-center">
                <ExportCard
                  imageUrl={currentPhoto}
                  score={analysisResult ? analysisResult.overallScore : 84}
                  genre={selectedGenres[0] || "Portrait"}
                  confidence={94}
                  scores={analysisResult ? analysisResult.scores : { framing: 88, composition: 85, lighting: 76, exposure: 87 }}
                  exifData={currentEXIF}
                  format="mobile"
                  works={analysisResult ? analysisResult.works : undefined}
                  improve={analysisResult ? analysisResult.improve : undefined}
                  reshoot={analysisResult ? analysisResult.reshoot : undefined}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Export Options</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="outline" className="h-16 flex flex-col space-y-1 rounded-xl border-primary/15">
                  <div className="text-xl">📱</div>
                  <span className="text-xs">Social Media</span>
                  <span className="text-xs text-muted-foreground">1080x1350</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col space-y-1 rounded-xl border-accent/15">
                  <div className="text-xl">🖨️</div>
                  <span className="text-xs">Print Ready</span>
                  <span className="text-xs text-muted-foreground">A4 Format</span>
                </Button>
              </div>
              <Button 
                className="w-full h-12 bg-gradient-to-r from-[#2962FF] to-[#00C853] shadow-lg rounded-xl" 
                onClick={() => {
                  const genreLabel = selectedGenres[0] || "Portrait";
                  const scoreValue = analysisResult ? analysisResult.overallScore : 84;
                  const exifAperture = currentEXIF.aperture;
                  const exifShutter = currentEXIF.shutter;
                  const exifISO = currentEXIF.iso;
                  const exifFocal = currentEXIF.focalLength;
                  const exifCamera = currentEXIF.cameraModel || "Unknown Camera";
                  const exifLens = currentEXIF.lensModel || "Unknown Lens";

                  const worksText = analysisResult 
                    ? analysisResult.works.map(w => `* **${w.title}**: ${w.content}`).join('\n')
                    : `* **Strong Subject Focus**: The shallow depth of field effectively isolates your subject from the background.\n* **Good Eye Contact**: The subject's direct gaze creates an immediate connection.`;

                  const improveText = analysisResult 
                    ? analysisResult.improve.map(w => `* **${w.title}**: ${w.content}`).join('\n')
                    : `* **Lighting Direction**: Consider repositioning your subject to avoid harsh shadows under the eyes.\n* **Background Elements**: Some distracting elements compete for attention.`;

                  const reshootText = analysisResult 
                    ? analysisResult.reshoot.map(w => `* **${w.title}**: ${w.content}`).join('\n')
                    : `* **Golden Hour Timing**: Try shooting during golden hour for warmer, flatter light.\n* **Reflector Usage**: Use a white reflector to bounce light into shadow areas.`;

                  const markdownContent = `# PhotoSensei Critique Card\n\n* **Genre**: ${genreLabel}\n* **Overall Score**: ${scoreValue}/100\n* **Camera Model**: ${exifCamera}\n* **Lens**: ${exifLens}\n* **EXIF**: ${exifAperture} | ${exifShutter} | ${exifISO} | ${exifFocal}\n\n---\n\n## What Works\n${worksText}\n\n## Areas to Improve\n${improveText}\n\n## Reshoot Tips\n${reshootText}\n\n---\nGenerated by PhotoSensei - AI Photography Coach\n`;

                  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `photosensei-critique-${Date.now()}.md`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download Critique Card
              </Button>
            </div>
          </div>
        );

      case 'export-error':
        return (
          <div className="px-5 pt-2 pb-4">
            <div className="flex items-center space-x-3 mb-6">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('export')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Export Failed</h2>
            </div>
            <ErrorState title="Export failed" description="We couldn't generate your critique card. Please retry or try a different format." actionLabel="Try Again" onRetry={() => navigate('export')} onCancel={() => navigate('result-a')} variant="destructive" />
          </div>
        );

      // ==================== PROGRESS ====================
      case 'progress':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Your Progress</h2>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('settings')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <UserProfile
              name={userProgressData.name}
              overallScore={userProgressData.timelineData[userProgressData.timelineData.length - 1].score}
              timelineData={userProgressData.timelineData}
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Monthly Improvement</h3>
                <span className="text-xs text-muted-foreground">October 2025</span>
              </div>
              
              <div className="space-y-2.5">
                <ProgressInsightCard pillar="Composition" improvement={userProgressData.pillarTrends.composition.improvement} timeframe="This month" currentScore={userProgressData.pillarTrends.composition.current} recommendation={userProgressData.recommendations.Composition} />
                <ProgressInsightCard pillar="Exposure" improvement={userProgressData.pillarTrends.exposure.improvement} timeframe="This month" currentScore={userProgressData.pillarTrends.exposure.current} recommendation={userProgressData.recommendations.Exposure} />
                <ProgressInsightCard pillar="Framing" improvement={userProgressData.pillarTrends.framing.improvement} timeframe="This month" currentScore={userProgressData.pillarTrends.framing.current} recommendation={userProgressData.recommendations.Framing} />
                <ProgressInsightCard pillar="Lighting" improvement={userProgressData.pillarTrends.lighting.improvement} timeframe="This month" currentScore={userProgressData.pillarTrends.lighting.current} recommendation={userProgressData.recommendations.Lighting} />
              </div>
            </div>
            
            <AdaptiveFeedback
              weakestArea={userProgressData.weakestArea}
              currentScore={userProgressData.pillarTrends.lighting.current}
              targetScore={85}
              personalizedTip={userProgressData.recommendations[userProgressData.weakestArea]}
            />
            
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Pillar Trends</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(userProgressData.pillarTrends).map(([pillar, data]) => (
                  <Card key={pillar} className="p-3 space-y-1.5 bg-muted/10 border border-white/5 rounded-none shadow-none">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{pillar}</h4>
                    <MiniTimelineChart 
                      data={userProgressData.timelineData.map((d, i) => ({
                        date: d.date,
                        score: data.current + (Math.random() * 10 - 5)
                      }))}
                      pillar={pillar as any}
                    />
                  </Card>
                ))}
              </div>
            </div>
            
            <Button variant="leica" className="w-full h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('practice')}>
              View Practice Plan
            </Button>
          </div>
        );

      // ==================== LIVE SHOOT ====================
      case 'live-shoot':
        return (
          <div className="w-full h-screen">
            <LiveShootMode
              onCapture={(imageData) => {
                const newCapture = {
                  id: Date.now().toString(),
                  imageUrl: imageData,
                  timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
                  exposureHint: Math.random() > 0.5 ? 'Underexposed' : 'Good exposure',
                  tilt: (Math.random() - 0.5) * 6
                };
                setLiveSessionCaptures(prev => [newCapture, ...prev]);
                navigate('live-session');
              }}
              onClose={() => navigate('home')}
            />
          </div>
        );

      // ==================== LIVE SESSION ====================
      case 'live-session':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('home')}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="font-semibold text-sm uppercase tracking-wider text-foreground">Live Session</h2>
              </div>
              <Button variant="leica" size="sm" className="h-8 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('live-shoot')}>
                <Camera className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </div>
            
            {liveSessionCaptures.length === 0 ? (
              <EmptyState icon="📸" title="No live captures yet" description="Use Live Shoot mode to capture photos with real-time guidance." actionLabel="Start Live Shoot" onAction={() => navigate('live-shoot')} />
            ) : (
              <>
                <Card className="p-3 bg-muted/10 border border-white/5 rounded-none shadow-none">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 bg-foreground/10 rounded-none flex items-center justify-center">
                      <Camera className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Session Active</h3>
                      <p className="text-xs text-muted-foreground font-mono">{liveSessionCaptures.length} capture{liveSessionCaptures.length !== 1 ? 's' : ''} ready</p>
                    </div>
                  </div>
                </Card>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Captured Photos</h3>
                  <div className="space-y-2.5">
                    {liveSessionCaptures.map((capture) => (
                      <LiveSessionCard
                        key={capture.id}
                        imageUrl={capture.imageUrl}
                        timestamp={capture.timestamp}
                        exposureHint={capture.exposureHint}
                        tilt={capture.tilt}
                        onAnalyze={() => {
                          setCurrentPhoto(capture.imageUrl);
                          const base64 = capture.imageUrl.split(',')[1];
                          setPhotoBase64(base64);
                          setPhotoMimeType("image/jpeg");
                          setCurrentEXIF({
                            aperture: 'f/2.0',
                            shutter: '1/250s',
                            iso: '200',
                            focalLength: '26mm',
                            cameraModel: 'Smartphone Front Camera',
                            lensModel: 'Wide Lens'
                          });
                          navigate('loading');
                        }}
                        onDelete={() => {
                          setLiveSessionCaptures(prev => prev.filter(c => c.id !== capture.id));
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      // ==================== COMMUNITY ====================
      case 'community':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Community</h2>
              <Button size="sm" className="h-8 rounded-lg text-xs bg-gradient-to-r from-primary to-accent" onClick={() => navigate('share-community')}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
            </div>

            <Card className="p-3 bg-gradient-to-r from-primary/8 to-accent/8 border-none rounded-xl">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Share & Learn Together</h3>
                  <p className="text-xs text-muted-foreground">Get feedback from photographers worldwide</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Recent Posts</h3>
              <div className="space-y-3">
                {communityPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    {...post}
                    onViewDetails={() => {
                      setSelectedCommunityPost(post.id);
                      navigate('community-post');
                    }}
                    onComment={() => {
                      setSelectedCommunityPost(post.id);
                      navigate('community-post');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      // ==================== COMMUNITY POST ====================
      case 'community-post':
        const currentPost = communityPosts.find(p => p.id === selectedCommunityPost);
        const postFeedback = communityFeedback[selectedCommunityPost || ''] || [];
        if (!currentPost) return <div>Post not found</div>;

        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('community')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Community Feedback</h2>
            </div>

            <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg">
              <ImageWithFallback src={currentPost.imageUrl} alt={`${currentPost.genre} photo`} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm text-white/70 text-xs px-1.5 py-0.5 rounded">PhotoSensei</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">{currentPost.author.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{currentPost.author}</h4>
                  <p className="text-xs text-muted-foreground">{currentPost.timestamp}</p>
                </div>
              </div>
              <GenreBadge genre={currentPost.genre} />
            </div>

            <DualScoreMeter aiScore={currentPost.aiScore} communityScore={currentPost.communityScore} communityCount={postFeedback.length} />

            <Card className="p-3 space-y-2.5 bg-muted/30 border-none rounded-xl">
              <Label className="text-xs">Add Your Feedback</Label>
              <Textarea placeholder="Share constructive feedback..." maxLength={280} className="resize-none h-16 bg-background rounded-lg text-sm" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Be respectful and constructive</span>
                <Button size="sm" className="h-7 text-xs rounded-lg bg-gradient-to-r from-primary to-accent">Post</Button>
              </div>
            </Card>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Feedback</h3>
                <span className="text-xs text-muted-foreground">{postFeedback.length} comments</span>
              </div>
              {postFeedback.length === 0 ? (
                <EmptyState icon="💬" title="No feedback yet" description="Be the first to share constructive feedback." actionLabel="Add Feedback" onAction={() => {}} />
              ) : (
                <div className="space-y-2.5">
                  {postFeedback.map((feedback) => (
                    <CommunityFeedbackCard
                      key={feedback.id}
                      {...feedback}
                      onUpvote={() => {
                        setCommunityFeedback(prev => ({
                          ...prev,
                          [selectedCommunityPost || '']: prev[selectedCommunityPost || ''].map(f =>
                            f.id === feedback.id
                              ? { ...f, upvotes: f.isUpvoted ? f.upvotes - 1 : f.upvotes + 1, isUpvoted: !f.isUpvoted }
                              : f
                          )
                        }));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      // ==================== SHARE ====================
      case 'share-community':
        return (
          <div className="px-5 pt-2 pb-4">
            <ShareToCommunityDialog
              imageUrl={currentPhoto}
              aiScore={84}
              genre="Portrait Photography"
              onShare={(options) => {
                navigate('community');
              }}
              onCancel={() => navigate('community')}
            />
          </div>
        );

      // ==================== LEARNING JOURNEY ====================
      case 'learning-journey':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-foreground">Learning Journey</h2>
              <Button variant="leica" size="sm" className="h-8 text-xs uppercase tracking-widest font-semibold" onClick={() => navigate('certification-path')}>
                <GraduationCap className="h-3.5 w-3.5 mr-1" />
                Certs
              </Button>
            </div>

            <Card className="p-3 bg-muted/10 border border-white/5 rounded-none shadow-none">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-foreground/10 rounded-none flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Personalized Path</h3>
                  <p className="text-xs text-muted-foreground">Lessons unlock based on your critiques</p>
                </div>
              </div>
            </Card>

            <ReflectionPromptCard
              originalPhoto={{
                imageUrl: currentPhoto,
                score: 68,
                date: 'Sep 15, 2025',
                weaknesses: ['Lighting', 'Exposure']
              }}
              hasReshoot={false}
              onUploadReshoot={() => navigate('loading')}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Your Badges</h3>
                <span className="text-xs text-muted-foreground font-mono">{badges.filter(b => b.earned).length} / {badges.length} earned</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {badges.map((badge, index) => (
                  <BadgeCard key={index} {...badge} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Available Lessons</h3>
                <span className="text-xs text-muted-foreground font-mono">{microLessons.filter(l => l.status === 'completed').length} / {microLessons.length}</span>
              </div>
              <div className="space-y-2.5">
                {microLessons.map((lesson) => (
                  <MicroLessonCard key={lesson.id} {...lesson} onStart={() => {}} />
                ))}
              </div>
            </div>

            <Card className="p-3 bg-muted/10 border border-white/5 rounded-none shadow-none">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">Upload more photos to unlock personalized lessons based on your weaknesses</p>
            </Card>
          </div>
        );

      // ==================== CERTIFICATION ====================
      case 'certification-path':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('learning-journey')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold text-sm uppercase tracking-wider text-foreground">Certification Paths</h2>
            </div>

            <Card className="p-5 space-y-4 bg-muted/10 border border-white/5 rounded-none shadow-none">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-foreground text-background rounded-none flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Master Photographer</h3>
                  <p className="text-xs text-muted-foreground">Complete all certifications</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5 font-mono">
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">35</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">1</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">87</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Avg Score</div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Available Certifications</h3>
              <div className="space-y-2.5">
                {certifications.map((cert, index) => (
                  <CertificationPathCard
                    key={index}
                    certificationName={cert.name}
                    description={cert.description}
                    totalLessons={cert.totalLessons}
                    completedLessons={cert.completedLessons}
                    badgesRequired={cert.badgesRequired}
                    badgesEarned={cert.badgesEarned}
                    unlocked={cert.unlocked}
                    onDownloadCertificate={() => {}}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Certificate Preview</h3>
              <p className="text-xs text-muted-foreground">What your certificate looks like when unlocked</p>
              <CertificatePreview
                userName={userProgressData.name}
                certificationName="Photography Fundamentals"
                completionDate="October 25, 2025"
                lessonsCompleted={40}
                badgesEarned={4}
                overallScore={87}
                certificateId="PS-2025-AC-001234"
              />
            </div>

            <Button variant="leica" className="w-full h-11 text-xs uppercase tracking-wider font-semibold" onClick={() => navigate('learning-journey')}>
              Continue Learning
            </Button>
          </div>
        );

      // ==================== SETTINGS ====================
      case 'settings':
        return (
          <div className="px-5 pt-2 pb-4 space-y-5">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-none" onClick={() => navigate('home')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="font-semibold">Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Gemini AI API Key</h3>
                <p className="text-xs text-muted-foreground">Enter a Google AI Studio API Key to enable real photo critique analysis.</p>
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    localStorage.setItem('gemini_api_key', e.target.value);
                  }}
                  className="w-full px-3.5 py-2 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Analysis</h3>
                <SettingsToggle label="On-device Processing" description="Process images locally for better privacy" checked={settingsStates.onDevice} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, onDevice: checked }))} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Data Consent</h3>
                <div className="space-y-2">
                  <SettingsToggle label="Share Analytics" description="Help improve PhotoSensei with anonymous data" checked={settingsStates.analytics} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, analytics: checked }))} />
                  <SettingsToggle label="Photo Storage" description="Store photos for critique history" checked={settingsStates.photoStorage} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, photoStorage: checked }))} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Export Defaults</h3>
                <div className="space-y-2">
                  <SettingsToggle label="Include Original Photo" description="Add original image to critique cards" checked={settingsStates.includeOriginal} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, includeOriginal: checked }))} />
                  <SettingsToggle label="Watermark Cards" description="Add PhotoSensei branding to exports" checked={settingsStates.watermark} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, watermark: checked }))} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Genre Expertise</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Select photography genres to enable specialized analysis modules.</p>
                <GenreSelector
                  selectedGenres={selectedGenres}
                  onGenreToggle={(genre) => {
                    setSelectedGenres(prev => 
                      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
                    );
                  }}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Theme</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button 
                    variant={theme === 'light' ? 'outline' : 'ghost'} 
                    className="h-11 justify-start rounded-xl w-full"
                    onClick={() => {
                      setTheme('light');
                      document.documentElement.classList.remove('dark');
                      localStorage.setItem('theme', 'light');
                      window.dispatchEvent(new Event('theme-change'));
                    }}
                  >
                    <div className="w-4 h-4 bg-white border border-border rounded-full mr-2.5" />
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'outline' : 'ghost'} 
                    className="h-11 justify-start rounded-xl w-full"
                    onClick={() => {
                      setTheme('dark');
                      document.documentElement.classList.add('dark');
                      localStorage.setItem('theme', 'dark');
                      window.dispatchEvent(new Event('theme-change'));
                    }}
                  >
                    <div className="w-4 h-4 bg-foreground rounded-full mr-2.5" />
                    Dark
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider">Accessibility</h3>
                <div className="space-y-2">
                  <SettingsToggle label="Large Text" description="Increase text size throughout the app" checked={settingsStates.largeText} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, largeText: checked }))} />
                  <SettingsToggle label="High Contrast" description="Enhance visual contrast" checked={settingsStates.highContrast} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, highContrast: checked }))} />
                  <SettingsToggle label="Reduce Motion" description="Minimize animations and transitions" checked={settingsStates.reduceMotion} onCheckedChange={(checked) => setSettingsStates(prev => ({ ...prev, reduceMotion: checked }))} />
                </div>
              </div>

              {/* App info footer */}
              <div className="text-center py-4 space-y-1">
                <p className="text-xs text-muted-foreground">PhotoSensei v2.0.0</p>
                <p className="text-xs text-muted-foreground/60">AI-Powered Photography Coach</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  const showStatusBar = !NO_STATUS_BAR_SCREENS.has(currentScreen);
  const showTabBar = TAB_BAR_SCREENS.has(currentScreen);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-background relative flex flex-col shadow-lg border-x border-border/10">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* Main Content */}
      <div 
        className={`flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-150 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          scrollbarWidth: 'none',
          maxHeight: showTabBar ? 'calc(100vh - 64px)' : '100vh'
        }}
      >
        {renderScreen()}
      </div>
      
      {/* Bottom Tab Bar */}
      {showTabBar && (
        <BottomTabBar
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  );
}
