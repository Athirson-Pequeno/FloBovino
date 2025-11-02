import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { salvarFazendeiro } from "../../services/fazendeiroService";

export default function FormularioFazendeiro() {
  const [fazendeiro, setFazendeiro] = useState({
    nome: "",
    email: "",
    senha: "",
    endereco: {
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
    },
  });

  const handleChange = (field: string, value: string) => {
    const enderecoFields = ["bairro", "cidade", "cep", "numero", "estado", "complemento"];
    if (enderecoFields.includes(field)) {
      setFazendeiro((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value },
      }));
    } else {
      setFazendeiro((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await salvarFazendeiro(fazendeiro);
      Alert.alert('Sucesso', 'Fazendeiro cadastrado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o fazendeiro.' + err);
    }

    // Limpar os campos
    setFazendeiro({
      nome: "",
      email: "",
      senha: "",
      endereco: {
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        enableOnAndroid={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro de Fazendeiro</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para cadastrar um novo fazendeiro
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Campos principais */}
          <TextInput
            style={styles.input}
            value={fazendeiro.nome}
            onChangeText={(text) => handleChange("nome", text)}
            placeholder="Nome *"
          />

          <TextInput
            style={styles.input}
            value={fazendeiro.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="E-mail *"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            value={fazendeiro.senha}
            onChangeText={(text) => handleChange("senha", text)}
            placeholder="Senha *"
            secureTextEntry
          />

          {/* Endereço */}
          <Text style={styles.sectionTitle}>Endereço</Text>

          <TextInput
            style={styles.input}
            value={fazendeiro.endereco.bairro}
            onChangeText={(text) => handleChange("bairro", text)}
            placeholder="Bairro *"
          />

          <TextInput
            style={styles.input}
            value={fazendeiro.endereco.cidade}
            onChangeText={(text) => handleChange("cidade", text)}
            placeholder="Cidade *"
          />

          <TextInput
            style={styles.input}
            value={fazendeiro.endereco.estado}
            onChangeText={(text) => handleChange("estado", text)}
            placeholder="Estado *"
          />

          <TextInput
            style={styles.input}
            value={fazendeiro.endereco.cep}
            onChangeText={(text) => handleChange("cep", text)}
            placeholder="CEP *"
            keyboardType="numeric"
          />

          {/* Botão */}
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1, // ✅ deixa o conteúdo crescer e rolar
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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

