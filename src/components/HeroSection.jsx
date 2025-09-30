import { useState, useEffect } from 'react'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Plane, Star, TrendingUp, Shield, Clock, Users } from 'lucide-react'

export default function HeroSection({ onSearchClick }) {
  const [currentStat, setCurrentStat] = useState(0)
  
  const stats = [
    { number: "50K+", label: "Passageiros Atendidos", icon: Users },
    { number: "70%", label: "Economia Média", icon: TrendingUp },
    { number: "24/7", label: "Suporte Disponível", icon: Clock },
    { number: "100%", label: "Segurança Garantida", icon: Shield }
  ]

  const companhias = [
    { nome: 'Gol', color: 'bg-orange-500', textColor: 'text-white' },
    { nome: 'Azul', color: 'bg-blue-600', textColor: 'text-white' },
    { nome: 'LATAM', color: 'bg-red-600', textColor: 'text-white' },
    { nome: 'Avianca', color: 'bg-red-500', textColor: 'text-white' },
    { nome: 'Ibéria', color: 'bg-green-600', textColor: 'text-white' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-aviation-blue rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-32 right-10 w-72 h-72 bg-aviation-light-blue rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-aviation-gold rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-aviation-blue/20">
              <Star className="w-4 h-4 mr-2 text-aviation-gold" />
              #1 Plataforma de Milhas do Brasil
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Voe mais,{' '}
              <span className="bg-gradient-aviation bg-clip-text text-transparent">
                gaste menos
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A plataforma mais inteligente para encontrar passagens aéreas com milhas. 
              Compare preços em tempo real e economize até{' '}
              <span className="font-bold text-aviation-blue">70%</span> nas suas viagens.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button 
              size="lg" 
              className="bg-gradient-aviation hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={onSearchClick}
            >
              <Plane className="w-5 h-5 mr-2" />
              Buscar Passagens Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white transition-all duration-300"
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl glass-effect transition-all duration-500 ${
                    currentStat === index ? 'scale-105 shadow-lg' : ''
                  }`}
                >
                  <Icon className="w-8 h-8 text-aviation-blue mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Companhias Parceiras */}
          <div className="mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <p className="text-gray-500 text-sm mb-6 font-medium">Parceiros de confiança</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {companhias.map((companhia, index) => (
                <div 
                  key={index} 
                  className={`${companhia.color} ${companhia.textColor} px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  {companhia.nome}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-aviation-blue to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-1 h-32 bg-gradient-to-b from-aviation-light-blue to-transparent"></div>
    </div>
  )
}