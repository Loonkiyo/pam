import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { THEME } from '../data/theme';
import { PRATOS } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const favoritos = useMemo(() => PRATOS.filter((p) => favorites.includes(p.id)), [favorites]);

  const estatisticas = [
    { valor: PRATOS.length, label: 'No Cardápio', cor: THEME.accent },
    { valor: favoritos.length, label: 'Favoritos', cor: THEME.rose },
    { valor: '1.2k', label: 'Pedidos', cor: THEME.blue },
    { valor: '4.8', label: 'Avaliação', cor: THEME.gold },
  ];

  const horarios = [
    { dia: 'Seg - Sex', hora: '11:00 - 23:00' },
    { dia: 'Sábado', hora: '11:00 - 00:00' },
    { dia: 'Domingo', hora: '12:00 - 22:00' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.brand}>BISTRÔ</Text>
        <Text style={styles.title}>Bistrô Gourmet</Text>
        <Text style={styles.sub}>Cozinha Brasileira Autoral · Desde 2020</Text>
      </View>

      <View style={styles.statsRow}>
        {estatisticas.map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={[styles.statValor, { color: s.cor }]}>{s.valor}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>HORÁRIO DE FUNCIONAMENTO</Text>
      <View style={styles.horariosCard}>
        {horarios.map((h, i) => (
          <View key={i} style={[styles.horarioRow, i < horarios.length - 1 && styles.horarioBorder]}>
            <Text style={styles.horarioDia}>{h.dia}</Text>
            <Text style={styles.horarioHora}>{h.hora}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>PRATOS FAVORITOS</Text>
      {favoritos.length === 0 ? (
        <View style={styles.emptyFav}>
          <Text style={styles.emptyFavIcon}>♡</Text>
          <Text style={styles.emptyFavText}>Nenhum favorito ainda</Text>
        </View>
      ) : (
        <View style={styles.favGrid}>
          {favoritos.map((p) => (
            <View key={p.id} style={styles.favItem}>
              <Text style={styles.favIcon}>{p.icone}</Text>
              <Text style={styles.favNome} numberOfLines={1}>{p.nome}</Text>
              <Text style={styles.favPreco}>{p.preco}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.section}>MAIS PEDIDOS</Text>
      <View style={styles.pedidosCard}>
        {PRATOS.slice(0, 3).map((p, i) => (
          <View key={p.id} style={[styles.pedidoRow, i < 2 && styles.pedidoBorder]}>
            <View style={styles.pedidoRank}>
              <Text style={styles.pedidoRankText}>{i + 1}</Text>
            </View>
            <Text style={styles.pedidoIcon}>{p.icone}</Text>
            <View style={styles.pedidoInfo}>
              <Text style={styles.pedidoNome}>{p.nome}</Text>
              <Text style={styles.pedidoCat}>{p.categoria}</Text>
            </View>
            <Text style={styles.pedidoPreco}>{p.preco}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.contatoBtn} activeOpacity={0.8}>
        <Text style={styles.contatoBtnText}>📞 FAZER RESERVA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sairBtn} activeOpacity={0.8}>
        <Text style={styles.sairBtnText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  content: { padding: 16, paddingBottom: 40 },

  header: { marginBottom: 20 },
  brand: { fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3 },
  title: { color: THEME.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 8 },
  sub: { color: THEME.textTertiary, fontSize: 12, marginTop: 4 },

  statsRow: {
    flexDirection: 'row', backgroundColor: THEME.surface, borderRadius: 12,
    borderWidth: 1, borderColor: THEME.border, overflow: 'hidden',
  },
  statItem: {
    flex: 1, alignItems: 'center', paddingVertical: 16,
    borderRightWidth: 1, borderRightColor: THEME.border,
  },
  statValor: { fontSize: 18, fontWeight: '800' },
  statLabel: { color: THEME.textTertiary, fontSize: 9, fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },

  section: {
    color: THEME.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, marginTop: 24, marginBottom: 10,
  },

  horariosCard: {
    backgroundColor: THEME.surface, borderRadius: 12, borderWidth: 1, borderColor: THEME.border,
  },
  horarioRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 14,
  },
  horarioBorder: { borderBottomWidth: 1, borderBottomColor: THEME.border },
  horarioDia: { color: THEME.textPrimary, fontSize: 13, fontWeight: '600' },
  horarioHora: { color: THEME.textSecondary, fontSize: 13 },

  emptyFav: {
    backgroundColor: THEME.surface, borderRadius: 12, borderWidth: 1, borderColor: THEME.border,
    padding: 24, alignItems: 'center',
  },
  emptyFavIcon: { fontSize: 24, color: THEME.textTertiary },
  emptyFavText: { color: THEME.textTertiary, fontSize: 13, marginTop: 8 },

  favGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  favItem: {
    width: '30%', backgroundColor: THEME.surface, borderRadius: 10,
    borderWidth: 1, borderColor: THEME.border, padding: 12, alignItems: 'center',
  },
  favIcon: { fontSize: 28 },
  favNome: { color: THEME.textPrimary, fontSize: 11, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  favPreco: { color: THEME.gold, fontSize: 11, fontWeight: '700', marginTop: 4 },

  pedidosCard: {
    backgroundColor: THEME.surface, borderRadius: 12, borderWidth: 1, borderColor: THEME.border,
  },
  pedidoRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  pedidoBorder: { borderBottomWidth: 1, borderBottomColor: THEME.border },
  pedidoRank: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: THEME.accentSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  pedidoRankText: { color: THEME.accent, fontSize: 11, fontWeight: '800' },
  pedidoIcon: { fontSize: 24 },
  pedidoInfo: { flex: 1 },
  pedidoNome: { color: THEME.textPrimary, fontSize: 13, fontWeight: '700' },
  pedidoCat: { color: THEME.textTertiary, fontSize: 10, marginTop: 2 },
  pedidoPreco: { color: THEME.gold, fontSize: 12, fontWeight: '700' },

  contatoBtn: {
    backgroundColor: THEME.accent, borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 24,
  },
  contatoBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  sairBtn: {
    borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10,
    borderWidth: 1, borderColor: THEME.border,
  },
  sairBtnText: { color: THEME.textTertiary, fontSize: 12, fontWeight: '600' },
});
