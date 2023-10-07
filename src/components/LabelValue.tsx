import Icon from '@expo/vector-icons/Ionicons';
import { Text, View } from "react-native";

interface LabelValueProps {
  label: string;
  value: string | number | boolean;
}

const iconSize = 24;
const iconColor = '#FFF';

export function LabelValue({ label, value }: LabelValueProps) {
  return (
    <View className='flex-row items-center space-x-4'>
      <Text className='text-white text-lg font-semibold'>{label}:</Text>
      {
        typeof value === 'boolean' ?
          value ? <Icon name="checkmark" color={iconColor} size={iconSize} /> :
            <Icon name="close" color={iconColor} size={iconSize} /> :
          <Text className='text-white text-base'>{value}</Text>
      }
    </View>
  )
}
