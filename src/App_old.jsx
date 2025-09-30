import { useState } from 'react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { 
  Plane, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  Shield,
  TrendingUp,
  Zap,
  Award,
  Phone,
  Mail,
  MessageCircle,
  TrendingDown
} from 'lucide-react'
import BuscaIntegrada from './components/BuscaIntegrada.jsx'
import PWAInstallButton from './components/PWAInstallButton.jsx'
import HeroSection from './components/HeroSection.jsx'
import FlightCard from './components/FlightCard.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('busca')
  const [resultados, setResultados] = useState([])
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  const planos = [
    {
      nome: 'Gratuito',
      preco: 'R$ 0',
      periodo: '/mês',
      consultas: '5 consultas/mês',
      recursos: ['Busca básica', 'Comparação simples', 'Suporte por email'],
      popular: false,
      cor: 'border-gray-200'
    },
    {
      nome: 'Básico',
      preco: 'R$ 99',
      periodo: '/mês',
      consultas: '100 consultas/mês',
      recursos: ['Busca avançada', 'Filtros completos', 'Histórico de buscas', 'Suporte prioritário'],
      popular: false,
      cor: 'border-aviation-blue'
    },
    {
      nome: 'Premium',
      preco: 'R$ 299',
      periodo: '/mês',
      consultas: '500 consultas/mês',
      recursos: ['Todas as funcionalidades', 'Orçamentos personalizados', 'Cashback 2%', 'Suporte 24/7'],
      popular: true,
      cor: 'border-aviation-gold'
    },
    {
      nome: 'Agente',
      preco: 'R$ 499',
      periodo: '/mês',
      consultas: '1000 consultas/mês',
      recursos: ['Painel do agente', 'Comissões configuráveis', 'Marca própria', 'Relatórios avançados'],
      popular: false,
      cor: 'border-purple-500'
    }
  ]

  const resultadosExemplo = [
    {
      companhia: { nome: 'Gol' },
      origem: 'GRU',
      destino: 'GIG',
      horario_saida: '08:30',
      horario_chegada: '09:45',
      milhas_necessarias: 12000,
      preco_dinheiro: 280,
      economia_calculada: 120,
      paradas: 'Direto',
      duracao: 'PT1H15M'
    },
    {
      companhia: { nome: 'Azul' },
      origem: 'GRU',
      destino: 'SDU',
      horario_saida: '10:15',
      horario_chegada: '11:30',
      milhas_necessarias: 15000,
      preco_dinheiro: 320,
      economia_calculada: 95,
      paradas: 'Direto',
      duracao: 'PT1H15M'
    },
    {
      companhia: { nome: 'LATAM' },
      origem: 'GRU',
      destino: 'GIG',
      horario_saida: '14:20',
      horario_chegada: '15:35',
      milhas_necessarias: 18000,
      preco_dinheiro: 380,
      economia_calculada: 110,
      paradas: 'Direto',
      duracao: 'PT1H15M'
    }
  ]

  const handleBuscaCompleta = (resultadosBusca) => {
    console.log('Resultados recebidos:', resultadosBusca)
    if (Array.isArray(resultadosBusca)) {
      setResultados(resultadosBusca)
      setBuscaRealizada(true)
      setActiveTab('resultados')
    } else {
      console.error('Resultados inválidos:', resultadosBusca)
    }
  }

  const handleGoogleLogin = () => {
    // Implementar autenticação Google
    window.open('https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email profile&response_type=code', '_blank')
  }

  const voltarPaginaInicial = () => {
    setActiveTab('busca')
    setResultados([])
    setBuscaRealizada(false)
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
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Buscar</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Planos</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Como Funciona</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
            </nav>
            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              <Button variant="outline">Entrar</Button>
              <Button>Cadastrar</Button>
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="busca">Buscar Passagens</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
            <TabsTrigger value="planos">Planos</TabsTrigger>
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
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
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
