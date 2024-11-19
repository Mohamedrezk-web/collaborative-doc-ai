import React, { useEffect, useState, useTransition } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
  const [input, setInput] = useState('');
  const [isUpdating, startTransition] = useTransition();

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
    <div>
      <div className='flex max-w-6xl mx-auto justify-between'>
        <form className='flex flex-1 space-x-2 ' onSubmit={updateTitle}>
          <Input
            type='text'
            placeholder='Document Name'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={isUpdating} type='submit'>
            {isUpdating ? 'Uploading...' : 'Update'}
          </Button>
        </form>
      </div>
      <div></div>
    </div>
  );
}

export default Document;
