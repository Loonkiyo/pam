import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { PRATOS } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function InfoBox({ valor, label }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoBoxValor}>{valor}</Text>
      <Text style={styles.infoBoxLabel}>{label}</Text>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;

  const prato = useMemo(() => PRATOS.find((p) => p.id === movieId), [movieId]);

  if (!prato) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Prato não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFavorito = favorites.includes(prato.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroBg}>
            <Text style={styles.heroIcon}>{prato.icone}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <View style={styles.categoryPill}>
              <View style={[styles.catDot, { backgroundColor: prato.cor }]} />
              <Text style={[styles.catText, { color: prato.cor }]}>{prato.categoria}</Text>
            </View>
            <Text style={styles.heroTitle}>{prato.nome}</Text>
            <Text style={styles.heroPreco}>{prato.preco}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={styles.desc}>{prato.desc}</Text>

          <Text style={styles.sectionLabel}>INFORMAÇÕES</Text>
          <View style={styles.infoGrid}>
            <InfoBox valor={prato.tempo} label="PREPARO" />
            <InfoBox valor={prato.categoria} label="CATEGORIA" />
            <InfoBox valor="1" label="PORÇÃO" />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              <Text style={styles.primaryBtnText}>📱 FAZER PEDIDO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryBtn, isFavorito && styles.secondaryBtnActive]}
              activeOpacity={0.8}
              onPress={() => toggleFavorite(prato.id)}
            >
              <Text style={[styles.secondaryBtnText, isFavorito && styles.secondaryBtnTextActive]}>
                {isFavorito ? '♥ FAVORITADO' : '♡ FAVORITAR'}
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

  heroSection: { backgroundColor: THEME.surfaceAlt },
  heroBg: {
    width: '100%', height: 200,
    alignItems: 'center', justifyContent: 'center',
  },
  heroIcon: { fontSize: 80 },
  closeBtn: {
    position: 'absolute', top: 48, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  closeText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  heroBottom: { padding: 16 },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: THEME.border,
    backgroundColor: THEME.surface, marginBottom: 12,
  },
  catDot: { width: 6, height: 6, borderRadius: 3 },
  catText: { fontSize: 11, fontWeight: '700' },
  heroTitle: { color: THEME.textPrimary, fontSize: 24, fontWeight: '800' },
  heroPreco: { color: THEME.gold, fontSize: 20, fontWeight: '800', marginTop: 8 },

  body: { padding: 16 },
  sectionLabel: {
    color: THEME.textTertiary, fontSize: 10, fontWeight: '700',
    letterSpacing: 1.5, marginTop: 20, marginBottom: 8,
  },
  desc: { color: THEME.textSecondary, fontSize: 14, lineHeight: 22 },

  infoGrid: { flexDirection: 'row', gap: 10 },
  infoBox: {
    flex: 1, backgroundColor: THEME.surface, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: THEME.border,
  },
  infoBoxValor: { color: THEME.textPrimary, fontSize: 14, fontWeight: '800' },
  infoBoxLabel: { color: THEME.textTertiary, fontSize: 9, fontWeight: '700', marginTop: 4, letterSpacing: 1.2 },

  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  primaryBtn: {
    flex: 1, backgroundColor: THEME.accent, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  secondaryBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    backgroundColor: THEME.surfaceAlt, borderWidth: 1, borderColor: THEME.border, alignItems: 'center',
  },
  secondaryBtnActive: { backgroundColor: THEME.roseSoft, borderColor: THEME.rose },
  secondaryBtnText: { color: THEME.textSecondary, fontWeight: '700', fontSize: 12 },
  secondaryBtnTextActive: { color: THEME.rose },
});
