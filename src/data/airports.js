/**
 * Mapeamento completo de códigos IATA para nomes de aeroportos brasileiros e internacionais
 */

export const AIRPORTS = {
  // Brasil - Principais
  'GRU': 'Aeroporto Internacional de Guarulhos',
  'CGH': 'Aeroporto de Congonhas',
  'GIG': 'Aeroporto Internacional do Galeão',
  'SDU': 'Aeroporto Santos Dumont',
  'BSB': 'Aeroporto Internacional de Brasília',
  'CNF': 'Aeroporto Internacional de Confins',
  'PLU': 'Aeroporto da Pampulha',
  'POA': 'Aeroporto Salgado Filho',
  'CWB': 'Aeroporto Afonso Pena',
  'REC': 'Aeroporto Internacional do Recife',
  'SSA': 'Aeroporto Internacional de Salvador',
  'FOR': 'Aeroporto Internacional de Fortaleza',
  'MAO': 'Aeroporto Internacional de Manaus',
  'BEL': 'Aeroporto Internacional de Belém',
  'VCP': 'Aeroporto de Viracopos',
  'CGB': 'Aeroporto Internacional de Cuiabá',
  'FLN': 'Aeroporto Internacional de Florianópolis',
  'NAT': 'Aeroporto Internacional de Natal',
  'MCZ': 'Aeroporto Internacional de Maceió',
  'AJU': 'Aeroporto Internacional de Aracaju',
  'THE': 'Aeroporto de Teresina',
  'SLZ': 'Aeroporto Internacional de São Luís',
  'JPA': 'Aeroporto Internacional de João Pessoa',
  'VIX': 'Aeroporto de Vitória',
  'IGU': 'Aeroporto Internacional de Foz do Iguaçu',
  'GYN': 'Aeroporto Santa Genoveva',
  'CFC': 'Aeroporto de Caçador',
  'JOI': 'Aeroporto de Joinville',
  'NVT': 'Aeroporto de Navegantes',
  'IOS': 'Aeroporto de Ilhéus',
  'VDC': 'Aeroporto de Vitória da Conquista',
  'PMW': 'Aeroporto de Palmas',
  'PVH': 'Aeroporto de Porto Velho',
  'RBR': 'Aeroporto de Rio Branco',
  'CZS': 'Aeroporto de Cruzeiro do Sul',
  'UDI': 'Aeroporto de Uberlândia',
  'MOC': 'Aeroporto de Montes Claros',
  'MCP': 'Aeroporto de Macapá',
  'BVB': 'Aeroporto de Boa Vista',
  'STM': 'Aeroporto de Santarém',
  'PFB': 'Aeroporto de Passo Fundo',
  'CXJ': 'Aeroporto de Caxias do Sul',
  'PPB': 'Aeroporto de Presidente Prudente',
  'RAO': 'Aeroporto de Ribeirão Preto',
  'AQA': 'Aeroporto de Araraquara',
  'SOD': 'Aeroporto de Sorocaba',
  'SJK': 'Aeroporto de São José dos Campos',
  'CPQ': 'Aeroporto de Campinas',
  'BAU': 'Aeroporto de Bauru',
  'JDO': 'Aeroporto de Juazeiro do Norte',
  'PNZ': 'Aeroporto de Petrolina',
  'IMP': 'Aeroporto de Imperatriz',
  'MAB': 'Aeroporto de Marabá',

  // América do Sul
  'EZE': 'Aeroporto Internacional de Ezeiza',
  'AEP': 'Aeroporto Jorge Newbery',
  'COR': 'Aeroporto de Córdoba',
  'SCL': 'Aeroporto Arturo Merino Benítez',
  'LIM': 'Aeroporto Internacional Jorge Chávez',
  'BOG': 'Aeroporto El Dorado',
  'UIO': 'Aeroporto Mariscal Sucre',
  'GYE': 'Aeroporto José Joaquín de Olmedo',
  'MVD': 'Aeroporto de Carrasco',
  'ASU': 'Aeroporto Silvio Pettirossi',
  'CCS': 'Aeroporto Simón Bolívar',
  'LPB': 'Aeroporto El Alto',
  'VVI': 'Aeroporto Viru Viru',

  // América do Norte
  'JFK': 'Aeroporto Internacional JFK',
  'LAX': 'Aeroporto Internacional de Los Angeles',
  'MIA': 'Aeroporto Internacional de Miami',
  'ORD': 'Aeroporto Internacional O\'Hare',
  'ATL': 'Aeroporto Internacional de Atlanta',
  'DFW': 'Aeroporto Internacional de Dallas',
  'SFO': 'Aeroporto Internacional de San Francisco',
  'LAS': 'Aeroporto Internacional de Las Vegas',
  'MCO': 'Aeroporto Internacional de Orlando',
  'SEA': 'Aeroporto Internacional de Seattle',
  'BOS': 'Aeroporto Internacional de Boston',
  'IAD': 'Aeroporto Internacional Dulles',
  'DCA': 'Aeroporto Nacional Reagan',
  'EWR': 'Aeroporto Internacional Newark',
  'MEX': 'Aeroporto Internacional da Cidade do México',
  'CUN': 'Aeroporto Internacional de Cancún',
  'GDL': 'Aeroporto Internacional de Guadalajara',
  'YYZ': 'Aeroporto Internacional Pearson',
  'YVR': 'Aeroporto Internacional de Vancouver',
  'YUL': 'Aeroporto Internacional Trudeau',

  // Europa
  'LHR': 'Aeroporto de Heathrow',
  'LGW': 'Aeroporto de Gatwick',
  'CDG': 'Aeroporto Charles de Gaulle',
  'ORY': 'Aeroporto de Orly',
  'MAD': 'Aeroporto Adolfo Suárez Madrid-Barajas',
  'BCN': 'Aeroporto de Barcelona-El Prat',
  'FCO': 'Aeroporto Leonardo da Vinci',
  'MXP': 'Aeroporto de Malpensa',
  'AMS': 'Aeroporto de Schiphol',
  'FRA': 'Aeroporto de Frankfurt',
  'MUC': 'Aeroporto de Munique',
  'LIS': 'Aeroporto Humberto Delgado',
  'OPO': 'Aeroporto Francisco Sá Carneiro',
  'ZRH': 'Aeroporto de Zurique',
  'VIE': 'Aeroporto de Viena',
  'BRU': 'Aeroporto de Bruxelas',
  'CPH': 'Aeroporto de Copenhague',
  'ARN': 'Aeroporto de Estocolmo-Arlanda',
  'OSL': 'Aeroporto de Oslo',
  'HEL': 'Aeroporto de Helsinque',
  'IST': 'Aeroporto de Istambul',
  'ATH': 'Aeroporto Internacional de Atenas',
  'DUB': 'Aeroporto de Dublin',
  'PRG': 'Aeroporto Václav Havel',
  'WAW': 'Aeroporto Chopin',
  'BUD': 'Aeroporto Ferenc Liszt',

  // Ásia
  'DXB': 'Aeroporto Internacional de Dubai',
  'DOH': 'Aeroporto Internacional de Doha',
  'SIN': 'Aeroporto de Changi',
  'HKG': 'Aeroporto Internacional de Hong Kong',
  'NRT': 'Aeroporto Internacional de Narita',
  'HND': 'Aeroporto de Haneda',
  'ICN': 'Aeroporto Internacional de Incheon',
  'PEK': 'Aeroporto Internacional de Pequim',
  'PVG': 'Aeroporto de Pudong',
  'BKK': 'Aeroporto de Suvarnabhumi',
  'KUL': 'Aeroporto Internacional de Kuala Lumpur',
  'DEL': 'Aeroporto Indira Gandhi',
  'BOM': 'Aeroporto Chhatrapati Shivaji',
  'TLV': 'Aeroporto Ben Gurion',

  // Oceania
  'SYD': 'Aeroporto de Sydney',
  'MEL': 'Aeroporto de Melbourne',
  'BNE': 'Aeroporto de Brisbane',
  'AKL': 'Aeroporto de Auckland',
  
  // África
  'JNB': 'Aeroporto OR Tambo',
  'CPT': 'Aeroporto Internacional da Cidade do Cabo',
  'CAI': 'Aeroporto Internacional do Cairo',
  'ADD': 'Aeroporto de Addis Abeba',
  'LOS': 'Aeroporto Murtala Muhammed',
  'NBO': 'Aeroporto Jomo Kenyatta',

  // Caribe
  'PUJ': 'Aeroporto Internacional de Punta Cana',
  'SDQ': 'Aeroporto Las Américas',
  'MBJ': 'Aeroporto de Montego Bay',
  'HAV': 'Aeroporto José Martí',
  'SJU': 'Aeroporto Luis Muñoz Marín',
  'AUA': 'Aeroporto Queen Beatrix'
};

