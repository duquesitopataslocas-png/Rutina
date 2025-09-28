import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SupabaseProvider } from './SupabaseProvider';
import { useOnlineManager } from '@/hooks/useOnlineManager';

export const AppProviders = ({ children }: PropsWithChildren) => {
  useOnlineManager();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60
          }
        }
      })
  );

  return (
    <SafeAreaProvider>
      <SupabaseProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SupabaseProvider>
    </SafeAreaProvider>
  );
};
