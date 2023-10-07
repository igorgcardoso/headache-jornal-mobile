import Icon from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  showAddButton?: boolean;
  href?: string;
}

export function Header({ title, showAddButton = false, href }: HeaderProps) {
  return (
    <View className='bg-slate-400 flex-row justify-evenly items-center py-2 mt-2'>
      <View className="w-4 h-4" />
      <Text className='font-bold text-3xl text-white'>{title}</Text>
      {showAddButton ?
        <Link href={href!} asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="plus-circle" size={24} color="#FFF" />
          </TouchableOpacity>
        </Link>
        : <View className="w-4 h-4" />}
    </View>
  )
}
