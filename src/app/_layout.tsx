import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function Layout() {
  const queryClient = new QueryClient();

  const { top } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-slate-800"
      style={{
        paddingTop: top,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" redirect />
          <Stack.Screen name="stats" />
        </Stack>
      </QueryClientProvider>
      <Toast />
    </View>
  );
}
