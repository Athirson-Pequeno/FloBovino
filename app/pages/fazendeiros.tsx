// app/fazendeiros.tsx
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../config/supabase_config";

type Fazendeiro = {
  id: string;
  codigo: string;
  nome: string;
  email: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  complemento?: string;
};

export default function FazendeirosScreen() {
  const [fazendeiros, setFazendeiros] = useState<Fazendeiro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFazendeiros = async () => {
    try {
      const { data, error } = await supabase
        .from<"fazendeiros",Fazendeiro>("fazendeiros")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      setFazendeiros(data || []);
    } catch (err) {
      console.error("Erro ao buscar fazendeiros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFazendeiros();
  }, []);

  const renderItem = ({ item }: { item: Fazendeiro }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.info}>{item.email}</Text>
      <Text style={styles.info}>
        {item.cidade}, {item.estado} - {item.bairro}, {item.numero}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Fazendeiros Cadastrados" }} />

      {loading ? (
        <ActivityIndicator size="large" color="#00780a" />
      ) : (
        <FlatList
          data={fazendeiros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#00780a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nome: { fontSize: 18, fontWeight: "bold", color: "#00780a", marginBottom: 4 },
  info: { fontSize: 14, color: "#555" },
});
