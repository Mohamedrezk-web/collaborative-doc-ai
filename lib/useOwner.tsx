'use client';

import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react';
import { collectionGroup, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id))
  );

  useEffect(() => {
    if (usersInRoom && usersInRoom.docs.length > 0) {
      const owners = usersInRoom.docs.filter(
        (doc) => doc.data().role === 'owner'
      );
      const isOwner = owners.some(
        (owner) => owner.data().userId === `${user?.emailAddresses[0]}`
      );

      if (isOwner) setIsOwner(true);
    }
  }, [usersInRoom, user]);

  return isOwner;
}

export default useOwner;
