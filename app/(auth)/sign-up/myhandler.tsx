'use client';

import AuthForm from '@/components/AuthForm';
import { signUp } from '@/lib/actions/auth';
import { signUpSchema } from '@/lib/validations';

const MyHandler = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        email: '',
        name: '',
        // universityId: 0,
        avatar: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={signUp}
    />
  );
};

export default MyHandler;
