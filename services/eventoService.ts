// services/eventoService.ts
import { supabase } from "../config/supabase_config";

export type EventType =
  | "VACINA"
  | "PESAGEM"
  | "CONSULTA"
  | "MEDICACAO"
  | "REPRODUCAO"
  | "OCORRENCIA"
  | "NASCIMENTO"
  | "BAIXA";

export interface AnimalEvent {
  id?: number | string;     // sua tabela usa int8
  id_animal: string;        // FK (uuid) para animais.id
  tipo: EventType;
  data_do_evento: string;   // 'YYYY-MM-DD'
  descricao?: string;

  // se você NÃO usa colunas de vacina em 'eventos', pode remover estes 3
  vacina_nome?: string;
  vacina_lote?: string;
  vacina_validade?: string; // 'YYYY-MM-DD'
}

const TABLE = "eventos";

export async function listarEventosPorAnimal(animalId: string): Promise<AnimalEvent[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id_animal", animalId)
    .order("data_do_evento", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AnimalEvent[];
}

export async function obterEvento(id: number | string): Promise<AnimalEvent> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as AnimalEvent;
}

export async function criarEvento(input: AnimalEvent): Promise<AnimalEvent> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as AnimalEvent;
}

export async function atualizarEvento(id: number | string, patch: Partial<AnimalEvent>): Promise<AnimalEvent> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as AnimalEvent;
}

export async function excluirEvento(id: number | string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}