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
    <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2 style={{ textAlign: 'center' }}>Cadastro de Veterinário</h2>
        <div style={{ marginBottom: 12 }}>
          <label>
            CRMV *:<br />
            <input
              type="text"
              name="crmv"
              value={veterinario.crmv}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Nome *:<br />
            <input
              type="text"
              name="nome"
              value={veterinario.nome}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email *:<br />
            <input
              type="email"
              name="email"
              value={veterinario.email}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Telefone *:<br />
            <input
              type="text"
              name="telefone"
              value={veterinario.telefone}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <fieldset style={{ marginBottom: 16, padding: 12 }}>
          <legend>Endereço</legend>
          <div style={{ marginBottom: 8 }}>
            <label>
              Bairro *:<br />
              <input
                type="text"
                name="bairro"
                value={veterinario.endereco.bairro}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Cidade *:<br />
              <input
                type="text"
                name="cidade"
                value={veterinario.endereco.cidade}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Estado *:<br />
              <input
                type="text"
                name="estado"
                value={veterinario.endereco.estado}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              CEP *:<br />
              <input
                type="text"
                name="cep"
                value={veterinario.endereco.cep}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Número *:<br />
              <input
                type="text"
                name="numero"
                value={veterinario.endereco.numero}
                onChange={handleChange}
                required
                style={{ width: '100%' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Complemento:<br />
              <input
                type="text"
                name="complemento"
                value={veterinario.endereco.complemento}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </label>
          </div>
        </fieldset>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={{ padding: '8px 24px', fontSize: 16 }}>Cadastrar</button>
        </div>
      </form>
    </div>
  );
};

export default VeterinarioForm;