import { Bell, Trash2, CheckCircle, XCircle } from 'lucide-react'

export default function History({ history, onHistoryChange }) {
  const clearHistory = () => onHistoryChange([])
  const deleteEntry = (id) => onHistoryChange(history.filter(h => h.id !== id))

  return (
    <div className="card"><h2><Bell size={24}/> История отправок</h2>
      {history.length === 0 ? (<p className="text-muted">История пуста</p>) : (
        <>
          <div className="flex-between mb-20"><span>{history.length} записей</span><button className="btn btn-secondary" onClick={clearHistory}><Trash2 size={16}/> Очистить</button></div>
          <div className="history-list">{history.map(entry => (<div key={entry.id} className="history-item">
            <div className="history-info"><span className="history-time">{entry.ts}</span><span className="history-type">{entry.type === 'menu' ? '📋 Меню' : '📝 Рассылка'}</span><span className="history-day">{entry.day}</span></div>
            <div className="history-groups">{entry.groups?.join(', ')}</div>
            <div className="history-status">{entry.success ? <CheckCircle size={16} style={{color:'var(--success)'}}/> : <XCircle size={16} style={{color:'var(--error)'}}/>}</div>
            <button className="btn-icon" onClick={()=>deleteEntry(entry.id)}><Trash2 size={14}/></button>
          </div>))}</div>
        </>
      )}
    </div>
  )
}