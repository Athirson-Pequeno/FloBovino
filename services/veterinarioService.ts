import { supabase } from '../config/supabase_config';

export type Veterinario = {
  crmv: string;
  nome: string;
  email: string;
  senha: string;
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
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: veterinario.email,
      password: veterinario.senha,
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

    // Atualizar perfil base
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        nome: veterinario.nome,
        tipo: 'veterinario',
        email: veterinario.email,
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    //Inserir dados adicionais
    const { error } = await supabase.from('veterinarios').insert([
      {
        id: userId,
        crmv: veterinario.crmv,
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
    return { success: true, userId };
  } catch (err: any) {
    console.error('Erro ao salvar veterinário:', err.message);
    throw err;
  }
}
