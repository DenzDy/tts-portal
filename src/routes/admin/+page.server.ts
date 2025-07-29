import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Check if admin is logged in
    if (locals.adminSession) {
        // Admin is logged in, redirect to dashboard
        throw redirect(302, '/admin/dashboard');
    } else {
        // Admin not logged in, redirect to login
        throw redirect(302, '/admin/login');
    }
};