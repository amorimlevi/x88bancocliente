import { useState, useEffect } from 'react'

export const TIMEZONES = [
  { value: 'Europe/Lisbon', label: 'Portugal (Lisboa)' },
  { value: 'America/Sao_Paulo', label: 'Brasil (Brasília)' },
  { value: 'America/New_York', label: 'EUA (Nova York)' },
  { value: 'Europe/London', label: 'Reino Unido (Londres)' },
  { value: 'Europe/Paris', label: 'França (Paris)' },
  { value: 'Asia/Tokyo', label: 'Japão (Tóquio)' },
]

const STORAGE_KEY = 'user-timezone'

export const useTimezone = () => {
  const [timezone, setTimezone] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'Europe/Lisbon'
    }
    return 'Europe/Lisbon'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, timezone)
    }
  }, [timezone])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error('Data inválida:', dateString)
        return 'Data inválida'
      }
      return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: timezone
      }).format(date)
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString)
      return 'Erro na data'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error('Hora inválida:', dateString)
        return 'Hora inválida'
      }
      return new Intl.DateTimeFormat('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
        hour12: false
      }).format(date)
    } catch (error) {
      console.error('Erro ao formatar hora:', error, dateString)
      return 'Erro na hora'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error('DateTime inválido:', dateString)
        return 'Data/hora inválida'
      }
      
      const dataFormatada = new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: timezone
      }).format(date)
      
      const horaFormatada = new Intl.DateTimeFormat('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
        hour12: false
      }).format(date)
      
      console.log('🕐 Formatando:', {
        original: dateString,
        dateObj: date.toISOString(),
        timezone: timezone,
        resultado: `${dataFormatada} às ${horaFormatada}`
      })
      
      return `${dataFormatada} às ${horaFormatada}`
    } catch (error) {
      console.error('Erro ao formatar data/hora:', error, dateString)
      return 'Erro'
    }
  }

  const formatCurrency = (value: number) => {
    const locale = timezone === 'America/Sao_Paulo' ? 'pt-BR' : 'pt-PT'
    return value.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return {
    timezone,
    setTimezone,
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency
  }
}
