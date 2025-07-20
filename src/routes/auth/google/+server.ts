import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/auth/google/callback';

export async function GET({ url }) {
  console.log('Starting Google OAuth redirect...');
  console.log('Client ID:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
  console.log('Redirect URI:', REDIRECT_URI);
  
  const state = crypto.randomUUID();
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  
  console.log('Redirecting to:', authUrl.toString());
  
  throw redirect(302, authUrl.toString());
}