import { useState, useEffect, useCallback } from 'react'
import { Menu, Upload, Users, Send, Calendar, Database, Bell } from 'lucide-react'
import MenuPlanner from './MenuPlanner'
import TelegramSettings from './TelegramSettings'
import ExcelUploader from './ExcelUploader'
import CompanySettings from './CompanySettings'
import GroupsManager from './GroupsManager'
import History from './History'
import GoogleSheetsSync from './GoogleSheetsSync'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'
import { initDefaultData } from '../data/defaultData'

const TABS = [
  { id: 'menu', label: 'Меню', icon: Menu },
  { id: 'companies', label: 'Компании', icon: Database },
  { id: 'groups', label: 'Группы', icon: Users },
  { id: 'telegram', label: 'Telegram', icon: Send },
  { id: 'upload', label: 'Загрузка', icon: Upload },
  { id: 'sync', label: 'Google Таблицы', icon: Calendar },
  { id: 'history', label: 'История', icon: Bell },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('menu')
  const [companies, setCompanies] = useState([])
  const [activeCompany, setActiveCompany] = useState(null)
  const [schedule, setSchedule] = useState({})
  const [recipes, setRecipes] = useState([])
  const [instructions, setInstructions] = useState([])
  const [groups, setGroups] = useState([])
  const [bots, setBots] = useState([])
  const [sendHistory, setSendHistory] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = loadFromLocalStorage()
    if (data.companies?.length) {
      setCompanies(data.companies)
      setActiveCompany(data.activeCompany || data.companies[0])
    } else {
      const defaults = initDefaultData()
      setCompanies(defaults.companies)
      setActiveCompany(defaults.companies[0])
      saveToLocalStorage(defaults)
    }
    setSchedule(data.schedule || {})
    setRecipes(data.recipes || [])
    setInstructions(data.instructions || [])
    setGroups(data.groups || [])
    setBots(data.bots || [])
    setSendHistory(data.sendHistory || [])
    setAdjustments(data.adjustments || [])
    setLoading(false)
  }, [])

  const saveData = useCallback((newData) => {
    const current = loadFromLocalStorage()
    saveToLocalStorage({ ...current, ...newData })
  }, [])

  const updateCompanies = (newCompanies) => { setCompanies(newCompanies); saveData({ companies: newCompanies }) }
  const updateActiveCompany = (company) => { setActiveCompany(company); saveData({ activeCompany: company }) }
  const updateSchedule = (newSchedule) => { setSchedule(newSchedule); saveData({ schedule: newSchedule }) }
  const updateRecipes = (newRecipes) => { setRecipes(newRecipes); saveData({ recipes: newRecipes }) }
  const updateInstructions = (newInstructions) => { setInstructions(newInstructions); saveData({ instructions: newInstructions }) }
  const updateGroups = (newGroups) => { setGroups(newGroups); saveData({ groups: newGroups }) }
  const updateBots = (newBots) => { setBots(newBots); saveData({ bots: newBots }) }
  const updateSendHistory = (newHistory) => { setSendHistory(newHistory); saveData({ sendHistory: newHistory }) }
  const updateAdjustments = (newAdjustments) => { setAdjustments(newAdjustments); saveData({ adjustments: newAdjustments }) }

  if (loading) return <div className="app-container"><div className="text-center" style={{padding:'100px 0'}}><div className="loading-spinner"></div><p className="text-muted mt-20">Загрузка...</p></div></div>

  return (
    <div className="app-container">
      <header className="header"><h1>NEURAL_ARCHITECT_PREMIUM++</h1><p>Система планирования меню с интеграцией Telegram</p></header>
      <nav className="nav-tabs">{TABS.map(tab => (<button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}><tab.icon size={18}/>{tab.label}</button>))}</nav>
      <main>
        {activeTab === 'menu' && <MenuPlanner activeCompany={activeCompany} companies={companies} schedule={schedule} recipes={recipes} instructions={instructions} groups={groups} bots={bots} adjustments={adjustments} onScheduleChange={updateSchedule} onAdjustmentsChange={updateAdjustments} onHistoryChange={updateSendHistory} />}
        {activeTab === 'companies' && <CompanySettings companies={companies} activeCompany={activeCompany} onCompaniesChange={updateCompanies} onActiveCompanyChange={updateActiveCompany} />}
        {activeTab === 'groups' && <GroupsManager groups={groups} bots={bots} onGroupsChange={updateGroups} onBotsChange={updateBots} />}
        {activeTab === 'telegram' && <TelegramSettings bots={bots} onBotsChange={updateBots} />}
        {activeTab === 'upload' && <ExcelUploader schedule={schedule} recipes={recipes} instructions={instructions} onScheduleChange={updateSchedule} onRecipesChange={updateRecipes} onInstructionsChange={updateInstructions} />}
        {activeTab === 'sync' && <GoogleSheetsSync schedule={schedule} recipes={recipes} instructions={instructions} companies={companies} groups={groups} onScheduleChange={updateSchedule} onRecipesChange={updateRecipes} onInstructionsChange={updateInstructions} onCompaniesChange={updateCompanies} onGroupsChange={updateGroups} />}
        {activeTab === 'history' && <History history={sendHistory} onHistoryChange={updateSendHistory} />}
      </main>
    </div>
  )
}