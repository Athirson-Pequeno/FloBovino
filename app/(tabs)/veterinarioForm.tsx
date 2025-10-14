import React, { ChangeEvent, useState } from 'react';

interface veterinarioEndereco {
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    complemento?: string;
    
}

interface veterinario {
    crmv: string;
    nome: string;
    email: string;
    telefone: string;
    endereco: veterinarioEndereco;
}

export const VeterinarioForm: React.FC = () => { 
    const [veterinario, setVeterinario] = useState<veterinario>({   
        crmv: '',
        nome: '',
        email: '',
        telefone: '',
        endereco: {
            numero: '',
            bairro: '',
            cep: '',
            cidade: '',
            estado: '',
            complemento: '',
        },
    });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log('Dados do veterinário:', veterinario);
    alert('Veterinário cadastrado com sucesso!');
    setVeterinario({
      crmv: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: {
        numero: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
        complemento: '',
      },
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    const enderecoFields = ['bairro', 'cidade', 'cep', 'numero', 'estado', 'complemento'];

    if (enderecoFields.includes(name)) {
      setVeterinario(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));
    } else {
      setVeterinario(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro de Veterinário</h2>
      <label>
        CRMV *:
        <input
          type="text"
          name="crmv"
          value={veterinario.crmv}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Nome *:
        <input
          type="text"
          name="nome"
          value={veterinario.nome}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Email *:
        <input
          type="email"
          name="email"
          value={veterinario.email}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <fieldset>
        <legend>Endereço</legend>
        <label>
          Bairro *:
          <input
            type="text"
            name="bairro"
            value={veterinario.endereco.bairro}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Cidade *:
          <input
            type="text"
            name="cidade"
            value={veterinario.endereco.cidade}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          CEP *:
          <input
            type="text"
            name="cep"
            value={veterinario.endereco.cep}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Número *:
          <input
            type="text"
            name="numero"
            value={veterinario.endereco.numero}
            onChange={handleChange}
            required
          />
        </label>
      </fieldset>
      <br />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default VeterinarioForm;