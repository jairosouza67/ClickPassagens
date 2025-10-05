import React from 'react';
import { generatePDF, generateWord } from '../services/documentGenerator';

/**
 * Componente de teste para download de documentos
 * Use este componente para testar rapidamente a geração de PDF/Word
 */
const TestDocumentGenerator = () => {
  
  const testQuote = {
    quoteNumber: "TESTE-001",
    quoteType: "CLIENT",
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    
    flight: {
      airline: "GOL Linhas Aéreas",
      flightNumber: "G3 1234",
      origin: { 
        code: "GRU", 
        name: "São Paulo - Guarulhos" 
      },
      destination: { 
        code: "GIG", 
        name: "Rio de Janeiro - Galeão" 
      },
      departure: { 
        date: "2024-10-10", 
        time: "08:00" 
      },
      return: { 
        date: "2024-10-15", 
        time: "20:00" 
      },
      duration: "1h 10min",
      stops: "Direto",
      class: "Econômica"
    },
    
    pricing: {
      flightPrice: 500.00,
      taxes: { 
        airportTaxes: 100.00 
      },
      total: 600.00,
      
      milesOption: {
        totalMiles: 40000,
        estimatedValue: "R$ 600,00",
        savings: { percentage: "15%" }
      },
      
      paymentMethods: [
        { 
          method: "Dinheiro/PIX", 
          finalPrice: 570.00, 
          discount: "5% de desconto" 
        },
        { 
          method: "Cartão de Crédito", 
          installments: "12x sem juros",
          installmentValue: 50.00
        },
        {
          method: "Milhas",
          miles: 40000,
          taxesCash: 100.00,
          description: "Milhas + taxas"
        }
      ]
    },
    
    passenger: {
      name: "João da Silva",
      email: "joao@exemplo.com",
      phone: "(11) 98765-4321"
    },
    
    agency: {
      name: "ClickPassagens",
      phone: "(11) 99999-9999",
      email: "contato@clickpassagens.com",
      whatsapp: "(11) 99999-9999"
    }
  };
  
  const testInternalQuote = {
    ...testQuote,
    quoteNumber: "INT-TESTE-001",
    quoteType: "INTERNAL",
    
    pricing: {
      ...testQuote.pricing,
      basePrice: 380.00,
      airportTaxes: {
        total: 100.00,
        origin: { code: "GRU", airport: "Guarulhos", amount: 50.00 },
        destination: { code: "GIG", airport: "Galeão", amount: 50.00 }
      },
      subtotal: 480.00,
      
      profit: {
        percentage: "25%",
        amount: 120.00
      },
      
      clientPrice: 600.00,
      
      miles: {
        baseNeeded: 34000,
        profitPercentage: "18%",
        profit: 6120,
        clientTotal: 40120
      }
    },
    
    internalNotes: {
      recommendation: "Margem de lucro adequada. Cliente frequente - manter relacionamento. Considerar upgrade de classe se solicitado."
    }
  };
  
  const handleTestPDFClient = () => {
    console.log('Testando PDF Cliente...');
    generatePDF(testQuote, 'client');
  };
  
  const handleTestPDFInternal = () => {
    console.log('Testando PDF Interno...');
    generatePDF(testInternalQuote, 'internal');
  };
  
  const handleTestWordClient = async () => {
    console.log('Testando Word Cliente...');
    await generateWord(testQuote, 'client');
  };
  
  const handleTestWordInternal = async () => {
    console.log('Testando Word Interno...');
    await generateWord(testInternalQuote, 'internal');
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#1e3a8a',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        🧪 Teste de Geração de Documentos
      </h1>
      
      <div style={{
        background: '#f0f9ff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '2px solid #3b82f6'
      }}>
        <h3 style={{ color: '#1e3a8a', marginBottom: '15px' }}>
          ℹ️ Instruções
        </h3>
        <ul style={{ lineHeight: '1.8', color: '#475569' }}>
          <li>Clique nos botões abaixo para testar a geração de documentos</li>
          <li>Abra o Console do Navegador (F12) para ver os logs</li>
          <li>Os documentos devem ser baixados automaticamente</li>
          <li>Verifique se os PDFs e Words abrem corretamente</li>
        </ul>
      </div>
      
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {/* PDF Cliente */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '15px' }}>
            📄 Orçamento Cliente
          </h3>
          <button
            onClick={handleTestPDFClient}
            style={{
              width: '100%',
              padding: '12px 20px',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Gerar PDF Cliente
          </button>
          <button
            onClick={handleTestWordClient}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Gerar Word Cliente
          </button>
        </div>
        
        {/* PDF Interno */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #10b981'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '15px' }}>
            💼 Orçamento Interno
          </h3>
          <button
            onClick={handleTestPDFInternal}
            style={{
              width: '100%',
              padding: '12px 20px',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Gerar PDF Interno
          </button>
          <button
            onClick={handleTestWordInternal}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Gerar Word Interno
          </button>
        </div>
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#fef3c7',
        borderRadius: '8px',
        border: '2px solid #fbbf24'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '10px' }}>
          💡 Dica
        </h3>
        <p style={{ color: '#78350f', margin: 0, lineHeight: '1.6' }}>
          Se o download não funcionar, abra o Console (F12) e verifique se há erros.
          Os logs devem mostrar "PDF gerado com sucesso!" ou "Word gerado com sucesso!"
        </p>
      </div>
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f1f5f9',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748b'
      }}>
        <p style={{ margin: 0 }}>
          Este é um componente de teste. Para usar em produção, use o componente QuotePage.
        </p>
      </div>
    </div>
  );
};

export default TestDocumentGenerator;
