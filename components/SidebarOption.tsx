'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function SidebarOption({ href, id }: { href: string; id: string }) {
  const { data, error, isLoading } = useSWR(`/api/documents/${id}`, fetcher);
  const pathName = usePathname();
  const isActive = href.includes(pathName) && pathName !== '/';

  if (error) return null;
  if (isLoading) return null;
  if (!data) return null;

  return (
    <Link
      href={href}
      className={`border p-2 rounded-md ${
        isActive ? 'bg-gray-300 font-bold border-black' : 'border-gray-400'
      }`}
    >
      <p className='truncate'>{data.title}</p>
    </Link>
  );
}

export default SidebarOption;
