import { NextResponse } from 'next/server';
import { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  const data = await request.json();
  const { role } = data;
  
  const response = NextResponse.json({ success: true });
  response.cookies.set('session_role', role, { httpOnly: true });
  
  return response;
}