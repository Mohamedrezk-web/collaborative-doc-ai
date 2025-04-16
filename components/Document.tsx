import React, { useState, useTransition } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';
import { Pencil } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Document({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`/api/documents/${id}`, fetcher);
  const [input, setInput] = useState('');
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  const updateTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    startTransition(async () => {
      await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: input }),
      });
    });
  };

  React.useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  if (error) return <div>Failed to load document</div>;
  if (isLoading) return <LoadingSpinner w='w-10' h='h-10' />;

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
