import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

const REDIRECT_URI = dev
    ? 'http://localhost:5173/auth/google/callback'
    : 'https://thethirdspace.upd.edu.ph/auth/google/callback';

export async function GET({ url }) {
    const state = crypto.randomUUID();

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', state);

    throw redirect(302, authUrl.toString());
}