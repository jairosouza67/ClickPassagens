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
    if (!searchData.origem || !searchData.destino || !searchData.data_ida) {
      alert('Por favor, preencha origem, destino e data de ida')
      return
    }

    setLoading(true)
    setBuscaRealizada(false)

    try {
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

      const data = await response.json()

      if (data.success) {
        setResultados(data.data.resultados)
        setBuscaRealizada(true)

        // Chamar callback se fornecido
        if (onBuscaCompleta) {
          onBuscaCompleta(data.data.resultados)
        }
      } else {
        alert('Erro na busca: ' + data.error)
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      alert('Erro ao realizar busca')
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
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border-2 border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white rounded-full w-10 h-10 p-0 shadow-lg z-10"
                >
                  <ArrowUpDown className="w-4 h-4" />
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
                  Data de Volta
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
                    {[1,2,3,4,5,6].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Passageiro' : 'Passageiros'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classe" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-aviation-blue" />
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

      {/* Resultados da Busca */}
      {buscaRealizada && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Resultados da Busca</h2>
              <p className="text-gray-600 mt-1">
                {resultados.length} voos encontrados para sua viagem
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="w-4 h-4 mr-1" />
                Atualizado agora
              </Badge>
              <Button variant="outline" className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white">
                Filtros Avançados
              </Button>
            </div>
          </div>
          
          {resultados.length > 0 ? (
            <div className="grid gap-6">
              {resultados.map((resultado, index) => (
                <div key={index} className="animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                  <FlightCard 
                    resultado={resultado} 
                    onSelect={(voo) => {
                      console.log('Voo selecionado:', voo)
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum voo encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Não encontramos voos para os critérios selecionados. 
                  Tente ajustar suas datas ou destinos.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setBuscaRealizada(false)}
                  className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white"
                >
                  Nova Busca
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Companhias Disponíveis */}
      {companhias.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Companhias Parceiras</CardTitle>
            <CardDescription>
              Buscamos nas melhores companhias aéreas para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {companhias.map((companhia, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-aviation-blue transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-aviation rounded-full flex items-center justify-center text-white font-bold mb-2 group-hover:scale-110 transition-transform">
                    {companhia.nome?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-aviation-blue transition-colors">
                    {companhia.nome}
                  </span>
                  <Badge 
                    variant={companhia.ativo ? "default" : "secondary"} 
                    className="mt-2 text-xs"
                  >
                    {companhia.ativo ? 'Ativo' : 'Em breve'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dicas de Economia */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-aviation-gold/10 to-aviation-blue/10 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-aviation-gold rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Dicas para Economizar</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-aviation-blue rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Flexibilidade nas Datas</h4>
                <p className="text-sm text-gray-600">
                  Voos em dias úteis costumam ser mais baratos
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-aviation-light-blue rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Antecedência</h4>
                <p className="text-sm text-gray-600">
                  Reserve com 2-3 meses de antecedência
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-aviation-gold rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Compare Sempre</h4>
                <p className="text-sm text-gray-600">
                  Use nossa plataforma para comparar todas as opções
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}