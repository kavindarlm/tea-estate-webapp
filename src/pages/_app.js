import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import UserLogin from '../components/UserLogin';
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
    <div className="bg-white">
      <main>
        {isLoggedIn && !isLoginPage && !isForgotPasswordPage && <Sidebar />}
        {isLoginPage ? (
          <UserLogin setIsLoggedIn={setIsLoggedIn} />
        ) : isForgotPasswordPage ? (
          <Component {...pageProps} />
        ) : (
          isLoggedIn && <Component {...pageProps} setIsLoggedIn={setIsLoggedIn} />
        )}
      </main>
    </div>
  );
}

export default MyApp;
