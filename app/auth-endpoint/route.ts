import { getCollection } from '@/lib/mongodb';
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims!.email, {
    userInfo: {
      name: sessionClaims?.name! as string,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image! as string,
    },
  });

  const userRoomsCollection = await getCollection('rooms');
  const userInRoom = await userRoomsCollection.findOne({
    userId: sessionClaims?.email,
    roomId: room,
  });

  if (userInRoom) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return new Response(null, { status: 403 });
  }
}
