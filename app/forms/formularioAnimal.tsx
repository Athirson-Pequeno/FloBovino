// app/forms/formularioAnimal.tsx
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Calendar, LocaleConfig } from "react-native-calendars";

// Locale PT-BR para o calendário (Android)
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ],
  monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  dayNames: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

import { Animal, obterAnimal, salvarAnimal } from "../../services/animalService";

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
  value: string;        // dd/mm/aaaa
  onChange: (s: string) => void;
  maxDate?: Date;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);              // iOS modal
  const [androidOpen, setAndroidOpen] = useState(false); // Android modal
  const current = parseBR(value) ?? new Date();

  // ======== WEB: input mascarado simples ========
  if (Platform.OS === "web") {
    const [webText, setWebText] = useState<string>(value || "");
    React.useEffect(() => setWebText(value || ""), [value]);

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
      if (next.length === 10) {
        const d = parseBR(next);
        if (d) {
          const clamped = clampByBounds(d, { minDate, maxDate });
          const finalStr = formatBR(clamped);
          setWebText(finalStr);
          onChange(finalStr);
        }
      }
    };

    // @ts-ignore (DOM web)
    return (
      <View style={{ gap: 6 }}>
        <Text style={styles.label}>{label}</Text>
        <input
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/aaaa"
          value={webText}
          onChange={handleWebChange}
          onBlur={() => {
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
            width: "100%",
            display: "block",
            boxSizing: "border-box",
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

  // ======== MOBILE (Android / iOS) ========
  const [tempDate, setTempDate] = useState<Date>(current);

  const openIOS = () => {
    setTempDate(parseBR(value) ?? new Date());
    setOpen(true);
  };
  const confirmIOS = () => {
    const clamped = clampByBounds(tempDate, { minDate, maxDate });
    onChange(formatBR(clamped));
    setOpen(false);
  };

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() =>
          Platform.OS === "android" ? setAndroidOpen(true) : openIOS()
        }
      >
        <TextInput
          value={value}
          placeholder="dd/mm/aaaa"
          editable={false}
          pointerEvents="none"
          style={styles.input}
        />
      </Pressable>

      {/* ANDROID: Modal + Calendar (verde) */}
      {Platform.OS === "android" && (
        <Modal
          transparent
          visible={androidOpen}
          animationType="fade"
          onRequestClose={() => setAndroidOpen(false)}
        >
          <View style={androidStyles.backdrop}>
            <View style={androidStyles.sheet}>
              <Calendar
                initialDate={brToISO(value) || toISODate(new Date())}
                minDate={minDate ? toISODate(minDate) : undefined}
                maxDate={maxDate ? toISODate(maxDate) : undefined}
                onDayPress={(day) => {
                  const d = new Date(day.dateString);
                  const clamped = clampByBounds(d, { minDate, maxDate });
                  onChange(formatBR(clamped));
                  setAndroidOpen(false);
                }}
                markedDates={
                  value
                    ? { [brToISO(value)]: { selected: true, selectedColor: "#00780a" } }
                    : undefined
                }
                theme={{
                  calendarBackground: "#fff",
                  monthTextColor: "#00780a",
                  selectedDayBackgroundColor: "#00780a",
                  selectedDayTextColor: "#fff",
                  todayTextColor: "#00780a",
                  arrowColor: "#00780a",
                  textSectionTitleColor: "#555",
                }}
              />
              <View style={androidStyles.actions}>
                <TouchableOpacity onPress={() => setAndroidOpen(false)}>
                  <Text style={androidStyles.actionText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS: Modal + DateTimePicker nativo */}
      {Platform.OS === "ios" && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.35)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                maxWidth: 360,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={
                  (() => {
                    const v = parseFloat(String(Platform.Version));
                    return isNaN(v) || v < 14 ? "spinner" : "inline";
                  })()
                }
                locale="pt-BR"
                onChange={(_: DateTimePickerEvent, selected?: Date) => {
                  if (selected) setTempDate(selected);
                }}
                maximumDate={maxDate}
                minimumDate={minDate}
                style={{ width: "100%", backgroundColor: "#fff" }}
                themeVariant="light"
                accentColor="#00780a"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Text style={{ color: "#555", fontWeight: "600" }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIOS}>
                  <Text style={{ color: "#00780a", fontWeight: "700" }}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

/* ===================== Estilos Android Modal ===================== */
const androidStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  sheet: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 8,
  },
  actionText: { color: "#00780a", fontWeight: "700" },
});

/* ===================== Tipagem do Form (local) ===================== */
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
  const { id } = useLocalSearchParams<{ id?: string }>(); // edição se vier id

  const [animalId, setAnimalId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

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
  });

  const setField = <K extends keyof AnimalForm>(key: K, value: AnimalForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const obrigatoriosOk =
    !!form.nome.trim() &&
    !!form.raca.trim() &&
    !!form.sexo &&
    !!form.dataNascimento.trim();

  // Carregar dados quando estiver editando
  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const a = await obterAnimal(id);
        setAnimalId(a.id!);
        setForm({
          nome: a.nome ?? "",
          raca: a.raca ?? "",
          sexo: (a.sexo as "M" | "F") ?? "",
          dataNascimento: a.data_nascimento ?? "",
          pai_nome: a.pai_nome ?? "",
          pai_registro: a.pai_registro ?? "",
          pai_raca: a.pai_raca ?? "",
          mae_nome: a.mae_nome ?? "",
          mae_registro: a.mae_registro ?? "",
          mae_raca: a.mae_raca ?? "",
        });
      } catch (e: any) {
        Alert.alert("Erro", e.message ?? "Falha ao carregar animal.");
      }
    })();
  }, [id]);

  const onSalvar = async () => {
    if (!obrigatoriosOk) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha Nome, Raça, Sexo e Data de Nascimento."
      );
      return;
    }

    const animalParaSalvar: Animal = {
      id: animalId ?? undefined,
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
    };

    try {
      setSalvando(true);
      const salvo = await salvarAnimal(animalParaSalvar);
      setAnimalId(salvo.id!);
      Alert.alert("Sucesso", "Animal salvo com sucesso!");
      router.push("../pages/home");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Não foi possível salvar o animal.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={250}
        enableOnAndroid={true}
      >
        <Text style={styles.mainTitle}>
          {animalId ? "Editar Animal" : "Cadastro de Animal"}
        </Text>
        <Text style={styles.subtitle}>
          Preencha as informações abaixo.
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

          {/* Data de Nascimento */}
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

        {/* Botão Eventos (só aparece com id) */}
        {animalId && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({ pathname: "/pages/eventos", params: { animalId } })
            }
            style={[styles.saveBtn, { backgroundColor: "#1e90ff", marginBottom: 8 }]}
          >
            <Text style={styles.saveBtnText}>Ver eventos do animal</Text>
          </TouchableOpacity>
        )}

        {/* Salvar */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSalvar}
          disabled={salvando}
          style={[
            styles.saveBtn,
            salvando && { opacity: 0.6 },
            !obrigatoriosOk && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.saveBtnText}>
            {salvando ? "Salvando..." : (animalId ? "Salvar alterações" : "Salvar Animal")}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
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