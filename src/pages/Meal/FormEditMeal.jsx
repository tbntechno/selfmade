import React, {useState, useEffect} from 'react';
import check 									                  from 'check-types';
import clone 									                  from 'clone-deep';

import Select 									                from 'react-select';
import NutritionFacts 							            from "components/NutritionFacts/NutritionFacts.jsx"
import {nutritionFactsCombine} 				    	    from 'utils/utils';
import {db, auth} 								              from 'services/firebase';

import {Button, Modal} 						            	from 'react-bootstrap';
import {Container, Row, Col} 					        	from 'react-bootstrap';


const FormEditMeal = ({ingredients, editMealForm, setEditMealForm}) => {
  const [mealID, setMealID]                                 = useState("");
	const [mealName, setMealName]                             = useState("");
  const [mealInstruction, setMealInstruction]               = useState("");
  
  const [selectedIngredientList, setSelectedIngredientList] = useState([]); // Selected Ingredients
  const [ingredientList, setIngredientList]                 = useState([]); // Mapped Ingredients (ingredients props) to used in <Select>
  
  const handleClose = () => {
		setEditMealForm([false, {}])
  }
  const handleRemove = () => {
    if(window.confirm("Do you really want to remove this meal?")){
			db.collection("diet_meals").doc(mealID).delete().then(()=>{
        handleClose();
			}).catch(function(error) {
				alert("Unexpected Error");
				console.log("Unexpected Error", error);
			});
		}
  }

	useEffect(()=>{
    // Init MEAL 
    if(!check.emptyObject(editMealForm[1])){
      var meal = editMealForm[1];
      setMealID(meal.id);
      setMealName(meal.name);
      setMealInstruction(meal.instruction);

      var temp = meal.ingredients.map((ingredient, i)=>{
				var data = {};
				for (let i = 0; i < ingredientList.length; i++) {
					if( ingredientList[i].id ===  ingredient.ingredientID ){
            data['id']              = ingredient.ingredientID;
            data['name']            = ingredientList[i].name;
            data['label']           = ingredientList[i].name;
            data['value']           = ingredient.ingredientID;
						data['serving'] 	      = ingredient.serving;
						data['nutritionFacts']  = ingredientList[i].nutritionFacts;
						break;
					}
				} return data;
      })
      setSelectedIngredientList(temp);
    }

    if(!check.emptyArray(ingredients)){
      setIngredientList(ingredients.map((ingredient)=>{
        var temp = clone(ingredient)
				temp['label'] = ingredient.name;
        temp['value'] = ingredient.id; 
        temp['serving'] = 1;  
				return temp;
      }));
    }
  },[ingredients, editMealForm]);
  
  const handleSave = () =>{
    console.log(selectedIngredientList)
    if( window.confirm("You are sure you want to save?") ){
      const meal = {
        name: mealName,
        ingredients: selectedIngredientList.map((ingredient)=>{return {ingredientID: ingredient.id, serving: ingredient.serving}}),
        instruction: mealInstruction.replace(/\r?\n/g, '<br/>'),
        userID: auth.currentUser.uid,
      }
      db.collection('diet_meals').doc(mealID).set(meal).then(()=>{
        handleClose();
      }).catch(function(error) {
				alert("Unexpected Error");
				console.log("Unexpected Error", error);
			});
    }
  }
  
  return (<>
      <Modal show={editMealForm[0]} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<Container>
						<Row>
							<Col xs={12}>
								<input type="text" placeholder="Meal Name" value={mealName} onChange={(e)=>setMealName(e.target.value)}></input>
							</Col>
							<Col xs={12} style={{padding:"10px 15px"}}>
									{ingredientList && 
                    <Select onChange={(l)=>(check.null(l) ? [] : setSelectedIngredientList(l))} options={ingredientList} value={selectedIngredientList} isClearable={true} placeholder="Select Ingredients" isMulti/>
                  }
							</Col>
						</Row>
						<ol style={{overflow:"hidden", overflowY: "scroll", maxHeight:"300px"}}>
              {selectedIngredientList && 
                selectedIngredientList.map((ingredient, i)=><Ingredient ingredient={ingredient} index={i} key={i} selectedIngredientList={selectedIngredientList} setSelectedIngredientList={setSelectedIngredientList}/>)
              }
						</ol>
						<div>
							<textarea placeholder="Instruction" style={{width:"100%"}} rows="5" value={mealInstruction.replace(/<br\s*\/?>/mg,"\n")} onChange={(e)=>setMealInstruction(e.target.value)}/>
						</div>
            <div>
							<NutritionFacts nutritionFacts={nutritionFactsCombine(selectedIngredientList)}/>
						</div>
					</Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRemove}>
            Remove
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default FormEditMeal;

const Ingredient = ({ingredient, index, setSelectedIngredientList, selectedIngredientList}) => {
  const [serving, setServing] = useState(1);
  useEffect(()=>{
    setServing(selectedIngredientList[index].serving)
  },[selectedIngredientList])

  const handleServingOnChange = ({target:{value}})=> {
    if(isNaN(value)) {
      setServing("");
    } else {
      // Update UI
      // setServing(Number(value)); // No Need cuz the useEffect already done it

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