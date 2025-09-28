import { Pressable, PressableProps, Text } from 'react-native';
import clsx from 'clsx';

interface PrimaryButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const PrimaryButton = ({ label, variant = 'primary', className, disabled, ...rest }: PrimaryButtonProps) => (
  <Pressable
    className={clsx(
      'items-center justify-center rounded-xl px-4 py-3',
      variant === 'primary' ? 'bg-primary' : 'bg-gray-200',
      disabled && 'opacity-60',
      className
    )}
    disabled={disabled}
    {...rest}
  >
    <Text className={clsx('text-base font-semibold', variant === 'primary' ? 'text-white' : 'text-gray-800')}>
      {label}
    </Text>
  </Pressable>
);
