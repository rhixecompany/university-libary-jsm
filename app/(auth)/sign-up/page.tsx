import React from 'react'
import { Metadata } from 'next';
import MyHandler from './myhandler';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Sign Up',
};

const Page = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }
  return (
    <MyHandler />
  )
}

export default Page