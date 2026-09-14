import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { PRATOS, CATEGORIAS } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function PratoCard({ prato, isFavorito, onToggleFavorito, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardIcon}>{prato.icone}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNome} numberOfLines={1}>{prato.nome}</Text>
          <TouchableOpacity onPress={onToggleFavorito} hitSlop={8}>
            <Text style={[styles.favIcon, isFavorito && styles.favIconActive]}>
              {isFavorito ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{prato.desc}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <Text style={styles.cardCategoria}>{prato.categoria}</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardTempo}>{prato.tempo}</Text>
          </View>
          <Text style={styles.cardPreco}>{prato.preco}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [catAtiva, setCatAtiva] = useState('Todos');
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const c = catAtiva.trim().toLowerCase();
    return PRATOS.filter((p) => {
      const okBusca = !q || p.nome.toLowerCase().includes(q);
      const okCat = c === 'todos' || p.categoria.trim().toLowerCase() === c;
      return okBusca && okCat;
    });
  }, [busca, catAtiva]);

  const handlePress = useCallback((prato) => {
    navigation.navigate('MovieDetail', { movieId: prato.id });
  }, [navigation]);

  const renderCard = useCallback(({ item }) => (
    <View style={styles.cardSlot}>
      <PratoCard
        prato={item}
        isFavorito={favorites.includes(item.id)}
        onToggleFavorito={() => toggleFavorite(item.id)}
        onPress={() => handlePress(item)}
      />
    </View>
  ), [favorites, toggleFavorite, handlePress]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>BISTRÔ</Text>
            <Text style={styles.greeting}>Escolha seu prato favorito</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Buscar prato..."
            placeholderTextColor={THEME.textTertiary}
            value={busca}
            onChangeText={setBusca}
            style={styles.searchInput}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} hitSlop={8}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.chipContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCatAtiva(cat)}
                style={[styles.chip, catAtiva === cat && styles.chipActive]}
              >
                <Text style={[styles.chipText, catAtiva === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoBar}>
          <Text style={styles.infoCount}>{filtrados.length} pratos</Text>
          <Text style={styles.infoLabel}>
            {catAtiva === 'Todos' ? 'CARDAPIO' : catAtiva.toUpperCase()}
          </Text>
        </View>

        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>Nenhum prato encontrado</Text>
              <Text style={styles.emptySub}>Tente outra categoria ou busca</Text>
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
  brand: { fontSize: 10, fontWeight: '900', color: THEME.accent, letterSpacing: 3 },
  greeting: { color: THEME.textSecondary, fontSize: 15, fontWeight: '500', marginTop: 8 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: THEME.surfaceAlt, marginHorizontal: 16, marginTop: 14,
    borderRadius: 10, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: THEME.border,
  },
  searchInput: { flex: 1, color: THEME.textPrimary, fontSize: 14 },
  clearBtn: { color: THEME.textTertiary, fontSize: 14, paddingLeft: 10 },

  chipContainer: { maxHeight: 50, overflow: 'hidden' },
  chipScroll: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
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
  favIcon: { fontSize: 16, color: THEME.textTertiary },
  favIconActive: { color: THEME.rose },
  cardDesc: { color: THEME.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 6 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardCategoria: { color: THEME.accent, fontSize: 11, fontWeight: '700' },
  cardDot: { color: THEME.textTertiary, fontSize: 8 },
  cardTempo: { color: THEME.textTertiary, fontSize: 11 },
  cardPreco: { color: THEME.gold, fontSize: 14, fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { color: THEME.textPrimary, fontWeight: '700', fontSize: 15 },
  emptySub: { color: THEME.textTertiary, marginTop: 4, fontSize: 13 },
});
