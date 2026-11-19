import { Link } from 'expo-router';
import { Header } from '@/web/components/ui/Header';

type RouteNotFoundProps = {
  title?: string;
};

export function RouteNotFound({ title = 'Page not found' }: RouteNotFoundProps) {
  return (
    <>
      <Header title={title} />
      <p className="my-5 text-[13px]">This page isn't available in the current demo session.</p>
      <Link href="/home" className="text-green underline">
        Back to Home
      </Link>
    </>
  );
}
