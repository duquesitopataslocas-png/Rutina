import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import clsx from 'clsx';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

export function Button({ title, onPress, disabled, loading, variant = 'primary', icon }: ButtonProps) {
  const textColor =
    variant === 'primary' || variant === 'secondary' ? 'text-white' : 'text-primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        'flex-row items-center justify-center rounded-lg px-4 py-3',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'ghost' && 'bg-transparent border border-slate-300',
        (disabled || loading) && 'opacity-60'
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#0EA5E9' : '#fff'} />
      ) : (
        <>
          {icon}
          <Text className={clsx(icon ? 'ml-2' : '', 'font-semibold', textColor)}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
