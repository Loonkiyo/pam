import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { MOVIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;
  const { width } = useWindowDimensions();

  const movie = useMemo(() => MOVIES.find((m) => m.id === movieId), [movieId]);

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFavorite = favorites.includes(movie.id);
  const cardWidth = Math.min(width - 32, 500);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { width: cardWidth }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.imageWrap}>
            <Image source={{ uri: movie.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.imageOverlay} />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {movie.rating}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.header}>
              <View style={styles.headingGroup}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.meta}>{movie.director} · {movie.year}</Text>
              </View>
              <View style={[styles.categoryPill, { borderColor: movie.color }]}>
                <View style={[styles.catDot, { backgroundColor: movie.color }]} />
                <Text style={[styles.catText, { color: movie.color }]}>{movie.category}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>SINOPSE</Text>
            <Text style={styles.description}>{movie.desc}</Text>

            <Text style={styles.sectionLabel}>DETALHES</Text>
            <View style={styles.stats}>
              <StatBox value={movie.duration} label="DURAÇÃO" />
              <StatBox value={`${movie.rating}/5`} label="AVALIAÇÃO" />
              <StatBox value={movie.year} label="LANÇAMENTO" />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={() => {}}>
                <Text style={styles.primaryBtnText}>ASSISTIR AGORA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, isFavorite && styles.secondaryBtnActive]}
                activeOpacity={0.8}
                onPress={() => toggleFavorite(movie.id)}
              >
                <Text style={styles.secondaryBtnText}>
                  {isFavorite ? 'FAVORITADO' : 'FAVORITAR'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 },
  errorContainer: { flex: 1, backgroundColor: THEME.bg, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: THEME.textPrimary, fontSize: 16, fontWeight: '600' },
  backLink: { color: THEME.accent, marginTop: 12, fontSize: 14, fontWeight: '600' },

  card: {
    backgroundColor: THEME.surface, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1.5, borderColor: THEME.border,
    shadowColor: THEME.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
  },
  closeBtn: {
    position: 'absolute', top: 12, right: 12, zIndex: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  closeText: { color: THEME.textPrimary, fontSize: 14, fontWeight: '700' },

  imageWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: THEME.surfaceAlt },
  image: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(124,58,237,0.05)' },
  ratingBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(30,27,75,0.85)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  ratingText: { color: '#FBBF24', fontWeight: '700', fontSize: 12 },

  cardBody: { padding: 18 },
  header: { flexDirection: 'row', alignItems: 'center' },
  headingGroup: { flex: 1, marginRight: 12 },
  title: { color: THEME.textPrimary, fontSize: 18, fontWeight: '800' },
  meta: { color: THEME.textTertiary, fontSize: 12, marginTop: 3, fontWeight: '500' },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5,
  },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  catText: { fontSize: 11, fontWeight: '700' },

  sectionLabel: {
    color: THEME.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, marginTop: 18, marginBottom: 8,
  },
  description: { color: THEME.textSecondary, fontSize: 13, lineHeight: 20 },
  stats: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1, backgroundColor: THEME.bg, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: THEME.border,
  },
  statValue: { color: THEME.textPrimary, fontSize: 14, fontWeight: '800' },
  statLabel: { color: THEME.textTertiary, fontSize: 9, fontWeight: '700', marginTop: 4, letterSpacing: 1.2 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  primaryBtn: {
    flex: 1, backgroundColor: THEME.accent, paddingVertical: 13, borderRadius: 12, alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 1.5 },
  secondaryBtn: {
    paddingHorizontal: 18, paddingVertical: 13, borderRadius: 12,
    backgroundColor: THEME.surfaceAlt, borderWidth: 1.5, borderColor: THEME.border, alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnActive: { backgroundColor: THEME.roseSoft, borderColor: THEME.rose },
  secondaryBtnText: { color: THEME.textPrimary, fontWeight: '700', fontSize: 11, letterSpacing: 1.2 },
});
