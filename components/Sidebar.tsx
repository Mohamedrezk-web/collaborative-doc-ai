'use client';

import React, { useEffect, useState } from 'react';
import NewDocumentButton from './NewDocumentButton';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase';

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: 'owner' | 'editor';
  roomId: string;
  userId: string;
}

interface GroupedUserDocuments {
  owner: RoomDocument[];
  editor: RoomDocument[];
}

function Sidebar() {
  const { user } = useUser();
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, 'rooms'),
        where('userId', '==', user.emailAddresses[0].toString())
      )
  );

  const [groupedDocuments, setGroupedDocumentsData] =
    useState<GroupedUserDocuments>({
      owner: [],
      editor: [],
    });

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<GroupedUserDocuments>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        const document = {
          id: curr.id,
          ...roomData,
        };

        roomData.role == 'owner'
          ? acc.owner.push(document)
          : acc.editor.push(document);

        return acc;
      },
      {
        owner: [],
        editor: [],
      }
    );

    setGroupedDocumentsData(grouped);
  }, [data]);
  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className='flex py-4 flex-col space-y-4 md:max-w-36'>
        {groupedDocuments.owner.length === 0 ? (
          <h2 className='text-gray-500 font-semibold text-sm'>
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className='text-gray-500 font-semibold text-sm'>
              My Documents
            </h2>

            {groupedDocuments.owner.map((document) => {
              return <p key={document.roomId}>{document.roomId}</p>;
            })}
          </>
        )}
      </div>
    </>
  );
  return (
    <div className='p-2 md:p-5'>
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className='hidden md:inline'>{menuOptions}</div>
    </div>
  );
}

export default Sidebar;
