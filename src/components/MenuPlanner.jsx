import { useState, useMemo, useCallback } from 'react'
import { Send, Calendar, Search, Plus, Trash2 } from 'lucide-react'
import { formatQuantity, calculateIngredients } from '../utils/calculations'
import { sendToTelegram } from '../services/telegram'
import { DAYS, MEAL_TYPES } from '../data/defaultData'

export default function MenuPlanner({ activeCompany, schedule, recipes, groups, bots, adjustments, onScheduleChange, onAdjustmentsChange, onHistoryChange }) {
  const [selectedDay, setSelectedDay] = useState(DAYS[0])
  const [peopleCount, setPeopleCount] = useState(10)
  const [ingSearch, setIngSearch] = useState('')
  const [showIngredients, setShowIngredients] = useState(true)
  const [sendStatus, setSendStatus] = useState(null)
  const [newAdjustment, setNewAdjustment] = useState({ name: '', qty: 0, unit: 'шт' })

  const dishNames = useMemo(() => {
    const names = new Set(recipes.map(r => r.dish))
    return Array.from(names).sort()
  }, [recipes])

  const daySchedule = schedule[selectedDay] || {}

  const ingredients = useMemo(() => {
    if (!selectedDay) return []
    return calculateIngredients(selectedDay, daySchedule, peopleCount, recipes, adjustments)
  }, [selectedDay, daySchedule, peopleCount, recipes, adjustments])

  const filteredIngredients = useMemo(() => {
    if (!ingSearch) return ingredients
    const q = ingSearch.toLowerCase()
    return ingredients.filter(i => i.name.toLowerCase().includes(q))
  }, [ingredients, ingSearch])

  const updateMeal = (mealType, dish) => {
    onScheduleChange({ ...schedule, [selectedDay]: { ...(schedule[selectedDay] || {}), [mealType]: dish } })
  }

  const removeMeal = (mealType) => {
    const dayData = { ...(schedule[selectedDay] || {}) }
    delete dayData[mealType]
    onScheduleChange({ ...schedule, [selectedDay]: dayData })
  }

  const buildMessage = useCallback((includeIngredients = true) => {
    if (!activeCompany || !selectedDay) return ''
    const dayData = schedule[selectedDay] || {}
    const activeMeals = MEAL_TYPES.filter(mt => dayData[mt.id])
    let text = `🏢 *${activeCompany.name}*\n📋 *${selectedDay}*\n\n*Меню:*\n`
    activeMeals.forEach(mt => { text += `${mt.icon} *${mt.name}:* ${dayData[mt.id]}\n` })
    if (includeIngredients && filteredIngredients.length) {
      text += `\n*Ингредиенты (${filteredIngredients.length}):*\n`
      filteredIngredients.forEach(ing => { text += `  • ${ing.name} — ${formatQuantity(ing.qty, ing.unit)}\n` })
    }
    return text
  }, [activeCompany, selectedDay, schedule, filteredIngredients])

  const sendMenu = async () => {
    if (!bots.length || !groups.length) { setSendStatus('error'); return }
    setSendStatus('sending')
    const activeBot = bots.find(b => b.isActive) || bots[0]
    const text = buildMessage(showIngredients)
    try {
      const results = await Promise.all(groups.filter(g => g.isActive).map(g => sendToTelegram(activeBot.token, g.chatId, text, g.threadId)))
      const success = results.every(r => r.ok)
      setSendStatus(success ? 'ok' : 'error')
      if (success) {
        const newEntry = { id: Date.now(), ts: new Date().toLocaleString('ru-RU'), type: 'menu', day: selectedDay, groups: groups.filter(g => g.isActive).map(g => g.name), success: true }
        onHistoryChange(newEntry)
      }
    } catch (err) { setSendStatus('error') }
    setTimeout(() => setSendStatus(null), 4000)
  }

  const addAdjustment = () => {
    if (!newAdjustment.name) return
    onAdjustmentsChange([...adjustments, { ...newAdjustment, id: Date.now() }])
    setNewAdjustment({ name: '', qty: 0, unit: 'шт' })
  }

  const removeAdjustment = (id) => onAdjustmentsChange(adjustments.filter(a => a.id !== id))

  return (
    <div className="grid-2">
      <div className="card"><h2><Calendar size={24}/> Планирование меню</h2>
        <div className="form-group"><label>День недели</label>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{DAYS.map(day => (<button key={day} className={`btn ${selectedDay===day?'btn-primary':'btn-secondary'}`} onClick={()=>setSelectedDay(day)} style={{padding:'8px 16px'}}>{day.slice(0,3)}</button>))}</div>
        </div>
        <div className="form-group"><label>Количество человек: {peopleCount}</label><input type="range" min="1" max="100" value={peopleCount} onChange={e=>setPeopleCount(parseInt(e.target.value))} className="form-input" style={{padding:0}}/></div>
        {MEAL_TYPES.map(meal => (<div key={meal.id} className="form-group"><label>{meal.icon} {meal.name}</label><div style={{display:'flex',gap:'8px'}}><select className="form-input" value={daySchedule[meal.id]||''} onChange={e=>updateMeal(meal.id,e.target.value)}><option value="">— Не выбрано —</option>{dishNames.map(dish=>(<option key={dish} value={dish}>{dish}</option>))}</select>{daySchedule[meal.id]&&<button className="btn btn-secondary" onClick={()=>removeMeal(meal.id)} style={{padding:'8px'}}><Trash2 size={18}/></button>}</div></div>))}
        <div className="form-group mt-20"><label>Корректировки</label>
          <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
            <input className="form-input" placeholder="Название" value={newAdjustment.name} onChange={e=>setNewAdjustment(p=>({...p,name:e.target.value}))} style={{flex:2}}/>
            <input className="form-input" type="number" placeholder="Кол-во" value={newAdjustment.qty} onChange={e=>setNewAdjustment(p=>({...p,qty:parseFloat(e.target.value)||0}))} style={{flex:1}}/>
            <select className="form-input" value={newAdjustment.unit} onChange={e=>setNewAdjustment(p=>({...p,unit:e.target.value}))} style={{flex:1}}><option value="шт">шт</option><option value="кг">кг</option><option value="г">г</option><option value="л">л</option><option value="мл">мл</option></select>
            <button className="btn btn-primary" onClick={addAdjustment}><Plus size={18}/></button>
          </div>
          {adjustments.map(adj=>(<div key={adj.id} className="adjustment-item"><span>{adj.name}: {adj.qty} {adj.unit}</span><button className="btn-icon" onClick={()=>removeAdjustment(adj.id)}><Trash2 size={14}/></button></div>))}
        </div>
      </div>
      <div className="card"><h2><Send size={24}/> Отправка</h2>
        <div className="form-group"><label>Превью</label><div className="message-preview"><pre>{buildMessage(showIngredients)}</pre></div></div>
        <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}><input type="checkbox" checked={showIngredients} onChange={e=>setShowIngredients(e.target.checked)}/>Включить ингредиенты</label></div>
        <button className="btn btn-primary" onClick={sendMenu} disabled={sendStatus==='sending'} style={{width:'100%'}}>{sendStatus==='sending'?'Отправка...':sendStatus==='ok'?'✅ Отправлено!':sendStatus==='error'?'❌ Ошибка':'📤 Отправить'}</button>
        {showIngredients&&(<><div className="form-group mt-20"><label><Search size={16}/> Поиск</label><input className="form-input" placeholder="Поиск..." value={ingSearch} onChange={e=>setIngSearch(e.target.value)}/></div>
        <div className="ingredients-list"><h3>Итого: {filteredIngredients.length}</h3>{filteredIngredients.map((ing,idx)=>(<div key={idx} className="ingredient-item"><span>{ing.name}</span><span>{formatQuantity(ing.qty,ing.unit)}</span></div>))}</div></>)}
      </div>
    </div>
  )
}