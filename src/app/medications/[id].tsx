import { Header } from '@components/Header';
import Icon from '@expo/vector-icons/Feather';
import { api } from '@src/lib/api';
import { HeadacheRemedy } from '@src/models';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import clsx from 'clsx';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function AddFoodDrink() {
  const [medications, setMedications] = useState<HeadacheRemedy[]>([]);

  const { id } = useLocalSearchParams() as { id: string };

  const queryClient = useQueryClient();

  const { mutate, isLoading: isSaving } = useMutation(
    async ({ remedyId, result }: { remedyId: string; result: '+' | '++' }) => {
      const response = await api.patch(
        QUERY_URLS.headaches.remedyResult(id, remedyId),
        {
          result,
        },
      );

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.headaches.detail(id));
      },
    },
  );

  const { isLoading } = useQuery(
    QUERY_KEYS.headaches.detail(id),
    async () => {
      const response = await api.get(QUERY_URLS.headaches.detail(id));

      return response.data;
    },
    {
      onSuccess: (data) => {
        setMedications(data.remedies);
      },
    },
  );

  return (
    <View className="flex-1 bg-slate-800">
      <Header title="Remedies" />
      <View className="flex-1 items-center justify-evenly p-4">
        <View className="w-full flex-1 gap-4 space-y-4">
          <FlatList
            data={medications}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-white">
                  No Remedies yet
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View
                className={clsx(
                  'my-2 w-full flex-row items-center justify-evenly rounded p-4',
                  {
                    'bg-green-500': item.result === '++',
                    'bg-yellow-500': item.result === '+',
                    'bg-red-700': item.result === '-',
                  },
                )}
              >
                <TouchableOpacity
                  disabled={isSaving}
                  activeOpacity={0.7}
                  onPress={() => mutate({ remedyId: item.id, result: '+' })}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFF" size={24} />
                  ) : (
                    <Icon name="chevron-right" size={24} color="#FFF" />
                  )}
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">
                  {item.remedy.name}
                </Text>
                <Text className="text-xl font-bold text-white">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={isSaving}
                  onPress={() => mutate({ remedyId: item.id, result: '++' })}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFF" size={24} />
                  ) : (
                    <Icon name="chevrons-right" size={24} color="#FFF" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <Link href={`addMedication/${id}`} asChild>
          <TouchableOpacity className="w-full items-center justify-center rounded bg-yellow-500 p-4">
            <Text className="text-xl font-bold uppercase text-white">
              Add Remedy
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
