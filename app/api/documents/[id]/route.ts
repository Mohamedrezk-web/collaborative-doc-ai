import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const documentsCollection = await getCollection('documents');
    const document = await documentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await req.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const documentsCollection = await getCollection('documents');
    const result = await documentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const documentsCollection = await getCollection('documents');
    const userRoomsCollection = await getCollection('rooms');

    // Delete the document
    await documentsCollection.deleteOne({ _id: new ObjectId(id) });

    // Delete all room references
    await userRoomsCollection.deleteMany({ roomId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
