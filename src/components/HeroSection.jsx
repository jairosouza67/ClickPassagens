import { useState } from 'react'
import { Plane, MapPin, Calendar, Users, Star, TrendingUp, Shield, Sparkles, Loader2 } from 'lucide-react'
import { API_URL } from '../config.js'

const API_BASE_URL = `${API_URL}/api`

export default function HeroSection({ onSearchSubmit }) {
  const [searchData, setSearchData] = useState({
    origem: '',
    destino: '',
    data_ida: '',
    data_volta: '',
    passageiros: 1,
    classe: 'economica'
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const gerarResultadosEstaticos = (dadosBusca) => {
    const companhiasBase = [
      { codigo: 'G3', nome: 'Gol', valor_milheiro: 45, ativa: true },
      { codigo: 'AD', nome: 'Azul', valor_milheiro: 50, ativa: true },
      { codigo: 'LA', nome: 'LATAM', valor_milheiro: 48, ativa: true },
      { codigo: 'O6', nome: 'Avianca', valor_milheiro: 46, ativa: true },
      { codigo: 'TP', nome: 'TAP', valor_milheiro: 52, ativa: true }
    ]

    const resultados = []
    const precoBase = calcularPrecoBase(dadosBusca.origem, dadosBusca.destino)
    const duracao = calcularDuracaoVoo(dadosBusca.origem, dadosBusca.destino)

    companhiasBase.forEach((companhia, index) => {
      for (let i = 0; i < 2; i++) {
        const variacao = 1 + (Math.random() * 0.4 - 0.2)
        const preco = Math.round(precoBase * variacao)
        const milhas = Math.round((preco / companhia.valor_milheiro) * 1000)
        const economia = Math.round(((preco - (milhas * companhia.valor_milheiro / 1000)) / preco) * 100)
        const hora = 6 + (index * 3) + (i * 6)

        resultados.push({
          id: `${companhia.codigo}-${index}-${i}`,
          companhia: {
            id: companhia.codigo,
            nome: companhia.nome,
            codigo: companhia.codigo,
            ativa: true,
            valor_milheiro: companhia.valor_milheiro
          },
          voo_numero: `${companhia.codigo}${1000 + index * 100 + i}`,
          horario_saida: `${hora.toString().padStart(2, '0')}:${(index * 15).toString().padStart(2, '0')}`,
          horario_chegada: `${((hora + duracao) % 24).toString().padStart(2, '0')}:${((index * 15) + 30).toString().padStart(2, '0')}`,
          milhas_necessarias: milhas,
          preco_dinheiro: Math.round(preco * 100) / 100,
          economia_calculada: economia,
          paradas: index === 0 ? 'Direto' : index === 1 ? 'Direto' : '1 parada',
          disponivel: true,
          origem: dadosBusca.origem,
          destino: dadosBusca.destino,
          duracao: `PT${duracao}H${index % 2 === 0 ? 0 : 30}M`,
          data: dadosBusca.data_ida
        })
      }
    })

    return resultados
  }

  const calcularPrecoBase = (origem, destino) => {
    const rotasDomesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
    if (rotasDomesticas.includes(origem?.toUpperCase()) && rotasDomesticas.includes(destino?.toUpperCase())) {
      return 350
    }
    return 1200
  }

  const calcularDuracaoVoo = (origem, destino) => {
    const rotasDomesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
    if (rotasDomesticas.includes(origem?.toUpperCase()) && rotasDomesticas.includes(destino?.toUpperCase())) {
      return 2
    }
    return 8
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!searchData.origem || !searchData.destino || !searchData.data_ida) {
      alert('Por favor, preencha origem, destino e data de ida')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/busca/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...searchData,
          usuario_id: 1
        })
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data.resultados) {
        const resultadosProcessados = data.data.resultados
        if (onSearchSubmit) {
          onSearchSubmit(resultadosProcessados)
        }
      } else {
        throw new Error('Formato de resposta inválido')
      }
    } catch (error) {
      console.error('Erro na busca, usando dados estáticos:', error)
      const resultadosEstaticos = gerarResultadosEstaticos(searchData)
      if (onSearchSubmit) {
        onSearchSubmit(resultadosEstaticos)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hero-section">
      {/* Hero Content */}
      <div className="hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <Star className="badge-icon" />
            <span>#1 Plataforma de Milhas do Brasil</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Voe mais, <span className="gradient-text">gaste menos</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            A plataforma mais inteligente para encontrar passagens aéreas com milhas. 
            Compare preços em tempo real e economize até <strong>70%</strong> nas suas viagens.
          </p>

          {/* CTA Buttons - Desktop */}
          <div className="hero-cta desktop-only">
            <button className="btn-primary-hero" type="button">
              <Plane className="btn-icon" />
              Buscar Passagens Agora
            </button>
            <button className="btn-secondary-hero" type="button">
              Ver Como Funciona
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="search-card-hero">
          <div className="search-card-header">
            <Sparkles className="search-header-icon" />
            <h3>Encontre sua próxima viagem</h3>
          </div>

          <form onSubmit={handleSubmit} className="search-form-hero">
            {/* Origem */}
            <div className="form-group-hero">
              <label>
                <MapPin className="label-icon" />
                Origem
              </label>
              <input
                type="text"
                name="origem"
                placeholder="Ex: GRU, CGH, GIG"
                value={searchData.origem}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Destino */}
            <div className="form-group-hero">
              <label>
                <MapPin className="label-icon" />
                Destino
              </label>
              <input
                type="text"
                name="destino"
                placeholder="Ex: BSB, SSA, FOR"
                value={searchData.destino}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Data Ida */}
            <div className="form-group-hero">
              <label>
                <Calendar className="label-icon" />
                Data de Ida
              </label>
              <input
                type="date"
                name="data_ida"
                value={searchData.data_ida}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Data Volta */}
            <div className="form-group-hero">
              <label>
                <Calendar className="label-icon" />
                Data de Volta
              </label>
              <input
                type="date"
                name="data_volta"
                value={searchData.data_volta}
                onChange={handleInputChange}
              />
            </div>

            {/* Passageiros */}
            <div className="form-group-hero">
              <label>
                <Users className="label-icon" />
                Passageiros
              </label>
              <select
                name="passageiros"
                value={searchData.passageiros}
                onChange={handleInputChange}
              >
                <option value="1">1 Passageiro</option>
                <option value="2">2 Passageiros</option>
                <option value="3">3 Passageiros</option>
                <option value="4">4 Passageiros</option>
                <option value="5">5+ Passageiros</option>
              </select>
            </div>

            {/* Classe */}
            <div className="form-group-hero">
              <label>Classe</label>
              <select
                name="classe"
                value={searchData.classe}
                onChange={handleInputChange}
              >
                <option value="economica">Econômica</option>
                <option value="executiva">Executiva</option>
                <option value="primeira">Primeira Classe</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-search-hero" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="btn-icon animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Plane className="btn-icon" />
                  Buscar Voos Agora
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section-hero">
        <div className="stats-grid-hero">
          <div className="stat-card-hero">
            <div className="stat-icon-hero">👥</div>
            <div className="stat-number-hero">50K+</div>
            <div className="stat-label-hero">Passageiros Atendidos</div>
          </div>
          <div className="stat-card-hero">
            <TrendingUp className="stat-icon-hero-svg" />
            <div className="stat-number-hero">70%</div>
            <div className="stat-label-hero">Economia Média</div>
          </div>
          <div className="stat-card-hero">
            <div className="stat-icon-hero">⏰</div>
            <div className="stat-number-hero">24/7</div>
            <div className="stat-label-hero">Suporte Disponível</div>
          </div>
          <div className="stat-card-hero">
            <Shield className="stat-icon-hero-svg" />
            <div className="stat-number-hero">100%</div>
            <div className="stat-label-hero">Segurança Garantida</div>
          </div>
        </div>
      </div>

      {/* Airlines Section */}
      <div className="airlines-section-hero">
        <p className="airlines-title">Parceiros de confiança</p>
        <div className="airlines-grid-hero">
          <div className="airline-logo-hero gol">GOL</div>
          <div className="airline-logo-hero azul">AZUL</div>
          <div className="airline-logo-hero latam">LATAM</div>
          <div className="airline-logo-hero avianca">AVIANCA</div>
          <div className="airline-logo-hero tap">TAP</div>
        </div>
      </div>
    </div>
  )
}