// Netlify serverless function to get employer's posted jobs
// This endpoint returns all jobs posted by a specific employer

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
    // Get employer_id from query params
    const employerId = event.queryStringParameters?.employer_id;

    if (!employerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameter: employer_id' })
      };
    }

    // Fetch jobs from Firestore
    const jobsSnapshot = await db.collection('switch_jobs')
      .where('employerId', '==', employerId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const jobs = [];

    jobsSnapshot.forEach(doc => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Also fetch applications count for each job
    for (const job of jobs) {
      const applicationsSnapshot = await db.collection('switch_job_applications')
        .where('jobId', '==', job.id)
        .get();
      job.applicationsCount = applicationsSnapshot.size;
    }

    console.log(`Found ${jobs.length} jobs for employer ${employerId}`);

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
    console.error('Error fetching employer jobs:', error);

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
