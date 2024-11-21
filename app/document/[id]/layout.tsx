import RoomProvider from '@/components/RoomProvider';
import React from 'react';

async function DocumentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // Awaiting `params.id` if needed
  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocumentLayout;
