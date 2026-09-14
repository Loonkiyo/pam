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

function PratoCard({ prato, onToggleFavorito, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardIcon}>{prato.icone}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNome} numberOfLines={1}>{prato.nome}</Text>
          <TouchableOpacity onPress={onToggleFavorito} hitSlop={8}>
            <Text style={styles.favIcon}>♥</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{prato.desc}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardCategoria}>{prato.categoria}</Text>
          <Text style={styles.cardPreco}>{prato.preco}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

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

  const renderCard = useCallback(({ item }) => (
    <View style={styles.cardSlot}>
      <PratoCard
        prato={item}
        onToggleFavorito={() => toggleFavorite(item.id)}
        onPress={() => handlePress(item)}
      />
    </View>
  ), [toggleFavorite, handlePress]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>BISTRÔ</Text>
            <Text style={styles.title}>Favoritos</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{pratosFavoritos.length}</Text>
          </View>
        </View>

        <FlatList
          data={pratosFavoritos}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
              <Text style={styles.emptySub}>Toque no coração nos pratos pra salvar aqui</Text>
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

  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  brand: { fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3 },
  title: { color: THEME.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 8 },
  countBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: THEME.roseSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { color: THEME.rose, fontSize: 13, fontWeight: '800' },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  cardSlot: { marginBottom: 12 },

  card: {
    flexDirection: 'row', backgroundColor: THEME.surface, borderRadius: 12,
    borderWidth: 1, borderColor: THEME.border, overflow: 'hidden',
  },
  cardIconWrap: {
    width: 80, backgroundColor: THEME.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  cardIcon: { fontSize: 32 },
  cardBody: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNome: { color: THEME.textPrimary, fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  favIcon: { fontSize: 16, color: THEME.rose },
  cardDesc: { color: THEME.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 6 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10,
  },
  cardCategoria: { color: THEME.accent, fontSize: 11, fontWeight: '700' },
  cardPreco: { color: THEME.gold, fontSize: 14, fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  emptySub: { color: THEME.textTertiary, marginTop: 4, fontSize: 13, textAlign: 'center', paddingHorizontal: 40 },
});
