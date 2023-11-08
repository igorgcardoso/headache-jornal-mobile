import { Header } from '@components/Header';
import { LabelValue } from '@components/LabelValue';
import { api } from '@src/lib/api';
import { HeadacheStats } from '@src/models';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { QUERY_KEYS } from '@src/utils/queryKeys';
import { QUERY_URLS } from '@src/utils/queryUrls';
import { AxiosError } from 'axios';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useQuery } from 'react-query';

export default function Stats() {
  const [stats, setStats] = useState<HeadacheStats>({} as HeadacheStats);

  const { isLoading, refetch } = useQuery(
    QUERY_KEYS.stats(),
    async () => {
      const response = await api.get(QUERY_URLS.stats.get());

      return response.data;
    },
    {
      onSuccess: (data) => {
        setStats(data);
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
    <View className="flex-1 justify-between bg-slate-800">
      <Header title="Stats" showAddButton href="/newLog" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 16,
          paddingLeft: 12,
        }}
      >
        <LabelValue label="Occurrences" value={stats.occurrences} />
        <LabelValue
          label="Most common Intensity"
          value={stats.mostCommonIntensity!}
        />
        <LabelValue
          label="Most common Side"
          value={stats.mostCommonSideName!}
        />
        <Text className="self-center py-3 text-xl font-bold text-white">
          Remedies
        </Text>
        <View className="w-full pl-4">
          {stats.meanRemedies?.length > 0 ? (
            stats.meanRemedies?.map((remedy) => (
              <LabelValue
                key={remedy.name}
                label={remedy.name}
                value={remedy.mean_quantity}
              />
            ))
          ) : (
            <Text className="self-center text-lg text-white">
              No remedies registered
            </Text>
          )}
        </View>
        {stats.mostCommonRemedyResult && (
          <LabelValue
            label="Most common remedy result"
            value={stats.mostCommonRemedyResult!}
          />
        )}
        <Text className="self-center py-3 text-xl font-bold text-white">
          Weather
        </Text>
        <LabelValue label="Mean temperature" value={stats.meanTemperature!} />
        <LabelValue
          label="Mean apparent temperature"
          value={stats.meanApparentTemperature!}
        />
        <LabelValue label="Mean UV Index" value={stats.meanUvIndex!} />
        <LabelValue
          label="Mean Shortwave Radiation"
          value={stats.meanShortwaveRadiation!}
        />
        <LabelValue
          label="Mean Min temperature"
          value={stats.meanMinTemperature!}
        />
        <LabelValue
          label="Mean Max temperature"
          value={stats.meanMaxTemperature!}
        />
        <LabelValue
          label="Mean apparent min temperature"
          value={stats.meanApparentMinTemperature!}
        />
        <LabelValue
          label="Mean apparent max temperature"
          value={stats.meanApparentMaxTemperature!}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={() => refetch()}
        disabled={isLoading}
        className="mb-2 w-full items-center justify-center bg-green-800 p-2"
      >
        {isLoading ? (
          <ActivityIndicator size={24} color="#FFF" />
        ) : (
          <Text className="text-lg font-bold text-white">Reload</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
