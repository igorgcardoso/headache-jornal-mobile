import { Header } from '@components/Header';
import Icon from '@expo/vector-icons/Feather';
import { api } from '@src/lib/api';
import { Remedy } from '@src/models';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function AddFoodDrink() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [selectedRemedy, setSelectedRemedy] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const { id } = useLocalSearchParams() as { id: string };

  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery(
    QUERY_KEYS.remedies.list(),
    async () => {
      const response = await api.get(QUERY_URLS.remedies.list());

      return response.data;
    },
    {
      onSuccess: (data) => {
        setRemedies(data);
      },
    },
  );

  const { mutate } = useMutation(
    async () => {
      const response = await api.patch(QUERY_URLS.headaches.remedies(id), {
        id: selectedRemedy,
        quantity,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You have successfully added a remedy.',
        });
        queryClient.invalidateQueries(QUERY_KEYS.headaches.detail(id));
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
      <Header title="Add Remedy" />
      <View className="flex-1 items-center justify-evenly p-4">
        <View className="w-full flex-1 gap-4 space-y-4">
          <Text className="text-xl font-bold text-white">Remedies</Text>
          <FlatList
            data={remedies}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-white">
                  No Registered Remedies yet
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedRemedy(item.id)}
                className={clsx(
                  'mt-2 w-full flex-row items-center justify-center bg-slate-500 p-4',
                  {
                    'bg-green-500': selectedRemedy === item.id,
                  },
                )}
              >
                <Text className="text-xl font-bold text-white">
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <View className="w-full flex-row items-center justify-between p-4">
        <Text className="text-xl font-bold text-white">Quantity</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setQuantity(quantity - 1)}
            className="flex-1 items-center justify-center bg-red-700 p-4"
          >
            <Icon name="minus" size={16} className="font-bold" color="white" />
          </TouchableOpacity>
          <Text className="p-2 text-center text-xl font-bold text-white">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            className="flex-1 items-center justify-center bg-green-500 p-4"
          >
            <Icon name="plus" size={16} className="font-bold" color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="my-5 flex-row items-center justify-center bg-green-800 p-4"
        onPress={() => mutate()}
      >
        <Text className="font-bold text-white">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
