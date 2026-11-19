import { AppRedirect } from '@/web/navigation/AppRedirect';
export default function LegacyRedirect() {
  return <AppRedirect {...{ to: '/groups', search: { view: 'browse' } }} />;
}
