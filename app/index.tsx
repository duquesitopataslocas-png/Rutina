import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-8">
      <StatusBar style="light" />
      <Text className="text-4xl font-bold text-white">Rutina Coach</Text>
      <Text className="mt-2 text-center text-base text-slate-200">
        Boilerplate Expo + NativeWind para iniciar la app móvil de kinesiólogos.
      </Text>
      <Link href="/settings" asChild>
        <Pressable className="mt-8 rounded-full bg-white px-6 py-3">
          <Text className="text-base font-semibold text-slate-900">Ir a Ajustes</Text>
        </Pressable>
      </Link>
    </View>
  );
}
