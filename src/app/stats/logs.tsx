import { Header } from '@components/Header';
import { api } from '@src/lib/api';
import { HeadacheLog } from '@src/models';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useQuery } from 'react-query';

dayjs.extend(dayjsDuration);

export default function Logs() {
  const [headaches, setHeadaches] = useState<HeadacheLog[]>(
    [] as HeadacheLog[],
  );

  const { isLoading, refetch } = useQuery(
    QUERY_KEYS.headaches.list(),
    async () => {
      const response = await api.get(QUERY_URLS.headaches.list());

      return response.data;
    },
    {
      onSuccess: (data) => {
        setHeadaches(data);
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
      <Header title="Logs" />
      <FlatList
        refreshing={isLoading}
        data={headaches}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 16,
          paddingHorizontal: 12,
        }}
        ItemSeparatorComponent={() => <View className="h-4 bg-transparent" />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xl font-bold text-white">No logs found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Link
            href={`/log/${item.id}`}
            className="flex-row items-center bg-slate-500 p-4"
          >
            <View className="flex-row items-center">
              <View
                className={clsx('mr-4 h-4 w-4 rounded-full', {
                  'bg-yellow-500': item.intensity === 1,
                  'bg-orange-500': item.intensity === 2,
                  'bg-red-700': item.intensity === 3,
                  'bg-gray-600': !item.endTimestamp,
                })}
              />
              <View className="flex-col">
                <View className="flex-row items-center space-x-4">
                  <Text className="font-bold text-white">
                    {dayjs(item.startTimestamp).format('DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
            </View>
          </Link>
        )}
      />
    </View>
  );
}
