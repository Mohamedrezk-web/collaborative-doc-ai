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
import { deleteDocument } from '@/actions/actions';
import { toast } from 'sonner';

function DeleteDocument() {
  const pathname = usePathname(); // Ensure this is outside any callback
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    const id = pathname?.split('/').pop();
    if (!id) return;

    startTransition(async () => {
      const { success } = await deleteDocument(id);
      if (success) {
        setIsOpen(false);
        router.replace('/');
        toast.success('Your document has been deleted.');
      } else {
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={'destructive'}>
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            document and remove your document from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button
            type='button'
            variant={'destructive'}
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <DialogClose asChild>
            <Button type='button' variant={'secondary'}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDocument;
