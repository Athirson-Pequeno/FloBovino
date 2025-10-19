import { supabase } from '../config/supabase_config';

export type Fazendeiro = {
  nome: string;
  email: string;
  senha: string;
  endereco: {
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    complemento?: string;
  };
};

// Cria o usuário no Auth e salva os dados extras na tabela
export async function salvarFazendeiro(fazendeiro: Fazendeiro) {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: fazendeiro.email,
      password: fazendeiro.senha,
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('Usuário não retornado pelo Supabase Auth');

    // 2. Salvar os dados extras na tabela fazendeiros
    const { data, error } = await supabase.from('fazendeiros').insert([
      {
        id: userId, // relaciona com o Auth
        nome: fazendeiro.nome,
        numero: fazendeiro.endereco.numero,
        bairro: fazendeiro.endereco.bairro,
        cep: fazendeiro.endereco.cep,
        cidade: fazendeiro.endereco.cidade,
        estado: fazendeiro.endereco.estado,
        complemento: fazendeiro.endereco.complemento || null,
      },
    ]);

    if (error) throw error;

    return data;
  } catch (err: any) {
    throw err;
  }
}
