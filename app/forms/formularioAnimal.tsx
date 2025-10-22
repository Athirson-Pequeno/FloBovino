// app/formularioAnimal.tsx
import { Stack, useRouter } from "expo-router";
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
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Animal, salvarAnimal, Vacina } from "../../services/animalService";

// ---- Somente Web: locale + CSS do react-datepicker ----
let ReactDatePicker: any, registerLocale: any, ptBR: any;
if (Platform.OS === "web") {
  ReactDatePicker = require("react-datepicker").default;
  registerLocale = require("react-datepicker").registerLocale;
  ptBR = require("date-fns/locale/pt-BR").default;
  registerLocale("pt-BR", ptBR);
  // importa CSS só no Web (evita erro no nativo)
  require("react-datepicker/dist/react-datepicker.css");
}

/* ===================== Helpers de Data ===================== */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function formatBR(d?: Date | null) {
  if (!d) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function parseBR(s?: string) {
  if (!s) return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return isNaN(d.getTime()) ? null : d;
}
function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function brToISO(s: string) {
  const d = parseBR(s);
  return d ? toISODate(d) : "";
}
function isoToBR(s: string) {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${pad(d)}/${pad(m)}/${y}`;
}


// Limita a data dentro de min/max (se forem passadas)
function clampByBounds(
  d: Date,
  { minDate, maxDate }: { minDate?: Date; maxDate?: Date }
) {
  if (maxDate && d > maxDate) return maxDate;
  if (minDate && d < minDate) return minDate;
  return d;
}

/* ===================== Campo de Data Universal ===================== */
function DatePickerField({
  label,
  value,
  onChange,
  maxDate,
  minDate,
}: {
  label: string;
  value: string; // dd/mm/aaaa
  onChange: (s: string) => void;
  maxDate?: Date;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);

  // ===== WEB: corrige "reset" ao digitar e ajusta layout =====
  if (Platform.OS === "web") {
    // estado local em ISO (yyyy-mm-dd) para não sobrescrever enquanto digita
    const [webText, setWebText] = useState<string>(value || "");

    // mantém o input sincronizado quando o valor externo mudar (ex.: limpar form)
    React.useEffect(() => {
      setWebText(value || "");
    }, [value]);

    // aplica máscara dd/mm/aaaa
    const mask = (raw: string) => {
      const digits = raw.replace(/\D/g, "").slice(0, 8);
      let out = digits;
      if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      if (digits.length > 4) out = `${out.slice(0, 5)}/${digits.slice(4)}`;
      return out;
    };

    const handleWebChange = (e: any) => {
      const next = mask(e.target.value as string);
      setWebText(next);

      // só propaga quando completo (10 chars) e válido
      if (next.length === 10) {
        const d = parseBR(next);
        if (d) {
          const clamped = clampByBounds(d, { minDate, maxDate });
          const finalStr = formatBR(clamped);
          setWebText(finalStr);
          onChange(finalStr);
        }
      }
    }

    // @ts-ignore: elemento DOM está disponível apenas no web
    return (
      <View style={{ gap: 6 }}>
        <Text style={styles.label}>{label}</Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/aaaa"
          value={webText}
          onChange={handleWebChange}
          onBlur={() => {
            // se saiu do campo sem completar, não sobrescreve o form
            if (webText.length === 10) {
              const d = parseBR(webText);
              if (d) {
                const clamped = clampByBounds(d, { minDate, maxDate });
                const finalStr = formatBR(clamped);
                setWebText(finalStr);
                onChange(finalStr);
              }
            }
          }}
          style={{
            width: "100%",              // ocupa o card todo
            display: "block",
            boxSizing: "border-box",    // respeita padding/borda
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: "10px 12px",
            height: 44,
            outline: "none",
          }}
          
        />
      </View>
    );
  }

  // NATIVO (Android/iOS)
  const current = parseBR(value) ?? new Date();

  // Android: abre modal nativo
  const openAndroid = () => {
  DateTimePickerAndroid.open({
    value: current,
    mode: "date",
    onChange: (_: DateTimePickerEvent, selected?: Date) => {
      if (selected) {
        const clamped = clampByBounds(selected, { minDate, maxDate });
        onChange(formatBR(clamped));
      }
    },
    maximumDate: maxDate,
    minimumDate: minDate,
  });
};

  // iOS: spinner inline
  const onChangeIOS = (_: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
    const clamped = clampByBounds(selected, { minDate, maxDate });
    onChange(formatBR(clamped));
  }
  };

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() =>
          Platform.OS === "android" ? openAndroid() : setOpen((s) => !s)
        }
      >
        <TextInput
          value={value}
          placeholder="dd/mm/aaaa"
          editable={false}
          pointerEvents="none"
          style={styles.input}  // mantém dentro do card
        />
      </Pressable>

      {open && Platform.OS === "ios" && (
        <DateTimePicker
          value={current}
          mode="date"
          display="spinner"
          locale="pt-BR"
          onChange={onChangeIOS}
          maximumDate={maxDate}
          minimumDate={minDate}
          style={{ alignSelf: "flex-start" }}
        />
      )}
    </View>
  );
}

/* ===================== Tipagem do Form ===================== */
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

/* ===================== UI Auxiliares ===================== */
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

/* ===================== Tela ===================== */
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

            {/* Data de Nascimento com calendário */}
            <DatePickerField
              label="Data de Nascimento *"
              value={form.dataNascimento}
              onChange={(s) => setField("dataNascimento", s)}
              maxDate={new Date()}
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
            <DatePickerField
              label="Data da Aplicação"
              value={novaVacina.data_aplicacao}
              onChange={(s) =>
                setNovaVacina((v) => ({ ...v, data_aplicacao: s }))
              }
              maxDate={new Date()}
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
            style={[
              styles.saveBtn,
              !obrigatoriosOk && { backgroundColor: "#9fd8a5" },
            ]}
          >
            <Text style={styles.saveBtnText}>
              {obrigatoriosOk
                ? "Salvar Animal"
                : "Preencha os campos obrigatórios"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ===================== Estilos ===================== */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    gap: 20,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00780a",
    textAlign: "center",
  },
  subtitle: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 10 },
  section: {
    borderWidth: 1,
    width: "100%",
    maxWidth: 800,
    borderColor: "#e6e6e6",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#00780a" },
  label: { fontWeight: "600", color: "#222" },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sexoRow: { flexDirection: "row", gap: 10 },
  sexoBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sexoBtnActive: { backgroundColor: "#00780a", borderColor: "#00780a" },
  sexoBtnText: { color: "#00780a", fontWeight: "600" },
  addBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#00780a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "700" },
  vacinaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 10,
    padding: 10,
  },
  vacinaTitle: { fontWeight: "700", color: "#000" },
  vacinaLine: { color: "#333" },
  removeBtn: {
    backgroundColor: "#d7263d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: "#00780a",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    maxWidth: 800,
    textAlign: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "800" },
});