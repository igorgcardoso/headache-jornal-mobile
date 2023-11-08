import { Header } from '@components/Header';
import Icon from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@src/lib/api';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation } from 'react-query';
import { z } from 'zod';

interface SignInData {
  email: string;
  password: string;
}

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    async (data: SignInData) => {
      const response = await api.post(QUERY_URLS.session.signIn(), data);

      return response.data;
    },
    {
      onSuccess: async (data) => {
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        await SecureStore.setItemAsync('token', data.token);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You have successfully signed in.',
        });
        router.back();
      },
      onError: (error: AxiosError) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: getErrorMessage(error),
        });
      },
    },
  );

  return (
    <View className="flex-1 bg-slate-800">
      <Header title="Sign In" />
      <View className="flex-1 items-center justify-center gap-y-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-y-2">
              <Text className="ml-2 text-lg text-white">Email</Text>
              <View className="flex-row items-center rounded-lg bg-white px-2">
                <Icon name="mail" size={24} color="black" />
                <TextInput
                  className="w-64 rounded-lg rounded-l-none bg-white p-2"
                  placeholder="jon@doe.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
              <Text className="ml-2 text-sm text-red-500">
                {errors.email?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="gap-y-2">
              <Text className="ml-2 text-lg text-white">Password</Text>
              <View className="flex-row items-center rounded-lg bg-white px-2">
                <Icon name="lock" size={24} color="black" />
                <TextInput
                  className="w-64 rounded-lg rounded-l-none bg-white p-2"
                  placeholder="*******"
                  autoCapitalize="none"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
              <Text className="ml-2 text-sm text-red-500">
                {errors.password?.message}
              </Text>
            </View>
          )}
        />
        <TouchableOpacity
          className="rounded-lg bg-green-500 px-8 py-4"
          onPress={handleSubmit((data) => mutate(data))}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size={24} />
          ) : (
            <View className="flex-row items-center justify-center gap-x-2">
              <Icon name="log-in" size={24} color="white" />
              <Text className="text-lg font-semibold uppercase text-white">
                Sign In
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
