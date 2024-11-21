'use server';

import { adminDb } from '@/firebase-admin';
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';

export async function createNewDocument() {
  const Auth = await auth();
  if (!Auth.userId) return Auth.redirectToSignIn();

  const { sessionClaims } = Auth;

  const documentsCollectionRef = adminDb.collection('documents');
  const documentsRef = await documentsCollectionRef.add({
    title: 'New Document',
  });

  await adminDb
    .collection('users')
    .doc(sessionClaims?.email!)
    .collection('rooms')
    .doc(documentsRef.id)
    .set({
      userId: sessionClaims?.email,
      role: 'owner',
      createdAt: new Date(),
      roomId: documentsRef.id,
    });

  return { docId: documentsRef.id };
}

export async function deleteDocument(id: string) {
  try {
    await adminDb.collection('documents').doc(id).delete();
    const querySnapshot = await adminDb
      .collection('rooms')
      .where('roomId', '==', id)
      .get();

    const batch = adminDb.batch();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await liveblocks.deleteRoom(id);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(id: string, email: string) {
  try {
    await adminDb
      .collection('users')
      .doc(email)
      .collection('rooms')
      .doc(id)
      .set({
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
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('rooms')
      .doc(id)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
