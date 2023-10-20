import { useRef } from 'react';
import { useFetcher } from '@remix-run/react';

export default function EntryForm({
  entry,
}: {
  entry: { text: string; date: string; type: string };
}) {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <fetcher.Form method='post' className='mt-2'>
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
              defaultValue={entry.date}
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
                defaultChecked={entry.type === 'work'}
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
                defaultChecked={entry.type === 'learning'}
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
                defaultChecked={entry.type === 'interesting-thing'}
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
              defaultValue={entry?.text}
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
  );
}
