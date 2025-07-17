import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MyHandler from './myhandler';

export const metadata: Metadata = {
  title: 'Sign In',
};

const Page = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/my-profile');
  }
  return <MyHandler />;
};

export default Page;
