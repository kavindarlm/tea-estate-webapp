import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import UserLogin from '../components/UserLogin';
import { ToastProvider } from '../components/reusable/Toaster';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else if (router.pathname !== '/login' && router.pathname !== '/forgot-password') {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const isLoginPage = router.pathname === '/login';
  const isForgotPasswordPage = router.pathname === '/forgot-password';

  if (isLoading) {
    return null; // Render nothing while loading
  }

  return (
    <ToastProvider>
      <div className="bg-white">
        <main>
          {isLoginPage ? (
            <UserLogin setIsLoggedIn={setIsLoggedIn} />
          ) : isForgotPasswordPage ? (
            <Component {...pageProps} />
          ) : (
            isLoggedIn && (
              <Sidebar>
                <Component {...pageProps} setIsLoggedIn={setIsLoggedIn} />
              </Sidebar>
            )
          )}
        </main>
      </div>
    </ToastProvider>
  );
}

export default MyApp;
