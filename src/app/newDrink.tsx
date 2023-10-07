import { Header } from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@src/lib/api';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from 'react-query';
import z from 'zod';

interface DrinkData {
  name: string;
}

const DrinkSchema = z.object({
  name: z.string().min(1).max(255),
});

export default function NewDrink() {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DrinkData>({
    resolver: zodResolver(DrinkSchema),
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    async ({ name }: DrinkData) => {
      const response = await api.post(QUERY_URLS.drinks.create(), {
        name,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Drink created successfully',
        });
        queryClient.invalidateQueries(QUERY_KEYS.drinks.list());
        setValue('name', '');
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
      <Header title="New Drink" />
      <View className="mt-10 px-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="mb-2 text-lg text-white">Name:</Text>
              <TextInput
                className="w-full rounded-md bg-slate-500 p-4 text-slate-50 placeholder-slate-200 shadow-md"
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.name && (
                <Text className="text-sm text-red-500">
                  {errors.name.message}
                </Text>
              )}
            </>
          )}
        />
        <TouchableOpacity
          onPress={handleSubmit((data) => mutate(data))}
          disabled={isLoading}
          className="mt-10 w-full items-center justify-center bg-green-800 p-2"
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#FFF" />
          ) : (
            <Text className="text-lg font-bold text-white">Create</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
