'use server';

import { getCollection } from '@/lib/mongodb';
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function createNewDocument() {
  const Auth = await auth();
  const { sessionClaims } = Auth;

  if (!sessionClaims?.email) {
    throw new Error('Unauthorized');
  }

  const documentsCollection = await getCollection('documents');
  const result = await documentsCollection.insertOne({
    title: 'New Document',
    createdAt: new Date(),
  });

  const userRoomsCollection = await getCollection('rooms');
  await userRoomsCollection.insertOne({
    userId: sessionClaims.email,
    role: 'owner',
    createdAt: new Date(),
    roomId: result.insertedId.toString(),
  });

  return { docId: result.insertedId.toString() };
}

export async function deleteDocument(id: string) {
  try {
    const documentsCollection = await getCollection('documents');
    const userRoomsCollection = await getCollection('rooms');

    await documentsCollection.deleteOne({ _id: new ObjectId(id) });
    await userRoomsCollection.deleteMany({ roomId: id });
    await liveblocks.deleteRoom(id);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(id: string, email: string) {
  try {
    const userRoomsCollection = await getCollection('rooms');
    await userRoomsCollection.insertOne({
      userId: email,
      role: 'editor',
      createdAt: new Date(),
      roomId: id,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(id: string, userId: string) {
  try {
    const userRoomsCollection = await getCollection('rooms');
    await userRoomsCollection.deleteOne({
      roomId: id,
      userId: userId,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
