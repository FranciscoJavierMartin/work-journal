import {
  type MetaFunction,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { format, parseISO, startOfWeek } from 'date-fns';
import { PrismaClient } from '@prisma/client';
import EntriesByType from '@/components/entries-by-type';
import EntryForm from '@/components/entry-form';
import { getSessionFromCookieInsideRequest } from '@/session';

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSessionFromCookieInsideRequest(request);

  if (!session.data.isAdmin) {
    throw new Response('Not authenticated', { status: 401 });
  }

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

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromCookieInsideRequest(request);
  const db = new PrismaClient();
  const entries = await db.entry.findMany();

  const entriesByWeek = entries
    .map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    }))
    .reduce<Record<string, typeof entries>>((acc, entry) => {
      const monday = startOfWeek(parseISO(entry.date), { weekStartsOn: 1 });
      const mondayString = format(monday, 'yyyy-MM-dd');

      acc[mondayString] ||= [];
      acc[mondayString].push(entry as any);

      return acc;
    }, {});

  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((entry) => entry.type === 'work'),
      learning: entriesByWeek[dateString].filter(
        (entry) => entry.type === 'learning',
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === 'interesting-thing',
      ),
    }));

  return { session: session.data, weeks };
}

export const meta: MetaFunction = () => {
  return [{ title: 'Work journal' }];
};

export default function Index() {
  const { weeks, session } = useLoaderData<typeof loader>();

  return (
    <div>
      {session.isAdmin && (
        <div className='my-8 border p-3'>
          <p className='italic'>Create an entry</p>
          <EntryForm />
        </div>
      )}
      <div className='mt-12 space-y-12'>
        {weeks.map((week) => (
          <div key={week.dateString}>
            <p className='font-bold'>
              Week of {format(parseISO(week.dateString), 'dd MMMM')}
            </p>
            <div className='mt-3 space-y-4'>
              <EntriesByType
                entries={week.work}
                title='Work'
                canEdit={session.isAdmin}
              />
              <EntriesByType
                entries={week.learning}
                title='Learning'
                canEdit={session.isAdmin}
              />
              <EntriesByType
                entries={week.interestingThings}
                title='Interesting things'
                canEdit={session.isAdmin}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
