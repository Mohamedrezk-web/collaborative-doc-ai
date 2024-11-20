import LiveBlockProvider from '@/components/LiveBlockProvider';
import React from 'react';

function PageLayout({ children }: { children: React.ReactNode }) {
  return <LiveBlockProvider>{children}</LiveBlockProvider>;
}

export default PageLayout;
