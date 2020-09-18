import React, {useState,useEffect} from 'react';
import {db} from 'services/firebase';
import './DietIngredient.scss';
import check from 'check-types';
import {nutritionFactsCreate, random} 	from 'utils/utils';
import {Container, Row, Col} 					          from 'react-bootstrap';

const UNITS = ["gram", "tsp", "tbsp", "milliliter"];

const DietIngredient = () => {
  const [ingredients, setIngredients]               = useState([]);
  const [ingredientsDisplay, setIngredientsDisplay] = useState([]);

  const [searchText, setSearchText] = useState("");


  useEffect(()=>{
    const unsubIngredients = db.collection('diet_ingredients')
    .onSnapshot((snapshot)=>{
      const ingredients = snapshot.docs.map((doc)=> ({ id:doc.id, ...doc.data() }) );
      // console.log(ingredients);
      setIngredients(ingredients || []);
      setIngredientsDisplay(ingredients || [])
    })
    return () => {unsubIngredients()}
  },[]);

  const searchHandler = (e) =>{
    if (!check.emptyString(e.target.value)) {
      setIngredientsDisplay(ingredientsDisplay.filter(item => {
        return item.name.toLowerCase().indexOf(searchText) != -1;
      }));
    } else {
      setIngredientsDisplay(ingredients);
    }
    setSearchText(e.target.value);
  }

  return (
    <Container style={{marginTop: "20px"}} fluid>
      <h3>Ingredient List</h3>
      <input value={searchText} placeholder= "Search here..." style={{ fontSize: 17, width: "100%", margin:"8px 0" }} onChange={(e)=>searchHandler(e)} />
      <div className="ingredient-list">
        <ul style={{padding:"0px"}}>
          {ingredientsDisplay && ingredientsDisplay.map((ingredient, index) => {
            return <Ingredient ingredient={ingredient} key={ingredient.id}/>
          })}
        </ul>
      </div>
      <IngredientCreate/>
    </Container>
  )
}
export default DietIngredient;



const Ingredient = ({ingredient}) => {
  const removeIngredientHandler = (rmID) => {
    const confirmed = window.confirm("You really want to delete this ingredient?");
    if(confirmed){ db.collection('diet_ingredients').doc(rmID).delete()}
  }
  return <Row className="ingredient">
    <Col xs={2} >{ingredient.name}</Col>
    <Col xs={8}>{ 
      (ingredient.nutritionFacts) && ingredient.nutritionFacts.map((nutrient, i)=>{
        return <label key={i} className={`${nutrient.name} ingredient-fact`}>{nutrient.name}:{nutrient.value}</label>
      })}
    </Col>
    <Col xs={1} style={{marginTop: "10px"}}>{ingredient.unit}</Col>
    <Col xs={1} className="d-flex justify-content-end align-items-center"><button className="ingredient-delete btn btn-secondary" style={{height:"50px"}} onClick={()=>removeIngredientHandler(ingredient.id)}>x</button></Col>
  </Row>
}

const IngredientCreate = () => {
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
  const [unit,setUnit]                        = useState("");

  const test_add_ingredients = () => {  
    db.collection('diet_ingredients').doc()
    .set({
      name: Math.random().toString(36).substring(7),          //random name
      unit: UNITS[Math.floor(Math.random() * UNITS.length)],  //random unit
      nutritionFacts: nutritionFactsCreate({
        calories:       random(0,300), 
        protein:        random(0,300), 
        carbohydrates:  random(0,300),
        fiber:          random(0,300),
        sugars:         random(0,300),
        fat:            random(0,300),
        saturated:      random(0,300),
        polyunsaturated:random(0,300),
        monounsaturated:random(0,300),
        trans:          random(0,300),
        cholesterol:    random(0,300),
        sodium:         random(0,300),
        potassium:      random(0,300),
        vitaminA:       random(0,300),
        vitaminC:       random(0,300),
        calcium:        random(0,300),
        iron:           random(0,300)
      }),
    });
  }
  const test = () => {
    alert(unit);
  }

  const createIngredientHandler = () =>{
    const confirmed = window.confirm("You Want to Add New Ingredient?\n(Note: Name must not be empty)");
    if(confirmed && !check.emptyString(name)){
      db.collection('diet_ingredients').doc()
      .set({
        name: name,
        unit: unit || UNITS[0],
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
      });
      setName(""); setCalories(""); setProtein(""); setCarbohydrates(""); setFiber(""); setSugars(""); setFat(""); setSaturated("");
      setPolyunsaturated(""); setMonounsaturated(""); setTrans(""); setCholesterol(""); setSodium(""); setPotassium(""); setVitaminA(""); setVitaminC("");
      setCalcium(""); setIron(""); setUnit("");
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
        <div>
          <select style={{width:"182px"}} onChange={(e)=>setUnit(e.target.value)} value={unit}>
            {/* <option hidden disabled selected value>--  select a unit  --</option> */}
            {UNITS.map((unit,index)=><option key={index}>{unit}</option>)}
          </select>
        </div>
      </div>
    </div>
    <div><button onClick={createIngredientHandler} className="btn btn-primary btn-sm">Add Ingredient</button></div>
    <br/>
    <div><button onClick={test_add_ingredients} className="btn btn-secondary btn-sm">Add Test Ingredient</button></div>
    <br/>
    <div><button onClick={test} className="btn btn-warning btn-sm">test</button></div>
  </div>
}

const filterList = (text, list) => {
  return list.filter(item => {
    return item.name.toLowerCase().indexOf(text) != -1;
  });
}