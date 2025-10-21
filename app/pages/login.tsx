import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { supabase } from "../../config/supabase_config";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("E-mail ou senha incorretos.");
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Erro inesperado: usuário não encontrado.");
      }

      Alert.alert("Bem-vindo(a)!", `Login realizado com sucesso.`);
      router.replace("/pages/home"); // Caminho ajustado para sua estrutura
    } catch (err: any) {
      Alert.alert("Falha no login", err.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo(a)</Text>
        <Text style={styles.subtitle}>Entre com seu e-mail e senha</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <Pressable onPress={() => router.push("/forms/formularioFazendeiro")}>
          <Text style={styles.linkText}>Cadastre-se aqui</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00780a",
    marginBottom: 6,
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
    gap: 16,
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
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#00780a",
    paddingVertical: 14,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#555",
  },
  linkText: {
    color: "#00780a",
    fontWeight: "bold",
    marginTop: 4,
  },
});
