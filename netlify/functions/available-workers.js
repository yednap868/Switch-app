// Netlify serverless function to fetch available workers from Firestore
// This endpoint is used by the employer app to show worker candidates

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  // Use environment variables for Firebase config
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://relayy-ai.firebaseio.com'
    });
  } else {
    // Fallback to default credentials (for local dev or if env not set)
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'relayy-ai'
    });
  }
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Fetch workers from Firestore
    // Looking in 'switch_profiles' collection where worker profiles are stored
    const workersSnapshot = await db.collection('switch_profiles')
      .where('isAvailable', '==', true)
      .limit(100)
      .get();

    const workers = [];

    workersSnapshot.forEach(doc => {
      const data = doc.data();
      workers.push({
        userId: doc.id,
        id: doc.id,
        name: data.name || 'Worker',
        phone: data.phone || '',
        photoURL: data.photoURL || null,
        experience: data.experience || 'Not specified',
        preferredRoles: data.preferredRoles || [],
        languages: data.languages || ['Hindi'],
        location: data.location || 'Gurgaon',
        isAvailable: data.isAvailable !== false,
        rating: data.rating || 0,
        jobsCompleted: data.totalApplied || 0,
        verified: data.verified || false,
        expectedPay: data.expectedPay || 'Negotiable',
        bio: data.bio || `${data.experience || 'Looking for work'}. Skills: ${(data.preferredRoles || []).join(', ')}`,
        education: data.education || '',
        joinedDate: data.joinedDate || '',
        updatedAt: data.updatedAt || ''
      });
    });

    // If no workers found in Firestore, try the 'users' collection as fallback
    if (workers.length === 0) {
      const usersSnapshot = await db.collection('users')
        .where('userType', '==', 'worker')
        .limit(100)
        .get();

      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.isAvailable !== false) {
          workers.push({
            userId: doc.id,
            id: doc.id,
            name: data.name || data.displayName || 'Worker',
            phone: data.phone || '',
            photoURL: data.photoURL || data.profilePhoto || null,
            experience: data.experience || 'Not specified',
            preferredRoles: data.preferredRoles || data.skills || [],
            languages: data.languages || ['Hindi'],
            location: data.location || data.city || 'Gurgaon',
            isAvailable: data.isAvailable !== false,
            rating: data.rating || 0,
            jobsCompleted: data.jobsCompleted || data.totalApplied || 0,
            verified: data.verified || data.phoneVerified || false,
            expectedPay: data.expectedPay || data.expectedSalary || 'Negotiable',
            bio: data.bio || `${data.experience || 'Looking for work'}`,
            education: data.education || '',
            joinedDate: data.createdAt || '',
            updatedAt: data.updatedAt || ''
          });
        }
      });
    }

    console.log(`Found ${workers.length} available workers`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        workers: workers,
        count: workers.length
      })
    };

  } catch (error) {
    console.error('Error fetching workers:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to fetch available workers',
        error: error.message
      })
    };
  }
};
