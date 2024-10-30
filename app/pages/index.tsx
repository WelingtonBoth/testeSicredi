// pages/index.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]); // Estado para armazenar os dados
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para controle de erro

  const handleClick = async () => {
    setLoading(true); // Inicia o carregamento
    setError(null); // Reseta o erro

    try {
      const response = await axios.get('https://6720cc1898bbb4d93ca61460.mockapi.io/sicredi/v1/cadastro');
      setDados(response.data); // Armazena os dados recebidos
    } catch (err) {
      setError('Erro ao buscar dados.'); // Define a mensagem de erro
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleClick}>
        Visualizar Consulta
      </button>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dados.length > 0 && (
        <ul>
          {dados.map((item) => (
            <li key={item.id}>
              <strong>Nome:</strong> {item.nome}<br />
              <strong>CPF:</strong> {item.cpf}<br />
              <strong>Email:</strong> {item.email}<br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
