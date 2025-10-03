import { useState, useRef } from 'react'
import { Calendar } from 'lucide-react'

export default function DatePickerInput({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  minDate = null 
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
    <div className="form-group-hero">
      <label>
        <Calendar className="label-icon" />
        {label}
      </label>
      <input
        ref={inputRef}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        min={getMinDate()}
        required={required}
        className="date-picker-input"
      />
    </div>
  )
}
