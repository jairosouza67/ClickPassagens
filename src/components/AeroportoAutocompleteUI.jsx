import { useState, useRef, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { Label } from './ui/label.jsx'
import { buscarAeroportos } from '../data/aeroportos'
import './AeroportoAutocompleteUI.css'

export default function AeroportoAutocompleteUI({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false,
  className = ""
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
    onChange(newValue)
  }

  const handleSelect = (aeroporto) => {
    setInputValue(aeroporto.codigo)
    onChange(aeroporto.codigo)
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
    onChange('')
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
    <div className="space-y-2 autocomplete-wrapper-ui" ref={wrapperRef}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-aviation-blue" />
        {label}
      </Label>
      <div className="relative">
        <input
          id={name}
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
          className={`h-12 w-full border-2 border-gray-200 rounded-md px-4 pr-10 focus:border-aviation-blue focus:outline-none transition-colors ${className}`}
        />
        {inputValue && (
          <button 
            type="button" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClear}
            tabIndex={-1}
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border-2 border-gray-200 rounded-md shadow-xl max-h-80 overflow-y-auto">
          {suggestions.map((aeroporto, index) => (
            <li
              key={aeroporto.codigo}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(aeroporto)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex-shrink-0 w-12 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-aviation-blue font-bold text-sm">{aeroporto.codigo}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{aeroporto.cidade}</div>
                <div className="text-gray-500 text-xs">{aeroporto.estado}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
