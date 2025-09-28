import NetInfo from '@react-native-community/netinfo';
import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

export function useOnlineManager() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const unsubscribe = NetInfo.addEventListener((state) => {
      focusManager.setFocused(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        focusManager.setFocused(true);
      }
    });

    return () => subscription.remove();
  }, []);
}
