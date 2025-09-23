'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WishForgeLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, CheckCircle2, Circle, Loader2, XCircle, CheckCircle, Info, Upload } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmailAndPassword, signInWithGoogle } from '@/lib/firebase/auth';


// Mock function to simulate checking username availability
const checkUsernameAvailability = async (username: string): Promise<'available' | 'unavailable'> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (['admin', 'test'].includes(username.toLowerCase())) {
        resolve('unavailable');
      } else {
        resolve('available');
      }
    }, 500); // Simulate network delay
  });
};

const formSchema = z.discriminatedUnion('accountType', [
  z.object({
    accountType: z.literal('individual'),
    name: z.string().min(1, 'Name is required.'),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    email: z.string().email('Invalid email format.'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters.')
      .refine(value => /[A-Z]/.test(value), 'Password must contain at least one uppercase letter.')
      .refine(value => /[a-z]/.test(value), 'Password must contain at least one lowercase letter.')
      .refine(value => /\d/.test(value), 'Password must contain at least one number.'),
    confirmPassword: z.string(),
    dobMonth: z.string().optional(),
    dobDay: z.string().optional(),
    dobYear: z.string().optional(),
    birthdayVisibility: z.string().optional(),
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
    ngoName: z.string().optional(),
    representativeName: z.string().optional(),
    workEmail: z.string().optional(),
    registrationId: z.string().optional(),
  }),
  z.object({
    accountType: z.literal('ngo'),
    ngoName: z.string().min(1, 'NGO name is required.'),
    representativeName: z.string().min(1, 'Representative name is required.'),
    workEmail: z.string().email('Invalid work email format.'),
    registrationId: z.string().min(1, 'Registration/Tax ID is required.'),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    email: z.string().email('Invalid email format.').optional(), // Email is optional for NGO on form, taken from workEmail
    password: z.string()
      .min(8, 'Password must be at least 8 characters.')
      .refine(value => /[A-Z]/.test(value), 'Password must contain at least one uppercase letter.')
      .refine(value => /[a-z]/.test(value), 'Password must contain at least one lowercase letter.')
      .refine(value => /\d/.test(value), 'Password must contain at least one number.'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
    name: z.string().optional(),
    dobMonth: z.string().optional(),
    dobDay: z.string().optional(),
    dobYear: z.string().optional(),
    birthdayVisibility: z.string().optional(),
  }),
]).refine(data => {
  if (data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [accountType, setAccountType] = useState<'individual' | 'ngo'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: 'individual',
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      birthdayVisibility: 'public',
      ngoName: '',
      representativeName: '',
      workEmail: '',
      registrationId: '',
      dobMonth: '',
      dobDay: '',
      dobYear: '',
    },
    mode: 'onChange',
  });

  const passwordValue = form.watch('password');
  const confirmPasswordValue = form.watch('confirmPassword');
  const usernameValue = form.watch('username');
  
  useEffect(() => {
    form.setValue('accountType', accountType);
    form.clearErrors();
    // Reset fields when changing account type
    form.reset({
      ...form.getValues(),
      accountType,
      name: '',
      username: form.getValues('username'), // keep username
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      birthdayVisibility: 'public',
      ngoName: '',
      representativeName: '',
      workEmail: '',
      registrationId: '',
      dobMonth: '',
      dobDay: '',
      dobYear: '',
    });
  }, [accountType, form]);


  // Debounce username check
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (usernameValue.length < 3) {
        setUsernameStatus('idle');
        form.clearErrors('username');
        return;
      }
      setUsernameStatus('checking');
      const result = await checkUsernameAvailability(usernameValue);
      setUsernameStatus(result);
      if (result === 'unavailable') {
        form.setError('username', { type: 'manual', message: 'Username is already taken.' });
      } else {
        form.clearErrors('username');
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [usernameValue, form]);

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
    if (usernameStatus !== 'available') {
      form.setError('username', { type: 'manual', message: 'Please choose an available username.' });
      return;
    }
    
    setIsLoading(true);
    try {
      const dataToSignUp = { ...values };
      const emailFieldToSetError: 'email' | 'workEmail' = values.accountType === 'ngo' ? 'workEmail' : 'email';
      
      // Use workEmail as primary email for NGO
      if (dataToSignUp.accountType === 'ngo') {
        dataToSignUp.email = dataToSignUp.workEmail || '';
      }

      const { user, error } = await signUpWithEmailAndPassword(dataToSignUp);

      if (error) {
        let message = 'An unknown error occurred. Please try again.';
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const errorCode = (error as {code: string}).code;
            switch (errorCode) {
            case 'auth/email-already-in-use':
                form.setError(emailFieldToSetError, { 
                  type: 'manual', 
                  message: 'This email is already in use. Please log in or use a different email.' 
                });
                setIsLoading(false);
                return; // Stop execution to show form error
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                message = 'The password is too weak.';
                break;
            default:
                message = `An error occurred during signup: ${errorCode}. Please try again.`;
            }
        }
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: message,
        });
      } else if (user) {
        toast({
            title: 'Success!',
            description: 'Your account has been created.',
        });
        router.push('/dashboard');
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const passwordChecks = {
    length: (passwordValue || '').length >= 8,
    uppercase: /[A-Z]/.test(passwordValue || ''),
    lowercase: /[a-z]/.test(passwordValue || ''),
    number: /\d/.test(passwordValue || ''),
  };

  const passwordsMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const PasswordRequirement = ({ label, met }: { label: string; met: boolean }) => (
    <div className={cn("flex items-center gap-2 text-sm", met ? "text-green-600" : "text-muted-foreground")}>
      {met ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      <span>{label}</span>
    </div>
  );
  
  const UsernameStatusIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
       <Link href="/" className="flex items-center gap-2 mb-4">
        <WishForgeLogo className="h-7 w-7 text-primary" />
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          WishYork
        </span>
      </Link>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join our community to start sharing and supporting wishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ToggleGroup
                  type="single"
                  value={accountType}
                  onValueChange={(value: 'individual' | 'ngo' | '') => {
                    if (value) {
                      setAccountType(value as 'individual' | 'ngo');
                    }
                  }}
                  className="grid w-full grid-cols-2"
                  aria-label="Account Type"
                >
                  <ToggleGroupItem value="individual" aria-label="Individual">
                    Individual
                  </ToggleGroupItem>
                  <ToggleGroupItem value="ngo" aria-label="NGO">
                    NGO
                  </ToggleGroupItem>
                </ToggleGroup>

              <div className="grid grid-cols-1 gap-4">
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><g fill="none"><path d="M20.66 12.24c0-.64-.06-1.25-.16-1.84H12.2v3.47h4.74a4.05 4.05 0 0 1-1.74 2.68v2.26h2.92a8.78 8.78 0 0 0 2.68-6.57z" fill="#4285F4"/><path d="M12.2 21a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26c-.98.66-2.24 1.06-3.04 1.06-2.34 0-4.32-1.58-5.03-3.7H3.96v2.34A9 9 0 0 0 12.2 21z" fill="#34A853"/><path d="M7.17 14.32a5.35 5.35 0 0 1 0-3.64V8.34H3.96a9 9 0 0 0 0 8.32l3.21-2.34z" fill="#FBBC05"/><path d="M12.2 6.8a4.8 4.8 0 0 1 3.44 1.34l2.58-2.58A8.6 8.6 0 0 0 12.2 3a9 9 0 0 0-8.24 5.34l3.21 2.34c.7-2.12 2.7-3.7 5.03-3.7z" fill="#EA4335"/></g></svg>
                    Continue with Google
                  </Button>
              </div>

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

              {accountType === 'ngo' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>NGO Account</AlertTitle>
                  <AlertDescription>
                    Apply for an account for your Non-Governmental Organization. All applications are manually reviewed.
                  </AlertDescription>
                </Alert>
              )}

              {accountType === 'individual' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="johndoe" {...field} />
                              <div className="absolute inset-y-0 right-3 flex items-center">
                                <UsernameStatusIcon />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="ngoName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NGO Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Foundation for Good" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="representativeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Representative Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="foundation" {...field} />
                              <div className="absolute inset-y-0 right-3 flex items-center">
                                <UsernameStatusIcon />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={form.control}
                    name="workEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@foundation.org" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration / Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your official registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="space-y-2">
                    <Label>Verification Document</Label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-muted-foreground">PDF, PNG, or JPG (Max 2MB)</p>
                            </div>
                            <input id="file-upload" type="file" className="hidden" />
                        </label>
                    </div>
                </div>
                </>
              )}
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
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
                        className="absolute right-1 top-7 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-7 h-7 w-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                       <FormMessage />
                       {passwordsMatch && !form.getFieldState('confirmPassword').error && (
                        <p className="text-sm text-green-600">Passwords match</p>
                      )}
                      {!passwordsMatch && confirmPasswordValue && (
                        <p className="text-sm text-destructive">Passwords do not match</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <PasswordRequirement label="8+ characters" met={passwordChecks.length} />
                <PasswordRequirement label="1 uppercase" met={passwordChecks.uppercase} />
                <PasswordRequirement label="1 lowercase" met={passwordChecks.lowercase} />
                <PasswordRequirement label="1 number" met={passwordChecks.number} />
              </div>

              {accountType === 'individual' && (
                <>
                  <div className="space-y-2">
                    <Label>Date of birth (Optional)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select>
                        <SelectTrigger aria-label="Month">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger aria-label="Day">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={String(day)}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger aria-label="Year">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Birthday Visibility</Label>
                    <RadioGroup defaultValue="public" className="gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="font-normal">Public (Show full birthday)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial" className="font-normal">Show day & month only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="font-normal">Private (Hide from profile)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {accountType === 'ngo' && (
                  <p className="text-xs text-muted-foreground">
                    After your application, you can log in, but you must wait for admin approval to create and share lists.
                  </p>
                )}

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{' '}
                        <Link href="/terms" className="font-medium text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="font-medium text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {accountType === 'individual' ? 'Create Account' : 'Apply for an NGO Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    