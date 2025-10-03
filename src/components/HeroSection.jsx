import { useState } from 'react'
import { Plane, MapPin, Calendar, Users, Star, TrendingUp, Shield, Sparkles, Loader2, AlertTriangle } from 'lucide-react'
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
  const [errorMessage, setErrorMessage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!searchData.origem || !searchData.destino || !searchData.data_ida) {
      alert('Por favor, preencha origem, destino e data de ida')
      return
    }

    setLoading(true)
    setErrorMessage(null)

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
        const message = response.headers.get('content-type')?.includes('application/json')
          ? (await response.json()).error
          : `Erro HTTP: ${response.status}`
        throw new Error(message || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data.resultados) {
        const resultadosProcessados = data.data.resultados
        if (!Array.isArray(resultadosProcessados) || resultadosProcessados.length === 0) {
          setErrorMessage('Nenhum voo real foi encontrado para os parâmetros informados. Tente ajustar sua busca.')
          if (onSearchSubmit) {
            onSearchSubmit([])
          }
        } else if (onSearchSubmit) {
          onSearchSubmit(resultadosProcessados)
        }
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error('Formato de resposta inválido')
      }
    } catch (error) {
      console.error('Erro na busca por voos reais:', error)
      const mensagem = error?.message || 'Não foi possível concluir a busca de voos.'
      setErrorMessage(mensagem)
      if (onSearchSubmit) {
        onSearchSubmit([])
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
            <Star className="badge-icon" fill="#fbbf24" />
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

          {errorMessage && (
            <div className="error-banner-hero">
              <AlertTriangle className="error-icon-hero" />
              <div>
                <strong>Não foi possível carregar voos reais.</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

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