"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../app/styles/Home.module.css';
import Modal from './Modal'; // Importa o componente Modal

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dados, setDados] = useState<any[]>([]); // Armazena os dados
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://6720cc1898bbb4d93ca61460.mockapi.io/sicredi/v1/cadastro');
      console.log(response.data)
      setDados(response.data); // Armazena os dados recebidos
      setIsModalOpen(true); // Abre o modal
    } catch (err) {
      setError('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleClick}>
        Visualizar Consulta
      </button>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal isOpen={isModalOpen} onClose={closeModal} dados={dados} />
    </div>
  );
};

export default Home;
