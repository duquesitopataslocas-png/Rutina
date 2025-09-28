import { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import clsx from 'clsx';

interface TextFieldProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  className?: string;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, errorMessage, className, ...props }, ref) => (
    <View className="w-full">
      {label ? <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text> : null}
      <TextInput
        ref={ref}
        className={clsx(
          'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900',
          className
        )}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {errorMessage ? <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text> : null}
    </View>
  )
);

TextField.displayName = 'TextField';
