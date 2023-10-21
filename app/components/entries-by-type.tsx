import { Link } from '@remix-run/react';

type EntriesByTypeProps = {
  entries: { id: number; date: string; type: string; text: string }[];
  title: string;
  canEdit?: boolean;
};

export default function EntriesByType({
  entries,
  title,
  canEdit,
}: EntriesByTypeProps) {
  return entries.length ? (
    <div>
      <p>{title}</p>
      <ul className='ml-8 list-disc'>
        {entries.map((entry) => (
          <li key={entry.id} className='group'>
            {entry.text}
            {canEdit && (
              <Link
                to={`/entries/${entry.id}/edit`}
                className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'
              >
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
