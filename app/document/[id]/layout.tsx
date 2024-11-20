import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

function DocumentLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocumentLayout;
