# Switch Employer Side - Design Document

## Overview

The employer side of Switch allows businesses and individuals to post job requirements and find workers through a Tinder-like swipe interface. This document outlines the complete design for this feature.

---

## 1. User Types & Personas

### Employer Types
| Type | Examples | Primary Need |
|------|----------|--------------|
| **Small Business** | Restaurant, Shop, Salon | Regular staff + occasional extra help |
| **Delivery/Logistics** | Delivery companies, Warehouses | High volume of delivery partners |
| **Household** | Families | Maid, Cook, Driver, Nanny |
| **Events** | Wedding planners, Caterers | One-time large workforce |
| **Construction** | Contractors, Builders | Daily wage workers |

---

## 2. App Mode Switching

### Dual-Mode Architecture
```
Switch App
├── Worker Mode (Current) - Job seekers swipe jobs
└── Employer Mode (New) - Employers swipe candidates
```

### Mode Toggle
- Login screen: "Looking for job?" vs "Looking to hire?"
- Settings: Switch between modes anytime
- Same phone auth, different dashboard

---

## 3. Data Models

### Employer Profile
```javascript
employerProfile: {
  id: string,
  phone: string,
  businessName: string,
  businessType: 'restaurant' | 'shop' | 'household' | 'delivery' | 'construction' | 'events' | 'other',
  ownerName: string,
  photoURL: string | null,
  location: string,
  address: string,
  gstNumber: string | null,  // Optional for verification
  verified: boolean,
  joinedDate: string,
  totalHires: number,
  activeJobs: number,
  rating: number,  // From workers
}
```

### Job Posting
```javascript
jobPosting: {
  id: string,
  employerId: string,

  // Basic Info
  role: string,  // From predefined roles
  title: string,  // Custom title
  description: string,

  // Job Type
  jobType: 'full_time' | 'part_time' | 'gig',

  // Timing & Urgency
  urgency: 'instant' | 'same_day' | 'next_day' | 'this_week' | 'flexible',
  startDate: Date | null,  // For scheduled jobs

  // Duration (for gigs)
  duration: {
    value: number,
    unit: 'hours' | 'days' | 'weeks' | 'months' | 'ongoing'
  },

  // Shift
  shift: 'morning' | 'afternoon' | 'evening' | 'night' | 'full_day' | 'flexible',
  shiftTiming: string,  // e.g., "9 AM - 6 PM"

  // Compensation
  paymentType: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'per_task',
  budget: {
    min: number,
    max: number,
    negotiable: boolean
  },

  // Location
  location: string,  // Area name
  fullAddress: string,
  coordinates: { lat: number, lng: number },

  // Requirements
  workersNeeded: number,
  experience: 'fresher_ok' | '1_year' | '2_years' | '3_plus_years',
  skills: string[],
  languages: string[],
  gender: 'any' | 'male' | 'female',  // Some jobs have preferences

  // Status
  status: 'draft' | 'active' | 'paused' | 'filled' | 'expired',
  createdAt: Date,
  expiresAt: Date,

  // Stats
  views: number,
  applications: number,
  shortlisted: number,
  hired: number,
}
```

### Candidate Match
```javascript
candidateMatch: {
  candidateId: string,
  jobId: string,
  employerId: string,

  // Match Status
  employerAction: 'pending' | 'liked' | 'passed',
  candidateAction: 'pending' | 'applied' | 'interested',

  // Connection
  isMatched: boolean,  // Both liked each other
  matchedAt: Date | null,

  // Communication
  callScheduled: boolean,
  callTime: string | null,

  // Outcome
  status: 'pending' | 'interviewing' | 'hired' | 'rejected' | 'withdrew',
}
```

---

## 4. UI Screens & Flow

### 4.1 Employer Onboarding

#### Screen: Business Type Selection
```
+----------------------------------+
|         Switch for Business      |
|                                  |
|   What type of business?         |
|                                  |
|   [Restaurant/Cafe]  [Shop]      |
|   [Household]        [Delivery]  |
|   [Construction]     [Events]    |
|   [Other]                        |
|                                  |
|         [Continue]               |
+----------------------------------+
```

