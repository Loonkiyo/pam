import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { MOVIES, CATEGORIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function MovieCard({ movie, isFavorite, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: movie.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardImageOverlay} />
        <TouchableOpacity style={styles.favBtn} onPress={onToggleFavorite} hitSlop={8}>
          <Text style={[styles.favIcon, isFavorite && styles.favIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
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
          <Text style={styles.cardDot}>•</Text>
          <Text style={styles.cardDuration}>{movie.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const columns = width >= 1280 ? 3 : width >= 820 ? 2 : 1;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const c = activeCat.trim().toLowerCase();
    return MOVIES.filter((m) => {
      const okSearch = !q || m.title.toLowerCase().includes(q);
      const okCat = c === 'todos' || m.category.trim().toLowerCase() === c;
      return okSearch && okCat;
    });
  }, [search, activeCat]);

  const handlePress = useCallback((movie) => {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  }, [navigation]);

  const renderCard = useCallback(({ item }) => (
    <View style={styles.cardSlot}>
      <MovieCard
        movie={item}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => handlePress(item)}
      />
    </View>
  ), [favorites, toggleFavorite, handlePress]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>CINEMAX</Text>
            <Text style={styles.greeting}>O que assistir agora?</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Buscar filme..."
            placeholderTextColor={THEME.textTertiary}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCat(cat)}
              style={[styles.chip, activeCat === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeCat === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoBar}>
          <Text style={styles.infoCount}>{filtered.length} filmes</Text>
          <Text style={styles.infoLabel}>
            {activeCat === 'Todos' ? 'CATALOGO' : activeCat.toUpperCase()}
          </Text>
        </View>

        <FlatList
          key={`grid-${columns}`}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={columns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🎬</Text>
              <Text style={styles.emptyTitle}>Nenhum filme encontrado</Text>
              <Text style={styles.emptySub}>Tente outro gênero ou busca</Text>
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4,
  },
  brand: {
    fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3,
  },
  greeting: { color: THEME.textSecondary, fontSize: 15, fontWeight: '500', marginTop: 8 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: THEME.surfaceAlt, marginHorizontal: 16, marginTop: 14,
    borderRadius: 10, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: THEME.border,
  },
  searchInput: { flex: 1, color: THEME.textPrimary, fontSize: 14 },
  clearBtn: { color: THEME.textTertiary, fontSize: 14, paddingLeft: 10 },

  chipScroll: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: THEME.surfaceAlt, borderWidth: 1, borderColor: THEME.border,
  },
  chipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  chipText: { color: THEME.textSecondary, fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: THEME.bg },

  infoBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    paddingHorizontal: 20, marginBottom: 10,
  },
  infoCount: { color: THEME.textPrimary, fontWeight: '700', fontSize: 14 },
  infoLabel: { color: THEME.textTertiary, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },

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
  favIcon: { fontSize: 14, color: '#FFF' },
  favIconActive: { color: THEME.rose },
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
  cardDuration: { color: THEME.textTertiary, fontSize: 10 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  emptySub: { color: THEME.textTertiary, marginTop: 4, fontSize: 13 },
});
