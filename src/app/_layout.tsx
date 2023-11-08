import { api } from '@src/lib/api';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { Stack, useRouter } from 'expo-router';
import * as SecureStorage from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function Layout() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const queryClient = new QueryClient();

  const { top } = useSafeAreaInsets();

  const router = useRouter();

  useEffect(() => {
    async function setToken() {
      const token = await SecureStorage.getItemAsync('token');

      try {
        const response = await api.post(QUERY_URLS.session.verify(), {
          token,
        });
        const data = response.data;

        if (!data.isValid) {
          setIsSignedIn(false);
          await SecureStorage.deleteItemAsync('token');
          router.push('/signIn');
        } else {
          setIsSignedIn(true);
        }
      } catch (error) {
        await SecureStorage.deleteItemAsync('token');
        router.push('/signIn');
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    setToken();
  }, []);

  return (
    <View
      className="flex-1 bg-slate-800"
      style={{
        paddingTop: top,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" redirect={isSignedIn} />
          <Stack.Screen name="stats" />
        </Stack>
      </QueryClientProvider>
      <Toast />
    </View>
  );
}
