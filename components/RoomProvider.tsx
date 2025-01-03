'use client';
import React from 'react';
import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from '@liveblocks/react/suspense';
import LoadingSpinner from './LoadingSpinner';
import LiveCursorProvider from './LiveCursorProvider';
function RoomProvider({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  return (
    <RoomProviderWrapper id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<LoadingSpinner w='w-16' h='h-16' />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;
