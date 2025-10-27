// components/EventosModal.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { listarEventosPorAnimal, type AnimalEvent } from "@/services/eventoService";
import { Link } from "expo-router";

type Props = {
  animalId: string;
  visible: boolean;
  onClose: () => void;
};

export default function EventosModal({ animalId, visible, onClose }: Props) {
  const [carregando, setCarregando] = useState(true);
  const [eventos, setEventos] = useState<AnimalEvent[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      setErro(null);
      setCarregando(true);
      const dados = await listarEventosPorAnimal(String(animalId));
      setEventos(dados);
    } catch (e: any) {
      setErro(e?.message ?? "Falha ao carregar eventos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (visible) carregar();
  }, [visible, animalId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Eventos do animal</Text>

          {carregando ? (
            <View style={styles.center}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8 }}>Carregando eventos...</Text>
            </View>
          ) : erro ? (
            <View style={styles.center}>
              <Text style={{ color: "red" }}>{erro}</Text>
              <Pressable style={styles.retry} onPress={carregar}>
                <Text style={{ color: "#fff" }}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={eventos}
              keyExtractor={(i) => String(i.id)}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={{ fontWeight: "700" }}>
                    {item.tipo} — {item.data_do_evento}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#666", textAlign: "center" }}>
                  Nenhum evento cadastrado ainda.
                </Text>
              }
            />
          )}


          <Link
            href={{ pathname: "../pages/eventos", params: { animalId: animalId } }}
            asChild
          >
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Detalhar eventos</Text>
            </Pressable>
          </Link>
          <Link
            href={{ pathname: "/forms/formularioAnimal", params: { id: animalId } }}
            asChild
          >
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Editar animal</Text>
            </Pressable>
          </Link>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    backgroundColor: "#f4f4f5",
    padding: 12,
    borderRadius: 8,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
  retry: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  closeBtn: {
    backgroundColor: "#00780a",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  closeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
