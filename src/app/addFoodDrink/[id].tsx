import { Header } from '@components/Header';
import { api } from '@src/lib/api';
import { Drink, Food } from '@src/models';
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
import { useMutation, useQuery } from 'react-query';

export default function AddFoodDrink() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);

  const { id } = useLocalSearchParams() as { id: string };

  const router = useRouter();

  const { isLoading } = useQuery(
    [...QUERY_KEYS.foods.list(), ...QUERY_KEYS.drinks.list()],
    async () => {
      const foodsResponse = await api.get(QUERY_URLS.foods.list());
      const drinksResponse = await api.get(QUERY_URLS.drinks.list());
      const headacheResponse = await api.get(QUERY_URLS.headaches.detail(id));

      return {
        foods: foodsResponse.data,
        drinks: drinksResponse.data,
        headache: headacheResponse.data,
      };
    },
    {
      onSuccess: (data) => {
        setFoods(
          data.foods.filter(
            (food: Food) =>
              !data.headache.foods.map((f: Food) => f.id).includes(food.id),
          ),
        );
        setDrinks(
          data.drinks.filter(
            (drink: Drink) =>
              !data.headache.drinks.map((d: Drink) => d.id).includes(drink.id),
          ),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'You have successfully loaded the foods and drinks.',
        });
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

  function handleSelectFood(id: string) {
    if (selectedFoods.includes(id)) {
      setSelectedFoods(selectedFoods.filter((foodId) => foodId !== id));
    } else {
      setSelectedFoods([...selectedFoods, id]);
    }
  }

  function handleSelectDrink(id: string) {
    if (selectedDrinks.includes(id)) {
      setSelectedDrinks(selectedDrinks.filter((drinkId) => drinkId !== id));
    } else {
      setSelectedDrinks([...selectedDrinks, id]);
    }
  }

  const { mutate } = useMutation(
    async () => {
      const response = await api.patch(`/headaches/${id}/foods-and-drinks`, {
        foods: selectedFoods,
        drinks: selectedDrinks,
      });

      return response.data;
    },
    {
      onSuccess: () => {
        setSelectedFoods([]);
        setSelectedDrinks([]);

        router.back();
      },
    },
  );

  return (
    <View className="flex-1 bg-slate-800">
      <Header title="Add Food/Drink" />
      <View className="flex-1 items-center justify-evenly p-4">
        <View className="w-full flex-1 gap-4 space-y-4">
          <Text className="text-xl font-bold text-white">Foods</Text>
          <FlatList
            data={foods}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectFood(item.id)}
                className={clsx(
                  'w-full flex-row items-center justify-center bg-slate-500 p-4',
                  {
                    'bg-blue-500': selectedFoods.includes(item.id),
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
        <View className="w-full flex-1 gap-4 space-y-4">
          <Text className="text-xl font-bold text-white">Drinks</Text>
          <FlatList
            data={drinks}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectDrink(item.id)}
                className={clsx(
                  'w-full flex-row items-center justify-center bg-slate-500 p-4',
                  {
                    'bg-blue-500': selectedDrinks.includes(item.id),
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
      <TouchableOpacity
        className="mb-10 flex-row items-center justify-center bg-green-800 p-4"
        onPress={() => mutate()}
      >
        <Text className="font-bold text-white">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
