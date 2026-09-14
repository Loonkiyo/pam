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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroImageWrap}>
          <Image source={{ uri: movie.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {movie.rating}</Text>
            </View>
            <Text style={styles.heroTitle}>{movie.title}</Text>
            <Text style={styles.heroMeta}>{movie.director} · {movie.year} · {movie.duration}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.categoryPill}>
            <View style={[styles.catDot, { backgroundColor: movie.color }]} />
            <Text style={[styles.catText, { color: movie.color }]}>{movie.category}</Text>
          </View>

          <Text style={styles.sectionLabel}>SINOPSE</Text>
          <Text style={styles.description}>{movie.desc}</Text>

          <Text style={styles.sectionLabel}>DETALHES</Text>
          <View style={styles.stats}>
            <StatBox value={movie.duration} label="DURAÇÃO" />
            <StatBox value={`${movie.rating}/5`} label="AVALIAÇÃO" />
            <StatBox value={movie.year} label="ANO" />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={() => {}}>
              <Text style={styles.primaryBtnText}>▶ ASSISTIR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryBtn, isFavorite && styles.secondaryBtnActive]}
              activeOpacity={0.8}
              onPress={() => toggleFavorite(movie.id)}
            >
              <Text style={[styles.secondaryBtnText, isFavorite && styles.secondaryBtnTextActive]}>
                {isFavorite ? '♥ FAVORITADO' : '♡ FAVORITAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  errorContainer: { flex: 1, backgroundColor: THEME.bg, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: THEME.textPrimary, fontSize: 16, fontWeight: '600' },
  backLink: { color: THEME.accent, marginTop: 12, fontSize: 14, fontWeight: '600' },

  heroImageWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: THEME.surfaceAlt },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,14,26,0.5)' },
  closeBtn: {
    position: 'absolute', top: 48, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  closeText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  heroBottom: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8,
  },
  ratingText: { color: THEME.gold, fontWeight: '700', fontSize: 12 },
  heroTitle: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  heroMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  body: { padding: 16 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: THEME.border,
    backgroundColor: THEME.surfaceAlt,
  },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  catText: { fontSize: 11, fontWeight: '700' },

  sectionLabel: {
    color: THEME.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, marginTop: 20, marginBottom: 8,
  },
  description: { color: THEME.textSecondary, fontSize: 13, lineHeight: 20 },
  stats: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1, backgroundColor: THEME.surface, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: THEME.border,
  },
  statValue: { color: THEME.textPrimary, fontSize: 14, fontWeight: '800' },
  statLabel: { color: THEME.textTertiary, fontSize: 9, fontWeight: '700', marginTop: 4, letterSpacing: 1.2 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  primaryBtn: {
    flex: 1, backgroundColor: THEME.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  primaryBtnText: { color: THEME.bg, fontWeight: '800', fontSize: 13 },
  secondaryBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    backgroundColor: THEME.surfaceAlt, borderWidth: 1, borderColor: THEME.border, alignItems: 'center',
  },
  secondaryBtnActive: { backgroundColor: THEME.roseSoft, borderColor: THEME.rose },
  secondaryBtnText: { color: THEME.textSecondary, fontWeight: '700', fontSize: 12 },
  secondaryBtnTextActive: { color: THEME.rose },
});
