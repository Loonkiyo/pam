import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

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
    'Inicio': focused ? '▶' : '▷',
    'Favoritos': focused ? '♥' : '♡',
    'Perfil': focused ? '●' : '○',
  };
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>
        {icons[label] || '•'}
      </Text>
    </View>
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
        tabBarInactiveTintColor: THEME.textTertiary,
        tabBarStyle: tabStyles.bar,
        tabBarLabelStyle: tabStyles.label,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: tabStyles.badge,
        }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: THEME.surface,
    borderTopColor: THEME.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 0,
  },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  iconWrap: {
    width: 36, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: THEME.accentSoft },
  icon: { fontSize: 16, color: THEME.textTertiary },
  iconActive: { color: THEME.accent },
  badge: { backgroundColor: THEME.rose, color: '#FFF', fontSize: 9, fontWeight: '700' },
});

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
            dark: true,
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
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
