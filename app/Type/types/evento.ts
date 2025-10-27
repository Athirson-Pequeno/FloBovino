export type EventType =
  | 'VACINA' | 'PESAGEM' | 'CONSULTA' | 'MEDICACAO'
  | 'REPRODUCAO' | 'OCORRENCIA' | 'NASCIMENTO' | 'BAIXA';

export interface AnimalEvent {
  id?: string;
  animal_id: string;
  tipo: EventType;
  data_evento: string;  // ISO 'YYYY-MM-DD'
  descricao?: string;

  // somente quando tipo = 'VACINA'
  vacina_nome?: string;
  vacina_lote?: string;
  vacina_validade?: string; // 'YYYY-MM-DD'
}