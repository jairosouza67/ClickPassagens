import { useRef } from 'react'
import { Calendar } from 'lucide-react'
import { Label } from './ui/label.jsx'

export default function DatePickerInputUI({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  minDate = null,
  className = "" 
}) {
  const inputRef = useRef(null)

  const handleClick = () => {
    // Força a abertura do calendário nativo
    if (inputRef.current) {
      inputRef.current.showPicker()
    }
  }

  const handleKeyDown = (e) => {
    // Previne a digitação manual
    if (e.key !== 'Tab' && e.key !== 'Escape') {
      e.preventDefault()
      if (inputRef.current) {
        inputRef.current.showPicker()
      }
    }
  }

  // Formata a data mínima para o formato YYYY-MM-DD
  const getMinDate = () => {
    if (minDate) return minDate
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-aviation-blue" />
        {label}
      </Label>
      <input
        ref={inputRef}
        id={name}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        min={getMinDate()}
        required={required}
        className={`h-12 w-full border-2 border-gray-200 rounded-md px-4 focus:border-aviation-blue focus:outline-none transition-colors cursor-pointer ${className}`}
      />
    </div>
  )
}
