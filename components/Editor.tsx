import { useRoom, useSelf } from '@liveblocks/react/suspense';
import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { BlockNoteView } from '@blocknote/shadcn';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import stringToColor from '@/lib/stringToColor';
import TranslateDocument from './TranslateDocument';

type EditorProps = {
  document: Y.Doc;
  provider: any;
  darkMode: boolean;
};

function BlockNote({ document, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: document.getXmlFragment('document-store'),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className='relative max-w-6xl mx-auto'>
      <BlockNoteView
        className='min-h-screen'
        editor={editor}
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}
function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDocument = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDocument);
    setDocument(yDocument);
    setProvider(yProvider);

    return () => {
      yDocument.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!document || !provider) return null;
  const style = `hover:text-white ${
    darkMode
      ? 'text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700'
      : 'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
  }`;
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex item-center gap-2 justify-end mb-10'>
        <TranslateDocument document={document} />
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote document={document} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;