/**
 * Retorna o nome completo do aeroporto ou o código se não encontrado
 */
export function getAirportName(code) {
  if (!code) return '';
  
  // Extrair código se vier no formato "Cidade (XXX)"
  const codeMatch = code.match(/\(([A-Z]{3})\)/);
  const airportCode = codeMatch ? codeMatch[1] : code.toUpperCase();
  
  return AIRPORTS[airportCode] || code;
}

/**
 * Retorna nome formatado: "Cidade - Nome do Aeroporto (CODE)"
 */
export function getAirportFullName(code, cityName = '') {
  if (!code) return '';
  
  const codeMatch = code.match(/\(([A-Z]{3})\)/);
  const airportCode = codeMatch ? codeMatch[1] : code.toUpperCase();
  const airportName = AIRPORTS[airportCode];
  
  if (!airportName) return code;
  
  // Se tiver nome da cidade, usar formato "Cidade - Aeroporto (CODE)"
  if (cityName) {
    return `${cityName} - ${airportName} (${airportCode})`;
  }
  
  // Se não, retornar apenas "Aeroporto (CODE)"
  return `${airportName} (${airportCode})`;
}

/**
 * Retorna apenas o código IATA
 */
export function extractAirportCode(airportString) {
  if (!airportString) return '';
  
  const match = airportString.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : airportString.toUpperCase().slice(0, 3);
}
