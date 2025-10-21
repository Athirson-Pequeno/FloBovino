import { supabase } from '../config/supabase_config';

export async function login(email: string, senha: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('E-mail ou senha incorretos.');
      }
      throw error;
    }

    // Retorna a sessão (token + usuário)
    return data.session;
  } catch (err: any) {
    console.error('Erro ao fazer login:', err.message);
    throw err;
  }
}

export async function logout() {
  await supabase.auth.signOut();
}
