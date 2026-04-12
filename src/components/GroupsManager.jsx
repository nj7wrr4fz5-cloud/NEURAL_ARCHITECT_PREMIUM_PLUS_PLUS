import { useState } from 'react'
import { Plus, Trash2, Users, CheckCircle, XCircle } from 'lucide-react'

export default function GroupsManager({ groups, bots, onGroupsChange, onBotsChange }) {
  const [newGroup, setNewGroup] = useState({ name: '', chatId: '', threadId: '', isActive: true })

  const addGroup = () => {
    if (!newGroup.name || !newGroup.chatId) return
    onGroupsChange([...groups, { ...newGroup, id: Date.now() }])
    setNewGroup({ name: '', chatId: '', threadId: '', isActive: true })
  }
  const removeGroup = (id) => onGroupsChange(groups.filter(g => g.id !== id))
  const toggleGroupActive = (id) => onGroupsChange(groups.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g))

  return (
    <div className="card"><h2><Users size={24}/> Telegram группы</h2>
      <p className="text-muted mb-20">Добавьте группы для отправки меню. Chat ID можно получить через @userinfobot</p>
      {groups.length > 0 && (<div className="groups-list mb-20">{groups.map(group => (<div key={group.id} className="group-item"><div className="group-info"><span className="group-name">{group.name}</span><code className="group-chatid">{group.chatId}</code>{group.threadId && <code className="group-thread">thread: {group.threadId}</code>}</div><div className="group-actions"><button className={`btn ${group.isActive?'btn-primary':'btn-secondary'}`} onClick={()=>toggleGroupActive(group.id)} style={{padding:'6px 12px',fontSize:'0.85rem'}}>{group.isActive?<CheckCircle size={14}/>:<XCircle size={14}/> {group.isActive?'Активна':'Неактивна'}</button><button className="btn btn-secondary" onClick={()=>removeGroup(group.id)} style={{padding:'6px 12px',color:'#f44336'}}><Trash2 size={14}/></button></div></div>))}</div>)}
      <div className="add-form"><h3>Добавить группу</h3>
        <div className="form-group"><label>Название</label><input className="form-input" placeholder="Столовая 1" value={newGroup.name} onChange={e=>setNewGroup(p=>({...p,name:e.target.value}))}/></div>
        <div className="form-group"><label>Chat ID</label><input className="form-input" placeholder="-1001234567890" value={newGroup.chatId} onChange={e=>setNewGroup(p=>({...p,chatId:e.target.value}))}/></div>
        <div className="form-group"><label>Thread ID (опционально)</label><input className="form-input" placeholder="Тема в группе" value={newGroup.threadId} onChange={e=>setNewGroup(p=>({...p,threadId:e.target.value}))}/></div>
        <button className="btn btn-primary" onClick={addGroup} disabled={!newGroup.name||!newGroup.chatId}><Plus size={18}/> Добавить</button>
      </div>
    </div>
  )
}