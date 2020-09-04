import React, {useContext, useState, useEffect} from 'react';
import check 	from 'check-types';
import clone 	from 'clone-deep';

import Select 					from 'react-select';
import SlideDown 				from "components/SlideDown/SlideDown"
import ReactHtmlParser 	from 'react-html-parser'; 
import NutritionFacts 	from "components/NutritionFacts/NutritionFacts.jsx"
import {nutritionFactsCombine} from 'utils/utils';
import {db, auth} from 'services/firebase';

import { Button, Modal } 				from 'react-bootstrap';
import { Container, Row, Col } 	from 'react-bootstrap';
import { FaEdit } 							from 'react-icons/fa';
import { MealContext } 					from "./DietMeal"

// Component
import MealIngredient 					from "./MealIngredient";

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
			{/********************* TotalNutritionFacts *********************/}
			<div style={{backgroundColor:"#E8E8E8"}}>
				<NutritionFacts nutritionFacts={nutritionFactsCombine(mealNutritionFacts)} size={16} spacing={5}/>
			</div>
			{/********************* Instruction *********************/}
			<div onClick={()=>setSlideInstruction(!slideInstruction)} style={{width: "100%", fontSize: "12px", backgroundColor: "#E0E0E0", textAlign: "center", outline: "0 !important", lineHeight: "none", height: "20px",}}>
				Instruction
			</div>
			<SlideDown onSlide={slideInstruction}>
				<div style={{backgroundColor:"#E8E8E8"}}>{ReactHtmlParser(meal.instruction)}</div>
			</SlideDown>
		</Col>
	</Row>
}
export default Meal;


const CreatMealForm = ({ingredients, showCreateMealForm,setShowCreateMealForm, }) => {
	const [mealName, setMealName]                             = useState("");
  const [mealInstruction, setMealInstruction]               = useState("");
  
  const [selectedIngredientList, setSelectedIngredientList] = useState([]);
  const [ingredientList, setIngredientList]                 = useState([]);
  const handleClose = () => {
		setShowCreateMealForm(false)
	}

	useEffect(()=>{
		setIngredientList(ingredients.map((ingredient)=>{
				ingredient['label'] = ingredient.name;
        ingredient['value'] = ingredient.id; 
        ingredient['serving'] = 1;  
				return ingredient;
		}));
  },[ingredients]);
  
  const handleSave = () =>{
    if( window.confirm("You are sure you want to save?") ){
      const meal = {
        name: mealName,
        ingredients: selectedIngredientList.map((ingredient)=>{return {ingredientID: ingredient.id, serving: ingredient.serving}}),
        instruction: mealInstruction,
        userID: auth.currentUser.uid,
      }
	  db.collection('diet_meals').doc().set(meal)
      .then(()=>{console.log("SAVE!")})
      .catch((error) => {
        alert("Unexpected Error");
		    console.log("Unexpected Error", error);
	    });;
    }
  }
  
  return (<>
      <Modal show={showCreateMealForm} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
			<Container>
				<Row>
					<Col xs={12}>
						<input type="text" placeholder="Meal Name" value={mealName} onChange={(e)=>setMealName(e.target.value)}></input>
					</Col>
					<Col xs={12} style={{padding:"10px 15px"}}>
							{ingredientList && 
			<Select onChange={(l)=>setSelectedIngredientList(l)} options={ingredientList} isClearable={true} placeholder="Select Ingredients" isMulti/>
			}
					</Col>
				</Row>
				<ol style={{overflow:"hidden", overflowY: "scroll", maxHeight:"300px"}}>
		{selectedIngredientList && 
		selectedIngredientList.map((ingredient, i)=><CreateMealForm_Ingredient ingredient={ingredient} index={i} key={i} selectedIngredientList={selectedIngredientList} setSelectedIngredientList={setSelectedIngredientList}/>)
		}
				</ol>
				<div>
					<textarea placeholder="Instruction" style={{width:"100%"}} rows="5" onChange={(e)=>setMealInstruction(e.target.value)}></textarea>
				</div>
	<div>
					<NutritionFacts nutritionFacts={nutritionFactsCombine(selectedIngredientList)}/>
				</div>
			</Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const CreateMealForm_Ingredient = ({ingredient, index, setSelectedIngredientList, selectedIngredientList}) => {
	const [serving, setServing] = useState("");
  
	const handleServingOnChange = ({target:{value}})=> {
	  if(isNaN(value)) {
		setServing("");
	  } else {
		// Update UI
		setServing(Number(value));
  
		// Update Serving
		ingredient.serving = Number(value);
		var ingredientList = clone(selectedIngredientList);
		ingredientList[index] = ingredient;
		setSelectedIngredientList(ingredientList);
	  }
	}
	return (
	  <li> 	
		<Container>
		  <Row>
			<Col xs={6}>{ingredient.name}</Col>
			<Col xs={6}><input onChange={handleServingOnChange} value={serving} style={{textAlign:"right", float:"right"}} type="text"/></Col>
		  </Row>
		  <div style={{backgroundColor:"#D3D3D3"}}>
			<NutritionFacts serving={ingredient.serving} nutritionFacts={ingredient.nutritionFacts}/>
		  </div>
		</Container>
	  </li>
	)
  }
  
  const makeid = (length) => {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  }