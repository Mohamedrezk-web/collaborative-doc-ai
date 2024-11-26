import RoomProvider from '@/components/RoomProvider';
import React from 'react';

// Ensure params matches the expected type of a Promise
async function DocumentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Ensure params is typed as a Promise
}) {
  // Await the params since it is strictly a Promise
  const resolvedParams = await params;

  return <RoomProvider roomId={resolvedParams.id}>{children}</RoomProvider>;
}

export default DocumentLayout;
