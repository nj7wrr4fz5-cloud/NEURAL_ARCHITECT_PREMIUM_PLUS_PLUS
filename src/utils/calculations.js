// Утилиты для расчёта ингредиентов

export function formatQuantity(qty, unit) {
  if (!qty || qty === 0) return '—'
  const rounded = Math.round(qty * 100) / 100
  return `${rounded} ${unit}`
}

export function calculateIngredients(day, meals, peopleCount, recipes, adjustments = []) {
  if (!meals || Object.keys(meals).length === 0) return []
  
  const ingredientMap = new Map()
  
  // Проходим по каждому блюду дня
  Object.entries(meals).forEach(([mealType, dishName]) => {
    if (!dishName) return
    
    // Находим рецепты для этого блюда
    const dishRecipes = recipes.filter(r => r.dish === dishName)
    
    dishRecipes.forEach(recipe => {
      const key = `${recipe.ingredient}-${recipe.unit}`
      const current = ingredientMap.get(key) || { name: recipe.ingredient, qty: 0, unit: recipe.unit }
      
      // Рассчитываем количество с учётом людей
      const multiplier = peopleCount / 10 // База на 10 человек
      current.qty += (recipe.qty || 0) * multiplier
      
      ingredientMap.set(key, current)
    })
  })
  
  // Применяем корректировки
  adjustments.forEach(adj => {
    const key = `${adj.name}-${adj.unit}`
    const current = ingredientMap.get(key)
    if (current) {
      current.qty += adj.qty
    } else {
      ingredientMap.set(key, { name: adj.name, qty: adj.qty, unit: adj.unit })
    }
  })
  
  // Сортируем по названию
  return Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function getDishesFromRecipes(recipes) {
  const dishes = new Set(recipes.map(r => r.dish))
  return Array.from(dishes).sort()
}

export function getIngredientsForDish(dishName, recipes) {
  return recipes.filter(r => r.dish === dishName)
}