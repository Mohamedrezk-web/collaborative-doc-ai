'use client';

import React from 'react';
import Document from '@/components/Document';

function DocumentPage({ params: { id } }: { params: { id: string } }) {
  console.log(id);

  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;
