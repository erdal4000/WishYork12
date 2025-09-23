'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WishForgeLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithGoogle } from '@/lib/firebase/auth';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
      setIsLoading(false);
    } else {
      toast({
        title: 'Signed In!',
        description: 'You have successfully signed in.',
      });
      router.push('/dashboard');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { error } = await signInWithEmailAndPassword(values.email, values.password);

    if (error) {
      let message = 'An unknown error occurred. Please try again.';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        switch ((error as {code: string}).code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Invalid email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          default:
            message = 'An error occurred during sign-in. Please try again.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: message,
      });
    } else {
      toast({
        title: 'Signed In!',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <Link href="/" className="flex items-center gap-2 mb-4">
        <WishForgeLogo className="h-7 w-7 text-primary" />
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          WishYork
        </span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><g fill="none"><path d="M20.66 12.24c0-.64-.06-1.25-.16-1.84H12.2v3.47h4.74a4.05 4.05 0 0 1-1.74 2.68v2.26h2.92a8.78 8.78 0 0 0 2.68-6.57z" fill="#4285F4"/><path d="M12.2 21a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26c-.98.66-2.24 1.06-3.04 1.06-2.34 0-4.32-1.58-5.03-3.7H3.96v2.34A9 9 0 0 0 12.2 21z" fill="#34A853"/><path d="M7.17 14.32a5.35 5.35 0 0 1 0-3.64V8.34H3.96a9 9 0 0 0 0 8.32l3.21-2.34z" fill="#FBBC05"/><path d="M12.2 6.8a4.8 4.8 0 0 1 3.44 1.34l2.58-2.58A8.6 8.6 0 0 0 12.2 3a9 9 0 0 0-8.24 5.34l3.21 2.34c.7-2.12 2.7-3.7 5.03-3.7z" fill="#EA4335"/></g></svg>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
