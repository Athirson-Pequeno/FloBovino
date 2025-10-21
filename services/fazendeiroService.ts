import { supabase } from '../config/supabase_config';

export type Endereco = {
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  complemento?: string;
};

export type Fazendeiro = {
  nome: string;
  email: string;
  senha: string;
  endereco: Endereco;
};

// Cria o usuário no Auth, atualiza a tabela usuarios e salva os dados extras em fazendeiros
export async function salvarFazendeiro(fazendeiro: Fazendeiro) {
  try {
    // 1️⃣ Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: fazendeiro.email,
      password: fazendeiro.senha,
    });

    // Trata o caso de e-mail já existente
    if (authError) {
      if (
        authError.message?.toLowerCase().includes('user already registered') ||
        authError.message?.toLowerCase().includes('already registered')
      ) {
        throw new Error('Já existe um usuário cadastrado com este e-mail.');
      }
      throw authError;
    }

    const userId = authData.user?.id;
    if (!userId) throw new Error('Usuário não retornado pelo Supabase Auth.');

    // 2️⃣ Atualizar o perfil base na tabela "usuarios" (trigger já criou a linha)
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        nome: fazendeiro.nome,
        tipo: 'fazendeiro',
        email: fazendeiro.email, // caso tenha adicionado este campo na tabela
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 3️⃣ Inserir dados adicionais na tabela "fazendeiros"
    const { error: insertError } = await supabase.from('fazendeiros').insert([
      {
        id: userId, // mantém o vínculo 1-1
        numero: fazendeiro.endereco.numero,
        bairro: fazendeiro.endereco.bairro,
        cep: fazendeiro.endereco.cep,
        cidade: fazendeiro.endereco.cidade,
        estado: fazendeiro.endereco.estado,
        complemento: fazendeiro.endereco.complemento || null,
      },
    ]);

    if (insertError) throw insertError;

    return { success: true, userId };
  } catch (err: any) {
    console.error('Erro ao salvar fazendeiro:', err);
    throw err;
  }
}
