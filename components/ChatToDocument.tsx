import React, { useState, useTransition } from 'react';
import * as Y from 'yjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

import { BotIcon, BotMessageSquareIcon } from 'lucide-react';
import { toast } from 'sonner';
import MarkDown from 'react-markdown';
import { Input } from './ui/input';

function ChatToDocument({ document }: { document: Y.Doc }) {
  const [summary, setSummary] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handelAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = document.get('document-store').toJSON();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chat-to-document`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentData,
            question,
          }),
        }
      );

      if (response.ok) {
        const { message } = await response.json();
        setQuestion('');
        setSummary(message);
        toast.success('Here you go!');
      } else {
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={'outline'}>
        <DialogTrigger>
          <BotMessageSquareIcon className='w-10 flex-shrink-0' />
          <span className='hidden md:block'>Chat to the document</span>
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat </DialogTitle>
          <DialogDescription>
            Ask anything related to the document
          </DialogDescription>
        </DialogHeader>
        {summary && (
          <div className='flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100'>
            <div className='flex'>
              <BotIcon className='w-10 flex-shrink-0' />
              <p className='font-bold'>
                Chat GPT {isPending ? 'is thinking' : 'Says'}
              </p>
            </div>
            <p>{isPending ? 'Let me cook' : <MarkDown>{summary}</MarkDown>}</p>
          </div>
        )}
        <form className='flex gap-2' onSubmit={handelAskQuestion}>
          <Input
            type='text'
            placeholder='Your question...'
            className='w-full'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            type='submit'
            variant={'default'}
            disabled={isPending || !question}
          >
            {isPending ? 'Asking...' : 'Ask'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChatToDocument;
