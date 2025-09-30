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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={voltarPaginaInicial}
              className="flex items-center space-x-3 hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer group"
              title="Voltar à página inicial"
            >
              <div className="bg-gradient-aviation p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-aviation bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300">
                  ClickPassagens
                </span>
                <div className="text-xs text-gray-500 font-medium">Voe mais, gaste menos</div>
              </div>
            </button>
            
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
                onClick={() => setActiveTab('resultados')}
                className={`transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                  activeTab === 'resultados' 
                    ? 'text-aviation-blue bg-aviation-blue/10 shadow-sm' 
                    : 'text-gray-700 hover:text-aviation-blue hover:bg-aviation-blue/5'
                }`}
              >
                Resultados
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
                onClick={handleGoogleLogin}
                variant="outline" 
                className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white transition-colors duration-300"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Busca */}
          <TabsContent value="busca" className="m-0">
            <BuscaIntegrada onBuscaCompleta={handleBuscaCompleta} />
          </TabsContent>

          {/* Tab Resultados */}
          <TabsContent value="resultados" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {buscaRealizada && resultados.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Resultados da Busca</h2>
                      <p className="text-gray-600 mt-2">Encontramos {resultados.length} opções para você</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('busca')}
                      variant="outline"
                      className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Nova Busca
                    </Button>
                  </div>
                  
                  <div className="grid gap-6">
                    {resultados.map((resultado, index) => (
                      <FlightCard 
                        key={index} 
                        resultado={resultado}
                        onSelect={(voo) => console.log('Voo selecionado:', voo)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Plane className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma busca realizada</h3>
                  <p className="text-gray-600 mb-6">Faça uma busca para ver os resultados aqui</p>
                  <Button 
                    onClick={() => setActiveTab('busca')}
                    className="bg-gradient-aviation hover:opacity-90 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Fazer Busca
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab Planos */}
          <TabsContent value="planos" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Escolha o <span className="bg-gradient-aviation bg-clip-text text-transparent">Plano Ideal</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Encontre a opção que melhor se adapta às suas necessidades de viagem
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {planos.map((plano) => (
                  <Card key={plano.nome} className={`relative ${plano.cor} ${plano.popular ? 'ring-2 ring-aviation-gold shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                    {plano.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-aviation-gold text-white border-0 px-4 py-1 text-sm font-semibold">
                          <Star className="w-3 h-3 mr-1" />
                          Mais Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-2xl font-bold text-gray-900">{plano.nome}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">{plano.preco}</span>
                        <span className="text-gray-500">{plano.periodo}</span>
                      </div>
                      <CardDescription className="text-sm text-gray-600 mt-2">
                        {plano.consultas}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plano.recursos.map((recurso, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{recurso}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full mt-6 ${
                          plano.popular 
                            ? 'bg-gradient-aviation hover:opacity-90 text-white' 
                            : 'border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white'
                        }`}
                        variant={plano.popular ? 'default' : 'outline'}
                      >
                        Escolher {plano.nome}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Seção de recursos adicionais */}
              <div className="mt-20 grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Segurança Total</h3>
                  <p className="text-gray-600">Transações protegidas e dados criptografados</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Economia Garantida</h3>
                  <p className="text-gray-600">Até 60% de economia em passagens aéreas</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Busca Rápida</h3>
                  <p className="text-gray-600">Resultados em tempo real de múltiplas companhias</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab Contato */}
          <TabsContent value="contato" className="m-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Entre em <span className="bg-gradient-aviation bg-clip-text text-transparent">Contato</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nossa equipe está pronta para ajudar você a encontrar as melhores ofertas
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefone</h3>
                  <p className="text-gray-600 mb-4">Atendimento de segunda a sexta, 8h às 18h</p>
                  <p className="text-aviation-blue font-semibold">(11) 99999-9999</p>
                </Card>

                <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">E-mail</h3>
                  <p className="text-gray-600 mb-4">Resposta em até 24 horas</p>
                  <p className="text-aviation-blue font-semibold">contato@clickpassagens.com</p>
                </Card>

                <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-aviation p-4 rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Online</h3>
                  <p className="text-gray-600 mb-4">Suporte instantâneo</p>
                  <Button className="bg-gradient-aviation hover:opacity-90 text-white">
                    Iniciar Chat
                  </Button>
                </Card>
              </div>

              {/* FAQ Seção */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Perguntas Frequentes</h3>
                <div className="space-y-6">
                  {[
                    {
                      pergunta: "Como funciona a busca por passagens com milhas?",
                      resposta: "Nossa plataforma compara preços em dinheiro e milhas de múltiplas companhias aéreas, mostrando a melhor opção para economia."
                    },
                    {
                      pergunta: "As milhas são transferidas automaticamente?",
                      resposta: "Não, você precisa ter as milhas em sua conta. Mostramos quanto você precisará para cada voo."
                    },
                    {
                      pergunta: "Há taxa de serviço?",
                      resposta: "Nosso serviço básico é gratuito. Para funcionalidades avançadas, oferecemos planos pagos."
                    },
                    {
                      pergunta: "Como garantir o melhor preço?",
                      resposta: "Use nossos filtros avançados e alertas de preço para acompanhar variações e encontrar a melhor oportunidade."
                    }
                  ].map((faq, index) => (
                    <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.pergunta}</h4>
                      <p className="text-gray-600">{faq.resposta}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-aviation p-2 rounded-lg">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ClickPassagens</span>
              </div>
              <p className="text-gray-400">
                A melhor plataforma para encontrar passagens aéreas com milhas e economizar em suas viagens.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Busca de Passagens</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comparador de Milhas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alertas de Preço</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programa de Fidelidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status do Sistema</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reportar Problema</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClickPassagens. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App