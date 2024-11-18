import React from 'react';
import NewDocumentButton from './NewDocumentButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';

function Sidebar() {
  const menuOptions = (
    <>
      <NewDocumentButton />
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
