'use client';

import React from 'react';
import Document from '@/components/Document';

function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Unwrap params using React.use()

  console.log(id);

  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;
