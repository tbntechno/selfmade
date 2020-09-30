import React, {useContext, useState, useEffect} from 'react';
import _ 								from 'lodash';
import clone 						from 'clone-deep';
import check 						from 'check-types';
import {db,auth} 				from 'services/firebase';
import NutritionFacts 			    from "components/NutritionFacts/NutritionFacts.jsx"

import { MealContext } from "./Meal"
import SlideDown from "components/SlideDown/SlideDown"
import { toast } from 'react-toastify';


const MealItemIngredient = ({ingredient, meal})=>{
	const {dbIngredients}  				  				= useContext(MealContext);
	const [ingredientData, setIngredientData] 			= useState({});
	const [slideNutritionFacts, setSlideNutritionFacts]	= useState(false);
	const s = ()=>(ingredient.serving > 1? "s" : "");
	return (
    <React.Fragment>
			{ingredient && 
				check.emptyObject(ingredient) ? 			// !! INGREDIENT IS REMOVED!
					<li>The Selected Ingredient Doesn't Existed Anymore</li>
				: <li style={{paddingRight:"5px"}}> 	
					<div onClick={()=>setSlideNutritionFacts(!slideNutritionFacts)} style={{cursor: "pointer"}}>
						{`${ingredient.serving} (${ingredient.unit}${s()}) of ${ingredient.name} `} 
					</div>
					<SlideDown onSlide={slideNutritionFacts}>
						<div style={{backgroundColor:"#D3D3D3"}}>
							<NutritionFacts nutritionFacts={ingredient.nutritionFacts} size={14} spacing={3}/>
						</div>
					</SlideDown>
				</li>
			}
    </React.Fragment>
  )
}
export default MealItemIngredient;
