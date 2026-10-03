import { X } from 'lucide-react'

export default function Modal({ title, children, onClose, size = '' }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <header className="modal-header"><div><span className="eyebrow">Society management</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></header>
      {children}
    </section>
  </div>
}
