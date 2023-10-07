import Icon from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function StatsLayout() {
  return (
    <View className="flex-1 bg-slate-800">
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarInactiveBackgroundColor: '#e2e8f0',
          tabBarActiveBackgroundColor: '#cbd5e1',
          tabBarActiveTintColor: '#0891b2',
          tabBarInactiveTintColor: '#164e63',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? 'analytics' : 'analytics-outline'}
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'stats',
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? 'file-tray-full' : 'file-tray-full-outline'}
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'logs',
          }}
        />
        <Tabs.Screen
          name="misc"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={
                  focused
                    ? 'ellipsis-horizontal'
                    : 'ellipsis-horizontal-outline'
                }
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'misc',
          }}
        />
      </Tabs>
    </View>
  );
}
