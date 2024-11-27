'use client';
import React, { use, useState, useTransition } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useUser } from '@clerk/nextjs';
import useOwner from '@/lib/useOwner';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase';
import { useRoom } from '@liveblocks/react/suspense';
import { toast } from 'sonner';
import { removeUserFromDocument } from '@/actions/actions';
import { collectionGroup, query, where } from 'firebase/firestore';
import { Users } from 'lucide-react';

function InviteUser() {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const { success } = await removeUserFromDocument(room.id, userId);
      if (success) {
        toast.success('User removed from document.');
      } else {
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={'outline'}>
        <DialogTrigger>
          <Users />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with access </DialogTitle>
          <DialogDescription>
            List of users with access to this document
          </DialogDescription>
        </DialogHeader>
        <hr className='my-2' />
        <div className='flex flex-col space-y-2'>
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className='flex item-center justify-between'
            >
              <p>
                {doc.data().userId === user?.emailAddresses[0]
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>
              <div className='flex items-center gap-2'>
                <Button variant={'outline'}>{doc.data().role}</Button>
                {isOwner && doc.data().userId !== user?.emailAddresses[0] && (
                  <Button
                    onClick={() => handleDelete(doc.data().userId)}
                    disabled={isPending}
                  >
                    {isPending ? 'Removing...' : 'X'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;
