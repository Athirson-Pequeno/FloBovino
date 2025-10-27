// app/pages/eventos.tsx
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

// ❗️IMPORT RELATIVO (ajuste se sua pasta for diferente)
import {
    listarEventosPorAnimal,
    type AnimalEvent,
} from "../../services/eventoService";

export default function EventosPage() {
  const { animalId } = useLocalSearchParams<{ animalId?: string }>();

  const [carregando, setCarregando] = React.useState(true);
  const [eventos, setEventos] = React.useState<AnimalEvent[]>([]);
  const [erro, setErro] = React.useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setCarregando(true);

      if (!animalId) {
        throw new Error("animalId não informado na rota.");
      }

      const dados = await listarEventosPorAnimal(String(animalId));
      setEventos(dados);
    } catch (e: any) {
      console.error("Falha ao carregar eventos:", e);
      setErro(e?.message ?? "Falha ao carregar eventos");
    } finally {
      setCarregando(false);
    }
  }

  React.useEffect(() => {
    carregar();
  }, [animalId]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#fff" }}>
      <Stack.Screen options={{ title: "Eventos do animal" }} />

      {/* Header + botão novo */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Eventos do animal
        </Text>

        {animalId ? (
          <Link
            href={{
              pathname: "/forms/formularioEvento",
              params: { animalId: String(animalId) },
            }}
            asChild
          >
            <Pressable
              style={{
                backgroundColor: "#16a34a",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Novo evento</Text>
            </Pressable>
          </Link>
        ) : null}
      </View>

      {/* Estados */}
      {carregando ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Carregando eventos...</Text>
        </View>
      ) : erro ? (
        <View style={{ gap: 10 }}>
          <Text style={{ color: "red" }}>{erro}</Text>
          <Pressable
            onPress={carregar}
            style={{
              backgroundColor: "#1e90ff",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={{ paddingVertical: 4 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/forms/formularioEvento",
                params: { animalId: String(animalId), id: String(item.id) },
              }}
              asChild
            >
              <Pressable
                style={{
                  backgroundColor: "#f4f4f5",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontWeight: "800" }}>
                  {item.tipo} — {item.data_do_evento}
                </Text>
                {item.descricao ? <Text>{item.descricao}</Text> : null}
                {/* Se quiser mostrar algo de vacina, busque da tabela vacinas numa lista/tela própria */}
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#666" }}>
              Nenhum evento cadastrado ainda.
            </Text>
          }
        />
      )}
    </View>
  );
}