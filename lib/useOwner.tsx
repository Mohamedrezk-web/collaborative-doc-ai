'use client';

import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const { data } = useSWR('/api/documents', fetcher);

  useEffect(() => {
    if (data && data.userRooms && data.userRooms.length > 0) {
      const owners = data.userRooms.filter(
        (doc: any) => doc.role === 'owner' && doc.roomId === room.id
      );
      const isOwner = owners.some(
        (owner: any) => owner.userId === `${user?.emailAddresses[0]}`
      );

      if (isOwner) setIsOwner(true);
    }
  }, [data, user, room.id]);

  return isOwner;
}

export default useOwner;
