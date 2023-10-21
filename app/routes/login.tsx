import { commitSession, getSession } from '@/session';
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  let res: any;

  if (email === 'test@test.com' && password === 'password') {
    const session = await getSession();
    session.set('isAdmin', true);

    res = redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  } else {
    res = null;
  }

  return res;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  return session.data;
}

export default function Login() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className='mt-8'>
      {data?.isAdmin ? (
        <p>You are signed in!</p>
      ) : (
        <Form method='post'>
          <input
            className='text-gray-900'
            type='email'
            name='email'
            placeholder='Email'
          />
          <input
            className='text-gray-900'
            type='password'
            name='password'
            placeholder='Password'
          />
          <button
            type='submit'
            className='bg-blue-500 px-3 py-2 font-medium text-white'
          >
            Login
          </button>
        </Form>
      )}
    </div>
  );
}
