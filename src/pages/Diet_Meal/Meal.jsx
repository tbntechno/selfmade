import React, {useContext, useState, useEffect} from 'react';
import check 					from 'check-types';
import clone 					from 'clone-deep';

import Select 					from 'react-select';
import SlideDown 				from "components/SlideDown/SlideDown"
import ReactHtmlParser 			from 'react-html-parser'; 
import NutritionFacts 			from "components/NutritionFacts/NutritionFacts.jsx"
import {nutritionFactsCombine} 	from 'utils/utils';
import {db, auth} 				from 'services/firebase';

import { Button, Modal } 		from 'react-bootstrap';
import { Container, Row, Col } 	from 'react-bootstrap';
import { FaEdit } 				from 'react-icons/fa';
import { MealContext } 			from "./DietMeal"

// Component
import MealIngredient 			from "./MealIngredient";

const Meal  = ({meal, setEditMealForm})=>{
	const {ingredientList}  				  			= useContext(MealContext);
	const [slideInstruction, setSlideInstruction]		= useState(false);
	const [mealNutritionFacts, setMealNutritionFacts]	= useState([]);

	useEffect(()=>{
		if(!check.maybe(ingredientList) || !check.emptyArray(ingredientList) ){
			/* MAP DATA SO WE CAN DISPLAY TOTAL NUTRITIONFACTS
				meal{
					ingredients: [serving && ingredientID]
				}
				**Need:
				[serving && nutritionFacts]
			*/
			// check meal undefined?
			var temp = meal.ingredients.map((ingredient, i)=>{
				var data = {};
				for (let i = 0; i < ingredientList.length; i++) {
					if( ingredientList[i].id ==  ingredient.ingredientID ){
						data['serving'] 	   = ingredient.serving;
						data['nutritionFacts'] = ingredientList[i].nutritionFacts;
						break;
					}
				}
				return data;
			})
			setMealNutritionFacts(temp);
		}
	},[ingredientList]);

	return <Row>
		<Col xs={12} md={2}>
			<div style={{minWidth:"214px"}}>
				{meal.name}
				<button style={{marginLeft:"5px"}} onClick={()=>setEditMealForm([true, meal])}><FaEdit/></button>
			</div>
		</Col>
		<Col xs={12} xs={10}>
			{/********************* Meals' Ingredients *********************/}

			<div className="meal-border" /*style={{border:"1px red solid"}}*/ >
				<ul>{meal.ingredients.map((ingredient, i)=><MealIngredient meal={meal} ingredient={ingredient} key={i}/>)}</ul>
			</div>
			{/********************* Instruction *********************/}
			<div onClick={()=>setSlideInstruction(!slideInstruction)} style={{width: "100%", fontSize: "12px", backgroundColor: "#E0E0E0git ", textAlign: "center", outline: "0 !important", lineHeight: "none", height: "20px",}}>
				Instruction
			</div>
			<SlideDown onSlide={slideInstruction}>
				<div style={{backgroundColor:"#E8E8E8", padding: "10px"}}>{ReactHtmlParser(meal.instruction)}</div>
			</SlideDown>
			{/********************* TotalNutritionFacts *********************/}
			<div style={{backgroundColor:"#E8E8E8"}}>
				<NutritionFacts nutritionFacts={nutritionFactsCombine(mealNutritionFacts)} size={16} spacing={5}/>
			</div>
			
		</Col>
	</Row>
}
export default Meal;
