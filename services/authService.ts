import { supabase } from "../config/supabase_config";

export type Fazendeiro = {
  id: string;
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

// Login
export async function loginFazendeiro(email: string, senha: string) {
  const { data, error } = await supabase
    .from("fazendeiros")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error || !data) throw new Error("Email ou senha inválidos");

  return data as Fazendeiro;
}

// Buscar por ID
export async function getFazendeiroById(id: string) {
  const { data, error } = await supabase
    .from("fazendeiros")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Fazendeiro;
}