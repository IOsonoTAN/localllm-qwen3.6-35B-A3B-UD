import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { ContactPayload } from '@/types/contact';

const CONTACTS_FILE = path.join(process.cwd(), 'src', 'data', 'contacts.json');

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();
    
    // Validate input
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, Email and Message are required' },
        { status: 400 }
      );
    }

    // Read existing contacts
    let contacts: ContactPayload[] = [];
    try {
      const data = await fs.readFile(CONTACTS_FILE, 'utf8');
      if (data) {
        contacts = JSON.parse(data);
      }
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      console.log('No existing contacts file found or it was empty.');
    }

    // Add new contact
    const newContact = {
      ...body,
      submittedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);

    await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json(
      { message: 'Contact message saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json(
      { error: 'Failed to save contact message' },
      { status: 500 }
    );
  }
}