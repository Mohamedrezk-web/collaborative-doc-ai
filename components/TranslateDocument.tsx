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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotIcon, LanguagesIcon } from 'lucide-react';
import { toast } from 'sonner';
import MarkDown from 'react-markdown';

type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Arabic';

const languages: Language[] = [
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
];

function TranslateDocument({ document }: { document: Y.Doc }) {
  const [language, setLanguage] = useState<Language>('Arabic');
  const [summary, setSummary] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = document.get('document-store').toJSON();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translate-document`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentData,
            targetLanguage: language.toLowerCase(),
          }),
        }
      );

      if (response.ok) {
        const { translated_text } = await response.json();
        setSummary(translated_text);
        toast.success('Document translated successfully');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={'outline'}>
        <DialogTrigger>
          <LanguagesIcon />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the document </DialogTitle>
          <DialogDescription>
            get a translated summary of the document in the desired language of
            your choice{' '}
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
        <form className='flex gap-2' onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Language' />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type='submit'
            variant={'default'}
            disabled={isPending || !language}
          >
            {isPending ? 'Translating...' : 'Translate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateDocument;
