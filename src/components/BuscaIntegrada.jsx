import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Badge } from './ui/badge.jsx'
import { Loader2, Search, Plane, Clock, MapPin, Users, Calendar, ArrowUpDown, CheckCircle, AlertTriangle } from 'lucide-react'
import FlightCard from './FlightCard.jsx'
import { API_URL } from '../config.js'
import AeroportoAutocompleteUI from './AeroportoAutocompleteUI'
import DatePickerInputUI from './DatePickerInputUI'

const API_BASE_URL = `${API_URL}/api`

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
  const [errorMessage, setErrorMessage] = useState(null)

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
      setErrorMessage('Por favor, preencha origem, destino e data de ida para continuar a busca por voos reais.')
      return
    }

    setLoading(true)
    setBuscaRealizada(false)
    setErrorMessage(null)

    try {
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
        let mensagemErro = `Erro HTTP: ${response.status}`
        if (response.headers.get('content-type')?.includes('application/json')) {
          try {
            const payload = await response.json()
            mensagemErro = payload.error || mensagemErro
          } catch (parseError) {
            console.error('Falha ao interpretar erro da API:', parseError)
          }
        }
        throw new Error(mensagemErro)
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)

      if (data.success && data.data.resultados) {
        const resultadosProcessados = data.data.resultados
        console.log('Resultados processados:', resultadosProcessados)
        if (!Array.isArray(resultadosProcessados) || resultadosProcessados.length === 0) {
          setResultados([])
          setBuscaRealizada(false)
          setErrorMessage('Nenhum voo real foi encontrado para os parâmetros informados. Tente ajustar datas ou aeroportos.')
          if (onBuscaCompleta) {
            onBuscaCompleta([])
          }
        } else {
          setResultados(resultadosProcessados)
          setBuscaRealizada(true)
          setErrorMessage(null)
          if (onBuscaCompleta) {
            onBuscaCompleta(resultadosProcessados)
          }
        }
      } else {
        console.error('Resposta sem resultados:', data)
        throw new Error(data.error || 'Erro na busca')
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      const mensagem = error?.message || 'Não foi possível concluir a busca por voos reais.'
      // Removido fallback para dados simulados - sempre usa API real
      setResultados([])
      setBuscaRealizada(false)
      setErrorMessage(mensagem + ' Verifique sua conexão e tente novamente.')
      if (onBuscaCompleta) {
        onBuscaCompleta([])
      }
    } finally {
      setLoading(false)
    }
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
    <div className="busca-integrada min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <div>
                  <span className="font-semibold text-red-700 block">Atenção</span>
                  <span className="text-sm leading-relaxed">{errorMessage}</span>
                </div>
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); realizarBusca(); }} className="space-y-6">
              {/* Origem e Destino */}
              <div className="grid md:grid-cols-2 gap-6">
                <AeroportoAutocompleteUI
                  label="Origem"
                  name="origem"
                  value={searchData.origem}
                  onChange={(value) => setSearchData(prev => ({ ...prev, origem: value }))}
                  placeholder="Digite o aeroporto"
                  required
                />

                <AeroportoAutocompleteUI
                  label="Destino"
                  name="destino"
                  value={searchData.destino}
                  onChange={(value) => setSearchData(prev => ({ ...prev, destino: value }))}
                  placeholder="Digite o aeroporto"
                  required
                />
              </div>

              {/* Datas */}
              <div className="grid md:grid-cols-2 gap-6">
                <DatePickerInputUI
                  label="Data de ida"
                  name="data_ida"
                  value={searchData.data_ida}
                  onChange={(e) => setSearchData(prev => ({ ...prev, data_ida: e.target.value }))}
                  required
                />

                <DatePickerInputUI
                  label="Data de volta (opcional)"
                  name="data_volta"
                  value={searchData.data_volta}
                  onChange={(e) => setSearchData(prev => ({ ...prev, data_volta: e.target.value }))}
                  minDate={searchData.data_ida || new Date().toISOString().split('T')[0]}
                />
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