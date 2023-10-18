import {
  redirect,
  type MetaFunction,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { Form } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';

export async function action({ request }: ActionFunctionArgs) {
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

  await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });

  return redirect('/');
}

export const meta: MetaFunction = () => {
  return [{ title: 'Work journal' }];
};

export default function Index() {
  return (
    <div className='max-w-7xl p-6 mx-auto '>
      <h1 className='text-4xl text-white'>Work journal</h1>
      <p className='mt-3 text-xl text-gray-400'>
        Doings and learnings. Updated weekly.
      </p>

      <div className='my-8 border p-3'>
        <Form method='post'>
          <p className='italic'>Create an entry</p>

          <div>
            <div className='mt-4'>
              <input type='date' name='date' className='text-gray-700' />
            </div>
            <div className='mt-2 space-x-6'>
              <label htmlFor='work'>
                <input
                  className='mr-1'
                  id='work'
                  type='radio'
                  name='type'
                  value='work'
                />
                Work
              </label>
              <label htmlFor='learning'>
                <input
                  className='mr-1'
                  id='learning'
                  type='radio'
                  name='type'
                  value='learning'
                />
                Learning
              </label>
              <label htmlFor='interesting-thing'>
                <input
                  className='mr-1'
                  id='interesting-thing'
                  type='radio'
                  name='type'
                  value='interesting-thing'
                />
                Interesting thing
              </label>
            </div>
            <div className='mt-2'>
              <textarea
                name='text'
                className='w-full text-gray-700'
                placeholder='Write your entry...'
              />
            </div>
            <div className='mt-1 text-right'>
              <button
                className='bg-blue-500 text-white font-medium px-4 py-1'
                type='submit'
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      </div>

      <div className='mt-6'>
        <p className='font-bold'>
          Week of February 20<sup>th</sup>
        </p>

        <div className='mt-3 space-y-4'>
          <div>
            <p>Work</p>
            <ul className='ml-8 list-disc'>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Learnings</p>
            <ul className='ml-8 list-disc'>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className='ml-8 list-disc'>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
