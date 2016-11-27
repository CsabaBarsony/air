# SQL

## Queries

### Macros by food

```sql
select enabled_food.name, enabled_food.description, GROUP_CONCAT(nutrient.value order by nutrient.value) as macros
from nutrient
join enabled_food
on nutrient.food_id = enabled_food.food_id
where nutrient.nutrient_id = 203
or nutrient.nutrient_id = 204
or nutrient.nutrient_id = 205
group by nutrient.food_id
```