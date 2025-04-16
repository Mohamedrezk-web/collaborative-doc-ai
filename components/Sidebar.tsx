'use client';

import React, { useState } from 'react';
import NewDocumentButton from './NewDocumentButton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import SidebarOption from './SidebarOption';
import useSWR from 'swr';

interface RoomDocument {
  _id: string;
  createdAt: string;
  role: 'owner' | 'editor';
  roomId: string;
  userId: string;
}

interface GroupedUserDocuments {
  owner: RoomDocument[];
  editor: RoomDocument[];
}

interface ApiResponse {
  userRooms: RoomDocument[];
}

const fetcher = (url: string): Promise<ApiResponse> =>
  fetch(url).then((r) => r.json());

function Sidebar() {
  const { user } = useUser();
  const { data, error, isLoading } = useSWR('/api/documents', fetcher);
  const [groupedDocuments, setGroupedDocumentsData] =
    useState<GroupedUserDocuments>({
      owner: [],
      editor: [],
    });

  React.useEffect(() => {
    if (!data) return;

    const grouped = data.userRooms?.reduce<GroupedUserDocuments>(
      (acc, curr) => {
        const document = {
          id: curr._id,
          ...curr,
        };

        curr.role === 'owner'
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

  if (error) return <div>Failed to load documents</div>;
  if (isLoading) return <div>Loading...</div>;

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className='flex py-4 flex-col space-y-4 md:max-w-36'>
        {groupedDocuments?.owner?.length === 0 ? (
          <h2 className='text-gray-500 font-semibold text-sm'>
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className='text-gray-500 font-semibold text-sm'>
              My Documents
            </h2>

            {groupedDocuments?.owner?.map((document) => {
              return (
                <SidebarOption
                  key={document.roomId}
                  href={`/document/${document.roomId}`}
                  id={document.roomId}
                />
              );
            })}
          </>
        )}

        {groupedDocuments?.editor?.length === 0 ? (
          <h2 className='text-gray-500 font-semibold text-sm'>
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className='text-gray-500 font-semibold text-sm'>
              Shared with me
            </h2>

            {groupedDocuments?.editor?.map((document) => {
              return (
                <SidebarOption
                  key={document.roomId}
                  href={`/document/${document.roomId}`}
                  id={document.roomId}
                />
              );
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
    // <Sheet>
    //   <SheetTrigger asChild>
    //     <Button variant='ghost' size='icon' className='md:hidden'>
    //       <MenuIcon />
    //     </Button>
    //   </SheetTrigger>
    //   <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
    //     <SheetHeader>
    //       <SheetTitle>Your Documents</SheetTitle>
    //     </SheetHeader>
    //     <div className='flex flex-col space-y-2 mt-4'>
    //       <NewDocumentButton />
    //       <div className='flex flex-col space-y-2'>
    //         {groupedDocuments.owner.map((doc) => (
    //           <SidebarOption
    //             key={doc.roomId}
    //             href={`/document/${doc.roomId}`}
    //             id={doc.roomId}
    //           />
    //         ))}
    //       </div>
    //       {groupedDocuments.editor.length > 0 && (
    //         <>
    //           <hr className='my-4' />
    //           <h2 className='text-sm font-semibold'>Shared with you</h2>
    //           <div className='flex flex-col space-y-2'>
    //             {groupedDocuments.editor.map((doc) => (
    //               <SidebarOption
    //                 key={doc.roomId}
    //                 href={`/document/${doc.roomId}`}
    //                 id={doc.roomId}
    //               />
    //             ))}
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   </SheetContent>
    // </Sheet>
  );
}

export default Sidebar;
