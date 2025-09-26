import { useState } from 'react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Input } from './components/ui/input.jsx'
import { Label } from './components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { Plane, Search, Filter, Star, Clock, MapPin, Users, CreditCard, CheckCircle } from 'lucide-react'
import BuscaIntegrada from './components/BuscaIntegrada.jsx'
import PWAInstallButton from './components/PWAInstallButton.jsx'
import './App.css'

function App() {
  const [searchData, setSearchData] = useState({
    origem: '',
    destino: '',
    dataIda: '',
    dataVolta: '',
    passageiros: '1',
    classe: 'economica'
  })

  const [activeTab, setActiveTab] = useState('busca')

  const companhias = [
    { nome: 'Gol', logo: '🟡', disponivel: true },
    { nome: 'Azul', logo: '🔵', disponivel: true },
    { nome: 'LATAM', logo: '🔴', disponivel: true },
    { nome: 'Avianca', logo: '🟠', disponivel: true },
    { nome: 'Ibéria', logo: '🟢', disponivel: true }
  ]

  const planos = [
    {
      nome: 'Gratuito',
      preco: 'R$ 0',
      consultas: '5 consultas/mês',
      recursos: ['Busca básica', 'Comparação simples', 'Suporte por email']
    },
    {
      nome: 'Básico',
      preco: 'R$ 99',
      consultas: '100 consultas/mês',
      recursos: ['Busca avançada', 'Filtros completos', 'Histórico de buscas', 'Suporte prioritário']
    },
    {
      nome: 'Premium',
      preco: 'R$ 299',
      consultas: '500 consultas/mês',
      recursos: ['Todas as funcionalidades', 'Orçamentos personalizados', 'Cashback 2%', 'Suporte 24/7']
    },
    {
      nome: 'Agente',
      preco: 'R$ 499',
      consultas: '1000 consultas/mês',
      recursos: ['Painel do agente', 'Comissões configuráveis', 'Marca própria', 'Relatórios avançados']
    }
  ]

  const resultadosExemplo = [
    {
      companhia: 'Gol',
      origem: 'São Paulo (GRU)',
      destino: 'Rio de Janeiro (GIG)',
      horario: '08:30 - 09:45',
      milhas: '12.000',
      dinheiro: 'R$ 280',
      economia: 'R$ 120',
      paradas: 'Direto'
    },
    {
      companhia: 'Azul',
      origem: 'São Paulo (GRU)',
      destino: 'Rio de Janeiro (SDU)',
      horario: '10:15 - 11:30',
      milhas: '15.000',
      dinheiro: 'R$ 320',
      economia: 'R$ 95',
      paradas: 'Direto'
    },
    {
      companhia: 'LATAM',
      origem: 'São Paulo (GRU)',
      destino: 'Rio de Janeiro (GIG)',
      horario: '14:20 - 15:35',
      milhas: '18.000',
      dinheiro: 'R$ 380',
      economia: 'R$ 110',
      paradas: 'Direto'
    }
  ]

  const handleSearch = () => {
    setActiveTab('resultados')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ClickPassagens</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('busca')}
                className={`transition-colors ${activeTab === 'busca' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Buscar
              </button>
              <button 
                onClick={() => setActiveTab('planos')}
                className={`transition-colors ${activeTab === 'planos' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Planos
              </button>
              <button 
                onClick={() => setActiveTab('como-funciona')}
                className={`transition-colors ${activeTab === 'como-funciona' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Como Funciona
              </button>
              <button 
                onClick={() => setActiveTab('contato')}
                className={`transition-colors ${activeTab === 'contato' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Contato
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              <Button variant="outline" onClick={() => setActiveTab('contato')}>
                Entrar
              </Button>
              <Button onClick={() => setActiveTab('planos')}>
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Encontre as melhores passagens com{' '}
            <span className="text-blue-600">milhas</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare preços em milhas vs. dinheiro em tempo real. Busque em múltiplas companhias aéreas 
            e economize até 70% nas suas viagens.
          </p>
          
          {/* Companhias Parceiras */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            {companhias.map((companhia, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600">
                <span className="text-2xl">{companhia.logo}</span>
                <span className="font-medium">{companhia.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="busca">Buscar Passagens</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
            <TabsTrigger value="como-funciona">Como Funciona</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
          </TabsList>

          {/* Busca Tab */}
          <TabsContent value="busca">
            <BuscaIntegrada />
          </TabsContent>

          {/* Resultados Tab */}
          <TabsContent value="resultados">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Resultados da Busca</h2>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
              
              <div className="grid gap-4">
                {resultadosExemplo.map((resultado, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Plane className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{resultado.companhia}</p>
                            <p className="text-sm text-gray-500">{resultado.paradas}</p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium">{resultado.origem}</p>
                          <p className="text-sm text-gray-500">Origem</p>
                        </div>
                        
                        <div className="text-center">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                          <p className="font-medium">{resultado.horario}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="font-medium">{resultado.destino}</p>
                          <p className="text-sm text-gray-500">Destino</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{resultado.milhas} milhas</p>
                          <p className="text-sm text-gray-500">vs {resultado.dinheiro}</p>
                          <Badge variant="secondary" className="mt-1">
                            Economia: {resultado.economia}
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
            </div>
          </TabsContent>

          {/* Planos Tab */}
          <TabsContent value="planos">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Escolha seu Plano</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Selecione o plano ideal para suas necessidades de viagem e comece a economizar hoje mesmo.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {planos.map((plano, index) => (
                  <Card key={index} className={`relative ${index === 2 ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                    {index === 2 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600">Mais Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plano.nome}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">{plano.preco}</div>
                      <CardDescription>{plano.consultas}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plano.recursos.map((recurso, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{recurso}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant={index === 2 ? "default" : "outline"}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {index === 0 ? 'Começar Grátis' : 'Assinar Plano'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Como Funciona Tab */}
          <TabsContent value="como-funciona">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Nossa plataforma conecta você às principais companhias aéreas e programas de milhas, 
                  comparando preços em tempo real para você fazer a melhor escolha.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle>1. Busque</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Digite origem, destino e datas. Nossa IA busca nas melhores fontes de milhas e passagens.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle>2. Compare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Veja lado a lado os preços em milhas vs. dinheiro, com economia real calculada automaticamente.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plane className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle>3. Reserve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-600">
                      Escolha a melhor opção e seja redirecionado para finalizar sua compra com segurança.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-center mb-6">Vantagens do ClickPassagens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Comparação automática de preços</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Economia de até 70% nas viagens</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Busca em tempo real</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Sem taxas escondidas</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contato Tab */}
          <TabsContent value="contato">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Tem alguma dúvida ou precisa de ajuda? Nossa equipe está pronta para atendê-lo.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Fale Conosco</CardTitle>
                    <CardDescription>
                      Preencha o formulário e entraremos em contato em até 24h
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="assunto">Assunto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="duvida">Dúvida Geral</SelectItem>
                          <SelectItem value="suporte">Suporte Técnico</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <textarea 
                        id="mensagem"
                        className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
                        placeholder="Descreva sua dúvida ou solicitação"
                      />
                    </div>
                    <Button className="w-full">Enviar Mensagem</Button>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span>São Paulo, SP - Brasil</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span>contato@clickpassagens.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span>Seg-Sex: 9h às 18h</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Central de Ajuda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Visite nossa central de ajuda para encontrar respostas rápidas 
                        para as perguntas mais frequentes.
                      </p>
                      <Button variant="outline" className="w-full">
                        Ir para Central de Ajuda
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6" />
                <span className="text-xl font-bold">ClickPassagens</span>
              </div>
              <p className="text-gray-400">
                A melhor plataforma para encontrar passagens aéreas com milhas.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setActiveTab('como-funciona')}
                    className="hover:text-white transition-colors"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('planos')}
                    className="hover:text-white transition-colors"
                  >
                    Planos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('busca')}
                    className="hover:text-white transition-colors"
                  >
                    API
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setActiveTab('contato')}
                    className="hover:text-white transition-colors"
                  >
                    Central de Ajuda
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('contato')}
                    className="hover:text-white transition-colors"
                  >
                    Contato
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('busca')}
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setActiveTab('contato')}
                    className="hover:text-white transition-colors"
                  >
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('contato')}
                    className="hover:text-white transition-colors"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('contato')}
                    className="hover:text-white transition-colors"
                  >
                    LGPD
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ClickPassagens. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
