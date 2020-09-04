import React, {useContext, useState, useEffect} from 'react';
import check 									                  from 'check-types';
import clone 									                  from 'clone-deep';

import Select 									                from 'react-select';
import NutritionFacts 							            from "components/NutritionFacts/NutritionFacts.jsx"
import {nutritionFactsCombine} 				    	    from 'utils/utils';
import {db, auth} 								              from 'services/firebase';

import {Button, Modal} 						            	from 'react-bootstrap';
import {Container, Row, Col} 					        	from 'react-bootstrap';
import {FaEdit} 								              	from 'react-icons/fa';


const DietMealCreateForm = ({ingredients, showCreateMealForm,setShowCreateMealForm, }) => {
	const [mealName, setMealName]                             = useState("");
  const [mealInstruction, setMealInstruction]               = useState("");
  
  const [selectedIngredientList, setSelectedIngredientList] = useState([]); // Selected Ingredients
  const [ingredientList, setIngredientList]                 = useState([]); // Mapped Ingredients (ingredients props) to used in <Select>
  const handleClose = () => {
		setShowCreateMealForm(false)
	}

	useEffect(()=>{
    if(!check.emptyArray(ingredients)){
      setIngredientList(ingredients.map((ingredient)=>{
          ingredient['label'] = ingredient.name;
          ingredient['value'] = ingredient.id; 
          ingredient['serving'] = 1;  
          return ingredient;
      }));
    }
  },[ingredients]);
  
  const handleSave = () =>{
    if( window.confirm("You are sure you want to save?") ){
      const meal = {
        name: mealName,
        ingredients: selectedIngredientList.map((ingredient)=>{return {ingredientID: ingredient.id, serving: ingredient.serving}}),
        instruction: mealInstruction.replace(/\r?\n/g, '<br/>'),
        userID: auth.currentUser.uid,
      }
      db.collection('diet_meals').doc().set(meal).then(()=>{
        setMealName("");
        setMealInstruction("");
        setSelectedIngredientList([]);
        handleClose();
      }).catch(function(error) {
				alert("Unexpected Error");
				console.log("Unexpected Error", error);
			});
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
                    <Select onChange={(l)=>setSelectedIngredientList(l)} options={ingredientList} value={selectedIngredientList} isClearable={true} placeholder="Select Ingredients" isMulti/>
                  }
							</Col>
						</Row>
						<ol style={{overflow:"hidden", overflowY: "scroll", maxHeight:"300px"}}>
              {selectedIngredientList && 
                selectedIngredientList.map((ingredient, i)=><Ingredient ingredient={ingredient} index={i} key={i} selectedIngredientList={selectedIngredientList} setSelectedIngredientList={setSelectedIngredientList}/>)
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
export default DietMealCreateForm;

const Ingredient = ({ingredient, index, setSelectedIngredientList, selectedIngredientList}) => {
  const [serving, setServing] = useState(1);

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
        <div style={{backgroundColor:"#F0F0F0"}}>
          <NutritionFacts serving={ingredient.serving} nutritionFacts={ingredient.nutritionFacts}/>
        </div>
      </Container>
    </li>
  )
}