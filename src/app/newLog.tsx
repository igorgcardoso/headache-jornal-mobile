import { Header } from '@components/Header';
import Icon from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { api } from '@src/lib/api';
import { getErrorMessage } from '@src/utils/getErrorMessage';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Text as RNText,
  ScrollView,
  Switch,
  TextInput,
  TextProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useMutation } from 'react-query';
import { z } from 'zod';

function Group({ children }: { children: ReactNode }) {
  return (
    <View className="flex flex-row items-center justify-between px-4 py-2">
      {children}
    </View>
  );
}

function Text({ children, className, ...rest }: TextProps) {
  return (
    <RNText
      className={clsx('font-semibold leading-relaxed text-white', className)}
      {...rest}
    >
      {children}
    </RNText>
  );
}

interface HeadacheData {
  startDate: Date;
  startTime: Date;
  endDate: Date | null;
  endTime: Date | null;
  intensity: 1 | 2 | 3;
  side: 'left' | 'right' | 'both';
  pressureOrSqueezing: boolean;
  throbbingOrPulsating: boolean;
  stabbing: boolean;
  nauseaVomiting: boolean;
  lightSensitivity: boolean;
  noiseSensitivity: boolean;
  sleepRank: number;
}

const HeadacheSchema = z.object({
  startDate: z.date().default(() => new Date()),
  startTime: z.date().default(() => new Date()),
  endDate: z.date().nullable().default(null),
  endTime: z.date().nullable().default(null),
  intensity: z.number().min(1).max(3).default(1),
  side: z.enum(['left', 'right', 'both']),
  pressureOrSqueezing: z.boolean(),
  throbbingOrPulsating: z.boolean(),
  stabbing: z.boolean(),
  nauseaVomiting: z.boolean(),
  lightSensitivity: z.boolean(),
  noiseSensitivity: z.boolean(),
  sleepRank: z.number().min(0).max(100),
});

