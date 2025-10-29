// app/forms/formularioEvento.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
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

// ✅ imports RELATIVOS
import {
  atualizarEvento,
  criarEvento,
  excluirEvento,
  obterEvento,
  type AnimalEvent,
  type EventType,
} from "../../services/eventoService";
import { criarVacina } from "../../services/vacinaService";

/* Helpers simples de data (YYYY-MM-DD) */
function pad(n: number) { return String(n).padStart(2, "0"); }
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseISO(s?: string) {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

/* Campo de data multiplataforma */
function ISODateField({
  label,
  value,
  onChange,
  maxDate,
  minDate,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxDate?: Date;
  minDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const date = parseISO(value) ?? new Date();

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>

      {Platform.OS === "web" ? (
        // @ts-ignore (DOM)
        <input
          type="date"
          value={value}
          max={maxDate ? toISO(maxDate) : undefined}
          min={minDate ? toISO(minDate) : undefined}
          onChange={(e: any) => onChange(e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <>
          <Pressable onPress={() => setOpen(true)}>
            <TextInput value={value} editable={false} style={styles.input} placeholder="YYYY-MM-DD" />
          </Pressable>
          {open && (
            <DateTimePicker
              mode="date"
              value={date}
              onChange={(_, d) => {
                if (d) onChange(toISO(d));
                setOpen(false);
              }}
              maximumDate={maxDate}
              minimumDate={minDate}
            />
          )}
        </>
      )}
    </View>
  );
}

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

export default function FormularioEvento() {
  const router = useRouter();
  const { animalId, id } = useLocalSearchParams<{ animalId: string; id?: string }>();

  const editando = Boolean(id);
  const [salvando, setSalvando] = React.useState(false);

  // campos do evento
  const [tipo, setTipo] = React.useState<EventType>("OCORRENCIA");
  const [data, setData] = React.useState<string>(toISO(new Date()));
  const [descricao, setDescricao] = React.useState("");

  // campos extras quando tipo = VACINA (salvos na tabela "vacinas")
  const [vacinaNome, setVacinaNome] = React.useState("");
  const [vacinaLote, setVacinaLote] = React.useState("");
  const [vacinaValidade, setVacinaValidade] = React.useState<string>("");

  const [mostrarValidade, setMostrarValidade] = React.useState(false);

  // Preload quando editar
  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const ev = await obterEvento(String(id));
        setTipo(ev.tipo);
        setData(ev.data_do_evento);       // ✅ nome correto
        setDescricao(ev.descricao ?? "");
        // Obs.: dados de vacina não estão em "eventos", por isso não dá pra pré-carregar
        // vacinaNome/lote/validade aqui sem buscar na tabela "vacinas". Mantemos em branco.
      } catch (e: any) {
        Alert.alert("Erro", e.message ?? "Falha ao carregar evento.");
      }
    })();
  }, [id]);

  const obrigatoriosOk = !!animalId && !!data && !!tipo;

  async function onSalvar() {
    try {
      if (!obrigatoriosOk) {
        Alert.alert("Campos obrigatórios", "Selecione o tipo e a data.");
        return;
      }
      setSalvando(true);

      const payload: AnimalEvent = {
        id: id ? Number(id) : undefined, // sua PK é int8
        id_animal: String(animalId),
        tipo,
        data_do_evento: data,            // ✅ nome correto
        descricao: descricao || undefined,
      };

      let salvo: AnimalEvent;
      if (payload.id) {
        salvo = await atualizarEvento(payload.id, payload);
      } else {
        salvo = await criarEvento(payload);
      }

      // Se for VACINA, grava na tabela "vacinas"
      if (tipo === "VACINA" && vacinaNome.trim()) {
        // calcular validade em dias (opcional)
        let validadeDias: number | null = null;
        const dAplic = parseISO(data);
        const dVal = parseISO(vacinaValidade);
        if (dAplic && dVal) {
          const diff = Math.round((dVal.getTime() - dAplic.getTime()) / (1000 * 60 * 60 * 24));
          validadeDias = isNaN(diff) ? null : Math.max(diff, 0);
        }

        await criarVacina({
          animal_id: String(animalId),
          tipo: vacinaNome.trim(),
          data_aplicacao: data,
          validade_dias: validadeDias ?? null,
        });
      }

      Alert.alert("Sucesso", "Evento salvo!");
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar o evento.");
    } finally {
      setSalvando(false);
    }
  }

  function onExcluir() {
    if (!id) return;
    Alert.alert("Excluir", "Deseja excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirEvento(String(id));
            Alert.alert("Pronto", "Evento excluído.");
            router.back();
          } catch (e: any) {
            Alert.alert("Erro", e.message ?? "Falha ao excluir.");
          }
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
    >
      <Stack.Screen options={{ title: editando ? "Editar evento" : "Novo evento" }} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Tipo */}
        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.rowWrap}>
          {TIPOS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTipo(t)}
              style={[
                styles.chip,
                tipo === t && { backgroundColor: "#00780a", borderColor: "#00780a" },
              ]}
            >
              <Text style={[styles.chipText, tipo === t && { color: "#fff" }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Data */}
        <ISODateField
          label="Data do evento *"
          value={data}
          onChange={setData}
          maxDate={new Date()}
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { minHeight: 90 }]}
          multiline
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Observações..."
        />

        {/* Campos extras quando for vacina */}
        {tipo === "VACINA" && (
          <View style={{ gap: 10, marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Dados da vacina</Text>

            <Text style={styles.label}>Nome da vacina *</Text>
            <TextInput
              style={styles.input}
              value={vacinaNome}
              onChangeText={setVacinaNome}
              placeholder="Aftosa, Raiva..."
            />

            <Text style={styles.label}>Lote (opcional)</Text>
            <TextInput
              style={styles.input}
              value={vacinaLote}
              onChangeText={setVacinaLote}
              placeholder="Ex.: L123"
            />

            <Text style={styles.label}>Validade (opcional)</Text>
            <Pressable onPress={() => setMostrarValidade(true)}>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Selecione a validade"
                value={vacinaValidade}
              />
            </Pressable>

            {mostrarValidade && (
              <DateTimePicker
                mode="date"
                value={vacinaValidade ? (parseISO(vacinaValidade) ?? new Date()) : new Date()}
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(_, d) => {
                  setMostrarValidade(false);
                  if (d) setVacinaValidade(toISO(d));
                }}
              />
            )}

          </View>
        )}

        {/* Ações */}
        <Pressable
          onPress={onSalvar}
          style={[styles.btn, { backgroundColor: "#00780a" }]}
        >
          <Text style={styles.btnText}>
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar evento"}
          </Text>
        </Pressable>

        {editando ? (
          <Pressable onPress={onExcluir} style={[styles.btn, { backgroundColor: "#dc2626" }]}>
            <Text style={styles.btnText}>Excluir evento</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  label: { fontWeight: "600", color: "#222" },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  webInput: {
    width: "100%",
    display: "block",
    boxSizing: "border-box",
    background: "#f9f9f9",
    border: "1px solid #ccc",
    borderRadius: 10,
    padding: "10px 12px",
    height: 44,
    outline: "none",
  } as any,
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: { color: "#00780a", fontWeight: "600" },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#00780a" },
  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "800" },
});