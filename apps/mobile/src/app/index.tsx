import { Redirect } from 'expo-router';
import { authClient } from '@/lib/auth-client';

export default function IndexScreen() {
  const { data: session } = authClient.useSession();
  return <Redirect href={session ? '/home' : '/login'} />;
}
