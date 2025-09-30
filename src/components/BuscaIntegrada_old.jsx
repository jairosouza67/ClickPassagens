import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Badge } from './ui/badge.jsx'
import { Loader2, Search, Plane, Clock, MapPin, Users } from 'lucide-react'

const API_BASE_URL = 'http://localhost:5001/api'

export default function BuscaIntegrada() {
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

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarMilhas = (milhas) => {
    return new Intl.NumberFormat('pt-BR').format(milhas)
  }

  return (
    <div className="space-y-6">
      {/* Formulário de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Passagens (Integrado com API)</span>
          </CardTitle>
          <CardDescription>
            Busca real integrada com o backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="origem"
                  placeholder="GRU"
                  className="pl-10"
                  value={searchData.origem}
                  onChange={(e) => setSearchData({...searchData, origem: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destino"
                  placeholder="GIG"
                  className="pl-10"
                  value={searchData.destino}
                  onChange={(e) => setSearchData({...searchData, destino: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataIda">Data de Ida</Label>
              <Input
                id="dataIda"
                type="date"
                value={searchData.data_ida}
                onChange={(e) => setSearchData({...searchData, data_ida: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataVolta">Data de Volta (opcional)</Label>
              <Input
                id="dataVolta"
                type="date"
                value={searchData.data_volta}
                onChange={(e) => setSearchData({...searchData, data_volta: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passageiros">Passageiros</Label>
              <Select value={searchData.passageiros.toString()} onValueChange={(value) => setSearchData({...searchData, passageiros: parseInt(value)})}>
                <SelectTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passageiro</SelectItem>
                  <SelectItem value="2">2 Passageiros</SelectItem>
                  <SelectItem value="3">3 Passageiros</SelectItem>
                  <SelectItem value="4">4 Passageiros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="classe">Classe</Label>
              <Select value={searchData.classe} onValueChange={(value) => setSearchData({...searchData, classe: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economica">Econômica</SelectItem>
                  <SelectItem value="premium">Premium Economy</SelectItem>
                  <SelectItem value="executiva">Executiva</SelectItem>
                  <SelectItem value="primeira">Primeira Classe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={realizarBusca} disabled={loading} className="w-full md:w-auto" size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar Passagens
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Companhias Disponíveis */}
      {companhias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Companhias Parceiras</CardTitle>
            <CardDescription>
              Buscamos nas melhores companhias aéreas do mercado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {companhias.map((companhia) => (
                <div key={companhia.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{companhia.nome}</p>
                    <p className="text-sm text-gray-500">
                      Milheiro: {formatarMoeda(companhia.valor_milheiro)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados da Busca */}
      {buscaRealizada && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Busca</CardTitle>
            <CardDescription>
              {resultados.length} opções encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultados.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum resultado encontrado para esta busca.
              </p>
            ) : (
              <div className="space-y-4">
                {resultados.map((resultado) => (
                  <Card key={resultado.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Plane className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{resultado.companhia?.nome}</p>
                            <p className="text-sm text-gray-500">{resultado.voo_numero}</p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium">{searchData.origem}</p>
                          <p className="text-sm text-gray-500">Origem</p>
                        </div>
                        
                        <div className="text-center">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                          <p className="font-medium">
                            {resultado.horario_saida} - {resultado.horario_chegada}
                          </p>
                          <p className="text-sm text-gray-500">{resultado.paradas}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium">{searchData.destino}</p>
                          <p className="text-sm text-gray-500">Destino</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">
                            {formatarMilhas(resultado.milhas_necessarias)} milhas
                          </p>
                          <p className="text-sm text-gray-500">
                            vs {formatarMoeda(resultado.preco_dinheiro)}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            Economia: {formatarMoeda(resultado.economia_calculada)}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <Button className="w-full">
                            Selecionar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
