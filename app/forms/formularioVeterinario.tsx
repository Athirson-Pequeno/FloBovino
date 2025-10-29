import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { salvarVeterinario } from "../../services/veterinarioService";

export default function VeterinarioForm() {
  const [veterinario, setVeterinario] = useState({
    crmv: "",
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    endereco: {
      numero: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      complemento: "",
    },
  });

  const handleChange = (field: string, value: string) => {
    const enderecoFields = ["bairro", "cidade", "cep", "numero", "estado", "complemento"];
    if (enderecoFields.includes(field)) {
      setVeterinario((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value },
      }));
    } else {
      setVeterinario((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await salvarVeterinario(veterinario);
      Alert.alert('Sucesso', 'Veterinário cadastrado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o veterinário.' + err);
    }

    // Limpar os campos
    setVeterinario({
      crmv: "",
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      endereco: {
        numero: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        complemento: "",
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro de Veterinário</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para cadastrar um novo veterinário
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Campos principais */}
          <TextInput
            style={styles.input}
            value={veterinario.crmv}
            onChangeText={(text) => handleChange("crmv", text)}
            placeholder="CRMV *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.nome}
            onChangeText={(text) => handleChange("nome", text)}
            placeholder="Nome *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.telefone}
            onChangeText={(text) => handleChange("telefone", text)}
            placeholder="Telefone *"
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            value={veterinario.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="E-mail *"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            value={veterinario.senha}
            onChangeText={(text) => handleChange("senha", text)}
            placeholder="Senha *"
            secureTextEntry
          />

          {/* Endereço */}
          <Text style={styles.sectionTitle}>Endereço</Text>

          <TextInput
            style={styles.input}
            value={veterinario.endereco.bairro}
            onChangeText={(text) => handleChange("bairro", text)}
            placeholder="Bairro *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.endereco.cidade}
            onChangeText={(text) => handleChange("cidade", text)}
            placeholder="Cidade *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.endereco.estado}
            onChangeText={(text) => handleChange("estado", text)}
            placeholder="Estado *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.endereco.cep}
            onChangeText={(text) => handleChange("cep", text)}
            placeholder="CEP *"
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            value={veterinario.endereco.numero}
            onChangeText={(text) => handleChange("numero", text)}
            placeholder="Número *"
          />

          <TextInput
            style={styles.input}
            value={veterinario.endereco.complemento}
            onChangeText={(text) => handleChange("complemento", text)}
            placeholder="Complemento (opcional)"
          />

          {/* Botão */}
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00780a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 14,
  },
  sectionTitle: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#00780a",
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    width: "90%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#00780a",
    paddingVertical: 14,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
