import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail e senha para continuar
        </Text>
      </View>

      {/* Campos de entrada */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
        />

        <Link href="./home" asChild>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Pressable>
        </Link>
      </View>

      {/* Rodapé opcional */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <Link href="../forms/formularioFazendeiro" asChild>
          <Pressable>
            <Text style={styles.linkText}>Cadastre-se aqui</Text>
          </Pressable>
        </Link>
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
