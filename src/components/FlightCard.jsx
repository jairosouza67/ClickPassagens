import { Button } from './ui/button.jsx'
import { Card, CardContent } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import {
  Plane,
  Clock,
  TrendingDown,
  Star,
  Zap,
  ArrowRight,
  CreditCard,
  Coins
} from 'lucide-react'

const companhiaLogos = {
  'Gol': { bg: 'bg-orange-500', icon: '✈️' },
  'Azul': { bg: 'bg-blue-600', icon: '🔵' },
  'LATAM': { bg: 'bg-red-600', icon: '🔴' },
  'Avianca': { bg: 'bg-red-500', icon: '🟠' },
  'Ibéria': { bg: 'bg-green-600', icon: '🟢' }
}

export default function FlightCard({ resultado, onSelect }) {
  if (!resultado) return null;

  // Função para converter duração ISO 8601 para formato legível
  const formatarDuracao = (duracao) => {
    if (!duracao) return '2h';
    
    const match = duracao.match(/PT(\d+)H(\d+)M/);
    if (!match) return '2h';
    
    const horas = parseInt(match[1]);
    const minutos = parseInt(match[2]);
    
    return minutos === 0 ? `${horas}h` : `${horas}h ${minutos}min`;
  }

  const logo = companhiaLogos[resultado.companhia?.nome] || { bg: 'bg-gray-500', icon: '✈️' }
  const economiaPercentual = resultado.preco_dinheiro && resultado.economia_calculada
    ? Math.round((resultado.economia_calculada / resultado.preco_dinheiro) * 100)
    : 0

  return (
    <Card className="card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative">
          {/* Header com companhia */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className={`${logo.bg} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                {logo.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{resultado.companhia?.nome || 'Companhia'}</h3>
                <p className="text-sm text-gray-500">{resultado.paradas || 'Direto'}</p>
              </div>
            </div>
            
            {economiaPercentual > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                -{economiaPercentual}%
              </Badge>
            )}
          </div>

          {/* Rota e horário */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{resultado.origem || 'GRU'}</div>
                  <div className="text-sm text-gray-500">{resultado.horario_saida || '08:30'}</div>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-full h-0.5 bg-gradient-to-r from-aviation-blue to-aviation-light-blue"></div>
                  <div className="absolute bg-white p-2 rounded-full shadow-md">
                    <Plane className="w-4 h-4 text-aviation-blue transform rotate-90" />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{resultado.destino || 'GIG'}</div>
                  <div className="text-sm text-gray-500">{resultado.horario_chegada || '09:45'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              Duração: {formatarDuracao(resultado.duracao)}
            </div>
          </div>

          {/* Preços */}
          <div className="bg-gray-50/80 p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Milhas */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 group-hover:border-aviation-blue transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-aviation-gold" />
                    <span className="text-sm font-medium text-gray-600">Milhas</span>
                  </div>
                  <Zap className="w-4 h-4 text-aviation-gold" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{resultado.milhas_necessarias?.toLocaleString() || 0}</div>
                <div className="text-xs text-gray-500">+ taxas</div>
              </div>

              {/* Dinheiro */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Dinheiro</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">R$ {resultado.preco_dinheiro?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 0}</div>
                {resultado.economia_calculada > 0 && (
                  <div className="text-xs text-green-600 font-medium">Economia: R$ {resultado.economia_calculada?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || 0}</div>
                )}
              </div>
            </div>

            {/* Botão de seleção */}
            <Button 
              className="w-full bg-gradient-aviation hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
              onClick={() => onSelect && onSelect(resultado)}
            >
              <span>Selecionar Voo</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Indicador de melhor oferta */}
          {economiaPercentual >= 30 && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-aviation-gold text-white border-0 px-3 py-1 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Melhor Oferta
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
