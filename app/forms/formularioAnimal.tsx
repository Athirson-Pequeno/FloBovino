// app/formularioAnimal.tsx
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { salvarAnimal, Animal, Vacina } from "../../services/animalService";

type AnimalForm = {
  nome: string;
  raca: string;
  sexo: "M" | "F" | "";
  dataNascimento: string;

  pai_nome: string;
  pai_registro: string;
  pai_raca: string;

  mae_nome: string;
  mae_registro: string;
  mae_raca: string;

  vacinas: Vacina[];
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
}) => (
  <View style={{ gap: 6 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? "default"}
    />
  </View>
);

export default function FormularioAnimal() {
  const router = useRouter();

  const [form, setForm] = useState<AnimalForm>({
    nome: "",
    raca: "",
    sexo: "",
    dataNascimento: "",
    pai_nome: "",
    pai_registro: "",
    pai_raca: "",
    mae_nome: "",
    mae_registro: "",
    mae_raca: "",
    vacinas: [],
  });

  const [novaVacina, setNovaVacina] = useState<Vacina>({
    tipo: "",
    data_aplicacao: "",
    validade_dias: "",
  });

  const setField = <K extends keyof AnimalForm>(key: K, value: AnimalForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const adicionarVacina = () => {
    if (!novaVacina.tipo.trim() || !novaVacina.data_aplicacao.trim()) {
      Alert.alert("Vacina incompleta", "Informe tipo e data de aplicação.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      vacinas: [...prev.vacinas, novaVacina],
    }));
    setNovaVacina({ tipo: "", data_aplicacao: "", validade_dias: "" });
  };

  const removerVacina = (index: number) => {
    setForm((prev) => ({
      ...prev,
      vacinas: prev.vacinas.filter((_, i) => i !== index),
    }));
  };

  const obrigatoriosOk =
    !!form.nome.trim() &&
    !!form.raca.trim() &&
    !!form.sexo &&
    !!form.dataNascimento.trim();

  const onSalvar = async () => {
    if (!obrigatoriosOk) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha Nome, Raça, Sexo e Data de Nascimento."
      );
      return;
    }

    const animalParaSalvar: Animal = {
      nome: form.nome,
      raca: form.raca,
      sexo: form.sexo as "M" | "F",
      data_nascimento: form.dataNascimento,
      pai_nome: form.pai_nome || undefined,
      pai_registro: form.pai_registro || undefined,
      pai_raca: form.pai_raca || undefined,
      mae_nome: form.mae_nome || undefined,
      mae_registro: form.mae_registro || undefined,
      mae_raca: form.mae_raca || undefined,
      vacinas: form.vacinas.length > 0 ? form.vacinas : undefined,
    };

    try {
      await salvarAnimal(animalParaSalvar);
      Alert.alert("Sucesso", "Animal salvo com sucesso!");
      router.push("../pages/home"); 
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível salvar o animal.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.mainTitle}>Cadastro de Animal</Text>
          <Text style={styles.subtitle}>
            Preencha as informações abaixo para cadastrar um novo animal.
          </Text>

          {/* Dados do Animal */}
          <Section title="Dados do Animal">
            <LabeledInput
              label="Nome *"
              value={form.nome}
              onChangeText={(t) => setField("nome", t)}
            />
            <LabeledInput
              label="Raça *"
              value={form.raca}
              onChangeText={(t) => setField("raca", t)}
            />

            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Sexo *</Text>
              <View style={styles.sexoRow}>
                {(["M", "F"] as const).map((sx) => (
                  <TouchableOpacity
                    key={sx}
                    onPress={() => setField("sexo", sx)}
                    activeOpacity={0.85}
                    style={[
                      styles.sexoBtn,
                      form.sexo === sx && styles.sexoBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sexoBtnText,
                        form.sexo === sx && { color: "#fff" },
                      ]}
                    >
                      {sx === "M" ? "Macho" : "Fêmea"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <LabeledInput
              label="Data de Nascimento *"
              placeholder="dd/mm/aaaa"
              value={form.dataNascimento}
              onChangeText={(t) => setField("dataNascimento", t)}
            />
          </Section>

          {/* Informações do Pai */}
          <Section title="Informações do Pai">
            <LabeledInput
              label="Nome"
              value={form.pai_nome}
              onChangeText={(t) => setField("pai_nome", t)}
            />
            <LabeledInput
              label="Registro"
              value={form.pai_registro}
              onChangeText={(t) => setField("pai_registro", t)}
            />
            <LabeledInput
              label="Raça"
              value={form.pai_raca}
              onChangeText={(t) => setField("pai_raca", t)}
            />
          </Section>

          {/* Informações da Mãe */}
          <Section title="Informações da Mãe">
            <LabeledInput
              label="Nome"
              value={form.mae_nome}
              onChangeText={(t) => setField("mae_nome", t)}
            />
            <LabeledInput
              label="Registro"
              value={form.mae_registro}
              onChangeText={(t) => setField("mae_registro", t)}
            />
            <LabeledInput
              label="Raça"
              value={form.mae_raca}
              onChangeText={(t) => setField("mae_raca", t)}
            />
          </Section>

          {/* Vacinas */}
          <Section title="Vacinas">
            <LabeledInput
              label="Data da Aplicação"
              placeholder="dd/mm/aaaa"
              value={novaVacina.data_aplicacao}
              onChangeText={(t) =>
                setNovaVacina((s) => ({ ...s, data_aplicacao: t }))
              }
            />
            <LabeledInput
              label="Tipo da Vacina"
              value={novaVacina.tipo}
              onChangeText={(t) => setNovaVacina((s) => ({ ...s, tipo: t }))}
            />
            <LabeledInput
              label="Validade (dias)"
              keyboardType="numeric"
              value={novaVacina.validade_dias || ""}
              onChangeText={(t) =>
                setNovaVacina((s) => ({ ...s, validade_dias: t }))
              }
            />

            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={0.85}
              onPress={adicionarVacina}
            >
              <Text style={styles.addBtnText}>Adicionar vacina</Text>
            </TouchableOpacity>

            {form.vacinas.length > 0 && (
              <View style={{ gap: 8, marginTop: 8 }}>
                {form.vacinas.map((v, i) => (
                  <View key={i} style={styles.vacinaCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vacinaTitle}>{v.tipo}</Text>
                      <Text style={styles.vacinaLine}>
                        Aplicação: {v.data_aplicacao}
                      </Text>
                      {!!v.validade_dias && (
                        <Text style={styles.vacinaLine}>
                          Validade: {v.validade_dias} dias
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => removerVacina(i)}
                      style={styles.removeBtn}
                      activeOpacity={0.85}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </Section>

          {/* Salvar */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onSalvar}
            disabled={!obrigatoriosOk}
            style={[styles.saveBtn, !obrigatoriosOk && { backgroundColor: "#9fd8a5" }]}
          >
            <Text style={styles.saveBtnText}>
              {obrigatoriosOk ? "Salvar Animal" : "Preencha os campos obrigatórios"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", gap: 20, alignItems: "center" },
  mainTitle: { fontSize: 26, fontWeight: "bold", color: "#00780a", textAlign: "center" },
  subtitle: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 10 },
  section: { borderWidth: 1, width: "100%", maxWidth: 800, borderColor: "#e6e6e6", borderRadius: 12, padding: 12, gap: 12 },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#00780a" },
  label: { fontWeight: "600", color: "#222" },
  input: { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  sexoRow: { flexDirection: "row", gap: 10 },
  sexoBtn: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  sexoBtnActive: { backgroundColor: "#00780a", borderColor: "#00780a" },
  sexoBtnText: { color: "#00780a", fontWeight: "600" },
  addBtn: { alignSelf: "flex-start", backgroundColor: "#00780a", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  vacinaCard: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 10, padding: 10 },
  vacinaTitle: { fontWeight: "700", color: "#000" },
  vacinaLine: { color: "#333" },
  removeBtn: { backgroundColor: "#d7263d", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  saveBtn: { backgroundColor: "#00780a", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 12, width: "100%", maxWidth: 800, textAlign: "center" },
  saveBtnText: { color: "#fff", fontWeight: "800" },
});
