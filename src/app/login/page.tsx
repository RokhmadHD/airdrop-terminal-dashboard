"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator"; // Kita butuh separator

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password cannot be empty." }),
});

// Komponen terpisah untuk menangani logic, agar bisa dibungkus Suspense
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    // Login dengan Email/Password
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        const { error: signInError } = await supabase.auth.signInWithPassword(values);

        if (signInError) {
            setError(signInError.message);
            setIsLoading(false);
            return;
        }

        // Wajib refresh agar server component (seperti header) mengambil sesi baru
        router.refresh();
        router.push("/");
    }

    // Login dengan Google
    async function handleOAuthSignIn() {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    }

    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                {message && (
                    <Alert className="mb-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
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
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign in with Email
                        </Button>
                    </form>
                </Form>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" type="button" onClick={handleOAuthSignIn}>
                    {/* Tambahkan ikon Google di sini jika mau */}
                    Sign in with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="underline font-semibold hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

// Wrapper komponen untuk Suspense
export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}