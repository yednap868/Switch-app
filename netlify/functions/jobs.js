// Netlify serverless function to get all active jobs for workers
// This endpoint returns all active job listings that workers can apply to

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://relayy-ai.firebaseio.com'
    });
  } else {
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
    return { statusCode: 200, headers, body: '' };
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
    // Optional filters from query params
    const { location, job_type, role, urgency, limit: limitParam } = event.queryStringParameters || {};
    const limit = parseInt(limitParam) || 50;

    // Build query
    let query = db.collection('switch_jobs').where('status', '==', 'active');

    // Apply filters if provided
    if (location) {
      query = query.where('location', '==', location);
    }
    if (job_type) {
      query = query.where('jobType', '==', job_type);
    }

    // Execute query
    const jobsSnapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const jobs = [];

    jobsSnapshot.forEach(doc => {
      const data = doc.data();

      // Transform to worker-friendly format
      jobs.push({
        id: doc.id,
        title: data.title,
        company: data.companyName || 'Employer',
        role: data.role?.name || data.title,
        description: data.description,
        jobType: data.jobType,
        urgency: data.urgency,
        salary: data.budget || (data.salaryMin && data.salaryMax
          ? `₹${data.salaryMin} - ₹${data.salaryMax}`
          : 'Negotiable'),
        location: data.location,
        address: data.address,
        requirements: data.requirements,
        benefits: data.benefits,
        workingHours: data.workingHours,
        experienceRequired: data.experienceRequired,
        employerId: data.employerId,
        isEmployerPosted: true,
        applications: data.applications || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        // Format for worker card display
        tags: [
          data.jobType === 'gig' ? '🎯 Gig Work' : '💼 Full-time',
          data.urgency === 'instant' ? '⚡ Instant Start' :
            data.urgency === 'same_day' ? '📅 Same Day' :
            data.urgency === 'next_day' ? '🌅 Next Day' : '📆 Flexible',
          data.location ? `📍 ${data.location}` : null
        ].filter(Boolean),
        logo: data.companyLogo || null,
        gradient: data.cardGradient || 'from-teal-500 to-cyan-500',
      });
    });

    console.log(`Found ${jobs.length} active jobs`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        jobs: jobs,
        count: jobs.length
      })
    };

  } catch (error) {
    console.error('Error fetching jobs:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to fetch jobs',
        error: error.message
      })
    };
  }
};
