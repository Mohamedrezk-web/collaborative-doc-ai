'use server';

import { adminDb } from '@/firebase-admin';
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
