import React, {useState,useEffect} from 'react';
import {db, auth} from 'services/firebase';
import './Ingredient.scss';
import check from 'check-types';
import {Container, Row, Col} 					  from 'react-bootstrap';
import { FaEdit } 				from 'react-icons/fa';
import { RiDeleteBin6Fill } from "react-icons/ri";
import FormCreateIngredient from "./FormCreateIngredient"
import FormEditIngredient from "./FormEditIngredient"

const UNITS = ["gram", "tsp", "tbsp", "milliliter", "other"];

const Ingredient = () => {
  const [ingredients, setIngredients]               = useState([]);
  const [ingredientsDisplay, setIngredientsDisplay] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editIngredientForm, setEditIngredientForm] = useState([false, {}])

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
      <FormCreateIngredient />
      <h3>Ingredient List</h3>
      <input value={searchText} placeholder= "Search here..." style={{ fontSize: 17, width: "100%", margin:"8px 0" }} onChange={(e)=>searchHandler(e)} />
      <div className="ingredient-list">
        <ul style={{padding:"0px"}}>
          {ingredientsDisplay && ingredientsDisplay.map((ingredient, index) => {
            return <IngredientItem ingredient={ingredient} key={ingredient.id} setEditIngredientForm={setEditIngredientForm}/>
          })}
        </ul>
      </div>
      <FormEditIngredient editIngredientForm={editIngredientForm} setEditIngredientForm={setEditIngredientForm}/>
    </Container>
  )
}
export default Ingredient;



const IngredientItem = ({ingredient, setEditIngredientForm}) => {
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
    {/* <Col xs={1} style={{marginTop: "10px"}}>{ingredient.unit}</Col> */}
    <Col xs={2} className="d-flex justify-content-end align-items-center">
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={()=>setEditIngredientForm([true,ingredient])} style={{marginRight:"10px"}}><FaEdit/></button>
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={()=>removeIngredientHandler(ingredient.id)}><RiDeleteBin6Fill/></button>
    </Col>
  </Row>
}