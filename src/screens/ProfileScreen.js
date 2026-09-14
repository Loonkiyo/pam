import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { THEME } from '../data/theme';
import { MOVIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function StatCard({ value, label, color }) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Achievement({ icon, title, description }) {
  return (
    <View style={styles.achievement}>
      <Text style={styles.achievementEmoji}>{icon}</Text>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDesc}>{description}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const favoriteMovies = useMemo(() => MOVIES.filter((m) => favorites.includes(m.id)), [favorites]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.brandHeader}>
        <Text style={styles.brand}>CINEMAX</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CM</Text>
        </View>
        <Text style={styles.name}>CineMax</Text>
        <Text style={styles.rank}>Nível 42 · Cinéfilo Lendário</Text>
        <View style={styles.xpTrack}>
          <View style={styles.xpFill} />
        </View>
        <Text style={styles.xpLabel}>7.200 / 10.000 XP</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard value={MOVIES.length} label="FILMES" color={THEME.accent} />
        <StatCard value={favoriteMovies.length} label="FAVORITOS" color={THEME.rose} />
        <StatCard value="324" label="HORAS" color={THEME.gold} />
        <StatCard value="127" label="NOTAS" color={THEME.blue} />
      </View>

      <Text style={styles.section}>CONQUISTAS</Text>
      <View style={styles.achievementsList}>
        <Achievement icon="🏆" title="Maratonista" description="50 filmes num mês" />
        <Achievement icon="⭐" title="Crítico de Ouro" description="500 notas máximas" />
        <Achievement icon="🎬" title="Cinéfilo Completo" description="Todos os vencedores do Oscar 2023" />
      </View>

      <Text style={styles.section}>FAVORITOS ATUAIS</Text>
      {favoriteMovies.length === 0 ? (
        <Text style={styles.emptyFavs}>Nenhum favorito ainda.</Text>
      ) : (
        favoriteMovies.map((m) => (
          <View key={m.id} style={styles.favRow}>
            <Image source={{ uri: m.image }} style={styles.favImage} resizeMode="cover" />
            <View style={styles.favInfo}>
              <Text style={styles.favTitle}>{m.title}</Text>
              <Text style={styles.favSub}>{m.category} · {m.duration}</Text>
            </View>
            <Text style={styles.favRating}>★ {m.rating}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

import { Image } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  content: { padding: 16, paddingBottom: 40 },

  brandHeader: { marginBottom: 16 },
  brand: { fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3 },

  profileCard: {
    backgroundColor: THEME.surface, borderRadius: 16, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: THEME.border,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: THEME.accentSoft, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: THEME.accent, marginBottom: 12,
  },
  avatarText: { color: THEME.accent, fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  name: { color: THEME.textPrimary, fontSize: 18, fontWeight: '700' },
  rank: { color: THEME.textTertiary, fontWeight: '500', fontSize: 12, marginTop: 4 },
  xpTrack: {
    width: '100%', height: 6, backgroundColor: THEME.surfaceAlt,
    borderRadius: 3, marginTop: 18, overflow: 'hidden',
  },
  xpFill: { height: '100%', width: '72%', backgroundColor: THEME.accent, borderRadius: 3 },
  xpLabel: { color: THEME.textTertiary, fontSize: 11, marginTop: 8, fontWeight: '500' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: THEME.surface,
    borderRadius: 12, paddingVertical: 18, alignItems: 'center',
    borderWidth: 1, borderColor: THEME.border,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { color: THEME.textTertiary, fontSize: 9, fontWeight: '700', marginTop: 6, letterSpacing: 1.2 },

  section: {
    color: THEME.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, marginTop: 24, marginBottom: 10,
  },

  achievementsList: { gap: 10 },
  achievement: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface,
    padding: 14, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, gap: 12,
  },
  achievementEmoji: { fontSize: 20 },
  achievementInfo: { flex: 1 },
  achievementTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 13 },
  achievementDesc: { color: THEME.textTertiary, fontSize: 11, marginTop: 2 },

  favRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface,
    padding: 12, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, marginBottom: 8, gap: 12,
  },
  favImage: { width: 40, height: 56, borderRadius: 6 },
  favInfo: { flex: 1 },
  favTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 13 },
  favSub: { color: THEME.textTertiary, fontSize: 11, marginTop: 2 },
  favRating: { color: THEME.gold, fontWeight: '700', fontSize: 12 },
  emptyFavs: { color: THEME.textTertiary, fontSize: 13 },
});
