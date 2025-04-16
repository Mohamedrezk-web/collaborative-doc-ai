import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRoomsCollection = await getCollection('rooms');
    const userRooms = await userRoomsCollection
      .find({ userId: email })
      .toArray();

    const documentIds = userRooms.map((room) => room.roomId);
    const documentsCollection = await getCollection('documents');
    const documents = await documentsCollection
      .find({ _id: { $in: documentIds } })
      .toArray();

    return NextResponse.json({ documents, userRooms });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documentsCollection = await getCollection('documents');
    const result = await documentsCollection.insertOne({
      title: 'New Document',
      createdAt: new Date(),
    });

    const userRoomsCollection = await getCollection('rooms');
    await userRoomsCollection.insertOne({
      userId: email,
      role: 'owner',
      createdAt: new Date(),
      roomId: result.insertedId.toString(),
    });

    return NextResponse.json({ docId: result.insertedId });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
