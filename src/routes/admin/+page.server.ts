import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  console.log('=== ADMIN AUTO-REDIRECT ===');
  console.log('Admin session exists:', !!locals.adminSession);
  
  // Check if admin is logged in
  if (locals.adminSession) {
    // Admin is logged in, redirect to dashboard
    console.log('Admin logged in, redirecting to dashboard');
    throw redirect(302, '/admin/dashboard');
  } else {
    // Admin not logged in, redirect to login
    console.log('Admin not logged in, redirecting to login');
    throw redirect(302, '/admin/login');
  }
};