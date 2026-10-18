'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type RefObject,
} from 'react';
import { usePathname } from 'next/navigation';

interface DocsShellContextValue {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
  activeHeadingId: string;
  setActiveHeadingId: (id: string) => void;
  contentScrollRef: RefObject<HTMLDivElement | null>;
  scrollToHeading: (id: string) => void;
}

const DocsShellContext = createContext<DocsShellContextValue | null>(null);

export function DocsShellProvider({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Reset mobile nav and scroll position on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const scrollToHeading = useCallback((id: string) => {
    const targetId = id.replace(/^#/, '');
    const el = document.getElementById(targetId);
    const container = contentScrollRef.current;

    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset = elRect.top - containerRect.top + container.scrollTop - 24;
      container.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveHeadingId(targetId);
    }
  }, []);

  return (
    <DocsShellContext.Provider
      value={{
        isMobileNavOpen,
        toggleMobileNav,
        closeMobileNav,
        activeHeadingId,
        setActiveHeadingId,
        contentScrollRef,
        scrollToHeading,
      }}
    >
      {children}
    </DocsShellContext.Provider>
  );
}

export function useDocsShell() {
  const ctx = useContext(DocsShellContext);
  if (!ctx) {
    throw new Error('useDocsShell must be used within a DocsShellProvider');
  }
  return ctx;
}
