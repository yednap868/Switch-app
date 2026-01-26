// Netlify serverless function to post a job from employer
// This endpoint allows employers to post new job listings

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['employer_id', 'title'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        };
      }
    }

    // Create job document
    const jobData = {
      employerId: body.employer_id,
      title: body.title,
      description: body.description || '',
      role: body.role || null,
      jobType: body.job_type || 'fulltime', // fulltime, parttime, gig
      urgency: body.urgency || 'standard', // instant, same_day, next_day, standard
      budget: body.budget || null,
      salaryMin: body.salary_min || null,
      salaryMax: body.salary_max || null,
      location: body.location || '',
      address: body.address || '',
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      workingHours: body.working_hours || '',
      experienceRequired: body.experience_required || 'any',
      status: 'active',
      applications: 0,
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    const jobRef = await db.collection('switch_jobs').add(jobData);

    console.log(`✅ Job posted: ${jobRef.id}`);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Job posted successfully',
        job_id: jobRef.id,
        job: { id: jobRef.id, ...jobData }
      })
    };

  } catch (error) {
    console.error('Error posting job:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to post job',
        error: error.message
      })
    };
  }
};
