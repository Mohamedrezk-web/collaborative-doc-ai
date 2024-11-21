'use client';
import React, { useState, useTransition } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePathname, useRouter } from 'next/navigation';
import { deleteDocument, inviteUserToDocument } from '@/actions/actions';
import { toast } from 'sonner';
import { Input } from './ui/input';

function InviteUser() {
  const pathname = usePathname(); // Ensure this is outside any callback
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = pathname?.split('/').pop();
    if (!id) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(id, email);
      if (success) {
        setIsOpen(false);
        setEmail('');
        toast.success('User Added to room!');
      } else {
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={'outline'}>
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate! </DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form className='flex gap-2' onSubmit={handleInvite}>
          <Input
            type='email'
            placeholder='Email'
            className='w-full'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type='submit' variant={'default'} disabled={isPending}>
            {isPending ? 'Inviting...' : 'Invite'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;