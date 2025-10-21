import { supabase } from "../config/supabase_config";

export type Vacina = {
  data_aplicacao: string;
  tipo: string;
  validade_dias?: string;
};

export type Animal = {
  nome: string;
  raca: string;
  sexo: "M" | "F";
  data_nascimento: string;
  pai_nome?: string;
  pai_registro?: string;
  pai_raca?: string;
  mae_nome?: string;
  mae_registro?: string;
  mae_raca?: string;
  vacinas?: Vacina[];
};

export async function salvarAnimal(animal: Animal) {
  try {
    // 1️⃣ Pega usuário logado
    const user = supabase.auth.getUser();
    if (!user) throw new Error("Usuário não logado.");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const fazendeiroId = userData.user?.id;
    if (!fazendeiroId) throw new Error("Não foi possível identificar o usuário.");

    // 2️⃣ Insere o animal
    const { data: animalData, error: animalError } = await supabase
      .from("animais")
      .insert([
        {
          nome: animal.nome,
          raca: animal.raca,
          sexo: animal.sexo,
          data_nascimento: animal.data_nascimento,
          pai_nome: animal.pai_nome || null,
          pai_registro: animal.pai_registro || null,
          pai_raca: animal.pai_raca || null,
          mae_nome: animal.mae_nome || null,
          mae_registro: animal.mae_registro || null,
          mae_raca: animal.mae_raca || null,
          fazendeiro_id: fazendeiroId,
        },
      ])
      .select()
      .single();

    if (animalError) throw animalError;

    const animalId = animalData.id;

    // 3️⃣ Insere as vacinas, se houver
    if (animal.vacinas && animal.vacinas.length > 0) {
      const vacinasToInsert = animal.vacinas.map((v) => ({
        animal_id: animalId,
        tipo: v.tipo,
        data_aplicacao: v.data_aplicacao,
        validade_dias: v.validade_dias || null,
      }));

      const { error: vacinaError } = await supabase
        .from("vacinas")
        .insert(vacinasToInsert);

      if (vacinaError) throw vacinaError;
    }

    return animalData;
  } catch (err: any) {
    console.error("Erro ao salvar animal:", err.message);
    throw err;
  }
}

// Função para listar os animais do usuário logado
export async function listarAnimaisDoUsuario() {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const fazendeiroId = userData.user?.id;
    if (!fazendeiroId) return [];

    const { data, error } = await supabase
      .from("animais")
      .select("*, vacinas(*)")
      .eq("fazendeiro_id", fazendeiroId);

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error("Erro ao listar animais:", err.message);
    throw err;
  }
}
