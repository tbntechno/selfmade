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
import { MealContext } 			from "./Meal"
import { toast }  				from 'react-toastify';

// Component
import MealItemIngredient 			from "./MealItemIngredient";

const Meal  = ({meal, setEditMealForm})=>{
	const {dbIngredients}  				  			= useContext(MealContext);
	const [slideInstruction, setSlideInstruction]	= useState(false);
	const [mappedMealNutritionFacts, setMappedMealNutritionFacts]	= useState([]);
	const [cleanedUpIngredients, setCleanedUpIngredients] 			= useState([])
	
	useEffect(()=>{
		dbIngredientCleanUp();
		mappingMealNutritionFacts();
	},[meal]);

	const dbIngredientCleanUp = () => {
		var isUnMatched 		   = false;
		var cleanedUpDBIngredients = [];
		var cleanedUpUIIngredients = meal.ingredients.reduce((filtered, ingredient) => {
			const found = dbIngredients.find(dbIngredient => ingredient.ingredientID == dbIngredient.id)
			if(!found){
				isUnMatched = true;
				toast.error("One of the Ingredients doesn't exist anymore! Processing to remove the Ingredient!", {autoClose: 7000, toastId: "no-duplicate"})
			}
			else {
				var forUI = {serving: ingredient.serving,...found};
				var forDB = {serving: ingredient.serving, ingredientID: ingredient.ingredientID}
				filtered.push(forUI)
				cleanedUpDBIngredients.push(forDB)
			}
			return filtered;
		}, []);
		setCleanedUpIngredients(cleanedUpUIIngredients)

		// Update DB
		if(isUnMatched){
			var {id,...cleanedUpDBMeal} = meal;
			cleanedUpDBMeal.ingredients = cleanedUpDBIngredients;
			db.collection('diet_meals').doc(id).set(cleanedUpDBMeal)
				.then(()=>console.log("Removed Non-Existing Ingredient!"))
				.catch((error) => {
					alert("Unexpected Error");
					console.log("Unexpected Error", error);
				})
		}
	}
	const mappingMealNutritionFacts = () => {
		/* MAP DATA SO WE CAN DISPLAY TOTAL NUTRITIONFACTS
			meal{
				ingredients: [serving && ingredientID]
			}
			**Need:
			[serving:n && nutritionFacts:{}]
		*/
		var temp = meal.ingredients.map((ingredient, i)=>{
			var data = {};
			for (let i = 0; i < dbIngredients.length; i++) {
				if( dbIngredients[i].id ==  ingredient.ingredientID ){
					data['serving'] 	   = ingredient.serving;
					data['nutritionFacts'] = dbIngredients[i].nutritionFacts;
					break;
				}
			}
			return data;
		})
		setMappedMealNutritionFacts(temp);
	}
	return <Row>
		<Col xs={12} md={2}>
			<div style={{minWidth:"214px"}}>
				{meal.name}
				<button type="button" className="btn btn-sm btn-outline-dark" style={{marginLeft:"5px"}} onClick={()=>setEditMealForm([true, meal])}><FaEdit/></button>
			</div>
		</Col>
		<Col xs={12} xs={10}>
			{/********************* Meals' Ingredients *********************/}
			<div className="meal-border" >
				<ul>{cleanedUpIngredients.map((ingredient, i)=><MealItemIngredient meal={meal} ingredient={ingredient} key={i}/>)}</ul>
			</div>
			
			{/********************* TotalNutritionFacts *********************/}
			<div style={{backgroundColor:"#E8E8E8"}}>
				<NutritionFacts nutritionFacts={nutritionFactsCombine(mappedMealNutritionFacts)} size={16} spacing={5}/>
			</div>
			{/********************* Instruction *********************/}
			<button onClick={()=>setSlideInstruction(!slideInstruction)} style={{width: "100%", fontSize: "12px", backgroundColor: "#E0E0E0git ", textAlign: "center", outline: "0 !important", lineHeight: "none", height: "20px",}}>
				Instruction
			</button>
			<SlideDown onSlide={slideInstruction}>
				<div style={{backgroundColor:"#E8E8E8", padding: "10px"}}>{ReactHtmlParser(meal.instruction)}</div>
			</SlideDown>
		</Col>
	</Row>
}
export default Meal;
