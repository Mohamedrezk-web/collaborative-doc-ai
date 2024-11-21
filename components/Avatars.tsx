'use client';
import { useOthers, useSelf } from '@liveblocks/react';
import React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function Avatars() {
  const others = useOthers();
  const self = useSelf();
  const allAvatars = [...others, self];
  return (
    <div className='flex gap-2 items-center'>
      <p className='font-light text-sm'>
        Users currently editing this document
      </p>

      <div className='flex -space-x-5'></div>
      {allAvatars.map((avatar, i) => (
        <TooltipProvider key={avatar?.id}>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src={avatar?.info.avatar} />
                <AvatarFallback>{avatar?.info.name}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{self?.id === avatar?.id ? 'You' : avatar?.info.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export default Avatars;
