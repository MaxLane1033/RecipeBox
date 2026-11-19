import { Redirect } from 'expo-router';

/** Native routes retain the current starter until native feature screens are built. */
export default function NativeFallback() {
  return <Redirect href="/home" />;
}
