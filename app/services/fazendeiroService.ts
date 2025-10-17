// services/fazendeiroService.ts
import { supabase } from '../config/supabase_config';

export type Fazendeiro = {
  nome: string;
  email: string;
  endereco: {
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
};

export async function salvarFazendeiro(fazendeiro: Fazendeiro) {
  try {
    const { data, error } = await supabase
      .from('fazendeiros')
      .insert([
        {
          nome: fazendeiro.nome,
          email: fazendeiro.email,
          numero: fazendeiro.endereco.numero,
          bairro: fazendeiro.endereco.bairro,
          cep: fazendeiro.endereco.cep,
          cidade: fazendeiro.endereco.cidade,
          estado: fazendeiro.endereco.estado,
          complemento: fazendeiro.endereco.complemento || null,
        },
      ]);

    if (error) throw error;

    console.log('Fazendeiro salvo com sucesso:', data);
    return data;
  } catch (err: any) {
    console.error('Erro ao salvar fazendeiro:', err.message);
    throw err;
  }
}
