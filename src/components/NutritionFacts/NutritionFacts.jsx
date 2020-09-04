
import React from 'react';

const NutritionFacts = ({nutritionFacts, serving = 1, size = "16px", spacing="6px", showMacro=true})=>{	
	const MACROS = ["Calories", "Protein", "Carbohydrates", "Fat"];
	return <div style={{fontSize:size}}>
		{(nutritionFacts) && nutritionFacts.map((nutrient, i)=>{
			var $elmt = <label key={i} className={nutrient.name} style={{margin: spacing}}>{`${nutrient.name}:${nutrient.value*serving}`}</label>;
			return <span key={i}>
				{showMacro ? $elmt: MACROS.includes(nutrient.name) ? $elmt : ""}
			</span>
		})}
	</div>
}

export default NutritionFacts;