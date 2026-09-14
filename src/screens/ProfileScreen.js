import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { THEME } from '../data/theme';
import { PRATOS } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function StatCard({ valor, label, cor }) {
  return (
    <View style={[styles.statCard, { borderColor: cor + '30' }]}>
      <Text style={[styles.statValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const favoritos = useMemo(() => PRATOS.filter((p) => favorites.includes(p.id)), [favorites]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.brandHeader}>
        <Text style={styles.brand}>BISTRÔ</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>🍽️</Text>
        </View>
        <Text style={styles.nome}>Bistrô Gourmet</Text>
        <Text style={styles.rank}>Desde 2020 · Cozinha Brasileira Autoral</Text>
        <View style={styles.xpTrack}>
          <View style={styles.xpFill} />
        </View>
        <Text style={styles.xpLabel}>Nível 4.8 ★ · 1.247 avaliações</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard valor={PRATOS.length} label="PRATOS" cor={THEME.accent} />
        <StatCard valor={favoritos.length} label="FAVORITOS" cor={THEME.rose} />
        <StatCard valor="324" label="PEDIDOS" cor={THEME.gold} />
        <StatCard valor="4.8" label="NOTA" cor={THEME.blue} />
      </View>

      <Text style={styles.section}>DESTAQUES</Text>
      <View style={styles.achievementsList}>
        {[
          { icon: '🏆', title: 'Melhor Carnes', description: 'Top 1 na região' },
          { icon: '⭐', title: 'Chef Estrela', description: '3 estrelas Michelin' },
          { icon: '🔥', title: 'Mais Pedidos', description: 'Picanha na Brasa' },
        ].map((item, i) => (
          <View key={i} style={styles.achievement}>
            <Text style={styles.achievementEmoji}>{item.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{item.title}</Text>
              <Text style={styles.achievementDesc}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.section}>PRATOS FAVORITOS DOS CLIENTES</Text>
      {favoritos.length === 0 ? (
        <Text style={styles.emptyFavs}>Nenhum favorito ainda.</Text>
      ) : (
        favoritos.map((p) => (
          <View key={p.id} style={styles.favRow}>
            <View style={styles.favIconWrap}>
              <Text style={styles.favIcon}>{p.icone}</Text>
            </View>
            <View style={styles.favInfo}>
              <Text style={styles.favNome}>{p.nome}</Text>
              <Text style={styles.favSub}>{p.categoria} · {p.tempo}</Text>
            </View>
            <Text style={styles.favPreco}>{p.preco}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

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
  avatarIcon: { fontSize: 28 },
  nome: { color: THEME.textPrimary, fontSize: 18, fontWeight: '700' },
  rank: { color: THEME.textTertiary, fontWeight: '500', fontSize: 12, marginTop: 4, textAlign: 'center' },
  xpTrack: {
    width: '100%', height: 6, backgroundColor: THEME.surfaceAlt,
    borderRadius: 3, marginTop: 18, overflow: 'hidden',
  },
  xpFill: { height: '100%', width: '80%', backgroundColor: THEME.accent, borderRadius: 3 },
  xpLabel: { color: THEME.textTertiary, fontSize: 11, marginTop: 8, fontWeight: '500' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  statCard: {
    flex: 1, minWidth: '44%', backgroundColor: THEME.surface,
    borderRadius: 12, paddingVertical: 18, alignItems: 'center',
    borderWidth: 1, borderColor: THEME.border,
  },
  statValor: { fontSize: 20, fontWeight: '800' },
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
  favIconWrap: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: THEME.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  favIcon: { fontSize: 20 },
  favInfo: { flex: 1 },
  favNome: { color: THEME.textPrimary, fontWeight: '700', fontSize: 13 },
  favSub: { color: THEME.textTertiary, fontSize: 11, marginTop: 2 },
  favPreco: { color: THEME.gold, fontWeight: '700', fontSize: 13 },
  emptyFavs: { color: THEME.textTertiary, fontSize: 13 },
});
