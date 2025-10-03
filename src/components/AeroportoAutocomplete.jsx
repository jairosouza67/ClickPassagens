import { useState, useRef, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { buscarAeroportos } from '../data/aeroportos'

export default function AeroportoAutocomplete({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false 
}) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value.toUpperCase()
    setInputValue(newValue)
    
    if (newValue.length > 0) {
      const results = buscarAeroportos(newValue)
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    // Atualiza o valor no formulário pai
    onChange({ target: { name, value: newValue } })
  }

  const handleSelect = (aeroporto) => {
    setInputValue(aeroporto.codigo)
    onChange({ target: { name, value: aeroporto.codigo } })
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleClear = () => {
    setInputValue('')
    onChange({ target: { name, value: '' } })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    if (inputValue.length > 0) {
      const results = buscarAeroportos(inputValue)
      setSuggestions(results)
      setShowSuggestions(true)
    }
  }

  return (
    <div className="form-group-hero autocomplete-wrapper" ref={wrapperRef}>
      <label>
        <MapPin className="label-icon" />
        {label}
      </label>
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          required={required}
          autoComplete="off"
          maxLength={3}
        />
        {inputValue && (
          <button 
            type="button" 
            className="autocomplete-clear-btn"
            onClick={handleClear}
            tabIndex={-1}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((aeroporto, index) => (
            <li
              key={aeroporto.codigo}
              className={`autocomplete-suggestion-item ${
                index === selectedIndex ? 'selected' : ''
              }`}
              onClick={() => handleSelect(aeroporto)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="suggestion-code">{aeroporto.codigo}</div>
              <div className="suggestion-details">
                <div className="suggestion-name">{aeroporto.cidade}</div>
                <div className="suggestion-location">{aeroporto.estado}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
