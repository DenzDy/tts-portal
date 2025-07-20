import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.delete('admin_session', { path: '/' });
  throw redirect(302, '/admin/login');
}
