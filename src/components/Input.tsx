import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      {label ? <Text className="mb-1 text-sm text-slate-500">{label}</Text> : null}
      <TextInput
        className="rounded-lg border border-slate-300 px-4 py-3 text-base"
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}
