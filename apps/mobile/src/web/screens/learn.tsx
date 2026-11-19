import { AppRedirect } from '@/web/navigation/AppRedirect';
export default function LegacyRedirect() {
  return <AppRedirect {...{ to: '/discover', search: { tab: 'learn' } }} />;
}
