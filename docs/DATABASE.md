STRUCTURE

Companies: name, address, people_count
Schedule: day, meal_type, dish
Recipes: dish, ingredient, qty, unit
Instructions: dish, instruction
Groups: name, chat_id, thread_id

LINKS
- Companies -> Schedule (1:M)
- Dish -> Recipes (1:M)
- Dish -> Instructions (1:1)

STORAGE
- LocalStorage key: neural_architect_premium
- Auto-save on changes
- Export/Import JSON

UNITS
- шт, г, кг, мл, л, ст.л., ч.л.