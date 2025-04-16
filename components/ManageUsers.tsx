'use client';
import React, { useState, useTransition } from 'react';
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
import { useRoom } from '@liveblocks/react/suspense';
import { toast } from 'sonner';
import { removeUserFromDocument } from '@/actions/actions';
import { Users } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function ManageUsers() {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data } = useSWR('/api/documents', fetcher);

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

  const usersInRoom =
    data?.userRooms?.filter((doc: any) => doc.roomId === room.id) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant='outline'>
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
          {usersInRoom.map((doc: any) => (
            <div key={doc.userId} className='flex items-center justify-between'>
              <p>
                {doc.userId === user?.emailAddresses[0]
                  ? `You (${doc.userId})`
                  : doc.userId}
              </p>
              <div className='flex items-center gap-2'>
                <Button variant='outline'>{doc.role}</Button>
                {isOwner && doc.userId !== user?.emailAddresses[0] && (
                  <Button
                    onClick={() => handleDelete(doc.userId)}
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

export default ManageUsers;
