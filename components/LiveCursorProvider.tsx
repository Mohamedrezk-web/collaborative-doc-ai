'use client';
import { useMyPresence } from '@liveblocks/react';
import { useOthers } from '@liveblocks/react/suspense';
import React, { PointerEventHandler } from 'react';
import FollowPointer from './FollowPointer';

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  function handelPointerMove(event: any) {
    const cursor = {
      x: Math.round(event.pageX),
      y: Math.round(event.pageY),
    };

    updateMyPresence({ cursor });
  }

  function handelPointerLeave() {
    updateMyPresence({ cursor: null });
  }
  return (
    <div onPointerMove={handelPointerMove} onPointerLeave={handelPointerLeave}>
      {others
        .filter((other) => other.presence.cursor)
        .map(({ connectionId, presence, info }) => {
          return (
            <FollowPointer
              key={connectionId}
              info={info}
              x={presence.cursor!.x}
              y={presence.cursor!.y}
            ></FollowPointer>
          );
        })}
      {children}
    </div>
  );
}

export default LiveCursorProvider;
