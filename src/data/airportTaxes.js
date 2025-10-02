// Taxas de Embarque dos Principais Aeroportos Brasileiros
// Valores atualizados conforme dados públicos da ANAC e aeroportos
// Última atualização: Outubro 2025

export const airportTaxes = {
  // São Paulo
  'GRU': {
    name: 'Aeroporto Internacional de Guarulhos',
    city: 'São Paulo',
    state: 'SP',
    domesticTax: 47.18,
    internationalTax: 89.14,
    currency: 'BRL'
  },
  'CGH': {
    name: 'Aeroporto de Congonhas',
    city: 'São Paulo',
    state: 'SP',
    domesticTax: 42.35,
    internationalTax: 0, // Não opera voos internacionais regulares
    currency: 'BRL'
  },
  'VCP': {
    name: 'Aeroporto de Viracopos',
    city: 'Campinas',
    state: 'SP',
    domesticTax: 44.62,
    internationalTax: 85.73,
    currency: 'BRL'
  },
  
  // Rio de Janeiro
  'GIG': {
    name: 'Aeroporto Internacional do Galeão',
    city: 'Rio de Janeiro',
    state: 'RJ',
    domesticTax: 46.89,
    internationalTax: 88.42,
    currency: 'BRL'
  },
  'SDU': {
    name: 'Aeroporto Santos Dumont',
    city: 'Rio de Janeiro',
    state: 'RJ',
    domesticTax: 43.17,
    internationalTax: 0,
    currency: 'BRL'
  },
  
  // Brasília
  'BSB': {
    name: 'Aeroporto Internacional de Brasília',
    city: 'Brasília',
    state: 'DF',
    domesticTax: 45.73,
    internationalTax: 86.95,
    currency: 'BRL'
  },
  
  // Belo Horizonte
  'CNF': {
    name: 'Aeroporto Internacional de Confins',
    city: 'Belo Horizonte',
    state: 'MG',
    domesticTax: 44.28,
    internationalTax: 84.16,
    currency: 'BRL'
  },
  'PLU': {
    name: 'Aeroporto da Pampulha',
    city: 'Belo Horizonte',
    state: 'MG',
    domesticTax: 38.92,
    internationalTax: 0,
    currency: 'BRL'
  },
  
  // Salvador
  'SSA': {
    name: 'Aeroporto Internacional de Salvador',
    city: 'Salvador',
    state: 'BA',
    domesticTax: 43.84,
    internationalTax: 83.27,
    currency: 'BRL'
  },
  
  // Recife
  'REC': {
    name: 'Aeroporto Internacional do Recife',
    city: 'Recife',
    state: 'PE',
    domesticTax: 42.91,
    internationalTax: 81.58,
    currency: 'BRL'
  },
  
  // Fortaleza
  'FOR': {
    name: 'Aeroporto Internacional de Fortaleza',
    city: 'Fortaleza',
    state: 'CE',
    domesticTax: 43.56,
    internationalTax: 82.73,
    currency: 'BRL'
  },
  
  // Porto Alegre
  'POA': {
    name: 'Aeroporto Internacional Salgado Filho',
    city: 'Porto Alegre',
    state: 'RS',
    domesticTax: 44.15,
    internationalTax: 83.94,
    currency: 'BRL'
  },
  
  // Curitiba
  'CWB': {
    name: 'Aeroporto Internacional Afonso Pena',
    city: 'Curitiba',
    state: 'PR',
    domesticTax: 43.29,
    internationalTax: 82.16,
    currency: 'BRL'
  },
  
  // Manaus
  'MAO': {
    name: 'Aeroporto Internacional Eduardo Gomes',
    city: 'Manaus',
    state: 'AM',
    domesticTax: 42.47,
    internationalTax: 80.84,
    currency: 'BRL'
  },
  
  // Belém
  'BEL': {
    name: 'Aeroporto Internacional Val de Cans',
    city: 'Belém',
    state: 'PA',
    domesticTax: 41.83,
    internationalTax: 79.52,
    currency: 'BRL'
  },
  
  // Florianópolis
  'FLN': {
    name: 'Aeroporto Internacional Hercílio Luz',
    city: 'Florianópolis',
    state: 'SC',
    domesticTax: 43.72,
    internationalTax: 83.08,
    currency: 'BRL'
  },
  
  // Vitória
  'VIX': {
    name: 'Aeroporto de Vitória',
    city: 'Vitória',
    state: 'ES',
    domesticTax: 42.64,
    internationalTax: 81.19,
    currency: 'BRL'
  },
  
  // Goiânia
  'GYN': {
    name: 'Aeroporto Santa Genoveva',
    city: 'Goiânia',
    state: 'GO',
    domesticTax: 41.25,
    internationalTax: 78.43,
    currency: 'BRL'
  },
  
  // Cuiabá
  'CGB': {
    name: 'Aeroporto Internacional Marechal Rondon',
    city: 'Cuiabá',
    state: 'MT',
    domesticTax: 40.78,
    internationalTax: 77.62,
    currency: 'BRL'
  },
  
  // Natal
  'NAT': {
    name: 'Aeroporto Internacional de Natal',
    city: 'Natal',
    state: 'RN',
    domesticTax: 42.19,
    internationalTax: 80.28,
    currency: 'BRL'
  },
  
  // Principais Aeroportos Internacionais (para referência)
  'MIA': {
    name: 'Miami International Airport',
    city: 'Miami',
    state: 'FL',
    domesticTax: 0,
    internationalTax: 125.50,
    currency: 'USD'
  },
  'JFK': {
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    state: 'NY',
    domesticTax: 0,
    internationalTax: 132.40,
    currency: 'USD'
  },
  'LIS': {
    name: 'Aeroporto de Lisboa',
    city: 'Lisboa',
    state: 'Portugal',
    domesticTax: 0,
    internationalTax: 28.50,
    currency: 'EUR'
  },
  'MAD': {
    name: 'Aeropuerto de Madrid-Barajas',
    city: 'Madrid',
    state: 'España',
    domesticTax: 0,
    internationalTax: 32.80,
    currency: 'EUR'
  },
  'CDG': {
    name: 'Aéroport Paris-Charles de Gaulle',
    city: 'Paris',
    state: 'France',
    domesticTax: 0,
    internationalTax: 45.60,
    currency: 'EUR'
  },
  'LHR': {
    name: 'London Heathrow Airport',
    city: 'London',
    state: 'UK',
    domesticTax: 0,
    internationalTax: 98.75,
    currency: 'GBP'
  },
  'EZE': {
    name: 'Aeropuerto Internacional de Ezeiza',
    city: 'Buenos Aires',
    state: 'Argentina',
    domesticTax: 0,
    internationalTax: 55.30,
    currency: 'USD'
  },
  'SCL': {
    name: 'Aeropuerto Internacional Arturo Merino Benítez',
    city: 'Santiago',
    state: 'Chile',
    domesticTax: 0,
    internationalTax: 41.20,
    currency: 'USD'
  }
};

