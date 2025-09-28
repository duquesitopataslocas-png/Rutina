import { Text, View } from 'react-native';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View className="my-4 items-center">
      <Text className="text-sm text-slate-500">{message}</Text>
    </View>
  );
}
