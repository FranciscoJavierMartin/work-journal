import type { FormEvent } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import EntryForm from '@/components/entry-form';

export async function action({ request, params }: ActionFunctionArgs) {
  const db = new PrismaClient();
  const formData = await request.formData();
  const { _action, date, type, text } = Object.fromEntries(formData);
  let res: any;

  if (_action === 'delete') {
    res = await db.entry.delete({
      where: { id: +params.entryId! },
    });
  } else {
    if (
      typeof date !== 'string' ||
      typeof type !== 'string' ||
      typeof text !== 'string'
    ) {
      throw new Error('Bad request');
    }

    res = await db.entry.update({
      where: { id: +params.entryId! },
      data: {
        date: new Date(date),
        type: type,
        text: text,
      },
    });
  }

  return res;
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure?')) {
      e.preventDefault();
    }
  }

  return (
    <div className='mt-4'>
      <p>Editing entry {entry.id}</p>
      <div className='mt-8'>
        <EntryForm entry={entry} />
      </div>
      <div className='mt-8'>
        <Form method='post' onSubmit={handleSubmit}>
          <button
            name='_action'
            value='delete'
            className='text-gray-500 underline'
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}
