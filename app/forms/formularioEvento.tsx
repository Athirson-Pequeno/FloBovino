import { atualizarEvento, criarEvento, excluirEvento, obterEvento } from "@/services/eventoService";
import { AnimalEvent, EventType } from "@/types/evento";
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ===================== Utils de data (ISO yyyy-mm-dd) ===================== */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function isoToDate(iso?: string): Date {
  if (!iso) return new Date();
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isNaN(dt.getTime()) ? new Date() : dt;
}
function isoToBR(iso?: string) {
  const d = isoToDate(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/* ===================== Campo de Data Universal (ISO) ===================== */
function DateFieldISO({
  label,
  valueISO,
  onChangeISO,
  minDate,
  maxDate,
}: {
  label: string;
  valueISO: string;                // yyyy-mm-dd
  onChangeISO: (nextISO: string) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const [iosOpen, setIosOpen] = useState(false);
  const [temp, setTemp] = useState<Date>(isoToDate(valueISO));

  useEffect(() => {
    setTemp(isoToDate(valueISO));
  }, [valueISO]);

  const iosDisplay = useMemo(() => {
    if (Platform.OS !== "ios") return "default";
    const v = parseFloat(String(Platform.Version));
    return !isNaN(v) && v >= 14 ? "inline" : "spinner";
  }, []);

  const openAndroidPicker = () => {
    // Usa o diálogo nativo — evita qualquer interação acidental com outros inputs
    DateTimePickerAndroid.open({
      value: isoToDate(valueISO || toISO(new Date())),
      onChange: (_: DateTimePickerEvent, d?: Date) => {
        if (d) onChangeISO(toISO(d));
      },
      mode: "date",
      minimumDate: minDate,
      maximumDate: maxDate,
      display: "calendar",
    });
  };

  // WEB: <input type="date">
  if (Platform.OS === "web") {
    return (
      <View style={{ gap: 6 }}>
        <Text style={styles.label}>{label}</Text>
        {/* @ts-ignore (DOM) */}
        <input
          type="date"
          value={valueISO || ""}
          onChange={(e: any) => onChangeISO(e.target.value)}
          min={minDate ? toISO(minDate) : undefined}
          max={maxDate ? toISO(maxDate) : undefined}
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

  // ANDROID: sem Modal; usa DateTimePickerAndroid.open
  if (Platform.OS === "android") {
    return (
      <View style={{ gap: 6 }}>
        <Text style={styles.label}>{label}</Text>
        <Pressable onPress={openAndroidPicker} style={styles.input}>
          <Text style={{ color: valueISO ? "#111" : "#999" }}>
            {valueISO ? isoToBR(valueISO) : "Selecionar data"}
          </Text>
        </Pressable>
      </View>
    );
  }

  // iOS: Modal + DateTimePicker (inline/spinner)
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setIosOpen(true)} style={styles.input}>
        <Text style={{ color: valueISO ? "#111" : "#999" }}>
          {valueISO ? isoToBR(valueISO) : "Selecionar data"}
        </Text>
      </Pressable>

      {iosOpen && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setIosOpen(false)}>
          <View style={pickerStyles.backdrop}>
            <View style={pickerStyles.sheet}>
              <DateTimePicker
                value={temp}
                mode="date"
                display={iosDisplay as any}
                onChange={(_: DateTimePickerEvent, d?: Date) => {
                  if (d) setTemp(d);
                }}
                minimumDate={minDate}
                maximumDate={maxDate}
                themeVariant="light"
                accentColor="#00780a"
                style={{ backgroundColor: "#fff" }}
              />
              <View style={pickerStyles.actions}>
                <TouchableOpacity onPress={() => setIosOpen(false)}>
                  <Text style={pickerStyles.actionTextSecondary}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onChangeISO(toISO(temp));
                    setIosOpen(false);
                  }}
                >
                  <Text style={pickerStyles.actionText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

/* ===================== Styles do picker ===================== */
const pickerStyles = StyleSheet.create({
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
    paddingBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 8,
  },
  actionText: { color: "#00780a", fontWeight: "700" },
  actionTextSecondary: { color: "#555", fontWeight: "600" },
});

/* ===================== Form de Evento ===================== */
const TIPOS: EventType[] = [
  "VACINA",
  "PESAGEM",
  "CONSULTA",
  "MEDICACAO",
  "REPRODUCAO",
  "OCORRENCIA",
  "NASCIMENTO",
  "BAIXA",
];

export default function FormEvento() {
  const { animalId, id } = useLocalSearchParams<{ animalId: string; id?: string }>();
  const router = useRouter();

  const [tipo, setTipo] = useState<EventType>("VACINA");
  const [dataEvento, setDataEvento] = useState<string>(toISO(new Date())); // ISO
  const [descricao, setDescricao] = useState("");

  // campos vacina
  const [vacinaNome, setVacinaNome] = useState("");
  const [vacinaLote, setVacinaLote] = useState("");
  const [vacinaValidade, setVacinaValidade] = useState<string>(""); // ISO opcional

  const editando = Boolean(id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const ev = await obterEvento(id);
      setTipo(ev.tipo);
      setDataEvento(ev.data_evento || toISO(new Date()));
      setDescricao(ev.descricao ?? "");
      setVacinaNome(ev.vacina_nome ?? "");
      setVacinaLote(ev.vacina_lote ?? "");
      setVacinaValidade(ev.vacina_validade ?? "");
    })();
  }, [id]);

  function montarPayload(): AnimalEvent {
    const base: AnimalEvent = {
      animal_id: animalId,
      tipo,
      data_evento: dataEvento,
      descricao: descricao || undefined,
    };
    if (tipo === "VACINA") {
      base.vacina_nome = vacinaNome || undefined;
      base.vacina_lote = vacinaLote || undefined;
      base.vacina_validade = vacinaValidade || undefined;
      if (!base.vacina_nome) {
        Alert.alert("Vacina", "Informe o nome da vacina.");
        throw new Error("validacao");
      }
    }
    return base;
  }

  async function salvar() {
    try {
      const payload = montarPayload();
      if (editando) await atualizarEvento(id!, payload);
      else await criarEvento(payload);
      router.back();
    } catch (e: any) {
      if (e.message !== "validacao") Alert.alert("Erro", e.message ?? "Falha ao salvar");
    }
  }

  async function apagar() {
    if (!id) return;
    Alert.alert("Excluir", "Deseja excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await excluirEvento(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {editando ? "Editar Evento" : "Novo Evento"}
      </Text>

      {/* Tipo */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: "600" }}>Tipo</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TIPOS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTipo(t)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor: tipo === t ? "#1e90ff" : "#e5e7eb",
              }}
            >
              <Text style={{ color: tipo === t ? "#fff" : "#111827", fontWeight: "600" }}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Data do evento (ISO) */}
      <DateFieldISO
        label="Data do evento"
        valueISO={dataEvento}
        onChangeISO={setDataEvento}
      />

      {/* Descrição */}
      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: "600" }}>Descrição</Text>
        <TextInput
          placeholder="observações..."
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          multiline
        />
      </View>

      {/* Campos de Vacina */}
      {tipo === "VACINA" && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Vacina</Text>

          <Text style={styles.label}>Nome *</Text>
          <TextInput
            value={vacinaNome}
            onChangeText={setVacinaNome}
            placeholder="Ex.: Raiva, Brucelose..."
            style={styles.input}
          />

          <Text style={styles.label}>Lote (opcional)</Text>
          <TextInput
            value={vacinaLote}
            onChangeText={setVacinaLote}
            placeholder="Lote"
            style={styles.input}
          />

          <DateFieldISO
            label="Validade (opcional)"
            valueISO={vacinaValidade || ""}
            onChangeISO={setVacinaValidade}
            minDate={isoToDate(dataEvento)}
          />
        </View>
      )}

      {/* Ações */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        {editando && (
          <Pressable onPress={apagar} style={{ backgroundColor: "#ef4444", padding: 12, borderRadius: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Excluir</Text>
          </Pressable>
        )}
        <Pressable onPress={salvar} style={{ backgroundColor: "#16a34a", padding: 12, borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>{editando ? "Salvar" : "Criar"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ===================== estilos compartilhados ===================== */
const styles = StyleSheet.create({
  label: { fontWeight: "600", color: "#222" },
  input: {
    backgroundColor: "#f4f4f5",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});