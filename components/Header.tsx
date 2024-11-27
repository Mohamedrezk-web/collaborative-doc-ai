'use client';
import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Breadcrumbs from './Breadcrumbs';
export default function Header() {
  const { user } = useUser();

  return (
    <div className='flex flex-col md:flex-row p-2 md:p-5 gap-2'>
      {user && (
        <h1 className='text-start	text-2xl font-bold whitespace-nowrap w-max flex'>
          {user.firstName}
          {`'s`} Space
        </h1>
      )}

      <div className='flex items-center space-x-2 w-full justify-between'>
        <Breadcrumbs />
        <UserButton />
      </div>
    </div>
  );
}
