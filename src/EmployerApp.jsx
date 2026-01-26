import { useState, useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import {
  Home, Briefcase, User, Phone, MapPin, Clock, IndianRupee,
  CheckCircle, X, Heart, ChevronRight, ChevronLeft, Plus,
  Building2, Users, Star, MessageCircle, Calendar, Filter,
  Edit, Camera, LogOut, HelpCircle, ArrowRight, ArrowLeft,
  Zap, Sun, Moon, Coffee, Sunset,
  Search, Bell, Share2, Copy, Check
} from 'lucide-react';

// API Base URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://api.relayy.world');

// Predefined roles that match worker roles
const AVAILABLE_ROLES = [
  { id: 'delivery', name: 'Delivery Boy', nameHi: 'Delivery Boy', icon: '🛵' },
  { id: 'waiter', name: 'Waiter', nameHi: 'Waiter', icon: '🍽️' },
  { id: 'cook', name: 'Cook/Chef', nameHi: 'Cook', icon: '👨‍🍳' },
  { id: 'helper', name: 'Helper', nameHi: 'Helper', icon: '🙋' },
  { id: 'driver', name: 'Driver', nameHi: 'Driver', icon: '🚗' },
  { id: 'security', name: 'Security Guard', nameHi: 'Security', icon: '💂' },
  { id: 'cleaner', name: 'Cleaner', nameHi: 'Safai', icon: '🧹' },
  { id: 'packer', name: 'Packer', nameHi: 'Packer', icon: '📦' },
  { id: 'salesperson', name: 'Salesperson', nameHi: 'Sales', icon: '🛒' },
  { id: 'cashier', name: 'Cashier', nameHi: 'Cashier', icon: '💰' },
  { id: 'receptionist', name: 'Receptionist', nameHi: 'Reception', icon: '📞' },
  { id: 'warehouse', name: 'Warehouse Staff', nameHi: 'Godown', icon: '🏭' },
];

// Business types
const BUSINESS_TYPES = [
  { id: 'restaurant', name: 'Restaurant/Cafe', icon: '🍽️' },
  { id: 'shop', name: 'Shop/Retail', icon: '🏪' },
  { id: 'household', name: 'Household', icon: '🏠' },
  { id: 'delivery', name: 'Delivery/Logistics', icon: '🚚' },
  { id: 'construction', name: 'Construction', icon: '🏗️' },
  { id: 'events', name: 'Events/Catering', icon: '🎉' },
  { id: 'office', name: 'Office/Corporate', icon: '🏢' },
  { id: 'other', name: 'Other', icon: '📋' },
];

// Urgency options
const URGENCY_OPTIONS = [
  { id: 'instant', name: 'Abhi turant', nameEn: 'Instant (ASAP)', icon: <Zap className="w-4 h-4" />, color: 'red' },
  { id: 'same_day', name: 'Aaj hi', nameEn: 'Today', icon: <Sun className="w-4 h-4" />, color: 'orange' },
  { id: 'next_day', name: 'Kal', nameEn: 'Tomorrow', icon: <Sunset className="w-4 h-4" />, color: 'yellow' },
  { id: 'this_week', name: 'Is hafte', nameEn: 'This Week', icon: <Calendar className="w-4 h-4" />, color: 'blue' },
  { id: 'flexible', name: 'Koi jaldi nahi', nameEn: 'Flexible', icon: <Coffee className="w-4 h-4" />, color: 'green' },
];

// Duration options
const DURATION_OPTIONS = [
  { id: '2_4_hours', name: '2-4 hours', value: 3, unit: 'hours' },
  { id: 'half_day', name: 'Half Day (4-6 hrs)', value: 5, unit: 'hours' },
  { id: 'full_day', name: 'Full Day', value: 8, unit: 'hours' },
  { id: 'few_days', name: '2-3 Days', value: 3, unit: 'days' },
  { id: 'one_week', name: '1 Week', value: 7, unit: 'days' },
  { id: 'one_month', name: '1 Month', value: 1, unit: 'months' },
  { id: 'ongoing', name: 'Ongoing', value: 0, unit: 'ongoing' },
];

// Shift options
const SHIFT_OPTIONS = [
  { id: 'morning', name: 'Morning', nameHi: 'Subah', time: '6 AM - 12 PM', icon: <Sun className="w-4 h-4" /> },
  { id: 'afternoon', name: 'Afternoon', nameHi: 'Dopahar', time: '12 PM - 6 PM', icon: <Coffee className="w-4 h-4" /> },
  { id: 'evening', name: 'Evening', nameHi: 'Shaam', time: '6 PM - 10 PM', icon: <Sunset className="w-4 h-4" /> },
  { id: 'night', name: 'Night', nameHi: 'Raat', time: '10 PM - 6 AM', icon: <Moon className="w-4 h-4" /> },
  { id: 'full_day', name: 'Full Day', nameHi: 'Poora din', time: '9 AM - 6 PM', icon: <Clock className="w-4 h-4" /> },
  { id: 'flexible', name: 'Flexible', nameHi: 'Flexible', time: 'As needed', icon: <CheckCircle className="w-4 h-4" /> },
];

// Mock candidates data (in real app, comes from API)
const MOCK_CANDIDATES = [
  {
    id: '1',
    name: 'Ravi Kumar',
    photoURL: null,
    experience: '2 years',
    experienceYears: 2,
    skills: ['Waiter', 'Cashier', 'Billing'],
    languages: ['Hindi', 'English'],
    location: 'Sector 18, Gurgaon',
    distance: '2.5 km',
    available: true,
    availableWhen: 'Immediately',
    rating: 4.8,
    jobsCompleted: 12,
    verified: true,
    expectedPay: '500/day',
    bio: 'Main 2 saal se waiter ka kaam kar raha hoon. Punctual aur hardworking hoon.',
  },
  {
    id: '2',
    name: 'Amit Singh',
    photoURL: null,
    experience: '3 years',
    experienceYears: 3,
    skills: ['Delivery Boy', 'Driver'],
    languages: ['Hindi'],
    location: 'Sector 14, Gurgaon',
    distance: '3.2 km',
    available: true,
    availableWhen: 'From tomorrow',
    rating: 4.5,
    jobsCompleted: 28,
    verified: true,
    expectedPay: '400/day',
    bio: 'Delivery aur driving mein expert. Apni bike hai.',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    photoURL: null,
    experience: '1 year',
    experienceYears: 1,
    skills: ['Helper', 'Cleaner', 'Cook'],
    languages: ['Hindi', 'English'],
    location: 'Sector 22, Gurgaon',
    distance: '1.8 km',
    available: true,
    availableWhen: 'Immediately',
    rating: 4.9,
    jobsCompleted: 8,
    verified: true,
    expectedPay: '450/day',
    bio: 'Ghar ka kaam mein experienced. Cooking bhi aati hai.',
  },
  {
    id: '4',
    name: 'Suresh Yadav',
    photoURL: null,
    experience: '5 years',
    experienceYears: 5,
    skills: ['Cook', 'Chef'],
    languages: ['Hindi'],
    location: 'Sector 29, Gurgaon',
    distance: '0.5 km',
    available: false,
    availableWhen: 'Next week',
    rating: 4.7,
    jobsCompleted: 45,
    verified: true,
    expectedPay: '800/day',
    bio: 'Professional cook. North Indian cuisine specialist.',
  },
  {
    id: '5',
    name: 'Deepak Verma',
    photoURL: null,
    experience: 'Fresher',
    experienceYears: 0,
    skills: ['Packer', 'Helper', 'Warehouse Staff'],
    languages: ['Hindi'],
    location: 'Sector 31, Gurgaon',
    distance: '4.1 km',
    available: true,
    availableWhen: 'Immediately',
    rating: 0,
    jobsCompleted: 0,
    verified: false,
    expectedPay: '350/day',
    bio: 'Mehnat karne ko ready. Fast learner hoon.',
  },
];

const EmployerApp = ({ onSwitchToWorker }) => {
  // ==================== AUTH STATE ====================
  const [authStage, setAuthStage] = useState('idle'); // idle, phone, otp, profile-setup, verified
  const [authPhone, setAuthPhone] = useState('');
  const [authCountryCode, setAuthCountryCode] = useState('91');
  const [authOtp, setAuthOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // ==================== EMPLOYER PROFILE ====================
  const [employerProfile, setEmployerProfile] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    photoURL: null,
    location: '',
    address: '',
    gstNumber: '',
    verified: false,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    totalHires: 0,
    activeJobs: 0,
    rating: 0,
  });

  // Profile setup state
  const [profileSetupStep, setProfileSetupStep] = useState(1);
  const [profileSetupBusinessType, setProfileSetupBusinessType] = useState('');
  const [profileSetupBusinessName, setProfileSetupBusinessName] = useState('');
  const [profileSetupOwnerName, setProfileSetupOwnerName] = useState('');
  const [profileSetupPhoto, setProfileSetupPhoto] = useState(null);

  // ==================== JOB POSTING ====================
  const [showPostJob, setShowPostJob] = useState(false);
  const [postJobStep, setPostJobStep] = useState(1);
  const [jobDraft, setJobDraft] = useState({
    role: null,
    customRole: '',
    jobType: 'full_time',
    urgency: 'same_day',
    duration: null,
    shift: 'full_day',
    shiftTiming: '',
    paymentType: 'daily',
    budgetMin: '',
    budgetMax: '',
    negotiable: true,
    location: '',
    workersNeeded: 1,
    experience: 'fresher_ok',
    languages: ['Hindi'],
    gender: 'any',
    description: '',
  });

  // ==================== MY JOBS ====================
  const [myJobs, setMyJobs] = useState([]); // Loaded from localStorage
  const [selectedJob, setSelectedJob] = useState(null);

  // ==================== CANDIDATES ====================
  const [candidates, setCandidates] = useState([]); // Real workers from API
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Swipe refs
  const cardRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const wasSwipe = useRef(false);

  // ==================== MATCHES ====================
  const [matches, setMatches] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState(null);

  // ==================== NAVIGATION ====================
  const [activeTab, setActiveTab] = useState('home');

  // ==================== UI STATE ====================
  const [notifications, setNotifications] = useState([]);
  const [showCallScheduler, setShowCallScheduler] = useState(false);

  // ==================== LOAD SESSION ====================
  useEffect(() => {
    const loadSession = async () => {
      const savedSession = localStorage.getItem('switch_employer_session_v1');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          if (session.userId && session.sessionToken) {
            setUserId(session.userId);
            setSessionToken(session.sessionToken);
            setAuthStage('verified');

            // Load employer profile
            const savedProfile = localStorage.getItem(`employer_${session.userId}`);
            if (savedProfile) {
              setEmployerProfile(JSON.parse(savedProfile));
            }

            // Load employer's posted jobs from shared storage
            loadMyJobs(session.userId);
          }
        } catch (err) {
          console.warn('Failed to restore employer session', err);
        }
      }

      if (!savedSession) {
        setAuthStage('phone');
      }
    };

    loadSession();
  }, []);

  // Load employer's jobs from localStorage
  const loadMyJobs = (employerId) => {
    try {
      const allJobs = JSON.parse(localStorage.getItem('switch_posted_jobs') || '[]');
      // Filter jobs by this employer
      const myPostedJobs = allJobs.filter(job => job.employerId === employerId);
      if (myPostedJobs.length > 0) {
        setMyJobs(myPostedJobs);
        console.log(`✅ Loaded ${myPostedJobs.length} of your jobs`);
      }
    } catch (err) {
      console.warn('Failed to load employer jobs', err);
    }
  };

  // Periodically refresh jobs to get updated application counts
  useEffect(() => {
    if (userId && authStage === 'verified') {
      const refreshInterval = setInterval(() => {
        loadMyJobs(userId);
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [userId, authStage]);

  // ==================== LOAD AVAILABLE WORKERS ====================

  // Fetch available workers from the API
  const loadAvailableWorkers = async () => {
    setCandidatesLoading(true);
    try {
      // Try to fetch available workers from API
      const res = await fetch(`${API_BASE}/api/switch/available-workers`);
      if (res.ok) {
        const data = await res.json();
        const workers = data.workers || [];

        // Transform API response to candidate format
        const formattedWorkers = workers.map(worker => ({
          id: worker.userId || worker.id,
          name: worker.name || 'Worker',
          photoURL: worker.photoURL || null,
          experience: worker.experience || 'Not specified',
          experienceYears: parseExperienceYears(worker.experience),
          skills: worker.preferredRoles || [],
          languages: worker.languages || ['Hindi'],
          location: worker.location || 'Gurgaon',
          distance: calculateDistance(worker.location),
          available: worker.isAvailable !== false,
          availableWhen: worker.isAvailable ? 'Immediately' : 'Not available',
          rating: worker.rating || 0,
          jobsCompleted: worker.jobsCompleted || 0,
          verified: worker.verified || false,
          expectedPay: worker.expectedPay || 'Negotiable',
          bio: worker.bio || `${worker.experience || ''} experience. ${(worker.preferredRoles || []).join(', ')}`,
          phone: worker.phone || '',
        }));

        if (formattedWorkers.length > 0) {
          setCandidates(formattedWorkers);
          console.log(`✅ Loaded ${formattedWorkers.length} workers from API`);
          return;
        }
      }
    } catch (err) {
      console.warn('API fetch failed, trying localStorage', err);
    }

    // Fallback: Load workers from localStorage (those who have applied or signed up)
    try {
      // Get workers who have applied to jobs
      const postedJobs = JSON.parse(localStorage.getItem('switch_posted_jobs') || '[]');
      const appliedWorkers = [];
      const seenIds = new Set();

      for (const job of postedJobs) {
        const applications = job.workerApplications || [];
        for (const app of applications) {
          if (!seenIds.has(app.odId)) {
            seenIds.add(app.odId);
            appliedWorkers.push({
              id: app.odId,
              name: app.workerName || 'Worker',
              photoURL: app.workerPhoto || null,
              experience: app.workerExperience || 'Not specified',
              experienceYears: parseExperienceYears(app.workerExperience),
              skills: app.workerSkills || [],
              languages: app.workerLanguages || ['Hindi'],
              location: app.workerLocation || 'Gurgaon',
              distance: calculateDistance(app.workerLocation),
              available: app.workerIsAvailable !== false,
              availableWhen: app.workerIsAvailable ? 'Applied recently' : 'Not available',
              rating: 0,
              jobsCompleted: 0,
              verified: app.workerVerified || false,
              expectedPay: 'Negotiable',
              bio: `Applied to: ${job.title || job.role?.name || 'your job'}`,
              phone: app.workerPhone || '',
              appliedToJobId: job.id,
            });
          }
        }
      }

      // Also try to load profiles from localStorage cache
      const cachedProfiles = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_') && !key.includes('employer')) {
          try {
            const profile = JSON.parse(localStorage.getItem(key));
            if (profile && profile.name && profile.isAvailable !== false) {
              const userId = key.replace('user_', '');
              if (!seenIds.has(userId)) {
                seenIds.add(userId);
                cachedProfiles.push({
                  id: userId,
                  name: profile.name || 'Worker',
                  photoURL: profile.photoURL || null,
                  experience: profile.experience || 'Not specified',
                  experienceYears: parseExperienceYears(profile.experience),
                  skills: profile.preferredRoles || [],
                  languages: profile.languages || ['Hindi'],
                  location: profile.location || 'Gurgaon',
                  distance: calculateDistance(profile.location),
                  available: profile.isAvailable !== false,
                  availableWhen: profile.isAvailable ? 'Immediately' : 'Not available',
                  rating: 0,
                  jobsCompleted: profile.totalApplied || 0,
                  verified: profile.verified || false,
                  expectedPay: 'Negotiable',
                  bio: profile.bio || `${profile.experience || 'Looking for work'}. Skills: ${(profile.preferredRoles || []).join(', ')}`,
                  phone: profile.phone || '',
                });
              }
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      }

      // Combine applied workers and cached profiles
      const allWorkers = [...appliedWorkers, ...cachedProfiles];

      if (allWorkers.length > 0) {
        setCandidates(allWorkers);
        console.log(`✅ Loaded ${allWorkers.length} workers from localStorage`);
      } else {
        // Use mock data as last resort
        setCandidates(MOCK_CANDIDATES);
        console.log('ℹ️ Using mock candidates (no real workers found)');
      }
    } catch (err) {
      console.warn('Failed to load workers, using mock data', err);
      setCandidates(MOCK_CANDIDATES);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Helper to parse experience string to years
  const parseExperienceYears = (exp) => {
    if (!exp) return 0;
    if (exp.toLowerCase().includes('fresher')) return 0;
    const match = exp.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Helper to calculate distance (placeholder - would use actual geolocation)
  const calculateDistance = (location) => {
    if (!location) return '< 5 km';
    // In real app, calculate based on lat/lng
    const distances = ['0.5 km', '1.2 km', '2.3 km', '3.5 km', '4.8 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Load workers when auth is verified
  useEffect(() => {
    if (authStage === 'verified') {
      loadAvailableWorkers();
    }
  }, [authStage]);

  // Refresh workers periodically
  useEffect(() => {
    if (authStage === 'verified') {
      const refreshInterval = setInterval(() => {
        loadAvailableWorkers();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [authStage]);

  // ==================== AUTH FUNCTIONS ====================
  const requestOtp = async () => {
    try {
      setAuthError('');
      if (!authPhone.trim() || authPhone.length < 10) {
        setAuthError('Please enter a valid 10-digit phone number');
        return;
      }
      setAuthLoading(true);

      const response = await fetch(`${API_BASE}/api/candidate-onboarding/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: authCountryCode,
          phone: authPhone.trim(),
          user_type: 'employer',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to send OTP');
      }

      setAuthStage('otp');
    } catch (err) {
      setAuthError(err.message || 'Failed to send OTP');
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setAuthError('');
      if (!authOtp.trim() || authOtp.length !== 6) {
        setAuthError('Enter the 6-digit OTP');
        return;
      }
      setAuthLoading(true);

      const res = await fetch(`${API_BASE}/api/candidate-onboarding/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: authCountryCode,
          phone: authPhone.trim(),
          otp: authOtp.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid OTP');
      }

      const backendUserId = data.user_id;
      const backendSessionToken = data.session_token;

      setUserId(backendUserId);
      setSessionToken(backendSessionToken);

      // Check if employer profile exists
      const savedProfile = localStorage.getItem(`employer_${backendUserId}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.businessName && profile.businessType) {
          setEmployerProfile(profile);
          setAuthStage('verified');
        } else {
          setAuthStage('profile-setup');
        }
      } else {
        setAuthStage('profile-setup');
      }

      localStorage.setItem('switch_employer_session_v1', JSON.stringify({
        userId: backendUserId,
        sessionToken: backendSessionToken,
        phone: authPhone.trim(),
      }));
    } catch (err) {
      setAuthError(err.message || 'Failed to verify OTP');
    } finally {
      setAuthLoading(false);
    }
  };

  const completeProfileSetup = async () => {
    if (!profileSetupBusinessType) {
      setAuthError('Please select your business type');
      return;
    }
    if (!profileSetupBusinessName.trim()) {
      setAuthError('Please enter your business name');
      return;
    }
    if (!profileSetupOwnerName.trim()) {
      setAuthError('Please enter your name');
      return;
    }

    const newProfile = {
      ...employerProfile,
      businessType: profileSetupBusinessType,
      businessName: profileSetupBusinessName.trim(),
      ownerName: profileSetupOwnerName.trim(),
      phone: `+${authCountryCode} ${authPhone}`,
    };

    setEmployerProfile(newProfile);
    localStorage.setItem(`employer_${userId}`, JSON.stringify(newProfile));
    setAuthStage('verified');

    posthog.capture('employer_profile_created', {
      user_id: userId,
      business_type: profileSetupBusinessType,
    });
  };

  // ==================== SWIPE FUNCTIONS ====================
  const handleTouchStart = (e) => {
    isDragging.current = true;
    wasSwipe.current = false;
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startY.current = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    currentX.current = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    currentY.current = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaY > 15 && absDeltaY > absDeltaX * 1.5) {
      if (cardRef.current) {
        cardRef.current.style.transform = '';
        cardRef.current.style.transition = '';
      }
      wasSwipe.current = false;
      return;
    }

    if (absDeltaX > 30 && absDeltaX > absDeltaY * 2) {
      wasSwipe.current = true;
      if (e.type === 'touchmove') {
        e.preventDefault();
      }

      if (cardRef.current) {
        const rotation = deltaX * 0.1;
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        cardRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const threshold = 80;

    isDragging.current = false;

    if (cardRef.current) {
      if (Math.abs(deltaX) > threshold && wasSwipe.current) {
        cardRef.current.style.transform = '';
        cardRef.current.style.transition = '';

        if (deltaX > 0) {
          handleSwipe('right');
        } else {
          handleSwipe('left');
        }
      } else {
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';

        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && !wasSwipe.current && candidates[currentCandidateIndex]) {
          setSelectedCandidate(candidates[currentCandidateIndex]);
          setShowCandidateDetail(true);
        }
      }
    }

    setTimeout(() => {
      wasSwipe.current = false;
    }, 100);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    const candidate = candidates[currentCandidateIndex];

    posthog.capture('employer_swiped_candidate', {
      direction,
      candidate_id: candidate?.id,
      candidate_name: candidate?.name,
    });

    if (direction === 'right') {
      // Liked - create match
      const newMatchObj = {
        id: Date.now().toString(),
        candidate,
        job: selectedJob || myJobs[0],
        matchedAt: new Date(),
        status: 'new',
        callScheduled: false,
      };
      setMatches(prev => [newMatchObj, ...prev]);
      setNewMatch(newMatchObj);
      setShowMatchModal(true);
    }

    setTimeout(() => {
      setCurrentCandidateIndex(prev => {
        const next = prev < candidates.length - 1 ? prev + 1 : 0;
        return next;
      });
      setSwipeDirection(null);
    }, 300);
  };

  // Add event listeners for swipe
  useEffect(() => {
    const card = cardRef.current;
    if (card && (activeTab === 'home' || activeTab === 'browse')) {
      card.addEventListener('mousedown', handleTouchStart);
      window.addEventListener('mousemove', handleTouchMove);
      window.addEventListener('mouseup', handleTouchEnd);
      card.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        card.removeEventListener('mousedown', handleTouchStart);
        window.removeEventListener('mousemove', handleTouchMove);
        window.removeEventListener('mouseup', handleTouchEnd);
        card.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [activeTab, currentCandidateIndex]);

  // ==================== JOB POSTING FUNCTIONS ====================
  const resetJobDraft = () => {
    setJobDraft({
      role: null,
      customRequirement: '', // Free-form requirement text
      showAllRoles: false,
      jobType: 'full_time',
      urgency: 'same_day',
      duration: null,
      shift: 'full_day',
      shiftTiming: '',
      paymentType: 'daily',
      budgetMin: '',
      budgetMax: '',
      negotiable: true,
      location: '',
      workersNeeded: 1,
      experience: 'fresher_ok',
      languages: ['Hindi'],
      gender: 'any',
      description: '',
    });
    setPostJobStep(1);
  };

  const postJob = () => {
    // Determine the title - use custom requirement or role name
    const jobTitle = jobDraft.customRequirement?.trim()
      ? jobDraft.customRequirement.trim().slice(0, 100) // Limit title length
      : jobDraft.role?.name || 'Custom Job';

    // Format salary string based on payment type
    const formatSalary = () => {
      const min = parseInt(jobDraft.budgetMin) || 0;
      const max = parseInt(jobDraft.budgetMax) || 0;
      const typeLabel = jobDraft.paymentType === 'hourly' ? '/hr' :
                       jobDraft.paymentType === 'daily' ? '/day' : '/month';
      if (min && max) {
        return `₹${min} - ₹${max}${typeLabel}`;
      } else if (max) {
        return `Up to ₹${max}${typeLabel}`;
      } else if (min) {
        return `₹${min}+${typeLabel}`;
      }
      return 'Negotiable';
    };

    // Get shift timing label
    const getShiftLabel = () => {
      const shift = SHIFT_OPTIONS.find(s => s.id === jobDraft.shift);
      return shift ? `${shift.nameHi} (${shift.time})` : 'Flexible';
    };

    // Get urgency label
    const getUrgencyLabel = () => {
      const urgency = URGENCY_OPTIONS.find(u => u.id === jobDraft.urgency);
      return urgency ? urgency.name : 'Flexible';
    };

    const newJob = {
      id: Date.now().toString(),

      // Employer-side data
      ...jobDraft,
      title: jobTitle,
      role: jobDraft.role || {
        id: 'custom',
        name: jobTitle.slice(0, 50),
        icon: '📋',
        isCustom: true,
      },
      budget: {
        min: parseInt(jobDraft.budgetMin) || 0,
        max: parseInt(jobDraft.budgetMax) || 0,
        type: jobDraft.paymentType,
        negotiable: jobDraft.negotiable,
      },
      status: 'active',
      views: 0,
      applications: 0,
      matches: 0,
      createdAt: new Date().toISOString(),

      // Worker-side compatible fields (for job cards)
      company: employerProfile.businessName || 'Local Business',
      logo: jobDraft.role?.icon || '📋',
      salary: formatSalary(),
      timing: getShiftLabel(),
      urgencyLabel: getUrgencyLabel(),
      distance: '< 5 km', // Will be calculated based on actual location
      highlights: [
        jobDraft.jobType === 'full_time' ? 'Full-time' : jobDraft.jobType === 'part_time' ? 'Part-time' : 'Gig Work',
        getUrgencyLabel(),
        jobDraft.experience === 'fresher_ok' ? 'Freshers Welcome' : `${jobDraft.experience.replace('_', ' ')} exp`,
      ].filter(Boolean),
      description: jobDraft.customRequirement || `Looking for ${jobDraft.role?.name || 'workers'}`,
      employerId: userId,
      employerName: employerProfile.ownerName || 'Employer',
      employerPhone: employerProfile.phone || '',
    };

    // Save to employer's local state
    setMyJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob);

    // Save to shared localStorage for worker app to read
    try {
      const existingJobs = JSON.parse(localStorage.getItem('switch_posted_jobs') || '[]');
      const updatedJobs = [newJob, ...existingJobs];
      localStorage.setItem('switch_posted_jobs', JSON.stringify(updatedJobs));
      console.log('✅ Job saved to shared storage for workers');
    } catch (err) {
      console.warn('Failed to save job to shared storage', err);
    }

    setShowPostJob(false);
    resetJobDraft();

    posthog.capture('employer_job_posted', {
      user_id: userId,
      job_id: newJob.id,
      role: newJob.role?.name,
      is_custom_requirement: !!jobDraft.customRequirement?.trim(),
      job_type: newJob.jobType,
      urgency: newJob.urgency,
    });

    // Show candidates for this job
    setActiveTab('browse');
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      instant: 'bg-red-100 text-red-700 border-red-200',
      same_day: 'bg-orange-100 text-orange-700 border-orange-200',
      next_day: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      this_week: 'bg-blue-100 text-blue-700 border-blue-200',
      flexible: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[urgency] || colors.flexible;
  };

  // ==================== RENDER AUTH SCREENS ====================
  if (authStage !== 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center px-4 py-6">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-center">
            <div className="text-4xl mb-3">🏢</div>
            <h1 className="text-xl font-bold text-white mb-1">Switch Business</h1>
            <p className="text-teal-50 text-xs">Hire karo, fast!</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Phone Entry */}
            {authStage === 'phone' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={authCountryCode}
                      onChange={(e) => setAuthCountryCode(e.target.value)}
                      className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    >
                      <option value="91">+91</option>
                      <option value="1">+1</option>
                    </select>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>

                {authError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {authError}
                  </div>
                )}

                <button
                  onClick={requestOtp}
                  disabled={authLoading || authPhone.length < 10}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all"
                >
                  {authLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <button
                  onClick={onSwitchToWorker}
                  className="w-full text-gray-600 text-sm hover:text-teal-600 transition"
                >
                  Looking for a job? Switch to Worker mode
                </button>
              </div>
            )}

            {/* OTP Entry */}
            {authStage === 'otp' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                  <p className="text-gray-600 text-sm">Sent to +{authCountryCode} {authPhone}</p>
                </div>

                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={authOtp[idx] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const current = authOtp.split('');
                        if (value) {
                          current[idx] = value[value.length - 1];
                          setAuthOtp(current.join('').slice(0, 6));
                          // Auto-focus next
                          const next = e.target.nextElementSibling;
                          if (next && idx < 5) next.focus();
                        } else {
                          current[idx] = '';
                          setAuthOtp(current.join(''));
                        }
                      }}
                      className="w-11 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {authError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {authError}
                  </div>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={authLoading || authOtp.length !== 6}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
                >
                  {authLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  onClick={() => { setAuthStage('phone'); setAuthOtp(''); }}
                  className="w-full text-gray-600 text-sm"
                >
                  Change phone number
                </button>
              </div>
            )}

            {/* Profile Setup */}
            {authStage === 'profile-setup' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {profileSetupStep === 1 && (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Aapka business kaisa hai?</h2>
                      <p className="text-sm text-gray-600">Select your business type</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {BUSINESS_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setProfileSetupBusinessType(type.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            profileSetupBusinessType === type.id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{type.name}</div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setProfileSetupStep(2)}
                      disabled={!profileSetupBusinessType}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
                    >
                      Next
                    </button>
                  </>
                )}

                {profileSetupStep === 2 && (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">Business Details</h2>
                      <p className="text-sm text-gray-600">Tell us about your business</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                        <input
                          type="text"
                          value={profileSetupBusinessName}
                          onChange={(e) => setProfileSetupBusinessName(e.target.value)}
                          placeholder="e.g., Sharma Restaurant"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Owner/Manager)</label>
                        <input
                          type="text"
                          value={profileSetupOwnerName}
                          onChange={(e) => setProfileSetupOwnerName(e.target.value)}
                          placeholder="e.g., Rajesh Sharma"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {authError && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {authError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setProfileSetupStep(1)}
                        className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={completeProfileSetup}
                        disabled={!profileSetupBusinessName.trim() || !profileSetupOwnerName.trim()}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50"
                      >
                        Start Hiring
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER MAIN APP ====================
  const candidate = candidates[currentCandidateIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Switch Business</h1>
              <p className="text-xs text-gray-500">Hire karo, fast!</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button onClick={() => setActiveTab('profile')} className="p-2 hover:bg-gray-100 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24">
        <div className="max-w-md mx-auto px-4 py-6">

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Post Job CTA */}
              <button
                onClick={() => { resetJobDraft(); setShowPostJob(true); }}
                className="w-full bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">Post New Requirement</h2>
                    <p className="text-teal-100 text-sm">Find workers instantly</p>
                  </div>
                </div>
              </button>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-teal-100">
                  <div className="text-2xl font-bold text-teal-600">{myJobs.filter(j => j.status === 'active').length}</div>
                  <div className="text-xs text-gray-600 mt-1">Active Jobs</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">{matches.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Matches</div>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{employerProfile.totalHires}</div>
                  <div className="text-xs text-gray-600 mt-1">Hired</div>
                </div>
              </div>

              {/* Active Jobs Preview */}
              {myJobs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Active Jobs</h3>
                  {myJobs.filter(j => j.status === 'active').slice(0, 2).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setActiveTab('browse'); }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-teal-200 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                          {job.role?.icon || '💼'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 line-clamp-2">{job.title || job.role?.name || 'Job'}</h4>
                          <p className="text-sm text-gray-600">{job.location || 'Location not set'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(job.urgency)}`}>
                              {URGENCY_OPTIONS.find(u => u.id === job.urgency)?.name || job.urgency}
                            </span>
                            <span className="text-xs text-gray-500">{job.views} views</span>
                            <span className="text-xs text-gray-500">{job.matches} matches</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Matches */}
              {matches.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Recent Matches</h3>
                  {matches.slice(0, 3).map((match) => (
                    <div
                      key={match.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {match.candidate.name[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{match.candidate.name}</h4>
                          <p className="text-sm text-gray-600">For: {match.job?.title || match.job?.role?.name || 'Job'}</p>
                        </div>
                        <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold">
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BROWSE CANDIDATES TAB */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Job selector */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {selectedJob?.title || selectedJob?.role?.name || 'Find Workers'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {candidatesLoading ? 'Loading...' : `${candidates.length} workers available`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadAvailableWorkers}
                    className="p-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                    title="Refresh workers"
                  >
                    <svg className={`w-5 h-5 text-teal-600 ${candidatesLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {candidatesLoading && candidates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading workers...</p>
                </div>
              )}

              {/* Empty State */}
              {!candidatesLoading && candidates.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
                  <p className="text-gray-600 mb-4">Post a job to attract workers, or check back later</p>
                  <button
                    onClick={() => { resetJobDraft(); setShowPostJob(true); }}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Post a Job
                  </button>
                </div>
              )}

              {/* Candidate Card */}
              {!candidatesLoading && candidate && (
                <div className="relative" style={{ height: '520px' }}>
                  <div
                    ref={cardRef}
                    className={`absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-300 ${
                      swipeDirection === 'left' ? '-translate-x-full -rotate-12 opacity-0' :
                      swipeDirection === 'right' ? 'translate-x-full rotate-12 opacity-0' : ''
                    }`}
                  >
                    {/* Photo Section */}
                    <div className="h-48 bg-gradient-to-br from-teal-400 to-emerald-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {candidate.photoURL ? (
                          <img src={candidate.photoURL} alt={candidate.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                      {candidate.verified && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-teal-500" />
                          <span className="text-xs font-semibold text-teal-700">Verified</span>
                        </div>
                      )}
                      {candidate.available && (
                        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          Available Now
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                          <p className="text-gray-600">{candidate.experience} experience</p>
                        </div>
                        {candidate.rating > 0 && (
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="font-semibold text-amber-700">{candidate.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{candidate.location}</span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{candidate.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{candidate.languages.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <IndianRupee className="w-4 h-4" />
                          <span className="text-sm">Expected: {candidate.expectedPay}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{candidate.jobsCompleted}</div>
                          <div className="text-xs text-gray-500">Jobs Done</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{candidate.rating || '-'}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-teal-600">{candidate.availableWhen}</div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Swipe Buttons */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
                    <button
                      onClick={() => handleSwipe('left')}
                      className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
                    >
                      <X className="w-8 h-8 text-red-500" />
                    </button>
                    <button
                      onClick={() => handleSwipe('right')}
                      className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-lg flex items-center justify-center hover:from-teal-600 hover:to-emerald-600 transition-all active:scale-95"
                    >
                      <Heart className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MY JOBS TAB */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Job Postings</h2>
                <button
                  onClick={() => { resetJobDraft(); setShowPostJob(true); }}
                  className="px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold whitespace-nowrap">
                  Active ({myJobs.filter(j => j.status === 'active').length})
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                  Filled
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                  Expired
                </button>
              </div>

              {/* Jobs List */}
              {myJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-4">Post your first job to start finding workers</p>
                  <button
                    onClick={() => { resetJobDraft(); setShowPostJob(true); }}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Post a Job
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                          {job.role?.icon || '💼'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 line-clamp-2">{job.title || job.role?.name || 'Job'}</h3>
                          <p className="text-sm text-gray-600">{job.jobType === 'full_time' ? 'Full-time' : job.jobType === 'part_time' ? 'Part-time' : 'Gig'}</p>
                          <p className="text-sm text-teal-600 font-semibold">
                            {job.budget?.min && job.budget?.max
                              ? `${job.budget.min}-${job.budget.max}/${job.budget.type === 'daily' ? 'day' : job.budget.type === 'monthly' ? 'month' : 'hr'}`
                              : 'Budget not set'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {job.status === 'active' ? 'Active' : job.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{job.views} views</span>
                        <span>{job.applications} applications</span>
                        <span>{job.matches} matches</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedJob(job); setActiveTab('browse'); }}
                          className="flex-1 bg-teal-50 text-teal-700 py-2 rounded-lg text-sm font-semibold"
                        >
                          View Candidates
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MATCHES TAB */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Your Matches</h2>

              {matches.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
                  <p className="text-gray-600 mb-4">Start swiping to find your perfect hire!</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Browse Candidates
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {match.candidate.name[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{match.candidate.name}</h3>
                          <p className="text-sm text-gray-600">For: {match.job?.title || match.job?.role?.name || 'Job'}</p>
                          <p className="text-xs text-gray-500">
                            Matched {new Date(match.matchedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`tel:+91${match.candidate.phone || '9876543210'}`}
                          className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" /> Call Now
                        </a>
                        <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                    {employerProfile.photoURL ? (
                      <img src={employerProfile.photoURL} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <Building2 className="w-10 h-10 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{employerProfile.businessName}</h2>
                    <p className="text-teal-100">{employerProfile.ownerName}</p>
                    <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs mt-1">
                      {employerProfile.verified ? <CheckCircle className="w-3 h-3" /> : null}
                      {employerProfile.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{employerProfile.totalHires}</div>
                    <div className="text-xs text-teal-100">Hired</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{employerProfile.rating || '-'}</div>
                    <div className="text-xs text-teal-100">Rating</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{employerProfile.activeJobs}</div>
                    <div className="text-xs text-teal-100">Active Jobs</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Edit className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Edit Business Profile</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Help & Support</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={onSwitchToWorker}
                  className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Switch to Worker Mode</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('switch_employer_session_v1');
                    localStorage.removeItem(`employer_${userId}`);
                    setUserId(null);
                    setSessionToken(null);
                    setAuthStage('phone');
                    setEmployerProfile({
                      businessName: '',
                      businessType: '',
                      ownerName: '',
                      photoURL: null,
                      location: '',
                      address: '',
                      gstNumber: '',
                      verified: false,
                      joinedDate: '',
                      totalHires: 0,
                      activeJobs: 0,
                      rating: 0,
                    });
                  }}
                  className="w-full bg-red-50 rounded-xl p-4 flex items-center justify-center shadow-sm border border-red-200"
                >
                  <LogOut className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-600">Logout</span>
                </button>
              </div>

              <div className="text-center text-xs text-gray-400 pb-4">
                Switch Business v1.0.0
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'home' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'browse' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Find</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                activeTab === 'jobs' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-medium">My Jobs</span>
              {myJobs.filter(j => j.status === 'active').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                  {myJobs.filter(j => j.status === 'active').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                activeTab === 'matches' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">Matches</span>
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'profile' ? 'bg-teal-50 text-teal-600' : 'text-gray-500'
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* POST JOB MODAL */}
      {showPostJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Post a Job</h2>
              <button onClick={() => setShowPostJob(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Requirement Input */}
              {postJobStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Aapko kya chahiye?</h3>
                    <p className="text-sm text-gray-600">Tell us what you need - any work, any requirement</p>
                  </div>

                  {/* Free-form requirement input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apni requirement likhein *
                    </label>
                    <textarea
                      value={jobDraft.customRequirement || ''}
                      onChange={(e) => setJobDraft(prev => ({ ...prev, customRequirement: e.target.value, role: null }))}
                      placeholder="Eg: Mujhe ek experienced cook chahiye jo North Indian khana bana sake, ya 2 helpers chahiye shop mein saman arrange karne ke liye..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none h-28 text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">Jitna detail doge, utna better match milega</p>
                  </div>

                  {/* OR divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm text-gray-500 font-medium">ya select karo</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Quick select popular roles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Popular Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ROLES.slice(0, 8).map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setJobDraft(prev => ({
                            ...prev,
                            role,
                            customRequirement: '' // Clear custom when selecting role
                          }))}
                          className={`px-3 py-2 rounded-full border-2 transition-all text-sm flex items-center gap-1.5 ${
                            jobDraft.role?.id === role.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 hover:border-teal-300 text-gray-700'
                          }`}
                        >
                          <span>{role.icon}</span>
                          <span>{role.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Show more roles toggle */}
                  <button
                    onClick={() => setJobDraft(prev => ({ ...prev, showAllRoles: !prev.showAllRoles }))}
                    className="text-teal-600 text-sm font-medium flex items-center gap-1"
                  >
                    {jobDraft.showAllRoles ? 'Show less' : 'Show all roles'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${jobDraft.showAllRoles ? 'rotate-90' : ''}`} />
                  </button>

                  {jobDraft.showAllRoles && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
                      {AVAILABLE_ROLES.slice(8).map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setJobDraft(prev => ({
                            ...prev,
                            role,
                            customRequirement: ''
                          }))}
                          className={`px-3 py-2 rounded-full border-2 transition-all text-sm flex items-center gap-1.5 ${
                            jobDraft.role?.id === role.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 hover:border-teal-300 text-gray-700'
                          }`}
                        >
                          <span>{role.icon}</span>
                          <span>{role.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setPostJobStep(2)}
                    disabled={!jobDraft.role && !jobDraft.customRequirement?.trim()}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 mt-6"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Step 2: Job Type & Urgency */}
              {postJobStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'full_time', name: 'Full-time' },
                        { id: 'part_time', name: 'Part-time' },
                        { id: 'gig', name: 'Gig' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setJobDraft(prev => ({ ...prev, jobType: type.id }))}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            jobDraft.jobType === type.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kab chahiye?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {URGENCY_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setJobDraft(prev => ({ ...prev, urgency: option.id }))}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                            jobDraft.urgency === option.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {option.icon}
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHIFT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setJobDraft(prev => ({ ...prev, shift: option.id }))}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                            jobDraft.shift === option.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {option.icon}
                          <div className="text-left">
                            <div>{option.nameHi}</div>
                            <div className="text-xs text-gray-500 font-normal">{option.time}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPostJobStep(1)}
                      className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setPostJobStep(3)}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Budget */}
              {postJobStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Budget / Salary</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'hourly', name: 'Per Hour' },
                        { id: 'daily', name: 'Per Day' },
                        { id: 'monthly', name: 'Monthly' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setJobDraft(prev => ({ ...prev, paymentType: type.id }))}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            jobDraft.paymentType === type.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                          <input
                            type="number"
                            value={jobDraft.budgetMin}
                            onChange={(e) => setJobDraft(prev => ({ ...prev, budgetMin: e.target.value }))}
                            placeholder="Min"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <span className="text-gray-400">to</span>
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                          <input
                            type="number"
                            value={jobDraft.budgetMax}
                            onChange={(e) => setJobDraft(prev => ({ ...prev, budgetMax: e.target.value }))}
                            placeholder="Max"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobDraft.negotiable}
                      onChange={(e) => setJobDraft(prev => ({ ...prev, negotiable: e.target.checked }))}
                      className="w-5 h-5 text-teal-500 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Negotiable</span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPostJobStep(2)}
                      className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setPostJobStep(4)}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Location & Requirements */}
              {postJobStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Location & Requirements</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
                    <input
                      type="text"
                      value={jobDraft.location}
                      onChange={(e) => setJobDraft(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Sector 29, Gurgaon"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workers Needed</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setJobDraft(prev => ({ ...prev, workersNeeded: num }))}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            jobDraft.workersNeeded === num
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {num}{num === 10 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'fresher_ok', name: 'Fresher OK' },
                        { id: '1_year', name: '1+ Year' },
                        { id: '3_plus_years', name: '3+ Years' },
                      ].map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => setJobDraft(prev => ({ ...prev, experience: exp.id }))}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            jobDraft.experience === exp.id
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-700'
                          }`}
                        >
                          {exp.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPostJobStep(3)}
                      className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={postJob}
                      disabled={!jobDraft.location}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      Post Job
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MATCH MODAL */}
      {showMatchModal && newMatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Match Ho Gaya!</h2>
              <p className="text-teal-100">Aap dono interested ho</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {newMatch.candidate.name[0]}
                </div>
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-teal-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{newMatch.candidate.name}</h3>
              <p className="text-center text-gray-600 mb-6">{newMatch.candidate.experience} experience</p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowMatchModal(false);
                    window.open(`tel:+919876543210`, '_self');
                  }}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg"
                >
                  Call Now
                </button>
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="w-full py-3 text-gray-600 font-semibold"
                >
                  Continue Swiping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {showCandidateDetail && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Candidate Profile</h2>
              <button onClick={() => setShowCandidateDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                  {selectedCandidate.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.experience} experience</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedCandidate.verified && (
                      <span className="flex items-center gap-1 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {selectedCandidate.available && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-700">{selectedCandidate.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{selectedCandidate.location}</span>
                  <span className="text-sm text-teal-600">({selectedCandidate.distance})</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span>{selectedCandidate.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <IndianRupee className="w-5 h-5 text-gray-400" />
                  <span>Expected: {selectedCandidate.expectedPay}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Available: {selectedCandidate.availableWhen}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedCandidate.jobsCompleted}</div>
                  <div className="text-sm text-gray-500">Jobs Completed</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    {selectedCandidate.rating || '-'}
                  </div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCandidateDetail(false);
                    handleSwipe('left');
                  }}
                  className="flex-1 py-4 border-2 border-red-200 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Pass
                </button>
                <button
                  onClick={() => {
                    setShowCandidateDetail(false);
                    handleSwipe('right');
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" /> Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApp;
