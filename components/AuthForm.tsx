'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';

import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { USER_FIELD_NAMES, USER_FIELD_TYPES } from '@/constants';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/my-profile';
  const router = useRouter();

  const isSignIn = type === 'SIGN_IN';

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast({
        title: 'Success',
        description: isSignIn ? 'You have successfully signed in.' : 'You have successfully signed up.',
      });

      router.push(callbackUrl);
    } else {
      toast({
        title: `Error ${isSignIn ? 'signing in' : 'signing up'}`,
        description: result.error ?? 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">{isSignIn ? 'Welcome back to BookWise' : 'Create your library account'}</h1>
      <p className="text-light-100">
        {isSignIn ? 'Access the vast collection of resources, and stay updated' : 'Please complete all fields and upload a valid university ID to gain access to the library'}
      </p>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          <Input type="hidden" name="callbackUrl" value={callbackUrl} className="form-input" />
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{USER_FIELD_NAMES[field.name as keyof typeof USER_FIELD_NAMES]}</FormLabel>
                  <FormControl>
                    {field.name === 'avatar' ? (
                      <FileUpload type="image" accept="image/*" placeholder="Upload your Avatar" folder="users" variant="dark" onFileChange={field.onChange} />
                    ) : (
                      <Input required type={USER_FIELD_TYPES[field.name as keyof typeof USER_FIELD_TYPES]} {...field} className="form-input" />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? 'New to BookWise? ' : 'Already have an account? '}

        <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-primary">
          {isSignIn ? 'Create an account' : 'Sign in'}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
