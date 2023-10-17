import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className="bg-gray-300 p-20">
      <p className="text-blue-500">Hello, Build UI!</p>
    </div>
  );
}
