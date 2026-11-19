import { type Href, Redirect } from 'expo-router';
import { type AppLocation, appHref } from './navigation';

export function AppRedirect(location: AppLocation) {
  return <Redirect href={appHref(location) as Href} />;
}
