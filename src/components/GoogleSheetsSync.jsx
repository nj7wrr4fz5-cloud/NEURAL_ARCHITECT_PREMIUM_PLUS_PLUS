import { useState } from 'react'
import { Calendar, RefreshCw, Link, AlertCircle, CheckCircle } from 'lucide-react'

export default function GoogleSheetsSync({ schedule, recipes, instructions, companies, groups, onScheduleChange, onRecipesChange, onInstructionsChange, onCompaniesChange, onGroupsChange }) {
  const [sheetUrl, setSheetUrl] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState(null)

  const extractSheetId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : null
  }

  const syncFromSheet = async () => {
    const sheetId = extractSheetId(sheetUrl)
    if (!sheetId) { setResult({ success: false, error: 'Неверный URL таблицы' }); return }
    setSyncing(true); setResult(null)
    // Здесь будет интеграция с Google Sheets API
    // Пока заглушка - в реальном приложении использовать Google Sheets API
    setTimeout(() => {
      setResult({ success: true, message: 'Синхронизация настроена. Подключите Google Sheets в настройках.' })
      setSyncing(false)
    }, 1500)
  }

  return (
    <div className="card"><h2><Calendar size={24}/> Google Таблицы</h2>
      <p className="text-muted mb-20">Подключите Google Таблицу для автоматической синхронизации данных.</p>
      <div className="form-group"><label>URL таблицы</label><input className="form-input" placeholder="https://docs.google.com/spreadsheets/d/..." value={sheetUrl} onChange={e=>setSheetUrl(e.target.value)}/></div>
      <button className="btn btn-primary" onClick={syncFromSheet} disabled={syncing||!sheetUrl}>{syncing?<><RefreshCw size={18} className="spin"/> Синхронизация...</>:<><Link size={18}/> Подключить</>}</button>
      {result && (<div className={`result-box ${result.success?'success':'error'}`}>{result.success?<><CheckCircle size={20}/><div>{result.message}</div></>:<><AlertCircle size={20}/><div>{result.error}</div></>}</div>)}
      <div className="sync-info mt-20"><h3>📊 Синхронизируемые данные</h3>
        <ul><li><strong>Расписание</strong> — меню на каждый день</li><li><strong>Рецепты</strong> — ингредиенты блюд</li><li><strong>Рецептура</strong> — инструкции приготовления</li><li><strong>Компании</strong> — список компаний</li><li><strong>Группы</strong> — Telegram группы</li></ul>
      </div>
    </div>
  )
}