'use client';

import { usePathname } from 'next/navigation';
import React, { Fragment } from 'react';
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
        <BreadcrumbItem key='HOME'>
          <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const segmentPath = `/${segments.slice(0, index + 1).join('/')}`;
          return (
            <Fragment key={`breadcrumb-${index}`}>
              <BreadcrumbSeparator key={`separator-${index}`} />
              <BreadcrumbItem key={`item-${index}`}>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segmentPath}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
