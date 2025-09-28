import { useMemo } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/providers/AuthProvider';
import { fetchClients } from '@/features/clients/api';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';

export default function ClientsScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const coachId = user?.id ?? '';

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['clients', coachId],
    queryFn: () => fetchClients(coachId),
    enabled: Boolean(coachId)
  });

  const clients = useMemo(() => data ?? [], [data]);

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Button title="Nuevo cliente" onPress={() => router.push('/(authenticated)/coach/clients/create')} />
      {clients.length ? (
        <FlatList
          className="mt-4"
          data={clients}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              variant="ghost"
              onPress={() => router.push({ pathname: '/(authenticated)/coach/clients/[id]', params: { id: item.id } })}
            />
          )}
        />
      ) : (
        !isLoading && <EmptyState message="Crea tu primer cliente para comenzar." />
      )}
    </View>
  );
}
