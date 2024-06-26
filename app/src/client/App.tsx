import { useMemo, useEffect, ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';

import './Main.css';

import { useAuth } from 'wasp/client/auth';
import { updateCurrentUser } from 'wasp/client/operations';

import AppNavBar from './components/AppNavBar';
import Footer from './components/Footer';
import ServerNotRechableComponent from './components/ServerNotRechableComponent';
import LoadingComponent from './components/LoadingComponent';

const addServerErrorClass = () => {
  if (!document.body.classList.contains('server-error')) {
    document.body.classList.add('server-error');
  }
};

const removeServerErrorClass = () => {
  if (document.body.classList.contains('server-error')) {
    document.body.classList.remove('server-error');
  }
};

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: user, isError, isLoading } = useAuth();

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== '/'; //&& location.pathname !== '/login' && location.pathname !== '/signup';
  }, [location]);

  const isCheckoutPage = useMemo(() => {
    return location.pathname.startsWith('/checkout');
  }, [location]);

  const isAccountPage = useMemo(() => {
    return location.pathname.startsWith('/account');
  }, [location]);

  const isChatPage = useMemo(() => {
    return location.pathname.startsWith('/chat');
  }, [location]);

  useEffect(() => {
    if (user) {
      const lastSeenAt = new Date(user.lastActiveTimestamp);
      const today = new Date();
      if (today.getTime() - lastSeenAt.getTime() > 5 * 60 * 1000) {
        updateCurrentUser({ lastActiveTimestamp: today });
      }
    }
  }, [user]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className='bg-gradient-to-b from-hero-gradient-start via-hero-gradient-middle to-secondary min-h-screen dark:text-white dark:bg-boxdark-2'>
        {isError && (addServerErrorClass(), (<ServerNotRechableComponent />))}
        {isChatPage ? (
          <>
            {shouldDisplayAppNavBar && <AppNavBar />}
            {children}
          </>
        ) : (
          <div className='relative flex flex-col min-h-screen justify-between'>
            {shouldDisplayAppNavBar && <AppNavBar />}
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 w-full'>
              {isError ? children : isLoading ? <LoadingComponent /> : (removeServerErrorClass(), children)}
            </div>
            <FooterWrapper />
          </div>
        )}
      </div>
    </>
  );
}

const FooterWrapper: React.FC = () => {
  const appName = import.meta.env.REACT_APP_NAME || 'Your SaaS';
  return (
    <div>
      <Footer />
      <div className='flex flex-col items-center h-20 bg-footer-copyrights'>
        <p className='text-center w-full text-sm text-white opacity-50 mt-5'>
          © 2024{' '}
          <a href='#' className='text-sm leading-6 text-white underline dark:text-white hover:opacity-80'>
            {appName}
          </a>
          . All rights reserved.
        </p>
        <p className='text-center w-full text-sm text-white opacity-50'>
          Built with ❤️ using{' '}
          <a
            target='_blank'
            href='https://fastagency.ai/'
            className='text-sm leading-6 text-white underline dark:text-white hover:opacity-80'
          >
            FastAgency
          </a>
        </p>
      </div>
    </div>
  );
};
