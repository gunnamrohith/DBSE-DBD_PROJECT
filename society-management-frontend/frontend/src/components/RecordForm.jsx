import { useState } from 'react'
import { useApp } from '../context/AppStateContext'

export default function RecordForm({ fields, initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const { data } = useApp()
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field) => [field.name, initial[field.name] ?? ''])))
  const [errors, setErrors] = useState({})

  const relationshipOptions = (type) => {
    if (type === 'flat') return data.flats.map((flat) => ({ value: flat.flat_id, label: `${flat.block_name}-${flat.flat_number}` }))
    if (type === 'resident') return data.residents.map((resident) => ({ value: resident.resident_id, label: resident.resident_name }))
    if (type === 'amenity') return data.amenities.map((amenity) => ({ value: amenity.amenity_id, label: amenity.amenity_name }))
    if (type === 'bill') return data.maintenance.map((bill) => ({ value: bill.bill_id, label: `Bill #${bill.bill_id} · ₹${bill.amount}` }))
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    fields.forEach((field) => {
      if (field.required && !String(values[field.name]).trim()) nextErrors[field.name] = `${field.label} is required.`
      if (field.type === 'email' && values[field.name] && !/^\S+@\S+\.\S+$/.test(values[field.name])) nextErrors[field.name] = 'Enter a valid email address.'
      if (field.type === 'tel' && values[field.name] && !/^\d{10,15}$/.test(values[field.name])) nextErrors[field.name] = 'Enter a 10 to 15 digit phone number.'
    })
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onSubmit(values)
  }

  return <form onSubmit={submit}>
    <div className="form-grid">
      {fields.map((field) => {
        const options = field.options || relationshipOptions(field.type)
        return <label className={`field ${field.type === 'textarea' ? 'field-wide' : ''}`} key={field.name}>
          <span>{field.label}{field.required && <b> *</b>}</span>
          {options ? <select value={values[field.name]} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}>
            <option value="">Select {field.label.toLowerCase()}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select> : field.type === 'textarea' ? <textarea rows="4" value={values[field.name]} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} /> : <input type={field.type || 'text'} value={values[field.name]} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} pattern={field.pattern} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} />}
          {errors[field.name] && <small className="field-error">{errors[field.name]}</small>}
        </label>
      })}
    </div>
    <footer className="modal-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">{submitLabel}</button></footer>
  </form>
}
