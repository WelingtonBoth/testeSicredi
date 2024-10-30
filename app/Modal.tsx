import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from '../app/styles/Home.module.css';

interface Financa {
  potentialExposure: string;
  monthlyDebt: string;
  realStateNetWorth: string;
  vehiclesNetWorth: string;
  investmentsNetWorth: string;
  fundsInvestments: string;
  termDepositsInvestments: string;
  immediateDepositsInvestments: string;
  id: string;
  cadastroId: string;
}

interface Dados {
  id: string;
  name: string;
  role: string;
  doc: string;
  tier: string;
  monthlyIncome: string;
  fullAddress: string;
  email: string;
  associatedSince: string;
  monthlyScr: string;
  internalStrikes: string;
  externalStrikes: string;
  status: string;
  financas: Financa[];
}

interface propriedadesModal {
  isOpen: boolean;
  onClose: () => void;
  dados: Dados[];
}

const Modal: React.FC<propriedadesModal> = ({ isOpen, onClose, dados }) => {
  const modalRef = useRef<HTMLDivElement | null>(null); // Ref para o modal

  if (!isOpen) return null;

  const downloadPDF = async () => {
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current); // Captura a área do modal
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Largura da imagem
      const pageHeight = pdf.internal.pageSize.height; // Altura da página
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura proporcional da imagem
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight); // Adiciona imagem ao PDF
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("consultas_de_credito.pdf"); // Salva o PDF
    }
  };

  // Consolidar finanças por pessoa
  const dadosConsolidados: { [key: string]: Dados & { financasConsolidadas: Financa } } = {};

  dados.forEach(item => {
    const existeDados = dadosConsolidados[item.id];

    if (!existeDados) {
        dadosConsolidados[item.id] = {
        ...item,
        financasConsolidadas: { 
          potentialExposure: '0',
          monthlyDebt: '0',
          realStateNetWorth: '0',
          vehiclesNetWorth: '0',
          investmentsNetWorth: '0',
          fundsInvestments: '0',
          termDepositsInvestments: '0',
          immediateDepositsInvestments: '0',
          id: '',
          cadastroId: '',
        }
      };
    }

    item.financas.forEach(financa => {
        dadosConsolidados[item.id].financasConsolidadas.potentialExposure = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.potentialExposure) + parseFloat(financa.potentialExposure)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.monthlyDebt = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.monthlyDebt) + parseFloat(financa.monthlyDebt)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.realStateNetWorth = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.realStateNetWorth) + parseFloat(financa.realStateNetWorth)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.vehiclesNetWorth = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.vehiclesNetWorth) + parseFloat(financa.vehiclesNetWorth)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.investmentsNetWorth = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.investmentsNetWorth) + parseFloat(financa.investmentsNetWorth)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.fundsInvestments = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.fundsInvestments) + parseFloat(financa.fundsInvestments)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.termDepositsInvestments = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.termDepositsInvestments) + parseFloat(financa.termDepositsInvestments)).toFixed(2);
        dadosConsolidados[item.id].financasConsolidadas.immediateDepositsInvestments = (parseFloat(dadosConsolidados[item.id].financasConsolidadas.immediateDepositsInvestments) + parseFloat(financa.immediateDepositsInvestments)).toFixed(2);
    });
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.header}>
          <h2 style={{ margin: 0 }}>Consultas de Crédito</h2>
          <div className={styles.headerButtons}>
            <button className={styles.downloadButton} onClick={downloadPDF}>Baixar PDF</button>
            <button className={styles.closeButton} onClick={onClose}>X</button>
          </div>
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.personalInfoContainer}>
            <h4> Dados individuais </h4>
            {Object.values(dadosConsolidados).map(item => (
              <div key={item.id} className={styles.dataItem}>
                <div className={styles.personalInfo}>
                  <h3>{item.name} <span>({item.role})</span></h3>
                  <p><strong>Documento:</strong> {item.doc}</p>
                  <p><strong>Nível:</strong> {item.tier}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Renda Mensal:</strong> R$ {item.monthlyIncome}</p>
                  <p><strong>E-mail:</strong> {item.email}</p>
                  <p><strong>Endereço:</strong> {item.fullAddress}</p>
                  <p><strong>Atualização cadastral:</strong> {item.associatedSince}</p>
                  <p><strong>Situação de Crédito (SCR):</strong> R$ {item.monthlyScr}</p>
                  <p><strong>Restrições Internas:</strong> {item.internalStrikes}</p>
                  <p><strong>Restrições Externas:</strong> {item.externalStrikes}</p>
                  <hr/>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.financasContainer}>
            <h4>Finanças</h4>
            {Object.values(dadosConsolidados).map(item => (
              <div key={item.id}>
                <h5>{item.name}</h5>
                <div className={styles.financaItem}>
                  <p><strong>Exposição Potencial:</strong> R$ {item.financasConsolidadas.potentialExposure}</p>
                  <p><strong>Dívida Mensal:</strong> R$ {item.financasConsolidadas.monthlyDebt}</p>
                  <p><strong>Patrimônio Imobiliário:</strong> R$ {item.financasConsolidadas.realStateNetWorth}</p>
                  <p><strong>Valor de Veículos:</strong> R$ {item.financasConsolidadas.vehiclesNetWorth}</p>
                  <p><strong>Investimentos:</strong> R$ {item.financasConsolidadas.investmentsNetWorth}</p>
                  <p><strong>Fundos:</strong> R$ {item.financasConsolidadas.fundsInvestments}</p>
                  <p><strong>Depósitos a Prazo:</strong> R$ {item.financasConsolidadas.termDepositsInvestments}</p>
                  <p><strong>Depósitos Imediatos:</strong> R$ {item.financasConsolidadas.immediateDepositsInvestments}</p>
                  <hr/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
