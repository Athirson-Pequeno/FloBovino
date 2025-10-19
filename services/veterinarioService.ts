// services/fazendeiroService.ts
import { supabase } from '../config/supabase_config';

export type Veterinario = {
  crmv: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
};

export async function salvarVeterinario(veterinario: Veterinario) {
  try {
    const { data, error } = await supabase
      .from('veterinarios')
      .insert([
        {
          nome: veterinario.nome,
          crmv: veterinario.crmv,
          email: veterinario.email,
          telefone: veterinario.telefone,
          numero: veterinario.endereco.numero,
          bairro: veterinario.endereco.bairro,
          cep: veterinario.endereco.cep,
          cidade: veterinario.endereco.cidade,
          estado: veterinario.endereco.estado,
          complemento: veterinario.endereco.complemento || null,
        },
      ]);

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error('Erro ao salvar fazendeiro:', err.message);
    throw err;
  }
}
