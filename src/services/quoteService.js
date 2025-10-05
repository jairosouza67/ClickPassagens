import { calculateTripTaxes } from '../data/airportTaxes.js';

/**
 * Serviço para geração de orçamentos de viagens
 * Gera dois tipos: orçamento interno (com lucro) e orçamento para cliente
 */

const PROFIT_MARGIN = 0.30; // 30% de lucro
const EXCHANGE_RATES = {
  USD: 5.20,
  EUR: 5.65,
  GBP: 6.50
};

/**
 * Extrai o código do aeroporto de uma string como "São Paulo (GRU)"
 */
function extractAirportCode(airportString) {
  const match = airportString.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : airportString.toUpperCase().slice(0, 3);
}

/**
 * Extrai a data da viagem de várias fontes possíveis
 */
function extractFlightDate(flightData, dateType = 'departure') {
  // Tentar vários campos possíveis
  const possibleFields = dateType === 'departure' 
    ? ['data_ida', 'dataIda', 'data', 'departure_date', 'departureDate', 'data_alternativa']
    : ['data_volta', 'dataVolta', 'return_date', 'returnDate'];
  
  for (const field of possibleFields) {
    if (flightData[field]) {
      // Se for uma data válida, retornar formatada
      const date = new Date(flightData[field] + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
      }
      // Se já estiver formatada, retornar como está
      return flightData[field];
    }
  }
  
  // Se não encontrou nada, retornar data atual ou null
  return dateType === 'departure' ? new Date().toLocaleDateString('pt-BR') : null;
}

/**
 * Converte moeda estrangeira para BRL
 */
function convertToBRL(amount, currency) {
  if (currency === 'BRL') return amount;
  return amount * (EXCHANGE_RATES[currency] || 1);
}

/**
 * Calcula o custo total da viagem incluindo taxas
 */
function calculateTotalCost(flightData, taxes) {
  const basePrice = flightData.preco_dinheiro || flightData.preco || 0;
  
  // Converter taxa para BRL se necessário
  const taxInBRL = convertToBRL(taxes.totalTax, taxes.currency);
  
  return {
    basePrice,
    taxes: taxInBRL,
    subtotal: basePrice + taxInBRL
  };
}

/**
 * Gera o orçamento interno (com detalhamento de lucro)
 */
