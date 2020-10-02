import React, {useState} from 'react';
import {db, auth} from 'services/firebase';
import check from 'check-types';
import {nutritionFactsCreate, random} 	from 'utils/utils';

const FormCreatIngredient = () => {
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

	const createIngredientHandler = () =>{
		const confirmed = window.confirm("You Want to Add New Ingredient?\n(Note: Name must not be empty)");
		if(confirmed && !check.emptyString(name)){
			db.collection('diet_ingredients').doc()
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
				setName(""); setCalories(""); setProtein(""); setCarbohydrates(""); setFiber(""); setSugars(""); setFat(""); setSaturated("");
				setPolyunsaturated(""); setMonounsaturated(""); setTrans(""); setCholesterol(""); setSodium(""); setPotassium(""); setVitaminA(""); setVitaminC("");
				setCalcium(""); setIron("");
			})
		}
	}

	const validator = (text) => isNaN(text)? "" : Number(text);
	return <div>
		<div className="row">
			<div className="col-2">
				<input type="text" value={name} onChange={e=>setName(e.target.value)}        placeholder="Ingredient Name" style={{width:"100%"}}/></div>
			<div className="col-10">
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
			</div>
		</div>
		<div><button onClick={createIngredientHandler} className="btn btn-primary btn-sm">Add Ingredient</button></div>
		<br/>
	</div>
}
export default FormCreatIngredient;