#### Screen: Business Profile Setup
```
+----------------------------------+
|      Setup Your Profile          |
|                                  |
|   [Upload Logo/Photo]            |
|                                  |
|   Business Name                  |
|   [________________________]     |
|                                  |
|   Your Name (Owner/Manager)      |
|   [________________________]     |
|                                  |
|   Business Location              |
|   [Get Current Location]         |
|                                  |
|   GST Number (Optional)          |
|   [________________________]     |
|                                  |
|         [Start Hiring]           |
+----------------------------------+
```

### 4.2 Main Navigation (Employer)

**Bottom Navigation:**
```
+------------------------------------------+
|  [Home]  [My Jobs]  [Matches]  [Profile] |
+------------------------------------------+
```

| Tab | Purpose |
|-----|---------|
| **Home** | Post new job + Quick stats |
| **My Jobs** | Active/Past job postings |
| **Matches** | Connected candidates |
| **Profile** | Business profile & settings |

### 4.3 Home Tab (Post Job + Find Workers)

```
+----------------------------------+
|  Switch Business    [Profile]    |
|  "Hire karo, fast!"              |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  | + Post New Requirement     |  |
|  |   Find workers instantly   |  |
|  +----------------------------+  |
|                                  |
|  Quick Stats                     |
|  [5 Active] [12 Matches] [3 Hired]|
|                                  |
|  Recent Activity                 |
|  +----------------------------+  |
|  | Ravi accepted your offer   |  |
|  | 2 new matches for Waiter   |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### 4.4 Job Posting Flow (Multi-step)

#### Step 1: Role Selection
```
+----------------------------------+
|  What role do you need?          |
|  (Select one)                    |
|                                  |
|  Popular Roles:                  |
|  [Delivery Boy]  [Waiter]        |
|  [Cook/Chef]     [Helper]        |
|  [Driver]        [Security]      |
|  [Cleaner]       [Packer]        |
|  [Salesperson]   [Cashier]       |
|                                  |
|  [+ Custom Role]                 |
|                                  |
|            [Next ->]             |
+----------------------------------+
```

#### Step 2: Job Type & Urgency
```
+----------------------------------+
|  Job Details                     |
|                                  |
|  Type:                           |
|  [Full-time] [Part-time] [Gig]   |
|                                  |
|  When do you need?               |
|  [ASAP]      [Today]             |
|  [Tomorrow]  [This Week]         |
|  [Flexible]                      |
|                                  |
|  How long?                       |
|  [2-4 hrs] [Full Day] [1 Week]   |
|  [1 Month] [Ongoing]             |
|                                  |
|     [<- Back]    [Next ->]       |
+----------------------------------+
```

#### Step 3: Compensation
```
+----------------------------------+
|  Budget / Salary                 |
|                                  |
|  Payment Type:                   |
|  [Hourly] [Daily] [Monthly]      |
|                                  |
|  Budget Range:                   |
|  Min: [________] /day            |
|  Max: [________] /day            |
|                                  |
|  [x] Negotiable                  |
|                                  |
|  Common rates for Waiter:        |
|  Daily: 400-600 | Monthly: 12-18K|
|                                  |
|     [<- Back]    [Next ->]       |
+----------------------------------+
```

#### Step 4: Location & Shift
```
+----------------------------------+
|  Work Location                   |
|                                  |
|  [Get Current Location]          |
|  OR                              |
|  Area: [Sector 29, Gurgaon____]  |
|                                  |
|  Shift Timing:                   |
|  [Morning]   [Afternoon]         |
|  [Evening]   [Night]             |
|  [Full Day]  [Flexible]          |
|                                  |
|  Specific time (optional):       |
|  From: [9:00 AM] To: [6:00 PM]   |
|                                  |
|     [<- Back]    [Next ->]       |
+----------------------------------+
```

#### Step 5: Requirements
```
+----------------------------------+
|  Requirements                    |
|                                  |
|  Workers Needed:                 |
|  [ 1 ]  [ 2 ]  [ 3 ]  [ 5+ ]     |
|                                  |
|  Experience:                     |
|  [Fresher OK] [1+ Year] [3+ Yr]  |
|                                  |
|  Languages:                      |
|  [Hindi] [English] [Both]        |
|                                  |
|  Gender Preference:              |
|  [Any] [Male] [Female]           |
|                                  |
|  Additional notes (optional):    |
|  [________________________]      |
|  [________________________]      |
|                                  |
|     [<- Back]  [Post Job ->]     |
+----------------------------------+
```

#### Step 6: Confirmation
```
+----------------------------------+
|           Job Posted!            |
|                                  |
|      [Checkmark Animation]       |
|                                  |
|   Your requirement for           |
|   "Waiter" has been posted       |
|                                  |
|   We found 15 matching workers   |
|   near Sector 29, Gurgaon        |
|                                  |
|   [Start Swiping]                |
|                                  |
|   [View My Jobs]                 |
+----------------------------------+
```

### 4.5 Candidate Swiping Interface

```
+----------------------------------+
|  Waiter - Sector 29    [Filters] |
|  15 candidates available         |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  |                            |  |
|  |      [Profile Photo]       |  |
|  |                            |  |
|  |   Ravi Kumar               |  |
|  |   2 yrs experience         |  |
|  |                            |  |
|  |   [Waiter] [Hindi] [Eng]   |  |
|  |                            |  |
|  |   Sector 18 (2.5 km away)  |  |
|  |                            |  |
|  |   Available: Immediately   |  |
|  |                            |  |
|  |   [Star] 4.8 (12 jobs)     |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
|    [X Pass]         [Heart]      |
|                                  |
+----------------------------------+
```

### 4.6 Candidate Card Design

```
+------------------------------------+
|  +------------------------------+  |
|  |                              |  |
|  |    [Profile Photo]           |  |
|  |    or Default Avatar         |  |
|  |                              |  |
|  |  [Verified Badge]            |  |
|  |                              |  |
|  +------------------------------+  |
|                                    |
|  Ravi Kumar                        |
|  "Hardworking & punctual"          |
|                                    |
|  Experience: 2 years as Waiter     |
|                                    |
|  Skills:                           |
|  [Waiter] [Cashier] [Billing]      |
|                                    |
|  Languages: Hindi, English         |
|                                    |
|  Location: Sector 18, Gurgaon      |
|  Distance: 2.5 km from job         |
|                                    |
|  Availability:                     |
|  [Green Dot] Available Now         |
|                                    |
|  Stats:                            |
|  12 jobs done | 4.8 rating         |
|                                    |
|  Expected: 500/day                 |
|                                    |
+------------------------------------+
```

### 4.7 Candidate Detail Modal

When tapped (not swiped):

```
+----------------------------------+
|  [X Close]              [Share]  |
+----------------------------------+
|                                  |
|       [Large Profile Photo]      |
|                                  |
|   Ravi Kumar                     |
|   [Verified] [Available Now]     |
|                                  |
+----------------------------------+
|  About                           |
|  "Main 2 saal se waiter ka       |
|   kaam kar raha hoon. Punctual   |
|   aur hardworking hoon."         |
+----------------------------------+
|  Experience                      |
|  - CCD, Sector 29 (1 yr)         |
|  - Local Restaurant (1 yr)       |
+----------------------------------+
|  Skills                          |
|  [Waiter] [Cashier] [Billing]    |
|  [Customer Service]              |
+----------------------------------+
|  Reviews (from past employers)   |
|  "Very good worker" - 5 stars    |
|  "Always on time" - 4 stars      |
+----------------------------------+
|                                  |
|  [Pass]           [Connect]      |
|                                  |
+----------------------------------+
```

### 4.8 My Jobs Tab

```
+----------------------------------+
|  My Job Postings                 |
+----------------------------------+
|  [Active] [Filled] [Expired]     |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  | Waiter                     |  |
|  | Full-time | Sector 29      |  |
|  | 400-500/day                |  |
|  |                            |  |
|  | [15 Views] [8 Matches]     |  |
|  | Posted 2 hours ago         |  |
|  |                            |  |
|  | [View Candidates] [Edit]   |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | Delivery Boy               |  |
|  | Gig | Today only           |  |
|  | 150/hr                     |  |
|  |                            |  |
|  | [5 Views] [2 Matches]      |  |
|  | Posted 30 min ago          |  |
|  |                            |  |
|  | [View Candidates] [Edit]   |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### 4.9 Matches Tab

