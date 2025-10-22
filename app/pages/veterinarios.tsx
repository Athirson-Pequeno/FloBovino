// app/fazendeiros.tsx
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Pressable } from "react-native";
import { atribuirVeterinarioAoFazendeiro, buscarVeterinarios } from "@/services/veterinarioService";

export type Usuario = {
    nome: string;
    email: string;
};

export type Veterinario = {
    id: string;
    crmv: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    complemento?: string;
    usuarios: Usuario;
};

export default function VeterinariosScreen() {
    const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVeterinarios = async () => {
        try {
            setVeterinarios(await buscarVeterinarios());
        } catch (err) {
            console.error("Erro ao buscar veterinários:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchVeterinarios();
    }, []);

    const renderItem = ({ item }: { item: Veterinario }) => (
        <Pressable
            style={styles.card}
            onPress={() => handleSelectVeterinario(item)}
        >
            <Text style={styles.nome}>{item.usuarios?.nome}</Text>
            <Text style={styles.info}>{item.usuarios?.email}</Text>
            <Text style={styles.info}>
                {item.cidade}, {item.estado} - {item.bairro}, {item.numero}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Veterinarios Cadastrados" }} />

            {loading ? (
                <ActivityIndicator size="large" color="#00780a" />
            ) : (
                <FlatList
                    data={veterinarios}
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

const handleSelectVeterinario = async (veterinario: Veterinario) => {
    atribuirVeterinarioAoFazendeiro(veterinario);
}
