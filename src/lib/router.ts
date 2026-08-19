import { useState, useEffect, useCallback } from 'react';

export interface RouteInfo {
  route: 'landing' | 'dashboard' | 'store';
  slug?: string;
}

function parseRoute(): RouteInfo {
  const path = window.location.pathname;
  
  // /r/{slug} — public customer storefront
  const storeMatch = path.match(/^\/r\/([a-z0-9_-]+)\/?$/i);
  if (storeMatch) {
    return { route: 'store', slug: storeMatch[1].toLowerCase() };
  }
  
  // /dashboard — owner dashboard
  if (path === '/dashboard' || path === '/dashboard/') {
    return { route: 'dashboard' };
  }
  
  // / — landing page
  return { route: 'landing' };
}

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute(): RouteInfo {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(parseRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRouteInfo(parseRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return routeInfo;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}
