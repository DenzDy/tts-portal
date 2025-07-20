// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	return resolve(event);
};

const handleAdminAuth: Handle = async ({ event, resolve }) => {
	// Skip admin auth check for auth routes and login page
	if (event.url.pathname.startsWith('/auth/') || 
	    event.url.pathname === '/admin/login' ||
	    event.url.pathname.startsWith('/debug/')) {
		return resolve(event);
	}

	// Check for admin session on admin routes
	if (event.url.pathname.startsWith('/admin')) {
		const sessionCookie = event.cookies.get('admin_session');
		
		if (!sessionCookie) {
			throw redirect(302, '/admin/login');
		}

		try {
			const session = JSON.parse(sessionCookie);
			// Check if session is still valid (not older than 7 days)
			const isExpired = Date.now() - session.timestamp > 7 * 24 * 60 * 60 * 1000;
			
			if (isExpired) {
				event.cookies.delete('admin_session', { path: '/' });
				throw redirect(302, '/admin/login');
			}

			// Add session to locals
			event.locals.adminSession = session;
		} catch (error) {
			// If it's a redirect, re-throw it
			if (error instanceof Response && error.status >= 300 && error.status < 400) {
				throw error;
			}
			
			event.cookies.delete('admin_session', { path: '/' });
			throw redirect(302, '/admin/login');
		}
	}

	return resolve(event);
};

// Combine both handlers in sequence
export const handle: Handle = async ({ event, resolve }) => {
	// First handle regular auth (if needed)
	await handleAuth({ event, resolve: () => Promise.resolve(new Response()) });
	
	// Then handle admin auth
	return await handleAdminAuth({ event, resolve });
};