// Парсинг Excel файлов
import * as XLSX from 'xlsx'

export function parseExcelFile(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: 'array' })
  const sheetNames = wb.SheetNames
  
  if (sheetNames.length === 0) {
    throw new Error('Файл не содержит листов')
  }
  
  const result = {
    schedule: {},
    recipes: [],
    instructions: []
  }
  
  // Поиск листов по названию
  const scheduleSheetName = sheetNames.find(n => n.toLowerCase().includes('расписание') || n.toLowerCase().includes('schedule')) || sheetNames[0]
  const recipesSheetName = sheetNames.find(n => n.toLowerCase().includes('рецепт') || n.toLowerCase().includes('recipe')) || sheetNames[1] || sheetNames[0]
  const instructionsSheetName = sheetNames.find(n => n.toLowerCase().includes('рецептура') || n.toLowerCase().includes('инструкц')) || sheetNames[2] || sheetNames[0]
  
  // Парсинг расписания
  if (scheduleSheetName) {
    const scheduleSheet = wb.Sheets[scheduleSheetName]
    const scheduleData = XLSX.utils.sheet_to_json(scheduleSheet, { header: 1 })
    
    result.schedule = parseScheduleData(scheduleData)
  }
  
  // Парсинг рецептов
  if (recipesSheetName) {
    const recipesSheet = wb.Sheets[recipesSheetName]
    const recipesData = XLSX.utils.sheet_to_json(recipesSheet)
    
    result.recipes = parseRecipesData(recipesData)
  }
  
  // Парсинг инструкций
  if (instructionsSheetName) {
    const instructionsSheet = wb.Sheets[instructionsSheetName]
    const instructionsData = XLSX.utils.sheet_to_json(instructionsSheet)
    
    result.instructions = parseInstructionsData(instructionsData)
  }
  
  return result
}

function parseScheduleData(data) {
  const schedule = {}
  
  // Пропускаем заголовок
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row[0] || !row[1]) continue
    
    const day = normalizeDay(row[0])
    const mealType = normalizeMealType(row[1])
    const dish = row[2]
    
    if (day && mealType && dish) {
      if (!schedule[day]) schedule[day] = {}
      schedule[day][mealType] = dish
    }
  }
  
  return schedule
}

function parseRecipesData(data) {
  const recipes = []
  
  data.forEach(row => {
    if (row['Блюдо'] || row['dish'] || row[0]) {
      recipes.push({
        dish: row['Блюдо'] || row['dish'] || row[0],
        ingredient: row['Ингредиент'] || row['ingredient'] || row[1],
        qty: parseFloat(row['Количество'] || row['qty'] || row[2]) || 0,
        unit: row['Единица'] || row['unit'] || row[3] || 'шт'
      })
    }
  })
  
  return recipes
}

function parseInstructionsData(data) {
  const instructions = []
  
  data.forEach(row => {
    if (row['Блюдо'] || row['dish'] || row[0]) {
      instructions.push({
        dish: row['Блюдо'] || row['dish'] || row[0],
        instruction: row['Инструкция'] || row['instruction'] || row[1] || ''
      })
    }
  })
  
  return instructions
}

function normalizeDay(day) {
  if (!day) return null
  const d = String(day).toLowerCase().trim()
  const days = {
    'понедельник': 'Понедельник', 'пн': 'Понедельник', 'monday': 'Понедельник',
    'вторник': 'Вторник', 'вт': 'Вторник', 'tuesday': 'Вторник',
    'среда': 'Среда', 'ср': 'Среда', 'wednesday': 'Среда',
    'четверг': 'Четверг', 'чт': 'Четверг', 'thursday': 'Четверг',
    'пятница': 'Пятница', 'пт': 'Пятница', 'friday': 'Пятница',
    'суббота': 'Суббота', 'сб': 'Суббота', 'saturday': 'Суббота',
    'воскресенье': 'Воскресенье', 'вс': 'Воскресенье', 'sunday': 'Воскресенье'
  }
  return days[d] || null
}

function normalizeMealType(mealType) {
  if (!mealType) return null
  const m = String(mealType).toLowerCase().trim()
  const types = {
    'завтрак': 'breakfast', 'breakfast': 'breakfast', 'з': 'breakfast',
    'обед': 'lunch', 'lunch': 'lunch', 'о': 'lunch',
    'ужин': 'dinner', 'dinner': 'dinner', 'у': 'dinner',
    'перекус': 'snack', 'snack': 'snack', 'п': 'snack'
  }
  return types[m] || null
}

export function generateExcelTemplate() {
  const wb = XLSX.utils.book_new()
  
  // Лист Расписание
  const scheduleData = [
    ['День', 'Тип питания', 'Блюдо'],
    ['Понедельник', 'Завтрак', 'Омлет'],
    ['Понедельник', 'Обед', 'Суп'],
    ['Вторник', 'Завтрак', 'Каша'],
    ['Вторник', 'Обед', 'Борщ']
  ]
  const scheduleSheet = XLSX.utils.aoa_to_sheet(scheduleData)
  XLSX.utils.book_append_sheet(wb, scheduleSheet, 'Расписание')
  
  // Лист Рецепты
  const recipesData = [
    ['Блюдо', 'Ингредиент', 'Количество', 'Единица'],
    ['Омлет', 'Яйцо', 2, 'шт'],
    ['Омлет', 'Молоко', 100, 'мл'],
    ['Суп', 'Картофель', 200, 'г'],
    ['Суп', 'Морковь', 50, 'г']
  ]
  const recipesSheet = XLSX.utils.aoa_to_sheet(recipesData)
  XLSX.utils.book_append_sheet(wb, recipesSheet, 'Рецепты')
  
  // Лист Рецептура
  const instructionsData = [
    ['Блюдо', 'Инструкция'],
    ['Омлет', '1. Взбить яйца с молоком. 2. Вылить на сковороду. 3. Жарить 5 минут.']
  ]
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData)
  XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Рецептура')
  
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
}