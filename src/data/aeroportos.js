// Lista de aeroportos brasileiros principais
export const aeroportos = [
  // São Paulo
  { codigo: 'GRU', nome: 'Guarulhos - São Paulo (GRU)', cidade: 'São Paulo', estado: 'SP' },
  { codigo: 'CGH', nome: 'Congonhas - São Paulo (CGH)', cidade: 'São Paulo', estado: 'SP' },
  { codigo: 'VCP', nome: 'Viracopos - Campinas (VCP)', cidade: 'Campinas', estado: 'SP' },
  
  // Rio de Janeiro
  { codigo: 'GIG', nome: 'Galeão - Rio de Janeiro (GIG)', cidade: 'Rio de Janeiro', estado: 'RJ' },
  { codigo: 'SDU', nome: 'Santos Dumont - Rio de Janeiro (SDU)', cidade: 'Rio de Janeiro', estado: 'RJ' },
  
  // Brasília
  { codigo: 'BSB', nome: 'Brasília Internacional (BSB)', cidade: 'Brasília', estado: 'DF' },
  
  // Minas Gerais
  { codigo: 'CNF', nome: 'Confins - Belo Horizonte (CNF)', cidade: 'Belo Horizonte', estado: 'MG' },
  { codigo: 'PLU', nome: 'Pampulha - Belo Horizonte (PLU)', cidade: 'Belo Horizonte', estado: 'MG' },
  
  // Nordeste
  { codigo: 'SSA', nome: 'Salvador (SSA)', cidade: 'Salvador', estado: 'BA' },
  { codigo: 'REC', nome: 'Recife (REC)', cidade: 'Recife', estado: 'PE' },
  { codigo: 'FOR', nome: 'Fortaleza (FOR)', cidade: 'Fortaleza', estado: 'CE' },
  { codigo: 'NAT', nome: 'Natal (NAT)', cidade: 'Natal', estado: 'RN' },
  { codigo: 'MCZ', nome: 'Maceió (MCZ)', cidade: 'Maceió', estado: 'AL' },
  { codigo: 'AJU', nome: 'Aracaju (AJU)', cidade: 'Aracaju', estado: 'SE' },
  { codigo: 'JPA', nome: 'João Pessoa (JPA)', cidade: 'João Pessoa', estado: 'PB' },
  
  // Sul
  { codigo: 'POA', nome: 'Porto Alegre (POA)', cidade: 'Porto Alegre', estado: 'RS' },
  { codigo: 'CWB', nome: 'Curitiba (CWB)', cidade: 'Curitiba', estado: 'PR' },
  { codigo: 'FLN', nome: 'Florianópolis (FLN)', cidade: 'Florianópolis', estado: 'SC' },
  { codigo: 'NVT', nome: 'Navegantes (NVT)', cidade: 'Navegantes', estado: 'SC' },
  
  // Centro-Oeste
  { codigo: 'CGB', nome: 'Cuiabá (CGB)', cidade: 'Cuiabá', estado: 'MT' },
  { codigo: 'CGR', nome: 'Campo Grande (CGR)', cidade: 'Campo Grande', estado: 'MS' },
  { codigo: 'GYN', nome: 'Goiânia (GYN)', cidade: 'Goiânia', estado: 'GO' },
  
  // Norte
  { codigo: 'MAO', nome: 'Manaus (MAO)', cidade: 'Manaus', estado: 'AM' },
  { codigo: 'BEL', nome: 'Belém (BEL)', cidade: 'Belém', estado: 'PA' },
  { codigo: 'PVH', nome: 'Porto Velho (PVH)', cidade: 'Porto Velho', estado: 'RO' },
  { codigo: 'RBR', nome: 'Rio Branco (RBR)', cidade: 'Rio Branco', estado: 'AC' },
  { codigo: 'BOA', nome: 'Boa Vista (BOA)', cidade: 'Boa Vista', estado: 'RR' },
  { codigo: 'MCP', nome: 'Macapá (MCP)', cidade: 'Macapá', estado: 'AP' },
  { codigo: 'PBM', nome: 'Palmas (PBM)', cidade: 'Palmas', estado: 'TO' },
  
  // Outros destinos importantes
  { codigo: 'VIX', nome: 'Vitória (VIX)', cidade: 'Vitória', estado: 'ES' },
  { codigo: 'IGU', nome: 'Foz do Iguaçu (IGU)', cidade: 'Foz do Iguaçu', estado: 'PR' },
  { codigo: 'UDI', nome: 'Uberlândia (UDI)', cidade: 'Uberlândia', estado: 'MG' },
  { codigo: 'IOS', nome: 'Ilhéus (IOS)', cidade: 'Ilhéus', estado: 'BA' },
  { codigo: 'JJD', nome: 'Jericoacoara (JJD)', cidade: 'Jijoca de Jericoacoara', estado: 'CE' },
]

// Função de busca de aeroportos
export const buscarAeroportos = (termo) => {
  if (!termo || termo.length < 1) return []
  
  const termoLower = termo.toLowerCase()
  
  return aeroportos.filter(aeroporto => 
    aeroporto.codigo.toLowerCase().includes(termoLower) ||
    aeroporto.nome.toLowerCase().includes(termoLower) ||
    aeroporto.cidade.toLowerCase().includes(termoLower) ||
    aeroporto.estado.toLowerCase().includes(termoLower)
  ).slice(0, 8) // Limita a 8 resultados
}
