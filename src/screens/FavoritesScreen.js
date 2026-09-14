import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { PRATOS } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();

  const pratosFavoritos = useMemo(
    () => PRATOS.filter((p) => favorites.includes(p.id)),
    [favorites]
  );

  const handlePress = useCallback((prato) => {
    navigation.navigate('MovieDetail', { movieId: prato.id });
  }, [navigation]);

  const total = pratosFavoritos.reduce((acc, p) => {
    const num = parseFloat(p.preco.replace('R$ ', '').replace(',', '.'));
    return acc + num;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.brand}>BISTRÔ</Text>
          <Text style={styles.title}>Meus Favoritos</Text>
          <Text style={styles.sub}>{pratosFavoritos.length} pratos salvos</Text>
        </View>

        {pratosFavoritos.length > 0 && (
          <View style={styles.totalBar}>
            <Text style={styles.totalLabel}>Total estimado</Text>
            <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
          </View>
        )}

        <FlatList
          data={pratosFavoritos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.8}
              onPress={() => handlePress(item)}
            >
              <View style={styles.gridTop}>
                <Text style={styles.gridIcon}>{item.icone}</Text>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => toggleFavorite(item.id)}
                  hitSlop={8}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.gridNome} numberOfLines={1}>{item.nome}</Text>
              <View style={styles.gridBottom}>
                <Text style={styles.gridCategoria}>{item.categoria}</Text>
                <Text style={styles.gridPreco}>{item.preco}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>Nenhum favorito</Text>
              <Text style={styles.emptySub}>Toque no ♡ nos pratos pra salvar aqui</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  screen: { flex: 1, width: '100%', maxWidth: 1120, alignSelf: 'center' },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  brand: { fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3 },
  title: { color: THEME.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 8 },
  sub: { color: THEME.textTertiary, fontSize: 12, marginTop: 4 },

  totalBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: THEME.surfaceAlt, marginHorizontal: 16, marginTop: 12,
    borderRadius: 10, padding: 14, borderWidth: 1, borderColor: THEME.border,
  },
  totalLabel: { color: THEME.textSecondary, fontSize: 12, fontWeight: '600' },
  totalValor: { color: THEME.gold, fontSize: 18, fontWeight: '800' },

  grid: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 32 },
  row: { gap: 12 },

  gridCard: {
    flex: 1, backgroundColor: THEME.surface, borderRadius: 12,
    borderWidth: 1, borderColor: THEME.border, padding: 14, marginBottom: 12,
    minWidth: '45%',
  },
  gridTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  gridIcon: { fontSize: 36 },
  removeBtn: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: THEME.roseSoft, alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { color: THEME.rose, fontSize: 10, fontWeight: '800' },
  gridNome: {
    color: THEME.textPrimary, fontSize: 13, fontWeight: '700',
    marginTop: 10, marginBottom: 8,
  },
  gridBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  gridCategoria: { color: THEME.textTertiary, fontSize: 10, fontWeight: '600' },
  gridPreco: { color: THEME.gold, fontSize: 13, fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 16 },
  emptySub: { color: THEME.textTertiary, marginTop: 6, fontSize: 13, textAlign: 'center' },
});
