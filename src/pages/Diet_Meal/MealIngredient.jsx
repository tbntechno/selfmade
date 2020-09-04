import React, {useContext, useState, useEffect} from 'react';
import _ 								from 'lodash';
import clone 						from 'clone-deep';
import check 						from 'check-types';
import {db,auth} 				from 'services/firebase';
import NutritionFacts 			    from "components/NutritionFacts/NutritionFacts.jsx"

import { MealContext } from "./DietMeal"
import SlideDown from "components/SlideDown/SlideDown"
import { toast } from 'react-toastify';


const MealIngredient = ({ingredient, meal})=>{
	const {ingredientList}  				  			            = useContext(MealContext);
	const [ingredientData, setIngredientData] 			    = useState({});
	const [slideNutritionFacts, setSlideNutritionFacts]	= useState(false);

	useEffect(()=>{
		if(!check.emptyArray(ingredientList) ){
			// var cloneList = clone(ingredientList);
			// Maping and filter out the necessary
			var data = {};
			for (let i = 0; i < ingredientList.length; i++) {
				if( ingredientList[i].id == ingredient.ingredientID ){
					data['serving'] 	   = ingredient.serving;
					data['ingredientID']   = ingredient.ingredientID;
					data['unit']		   = ingredientList[i].unit;
					data['name']		   = ingredientList[i].name;
					data['nutritionFacts'] = ingredientList[i].nutritionFacts;
					break;
				}
      }
      setIngredientData(data);
      /*********************************************************
			 *  CHECK IF LIST INGREDIENT EXIST (THEN) REMOVE THE INGREDIENT
      * ******************************************************* */
      if(!_.find(ingredientList, {id: ingredient.ingredientID})) {
        const time = 7000;
        toast.error("One of the Ingredients doesn't exist anymore! Processing to remove the ingredient!", {
          autoClose: time,
          position: toast.POSITION.TOP_Right,
          toastId: "no-duplicate"
        })
        setTimeout(()=>{
          const cleanMeal = {
            ingredients: meal.ingredients.filter((ing)=>{
              return ing.ingredientID !== ingredient.ingredientID
            }),
            instruction: meal.instruction,
            name: meal.name,
            userID: auth.currentUser.uid
          }
          db.collection('diet_meals').doc(meal.id).set(cleanMeal)
            .then(()=>console.log("Removed Non-Existing Ingredient!"))
            .catch((error) => {
              alert("Unexpected Error");
              console.log("Unexpected Error", error);
            })
        }, time - 500);
      }
		}
  },[ingredientList]);
  
  const removeNonExistingIngredient = (id) =>{

  }

	const s = ()=>(ingredientData.serving > 1? "s" : "");
	return (
    <React.Fragment>
			{ingredientData && 
				check.emptyObject(ingredientData) ? 			// !! INGREDIENT IS REMOVED!
					<li>The Selected Ingredient Doesn't Existed Anymore</li>
				: <li style={{paddingRight:"5px"}}> 	
					<div onClick={()=>setSlideNutritionFacts(!slideNutritionFacts)} style={{cursor: "pointer"}}>
						{`${ingredientData.serving} (${ingredientData.unit}${s()}) of ${ingredientData.name} `} 
					</div>
					<SlideDown onSlide={slideNutritionFacts}>
						<div style={{backgroundColor:"#D3D3D3"}}>
							<NutritionFacts nutritionFacts={ingredientData.nutritionFacts} size={14} spacing={3}/>
						</div>
					</SlideDown>
				</li>
			}
    </React.Fragment>
  )
}

export default MealIngredient;