```
+----------------------------------+
|  Your Matches                    |
|  Workers interested in your jobs |
+----------------------------------+
|  [All] [To Call] [Hired]         |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  | [Photo] Ravi Kumar         |  |
|  | For: Waiter - Sector 29    |  |
|  | Matched 10 min ago         |  |
|  |                            |  |
|  | [Call Now]  [Schedule]     |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [Photo] Amit Singh         |  |
|  | For: Delivery Boy          |  |
|  | Matched 1 hour ago         |  |
|  |                            |  |
|  | [Call Now]  [Schedule]     |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

### 4.10 Employer Profile Tab

```
+----------------------------------+
|  +----------------------------+  |
|  |  [Business Logo]           |  |
|  |                            |  |
|  |  Sharma Restaurant         |  |
|  |  [Verified Business]       |  |
|  |                            |  |
|  |  Sector 29, Gurgaon        |  |
|  +----------------------------+  |
|                                  |
|  Stats                           |
|  [12 Hired] [4.5 Rating] [6 Mo]  |
|                                  |
|  Business Details                |
|  +----------------------------+  |
|  | Type: Restaurant           |  |
|  | Owner: Rajesh Sharma       |  |
|  | Phone: +91 98765 43210     |  |
|  | GST: [Add for verification]|  |
|  +----------------------------+  |
|                                  |
|  [Edit Profile]                  |
|  [Help & Support]                |
|  [Switch to Worker Mode]         |
|  [Logout]                        |
|                                  |
+----------------------------------+
```

---

## 5. Interaction Flows

### 5.1 Post Job → Find Workers Flow
```
1. Employer taps "Post New Requirement"
2. Selects role from list
3. Chooses job type (full-time/gig)
4. Sets urgency and duration
5. Enters budget/salary
6. Sets location and shift
7. Adds requirements
8. Posts job
9. Immediately sees matching candidates
10. Swipes through candidates
11. Matches with interested candidates
12. Calls/schedules interview
13. Hires worker
```

### 5.2 Matching Logic
```
Employer swipes RIGHT on candidate
  → If candidate APPLIED to this job type/location
    → INSTANT MATCH!
    → Both get notification
    → Can start communication

  → If candidate hasn't applied yet
    → Candidate gets "Employer interested" notification
    → If candidate swipes right back → MATCH!
