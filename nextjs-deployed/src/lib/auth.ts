import { cookies } from 'next/headers';
import { UserRole } from './types';

export async function checkRole(allowedRoles: UserRole[]) {
  const cookieStore = await cookies();
  const role = cookieStore.get('session_role')?.value;
  
  if (!role || !allowedRoles.includes(role as UserRole)) {
    throw new Error('Insufficient permissions');
  }
}