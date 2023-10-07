import { Header } from '@components/Header';
import { LabelValue } from '@components/LabelValue';
import { api } from '@src/lib/api';
import { HeadacheLog } from '@src/models';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function Log() {
  const [log, setLog] = useState<HeadacheLog>({} as HeadacheLog);
  const { id } = useLocalSearchParams() as { id: string };

  const queryClient = useQueryClient();

  useQuery(
    [QUERY_URLS.headaches.detail(id)],
    async () => {
      const response = await api.get(QUERY_URLS.headaches.detail(id));

      return response.data;
    },
    {
      onSuccess: (data) => {
        setLog(data);
      },
    },
  );

  const { mutate, isLoading } = useMutation(
    async () => {
      await api.patch(QUERY_URLS.headaches.end(id));
    },
    {
      onSuccess: async () => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You have successfully ended the headache.',
        });
        await queryClient.invalidateQueries(QUERY_URLS.headaches.detail(id));
        await queryClient.invalidateQueries(QUERY_URLS.headaches.list());
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
      <Header title={dayjs(log.startTimestamp).format('DD/MM/YYYY')} />
      <View className="flex-row items-center justify-between bg-slate-500 p-4">
        <View className="flex-row items-center">
          <View
            className={clsx('mr-4 h-4 w-4 rounded-full', {
              'bg-yellow-500': log.intensity === 1,
              'bg-orange-500': log.intensity === 2,
              'bg-red-700': log.intensity === 3,
              'bg-gray-600': !log.endTimestamp,
            })}
          />
          <View className="flex-col">
            <View className="logs-center flex-row space-x-4">
              <Text className="font-bold text-white">
                {dayjs(log.startTimestamp).format('DD/MM/YYYY')}
              </Text>
              {log.endTimestamp && (
                <Text className="font-bold text-white">
                  {dayjs(log.endTimestamp).format('DD/MM/YYYY')}
                </Text>
              )}
            </View>
            <LabelValue label="Intensity" value={log.intensityName} />
            <LabelValue label="Side" value={log.side} />
            <LabelValue
              label="Pressure or Squeezing"
              value={log.pressureOrSqueezing}
            />
            <LabelValue
              label="Throbbing or Pulsating"
              value={log.throbbingOrPulsating}
            />
            <LabelValue label="Stabbing" value={log.stabbing} />
            <LabelValue label="Nausea or Vomiting" value={log.nauseaVomiting} />
            <LabelValue
              label="Light Sensitivity"
              value={log.lightSensitivity}
            />
            <LabelValue
              label="Noise Sensitivity"
              value={log.noiseSensitivity}
            />
            <LabelValue label="Sleep Rank" value={log.sleepRank} />
            <LabelValue
              label="Duration"
              value={dayjs
                .duration(log.durationInSeconds, 'seconds')
                .format('HH:mm:ss')}
            />
          </View>
        </View>
      </View>
      <View className="mt-10 gap-4 space-y-4 p-4">
        <Link href={`addFoodDrink/${log.id}`} asChild>
          <TouchableOpacity className="flex-row items-center justify-center bg-blue-800 p-4">
            <Text className="font-bold text-white">Add Food or Drink</Text>
          </TouchableOpacity>
        </Link>
        <Link href={`medications/${log.id}`} asChild>
          <TouchableOpacity className="flex-row items-center justify-center bg-blue-800 p-4">
            <Text className="font-bold text-white">Medications</Text>
          </TouchableOpacity>
        </Link>
        {!log.endTimestamp && (
          <TouchableOpacity
            onPress={() => mutate()}
            className="flex-row items-center justify-center bg-blue-800 p-4"
            disabled={isLoading}
          >
            <Text className="font-bold text-white">Mark as Ended</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
