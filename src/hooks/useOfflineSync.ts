import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { processQueue } from '@/store/offlineQueue';

export function useOfflineSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        processQueue();
      }
    });

    return () => unsubscribe();
  }, []);
}
