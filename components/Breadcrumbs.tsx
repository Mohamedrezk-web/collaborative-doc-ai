'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function Breadcrumbs() {
  const path = usePathname();
  const segments = path.split('/').filter((segment) => segment !== '');
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments &&
          segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            return (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem key={index}>
                  {isLast ? (
                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={`/${segments.slice(0, index + 1).join('/')}`}
                    >
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
