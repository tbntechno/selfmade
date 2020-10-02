import React, {useState, useEffect} from 'react';
import check 									                  from 'check-types';
import clone 									                  from 'clone-deep';

import NutritionFacts 							            from "components/NutritionFacts/NutritionFacts.jsx"
import {nutritionFactsCombine,
        nutritionFactsCreate} 				    	    from 'utils/utils';
import {db, auth} 								              from 'services/firebase';

import {Button, Modal} 						            	from 'react-bootstrap';
import {Container, Row, Col} 					        	from 'react-bootstrap';


const FormEditMeal = ({editIngredientForm, setEditIngredientForm}) => {
  const [name,setName]                        = useState("");
	const [calories,setCalories]                = useState("");
	const [protein,setProtein]                  = useState("");
	const [carbohydrates,setCarbohydrates]      = useState("");
	const [fiber,setFiber]                      = useState("");
	const [sugars,setSugars]                    = useState("");
	const [fat,setFat]                          = useState("");
	const [saturated,setSaturated]              = useState("");
	const [polyunsaturated,setPolyunsaturated]  = useState("");
	const [monounsaturated,setMonounsaturated]  = useState("");
	const [trans,setTrans]                      = useState("");
	const [cholesterol,setCholesterol]          = useState("");
	const [sodium,setSodium]                    = useState("");
	const [potassium,setPotassium]              = useState("");
	const [vitaminA,setVitaminA]                = useState("");
	const [vitaminC,setVitaminC]                = useState("");
	const [calcium,setCalcium]                  = useState("");
	const [iron,setIron]                        = useState("");
  const [ingredientID, setIngredientID]       = useState("");
  useEffect(()=>{
    if(!check.emptyObject(editIngredientForm[1])){
      const ingredientData = editIngredientForm[1];
      setIngredientID(    ingredientData.id)
      setName(            ingredientData.name)
      setCalories(        ingredientData.nutritionFacts[0].value)
      setProtein(         ingredientData.nutritionFacts[1].value)
      setCarbohydrates(   ingredientData.nutritionFacts[2].value)
      setFiber(           ingredientData.nutritionFacts[3].value)
      setSugars(          ingredientData.nutritionFacts[4].value)
      setFat(             ingredientData.nutritionFacts[5].value)
      setSaturated(       ingredientData.nutritionFacts[6].value)
      setPolyunsaturated( ingredientData.nutritionFacts[7].value)
      setMonounsaturated( ingredientData.nutritionFacts[8].value)
      setTrans(           ingredientData.nutritionFacts[9].value)
      setCholesterol(     ingredientData.nutritionFacts[10].value)
      setSodium(          ingredientData.nutritionFacts[11].value)
      setPotassium(       ingredientData.nutritionFacts[12].value)
      setVitaminA(        ingredientData.nutritionFacts[13].value)
      setVitaminC(        ingredientData.nutritionFacts[14].value)
      setCalcium(         ingredientData.nutritionFacts[15].value)
      setIron(            ingredientData.nutritionFacts[16].value)
    }
  },[editIngredientForm])

  const handleClose = () => {
	  setEditIngredientForm([false, {}])
  }

	const handleSave = () =>{
		const confirmed = window.confirm("You Want to Save the Ingredient?\n(Note: Name must not be empty)");
		if(confirmed && !check.emptyString(name)){
			db.collection('diet_ingredients').doc(ingredientID)
			.set({
				name: name,
				userID: auth.currentUser.uid,
				nutritionFacts: nutritionFactsCreate({
					calories:       calories, 
					protein:        protein, 
					carbohydrates:  carbohydrates,
					fiber:          fiber,
					sugars:         sugars,
					fat:            fat,
					saturated:      saturated,
					polyunsaturated:polyunsaturated,
					monounsaturated:monounsaturated,
					trans:          trans,
					cholesterol:    cholesterol,
					sodium:         sodium,
					potassium:      potassium,
					vitaminA:       vitaminA,
					vitaminC:       vitaminC,
					calcium:        calcium,
					iron:           iron
				})
			}).then(()=>{
        handleClose();
        setName(""); setCalories(""); setProtein(""); setCarbohydrates(""); setFiber(""); setSugars(""); setFat(""); setSaturated("");
        setPolyunsaturated(""); setMonounsaturated(""); setTrans(""); setCholesterol(""); setSodium(""); setPotassium(""); setVitaminA(""); setVitaminC("");
        setCalcium(""); setIron("");
      })
		}
	}

	const validator = (text) => isNaN(text)? "" : Number(text);
  return (<>
      <Modal show={editIngredientForm[0]} onHide={handleClose} backdrop="static" keyboard={false} animation={false} size={"xl"} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<Container>
          <Row>
            <Col xs={12} lg={3}>
              <input type="text" value={name} onChange={e=>setName(e.target.value)}        placeholder="Ingredient Name" style={{width:"100%"}}/>
            </Col>
            <Col xs={12} lg={9}>
              <input type="text" value={calories}                onChange={e=>setCalories(validator(e.target.value))}         placeholder="Calories"/>
              <input type="text" value={protein}                  onChange={e=>setProtein(validator(e.target.value))}          placeholder="Protein"/>
              <input type="text" value={carbohydrates}      onChange={e=>setCarbohydrates(validator(e.target.value))}    placeholder="Carbohydrates"/>
              <input type="text" value={fiber}                      onChange={e=>setFiber(validator(e.target.value))}            placeholder="Fiber"/>
              <input type="text" value={sugars}                    onChange={e=>setSugars(validator(e.target.value))}           placeholder="Sugars"/>
              <input type="text" value={fat}                          onChange={e=>setFat(validator(e.target.value))}              placeholder="Fat"/>
              <input type="text" value={saturated}              onChange={e=>setSaturated(validator(e.target.value))}    placeholder="Saturated Fat"/>
              <input type="text" value={polyunsaturated}  onChange={e=>setPolyunsaturated(validator(e.target.value))}  placeholder="Polyunsaturated"/>
              <input type="text" value={monounsaturated}  onChange={e=>setMonounsaturated(validator(e.target.value))}  placeholder="Monounsaturated"/>
              <input type="text" value={trans}                      onChange={e=>setTrans(validator(e.target.value))}         placeholder="Tran Fat"/>
              <input type="text" value={cholesterol}          onChange={e=>setCholesterol(validator(e.target.value))}      placeholder="Cholesterol"/>
              <input type="text" value={sodium}                    onChange={e=>setSodium(validator(e.target.value))}           placeholder="Sodium"/>
              <input type="text" value={potassium}              onChange={e=>setPotassium(validator(e.target.value))}        placeholder="Potassium"/>
              <input type="text" value={vitaminA}                onChange={e=>setVitaminA(validator(e.target.value))}        placeholder="Vitamin A"/>
              <input type="text" value={vitaminC}                onChange={e=>setVitaminC(validator(e.target.value))}        placeholder="Vitamin C"/>
              <input type="text" value={calcium}                  onChange={e=>setCalcium(validator(e.target.value))}          placeholder="Calcium"/>
              <input type="text" value={iron}                        onChange={e=>setIron(validator(e.target.value))}             placeholder="Iron"/>
            </Col>
          </Row>
          <br/>
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
export default FormEditMeal;

// const Ingredient = ({ingredient, index, setSelectedIngredientList, selectedIngredientList}) => {
//   const [serving, setServing] = useState(1);
//   useEffect(()=>{
//     setServing(selectedIngredientList[index].serving)
//   },[selectedIngredientList])

//   const handleServingOnChange = ({target:{value}})=> {
//     if(isNaN(value)) {
//       setServing("");
//     } else {
//       // Update UI
//       // setServing(Number(value)); // No Need cuz the useEffect already done it

//       // Update Serving
//       ingredient.serving = Number(value);
//       var ingredientList = clone(selectedIngredientList);
//       ingredientList[index] = ingredient;
//       setSelectedIngredientList(ingredientList);
//     }
//   }
//   return (
//     <li> 	
//       <Container>
//         <Row>
//           <Col xs={6}>{ingredient.name}</Col>
//           <Col xs={6}><input onChange={handleServingOnChange} value={serving} style={{textAlign:"right", float:"right"}} type="text"/></Col>
//         </Row>
//         <div style={{backgroundColor:"#F0F0F0"}}>
//           <NutritionFacts serving={ingredient.serving} nutritionFacts={ingredient.nutritionFacts}/>
//         </div>
//       </Container>
//     </li>
//   )
// }