```

### 5.3 After Match
```
1. Both see each other in "Matches" tab
2. Employer can:
   - Call directly (one-tap)
   - Schedule call time
   - View full profile
   - Mark as "Hired" or "Not interested"
3. Candidate can:
   - Accept/reject call
   - Ask questions
   - Confirm availability
```

---

## 6. API Endpoints (New)

### Employer Profile
```
POST   /api/employer/profile           - Create employer profile
GET    /api/employer/profile/{id}      - Get employer profile
PUT    /api/employer/profile/{id}      - Update employer profile
```

### Job Postings
```
POST   /api/employer/jobs              - Create job posting
GET    /api/employer/jobs/{employerId} - Get all jobs by employer
GET    /api/employer/jobs/{jobId}      - Get single job details
PUT    /api/employer/jobs/{jobId}      - Update job posting
DELETE /api/employer/jobs/{jobId}      - Delete/archive job
```

### Candidate Discovery
```
GET    /api/employer/candidates/{jobId}         - Get matching candidates
POST   /api/employer/candidates/{jobId}/swipe   - Swipe on candidate
GET    /api/employer/matches/{employerId}       - Get all matches
PUT    /api/employer/matches/{matchId}          - Update match status
```

### Analytics
```
GET    /api/employer/analytics/{employerId}     - Get hiring stats
```

---

## 7. State Management

### New State Variables
```javascript
// Mode
appMode: 'worker' | 'employer'

// Employer Auth
employerProfile: { ... }

// Job Posting
currentJobDraft: { ... }
jobPostingStep: 1 | 2 | 3 | 4 | 5 | 6
myJobs: []

// Candidate Discovery
candidatesForJob: []
currentCandidateIndex: number
candidateSwipeDirection: 'left' | 'right' | null

// Matches
employerMatches: []
selectedMatch: { ... }