export default function NewLog() {
  const [token, setToken] = useState<string | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<HeadacheData>({
    resolver: zodResolver(HeadacheSchema),
  });

  const router = useRouter();

  function onDateChange(value: Date | null, onChange: (date: Date) => void) {
    DateTimePickerAndroid.open({
      mode: 'date',
      value: value ?? new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed') {
          return;
        }
        if (selectedDate) {
          onChange(selectedDate);
        }
      },
      maximumDate: new Date(),
    });
  }

  function onTimeChange(value: Date | null, onChange: (date: Date) => void) {
    DateTimePickerAndroid.open({
      mode: 'time',
      value: value ?? new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed') {
          return;
        }
        if (selectedDate) {
          onChange(selectedDate);
        }
      },
      is24Hour: true,
    });
  }

  const { mutate, isLoading } = useMutation(
    async (data: HeadacheData) => {
      const { startDate, startTime, endDate, endTime, ...rest } = data;
      const start = dayjs(startDate)
        .add(dayjs(startTime).hour(), 'hour')
        .add(dayjs(startTime).minute(), 'minute');
      const end = endDate
        ? dayjs(endDate)
          .add(dayjs(endTime).hour(), 'hour')
          .add(dayjs(endTime).minute(), 'minute')
        : null;
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const location = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      const payload = {
        ...rest,
        startTimestamp: start,
        endTimestamp: end,
      };

      const response = await api.post('/headaches', payload, {
        params: location,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Headache logged',
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

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();

    (async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setToken(token);
      } else {
        router.push('signIn');
      }
    })();

    setValue('startDate', new Date());
    setValue('startTime', new Date());
    setValue('endDate', null);
    setValue('endTime', null);
    setValue('intensity', 1);
    setValue('pressureOrSqueezing', false);
    setValue('throbbingOrPulsating', false);
    setValue('stabbing', false);
    setValue('nauseaVomiting', false);
    setValue('lightSensitivity', false);
    setValue('noiseSensitivity', false);
    setValue('sleepRank', 0);
  }, [setValue, router]);

  return (
    <View className="flex-1 bg-slate-800">
      <Header title="New Log" />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 64,
          paddingTop: 32,
          paddingHorizontal: 16,
        }}
      >
        <Controller
          control={control}
          name="startDate"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text>Start Date</Text>
              <Group>
                <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
                <TouchableOpacity onPress={() => onDateChange(value, onChange)}>
                  <Icon name="calendar" size={24} color="#FFF" />
                </TouchableOpacity>
              </Group>
              <Text className="text-sm text-red-500">
                {errors.startDate?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="startTime"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text>Start Time</Text>
              <Group>
                <Text>{dayjs(value).format('HH:mm:ss')}</Text>
                <TouchableOpacity onPress={() => onTimeChange(value, onChange)}>
                  <Icon name="clock" size={24} color="#FFF" />
                </TouchableOpacity>
              </Group>
              <Text className="text-sm text-red-500">
                {errors.startTime?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text>End Date</Text>
              <Group>
                {value ? (
                  <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
                ) : (
                  <View className="w-4/5" />
                )}
                <TouchableOpacity onPress={() => onDateChange(value, onChange)}>
                  <Icon name="calendar" size={24} color="#FFF" />
                </TouchableOpacity>
              </Group>
              <Text className="text-sm text-red-500">
                {errors.endDate?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="endTime"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text>End Time</Text>
              <Group>
                {value ? (
                  <Text>{dayjs(value).format('HH:mm:ss')}</Text>
                ) : (
                  <View className="w-4/5" />
                )}
                <TouchableOpacity onPress={() => onTimeChange(value, onChange)}>
                  <Icon name="clock" size={24} color="#FFF" />
                </TouchableOpacity>
              </Group>
              <Text className="text-sm text-red-500">
                {errors.endTime?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="intensity"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Intensity</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="bg-slate-700 p-1"
                    onPress={() => {
                      if (value - 1 < 1) onChange(3);
                      else onChange(value - 1);
                    }}
                  >
                    <Icon name="minus" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <Text className="p-1">{value}</Text>
                  <TouchableOpacity
                    className="bg-slate-700 p-1"
                    onPress={() => {
                      if (value + 1 > 3) onChange(1);
                      else onChange(value + 1);
                    }}
                  >
                    <Icon name="plus" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </Group>
              <Text className="text-xs text-slate-400">
                1 - Weak (does not interfere with activities) {'\n'}2 - Moderate
                (interferes but does not prevent activities) {'\n'}3 - Strong
                (prevents activities)
              </Text>
              <Text className="text-sm text-red-500">
                {errors.intensity?.message}
              </Text>
            </View>
          )}
        />
        <View>
          <Text className="text-xl">Side</Text>
          <Controller
            control={control}
            name="side"
            render={({ field: { value, onChange } }) => (
              <View>
                <Group>
                  <TouchableOpacity
                    className={clsx(
                      'w-1/3 items-center justify-center rounded px-4 py-2',
                      {
                        'bg-slate-500': value === 'left',
                      },
                    )}
                    onPress={() => onChange('left')}
                  >
                    <Text>Left</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={clsx(
                      'w-1/3 items-center justify-center rounded px-4 py-2',
                      {
                        'bg-slate-500': value === 'both',
                      },
                    )}
                    onPress={() => onChange('both')}
                  >
                    <Text>Both</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={clsx(
                      'w-1/3 items-center justify-center rounded px-4 py-2',
                      {
                        'bg-slate-500': value === 'right',
                      },
                    )}
                    onPress={() => onChange('right')}
                  >
                    <Text>Right</Text>
                  </TouchableOpacity>
                </Group>
                <Text className="text-sm text-red-500">
                  {errors.side?.message}
                </Text>
              </View>
            )}
          />
        </View>
        <Controller
          control={control}
          name="pressureOrSqueezing"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Pressure or squeezing</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.pressureOrSqueezing?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="throbbingOrPulsating"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Throbbing or pulsating</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.throbbingOrPulsating?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="stabbing"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Stabbing</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.stabbing?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="nauseaVomiting"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Nausea or vomiting</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.nauseaVomiting?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="lightSensitivity"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Light sensitivity</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.lightSensitivity?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="noiseSensitivity"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Noise sensitivity</Text>
                <Switch value={value} onChange={() => onChange(!value)} />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.noiseSensitivity?.message}
              </Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="sleepRank"
          render={({ field: { value, onChange } }) => (
            <View>
              <Group>
                <Text>Sleep Rank</Text>
                <TextInput
                  className="w-1/4 rounded bg-slate-400 text-center text-white"
                  keyboardType="decimal-pad"
                  value={value ? value.toString() : ''}
                  onChangeText={(text) =>
                    onChange(Number(text.replace(/'^\D'/, '')))
                  }
                />
              </Group>
              <Text className="text-sm text-red-500">
                {errors.sleepRank?.message}
              </Text>
            </View>
          )}
        />
      </ScrollView>
      <TouchableOpacity
        disabled={isLoading}
        className="w-full items-center justify-center bg-green-800 p-4"
        onPress={handleSubmit((data) => mutate(data))}
      >
        {isLoading ? (
          <ActivityIndicator color="blue" size={24} />
        ) : (
          <View className="w-full flex-row items-center justify-center gap-4">
            <Icon name="save" size={24} color="#FFF" />
            <Text className="text-xl font-bold uppercase text-white">Save</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