export function generateInternalQuote(flightData, passengerData = {}) {
  const originCode = extractAirportCode(flightData.origem);
  const destinationCode = extractAirportCode(flightData.destino);
  const isRoundTrip = !!flightData.dataVolta || !!flightData.data_volta;
  
  // Calcular taxas de embarque
  const taxes = calculateTripTaxes(originCode, destinationCode, isRoundTrip);
  
  // Calcular custos
  const costs = calculateTotalCost(flightData, taxes);
  
  // Calcular lucro
  const profitAmount = costs.subtotal * PROFIT_MARGIN;
  const clientPrice = costs.subtotal + profitAmount;
  
  // Calcular valores em milhas (se aplicável)
  const milesNeeded = flightData.milhas_necessarias || flightData.milhas || 0;
  const milesProfit = milesNeeded * PROFIT_MARGIN;
  const milesClientPrice = milesNeeded + milesProfit;
  
  const quoteNumber = `ORC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  return {
    quoteType: 'INTERNAL',
    quoteNumber,
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    
    // Informações do voo
    flight: {
      airline: flightData.companhia?.nome || flightData.companhia || 'N/A',
      flightNumber: flightData.voo_numero || flightData.numero_voo || 'N/A',
      origin: {
        code: originCode,
        name: flightData.origem,
        airport: taxes.origin.airportName
      },
      destination: {
        code: destinationCode,
        name: flightData.destino,
        airport: taxes.destination.airportName
      },
      departure: {
        date: extractFlightDate(flightData, 'departure'),
        time: flightData.horario_saida || 'A definir'
      },
      return: isRoundTrip ? {
        date: extractFlightDate(flightData, 'return'),
        time: flightData.horario_chegada_volta || flightData.horario_chegada || 'A definir'
      } : null,
      duration: flightData.duracao || 'A definir',
      stops: flightData.paradas || 0,
      class: flightData.classe || 'Econômica'
    },
    
    // Informações do passageiro
    passenger: {
      name: passengerData.nome || passengerData.name || 'A definir',
      email: passengerData.email || 'A definir',
      phone: passengerData.telefone || passengerData.phone || 'A definir',
      document: passengerData.cpf || passengerData.document || 'A definir',
      quantity: flightData.passageiros || passengerData.passageiros || 1
    },
    
    // Detalhamento financeiro (INTERNO)
    pricing: {
      // Custos base
      basePrice: costs.basePrice,
      
      // Taxas de embarque detalhadas
      airportTaxes: {
        origin: {
          airport: taxes.origin.airportName,
          code: taxes.origin.airportCode,
          amount: convertToBRL(taxes.origin.tax, taxes.origin.currency)
        },
        destination: isRoundTrip ? {
          airport: taxes.destination.airportName,
          code: taxes.destination.airportCode,
          amount: convertToBRL(taxes.destination.tax, taxes.destination.currency)
        } : null,
        total: taxes.totalTax,
        currency: 'BRL'
      },
      
      // Subtotal (custo real)
      subtotal: costs.subtotal,
      
      // Lucro da empresa (30%)
      profit: {
        percentage: PROFIT_MARGIN * 100,
        amount: profitAmount
      },
      
      // Preço final ao cliente
      clientPrice: clientPrice,
      
      // Opção em milhas
      miles: milesNeeded > 0 ? {
        baseNeeded: milesNeeded,
        profit: milesProfit,
        clientTotal: milesClientPrice,
        profitPercentage: PROFIT_MARGIN * 100
      } : null,
      
      // Economia (se pagar em milhas)
      savings: milesNeeded > 0 ? {
        amount: clientPrice - (milesClientPrice * 0.015), // Estimativa: 1 milha = R$ 0,015
        percentage: flightData.economia_calculada || 0
      } : null
    },
    
    // Observações internas
    internalNotes: {
      profitMargin: `${PROFIT_MARGIN * 100}%`,
      costBreakdown: `Base: R$ ${costs.basePrice.toFixed(2)} + Taxas: R$ ${costs.taxes.toFixed(2)}`,
      recommendation: costs.subtotal < 1000 ? 'Margem de lucro adequada' : 'Considerar desconto para fechar negócio'
    }
  };
}

/**
 * Gera o orçamento para o cliente (sem mostrar lucro)
 */
export function generateClientQuote(flightData, passengerData = {}) {
  const internalQuote = generateInternalQuote(flightData, passengerData);
  
  // Criar versão para cliente (sem detalhes de lucro)
  return {
    quoteType: 'CLIENT',
    quoteNumber: internalQuote.quoteNumber,
    generatedAt: internalQuote.generatedAt,
    validUntil: internalQuote.validUntil,
    
    // Informações do voo (igual)
    flight: internalQuote.flight,
    
    // Informações do passageiro (igual)
    passenger: internalQuote.passenger,
    
    // Precificação simplificada para cliente
    pricing: {
      // Passagem
      flightPrice: internalQuote.pricing.clientPrice,
      
      // Taxas (consolidadas)
      taxes: {
        airportTaxes: internalQuote.pricing.airportTaxes.total,
        description: 'Taxas de embarque e outros encargos aeroportuários'
      },
      
      // Total (já com lucro embutido)
      total: internalQuote.pricing.clientPrice,
      
      // Opção em milhas (preço final ao cliente)
      milesOption: internalQuote.pricing.miles ? {
        totalMiles: Math.ceil(internalQuote.pricing.miles.clientTotal),
        estimatedValue: `R$ ${(internalQuote.pricing.miles.clientTotal * 0.015).toFixed(2)}`,
        savings: internalQuote.pricing.savings
      } : null,
      
      // Forma de pagamento
      paymentMethods: [
        {
          method: 'Dinheiro/PIX',
          price: internalQuote.pricing.clientPrice,
          discount: '5% de desconto no PIX',
          finalPrice: internalQuote.pricing.clientPrice * 0.95
        },
        {
          method: 'Cartão de Crédito',
          price: internalQuote.pricing.clientPrice,
          installments: 'Até 12x sem juros',
          installmentValue: internalQuote.pricing.clientPrice / 12
        },
        {
          method: 'Milhas',
          miles: Math.ceil(internalQuote.pricing.miles?.clientTotal || 0),
          taxesCash: internalQuote.pricing.airportTaxes.total,
          description: 'Milhas + taxas em dinheiro'
        }
      ]
    },
    
    // Termos e condições
    terms: [
      'Preços sujeitos a disponibilidade no momento da confirmação',
      'Taxas de embarque podem sofrer alterações até a emissão do bilhete',
      'Valores em milhas são aproximados e dependem do programa de fidelidade',
      'Orçamento válido por 7 dias corridos',
      'Consulte regras de bagagem e alterações com a companhia aérea'
    ],
    
    // Informações de contato
    agency: {
      name: 'ClickPassagens',
      email: 'contato@clickpassagens.com',
      phone: '(11) 99999-9999',
      whatsapp: '(11) 99999-9999'
    }
  };
}

/**
 * Formata o orçamento para impressão/PDF
 */
export function formatQuoteForPrint(quote) {
  const isInternal = quote.quoteType === 'INTERNAL';
  
  return {
    html: generateQuoteHTML(quote, isInternal),
    text: generateQuoteText(quote, isInternal)
  };
}

/**
 * Gera HTML formatado do orçamento
 */
function generateQuoteHTML(quote, isInternal) {
  // Aqui você pode criar um template HTML completo
  // Por enquanto retornamos uma estrutura básica
  return `
    <div class="quote-document">
      <h1>${isInternal ? 'ORÇAMENTO INTERNO' : 'ORÇAMENTO DE VIAGEM'}</h1>
      <p>Número: ${quote.quoteNumber}</p>
      <p>Data: ${new Date(quote.generatedAt).toLocaleDateString('pt-BR')}</p>
      <!-- Adicionar mais detalhes aqui -->
    </div>
  `;
}

/**
 * Gera texto formatado do orçamento
 */
function generateQuoteText(quote, isInternal) {
  return JSON.stringify(quote, null, 2);
}

/**
 * Salva orçamento no localStorage (para histórico)
 */
export function saveQuoteToHistory(quote) {
  try {
    const history = JSON.parse(localStorage.getItem('quotesHistory') || '[]');
    history.unshift({
      ...quote,
      savedAt: new Date().toISOString(),
      saleConfirmed: false, // Venda não confirmada por padrão
      confirmedAt: null // Data de confirmação da venda
    });
    
    // Manter apenas os últimos 50 orçamentos
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem('quotesHistory', JSON.stringify(limitedHistory));
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    return false;
  }
}

/**
 * Recupera histórico de orçamentos
 */
export function getQuotesHistory() {
  try {
    return JSON.parse(localStorage.getItem('quotesHistory') || '[]');
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
}

/**
 * Confirma venda de um orçamento
 */
export function confirmQuoteSale(quoteNumber) {
  try {
    const history = JSON.parse(localStorage.getItem('quotesHistory') || '[]');
    const updatedHistory = history.map(quote => {
      if (quote.quoteNumber === quoteNumber) {
        return {
          ...quote,
          saleConfirmed: true,
          confirmedAt: new Date().toISOString()
        };
      }
      return quote;
    });
    
    localStorage.setItem('quotesHistory', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao confirmar venda:', error);
    return false;
  }
}

/**
 * Desmarca venda de um orçamento
 */
export function unconfirmQuoteSale(quoteNumber) {
  try {
    const history = JSON.parse(localStorage.getItem('quotesHistory') || '[]');
    const updatedHistory = history.map(quote => {
      if (quote.quoteNumber === quoteNumber) {
        return {
          ...quote,
          saleConfirmed: false,
          confirmedAt: null
        };
      }
      return quote;
    });
    
    localStorage.setItem('quotesHistory', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erro ao desmarcar venda:', error);
    return false;
  }
}

/**
 * Recupera apenas vendas confirmadas
 */
export function getConfirmedSales() {
  try {
    const history = getQuotesHistory();
    return history.filter(quote => quote.saleConfirmed === true);
  } catch (error) {
    console.error('Erro ao recuperar vendas:', error);
    return [];
  }
}

/**
 * Calcula total de comissões das vendas confirmadas
 */
export function calculateTotalCommissions() {
  try {
    const sales = getConfirmedSales();
    return sales.reduce((total, sale) => {
      // Para orçamentos internos, pegamos o lucro
      if (sale.pricing?.profit?.amount) {
        return total + sale.pricing.profit.amount;
      }
      // Para orçamentos cliente, estimamos 30% do total
      if (sale.pricing?.total) {
        return total + (sale.pricing.total * 0.30);
      }
      return total;
    }, 0);
  } catch (error) {
    console.error('Erro ao calcular comissões:', error);
    return 0;
  }
}

export default {
  generateInternalQuote,
  generateClientQuote,
  formatQuoteForPrint,
  saveQuoteToHistory,
  getQuotesHistory,
  confirmQuoteSale,
  unconfirmQuoteSale,
  getConfirmedSales,
  calculateTotalCommissions
};
