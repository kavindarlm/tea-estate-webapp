import { useState } from 'react';
import { useRouter } from 'next/router';

function UserForgetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess('Password reset instructions have been sent to your email address.');
      console.log('Password reset email sent successfully');
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="relative lg:flex-1 hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/img/2.png"
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-full">
          <div>
            <div className="flex h-20 shrink-0 items-center font-bold text-3xl">
              <div className='text-buttonColor'>TeaEstate</div><div className='text-green-500'>Pro</div>
            </div>
            <h2 className="mt-1 text-xl font-bold leading-9 tracking-tight text-green-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 text-black"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-md p-3">
                    {success}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md bg-buttonColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm font-semibold text-green-600 hover:text-green-500"
                  >
                    ← Back to sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForgetPassword;
