import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { MOVIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function MovieCard({ movie, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: movie.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardImageOverlay} />
        <TouchableOpacity style={styles.favBtn} onPress={onToggleFavorite} hitSlop={8}>
          <Text style={styles.favIcon}>♥</Text>
        </TouchableOpacity>
        <View style={styles.cardRatingBadge}>
          <Text style={styles.cardRatingText}>★ {movie.rating}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{movie.title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardCat}>{movie.category}</Text>
          <Text style={styles.cardDot}>•</Text>
          <Text style={styles.cardYear}>{movie.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const columns = width >= 1280 ? 3 : width >= 820 ? 2 : 1;

  const favoriteMovies = useMemo(
    () => MOVIES.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

  const handlePress = useCallback((movie) => {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  }, [navigation]);

  const renderCard = useCallback(({ item }) => (
    <View style={styles.cardSlot}>
      <MovieCard
        movie={item}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => handlePress(item)}
      />
    </View>
  ), [toggleFavorite, handlePress]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>CINEMAX</Text>
            <Text style={styles.title}>Meus Favoritos</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favoriteMovies.length}</Text>
          </View>
        </View>

        <FlatList
          key={`grid-${columns}`}
          data={favoriteMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={columns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💜</Text>
              <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
              <Text style={styles.emptySub}>Toque no coração nos filmes pra salvar aqui</Text>
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

  listContent: { paddingHorizontal: 8, paddingBottom: 32 },
  cardSlot: { flex: 1, marginHorizontal: 8, marginBottom: 16 },

  card: {
    backgroundColor: THEME.surface, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: THEME.border,
  },
  cardImageWrap: { aspectRatio: 16 / 9, backgroundColor: THEME.surfaceAlt },
  cardImage: { width: '100%', height: '100%' },
  cardImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  favIcon: { fontSize: 14, color: THEME.rose },
  cardRatingBadge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  cardRatingText: { color: THEME.gold, fontWeight: '700', fontSize: 11 },
  cardBody: { padding: 12 },
  cardTitle: { color: THEME.textPrimary, fontSize: 13, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  cardCat: { color: THEME.accent, fontSize: 10, fontWeight: '700' },
  cardDot: { color: THEME.textTertiary, fontSize: 8 },
  cardYear: { color: THEME.textSecondary, fontSize: 10, fontWeight: '500' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  emptySub: { color: THEME.textTertiary, marginTop: 4, fontSize: 13, textAlign: 'center', paddingHorizontal: 40 },
});
