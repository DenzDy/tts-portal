import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

const REDIRECT_URI = dev
    ? 'http://localhost:5173/auth/google/callback'
    : 'https://thethirdspace.upd.edu.ph/auth/google/callback';

async function exchangeCodeForTokens(code: string) {
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

    if (!response.ok) {
        throw new Error(`Failed to exchange code for tokens: ${response.status} ${responseText}`);
    }

    return JSON.parse(responseText);
}

async function getUserInfo(accessToken: string) {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status} ${responseText}`);
    }

    return JSON.parse(responseText);
}

async function checkAdminEmail(email: string, fetch: typeof globalThis.fetch) {
    try {
        const res = await fetch('/api/gsheet?tab=Admin Emails');
        const data = await res.json();

        // Check if email exists in the Admin Emails sheet
        const adminEmails = data.flat().map((email: string) => email.toLowerCase().trim()).filter(Boolean);

        const isAdmin = adminEmails.includes(email.toLowerCase().trim());

        return isAdmin;
    } catch (error) {
        console.error('Error checking admin email:', error);
        return false;
    }
}

export async function GET({ url, cookies, fetch }) {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const state = url.searchParams.get('state');

    if (error) {
        throw redirect(302, '/admin/login?error=auth_failed');
    }

    if (!code) {
        throw redirect(302, '/admin/login?error=auth_failed');
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Check if user email is in admin list
    const isAdmin = await checkAdminEmail(userInfo.email, fetch);

    if (!isAdmin) {
        throw redirect(302, '/admin/login?error=unauthorized');
    }

    // Set session cookie
    const sessionData = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        timestamp: Date.now()
    };

    cookies.set('admin_session', JSON.stringify(sessionData), {
        path: '/',
        httpOnly: true,
        secure: !dev, // Only secure in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(302, '/admin/dashboard');
}