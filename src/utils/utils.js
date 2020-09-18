import check 						from 'check-types';

export const nutritionFactsCreate = (props = {
	calories: 0,
	protein: 0, 
	carbohydrates:0,
	fiber:0, 
	sugars:0,
	fat:0,
	saturated:0,
	polyunsaturated:0,
	monounsaturated:0,
	trans:0,
	cholesterol:0,
	sodium:0,
	potassium:0,
	vitaminA:0,
	vitaminC:0,
	calcium:0,
	iron:0,
})=>{
	return [
		{name: 'Calories', value: (props.calories || 0)},
		{name: 'Protein', value: (props.protein || 0)},
		{name: 'Carbohydrates', value: (props.carbohydrates || 0)},
		{name: 'Fiber', value: (props.fiber || 0)},
		{name: 'Sugars', value: (props.sugars || 0)},
		{name: 'Fat', value: (props.fat || 0)},
		{name: 'Saturated', value: (props.saturated || 0)},
		{name: 'Polyunsaturated', value: (props.polyunsaturated || 0)},
		{name: 'Monounsaturated', value: (props.monounsaturated || 0)},
		{name: 'Trans', value: (props.trans || 0)}, 
		{name: 'Cholesterol', value: (props.cholesterol || 0)},
		{name: 'Sodium', value: (props.sodium || 0)},
		{name: 'Potassium', value: (props.potassium || 0)},
		{name: 'Vitamin A', value: (props.vitaminA || 0)}, 
		{name: 'Vitamin C', value: (props.vitaminC || 0)}, 
		{name: 'Calcium', value: (props.calcium || 0)}, 
		{name: 'Iron', value: (props.iron || 0)}
	]
}

/** Taking Array of nutritionFacts and serving, then combine them together
 * [
 * 	0: {serving: 1, nutritionFacts: Array(17)}
 * 	1: {serving: 1, nutritionFacts: Array(17)}
 * ]
 */

export const nutritionFactsCombine = (nutritionFactsList) =>{
  var temp = nutritionFactsCreate();
//   console.log(nutritionFactsList);
  nutritionFactsList && nutritionFactsList.forEach((ingredient)=>{
    temp = temp.map( (nutrition, i) => {
      if(!check.emptyObject(ingredient.nutritionFacts) && !check.undefined(ingredient.nutritionFacts))
      	nutrition.value += (ingredient.nutritionFacts[i].value * ingredient.serving);
	  return nutrition;
    });
  });
  return temp;
}

export const random = (minimum, maximum) => {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
// export const nutritionFacts = (props_1, props_2)=>{
// 	return [
// 		{name: 'Calories', value: (props_1 || ) (props.calories || 0) + (props2.calories || 0)}, 
// 		{name: 'Protein', value: (props.protein || 0) + (props2.protein || 0)}, 
// 		{name: 'Carbohydrates', value: (props.carbohydrates) || 0 + (props2.carbohydrates || 0)},
// 		{name: 'Fiber', value: (props.fiber) || 0 + (props2.fiber || 0)}, 
// 		{name: 'Sugars', value: (props.sugars) || 0 + (props2.sugars || 0)}, 
// 		{name: 'Fat', value: (props.fat) || 0 + (props2.fat || 0)}, 
// 		{name: 'Saturated', value: (props.saturated) || 0 + (props2.saturated || 0)}, 
// 		{name: 'Polyunsaturated', value: (props.polyunsaturated) || 0 + (props2.polyunsaturated || 0)},
// 		{name: 'Monounsaturated', value: (props.monounsaturated) || 0 + (props2.monounsaturated || 0)}, 
// 		{name: 'Trans', value: (props.trans) || 0 + (props2.trans || 0)}, 
// 		{name: 'Cholesterol', value: (props.cholesterol) || 0 + (props2.cholesterol || 0)}, 
// 		{name: 'Sodium', value: (props.sodium) || 0 + (props2.sodium || 0)}, 
// 		{name: 'Potassium', value: (props.potassium) || 0 + (props2.potassium || 0)},
// 		{name: 'Vitamin A', value: (props.vitaminA) || 0 + (props2.vitaminA || 0)}, 
// 		{name: 'Vitamin C', value: (props.vitaminC) || 0 + (props2.vitaminC || 0)}, 
// 		{name: 'Calcium', value: (props.calcium) || 0 + (props2.calcium || 0)}, 
// 		{name: 'Iron', value: (props.iron || 0) + (props2.iron || 0)}
// 	]
// }