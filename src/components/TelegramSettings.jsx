import { useState } from 'react'
import { Plus, Trash2, CheckCircle, XCircle, Key } from 'lucide-react'
import { testBotToken } from '../services/telegram'

export default function TelegramSettings({ bots, onBotsChange }) {
  const [newBot, setNewBot] = useState({ token: '', name: '', isActive: false })
  const [testing, setTesting] = useState(null)
  const [testResult, setTestResult] = useState(null)


  const addBot = () => {
    if (!newBot.token) return
    onBotsChange([...bots, { ...newBot, id: Date.now() }])
    setNewBot({ token: '', name: '', isActive: false })
  }
  const removeBot = (id) => onBotsChange(bots.filter(b => b.id !== id))
  const toggleBotActive = (id) => onBotsChange(bots.map(b => ({ ...b, isActive: b.id === id ? !b.isActive : false })))

  const testToken = async (token) => {
    setTesting(token); setTestResult(null)
    try {
      const result = await testBotToken(token)
      setTestResult({ ok: result.ok, name: result.ok ? result.result?.first_name : 'Ошибка' })
    } catch (err) { setTestResult({ ok: false, name: 'Ошибка' }) }
    setTesting(null)
  }

  return (
    <div className="card"><h2><Key size={24}/> Настройка Telegram ботов</h2>
      <p className="text-muted mb-20">Добавьте токены ботов. Получить токен можно у @BotFather.</p>
      {bots.length > 0 && (<div className="bots-list mb-20">{bots.map(bot => (<div key={bot.id} className="bot-item"><div className="bot-info"><span className="bot-name">{bot.name || 'Без названия'}</span><code className="bot-token">{bot.token.slice(0,10)}...{bot.token.slice(-5)}</code></div><div className="bot-actions"><button className={`btn ${bot.isActive?'btn-primary':'btn-secondary'}`} onClick={()=>toggleBotActive(bot.id)} style={{padding:'6px 12px',fontSize:'0.85rem'}}>{bot.isActive?<CheckCircle size={14}/>:<XCircle size={14}/> {bot.isActive?'Активен':'Неактивен'}</button><button className="btn btn-secondary" onClick={()=>testToken(bot.token)} disabled={testing===bot.token} style={{padding:'6px 12px',fontSize:'0.85rem'}}>{testing===bot.token?'Тест...':'Тест'}</button><button className="btn btn-secondary" onClick={()=>removeBot(bot.id)} style={{padding:'6px 12px',fontSize:'0.85rem',color:'#f44336'}}><Trash2 size={14}/></button></div></div>))}</div>)}
      {testResult && (<div className={`test-result ${testResult.ok?'success':'error'}`}>{testResult.ok?`✅ Бот: ${testResult.name}`:`❌ Ошибка`}</div>)}
      <div className="add-bot-form"><h3>Добавить бота</h3>
        <div className="form-group"><label>Токен</label><input className="form-input" placeholder="1234567890:ABC..." value={newBot.token} onChange={e=>setNewBot(p=>({...p,token:e.target.value}))}/></div>
        <div className="form-group"><label>Название</label><input className="form-input" placeholder="Основной бот" value={newBot.name} onChange={e=>setNewBot(p=>({...p,name:e.target.value}))}/></div>
        <button className="btn btn-primary" onClick={addBot} disabled={!newBot.token}><Plus size={18}/> Добавить</button>
      </div>
      <div className="instructions mt-20"><h3>📋 Инструкция:</h3><ol><li>Откройте @BotFather в Telegram</li><li>Отправьте /newbot</li><li>Придумайте имя и username</li><li>Скопируйте токен</li><li>Добавьте бота в группу</li></ol></div>
    </div>
  )
}