// Modals
showPostJobModal: boolean
showCandidateDetail: boolean
showMatchDetail: boolean
showCallScheduler: boolean
```

---

## 8. UI Components to Create

### New Components
1. `EmployerOnboarding` - Business setup flow
2. `EmployerHome` - Dashboard with quick actions
3. `PostJobFlow` - Multi-step job posting
4. `CandidateCard` - Swipable candidate card
5. `CandidateDetail` - Full candidate profile modal
6. `MyJobsList` - List of posted jobs
7. `MatchesList` - Connected candidates
8. `EmployerProfile` - Business profile page
9. `CallScheduler` - Schedule calls with matches

### Reusable from Worker Mode
- OTP Auth flow (same phone auth)
- Swipe gesture handling
- Card animations
- Bottom navigation structure
- Modal patterns
- Button styles
- Color scheme (emerald/teal gradient)

---

## 9. Color Scheme & Branding

### Employer Mode Colors
Keep consistent with worker mode but with subtle differentiation:

| Element | Worker Mode | Employer Mode |
|---------|-------------|---------------|
| Primary Gradient | emerald-500 to teal-500 | emerald-600 to teal-600 (slightly darker) |
| Accent | emerald-500 | teal-500 |
| Headers | "Switch" | "Switch Business" |
| Tagline | "Ghar ke paas job" | "Hire karo, fast!" |

---

## 10. Hindi/Hinglish Strings

```javascript
employerStrings = {
  // Onboarding
  businessTypeTitle: "Aapka business kaisa hai?",
  setupProfile: "Apni profile complete karo",
  startHiring: "Hiring shuru karo",

  // Job Posting
  whatRole: "Kaun sa kaam karna hai?",
  jobType: "Kaam ka type",
  fullTime: "Full-time",
  partTime: "Part-time",
  gig: "Ek baar ka kaam",

  whenNeed: "Kab chahiye?",
  instant: "Abhi turant",
  sameDay: "Aaj hi",
  nextDay: "Kal",
  thisWeek: "Is hafte",
  flexible: "Koi jaldi nahi",

  budget: "Budget / Salary",
  negotiable: "Negotiate ho sakta hai",

  location: "Kaam ki jagah",
  getCurrentLocation: "Current location lo",

  requirements: "Zarooraten",
  workersNeeded: "Kitne log chahiye?",
  experience: "Experience",
  fresherOk: "Fresher bhi chalega",

  // Candidates
  candidatesFound: "workers mile",
  available: "Available hai",
  distance: "door",
  yearsExp: "saal experience",

  // Actions
  pass: "Pass",
  connect: "Connect karo",
  callNow: "Abhi call karo",
  scheduleCall: "Call schedule karo",

  // Matches
  matchFound: "Match ho gaya!",
  youMatched: "Aap dono interested ho",

  // Success
  jobPosted: "Job post ho gayi!",
  workerHired: "Worker hire ho gaya!",
}
```

---

## 11. Notifications

### Push Notifications for Employers
1. "5 new candidates match your Waiter requirement"
2. "Ravi Kumar is interested in your job"
3. "Match! You and Amit can now connect"
4. "Reminder: Call scheduled with Ravi at 3 PM"
5. "Your job posting expires in 24 hours"

### In-App Notifications
- New matches
- Candidate responses
- Job posting status changes
- Call reminders

---

## 12. Implementation Priority

### Phase 1: MVP
1. Employer onboarding flow
2. Basic job posting (simplified)
3. Candidate cards with swipe
4. Match display
5. Direct call button

### Phase 2: Enhanced
1. Multi-step job posting
2. Filters for candidates
3. Call scheduling
4. Candidate detail modal
5. Job editing

### Phase 3: Advanced
1. Ratings & reviews
2. Favorite candidates
3. Job templates
4. Analytics dashboard
5. Bulk hiring

---

## 13. Files to Create/Modify

### New Files
- `src/EmployerApp.jsx` - Main employer component (or extend SwitchApp.jsx)

### Modify
- `src/SwitchApp.jsx` - Add mode switching logic
- `src/main.jsx` - Handle routing between modes

### Backend (API)
- New employer endpoints needed (see Section 6)

---

## 14. Questions for Product Decision

1. **Same app or separate?** Should employer mode be in the same app or a separate "Switch Business" app?
   - Recommendation: Same app with mode toggle (easier distribution)

2. **Verification requirement?** Should employers be verified before posting?
   - Recommendation: Allow posting without verification, but show "Verified Business" badge

3. **Payment model?** Free posting or paid?
   - Recommendation: Free for MVP, add premium features later

4. **Candidate visibility?** Should employers see all candidates or only those who match their requirements?
   - Recommendation: Show matching candidates first, others in "Explore" section

5. **Communication?** In-app chat or phone calls only?
   - Recommendation: Phone calls for MVP (simpler), add chat later

---

This design maintains UI consistency with the worker side while providing a complete hiring experience for employers.
