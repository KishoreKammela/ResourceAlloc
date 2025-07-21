'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  LogIn,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ShieldQuestion,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OtpInput from 'react-otp-input';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const { login, loading, mfaResolver } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isMfaStep, setIsMfaStep] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result?.mfa) {
        setIsMfaStep(true);
      } else {
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting...',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    }
  };

  const onVerifyMfa = async () => {
    if (!mfaResolver) {
      toast({
        variant: 'destructive',
        title: 'MFA Error',
        description: 'MFA session not found. Please try logging in again.',
      });
      setIsMfaStep(false);
      return;
    }

    try {
      await mfaResolver(otp);
      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting...',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'MFA Verification Failed',
        description:
          error instanceof Error ? error.message : 'Invalid verification code.',
      });
      setOtp('');
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm shadow-lg">
      <AnimatePresence mode="wait">
        {!isMfaStep ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Sign In
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/signup"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="mfa"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code from your authenticator app.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <ShieldQuestion className="mb-4 h-16 w-16 text-primary" />
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-1">-</span>}
                renderInput={(props) => (
                  <Input
                    {...props}
                    className="!w-10 text-center text-lg font-semibold"
                  />
                )}
                shouldAutoFocus
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={onVerifyMfa}
                className="w-full"
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Verify & Log In
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