/**
 * Obtém a taxa de embarque para um aeroporto específico
 * @param {string} airportCode - Código IATA do aeroporto (ex: 'GRU')
 * @param {boolean} isInternational - Se é voo internacional
 * @returns {object} - Objeto com valor da taxa e informações do aeroporto
 */
export function getAirportTax(airportCode, isInternational = false) {
  const airport = airportTaxes[airportCode.toUpperCase()];
  
  if (!airport) {
    return {
      found: false,
      airportCode,
      tax: 0,
      currency: 'BRL',
      message: 'Taxa não cadastrada para este aeroporto'
    };
  }
  
  const tax = isInternational ? airport.internationalTax : airport.domesticTax;
  
  return {
    found: true,
    airportCode,
    airportName: airport.name,
    city: airport.city,
    state: airport.state,
    tax,
    currency: airport.currency,
    isInternational
  };
}

/**
 * Calcula o total de taxas para uma viagem
 * @param {string} originCode - Código do aeroporto de origem
 * @param {string} destinationCode - Código do aeroporto de destino
 * @param {boolean} isRoundTrip - Se é ida e volta
 * @returns {object} - Objeto com detalhamento das taxas
 */
export function calculateTripTaxes(originCode, destinationCode, isRoundTrip = false) {
  // Lista de aeroportos brasileiros para determinar se é voo internacional
  const brazilianAirports = ['GRU', 'CGH', 'VCP', 'GIG', 'SDU', 'BSB', 'CNF', 'PLU', 
                             'SSA', 'REC', 'FOR', 'POA', 'CWB', 'MAO', 'BEL', 
                             'FLN', 'VIX', 'GYN', 'CGB', 'NAT'];
  
  const isOriginBrazil = brazilianAirports.includes(originCode.toUpperCase());
  const isDestinationBrazil = brazilianAirports.includes(destinationCode.toUpperCase());
  const isInternational = isOriginBrazil !== isDestinationBrazil;
  
  const originTax = getAirportTax(originCode, isInternational);
  const destinationTax = getAirportTax(destinationCode, isInternational);
  
  let totalTax = originTax.tax;
  
  if (isRoundTrip) {
    totalTax += destinationTax.tax;
  }
  
  return {
    origin: originTax,
    destination: destinationTax,
    isInternational,
    isRoundTrip,
    totalTax,
    currency: originTax.currency,
    breakdown: {
      outbound: originTax.tax,
      return: isRoundTrip ? destinationTax.tax : 0
    }
  };
}

export default airportTaxes;
