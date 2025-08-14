import { TrackingWrapper } from '@next-admin/tracking-sdk';
import { Toaster } from '@/components/ui/sonner';
import AppRouter from './router';

function App() {
  return (
    <TrackingWrapper>
      <AppRouter />
      <Toaster />
    </TrackingWrapper>
  );
}

export default App;
