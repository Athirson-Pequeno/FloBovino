import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { listarAnimaisDoUsuario } from "../../services/animalService";

type Animal = {
  id: string;
  nome: string;
  raca: string;
  sexo: "M" | "F";
  data_nascimento: string;
  vacinas?: { tipo: string; data_aplicacao: string }[];
};

export default function HomeScreen() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarAnimais() {
      try {
        const dados = await listarAnimaisDoUsuario();
        setAnimais(dados || []);
      } catch (err) {
        console.error("Erro ao carregar animais:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarAnimais();
  }, []);

  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
          }}
          style={styles.image}
          contentFit="cover"
        />
        <View>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.age}>
            {item.raca} - {item.sexo === "M" ? "Macho" : "Fêmea"}
          </Text>
        </View>
      </View>

      <IconSymbol size={28} name="calendar" color={"#fff"} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00780a" />
        <Text style={{ marginTop: 10 }}>Carregando animais...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={animais}
        keyExtractor={(animal) => animal.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8, gap: 8, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
            Nenhum animal cadastrado ainda.
          </Text>
        }
      />

      <View style={styles.footer}>
        <Link href="/forms/formularioAnimal" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Abrir formulário animal</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#606060ff",
    marginHorizontal: 4,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  image: { width: 50, height: 50, borderRadius: 5 },
  name: { color: "#000", fontWeight: "600" },
  age: { color: "#000" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: "#00780a",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
