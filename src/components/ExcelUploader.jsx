import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { parseExcelFile } from '../utils/excelParser'

export default function ExcelUploader({ schedule, recipes, instructions, onScheduleChange, onRecipesChange, onInstructionsChange }) {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setResult(null)
    try {
      const buffer = await file.arrayBuffer()
      const data = parseExcelFile(buffer)
      let scheduleCount = 0, recipesCount = 0, instructionsCount = 0
      if (data.schedule) { const ns = {...schedule}; Object.entries(data.schedule).forEach(([day, meals]) => { ns[day] = meals; scheduleCount++ }); onScheduleChange(ns) }
      if (data.recipes?.length) { onRecipesChange([...recipes, ...data.recipes]); recipesCount = data.recipes.length }
      if (data.instructions?.length) { onInstructionsChange([...instructions, ...data.instructions]); instructionsCount = data.instructions.length }
      setResult({ success: true, scheduleCount, recipesCount, instructionsCount })
    } catch (err) { setResult({ success: false, error: err.message }) }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="card"><h2><FileSpreadsheet size={24}/> Загрузка из Excel</h2>
      <p className="text-muted mb-20">Загрузите Excel с листами: Расписание, Рецепты, Рецептура.</p>
      <div className="upload-zone" onClick={() => fileInputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) { const dt = new DataTransfer(); dt.items.add(file); fileInputRef.current.files = dt.files; handleFileUpload({ target: { files: dt.files } }) }}}>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{display:'none'}}/>
        {uploading ? (<div className="text-center"><div className="loading-spinner"></div><p className="mt-20">Обработка...</p></div>) : (<div className="text-center"><Upload size={48} style={{color:'var(--primary)',marginBottom:16}}/><p>Перетащите файл или нажмите</p><p className="text-muted" style={{fontSize:'0.85rem',marginTop:8}}>.xlsx, .xls, .csv</p></div>)}
      </div>
      {result && (<div className={`result-box ${result.success?'success':'error'}`}>{result.success?(<><CheckCircle size={20}/><div><strong>Загружено!</strong><ul><li>Расписание: {result.scheduleCount} дней</li><li>Рецепты: {result.recipesCount}</li><li>Инструкции: {result.instructionsCount}</li></ul></div></>):(<><AlertCircle size={20}/><div><strong>Ошибка</strong><p>{result.error}</p></div></>)}</div>)}
      <div className="template-info mt-20"><h3>📊 Структура Excel</h3><h4>Расписание</h4><table><thead><tr><th>День</th><th>Тип питания</th><th>Блюдо</th></tr></thead><tbody><tr><td>Понедельник</td><td>Завтрак</td><td>Омлет</td></tr></tbody></table><h4>Рецепты</h4><table><thead><tr><th>Блюдо</th><th>Ингредиент</th><th>Кол-во</th><th>Ед.</th></tr></thead><tbody><tr><td>Омлет</td><td>Яйцо</td><td>2</td><td>шт</td></tr></tbody></table></div>
    </div>
  )
}