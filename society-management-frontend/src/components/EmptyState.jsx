import { SearchX } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description = 'Records will appear here when they are available.' }) {
  return <div className="empty-state"><SearchX size={30} /><h3>{title}</h3><p>{description}</p></div>
}
