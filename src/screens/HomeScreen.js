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
          <View style={[styles.dot, { backgroundColor: movie.color }]} />
          <Text style={styles.cardCat}>{movie.category}</Text>
          <Text style={styles.cardSep}>·</Text>
          <Text style={styles.cardYear}>{movie.year}</Text>
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
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Descubra</Text>
          <Text style={styles.greetingSub}>O que assistir hoje?</Text>
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
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
            {activeCat === 'Todos' ? 'TODOS' : activeCat.toUpperCase()}
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
  screen: { flex: 1, width: '100%', maxWidth: THEME.bg ? 1120 : 1120, alignSelf: 'center' },

  greeting: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  greetingText: { color: THEME.textPrimary, fontSize: 26, fontWeight: '800' },
  greetingSub: { color: THEME.textTertiary, fontSize: 14, fontWeight: '500', marginTop: 2 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: THEME.border,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: THEME.textPrimary, fontSize: 14 },
  clearBtn: { color: THEME.textTertiary, fontSize: 14, paddingLeft: 10 },

  chipScroll: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: THEME.surface,
    borderWidth: 1.5,
    borderColor: THEME.border,
  },
  chipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  chipText: { color: THEME.textSecondary, fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#FFFFFF' },

  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  infoCount: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  infoLabel: { color: THEME.textTertiary, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },

  listContent: { paddingHorizontal: 8, paddingBottom: 32 },
  cardSlot: { flex: 1, marginHorizontal: 8, marginBottom: 16 },

  card: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: THEME.border,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrap: { aspectRatio: 16 / 9, backgroundColor: THEME.surfaceAlt },
  cardImage: { width: '100%', height: '100%' },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  favIcon: { fontSize: 16, color: '#CBD5E1' },
  favIconActive: { color: THEME.rose },
  cardRatingBadge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(30,27,75,0.82)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  cardRatingText: { color: '#FBBF24', fontWeight: '700', fontSize: 11 },

  cardBody: { padding: 12 },
  cardTitle: { color: THEME.textPrimary, fontSize: 14, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  cardCat: { color: THEME.textTertiary, fontSize: 11, fontWeight: '600' },
  cardSep: { color: THEME.border, fontSize: 11 },
  cardYear: { color: THEME.textTertiary, fontSize: 11, fontWeight: '500' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  emptySub: { color: THEME.textTertiary, marginTop: 4, fontSize: 13 },
});
