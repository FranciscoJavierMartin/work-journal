import { useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns';

export default function EntryForm({
  entry,
}: {
  entry?: { text: string; date: string; type: string };
}) {
  const fetcher = useFetcher<HTMLFormElement>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!entry?.text && fetcher.state === 'idle' && textAreaRef.current) {
      textAreaRef.current.value = '';
      textAreaRef.current.focus();
    }
  }, [fetcher.state, entry?.text]);

  return (
    <fetcher.Form
      method='post'
      className='mt-2'
      aria-disabled={fetcher.state !== 'idle'}
    >
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
              defaultValue={entry?.date ?? format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <div className='mt-4 space-x-4'>
            {[
              { label: 'Work', value: 'work' },
              { label: 'Learning', value: 'learning' },
              { label: 'Interesting thing', value: 'interesting-thing' },
            ].map((option) => (
              <label key={option.value} htmlFor={option.value}>
                <input
                  className='mr-1 -mt-1'
                  id={option.value}
                  type='radio'
                  name='type'
                  value={option.value}
                  required
                  defaultChecked={entry?.type === option.value}
                />
                {option.label}
              </label>
            ))}
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
              {fetcher.state !== 'idle' ? 'Saving' : 'Save'}
            </button>
          </div>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
