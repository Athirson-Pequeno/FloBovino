import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Fazendeiro, getFazendeiroById } from "../../services/authService";

export default function Dashboard() {
  const { id } = useLocalSearchParams();
  const [fazendeiro, setFazendeiro] = useState<Fazendeiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFazendeiroById(id as string)
      .then(setFazendeiro)
      .catch((err) => alert("Erro ao carregar dados: " + err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#00780a" style={{ flex: 1 }} />;

  if (!fazendeiro) return <Text style={{ marginTop: 50 }}>Fazendeiro não encontrado</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Bem-vindo, {fazendeiro.nome}!</Text>
      <Text>Email: {fazendeiro.email}</Text>
      <Text>Endereço: {`${fazendeiro.endereco.bairro}, ${fazendeiro.endereco.cidade} - ${fazendeiro.endereco.estado}`}</Text>
      <Text>CEP: {fazendeiro.endereco.cep}</Text>
      <Text>Número: {fazendeiro.endereco.numero}</Text>
      {fazendeiro.endereco.complemento && <Text>Complemento: {fazendeiro.endereco.complemento}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#00780a", marginBottom: 10 },
});
