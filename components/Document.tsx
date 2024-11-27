import React, { useEffect, useState, useTransition } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';
import { Pencil } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
  const [input, setInput] = useState('');
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();
  const updateTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    startTransition(async () => {
      await updateDoc(doc(db, 'documents', id), { title: input });
    });
  };

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);
  return (
    <div className='flex-1 h-full bg-white p-5'>
      <div className='flex max-w-6xl mx-auto justify-between pb-5'>
        <form
          className='flex flex-1 flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'
          onSubmit={updateTitle}
        >
          <div className='flex flex-row space-x-2 md:w-full'>
            <Input
              type='text'
              placeholder='Document Name'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button disabled={isUpdating} type='submit'>
              <span className='hidden md:block'>
                {isUpdating ? 'Updating...' : 'Update'}
              </span>
              <span className='block md:hidden'>
                {isUpdating ? <LoadingSpinner w='w-4' h='h-4' /> : <Pencil />}
              </span>
            </Button>
          </div>

          {isOwner && (
            <div className='flex flex-row space-x-2 justify-end  '>
              <InviteUser />
              <DeleteDocument />
            </div>
          )}
        </form>
      </div>

      <div className='flex max-w-6xl mx-auto justify-between items-center mb-5'>
        <ManageUsers />

        <Avatars />
      </div>

      <hr className='pb-10 ' />

      <Editor />
    </div>
  );
}

export default Document;
