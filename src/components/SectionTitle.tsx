import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SectionTitleProps {
  title: string;
  action?: ReactNode;
}

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <View className="mb-2 mt-4 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-secondary">{title}</Text>
      {action}
    </View>
  );
}
