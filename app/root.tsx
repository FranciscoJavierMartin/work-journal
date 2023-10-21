import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import stylesheet from '@/tailwind.css';
import { destroySession, getSessionFromCookieInsideRequest } from '@/session';

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [
        { rel: 'stylesheet', href: cssBundleHref },
        { rel: 'stylesheet', href: stylesheet },
      ]
    : [{ rel: 'stylesheet', href: stylesheet }]),
];

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSessionFromCookieInsideRequest(request);

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromCookieInsideRequest(request);

  return {
    session: session.data,
  };
}

export default function App() {
  const { session } = useLoaderData<typeof loader>();

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='p-10'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-5xl'>Work Journal</h1>
              <p className='mt-2 text-lg text-gray-400'>
                Learnings and doings. Updated weekly.
              </p>
            </div>
            {session.isAdmin ? (
              <Form method='post'>
                <button>Logout</button>
              </Form>
            ) : (
              <Link to='/login'>Login</Link>
            )}
          </div>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang='en' className='h-full'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full flex flex-col items-center justify-center'>
        <h1 className='text-3xl'>Whoops!</h1>
        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} - {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{(error as any).message}</p>
        ) : (
          <p>Something happened</p>
        )}
        <Scripts />
      </body>
    </html>
  );
}
