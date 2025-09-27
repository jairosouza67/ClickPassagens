import { useState } from 'react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
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
      cor: 'border-aviation-dark-blue'
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

  const handleBuscaCompleta = (resultadosBusca) => {
    setResultados(resultadosBusca)
    setBuscaRealizada(true)
    setActiveTab('resultados')
  }

  const handleGoogleLogin = () => {
    // Implementar autenticação Google
    window.open('https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email profile&response_type=code', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-aviation p-2 rounded-xl shadow-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-aviation bg-clip-text text-transparent">
                  ClickPassagens
                </span>
                <div className="text-xs text-gray-500 font-medium">Voe mais, gaste menos</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('busca')}
                className={`transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                  activeTab === 'busca' 
                    ? 'text-aviation-blue bg-aviation-blue/10 shadow-sm' 
                    : 'text-gray-700 hover:text-aviation-blue hover:bg-aviation-blue/5'
                }`}
              >
                Buscar
              </button>
              <button 
                onClick={() => setActiveTab('planos')}
                className={`transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                  activeTab === 'planos' 
                    ? 'text-aviation-blue bg-aviation-blue/10 shadow-sm' 
                    : 'text-gray-700 hover:text-aviation-blue hover:bg-aviation-blue/5'
                }`}
              >
                Planos
              </button>
              <button 
                onClick={() => setActiveTab('como-funciona')}
                className={`transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                  activeTab === 'como-funciona' 
                    ? 'text-aviation-blue bg-aviation-blue/10 shadow-sm' 
                    : 'text-gray-700 hover:text-aviation-blue hover:bg-aviation-blue/5'
                }`}
              >
                Como Funciona
              </button>
              <button 
                onClick={() => setActiveTab('contato')}
                className={`transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                  activeTab === 'contato' 
                    ? 'text-aviation-blue bg-aviation-blue/10 shadow-sm' 
                    : 'text-gray-700 hover:text-aviation-blue hover:bg-aviation-blue/5'
                }`}
              >
                Contato
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <PWAInstallButton />
              <Button 
                variant="outline" 
                onClick={handleGoogleLogin}
                className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Entrar</span>
              </Button>
              <Button 
                onClick={() => setActiveTab('planos')}
                className="bg-gradient-aviation hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeTab === 'busca' && (
        <HeroSection onSearchClick={() => setActiveTab('busca')} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1 rounded-xl">
            <TabsTrigger value="busca" className="data-[state=active]:bg-gradient-aviation data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium">
              Buscar Passagens
            </TabsTrigger>
            <TabsTrigger value="resultados" className="data-[state=active]:bg-gradient-aviation data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="planos" className="data-[state=active]:bg-gradient-aviation data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium">
              Planos
            </TabsTrigger>
            <TabsTrigger value="como-funciona" className="data-[state=active]:bg-gradient-aviation data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium">
              Como Funciona
            </TabsTrigger>
            <TabsTrigger value="contato" className="data-[state=active]:bg-gradient-aviation data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium">
              Contato
            </TabsTrigger>
          </TabsList>

          {/* Busca Tab */}
          <TabsContent value="busca" className="animate-fade-in">
            <BuscaIntegrada onBuscaCompleta={handleBuscaCompleta} />
          </TabsContent>

          {/* Resultados Tab */}
          <TabsContent value="resultados" className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Resultados da Busca</h2>
                  <p className="text-gray-600 mt-1">
                    {buscaRealizada ? resultados.length : resultadosExemplo.length} voos encontrados para sua viagem
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Atualizado agora
                  </Badge>
                  <Button variant="outline" className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-6">
                {(buscaRealizada ? resultados : resultadosExemplo).map((resultado, index) => (
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
            </div>
          </TabsContent>

          {/* Planos Tab */}
          <TabsContent value="planos" className="animate-fade-in">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Escolha seu Plano</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Encontre o plano perfeito para suas necessidades de viagem
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {planos.map((plano, index) => (
                  <Card 
                    key={index} 
                    className={`card-hover border-2 ${plano.cor} ${plano.popular ? 'ring-2 ring-aviation-gold ring-offset-2' : ''} bg-white/80 backdrop-blur-sm relative overflow-hidden`}
                  >
                    {plano.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-gold text-white text-center py-2 text-sm font-semibold">
                        <Star className="w-4 h-4 inline mr-1" />
                        Mais Popular
                      </div>
                    )}
                    
                    <CardHeader className={plano.popular ? 'pt-12' : ''}>
                      <CardTitle className="text-2xl font-bold text-gray-900">{plano.nome}</CardTitle>
                      <div className="space-y-2">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-4xl font-bold text-aviation-blue">{plano.preco}</span>
                          <span className="text-gray-500">{plano.periodo}</span>
                        </div>
                        <p className="text-sm text-gray-600">{plano.consultas}</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plano.recursos.map((recurso, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{recurso}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full mt-6 ${
                          plano.popular 
                            ? 'bg-gradient-gold hover:opacity-90 text-white shadow-lg hover:shadow-xl' 
                            : 'bg-gradient-aviation hover:opacity-90 text-white'
                        } transition-all duration-300 transform hover:scale-105`}
                      >
                        {plano.nome === 'Gratuito' ? 'Começar Grátis' : 'Escolher Plano'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Como Funciona Tab */}
          <TabsContent value="como-funciona" className="animate-fade-in">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Como Funciona</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Em poucos passos você encontra a melhor passagem com milhas
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-aviation rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-aviation-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Busque</h3>
                  <p className="text-gray-600">
                    Digite origem, destino e datas. Nossa IA busca em todas as companhias simultaneamente.
                  </p>
                </div>
                
                <div className="text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-aviation rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-aviation-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Compare</h3>
                  <p className="text-gray-600">
                    Veja preços em milhas vs. dinheiro lado a lado. Identifique a melhor economia.
                  </p>
                </div>
                
                <div className="text-center space-y-4 group">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-aviation rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-aviation-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Reserve</h3>
                  <p className="text-gray-600">
                    Clique e seja redirecionado para finalizar sua compra no site da companhia.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contato Tab */}
          <TabsContent value="contato" className="animate-fade-in">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Entre em Contato</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nossa equipe está pronta para ajudar você a voar mais e gastar menos
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Envie uma Mensagem</CardTitle>
                    <CardDescription>
                      Responderemos em até 24 horas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nome</label>
                        <input 
                          type="text" 
                          placeholder="Seu nome"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-aviation-blue outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input 
                          type="email" 
                          placeholder="seu@email.com"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-aviation-blue outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Assunto</label>
                      <input 
                        type="text" 
                        placeholder="Como podemos ajudar?"
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-aviation-blue outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Mensagem</label>
                      <textarea 
                        rows="4"
                        placeholder="Descreva sua dúvida ou sugestão..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-aviation-blue outline-none transition-colors resize-none"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-gradient-aviation hover:opacity-90 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-aviation-blue rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Telefone</h3>
                          <p className="text-gray-600">(11) 9999-9999</p>
                          <p className="text-sm text-gray-500">Seg-Sex: 8h às 18h</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-aviation-light-blue rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email</h3>
                          <p className="text-gray-600">contato@clickpassagens.com</p>
                          <p className="text-sm text-gray-500">Resposta em até 24h</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-aviation-gold rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                          <p className="text-gray-600">(11) 99999-9999</p>
                          <p className="text-sm text-gray-500">Atendimento rápido</p>
                        </div>
                      </div>
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
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-aviation p-2 rounded-xl">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ClickPassagens</span>
              </div>
              <p className="text-gray-400">
                A plataforma mais inteligente para encontrar passagens aéreas com milhas.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab('como-funciona')} className="hover:text-white transition-colors">Como Funciona</button></li>
                <li><button onClick={() => setActiveTab('planos')} className="hover:text-white transition-colors">Planos</button></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><button onClick={() => setActiveTab('contato')} className="hover:text-white transition-colors">Contato</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenças</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 ClickPassagens. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Sistema Online
              </Badge>
              <span className="text-gray-400 text-sm">Versão 2.0.1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App