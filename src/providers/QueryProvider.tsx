import { PropsWithChildren, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import NetInfo from '@react-native-community/netinfo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60,
      retry: 1
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({ storage: AsyncStorage });

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24
});

export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onFocus = () => focusManager.setFocused(true);
    const onBlur = () => focusManager.setFocused(false);

    const subscription = {
      remove: () => {
        window.removeEventListener?.('focus', onFocus);
        window.removeEventListener?.('blur', onBlur);
      }
    };

    window.addEventListener?.('focus', onFocus);
    window.addEventListener?.('blur', onBlur);

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
