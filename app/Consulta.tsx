// app/Consulta.tsx
"use client"; // Indica que é um componente do lado do cliente

import React, { useEffect, useState } from 'react';
import styles from '../app/styles/Home.module.css'; // Certifique-se de que o caminho está correto


const Consulta: React.FC = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Carregando inicialmente
  const [error, setError] = useState<string | null>(null); // Estado para controle de erro

  useEffect(() => {
    const storedData = localStorage.getItem('dados'); // Obtém os dados do localStorage
    if (storedData) {
      setDados(JSON.parse(storedData)); // Armazena os dados recebidos
    } else {
      setError('Nenhum dado encontrado.'); // Define a mensagem de erro
    }
    setLoading(false); // Finaliza o carregamento
  }, []);

  return (
    <div className={styles.container}>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dados.length > 0 && (
        <ul>
          {dados.map((item) => (
            <li key={item.id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', margin: '10px 0', backgroundColor: '#fff' }}>
              <strong>Nome:</strong> {item.name}<br />
              <strong>Papel:</strong> {item.role}<br />
              <strong>Documento:</strong> {item.doc}<br />
              <strong>Nível:</strong> {item.tier}<br />
              <strong>Avaliação Preferencial:</strong> {item.prefereneRating}<br />
              <strong>Status:</strong> {item.status}<br />
              <strong>MC:</strong> {item.mc}<br />
              <strong>Risco:</strong> {item.risk}<br />
              <strong>Renda Mensal:</strong> {item.monthlyIncome}<br />
              <strong>Endereço Completo:</strong> {item.fullAddress}<br />
              <strong>Última Atualização:</strong> {item.lastUpdate}<br />
              <strong>Associado Desde:</strong> {item.associatedSince}<br />
              <strong>SCR Mensal:</strong> {item.monthlyScr}<br />
              <strong>Restrições Internas:</strong> {item.internalStrikes}<br />
              <strong>Restrições Externas:</strong> {item.externalStrikes}<br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Consulta;
