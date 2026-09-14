import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { THEME } from './src/data/theme';
import { FavoritesProvider, useFavorites } from './src/context/FavoritesContext';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    'Inicio': focused ? '🎬' : '🎥',
    'Favoritos': focused ? '💜' : '🤍',
    'Perfil': focused ? '👤' : '👤',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || '•'}
    </Text>
  );
}

function TabNavigator() {
  const { favorites } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: THEME.accent,
        tabBarInactiveTintColor: '#A78BFA',
        tabBarStyle: {
          backgroundColor: THEME.surface,
          borderTopColor: THEME.border,
          borderTopWidth: 1.5,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: { backgroundColor: THEME.rose, color: '#FFF', fontSize: 10, fontWeight: '700' },
        }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState(['1', '3']);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }, []);

  return (
    <SafeAreaProvider>
      <FavoritesProvider value={{ favorites, toggleFavorite }}>
        <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: THEME.accent,
              background: THEME.bg,
              card: THEME.surface,
              text: THEME.textPrimary,
              border: THEME.border,
              notification: THEME.accent,
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '700' },
              heavy: { fontFamily: 'System', fontWeight: '800' },
            },
          }}
        >
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
