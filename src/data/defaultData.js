// Данные по умолчанию

export function initDefaultData() {
  return {
    companies: [
      { id: 1, name: 'ООО "Ромашка"', address: 'ул. Ленина 1', peopleCount: 50, isActive: true },
      { id: 2, name: 'ИП Иванов', address: 'ул. Пушкина 10', peopleCount: 20, isActive: false }
    ],
    activeCompany: null,
    schedule: {
      'Понедельник': { breakfast: 'Каша овсяная', lunch: 'Суп куриный', dinner: 'Котлета с пюре' },
      'Вторник': { breakfast: 'Омлет', lunch: 'Борщ', dinner: 'Рыба с овощами' },
      'Среда': { breakfast: 'Сырники', lunch: 'Щи', dinner: 'Гуляш с гречкой' },
      'Четверг': { breakfast: 'Каша манная', lunch: 'Рассольник', dinner: 'Курица с рисом' },
      'Пятница': { breakfast: 'Яичница', lunch: 'Солянка', dinner: 'Пельмени' },
      'Суббота': { breakfast: 'Блины', lunch: 'Уха', dinner: 'Овощное рагу' },
      'Воскресенье': { breakfast: 'Творог', lunch: 'Картофельный суп', dinner: 'Салат с мясом' }
    },
    recipes: [
      { dish: 'Каша овсяная', ingredient: 'Крупа овсяная', qty: 50, unit: 'г' },
      { dish: 'Каша овсяная', ingredient: 'Молоко', qty: 150, unit: 'мл' },
      { dish: 'Каша овсяная', ingredient: 'Сахар', qty: 10, unit: 'г' },
      { dish: 'Омлет', ingredient: 'Яйцо', qty: 2, unit: 'шт' },
      { dish: 'Омлет', ingredient: 'Молоко', qty: 50, unit: 'мл' },
      { dish: 'Омлет', ingredient: 'Соль', qty: 2, unit: 'г' },
      { dish: 'Суп куриный', ingredient: 'Курица', qty: 100, unit: 'г' },
      { dish: 'Суп куриный', ingredient: 'Картофель', qty: 80, unit: 'г' },
      { dish: 'Суп куриный', ingredient: 'Морковь', qty: 30, unit: 'г' },
      { dish: 'Суп куриный', ingredient: 'Лук', qty: 20, unit: 'г' },
      { dish: 'Борщ', ingredient: 'Свекла', qty: 60, unit: 'г' },
      { dish: 'Борщ', ingredient: 'Капуста', qty: 50, unit: 'г' },
      { dish: 'Борщ', ingredient: 'Картофель', qty: 80, unit: 'г' },
      { dish: 'Борщ', ingredient: 'Мясо', qty: 80, unit: 'г' },
      { dish: 'Котлета с пюре', ingredient: 'Фарш', qty: 100, unit: 'г' },
      { dish: 'Котлета с пюре', ingredient: 'Картофель', qty: 150, unit: 'г' },
      { dish: 'Котлета с пюре', ingredient: 'Масло сливочное', qty: 10, unit: 'г' }
    ],
    instructions: [
      { dish: 'Каша овсяная', instruction: '1. Вскипятить молоко. 2. Всыпать крупу, варить 10 мин. 3. Добавить сахар.' },
      { dish: 'Омлет', instruction: '1. Взбить яйца с молоком. 2. Вылить на сковороду. 3. Жарить под крышкой 5 мин.' },
      { dish: 'Суп куриный', instruction: '1. Отварить курицу. 2. Добавить картофель. 3. За 10 мин до готовности добавить морковь и лук.' },
      { dish: 'Борщ', instruction: '1. Отварить мясо. 2. Свеклу нарезать и потушить. 3. Добавить капусту и картофель. 4. За 5 мин — томат.' }
    ],
    groups: [],
    bots: [],
    sendHistory: [],
    adjustments: []
  }
}

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export const MEAL_TYPES = [
  { id: 'breakfast', name: 'Завтрак', icon: '🌅' },
  { id: 'lunch', name: 'Обед', icon: '☀️' },
  { id: 'dinner', name: 'Ужин', icon: '🌙' },
  { id: 'snack', name: 'Перекус', icon: '🍎' }
]

export const UNITS = ['шт', 'г', 'кг', 'мл', 'л', 'ст.л.', 'ч.л.']