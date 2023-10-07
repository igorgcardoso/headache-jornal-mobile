import { Header } from '@components/Header';
import { api } from '@src/lib/api';
import { Drink } from '@src/models';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useQuery } from 'react-query';

export default function Remedies() {
  const [remedies, setRemedies] = useState<Drink[]>([]);

  const { isLoading } = useQuery(
    QUERY_KEYS.drinks.list(),
    async () => {
      const response = await api.get(QUERY_URLS.drinks.list());

      return response.data;
    },
    {
      onSuccess: (data) => {
        setRemedies(data);
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
      <Header title="Drinks" showAddButton href="/newDrink" />
      <FlatList
        keyExtractor={(item) => item.id}
        data={remedies}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 24,
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <View className="my-2 w-full rounded-md bg-slate-700 p-4 shadow-md">
            <View className="flex flex-row justify-between">
              <View className="flex flex-col">
                <Text className="text-2xl font-bold text-white">
                  {item.name}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
