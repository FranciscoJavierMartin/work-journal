import { type MetaFunction, type ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

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

  return db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
}

export const meta: MetaFunction = () => {
  return [{ title: 'Work journal' }];
};

export default function Index() {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === 'idle' && textAreaRef.current) {
      textAreaRef.current.value = '';
      textAreaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className='max-w-7xl p-6 mx-auto '>
      <h1 className='text-4xl text-white'>Work journal</h1>
      <p className='mt-3 text-xl text-gray-400'>
        Doings and learnings. Updated weekly.
      </p>

      <div className='my-8 border p-3'>
        <p className='italic'>Create an entry</p>

        <fetcher.Form method='post'>
          <fieldset
            disabled={fetcher.state === 'submitting'}
            className='disabled:opacity-80'
          >
            <div>
              <div className='mt-4'>
                <input
                  type='date'
                  name='date'
                  className='text-gray-700'
                  required
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className='mt-2 space-x-6'>
                <label htmlFor='work'>
                  <input
                    className='mr-1'
                    id='work'
                    type='radio'
                    name='type'
                    value='work'
                    required
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
                    defaultChecked
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
                  ref={textAreaRef}
                  name='text'
                  className='w-full text-gray-700'
                  placeholder='Write your entry...'
                  required
                />
              </div>
              <div className='mt-1 text-right'>
                <button
                  className='bg-blue-500 text-white font-medium px-4 py-1'
                  type='submit'
                >
                  {fetcher.state === 'submitting' ? 'Saving' : 'Save'}
                </button>
              </div>
            </div>
          </fieldset>
        </fetcher.Form>
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
