import React, { useState } from "react";

export default function VeterinarioForm() {
  const [veterinario, setVeterinario] = useState({
    crmv: "",
    nome: "",
    email: "",
    telefone: "",
    endereco: {
      numero: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      complemento: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const enderecoFields = ["bairro", "cidade", "cep", "numero", "estado", "complemento"];

    if (enderecoFields.includes(name)) {
      setVeterinario((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value },
      }));
    } else {
      setVeterinario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Veterinário cadastrado com sucesso!");
    console.log("Dados do veterinário:", veterinario);

    setVeterinario({
      crmv: "",
      nome: "",
      email: "",
      telefone: "",
      endereco: {
        numero: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        complemento: "",
      },
    });
  };

  return (
    <div className="page-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Cadastro de Veterinário</h2>

        <div className="input-group">
          <label>CRMV *</label>
          <input
            type="text"
            name="crmv"
            value={veterinario.crmv}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={veterinario.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={veterinario.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Telefone *</label>
          <input
            type="tel"
            name="telefone"
            value={veterinario.telefone}
            onChange={handleChange}
            required
          />
        </div>

        <fieldset>
          <legend>Endereço</legend>

          <div className="input-group">
            <label>Bairro *</label>
            <input
              type="text"
              name="bairro"
              value={veterinario.endereco.bairro}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Cidade *</label>
            <input
              type="text"
              name="cidade"
              value={veterinario.endereco.cidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Estado *</label>
            <input
              type="text"
              name="estado"
              value={veterinario.endereco.estado}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>CEP *</label>
            <input
              type="text"
              name="cep"
              value={veterinario.endereco.cep}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Número *</label>
            <input
              type="text"
              name="numero"
              value={veterinario.endereco.numero}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Complemento</label>
            <input
              type="text"
              name="complemento"
              value={veterinario.endereco.complemento}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <button type="submit">Cadastrar</button>
      </form>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          height: 100vh;
          background-color: #f2f2f2;
          padding: 1rem;
          overflow-y: auto; /* ✅ Barra de rolagem para mobile */
        }

        .form {
          background: white;
          width: 100%;
          max-width: 500px;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        h2 {
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 500;
          margin-bottom: 4px;
          color: #333;
        }

        input {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 1rem;
          width: 100%;
        }

        fieldset {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        legend {
          font-weight: bold;
          padding: 0 8px;
        }

        button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 480px) {
          .form {
            padding: 1rem;
            border-radius: 8px;
          }
          input {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
