import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Badge } from './ui/badge.jsx'
import { Loader2, Search, Plane, Clock, MapPin, Users, Calendar, ArrowUpDown, CheckCircle } from 'lucide-react'
import FlightCard from './FlightCard.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001/api'
const APP_MODE = import.meta.env.VITE_APP_MODE || 'development'

export default function BuscaIntegrada({ onBuscaCompleta }) {
  const [searchData, setSearchData] = useState({
    origem: '',
    destino: '',
    data_ida: '',
    data_volta: '',
    passageiros: 1,
    classe: 'economica'
  })

  const [companhias, setCompanhias] = useState([])
  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(false)
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  // Carregar companhias ao montar o componente
  useEffect(() => {
    carregarCompanhias()
  }, [])

  const carregarCompanhias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/busca/companhias`)
      const data = await response.json()
      
      if (data.success) {
        setCompanhias(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar companhias:', error)
    }
  }

  const realizarBusca = async () => {
    console.log('Iniciando busca com dados:', searchData)
    
    if (!searchData.origem || !searchData.destino || !searchData.data_ida) {
      alert('Por favor, preencha origem, destino e data de ida')
      return
    }

    setLoading(true)
    setBuscaRealizada(false)

    try {
      // Se estiver em produção sem backend, usar dados estáticos
      if (APP_MODE === 'production' && !API_BASE_URL.includes('http')) {
        const resultadosEstaticos = gerarResultadosEstaticos(searchData);
        setResultados(resultadosEstaticos);
        setBuscaRealizada(true);
        if (onBuscaCompleta) {
          onBuscaCompleta(resultadosEstaticos);
        }
        return;
      }

      const url = `${API_BASE_URL}/busca/buscar`;
      console.log('Fazendo requisição para:', url)
      
      const requestBody = {
        ...searchData,
        usuario_id: 1 // Usuário padrão para demonstração
      };
      console.log('Dados da requisição:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Status da resposta:', response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)

      if (data.success && data.data.resultados) {
        const resultadosProcessados = data.data.resultados
        console.log('Resultados processados:', resultadosProcessados)
        
        setResultados(resultadosProcessados)
        setBuscaRealizada(true)
        
        if (onBuscaCompleta) {
          onBuscaCompleta(resultadosProcessados)
        }
      } else {
        console.error('Resposta sem resultados:', data)
        throw new Error(data.error || 'Erro na busca')
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      alert(`Erro na busca: ${error.message}. Usando dados de exemplo.`)
      
      // Fallback para dados estáticos
      const resultadosEstaticos = gerarResultadosEstaticos(searchData);
      setResultados(resultadosEstaticos);
      setBuscaRealizada(true);
      if (onBuscaCompleta) {
        onBuscaCompleta(resultadosEstaticos);
      }
    } finally {
      setLoading(false)
    }
  }

  const gerarResultadosEstaticos = (dadosBusca) => {
    const companhiasEstaticas = [
      { codigo: 'G3', nome: 'Gol', valor_milheiro: 18.0 },
      { codigo: 'AD', nome: 'Azul', valor_milheiro: 20.0 },
      { codigo: 'LA', nome: 'LATAM', valor_milheiro: 22.0 },
      { codigo: 'AV', nome: 'Avianca', valor_milheiro: 19.0 },
      { codigo: 'IB', nome: 'Ibéria', valor_milheiro: 24.0 }
    ]

    const precoBase = calcularPrecoBase(dadosBusca.origem, dadosBusca.destino)
    const duracao = calcularDuracaoVoo(dadosBusca.origem, dadosBusca.destino)
    const resultados = []

    companhiasEstaticas.forEach((companhia, index) => {
      for (let i = 0; i < 2; i++) {
        const variacao = 1 + (i * 0.15)
        const preco = precoBase * variacao * (companhia.valor_milheiro / 20)
        const milhas = Math.round(preco * 45)
        const economia = Math.round(preco * 0.2)
        const hora = 6 + (index * 2) + (i * 4)

        resultados.push({
          companhia: {
            id: companhia.codigo,
            nome: companhia.nome,
            codigo: companhia.codigo,
            ativa: true,
            valor_milheiro: companhia.valor_milheiro
          },
          voo_numero: `${companhia.codigo}${1000 + index * 100 + i}`,
          horario_saida: `${hora.toString().padStart(2, '0')}:${(index * 15).toString().padStart(2, '0')}`,
          horario_chegada: `${((hora + duracao) % 24).toString().padStart(2, '0')}:${((index * 15) + 30).toString().padStart(2, '0')}`,
          milhas_necessarias: milhas,
          preco_dinheiro: Math.round(preco * 100) / 100,
          economia_calculada: economia,
          paradas: index === 0 ? 'Direto' : index === 1 ? 'Direto' : '1 parada',
          disponivel: true,
          origem: dadosBusca.origem,
          destino: dadosBusca.destino,
          duracao: `PT${duracao}H${index % 2 === 0 ? 0 : 30}M`
        })
      }
    })

    return resultados
  }

  const calcularPrecoBase = (origem, destino) => {
    const rotasDomesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
    if (rotasDomesticas.includes(origem) && rotasDomesticas.includes(destino)) {
      return 350 // Voos domésticos
    }
    return 1200 // Voos internacionais
  }

  const calcularDuracaoVoo = (origem, destino) => {
    const rotasDomesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
    if (rotasDomesticas.includes(origem) && rotasDomesticas.includes(destino)) {
      return 2 // 2 horas para voos domésticos
    }
    return 8 // 8 horas para voos internacionais
  }

  const novaBusca = () => {
    setResultados([])
    setBuscaRealizada(false)
    setSearchData({
      origem: '',
      destino: '',
      data_ida: '',
      data_volta: '',
      passageiros: 1,
      classe: 'economica'
    })
  }

  const aeroportos = [
    { codigo: 'GRU', nome: 'São Paulo - Guarulhos (GRU)', cidade: 'São Paulo' },
    { codigo: 'CGH', nome: 'São Paulo - Congonhas (CGH)', cidade: 'São Paulo' },
    { codigo: 'GIG', nome: 'Rio de Janeiro - Galeão (GIG)', cidade: 'Rio de Janeiro' },
    { codigo: 'SDU', nome: 'Rio de Janeiro - Santos Dumont (SDU)', cidade: 'Rio de Janeiro' },
    { codigo: 'BSB', nome: 'Brasília (BSB)', cidade: 'Brasília' },
    { codigo: 'SSA', nome: 'Salvador (SSA)', cidade: 'Salvador' },
    { codigo: 'FOR', nome: 'Fortaleza (FOR)', cidade: 'Fortaleza' },
    { codigo: 'REC', nome: 'Recife (REC)', cidade: 'Recife' },
    { codigo: 'POA', nome: 'Porto Alegre (POA)', cidade: 'Porto Alegre' },
    { codigo: 'CWB', nome: 'Curitiba (CWB)', cidade: 'Curitiba' },
    { codigo: 'BEL', nome: 'Belém (BEL)', cidade: 'Belém' },
    { codigo: 'MAO', nome: 'Manaus (MAO)', cidade: 'Manaus' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-aviation">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Voe Mais,
              <span className="text-aviation-gold"> Gaste Menos</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Compare preços em milhas e dinheiro de todas as companhias aéreas e encontre a melhor oferta para sua viagem
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Mais de 50 companhias</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Economia garantida</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Busca em tempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-aviation text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Search className="w-6 h-6 mr-3" />
              Buscar Passagens
            </CardTitle>
            <CardDescription className="text-white/90">
              Encontre as melhores ofertas comparando preços em milhas e dinheiro
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); realizarBusca(); }} className="space-y-6">
              {/* Origem e Destino */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origem" className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-aviation-blue" />
                    Origem
                  </Label>
                  <Select value={searchData.origem} onValueChange={(value) => setSearchData(prev => ({ ...prev, origem: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors">
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {aeroportos.map(aeroporto => (
                        <SelectItem key={aeroporto.codigo} value={aeroporto.codigo}>
                          {aeroporto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destino" className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-aviation-blue" />
                    Destino
                  </Label>
                  <Select value={searchData.destino} onValueChange={(value) => setSearchData(prev => ({ ...prev, destino: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors">
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {aeroportos.map(aeroporto => (
                        <SelectItem key={aeroporto.codigo} value={aeroporto.codigo}>
                          {aeroporto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Datas */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="data_ida" className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-aviation-blue" />
                    Data de ida
                  </Label>
                  <Input
                    id="data_ida"
                    type="date"
                    value={searchData.data_ida}
                    onChange={(e) => setSearchData(prev => ({ ...prev, data_ida: e.target.value }))}
                    className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_volta" className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-aviation-blue" />
                    Data de volta (opcional)
                  </Label>
                  <Input
                    id="data_volta"
                    type="date"
                    value={searchData.data_volta}
                    onChange={(e) => setSearchData(prev => ({ ...prev, data_volta: e.target.value }))}
                    className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors"
                    min={searchData.data_ida || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Passageiros e Classe */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passageiros" className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-aviation-blue" />
                    Passageiros
                  </Label>
                  <Select value={searchData.passageiros.toString()} onValueChange={(value) => setSearchData(prev => ({ ...prev, passageiros: parseInt(value) }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'passageiro' : 'passageiros'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classe" className="text-sm font-medium text-gray-700 flex items-center">
                    <Plane className="w-4 h-4 mr-2 text-aviation-blue" />
                    Classe
                  </Label>
                  <Select value={searchData.classe} onValueChange={(value) => setSearchData(prev => ({ ...prev, classe: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economica">Econômica</SelectItem>
                      <SelectItem value="executiva">Executiva</SelectItem>
                      <SelectItem value="primeira">Primeira Classe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botão de Busca */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-aviation hover:opacity-90 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px] h-14"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-3" />
                      Buscar Voos
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Resultados */}
      {buscaRealizada && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Resultados da Busca</h2>
              <p className="text-gray-600 mt-2">
                {resultados.length} {resultados.length === 1 ? 'voo encontrado' : 'voos encontrados'} de {searchData.origem} para {searchData.destino}
              </p>
            </div>
            <Button 
              onClick={novaBusca}
              variant="outline"
              className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white transition-colors duration-300"
            >
              <Search className="w-4 h-4 mr-2" />
              Nova Busca
            </Button>
          </div>

          {resultados.length > 0 ? (
            <div className="grid gap-6">
              {resultados.map((resultado, index) => (
                <FlightCard 
                  key={index} 
                  resultado={resultado}
                  onSelect={(voo) => console.log('Voo selecionado:', voo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Plane className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum voo encontrado</h3>
              <p className="text-gray-600 mb-6">Tente alterar suas opções de busca</p>
              <Button 
                onClick={novaBusca}
                className="bg-gradient-aviation hover:opacity-90 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Nova Busca
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}