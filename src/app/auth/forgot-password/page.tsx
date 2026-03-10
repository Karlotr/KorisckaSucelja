'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw new Error(resetError.message);
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {emailSent ? (
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-400">
                  If an account exists for <span className="text-gray-200">{email}</span>, a password reset link
                  has been sent.
                </p>
              </div>
              <Button
                type="button"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                Send another link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
