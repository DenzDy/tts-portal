// src/routes/auth/google/callback/+server.ts
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID || '1086401218208-ir4p7valglcaf22r2aiav0hls82fgcgo.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET || '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';
const REDIRECT_URI = 'http://localhost:5173/auth/google/callback';

async function exchangeCodeForTokens(code: string) {
  console.log('Exchanging code for tokens...');
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  });

  const responseText = await response.text();
  console.log('Token exchange response:', response.status, responseText);

  if (!response.ok) {
    throw new Error(`Failed to exchange code for tokens: ${response.status} ${responseText}`);
  }

  return JSON.parse(responseText);
}

async function getUserInfo(accessToken: string) {
  console.log('Getting user info...');
  
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseText = await response.text();
  console.log('User info response:', response.status, responseText);

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status} ${responseText}`);
  }

  return JSON.parse(responseText);
}

async function checkAdminEmail(email: string, fetch: typeof globalThis.fetch) {
  try {
    console.log('Checking admin email:', email);
    
    const res = await fetch('/api/gsheet?tab=Admin Emails');
    const data = await res.json();
    
    console.log('Admin emails data:', data);
    
    // Check if email exists in the Admin Emails sheet
    const adminEmails = data.flat().map((email: string) => email.toLowerCase().trim()).filter(Boolean);
    console.log('Processed admin emails:', adminEmails);
    
    const isAdmin = adminEmails.includes(email.toLowerCase().trim());
    console.log('Is admin check result:', isAdmin);
    
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin email:', error);
    return false;
  }
}

export async function GET({ url, cookies, fetch }) {
  console.log('OAuth callback started');
  console.log('Full URL:', url.href);
  
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const state = url.searchParams.get('state');

  console.log('URL params:', { code: code?.substring(0, 20) + '...', error, state });

  if (error) {
    console.log('OAuth error from Google:', error);
    throw redirect(302, '/admin/login?error=auth_failed');
  }

  if (!code) {
    console.log('No authorization code received');
    throw redirect(302, '/admin/login?error=auth_failed');
  }

  console.log('Starting OAuth flow...');
  
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);
  console.log('Tokens received:', { access_token: tokens.access_token?.substring(0, 20) + '...' });
  
  // Get user info
  const userInfo = await getUserInfo(tokens.access_token);
  console.log('User info received:', { email: userInfo.email, name: userInfo.name });
  
  // Check if user email is in admin list
  const isAdmin = await checkAdminEmail(userInfo.email, fetch);
  console.log('Admin check result:', isAdmin);
  
  if (!isAdmin) {
    console.log('User not authorized:', userInfo.email);
    throw redirect(302, '/admin/login?error=unauthorized');
  }

  // Set session cookie
  const sessionData = {
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    timestamp: Date.now()
  };
  
  console.log('Setting session cookie for:', userInfo.email);
  
  cookies.set('admin_session', JSON.stringify(sessionData), {
    path: '/',
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  console.log('Redirecting to dashboard...');
  throw redirect(302, '/admin/dashboard');
}