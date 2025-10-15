import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function VeterinarioForm() {
  const [veterinario, setVeterinario] = useState({
    crmv: "",
    nome: "",
    email: "",
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

  const handleChange = (field: string, value: string | number) => {
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

  const handleSubmit = () => {
    Alert.alert("Sucesso", "Veterinário cadastrado com sucesso!");
    console.log("Dados do veterinário:", veterinario);

    // Limpar os campos
    setVeterinario({
      crmv: "",
      nome: "",
      email: "",
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <Text style={styles.title}>Cadastro de Veterinário</Text>

          {/* Campos principais */}
          <Text style={styles.label}>CRMV *</Text>
          <TextInput
            style={styles.input}
            value={veterinario.crmv}
            onChangeText={(text) => handleChange("crmv", text)}
            placeholder="Digite o CRMV"
          />

          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={veterinario.nome}
            onChangeText={(text) => handleChange("nome", text)}
            placeholder="Digite o nome"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={veterinario.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Digite o email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={veterinario.telefone}
            onChangeText={(text) => handleChange("telefone", text)}
            placeholder="(DDD) 99999-9999"
            keyboardType="phone-pad"
          />

          {/* Endereço */}
          <View style={styles.fieldset}>
            <Text style={styles.legend}>Endereço</Text>

            <Text style={styles.label}>Bairro *</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.bairro}
              onChangeText={(text) => handleChange("bairro", text)}
              placeholder="Digite o bairro"
            />

            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.cidade}
              onChangeText={(text) => handleChange("cidade", text)}
              placeholder="Digite a cidade"
            />

            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.estado}
              onChangeText={(text) => handleChange("estado", text)}
              placeholder="Digite o estado"
            />

            <Text style={styles.label}>CEP *</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.cep}
              onChangeText={(text) => handleChange("cep", text)}
              placeholder="Digite o CEP"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Número *</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.numero}
              onChangeText={(text) => handleChange("numero", text)}
              placeholder="Número da casa"
            />

            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={styles.input}
              value={veterinario.endereco.complemento}
              onChangeText={(text) => handleChange("complemento", text)}
              placeholder="Complemento (opcional)"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cadastrar" onPress={handleSubmit} color="#007bff" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scroll: {
    padding: 16,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginTop: 4,
  },
  fieldset: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  legend: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
});
