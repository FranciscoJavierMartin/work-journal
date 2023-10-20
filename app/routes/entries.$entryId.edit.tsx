import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import EntryForm from '@/components/entry-form';

export async function action({ request, params }: ActionFunctionArgs) {
  const db = new PrismaClient();
  const formData = await request.formData();
  const { date, type, text } = Object.fromEntries(formData);

  if (
    typeof date !== 'string' ||
    typeof type !== 'string' ||
    typeof text !== 'string'
  ) {
    throw new Error('Bad request');
  }

  return db.entry.update({
    where: { id: +params.entryId! },
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (typeof params.entryId !== 'string' || !/^\d+$/.test(params.entryId)) {
    throw new Response('Invalid id', { status: 400 });
  }

  const db = new PrismaClient();
  const entry = await db.entry.findUnique({ where: { id: +params.entryId } });

  if (!entry) {
    throw new Response('Not found', { status: 404 });
  }

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export default function EditPage() {
  const entry = useLoaderData<typeof loader>();

  return (
    <div className='mt-4'>
      <p>Editing entry {entry.id}</p>
      <div className='mt-8'>
        <EntryForm entry={entry} />
      </div>
    </div>
  );
}
