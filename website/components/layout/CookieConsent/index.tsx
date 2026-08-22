'use client';

import { useState, useEffect, useCallback } from 'react';
import './styles.css';

const COOKIE_NAME = 'fc_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function updateConsent(granted: boolean) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_NAME);
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  const accept = useCallback(() => {
    setCookie(COOKIE_NAME, 'granted', COOKIE_MAX_AGE);
    updateConsent(true);
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    setCookie(COOKIE_NAME, 'denied', COOKIE_MAX_AGE);
    updateConsent(false);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fc-consent" role="dialog" aria-label="Cookie consent">
      <div className="fc-consent__inner">
        <p className="fc-consent__text">
          We use Google Analytics to understand how visitors use this site
          (page views only, no advertising). Your data is anonymised.{' '}
          <a href="/legal/privacy#cookies" className="fc-consent__link">
            Privacy policy
          </a>
        </p>
        <div className="fc-consent__actions">
          <button
            type="button"
            className="fc-consent__btn fc-consent__btn--accept"
            onClick={accept}
          >
            Accept
          </button>
          <button
            type="button"
            className="fc-consent__btn fc-consent__btn--decline"
            onClick={decline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
