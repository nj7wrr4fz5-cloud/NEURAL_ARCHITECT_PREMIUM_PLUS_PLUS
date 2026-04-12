import { useState } from 'react'
import { Plus, Trash2, Building2, CheckCircle } from 'lucide-react'

export default function CompanySettings({ companies, activeCompany, onCompaniesChange, onActiveCompanyChange }) {
  const [newCompany, setNewCompany] = useState({ name: '', address: '', peopleCount: 10 })

  const addCompany = () => {
    if (!newCompany.name) return
    onCompaniesChange([...companies, { ...newCompany, id: Date.now(), isActive: false }])
    setNewCompany({ name: '', address: '', peopleCount: 10 })
  }
  const removeCompany = (id) => onCompaniesChange(companies.filter(c => c.id !== id))
  const setActive = (id) => {
    onCompaniesChange(companies.map(c => ({ ...c, isActive: c.id === id })))
    onActiveCompanyChange(companies.find(c => c.id === id))
  }
  const updateCompany = (id, field, value) => onCompaniesChange(companies.map(c => c.id === id ? { ...c, [field]: value } : c))

  return (
    <div className="card"><h2><Building2 size={24}/> Управление компаниями</h2>
      <div className="companies-list mb-20">{companies.map(company => (<div key={company.id} className="company-item">
        <div className="company-info"><div className="company-header"><span className="company-name">{company.name}</span>{company.isActive && <CheckCircle size={16} style={{color:'var(--success)'}}/>}</div><span className="company-address">{company.address}</span><span className="company-people">👥 {company.peopleCount} чел.</span></div>
        <div className="company-actions"><button className={`btn ${company.isActive?'btn-primary':'btn-secondary'}`} onClick={()=>setActive(company.id)} style={{padding:'6px 12px',fontSize:'0.85rem'}}>{company.isActive?'Активна':'Выбрать'}</button><button className="btn btn-secondary" onClick={()=>removeCompany(company.id)} style={{padding:'6px 12px',color:'#f44336'}}><Trash2 size={14}/></button></div>
      </div>))}</div>
      <div className="add-form"><h3>Добавить компанию</h3>
        <div className="form-group"><label>Название</label><input className="form-input" placeholder="ООО Ромашка" value={newCompany.name} onChange={e=>setNewCompany(p=>({...p,name:e.target.value}))}/></div>
        <div className="form-group"><label>Адрес</label><input className="form-input" placeholder="ул. Ленина 1" value={newCompany.address} onChange={e=>setNewCompany(p=>({...p,address:e.target.value}))}/></div>
        <div className="form-group"><label>Кол-во человек</label><input className="form-input" type="number" min="1" value={newCompany.peopleCount} onChange={e=>setNewCompany(p=>({...p,peopleCount:parseInt(e.target.value)||1}))}/></div>
        <button className="btn btn-primary" onClick={addCompany} disabled={!newCompany.name}><Plus size={18}/> Добавить</button>
      </div>
    </div>
  )
}