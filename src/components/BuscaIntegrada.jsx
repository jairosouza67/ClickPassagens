import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Badge } from './ui/badge.jsx'
import { Loader2, Search, Plane, Clock, MapPin, Users, Calendar, ArrowUpDown } from 'lucide-react'
import FlightCard from './FlightCard.jsx'

const API_BASE_URL = 'http://localhost:5001/api'

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
      console.log('Fazendo requisição para:', `${API_BASE_URL}/busca/buscar`)
      const response = await fetch(`${API_BASE_URL}/busca/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...searchData,
          usuario_id: 1 // Usuário padrão para demonstração
        })
      })

      console.log('Resposta recebida:', response.status)
      const data = await response.json()
      console.log('Dados da resposta:', data)

      if (data.success) {
        setResultados(data.data.resultados)
        setBuscaRealizada(true)
        
        // Chamar callback se fornecido
        if (onBuscaCompleta) {
          console.log('Chamando callback com resultados:', data.data.resultados)
          onBuscaCompleta(data.data.resultados)
        }
      } else {
        alert('Erro na busca: ' + data.error)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      alert('Erro ao realizar busca: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const trocarOrigemDestino = () => {
    setSearchData(prev => ({
      ...prev,
      origem: prev.destino,
      destino: prev.origem
    }))
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Busca Melhorado */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-aviation text-white">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="bg-white/20 p-2 rounded-lg">
              <Search className="h-6 w-6" />
            </div>
            <span>Encontre sua passagem ideal</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Compare preços em milhas vs. dinheiro em tempo real
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Origem e Destino */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origem" className="text-sm font-semibold text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-aviation-blue" />
                      Origem
                    </Label>
                    <Input
                      id="origem"
                      placeholder="São Paulo (GRU)"
                      value={searchData.origem}
                      onChange={(e) => setSearchData({...searchData, origem: e.target.value})}
                      className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destino" className="text-sm font-semibold text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-aviation-light-blue" />
                      Destino
                    </Label>
                    <Input
                      id="destino"
                      placeholder="Rio de Janeiro (GIG)"
                      value={searchData.destino}
                      onChange={(e) => setSearchData({...searchData, destino: e.target.value})}
                      className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl"
                    />
                  </div>
                </div>
                
                {/* Botão de trocar origem/destino */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={trocarOrigemDestino}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white rounded-full p-2 shadow-lg z-10"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Datas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data_ida" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-aviation-blue" />
                  Data de Ida
                </Label>
                <Input
                  id="data_ida"
                  type="date"
                  value={searchData.data_ida}
                  onChange={(e) => setSearchData({...searchData, data_ida: e.target.value})}
                  className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data_volta" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-aviation-light-blue" />
                  Data de Volta (opcional)
                </Label>
                <Input
                  id="data_volta"
                  type="date"
                  value={searchData.data_volta}
                  onChange={(e) => setSearchData({...searchData, data_volta: e.target.value})}
                  className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl"
                />
              </div>
            </div>

            {/* Passageiros e Classe */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passageiros" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-aviation-blue" />
                  Passageiros
                </Label>
                <Select value={searchData.passageiros.toString()} onValueChange={(value) => setSearchData({...searchData, passageiros: parseInt(value)})}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} passageiro{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classe" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-aviation-light-blue" />
                  Classe
                </Label>
                <Select value={searchData.classe} onValueChange={(value) => setSearchData({...searchData, classe: value})}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-aviation-blue rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economica">Econômica</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="executiva">Executiva</SelectItem>
                    <SelectItem value="primeira">Primeira Classe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Botão de Busca */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={realizarBusca}
              disabled={loading}
              size="lg"
              className="bg-gradient-aviation hover:opacity-90 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Buscando voos...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Buscar Passagens
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Busca */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-aviation-blue/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-aviation-blue" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Dicas para economizar</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p>• Seja flexível com as datas para encontrar melhores preços</p>
                  <p>• Compare preços em milhas vs. dinheiro</p>
                </div>
                <div className="space-y-2">
                  <p>• Considere aeroportos alternativos próximos</p>
                  <p>• Voos com escalas podem ser mais econômicos</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Busca */}
      {buscaRealizada && (
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-aviation text-white">
            <CardTitle className="flex items-center space-x-3">
              <Plane className="h-6 w-6" />
              <span>Resultados da Busca</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {resultados.length} voos encontrados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {resultados.length > 0 ? (
              <div className="space-y-4">
                {resultados.map((voo, index) => (
                  <FlightCard key={index} voo={voo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nenhum voo encontrado para os critérios selecionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}