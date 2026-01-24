import React, { useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Wallet, Clock, Users, Briefcase, ArrowRight, X, Heart, Building2, IndianRupee, Home, Star, ChevronLeft, Menu, User, Edit, CheckCircle, TrendingUp, Award, Calendar, LogOut, HelpCircle, Share2, Copy, Check, Sparkles, MessageCircle, Video, Send, Gift, Zap, Target, Camera, Save, Upload, ToggleLeft, ToggleRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import posthog from 'posthog-js';

// In production, always use Relay backend. In dev, allow override via VITE_API_BASE_URL.
const API_BASE =
  import.meta.env.PROD
    ? 'https://api.relayy.world'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init('phc_Aj6Pdk78nznYGy1SPOMiIG7DfuyyP1GXQI7X2w6sAhL', {
    api_host: 'https://us.i.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') console.log('PostHog loaded');
    }
  });
}

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Note: In production, initialize Firebase properly
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);

const SwitchApp = () => {
  // Swipe refs
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const wasSwipe = useRef(false);

  const [currentCard, setCurrentCard] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); // Availability toggle for employers
  const [editField, setEditField] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCallSchedule, setShowCallSchedule] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showSuccessStory, setShowSuccessStory] = useState(false);
  const [showInterviewPractice, setShowInterviewPractice] = useState(false);
  const [practiceJob, setPracticeJob] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [interviewJobs, setInterviewJobs] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [hiredJobs, setHiredJobs] = useState([]);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [referredFriends, setReferredFriends] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [authStage, setAuthStage] = useState('idle'); // 'idle' | 'phone' | 'otp' | 'profile-setup' | 'verified'
  const [profileSetupName, setProfileSetupName] = useState('');
  const [profileSetupPhoto, setProfileSetupPhoto] = useState(null);
  const [profileSetupRoles, setProfileSetupRoles] = useState([]);
  const [profileSetupUploading, setProfileSetupUploading] = useState(false);
  const [profileSetupReferralCode, setProfileSetupReferralCode] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authCountryCode, setAuthCountryCode] = useState('91');
  const [authOtp, setAuthOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Community Feed state
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [newRantText, setNewRantText] = useState('');
  const [showRantModal, setShowRantModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const [userProfile, setUserProfile] = useState({
    phone: "",
    name: "",
    photoURL: null,
    location: "",
    experience: "",
    preferredRoles: [],
    languages: [],
    education: "",
    verified: false,
    joinedDate: "",
    totalApplied: 0,
    interviews: 0,
    hired: 0,
    profileComplete: 0,
    referralCode: "",
    isAvailable: true,
    referrals: [],
    totalReferralEarnings: 0,
    totalReferrals: 0,
    referredBy: null,
  });

  const [tempEditValue, setTempEditValue] = useState('');

  const [notifications, setNotifications] = useState([]);

  // Mock job data - focused on Gurgaon non-tech roles with real depth
  const jobs = [
    {
      id: 1,
      company: "Swiggy",
      logo: "🛵",
      role: "Delivery Partner",
      salary: "₹45,000 - ₹65,000",
      salaryPeriod: "/month",
      location: "Cyber City, Sector 29",
      distance: "2.3 km",
      type: "Full Time",
      shift: "Flexible",
      joining: "24 hours",
      urgency: "URGENT",
      requirements: ["Bike", "Smartphone", "Aadhar Card"],
      benefits: ["Fuel allowance ₹3000", "Insurance coverage", "Weekly payout", "Flexible hours"],
      openings: 15,
      featured: true,
      description: "Deliver food orders across Gurgaon. Earn extra during peak hours and weekends.",
      companyRating: 4.2,
      avgHiringTime: "18 hours",
      employeesHired: 234
    },
    {
      id: 2,
      company: "Café Coffee Day",
      logo: "☕",
      role: "Barista / Waiter",
      salary: "₹15,000 - ₹22,000",
      salaryPeriod: "/month",
      location: "MG Road, Sector 28",
      distance: "3.1 km",
      type: "Full Time",
      shift: "Day/Night",
      joining: "Join today",
      requirements: ["12th Pass", "Good communication", "Pleasant personality"],
      benefits: ["Free meals", "Tips allowed", "Growth to supervisor", "AC environment"],
      openings: 3,
      featured: false,
      description: "Serve customers, make coffee, handle billing. Training provided.",
      companyRating: 3.8,
      avgHiringTime: "2 days",
      employeesHired: 45
    },
    {
      id: 3,
      company: "D-Mart",
      logo: "🛒",
      role: "Store Assistant",
      salary: "₹18,000 - ₹25,000",
      salaryPeriod: "/month",
      location: "Sector 46, Near Metro",
      distance: "1.8 km",
      type: "Full Time",
      shift: "Day Shift",
      joining: "48 hours",
      urgency: "HIRING NOW",
      requirements: ["10th Pass", "Basic Hindi & English", "Honest & hardworking"],
      benefits: ["PF & ESI", "Medical insurance", "Uniform provided", "Sunday bonus"],
      openings: 8,
      featured: true,
      description: "Help customers, arrange stock, billing counter work. Big brand, secure job.",
      companyRating: 4.5,
      avgHiringTime: "36 hours",
      employeesHired: 156
    },
    {
      id: 4,
      company: "Amazon Warehouse",
      logo: "📦",
      role: "Warehouse Packer",
      salary: "₹20,000 - ₹28,000",
      salaryPeriod: "/month",
      location: "Manesar, IMT",
      distance: "8.5 km",
      type: "Full Time",
      shift: "Night Shift",
      joining: "Join tomorrow",
      requirements: ["No education needed", "Physically fit", "Can lift 20kg"],
      benefits: ["Free transport", "Night allowance ₹2000", "PF after 3 months", "Overtime pay"],
      openings: 25,
      featured: true,
      description: "Pack products, scan items, load trucks. Safe workplace, big company.",
      companyRating: 4.1,
      avgHiringTime: "24 hours",
      employeesHired: 478
    },
    {
      id: 5,
      company: "Glow & Shine Salon",
      logo: "💇",
      role: "Receptionist",
      salary: "₹12,000 - ₹18,000",
      salaryPeriod: "/month",
      location: "DLF Phase 1, Sector 26",
      distance: "4.2 km",
      type: "Full Time",
      shift: "Day Shift",
      joining: "This week",
      requirements: ["12th Pass", "Good personality", "Basic English", "Computer basics"],
      benefits: ["AC workplace", "Sundays off", "Professional environment", "Growth opportunity"],
      openings: 2,
      featured: false,
      description: "Greet customers, manage appointments, handle calls. Female candidates preferred.",
      companyRating: 3.9,
      avgHiringTime: "3 days",
      employeesHired: 23
    },
    {
      id: 6,
      company: "Securitas",
      logo: "🛡️",
      role: "Security Guard",
      salary: "₹16,000 - ₹22,000",
      salaryPeriod: "/month",
      location: "Cyber Hub, DLF Phase 2",
      distance: "2.7 km",
      type: "Full Time",
      shift: "12-hour shifts",
      joining: "Immediate",
      urgency: "URGENT",
      requirements: ["10th Pass", "Ex-serviceman preferred", "Age 21-45"],
      benefits: ["Uniform free", "Medical", "Meal allowance ₹1500", "Accommodation help"],
      openings: 12,
      featured: true,
      description: "Monitor CCTV, gate duty, visitor management. Safe corporate environment.",
      companyRating: 4.0,
      avgHiringTime: "48 hours",
      employeesHired: 312
    },
    {
      id: 7,
      company: "Blinkit",
      logo: "⚡",
      role: "Delivery Executive",
      salary: "₹40,000 - ₹55,000",
      salaryPeriod: "/month",
      location: "Sector 14, Multiple locations",
      distance: "3.5 km",
      type: "Full Time",
      shift: "Flexible",
      joining: "24 hours",
      urgency: "HIRING NOW",
      requirements: ["Bike mandatory", "Smartphone", "Driving license"],
      benefits: ["Petrol allowance", "Incentives on orders", "Insurance", "Weekly off"],
      openings: 20,
      featured: true,
      description: "Deliver groceries in 10 minutes. High earnings during festivals and weekends.",
      companyRating: 4.3,
      avgHiringTime: "12 hours",
      employeesHired: 189
    }
  ];

  // ==================== SWITCH API FUNCTIONS ====================
  
  // Save profile to Switch API (switch_users collection) - optimized for speed
  const saveProfileToFirestore = async (userIdParam, profileData) => {
    // Use userIdParam or fallback to userId
    const targetUserId = userIdParam || userId;
    if (!targetUserId) {
      console.warn('No userId available for saving profile');
      return { success: false, error: 'No user ID' };
    }

    // Always keep a local copy first (instant, no network delay)
    try {
      localStorage.setItem(`user_${targetUserId}`, JSON.stringify(profileData));
      console.log('✅ Saved to localStorage:', { location: profileData.location });
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }

    // Sync with Switch API in background (non-blocking)
    try {
        const payload = {
          name: profileData.name || '',
          phone: profileData.phone || '',
          photoURL: profileData.photoURL || null,
          location: profileData.location || '',
          experience: profileData.experience || '',
          preferredRoles: profileData.preferredRoles || [],
          languages: profileData.languages || [],
          education: profileData.education || '',
          referralCode: profileData.referralCode || '',
          isAvailable: profileData.isAvailable !== undefined ? profileData.isAvailable : true,
        };
      
      console.log('📤 Saving to Firebase:', { userId: targetUserId, location: payload.location });
      
      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(`${API_BASE}/api/switch/profile/${targetUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const responseData = await res.json().catch(() => ({}));
        console.log('✅ Profile saved to Firebase:', responseData);
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.detail || errorData.message || `Server error: ${res.status}`;
        console.error('❌ Firebase save failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (apiErr) {
      if (apiErr.name === 'AbortError') {
        console.warn('⚠️ Profile save timed out, but saved locally');
        return { success: true, warning: 'Saved locally only (timeout)' };
      } else if (apiErr.message) {
        console.error('❌ Failed to sync profile to Firebase:', apiErr.message);
        return { success: false, error: apiErr.message };
      } else {
        console.error('❌ Failed to sync profile to Firebase:', apiErr);
        return { success: false, error: 'Network error' };
      }
    }
  };

  // Load profile from Switch API
  const loadProfileFromFirestore = async (userIdParam) => {
    try {
      // Use userIdParam or fallback to userId from state
      const targetUserId = userIdParam || userId;
      
      if (targetUserId) {
        try {
          const res = await fetch(`${API_BASE}/api/switch/profile/${targetUserId}`);
          if (res.ok) {
            const data = await res.json();
            const p = data.profile || {};
            // Format phone number properly - preserve if already formatted, format if raw
            let formattedPhone = p.phone || '';
            // If phone is empty or just digits (like "919876543210" or "9876543210"), format it
            if (!formattedPhone || /^\d+$/.test(formattedPhone.replace(/\D/g, ''))) {
              const digits = formattedPhone ? formattedPhone.replace(/\D/g, '') : targetUserId.replace(/\D/g, '');
              if (digits.length === 12 && digits.startsWith('91')) {
                // Format as +91 98765 43210
                formattedPhone = `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
              } else if (digits.length === 10) {
                // Format as +91 98765 43210
                formattedPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
              } else if (digits.length > 0) {
                // Fallback formatting
                formattedPhone = `+91 ${digits.slice(-10).slice(0, 5)} ${digits.slice(-10).slice(5)}`;
              }
            }
            // If phone is already formatted (contains spaces or +), keep it as is
            
            const loadedProfile = {
              phone: formattedPhone,
              name: p.name || '',
              photoURL: p.photoURL || null,
              location: p.location || '', // Preserve location from Firebase
              experience: p.experience || '',
              preferredRoles: p.preferredRoles || [],
              languages: p.languages || [],
              education: p.education || '',
              verified: p.verified || false,
              joinedDate: p.joinedDate || '',
              totalApplied: p.totalApplied || 0,
              interviews: p.interviews || 0,
              hired: p.hired || 0,
              profileComplete: p.profileComplete || 0,
              referralCode: p.referralCode || '',
              isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
              referrals: p.referrals || [], // List of people they referred
              totalReferralEarnings: p.totalReferralEarnings || 0, // Total earnings
              totalReferrals: p.totalReferrals || 0, // Total count
              referredBy: p.referredBy || null, // Who referred them
            };
            
            // Update referral earnings and friends list from profile data
            const referralEarningsValue = p.totalReferralEarnings || 0;
            const referralsList = (p.referrals || []).map(ref => ({
              name: ref.name || 'Unknown',
              status: ref.status === 'hired' ? 'Hired' : ref.status === 'applied' ? 'Applied' : ref.status === 'signed_up' ? 'Signed Up' : 'Signed Up',
              earnings: ref.earnings || 0,
            }));
            
            setReferralEarnings(referralEarningsValue);
            setReferredFriends(referralsList);
            
            // Also update userProfile with referral data
            loadedProfile.referrals = p.referrals || [];
            loadedProfile.totalReferralEarnings = referralEarningsValue;
            loadedProfile.totalReferrals = p.totalReferrals || 0;
            loadedProfile.referredBy = p.referredBy || null;
            console.log('✅ Profile loaded from Firebase:', loadedProfile);
            return loadedProfile;
          }
        } catch (apiErr) {
          console.warn('Failed to load profile from Firebase, falling back to local', apiErr);
        }
      }

      // Local fallback
      const savedProfile = localStorage.getItem(`user_${targetUserId}`);
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  // Load applications from Switch API
  const loadApplicationsFromAPI = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/api/switch/applications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const apps = (data.applications || []).map(app => ({
          id: app.job_id,
          company: app.company,
          role: app.role || app.job_title,
          salary: app.salary,
          location: app.location,
          logo: app.logo || '💼',
          appliedDate: app.appliedDate,
          status: app.status,
          callScheduled: app.callScheduled,
          callTime: app.callTime,
        }));
        setAppliedJobs(apps);
        console.log('✅ Loaded applications from Switch API:', apps.length);
      }
    } catch (err) {
      console.warn('Failed to load applications from Switch API', err);
    }
  };

  // Helper: compress image on client so it safely fits in Firestore when base64-encoded
  const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let { width, height } = img;

              const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
              width = width * ratio;
              height = height * ratio;

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    return resolve(file); // fallback to original
                  }
                  const compressedFile = new File([blob], file.name || 'photo.jpg', {
                    type: blob.type || 'image/jpeg',
                  });
                  resolve(compressedFile);
                },
                'image/jpeg',
                quality
              );
            } catch (err) {
              console.error('Image compression failed, using original file', err);
              resolve(file);
            }
          };
          img.onerror = () => {
            console.error('Failed to load image for compression, using original file');
            resolve(file);
          };
          img.src = e.target.result;
        };
        reader.onerror = () => {
          console.error('FileReader failed, using original file');
          resolve(file);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Unexpected error during compression, using original file', err);
        resolve(file);
      }
    });
  };

  const uploadPhotoToStorage = async (userId, file) => {
    try {
      setUploadingPhoto(true);
      
      if (!userId) {
        console.error('No userId available for photo upload');
        setUploadingPhoto(false);
        return null;
      }
      
      // Compress image before upload so it fits safely in Firestore as base64
      const optimizedFile = await compressImageFile(file);

      // Upload to Switch API (stores in Firebase switch_users collection)
      const formData = new FormData();
      formData.append('file', optimizedFile);
      
      const res = await fetch(`${API_BASE}/api/switch/upload-photo/${userId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Photo uploaded to Firebase:', data.photoURL ? 'Success' : 'Failed');
        setUploadingPhoto(false);
        return data.photoURL;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to upload photo:', errorData);
        setUploadingPhoto(false);
        return null;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadingPhoto(false);
      return null;
    }
  };

  // Load profile / session on mount - OPTIMIZED for speed
  useEffect(() => {
    const loadUserData = async () => {
      // Restore previously verified session if present
      const savedSessionRaw = localStorage.getItem('switch_session_v1');
      if (savedSessionRaw) {
        try {
          const savedSession = JSON.parse(savedSessionRaw);
          if (savedSession.userId && savedSession.sessionToken) {
            setUserId(savedSession.userId);
            setSessionToken(savedSession.sessionToken);
            setAuthStage('verified');
            
            // Format phone number properly from session
            let sessionPhone = savedSession.phone;
            if (!sessionPhone || sessionPhone === savedSession.userId) {
              // Format from userId if phone not in session
              const digits = savedSession.userId.replace(/\D/g, '');
              if (digits.length === 12 && digits.startsWith('91')) {
                sessionPhone = `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
              } else if (digits.length === 10) {
                sessionPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
              } else {
                sessionPhone = `+91 ${savedSession.userId.slice(-10)}`;
              }
            }
            
            // STEP 1: Load from localStorage FIRST (instant, no network delay)
            const localProfileKey = `user_${savedSession.userId}`;
            const localProfileRaw = localStorage.getItem(localProfileKey);
            if (localProfileRaw) {
              try {
                const localProfile = JSON.parse(localProfileRaw);
                // Set profile immediately from cache (instant UI update)
                setUserProfile({
                  ...localProfile,
                  phone: sessionPhone, // Always use formatted phone from session
                });
                console.log('✅ Profile loaded from localStorage (instant)');
              } catch (err) {
                console.warn('Failed to parse local profile', err);
              }
            } else {
              // No local cache, set at least phone
              setUserProfile(prev => ({
                ...prev,
                phone: sessionPhone,
              }));
            }
            
            // STEP 2: Load from Firebase in background (sync, non-blocking)
            loadProfileFromFirestore(savedSession.userId).then(savedProfile => {
              if (savedProfile) {
                // Update with Firebase data, but preserve formatted phone
                setUserProfile(prev => ({
                  ...prev,
                  ...savedProfile,
                  phone: sessionPhone, // Always preserve formatted phone from session
                  location: savedProfile.location || prev.location || '', // Preserve location
                  // Ensure referral data comes from Firebase, not cache
                  referrals: savedProfile.referrals || [],
                  totalReferralEarnings: savedProfile.totalReferralEarnings || 0,
                  totalReferrals: savedProfile.totalReferrals || 0,
                  referredBy: savedProfile.referredBy || null,
                }));
                // Update availability state
                setIsAvailable(savedProfile.isAvailable !== undefined ? savedProfile.isAvailable : true);
                
                // Update referral earnings and friends list from Firebase data
                setReferralEarnings(savedProfile.totalReferralEarnings || 0);
                setReferredFriends((savedProfile.referrals || []).map(ref => ({
                  name: ref.name || 'Unknown',
                  status: ref.status === 'hired' ? 'Hired' : ref.status === 'applied' ? 'Applied' : ref.status === 'signed_up' ? 'Signed Up' : 'Signed Up',
                  earnings: ref.earnings || 0,
                })));
                
                console.log('✅ Profile synced from Firebase');
              }
            }).catch(err => {
              console.warn('Failed to sync from Firebase (using cached data)', err);
            });
            
            // Load applications from Switch API (non-blocking)
            loadApplicationsFromAPI().catch(err => {
              console.warn('Failed to load applications', err);
            });
            
            return;
          }
        } catch (err) {
          console.warn('Failed to restore session', err);
        }
      }
      
      // No session found - show phone auth
      setAuthStage('phone');
    };

    loadUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load community feed when tab is active
  useEffect(() => {
    if (activeTab === 'community' && userId) {
      loadCommunityFeed();
    }
  }, [activeTab, userId]);

  // Reload profile and applications when userId changes
  useEffect(() => {
    if (userId && authStage === 'verified') {
      // Reload profile from Firebase to ensure we have latest data
      loadProfileFromFirestore(userId).then(profile => {
        if (profile) {
          // Preserve phone and location when reloading
          setUserProfile(prev => ({
            ...prev,
            ...profile,
            phone: profile.phone || prev.phone, // Preserve phone if exists
            location: profile.location || prev.location || '', // Preserve location if exists
            // Ensure referral data is included
            referrals: profile.referrals || [],
            totalReferralEarnings: profile.totalReferralEarnings || 0,
            totalReferrals: profile.totalReferrals || 0,
            referredBy: profile.referredBy || null,
          }));
          
          // Update referral earnings and friends list
          setReferralEarnings(profile.totalReferralEarnings || 0);
          setReferredFriends((profile.referrals || []).map(ref => ({
            name: ref.name || 'Unknown',
            status: ref.status === 'hired' ? 'Hired' : ref.status === 'applied' ? 'Applied' : ref.status === 'signed_up' ? 'Signed Up' : 'Signed Up',
            earnings: ref.earnings || 0,
          })));
        }
      });
      // Reload applications
      loadApplicationsFromAPI();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, authStage]);

  // Track tab navigation
  useEffect(() => {
    if (activeTab && userId) {
      posthog.capture('tab_navigated', {
        tab: activeTab,
        user_id: userId,
      });
    }
  }, [activeTab, userId]);

  // Track job detail view
  useEffect(() => {
    if (showJobDetail && selectedJob && userId) {
      posthog.capture('job_detail_viewed', {
        user_id: userId,
        job_id: selectedJob.id,
        job_role: selectedJob.role,
        job_company: selectedJob.company,
      });
    }
  }, [showJobDetail, selectedJob, userId]);

  // Track referral modal open
  useEffect(() => {
    if (showReferral && userId) {
      posthog.capture('referral_modal_opened', {
        user_id: userId,
        referral_code: userProfile.referralCode,
        total_referrals: userProfile.totalReferrals || 0,
        total_earnings: userProfile.totalReferralEarnings || 0,
      });
    }
  }, [showReferral, userId, userProfile.referralCode, userProfile.totalReferrals, userProfile.totalReferralEarnings]);

  // Auto-save profile whenever it changes (debounced)
  useEffect(() => {
    if (userId && userProfile.phone) {
      const debounceTimer = setTimeout(() => {
        // Only save if we have meaningful changes
        if (userProfile.name || userProfile.location || userProfile.experience || 
            userProfile.education || userProfile.photoURL) {
          saveProfileToFirestore(userId, userProfile);
        }
      }, 1000); // Debounce by 1 second
      
      return () => clearTimeout(debounceTimer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.name, userProfile.location, userProfile.experience, 
      userProfile.education, userProfile.preferredRoles, userProfile.languages, 
      userProfile.photoURL, userProfile.phone, userId]);

  // ==================== PROFILE EDITING FUNCTIONS ====================
  
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Photo size should be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (!userId) {
      alert('Please log in to upload a photo');
      return;
    }

    // Upload to backend (stores in Firebase with userId and phone)
    const photoURL = await uploadPhotoToStorage(userId, file);
    if (photoURL) {
      const updatedProfile = { ...userProfile, photoURL };
      setUserProfile(updatedProfile);
      // Save to backend (includes phone number)
      await saveProfileToFirestore(userId, updatedProfile);
      
      // Track photo upload
      posthog.capture('photo_uploaded', {
        user_id: userId,
        file_size: file.size,
        file_type: file.type,
      });
    } else {
      alert('Failed to upload photo. Please try again.');
      posthog.capture('photo_upload_failed', {
        user_id: userId,
      });
    }
  };

  const openEditField = async (field, currentValue) => {
    setEditField(field);
    
    // If location field, try to get current location from phone
    if (field === 'location') {
      setTempEditValue(Array.isArray(currentValue) ? currentValue.join(', ') : currentValue);
      setShowEditProfile(true);
      
      // Try to get current location
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              // Reverse geocode to get address (using a free API)
              try {
                const geocodeRes = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );
                const geocodeData = await geocodeRes.json();
                
                // Format address nicely
                const address = geocodeData.address || {};
                let locationText = '';
                
                if (address.suburb || address.neighbourhood) {
                  locationText = `${address.suburb || address.neighbourhood}`;
                } else if (address.city || address.town || address.village) {
                  locationText = `${address.city || address.town || address.village}`;
                } else if (address.state_district) {
                  locationText = address.state_district;
                } else {
                  locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                }
                
                // Add city/state if available
                if (address.city || address.state) {
                  locationText += `, ${address.city || address.state || ''}`;
                }
                
                setTempEditValue(locationText.trim());
              } catch (err) {
                console.warn('Failed to reverse geocode:', err);
                // Fallback to coordinates
                setTempEditValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            },
            (error) => {
              console.warn('Geolocation error:', error);
              // Keep the current value if geolocation fails
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } catch (err) {
          console.warn('Geolocation not available:', err);
        }
      }
    } else {
      setTempEditValue(Array.isArray(currentValue) ? currentValue.join(', ') : currentValue);
      setShowEditProfile(true);
    }
  };

  const saveEditedField = async () => {
    if (!editField || !userId) {
      alert('Please log in to save profile changes');
      return;
    }

    // Validate input
    if (!tempEditValue || tempEditValue.trim() === '') {
      alert('Please enter a value');
      return;
    }

    let updatedValue = tempEditValue.trim();
    
    // Handle array fields (preferredRoles, languages)
    if (editField === 'preferredRoles' || editField === 'languages') {
      updatedValue = tempEditValue.split(',').map(item => item.trim()).filter(Boolean);
      if (updatedValue.length === 0) {
        alert('Please enter at least one value');
        return;
      }
    }

    const updatedProfile = {
      ...userProfile,
      [editField]: updatedValue
    };

    // Update profile completeness
    updatedProfile.profileComplete = calculateProfileCompleteness(updatedProfile);

    // Optimistic update - update UI immediately
    setUserProfile(updatedProfile);
    
    // Close modal immediately for better UX
    setShowEditProfile(false);
    setEditField(null);
    setTempEditValue('');
    
    // Save to Firebase in background (with proper error handling)
    try {
      const result = await saveProfileToFirestore(userId, updatedProfile);
      if (result.success) {
        console.log(`✅ ${editField} saved successfully`);
      } else {
        console.error(`❌ Failed to save ${editField}:`, result.error);
        alert(`Failed to save ${editField}. Please try again.`);
        // Revert optimistic update on failure
        setUserProfile(userProfile);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(`Failed to save ${editField}. Please try again.`);
      // Revert optimistic update on failure
      setUserProfile(userProfile);
    }
  };

  const calculateProfileCompleteness = (profile) => {
    const fields = ['name', 'phone', 'location', 'experience', 'education', 'photoURL'];
    const filledFields = fields.filter(field => profile[field] && profile[field] !== '').length;
    const arrayFields = ['preferredRoles', 'languages'];
    const filledArrays = arrayFields.filter(field => profile[field] && profile[field].length > 0).length;
    
    const totalFields = fields.length + arrayFields.length;
    const totalFilled = filledFields + filledArrays;
    
    return Math.round((totalFilled / totalFields) * 100);
  };

  // ==================== SWIPE FUNCTIONALITY ====================
  
  const handleTouchStart = (e) => {
    isDragging.current = true;
    wasSwipe.current = false;
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startY.current = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    // Start from a clean state so drag feels snappy
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
    
    // Don't prevent default on touchstart - let browser handle scrolling
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    
    currentX.current = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    currentY.current = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // If vertical scrolling is clearly happening, don't interfere at all
    if (absDeltaY > 15 && absDeltaY > absDeltaX * 1.5) {
      // User is scrolling vertically - let browser handle it
      if (cardRef.current) {
        cardRef.current.style.transform = '';
        cardRef.current.style.transition = '';
      }
      wasSwipe.current = false;
      return; // Don't prevent default, allow scrolling
    }
    
    // Only prevent scrolling and apply transform if horizontal swipe is clearly dominant
    // Require horizontal movement to be at least 2x vertical movement and > 30px
    if (absDeltaX > 30 && absDeltaX > absDeltaY * 2) {
      wasSwipe.current = true;
      // Only prevent scrolling when clearly swiping horizontally
      if (e.type === 'touchmove') {
        e.preventDefault();
      }
      
      if (cardRef.current) {
        const rotation = deltaX * 0.1; // Rotation based on swipe distance
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        cardRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const threshold = 80; // Minimum swipe distance
    
    // Always reset dragging state
    isDragging.current = false;
    
    if (cardRef.current) {
      if (Math.abs(deltaX) > threshold && wasSwipe.current) {
        // Clear inline transform before calling handleSwipe (let CSS handle animation)
        cardRef.current.style.transform = '';
        cardRef.current.style.transition = '';
        
        // Swiped enough - trigger action (exactly like button click)
        if (deltaX > 0) {
          // Swiped right - Apply (same as heart button)
          handleSwipe('right');
        } else {
          // Swiped left - Pass (same as cross button)
          handleSwipe('left');
        }
      } else {
        // Reset position - didn't swipe far enough
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
        
        // If it was a tap (small movement), open the job detail modal
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && !wasSwipe.current && jobs[currentCard]) {
          setSelectedJob(jobs[currentCard]);
          setShowJobDetail(true);
        }
      }
    }
    
    // Reset swipe flag after a short delay
    setTimeout(() => {
      wasSwipe.current = false;
    }, 100);
  };

  // Reset card transform when card changes or swipe direction resets
  useEffect(() => {
    if (cardRef.current && activeTab === 'home') {
      // Clear all inline styles to let CSS classes handle animation
      cardRef.current.style.transform = '';
      cardRef.current.style.transition = '';
      isDragging.current = false;
    }
  }, [currentCard, swipeDirection, activeTab]);

  // Add/remove event listeners
  useEffect(() => {
    const card = cardRef.current;
    if (card && activeTab === 'home') {
      // Mouse events for desktop
      card.addEventListener('mousedown', handleTouchStart);
      window.addEventListener('mousemove', handleTouchMove);
      window.addEventListener('mouseup', handleTouchEnd);
      
      // Touch events for mobile - touchstart can be passive to allow scrolling
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
  }, [activeTab]);

  // ==================== EXISTING FUNCTIONS ====================

  const handleSwipe = (direction) => {
    // Set swipe direction for CSS animation
    setSwipeDirection(direction);
    
    // Track swipe action
    const currentJob = jobs[currentCard];
    posthog.capture('job_swiped', {
      direction: direction,
      job_id: currentJob?.id,
      job_role: currentJob?.role,
      job_company: currentJob?.company,
      card_index: currentCard,
    });
    
    if (direction === 'right') {
      const jobToApply = jobs[currentCard];
      const newApplication = {
        ...jobToApply,
        appliedDate: new Date().toISOString(),
        status: 'pending',
        callScheduled: false
      };
      
      // Add to applied jobs immediately (optimistic update)
      setAppliedJobs([...appliedJobs, newApplication]);
      
      // Update user stats
      setUserProfile({
        ...userProfile,
        totalApplied: userProfile.totalApplied + 1
      });
      
      // Sync to Switch API
      if (userId) {
        fetch(`${API_BASE}/api/switch/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            job_id: String(jobToApply.id),
            company: jobToApply.company,
            role: jobToApply.role,
            salary: jobToApply.salary,
            location: jobToApply.location,
            logo: jobToApply.logo,
            appliedDate: newApplication.appliedDate,
            status: 'pending',
            callScheduled: false,
          }),
        }).then(async () => {
          console.log('✅ Application saved to Switch API');
          
          // Track job application
          posthog.capture('job_applied', {
            user_id: userId,
            job_id: String(jobToApply.id),
            job_role: jobToApply.role,
            job_company: jobToApply.company,
            job_salary: jobToApply.salary,
            total_applications: appliedJobs.length + 1,
          });
          
          // Reload applications to get server state
          await loadApplicationsFromAPI();
          // Reload profile to get updated stats (totalApplied count)
          const updatedProfile = await loadProfileFromFirestore(userId);
          if (updatedProfile) {
            setUserProfile(prev => ({ ...prev, ...updatedProfile }));
          }
        }).catch((err) => {
          console.warn('Failed to sync job application to Switch API', err);
        });
      }
      
      // Show interview practice popup after 1 second
      // COMMENTED OUT: Interview practice feature disabled
      // setTimeout(() => {
      //   setPracticeJob(jobToApply);
      //   setShowInterviewPractice(true);
      // }, 1500);
    }
    
    // Move to next card for both left and right swipes (same timing as button click)
    setTimeout(() => {
      // Use functional update to always get latest currentCard value
      setCurrentCard(prev => {
        const next = prev < jobs.length - 1 ? prev + 1 : 0;
        return next;
      });
      
      // Then reset swipe direction (this will trigger useEffect to clear transforms)
      setSwipeDirection(null);
    }, 300);
  };

  const scheduleCall = async (time) => {
    // Update the applied job with call schedule (optimistic update)
    const updatedAppliedJobs = appliedJobs.map(job => 
      job.id === selectedJob.id 
        ? { ...job, callScheduled: true, callTime: time, status: 'interview' }
        : job
    );
    setAppliedJobs(updatedAppliedJobs);
    
    // Sync to Switch API - update status to interview when call is scheduled
    if (userId && selectedJob) {
      try {
        await fetch(`${API_BASE}/api/switch/applications/${userId}/${selectedJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'interview', // Update status to interview
            callScheduled: true,
            callTime: time,
          }),
        });
        console.log('✅ Call schedule saved to Switch API');
        
        // Track call scheduling
        posthog.capture('call_scheduled', {
          user_id: userId,
          job_id: selectedJob.id,
          job_role: selectedJob.role,
          call_time: time,
        });
        
        // Reload profile to get updated stats (interviews count)
        const updatedProfile = await loadProfileFromFirestore(userId);
        if (updatedProfile) {
          setUserProfile(prev => ({ ...prev, ...updatedProfile }));
        }
        
        // Reload applications to get latest status
        await loadApplicationsFromAPI();
      } catch (err) {
        console.warn('Failed to sync call schedule to Switch API', err);
      }
    }
    
    // Add notification
    setNotifications([
      {
        id: Date.now(),
        type: 'success',
        title: 'Call Scheduled!',
        message: `We'll call you ${time} about ${selectedJob.role}`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    
    setShowCallSchedule(false);
  };

  const cancelApplication = async (jobToCancel) => {
    if (!jobToCancel || !userId) return;
    
    // Confirm cancellation
    if (!window.confirm(`Are you sure you want to cancel your application for ${jobToCancel.role} at ${jobToCancel.company}?`)) {
      return;
    }
    
    // Remove from applied jobs immediately (optimistic update)
    const updatedAppliedJobs = appliedJobs.filter(job => job.id !== jobToCancel.id);
    setAppliedJobs(updatedAppliedJobs);
    
    // Update user stats
    setUserProfile(prev => ({
      ...prev,
      totalApplied: Math.max(0, (prev.totalApplied || 0) - 1)
    }));
    
    // Sync to Switch API - update status to cancelled
    try {
      await fetch(`${API_BASE}/api/switch/applications/${userId}/${jobToCancel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      });
      console.log('✅ Application cancelled in Switch API');
      
      // Track application cancellation
      posthog.capture('application_cancelled', {
        user_id: userId,
        job_id: jobToCancel.id,
        job_role: jobToCancel.role,
        job_company: jobToCancel.company,
      });
      
      // Reload applications to get server state
      await loadApplicationsFromAPI();
      
      // Reload profile to get updated stats
      const updatedProfile = await loadProfileFromFirestore(userId);
      if (updatedProfile) {
        setUserProfile(prev => ({ ...prev, ...updatedProfile }));
      }
    } catch (err) {
      console.warn('Failed to cancel application in Switch API', err);
      // Revert optimistic update on error
      setAppliedJobs(appliedJobs);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`Join Switch! Use my code: ${userProfile.referralCode}\nGet job in 24 hours: switchlocally.com/r/${userProfile.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    
    // Track referral code copy
    posthog.capture('referral_code_copied', {
      user_id: userId,
      referral_code: userProfile.referralCode,
    });
  };

  const shareReferral = () => {
    const shareText = `Hey! मैंने Switch app से सिर्फ 18 घंटे में job पाई! तुम भी try करो!\n\nMy referral code: ${userProfile.referralCode}\n\nDownload: switchlocally.com\n\n₹100 bonus मिलेगा! 🎉`;
    
    // Track referral share
    posthog.capture('referral_shared', {
      user_id: userId,
      referral_code: userProfile.referralCode,
      method: navigator.share ? 'native_share' : 'copy',
    });
    
    if (navigator.share) {
      navigator.share({
        title: 'Switch - Ghar ke paas job',
        text: shareText
      });
    } else {
      copyReferralCode();
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const job = jobs[currentCard];

  // Onboarding screens
  const onboardingScreens = [
    {
      title: "Ghar ke paas job, 24 hours mein",
      subtitle: "कोई झंझट नहीं, सिर्फ swipe करो और job पाओ",
      emoji: "🎯",
      highlight: "Switch करो अपनी life!"
    },
    {
      title: "बस 3 steps में job मिलेगी",
      subtitle: "1️⃣ Swipe right to apply\n2️⃣ We call you in 24 hours\n3️⃣ Interview & join!",
      emoji: "⚡",
      highlight: "इतना आसान!"
    },
    {
      title: "Refer करो, पैसे कमाओ",
      subtitle: "हर friend को job दिलाओ और ₹200 जीतो",
      emoji: "💰",
      highlight: "Extra income!"
    }
  ];

  // ==================== PHONE AUTH (OTP) ====================

  const requestOtp = async () => {
    try {
      setAuthError('');
      if (!authPhone.trim()) {
        setAuthError('Please enter your phone number');
        return;
      }
      if (authPhone.trim().length < 10) {
        setAuthError('Please enter a valid 10-digit phone number');
        return;
      }
      setAuthLoading(true);
      
      // Track OTP request
      posthog.capture('otp_requested', {
        phone: authPhone.trim(),
        country_code: authCountryCode,
      });
      
      const response = await fetch(`${API_BASE}/api/candidate-onboarding/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: authCountryCode,
          phone: authPhone.trim(),
        }),
      }).catch((networkError) => {
        // Network error (backend not reachable)
        console.error('Network error:', networkError);
        const backendUrl = API_BASE;
        throw new Error(
          `Cannot connect to backend at ${backendUrl}. Check if the relay backend is reachable and VITE_API_BASE_URL is set correctly.`
        );
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMsg = data.detail || data.message || `Server error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      const result = await response.json().catch(() => ({}));
      setAuthStage('otp');
      setAuthError(''); // Clear any previous errors
    } catch (err) {
      console.error('OTP request error:', err);
      setAuthError(err.message || 'Failed to send OTP. Please check your connection and try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setAuthError('');
      if (!authOtp.trim()) {
        setAuthError('Enter the OTP you received');
        return;
      }
      setAuthLoading(true);
      
      // Track OTP verification attempt
      posthog.capture('otp_verification_attempted', {
        phone: authPhone.trim(),
      });
      
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

      // Format phone number properly: +91 98765 43210
      const phoneDigits = authPhone.trim();
      const prettyPhone = `+${authCountryCode} ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
      
      // Generate referral code if not exists
      const referralCode = `SW${backendUserId.slice(-6).toUpperCase()}`;
      
      // Load profile from Switch API (will create if doesn't exist) - MUST load before using savedProfile
      const savedProfile = await loadProfileFromFirestore(backendUserId);

      // Identify user in PostHog
      posthog.identify(backendUserId, {
        phone: authPhone.trim(),
        country_code: authCountryCode,
      });
      
      // Track successful OTP verification
      posthog.capture('otp_verified', {
        user_id: backendUserId,
        phone: authPhone.trim(),
        has_existing_profile: !!(savedProfile?.name && savedProfile?.preferredRoles && savedProfile.preferredRoles.length > 0),
      });
      
      // Check if profile already has name and preferredRoles - if so, skip setup
      if (savedProfile?.name && savedProfile?.preferredRoles && savedProfile.preferredRoles.length > 0) {
        // Profile already set up, go directly to verified
        setAuthStage('verified');
        
        // Set profile immediately with formatted phone
        setUserProfile((prev) => ({
          ...prev,
          ...(savedProfile || {}), // Load existing profile first
          phone: prettyPhone, // Always use formatted phone from OTP
          verified: true,
          referralCode: savedProfile?.referralCode || referralCode,
          // Preserve location if it exists in saved profile
          location: savedProfile?.location || prev.location || '',
          isAvailable: savedProfile?.isAvailable !== undefined ? savedProfile.isAvailable : true,
        }));
        // Set availability state
        setIsAvailable(savedProfile?.isAvailable !== undefined ? savedProfile.isAvailable : true);
      } else {
        // Profile not set up, go to profile setup
        setAuthStage('profile-setup');
        // Pre-fill name if exists
        setProfileSetupName(savedProfile?.name || '');
        setProfileSetupRoles(savedProfile?.preferredRoles || []);
        
        // Track profile setup started
        posthog.capture('profile_setup_started', {
          user_id: backendUserId,
        });
      }

      localStorage.setItem(
        'switch_session_v1',
        JSON.stringify({
          userId: backendUserId,
          sessionToken: backendSessionToken,
          phone: prettyPhone,
        })
      );
    } catch (err) {
      setAuthError(err.message || 'Failed to verify OTP');
    } finally {
      setAuthLoading(false);
    }
  };

  // Community Feed Functions
  const loadCommunityFeed = async () => {
    if (!userId) return;
    
    try {
      setCommunityLoading(true);
      const res = await fetch(`${API_BASE}/api/community/feed?user_id=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCommunityPosts(data.posts || []);
      } else {
        console.error('Failed to load feed:', res.status);
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setCommunityLoading(false);
    }
  };

  const postRant = async () => {
    if (!newRantText.trim() || !userId) return;
    
    try {
      setCommunityLoading(true);
      const res = await fetch(`${API_BASE}/api/community/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          text: newRantText.trim(),
          is_anonymous: true,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setNewRantText('');
        setShowRantModal(false);
        await loadCommunityFeed();
        
        posthog.capture('rant_posted', {
          user_id: userId,
          post_id: data.post_id,
        });
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to post' }));
        console.error('Failed to post rant:', errorData);
        alert('Post karne mein error aaya. Phir se try karo.');
      }
    } catch (err) {
      console.error('Failed to post rant:', err);
      alert('Network error. Apna internet check karo aur phir se try karo.');
    } finally {
      setCommunityLoading(false);
    }
  };

  const likePost = async (postId) => {
    if (!userId) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/community/post/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      
      if (res.ok) {
        await loadCommunityFeed();
        posthog.capture('post_liked', { user_id: userId, post_id: postId });
      } else {
        console.error('Failed to like post:', res.status);
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const addComment = async (postId) => {
    if (!commentText.trim() || !userId) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/community/post/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          text: commentText.trim(),
          is_anonymous: true,
        }),
      });
      
      if (res.ok) {
        setCommentText('');
        // Don't close modal, just refresh comments
        await loadCommunityFeed();
        // Update selectedPost with new comments
        const updatedRes = await fetch(`${API_BASE}/api/community/feed?user_id=${userId}`);
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          const updatedPost = updatedData.posts.find(p => p.id === postId);
          if (updatedPost) {
            setSelectedPost(updatedPost);
          }
        }
        posthog.capture('comment_added', { user_id: userId, post_id: postId });
      } else {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to comment' }));
        console.error('Failed to add comment:', errorData);
        alert('Comment karne mein error aaya. Phir se try karo.');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const completeProfileSetup = async () => {
    if (!profileSetupName.trim()) {
      setAuthError('Please enter your name');
      return;
    }
    
    if (profileSetupRoles.length === 0) {
      setAuthError('Please select at least one preferred role');
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError('');

      // Format phone number properly
      const phoneDigits = authPhone.trim();
      const prettyPhone = `+${authCountryCode} ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
      
      // Generate referral code
      const referralCode = `SW${userId.slice(-6).toUpperCase()}`;
      
      let photoURL = null;
      
      // Upload photo if provided
      if (profileSetupPhoto) {
        setProfileSetupUploading(true);
        try {
          photoURL = await uploadPhotoToStorage(userId, profileSetupPhoto);
        } catch (err) {
          console.warn('Failed to upload photo during setup', err);
          // Continue without photo if upload fails
        } finally {
          setProfileSetupUploading(false);
        }
      }

      // Create profile with setup data
      const profileToSave = {
        phone: prettyPhone,
        name: profileSetupName.trim(),
        preferredRoles: profileSetupRoles,
        photoURL: photoURL,
        verified: true,
        referralCode: referralCode,
        referredBy: profileSetupReferralCode.trim() || null, // Track who referred them
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        location: '',
        experience: '',
        education: '',
        languages: [],
        isAvailable: true,
      };

      // Save to backend
      await saveProfileToFirestore(userId, profileToSave);

      // Track referral if code was provided (non-blocking)
      if (profileSetupReferralCode.trim()) {
        // Track referral code entry
        posthog.capture('referral_code_entered', {
          user_id: userId,
          referral_code: profileSetupReferralCode.trim().toUpperCase(),
        });
        
        fetch(`${API_BASE}/api/switch/track-referral`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer_code: profileSetupReferralCode.trim().toUpperCase(),
            referee_user_id: userId,
            referee_name: profileSetupName.trim(),
          }),
        })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            console.log('✅ Referral tracked:', data.message);
            posthog.capture('referral_tracked_successfully', {
              user_id: userId,
              referral_code: profileSetupReferralCode.trim().toUpperCase(),
            });
          } else {
            console.warn('⚠️ Referral tracking failed:', data.message || 'Invalid referral code');
            posthog.capture('referral_tracking_failed', {
              user_id: userId,
              referral_code: profileSetupReferralCode.trim().toUpperCase(),
              error: data.message || 'Invalid referral code',
            });
            // Don't show error to user - signup should still succeed
          }
        })
        .catch((err) => {
          console.warn('Failed to track referral', err);
          posthog.capture('referral_tracking_error', {
            user_id: userId,
            referral_code: profileSetupReferralCode.trim().toUpperCase(),
            error: err.message,
          });
          // Don't block signup if referral tracking fails
        });
      }

      // Set profile state
      setUserProfile(profileToSave);
      setIsAvailable(true);

      // Move to verified stage
      setAuthStage('verified');
      
      // Track profile setup completion
      posthog.capture('profile_setup_completed', {
        user_id: userId,
        has_photo: !!photoURL,
        preferred_roles_count: profileSetupRoles.length,
        has_referral_code: !!profileSetupReferralCode.trim(),
        referral_code: profileSetupReferralCode.trim() || null,
      });
      
      // Update user properties
      posthog.setPersonProperties({
        name: profileSetupName.trim(),
        preferred_roles: profileSetupRoles,
        has_photo: !!photoURL,
        referred_by: profileSetupReferralCode.trim() || null,
      });
    } catch (err) {
      setAuthError(err.message || 'Failed to save profile');
      posthog.capture('profile_setup_failed', {
        user_id: userId,
        error: err.message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProfileSetupPhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setAuthError('Photo size should be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setAuthError('Please upload an image file');
      return;
    }

    setProfileSetupPhoto(file);
    setAuthError('');
  };

  const toggleProfileSetupRole = (role) => {
    setProfileSetupRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  // Show phone auth modal if not verified
  if (authStage !== 'verified' && (authStage === 'phone' || authStage === 'otp' || authStage === 'idle' || authStage === 'profile-setup')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="max-w-sm sm:max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-5xl mb-3">🎯</div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome to Switch</h1>
            <p className="text-emerald-50 text-xs sm:text-sm">Ghar ke paas job, 24 hours mein</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {authStage === 'phone' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <select
                      value={authCountryCode}
                      onChange={(e) => setAuthCountryCode(e.target.value)}
                      className="w-full sm:w-auto px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white font-medium"
                    >
                      <option value="91">🇮🇳 +91</option>
                      <option value="1">🇺🇸 +1</option>
                    </select>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all text-base sm:text-lg"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">We'll send you a verification code</p>
                </div>
                
                {authError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  onClick={requestOtp}
                  disabled={authLoading || !authPhone.trim() || authPhone.length < 10}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {authLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending OTP...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
              </div>
            )}

            {authStage === 'otp' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <Phone className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
                  <p className="text-gray-600 text-sm mb-1">We sent a code to</p>
                  <p className="font-semibold text-gray-900">+{authCountryCode} {authPhone.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
                </div>
                
                {/* OTP Input with individual boxes */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center" id="otp-container">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={authOtp[idx] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const current = (authOtp || '').split('');
                          
                          // If user typed something, keep only the last digit typed
                          if (value) {
                            current[idx] = value[value.length - 1];
                            const updatedOtp = current.join('').slice(0, 6);
                            setAuthOtp(updatedOtp);

                            // Auto-focus next input
                            if (idx < 5) {
                              const container = document.getElementById('otp-container');
                              const nextInput = container?.children[idx + 1];
                              if (nextInput instanceof HTMLInputElement) {
                                nextInput.focus();
                                nextInput.select();
                              }
                            }
                          } else {
                            // If user cleared this box, clear that digit from OTP
                            current[idx] = '';
                            setAuthOtp(current.join(''));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            const current = (authOtp || '').split('');

                            if (current[idx]) {
                              // If this box has a digit, clear it
                              current[idx] = '';
                              setAuthOtp(current.join(''));
                            } else if (idx > 0) {
                              // If this box is already empty, move to previous and clear it
                              current[idx - 1] = '';
                              setAuthOtp(current.join(''));
                              const container = document.getElementById('otp-container');
                              const prevInput = container?.children[idx - 1];
                              if (prevInput instanceof HTMLInputElement) {
                                prevInput.focus();
                                prevInput.select();
                              }
                            }
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          setAuthOtp(pasted);
                          if (pasted.length === 6) {
                            const container = document.getElementById('otp-container');
                            const lastInput = container?.children[5];
                            if (lastInput instanceof HTMLInputElement) {
                              lastInput.focus();
                              lastInput.select();
                            }
                          }
                        }}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
                        autoFocus={idx === 0 && authStage === 'otp'}
                      />
                    ))}
                  </div>
                  
                  {authOtp.length < 6 && (
                    <p className="text-xs text-center text-gray-500">Enter 6-digit code</p>
                  )}
                </div>
                
                {authError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={authLoading || authOtp.length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {authLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </span>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <button
                    onClick={requestOtp}
                    disabled={authLoading}
                    className="text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => {
                      setAuthStage('phone');
                      setAuthOtp('');
                      setAuthError('');
                    }}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Change number
                  </button>
                </div>
              </div>
            )}

            {authStage === 'profile-setup' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Complete Your Profile</h2>
                  <p className="text-sm text-gray-600">Help us find the perfect job for you</p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileSetupName}
                    onChange={(e) => {
                      setProfileSetupName(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {profileSetupPhoto ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(profileSetupPhoto)}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500"
                        />
                        <button
                          onClick={() => setProfileSetupPhoto(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileSetupPhotoChange}
                        className="hidden"
                      />
                      <div className="px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition-all text-center">
                        {profileSetupPhoto ? 'Change Photo' : 'Upload Photo'}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Preferred Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Roles <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Select at least one role you're interested in</p>
                  <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 space-y-2 bg-white">
                    {[
                      'Delivery Partner',
                      'Delivery Executive',
                      'Warehouse Worker',
                      'Picker/Packer',
                      'Security Guard',
                      'Store Assistant',
                      'Retail Associate',
                      'Waiter/Server',
                      'Receptionist',
                      'Driver',
                      'Cook/Chef',
                      'Housekeeping',
                      'Sales Executive',
                      'Customer Service',
                      'Data Entry',
                      'Packing/Assembly',
                      'Loading/Unloading',
                      'Cashier',
                      'Supervisor',
                      'Helper',
                      'Cleaner',
                      'Watchman',
                      'Gardener',
                      'Electrician',
                      'Plumber',
                      'Carpenter',
                      'Painter',
                      'Mason',
                      'Welder',
                    ].map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={profileSetupRoles.includes(role)}
                          onChange={() => toggleProfileSetupRole(role)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 bg-white"
                          style={{ backgroundColor: profileSetupRoles.includes(role) ? '#10b981' : '#ffffff' }}
                        />
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                  {profileSetupRoles.length > 0 && (
                    <p className="text-xs text-emerald-600 mt-2">
                      {profileSetupRoles.length} role{profileSetupRoles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Have a referral code? Enter it here to support your friend!</p>
                  <input
                    type="text"
                    value={profileSetupReferralCode}
                    onChange={(e) => {
                      setProfileSetupReferralCode(e.target.value.toUpperCase().trim());
                      setAuthError('');
                    }}
                    placeholder="Enter referral code (e.g., SW123456)"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white uppercase"
                    maxLength={20}
                  />
                </div>

                {authError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  onClick={completeProfileSetup}
                  disabled={authLoading || profileSetupUploading || !profileSetupName.trim() || profileSetupRoles.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {authLoading || profileSetupUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {profileSetupUploading ? 'Uploading photo...' : 'Saving profile...'}
                    </span>
                  ) : (
                    'Complete Setup & Continue'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {onboardingStep < onboardingScreens.length ? (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">
                <div className="text-7xl mb-4 animate-bounce">
                  {onboardingScreens[onboardingStep].emoji}
                </div>
              </div>
              
              <div className="p-8 text-center space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {onboardingScreens[onboardingStep].title}
                  </h1>
                  <p className="text-gray-600 text-base whitespace-pre-line leading-relaxed">
                    {onboardingScreens[onboardingStep].subtitle}
                  </p>
                  <div className="mt-4 inline-block bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full">
                    <p className="text-sm font-bold">{onboardingScreens[onboardingStep].highlight}</p>
                  </div>
                </div>
                
                {/* Progress dots */}
                <div className="flex justify-center gap-2 py-4">
                  {onboardingScreens.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === onboardingStep 
                          ? 'w-8 bg-emerald-500' 
                          : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (onboardingStep < onboardingScreens.length - 1) {
                        setOnboardingStep(onboardingStep + 1);
                        posthog.capture('onboarding_step_completed', {
                          step: onboardingStep + 1,
                          total_steps: onboardingScreens.length,
                        });
                      } else {
                        setActiveTab('home');
                        posthog.capture('onboarding_completed', {
                          user_id: userId,
                        });
                      }
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {onboardingStep < onboardingScreens.length - 1 ? 'Next →' : 'शुरू करें! 🚀'}
                  </button>

                  {onboardingStep > 0 && (
                    <button
                      onClick={() => setOnboardingStep(onboardingStep - 1)}
                      className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Switch</h1>
              <p className="text-xs text-gray-500">Ghar ke paas job, 24 hours mein</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
              <span className={`text-xs font-medium ${isAvailable ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isAvailable ? 'Available' : 'Not Available'}
              </span>
              <button
                onClick={async () => {
                  const newAvailability = !isAvailable;
                  setIsAvailable(newAvailability);
                  
                  // Track availability toggle
                  posthog.capture('availability_toggled', {
                    user_id: userId,
                    is_available: newAvailability,
                  });
                  
                  // Update in user profile
                  const updatedProfile = {
                    ...userProfile,
                    isAvailable: newAvailability
                  };
                  setUserProfile(updatedProfile);
                  
                  // Save to Firebase (non-blocking)
                  if (userId) {
                    saveProfileToFirestore(userId, updatedProfile).catch(err => {
                      console.warn('Failed to save availability', err);
                    });
                  }
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                style={{
                  backgroundColor: isAvailable ? '#10b981' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24">
        <div className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">{jobs.length}</div>
                <div className="text-xs text-gray-600 mt-1">Jobs Near You</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
                <div className="text-2xl font-bold text-teal-600">{appliedJobs.length}</div>
                <div className="text-xs text-gray-600 mt-1">Applied</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Interviews</div>
              </div>
            </div>

            {/* Swipeable Job Card */}
            <div className="relative mb-6" style={{ height: '520px' }}>
              {/* Card */}
              <div 
                ref={cardRef}
                onClick={(e) => {
                  // Only open modal if it wasn't a swipe
                  if (!wasSwipe.current && !isDragging.current) {
                    setSelectedJob(job);
                    setShowJobDetail(true);
                  }
                }}
                className={`absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${
                  swipeDirection === 'left' ? '-translate-x-full opacity-0' : 
                  swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''
                }`}
                style={{ touchAction: 'pan-y pan-x', pointerEvents: 'auto' }}
              >
                {/* Urgency Badge */}
                {job.urgency && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                      {job.urgency}
                    </span>
                  </div>
                )}

                {/* Featured Badge */}
                {job.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Company Header */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                        {job.logo}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{job.company}</h2>
                        <div className="flex items-center gap-1 mt-1 text-emerald-100">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{job.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{job.role}</h3>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-3xl font-bold">{job.salary.split(' - ')[0].replace('₹', '')}</span>
                    <span className="text-lg">- {job.salary.split(' - ')[1]}</span>
                    <span className="text-sm opacity-90">{job.salaryPeriod}</span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-6 space-y-4">
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="text-sm font-semibold text-gray-900 truncate">{job.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-teal-50 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Joining</div>
                        <div className="text-sm font-semibold text-gray-900 truncate">{job.joining}</div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Requirements</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Benefits</h4>
                    </div>
                    <div className="space-y-1.5">
                      {job.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Openings */}
                  <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">{job.openings} positions available</span>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">High demand</span>
                  </div>
                </div>
              </div>

              {/* Next card preview */}
              {currentCard < jobs.length - 1 && (
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl -z-10 scale-95 opacity-50"></div>
              )}
            </div>

            {/* Swipe Actions */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 bg-white rounded-full shadow-xl border-2 border-gray-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Swipe or tap</div>
                <div className="text-lg font-bold text-gray-900">{currentCard + 1} / {jobs.length}</div>
              </div>
              
              <button
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <Heart className="w-8 h-8 text-white fill-current" />
              </button>
            </div>

            {/* Hint Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                ❌ Pass &nbsp;&nbsp;•&nbsp;&nbsp; ❤️ Apply &nbsp;&nbsp;•&nbsp;&nbsp; We'll call you in 24 hours
              </p>
            </div>
          </>
        )}

        {activeTab === 'applied' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Applications</h2>
            
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap">
                All ({appliedJobs.length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-200 transition">
                Pending
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-200 transition">
                Interview
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-200 transition">
                Hired
              </button>
            </div>

            {appliedJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">Start swiping right to apply for jobs!</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedJobs.map((job, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow border border-gray-100">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{job.role}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-sm text-emerald-600 font-semibold mt-1">{job.salary.split(' - ')[0]}/month</p>
                      </div>
                    </div>
                    
                    {job.callScheduled ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-blue-900">Call scheduled</div>
                            <div className="text-xs text-blue-700 mt-0.5">We'll call you {job.callTime}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-900">We'll call you within 24 hours</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Try to find the full job details from the jobs array
                          const fullJob = jobs.find(j => j.id === job.id) || job;
                          // Merge applied job data with full job data
                          const mergedJob = {
                            ...fullJob,
                            ...job, // Applied job data takes precedence (status, callScheduled, etc.)
                          };
                          setSelectedJob(mergedJob);
                          setShowJobDetail(true);
                        }}
                        className="flex-1 bg-emerald-50 text-emerald-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelApplication(job);
                        }}
                        className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Profile Photo with Upload */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                      {uploadingPhoto ? (
                        <div className="text-emerald-600 text-xs">Uploading...</div>
                      ) : userProfile.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt={userProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-emerald-600" />
                      )}
                    </div>
                    <label 
                      htmlFor="photo-upload"
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {userProfile.verified && (
                        <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                        {userProfile.joinedDate}
                      </span>
                      <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                        {userProfile.profileComplete}% Complete
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => openEditField('name', userProfile.name)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </div>
                  <div className="font-semibold">{userProfile.phone}</div>
                </div>
                <div 
                  onClick={() => openEditField('location', userProfile.location)}
                  className="bg-white/20 backdrop-blur rounded-xl p-3 cursor-pointer hover:bg-white/30 transition"
                >
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </div>
                  <div className="font-semibold text-sm flex items-center gap-1">
                    {userProfile.location}
                    <Edit className="w-3 h-3 opacity-60" />
                  </div>
                </div>
              </div>
              
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">{userProfile.totalApplied}</div>
                <div className="text-xs text-gray-600 mt-1">Total Applied</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-teal-100">
                <div className="text-2xl font-bold text-teal-600">{userProfile.interviews}</div>
                <div className="text-xs text-gray-600 mt-1">Interviews</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{userProfile.hired}</div>
                <div className="text-xs text-gray-600 mt-1">Hired</div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Profile Details</h3>
              
              <div className="space-y-3">
                <div 
                  onClick={() => openEditField('experience', userProfile.experience)}
                  className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Experience</div>
                      <div className="font-semibold text-gray-900">{userProfile.experience}</div>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>

                <div 
                  onClick={() => openEditField('education', userProfile.education)}
                  className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Education</div>
                      <div className="font-semibold text-gray-900">{userProfile.education}</div>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>

                <div 
                  onClick={() => openEditField('preferredRoles', userProfile.preferredRoles)}
                  className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Preferred Roles</div>
                      <div className="font-semibold text-gray-900">{userProfile.preferredRoles.join(', ')}</div>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>

                <div 
                  onClick={() => openEditField('languages', userProfile.languages)}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Languages</div>
                      <div className="font-semibold text-gray-900">{userProfile.languages.join(', ')}</div>
                    </div>
                  </div>
                  <Edit className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div 
              onClick={() => setShowSuccessStory(true)}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 shadow-sm border border-amber-200 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Your Success Story</h3>
                  <p className="text-sm text-gray-600">
                    You got hired at <span className="font-semibold text-emerald-600">Swiggy</span> in just 18 hours! 
                  </p>
                  <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 mt-2 hover:gap-2 transition-all">
                    Share your story <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  // Open WhatsApp with support number
                  const whatsappNumber = '918368828660';
                  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-emerald-200 transition"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Help & Support</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>

              <button 
                onClick={() => setShowReferral(true)}
                className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:border-emerald-200 transition"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Refer a Friend</div>
                    <div className="text-xs text-emerald-600">Earn ₹200 per hire</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {referralEarnings > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                      ₹{referralEarnings}
                    </span>
                  )}
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              <button 
                onClick={() => {
                  // Track logout
                  posthog.capture('user_logged_out', {
                    user_id: userId,
                  });
                  posthog.reset(); // Reset PostHog session
                  
                  // Clear session
                  localStorage.removeItem('switch_session_v1');
                  
                  // Clear user data
                  if (userId) {
                    localStorage.removeItem(`user_${userId}`);
                  }
                  
                  // Reset all state
                  setUserId(null);
                  setSessionToken(null);
                  setAuthStage('phone');
                  setAuthPhone('');
                  setAuthOtp('');
                  setUserProfile({
                    phone: "",
                    name: "",
                    photoURL: null,
                    location: "",
                    experience: "",
                    preferredRoles: [],
                    languages: [],
                    education: "",
                    verified: false,
                    joinedDate: "",
                    totalApplied: 0,
                    interviews: 0,
                    hired: 0,
                    profileComplete: 0,
                    referralCode: ""
                  });
                  setAppliedJobs([]);
                  setInterviewJobs([]);
                  setHiredJobs([]);
                  setNotifications([]);
                  
                  // Show confirmation
                  alert('Logged out successfully!');
                }}
                className="w-full bg-red-50 rounded-xl p-4 flex items-center justify-center shadow-sm border border-red-200 hover:bg-red-100 transition"
              >
                <LogOut className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-600">Logout</span>
              </button>
            </div>

            {/* App Version */}
            <div className="text-center text-xs text-gray-400 pb-4">
              Switch v1.0.2 • Made with ❤️ for Gurgaon
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Community Feed</h2>
              <p className="text-sm text-gray-600">Apni baat share karo, support lo</p>
            </div>

            {/* Fixed Post Button */}
            <button
              onClick={() => setShowRantModal(true)}
              className="fixed bottom-28 right-4 z-40 bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-full font-semibold shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">Post</span>
            </button>

            {/* Posts Feed */}
            {communityLoading && communityPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Posts load ho rahe hain...</p>
              </div>
            ) : communityPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Abhi koi posts nahi hai</p>
                <p className="text-sm text-gray-500">Pehle aap apni baat share karo!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {post.author_name ? post.author_name[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {post.is_anonymous ? (post.author_name || 'Naam nahi dikhega') : (post.author_name || 'User')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {post.created_at ? new Date(post.created_at * 1000).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Just now'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                          post.user_liked 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.user_liked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likes_count || 0}</span>
                      </button>

                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{post.comments_count || 0}</span>
                      </button>

                      <button 
                        onClick={async () => {
                          try {
                            const shareData = {
                              title: 'Switch Community',
                              text: post.text.substring(0, 100) + '...',
                              url: window.location.href,
                            };
                            
                            if (navigator.share) {
                              await navigator.share(shareData);
                              posthog.capture('post_shared', { user_id: userId, post_id: post.id });
                            } else {
                              // Fallback: Copy to clipboard
                              await navigator.clipboard.writeText(post.text);
                              alert('Post text copy ho gaya!');
                            }
                          } catch (err) {
                            console.error('Share failed:', err);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>

                    {/* Comments Preview */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        <div className="space-y-2">
                          {post.comments.slice(0, 2).map((comment, idx) => (
                            <div key={idx} className="flex gap-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                                {comment.is_anonymous ? 'A' : (comment.author_name?.[0] || 'U')}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-gray-700">
                                  {comment.is_anonymous ? (comment.author_name || 'Naam nahi dikhega') : (comment.author_name || 'User')}
                                </div>
                                <div className="text-sm text-gray-600">{comment.text}</div>
                              </div>
                            </div>
                          ))}
                          {post.comments.length > 2 && (
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="text-sm text-emerald-600 font-medium"
                            >
                              View {post.comments.length - 2} more comments
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Post Rant Modal */}
      {showRantModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Post Your Rant</h2>
              <button 
                onClick={() => {
                  setShowRantModal(false);
                  setNewRantText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  value={newRantText}
                  onChange={(e) => setNewRantText(e.target.value)}
                  placeholder="Apni baat share karo - jobs, boss, work life ke baare mein... (Hinglish mein likh sakte ho)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none text-gray-900"
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {newRantText.length}/1000
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-800">
                  Aapka naam nahi dikhega. Apne work experiences ke baare mein freely share karo! Hinglish mein likh sakte ho.
                </p>
              </div>

              <button
                onClick={postRant}
                disabled={!newRantText.trim() || communityLoading}
                className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {communityLoading ? 'Post kar rahe hain...' : 'Post Karo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Comments / जवाब</h2>
              <button 
                onClick={() => {
                  setSelectedPost(null);
                  setCommentText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Post */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedPost.author_name ? selectedPost.author_name[0].toUpperCase() : 'A'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedPost.is_anonymous ? (selectedPost.author_name || 'Naam nahi dikhega') : (selectedPost.author_name || 'User')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedPost.created_at ? new Date(selectedPost.created_at * 1000).toLocaleString('en-IN') : 'Just now'}
                  </div>
                </div>
              </div>
              <p className="text-gray-800 mt-2">{selectedPost.text}</p>
            </div>

            {/* Comments List */}
            <div className="p-4 space-y-4">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                      {comment.is_anonymous ? 'A' : (comment.author_name?.[0] || 'U')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {comment.is_anonymous ? (comment.author_name || 'Naam nahi dikhega') : (comment.author_name || 'User')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.created_at ? new Date(comment.created_at * 1000).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Just now'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Abhi koi comments nahi hai. Pehle aap comment karo!
                </div>
              )}
            </div>

            {/* Add Comment */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Comment likho..."
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-gray-900"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) {
                      addComment(selectedPost.id);
                    }
                  }}
                />
                <button
                  onClick={() => addComment(selectedPost.id)}
                  disabled={!commentText.trim()}
                  className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Practice Modal - COMMENTED OUT */}
      {/* {showInterviewPractice && practiceJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                {practiceJob.logo}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Applied! 🎉</h2>
              <p className="text-gray-600 mb-4">
                Humne company ko apki details bhej di hai. Call connect kar rahe hai.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border-2 border-amber-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Interview Practice Karo!</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Us se pehle interview ke liye practice kare mere saath. Jo log practice karte hai unka interview nikal jata hai.
                  </p>
                  <p className="text-sm font-semibold text-emerald-700">
                    Apne chances badhaye! 🚀
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <Video className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Kya hoga practice call mein?</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• AI se interview questions practice karein</li>
                    <li>• Apne answers improve karein</li>
                    <li>• Confidence build karein</li>
                    <li>• Interview ke liye ready ho jayein</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Interview Practice</span>
                  <span className="text-2xl font-bold text-emerald-600">₹50</span>
                </div>
                <p className="text-xs text-gray-600">
                  AI se practice call milegi. Interview questions ka answer practice karein.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowInterviewPractice(false);
                  setPracticeJob(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Baad Mein
              </button>
              <button
                onClick={async () => {
                  if (!userId || !practiceJob) return;
                  
                  try {
                    setPaymentLoading(true);
                    
                    // Create payment order
                    const paymentRes = await fetch(`${API_BASE}/api/switch/practice-payment`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        user_id: userId,
                        job_id: String(practiceJob.id),
                        job_role: practiceJob.role,
                        job_company: practiceJob.company,
                        amount: 50,
                      }),
                    });
                    
                    if (paymentRes.ok) {
                      const paymentData = await paymentRes.json();
                      
                      // Initialize Razorpay
                      const options = {
                        key: paymentData.razorpay_key,
                        amount: paymentData.amount,
                        currency: 'INR',
                        name: 'Switch',
                        description: `Interview Practice - ${practiceJob.role}`,
                        order_id: paymentData.order_id,
                        handler: async function(response) {
                          // Payment successful - verify and initiate call
                          try {
                            const verifyRes = await fetch(`${API_BASE}/api/switch/practice-payment/verify`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                user_id: userId,
                                job_id: String(practiceJob.id),
                                payment_id: response.razorpay_payment_id,
                                order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                              }),
                            });
                            
                            if (verifyRes.ok) {
                              setShowInterviewPractice(false);
                              setPracticeJob(null);
                              alert('Payment successful! Practice call connect ho rahi hai. Aapko call aayegi 2-3 minutes mein.');
                              
                              posthog.capture('practice_payment_success', {
                                user_id: userId,
                                job_id: String(practiceJob.id),
                                amount: 50,
                              });
                            } else {
                              alert('Payment verification failed. Please contact support.');
                            }
                          } catch (err) {
                            console.error('Payment verification error:', err);
                            alert('Payment verification error. Please contact support.');
                          }
                        },
                        prefill: {
                          name: userProfile.name || '',
                          contact: userProfile.phone?.replace(/\D/g, '') || '',
                        },
                        theme: {
                          color: '#10b981'
                        }
                      };
                      
                      const razorpay = new window.Razorpay(options);
                      razorpay.open();
                      
                      razorpay.on('payment.failed', function(response) {
                        console.error('Payment failed:', response);
                        alert('Payment failed. Please try again.');
                        setPaymentLoading(false);
                        
                        posthog.capture('practice_payment_failed', {
                          user_id: userId,
                          job_id: String(practiceJob.id),
                          error: response.error?.description,
                        });
                      });
                      
                    } else {
                      const errorData = await paymentRes.json().catch(() => ({ detail: 'Payment setup failed' }));
                      alert('Payment setup mein error aaya. Phir se try karo.');
                      console.error('Payment setup error:', errorData);
                    }
                  } catch (err) {
                    console.error('Payment error:', err);
                    alert('Payment mein error aaya. Phir se try karo.');
                  } finally {
                    setPaymentLoading(false);
                  }
                }}
                disabled={paymentLoading || !userId}
                className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Pay ₹50 & Practice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Call Schedule Modal */}
      {showCallSchedule && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                {selectedJob.logo}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Applied! 🎉</h2>
              <p className="text-gray-600">We'll call you to confirm details and schedule interview</p>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900 text-sm">When should we call?</h3>
              <button 
                onClick={() => scheduleCall('in 1 hour')}
                className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-left hover:bg-emerald-100 transition"
              >
                <div className="font-semibold text-gray-900">Right now (1 hour)</div>
                <div className="text-sm text-gray-600">Best for urgent applications</div>
              </button>
              <button 
                onClick={() => scheduleCall('tomorrow morning')}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-left hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900">Tomorrow morning</div>
                <div className="text-sm text-gray-600">We'll call between 10 AM - 12 PM</div>
              </button>
              <button 
                onClick={() => scheduleCall('tomorrow evening')}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-left hover:bg-gray-100 transition"
              >
                <div className="font-semibold text-gray-900">Tomorrow evening</div>
                <div className="text-sm text-gray-600">We'll call between 5 PM - 7 PM</div>
              </button>
            </div>

            <button
              onClick={() => setShowCallSchedule(false)}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              I'll choose later
            </button>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobDetail && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <button 
                onClick={() => setShowJobDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">Job Details</h2>
              <div className="w-9"></div>
            </div>

            {/* Job Header */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {selectedJob.logo}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedJob.company}</h2>
                  {selectedJob.companyRating && (
                    <div className="flex items-center gap-2 text-emerald-100 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {selectedJob.companyRating} rating
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedJob.role}</h3>
              {selectedJob.salary && (
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {selectedJob.salary.includes(' - ') ? (
                    <>
                      <span className="text-3xl font-bold">{selectedJob.salary.split(' - ')[0].replace('₹', '')}</span>
                      <span className="text-lg">- {selectedJob.salary.split(' - ')[1]}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">{selectedJob.salary.replace('₹', '')}</span>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              {(selectedJob.avgHiringTime || selectedJob.employeesHired || selectedJob.openings) && (
                <div className="grid grid-cols-3 gap-3">
                  {selectedJob.avgHiringTime && (
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Avg hiring</div>
                      <div className="font-bold text-gray-900">{selectedJob.avgHiringTime}</div>
                    </div>
                  )}
                  {selectedJob.employeesHired && (
                    <div className="bg-teal-50 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Hired</div>
                      <div className="font-bold text-gray-900">{selectedJob.employeesHired}+</div>
                    </div>
                  )}
                  {selectedJob.openings && (
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Openings</div>
                      <div className="font-bold text-gray-900">{selectedJob.openings}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">About the Job</h4>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Requirements</h4>
                  <div className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-600">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && Array.isArray(selectedJob.benefits) && selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Benefits</h4>
                  <div className="space-y-2">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {selectedJob.location && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Location</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">{selectedJob.location}</div>
                        {selectedJob.distance && (
                          <div className="text-sm text-emerald-600 mt-1">{selectedJob.distance} from you</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Apply Button - Only show if not already applied */}
              {!appliedJobs.some(job => job.id === selectedJob.id) && (
                <button
                  onClick={() => {
                    handleSwipe('right');
                    setShowJobDetail(false);
                  }}
                  className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  Apply Now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {showReferral && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Refer & Earn</h2>
              <button 
                onClick={() => setShowReferral(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Earnings Banner */}
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white text-center">
                <Gift className="w-16 h-16 mx-auto mb-3" />
                <h3 className="text-3xl font-bold mb-2">₹{referralEarnings}</h3>
                <p className="text-amber-100">Total referral earnings</p>
              </div>

              {/* How it works */}
              <div className="bg-emerald-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">How it works</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <div className="font-semibold text-gray-900">Share your code</div>
                      <div className="text-sm text-gray-600">Send to friends looking for jobs</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <div className="font-semibold text-gray-900">They sign up</div>
                      <div className="text-sm text-gray-600">Using your referral code</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <div className="font-semibold text-gray-900">Earn ₹200</div>
                      <div className="text-sm text-gray-600">When they get hired through Switch!</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your referral code */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Your Referral Code</h3>
                <div className="bg-gray-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="font-mono text-2xl font-bold text-emerald-600">{userProfile.referralCode}</div>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition"
                  >
                    {copiedReferral ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-emerald-600" />
                    )}
                  </button>
                </div>
                {copiedReferral && (
                  <p className="text-sm text-emerald-600 mt-2">✓ Copied to clipboard!</p>
                )}
              </div>

              {/* Share buttons */}
              <div className="space-y-3">
                <button
                  onClick={shareReferral}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  <Share2 className="w-5 h-5" />
                  Share with Friends
                </button>
              </div>

              {/* Referred friends */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Your Referrals ({referredFriends.length})</h3>
                {referredFriends.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No referrals yet</p>
                    <p className="text-gray-500 text-xs mt-1">Share your code to start earning!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {referredFriends.map((friend, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                            {friend.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{friend.name}</div>
                            <div className={`text-sm ${
                              friend.status === 'Hired' ? 'text-emerald-600' : 'text-gray-500'
                            }`}>
                              {friend.status}
                            </div>
                          </div>
                        </div>
                        {friend.earnings > 0 && (
                          <div className="font-bold text-emerald-600">+₹{friend.earnings}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && editField && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Edit {editField.charAt(0).toUpperCase() + editField.slice(1).replace(/([A-Z])/g, ' $1')}
              </h2>
              <p className="text-sm text-gray-600">
                {editField === 'preferredRoles' && 'Select your preferred job roles from the list below'}
                {editField === 'languages' && 'Select languages you can speak from the list below'}
                {editField === 'experience' && 'Enter your work experience (e.g., 2 years, Fresher)'}
                {editField === 'education' && 'Enter your education level (e.g., 12th Pass, Graduate)'}
                {editField === 'location' && 'Enter your location or use current location from your phone'}
                {editField === 'name' && 'Enter your full name'}
              </p>
            </div>

            <div className="mb-6">
              {editField === 'experience' || editField === 'education' ? (
                <select
                  value={tempEditValue}
                  onChange={(e) => setTempEditValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-gray-900 bg-white"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {editField === 'experience' && (
                    <>
                      <option value="">Select experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1 year">1 year</option>
                      <option value="2 years">2 years</option>
                      <option value="3 years">3 years</option>
                      <option value="4 years">4 years</option>
                      <option value="5+ years">5+ years</option>
                    </>
                  )}
                  {editField === 'education' && (
                    <>
                      <option value="">Select education</option>
                      <option value="Below 10th">Below 10th</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </>
                  )}
                </select>
              ) : editField === 'preferredRoles' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Select one or more roles (you can select multiple):</p>
                  <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 space-y-2">
                    {[
                      'Delivery Partner',
                      'Delivery Executive',
                      'Warehouse Worker',
                      'Picker/Packer',
                      'Security Guard',
                      'Store Assistant',
                      'Retail Associate',
                      'Waiter/Server',
                      'Receptionist',
                      'Driver',
                      'Cook/Chef',
                      'Housekeeping',
                      'Sales Executive',
                      'Customer Service',
                      'Data Entry',
                      'Packing/Assembly',
                      'Loading/Unloading',
                      'Cashier',
                      'Supervisor',
                      'Helper',
                      'Cleaner',
                      'Watchman',
                      'Gardener',
                      'Electrician',
                      'Plumber',
                      'Carpenter',
                      'Painter',
                      'Mason',
                      'Welder',
                      'Mechanic'
                    ].map((role) => {
                      const currentRoles = tempEditValue ? tempEditValue.split(',').map(r => r.trim()) : [];
                      const isSelected = currentRoles.includes(role);
                      return (
                        <label
                          key={role}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                            isSelected
                              ? 'bg-emerald-50 border-2 border-emerald-500'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              let newRoles = currentRoles;
                              if (e.target.checked) {
                                newRoles = [...currentRoles, role];
                              } else {
                                newRoles = currentRoles.filter(r => r !== role);
                              }
                              setTempEditValue(newRoles.join(', '));
                            }}
                            className="w-5 h-5 rounded focus:ring-emerald-500 cursor-pointer"
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                              backgroundColor: isSelected ? '#10b981' : '#ffffff',
                              border: '2px solid',
                              borderColor: isSelected ? '#10b981' : '#d1d5db',
                              backgroundImage: isSelected ? "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E\")" : 'none',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              color: '#ffffff',
                              outline: 'none'
                            }}
                          />
                          <span className="font-medium text-gray-900">{role}</span>
                        </label>
                      );
                    })}
                  </div>
                  {tempEditValue && (
                    <div className="text-sm text-gray-600">
                      Selected: <span className="font-semibold text-emerald-600">{tempEditValue.split(',').length} role(s)</span>
                    </div>
                  )}
                </div>
              ) : editField === 'languages' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Select one or more languages (you can select multiple):</p>
                  <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 space-y-2">
                    {[
                      'Hindi',
                      'English',
                      'Punjabi',
                      'Haryanvi',
                      'Urdu',
                      'Bengali',
                      'Tamil',
                      'Telugu',
                      'Marathi',
                      'Gujarati',
                      'Kannada',
                      'Malayalam',
                      'Odia',
                      'Assamese',
                      'Nepali',
                      'Sanskrit'
                    ].map((language) => {
                      const currentLanguages = tempEditValue ? tempEditValue.split(',').map(l => l.trim()) : [];
                      const isSelected = currentLanguages.includes(language);
                      return (
                        <label
                          key={language}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                            isSelected
                              ? 'bg-emerald-50 border-2 border-emerald-500'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              let newLanguages = currentLanguages;
                              if (e.target.checked) {
                                newLanguages = [...currentLanguages, language];
                              } else {
                                newLanguages = currentLanguages.filter(l => l !== language);
                              }
                              setTempEditValue(newLanguages.join(', '));
                            }}
                            className="w-5 h-5 rounded focus:ring-emerald-500 cursor-pointer"
                            style={{
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                              backgroundColor: isSelected ? '#10b981' : '#ffffff',
                              border: '2px solid',
                              borderColor: isSelected ? '#10b981' : '#d1d5db',
                              backgroundImage: isSelected ? "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E\")" : 'none',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center',
                              color: '#ffffff',
                              outline: 'none'
                            }}
                          />
                          <span className="font-medium text-gray-900">{language}</span>
                        </label>
                      );
                    })}
                  </div>
                  {tempEditValue && (
                    <div className="text-sm text-gray-600">
                      Selected: <span className="font-semibold text-emerald-600">{tempEditValue.split(',').length} language(s)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempEditValue}
                    onChange={(e) => setTempEditValue(e.target.value)}
                    placeholder={
                      editField === 'location' ? 'Sector 46, Gurgaon' :
                      'Enter value'
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-gray-900"
                    autoFocus
                  />
                  {editField === 'location' && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (navigator.geolocation) {
                          try {
                            navigator.geolocation.getCurrentPosition(
                              async (position) => {
                                const { latitude, longitude } = position.coords;
                                
                                // Reverse geocode to get address
                                try {
                                  const geocodeRes = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                                  );
                                  const geocodeData = await geocodeRes.json();
                                  
                                  // Format address nicely
                                  const address = geocodeData.address || {};
                                  let locationText = '';
                                  
                                  if (address.suburb || address.neighbourhood) {
                                    locationText = `${address.suburb || address.neighbourhood}`;
                                  } else if (address.city || address.town || address.village) {
                                    locationText = `${address.city || address.town || address.village}`;
                                  } else if (address.state_district) {
                                    locationText = address.state_district;
                                  } else {
                                    locationText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                                  }
                                  
                                  // Add city/state if available
                                  if (address.city || address.state) {
                                    locationText += `, ${address.city || address.state || ''}`;
                                  }
                                  
                                  setTempEditValue(locationText.trim());
                                } catch (err) {
                                  console.warn('Failed to reverse geocode:', err);
                                  // Fallback to coordinates
                                  setTempEditValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                }
                              },
                              (error) => {
                                alert('Failed to get location. Please enable location permissions in your browser settings.');
                                console.warn('Geolocation error:', error);
                              },
                              {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 0
                              }
                            );
                          } catch (err) {
                            alert('Geolocation not available on this device.');
                            console.warn('Geolocation error:', err);
                          }
                        } else {
                          alert('Geolocation is not supported by your browser.');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-xl font-semibold hover:bg-emerald-100 transition"
                    >
                      <MapPin className="w-4 h-4" />
                      Use Current Location
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  setEditField(null);
                  setTempEditValue('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedField}
                disabled={!tempEditValue}
                className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Story Modal */}
      {showSuccessStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-white fill-current" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Success Story! 🎉</h2>
              <p className="text-gray-600 mb-6">
                You got hired at <span className="font-bold text-emerald-600">Swiggy</span> in just <span className="font-bold">18 hours</span>!
              </p>
              
              <div className="bg-emerald-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-gray-700 italic">
                  "मैंने Switch app से सिर्फ 18 घंटे में Swiggy में delivery partner की job पाई! Process बहुत easy था और team बहुत helpful है। अब मैं अच्छी earning कर रहा हूं!"
                </p>
                <p className="text-sm text-gray-600 mt-2">- {userProfile.name}</p>
              </div>
              
              <button
                onClick={() => {
                  shareReferral();
                  setShowSuccessStory(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold mb-3 hover:scale-105 active:scale-95 transition-transform"
              >
                Share My Story 🚀
              </button>
              <button
                onClick={() => setShowSuccessStory(false)}
                className="text-gray-500 text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'home' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('applied')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                activeTab === 'applied' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-medium">Applied</span>
              {appliedJobs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {appliedJobs.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab('community');
                loadCommunityFeed();
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'community' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Community</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'profile' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchApp;

/*
==================== FIREBASE SETUP INSTRUCTIONS ====================

1. CREATE FIREBASE PROJECT:
   - Go to https://console.firebase.google.com
   - Create a new project: "Switch-App"
   - Enable Google Analytics (optional)

2. ENABLE FIRESTORE:
   - In Firebase Console, go to Firestore Database
   - Click "Create Database"
   - Start in production mode (or test mode for development)
   - Choose a location (e.g., asia-south1 for India)

3. ENABLE STORAGE:
   - In Firebase Console, go to Storage
   - Click "Get Started"
   - Set up security rules (or start in test mode)

4. GET CONFIGURATION:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the firebaseConfig object
   - Replace the firebaseConfig at the top of this file

5. INSTALL FIREBASE SDK:
   npm install firebase

6. UNCOMMENT FIREBASE CODE:
   - Uncomment the import statements at the top
   - Uncomment the initialization code
   - The app will automatically use real Firebase instead of localStorage

7. FIRESTORE STRUCTURE:
   users (collection)
   └── {phoneNumber} (document)
       ├── name: string
       ├── photoURL: string
       ├── location: string
       ├── experience: string
       ├── preferredRoles: array
       ├── languages: array
       ├── education: string
       ├── verified: boolean
       ├── joinedDate: string
       ├── totalApplied: number
       ├── interviews: number
       ├── hired: number
       ├── profileComplete: number
       ├── referralCode: string
       └── createdAt: timestamp

8. STORAGE STRUCTURE:
   profile_photos/
   └── {phoneNumber}.jpg

9. SECURITY RULES (Firestore):
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }

10. SECURITY RULES (Storage):
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /profile_photos/{phoneNumber} {
          allow read: if true;
          allow write: if request.auth != null;
        }
      }
    }

11. AUTHENTICATION (Optional but recommended):
    - Enable Phone Authentication in Firebase Console
    - This will secure user data better than just phone number
    - Each user should authenticate via OTP before accessing their data

12. CURRENT SETUP (Demo Mode):
    - Currently using localStorage to simulate Firestore
    - All data is stored in browser localStorage
    - Key format: user_{phoneNumber}
    - Photo is stored as base64 in localStorage
    - Perfect for testing without Firebase setup
    - Switch to real Firebase when deploying to production

==================== END OF SETUP INSTRUCTIONS ====================
*/


