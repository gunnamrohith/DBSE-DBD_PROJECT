import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { AppStateContext } from './AppStateContext'

const resources = ['flats', 'residents', 'visitors', 'staff', 'maintenance', 'payments', 'complaints', 'notices', 'amenities', 'bookings']

export function AppProvider({ children }) {
  const [data, setData] = useState(Object.fromEntries(resources.map((key) => [key, []])))
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all(resources.map((resource) => api.list(resource))).then((results) => {
      setData(Object.fromEntries(resources.map((resource, index) => [resource, results[index]])))
      setLoading(false)
    })
  }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const addRecord = async (resource, values) => {
    const record = await api.add(resource, values)
    setData((current) => ({ ...current, [resource]: [record, ...current[resource]] }))
    notify(`${resource.slice(0, -1).replace(/^./, (letter) => letter.toUpperCase())} added successfully.`)
  }

  const updateRecord = async (resource, id, values, idField) => {
    const record = await api.update(resource, id, values)
    setData((current) => ({ ...current, [resource]: current[resource].map((item) => Number(item[idField]) === Number(id) ? record : item) }))
    notify('Changes saved successfully.')
  }

  const deleteRecord = async (resource, id, idField) => {
    await api.remove(resource, id)
    setData((current) => ({ ...current, [resource]: current[resource].filter((item) => Number(item[idField]) !== Number(id)) }))
    notify('Record deleted successfully.')
  }

  return <AppStateContext.Provider value={{ data, loading, toast, addRecord, updateRecord, deleteRecord }}>{children}</AppStateContext.Provider>
}
