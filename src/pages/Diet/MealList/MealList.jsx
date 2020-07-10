import React, { useState }    from "react";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import clone from 'clone-deep';
import _ from 'lodash';
import arrayMove from 'array-move';
import {db} from '../../../services/firebase';
import check from 'check-types';
import TextareaAutosize  from 'react-textarea-autosize';
import SlideDown from '../../../components/SlideDown/SlideDown'
import ReactHtmlParser from 'react-html-parser'; 
const SortableItem = SortableElement(({meal, setMeals,meals}) => {
  const [slide, setSlide] = useState(false);
  const onSlide           = ()=>{setSlide(!slide)}

  const removeMealHandler = ()=>{
    const confirmed = window.confirm("You really want to delete this meal?");
    if(confirmed){
      const rmIndex     = meal.order;
      const rmID        = meals[rmIndex].id
      const lastIndex   = meals.length - 1;
      const copiedMeals = clone(meals);
      //console.log("B",meals,rmIndex);

      db.collection('diet_meals').doc(rmID).delete()  // remove the meal in dB
      // Update the rest in DB:
      for(let i = rmIndex + 1; i <= lastIndex; i++){
        copiedMeals[i].order--;
        const {id, ...updatedMeal}    = copiedMeals[i];
        db.collection('diet_meals').doc(id)
          .update(updatedMeal);
      }
    }
  }
  return <React.Fragment>
    <li key={meal.id} className="row meal-item">
      <div className="col-2" >{meal.name}</div>
      <div className="col-9">{ (meal.nutritionFacts) && meal.nutritionFacts.map((nutrient, i)=>{
          return <label key={i} className={`${nutrient.name} meal-fact`}>
            {nutrient.name}:{nutrient.value}
          </label>
        })}
        <div className="row description">
          <button className="description-btn" onClick={onSlide}>Description</button>
          <SlideDown onSlide={slide}>
            {ReactHtmlParser(meal.description)}
          </SlideDown>
        </div>
      </div>
      <div className="col-1"><button className="delete-meal" onClick={removeMealHandler}>x</button></div>
    </li>
  </React.Fragment>
});

const SortableList = SortableContainer(({meals, setMeals}) => {
  return (
    <ul>
      {meals && meals.map((meal, index) => {
        return <SortableItem meals={meals} setMeals={setMeals} meal={meal} key={meal.id} index={index}/>
      })}
    </ul>
  );
});

const MealList = ({meals,setMeals}) => {
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
  const [description,setDescription]          = useState("");

  const sortableHandler = ({oldIndex, newIndex})=>{
    // console.log(meals);
    const copiedMeals  = clone(meals);
    // Handle Draggable Down
    if(oldIndex < newIndex){
      for(let i = oldIndex; i <= newIndex; i++){
        if( i === oldIndex){
          copiedMeals[oldIndex].order = copiedMeals[newIndex].order;
        } else {
          copiedMeals[i].order = copiedMeals[i].order - 1;
        }
        // Update DB
        const {id, ...sortedMealForDB} = copiedMeals[i]
        db.collection('diet_meals').doc(id)
          .update(sortedMealForDB);
      }
      // Update UI
      setMeals(copiedMeals);
    }
    // Handle Draggable Up
    if(oldIndex > newIndex){
      for(let i = oldIndex; i >= newIndex ; i--){
        if( i === oldIndex){
          copiedMeals[oldIndex].order = copiedMeals[newIndex].order;
        } else {
          copiedMeals[i].order = copiedMeals[i].order + 1;
        }
        // Update DB
        const {id, ...sortedMealsForDB} = copiedMeals[i]
        db.collection('diet_meals').doc(id)
          .update(sortedMealsForDB);
      }
      // Update UI
      setMeals(copiedMeals);
    }
  }
  const newMealHandler = () =>{
    const confirmed = window.confirm("You Want to Add New Meal?");
    if(confirmed){
      db.collection('diet_meals').doc()
      .set({
        name: name,
        nutritionFacts: [
          {name: 'Calories', value: calories || 0}, 
          {name: 'Protein', value: protein || 0}, 
          {name: 'Carbohydrates', value: carbohydrates || 0},
          {name: 'Fiber', value: fiber || 0}, 
          {name: 'Sugars', value: sugars || 0}, 
          {name: 'Fat', value: fat || 0}, 
          {name: 'Saturated', value: saturated || 0}, 
          {name: 'Polyunsaturated', value: polyunsaturated || 0},
          {name: 'Monounsaturated', value: monounsaturated || 0}, 
          {name: 'Trans', value: trans || 0}, 
          {name: 'Cholesterol', value: cholesterol || 0}, 
          {name: 'Sodium', value: sodium || 0}, 
          {name: 'Potassium', value: potassium || 0},
          {name: 'Vitamin A', value: vitaminA || 0}, 
          {name: 'Vitamin C', value: vitaminC || 0}, 
          {name: 'Calcium', value: calcium || 0}, 
          {name: 'Iron', value: iron || 0}
        ],
        description: description.replace(/\r?\n/g, '<br/>'),
        order: meals.length
      });
      setName(""); setCalories(""); setProtein(""); setCarbohydrates(""); setFiber(""); setSugars(""); setFat(""); setSaturated("");
      setPolyunsaturated(""); setMonounsaturated(""); setTrans(""); setCholesterol(""); setSodium(""); setPotassium(""); setVitaminA(""); setVitaminC("");
      setCalcium(""); setIron(""); setDescription("");
    }
  }
  return(
    <div className="meal-list row">
      <SortableList 
        helperClass = "draggable-meal-list-helper-class"
        meals={meals}
        setMeals={setMeals} 
        onSortEnd={sortableHandler} 
      />
      <ul className="row">
        <div className="col-2">
          <input type="text" value={name} onChange={e=>setName(e.target.value)}        placeholder="Meal Name" style={{width:"100%"}}/></div>
        <div className="col-10">
          <input type="text" value={calories}                onChange={e=>setCalories(Number(e.target.value))}         placeholder="Calories"/>
          <input type="text" value={protein}                  onChange={e=>setProtein(Number(e.target.value))}          placeholder="Protein"/>
          <input type="text" value={carbohydrates}      onChange={e=>setCarbohydrates(Number(e.target.value))}    placeholder="Carbohydrates"/>
          <input type="text" value={fiber}                      onChange={e=>setFiber(Number(e.target.value))}            placeholder="Fiber"/>
          <input type="text" value={sugars}                    onChange={e=>setSugars(Number(e.target.value))}           placeholder="Sugars"/>
          <input type="text" value={fat}                          onChange={e=>setFat(Number(e.target.value))}              placeholder="Fat"/>
          <input type="text" value={saturated}              onChange={e=>setSaturated(Number(e.target.value))}        placeholder="Saturated Fat"/>
          <input type="text" value={polyunsaturated}  onChange={e=>setPolyunsaturated(Number(e.target.value))}  placeholder="Polyunsaturated"/>
          <input type="text" value={monounsaturated}  onChange={e=>setMonounsaturated(Number(e.target.value))}  placeholder="Monounsaturated"/>
          <input type="text" value={trans}                      onChange={e=>setTrans(Number(e.target.value))}            placeholder="Tran Fat"/>
          <input type="text" value={cholesterol}          onChange={e=>setCholesterol(Number(e.target.value))}      placeholder="Cholesterol"/>
          <input type="text" value={sodium}                    onChange={e=>setSodium(Number(e.target.value))}           placeholder="Sodium"/>
          <input type="text" value={potassium}              onChange={e=>setPotassium(Number(e.target.value))}        placeholder="Potassium"/>
          <input type="text" value={vitaminA}                onChange={e=>setVitaminA(Number(e.target.value))}         placeholder="Vitamin A"/>
          <input type="text" value={vitaminC}                onChange={e=>setVitaminC(Number(e.target.value))}         placeholder="Vitamin C"/>
          <input type="text" value={calcium}                  onChange={e=>setCalcium(Number(e.target.value))}          placeholder="Calcium"/>
          <input type="text" value={iron}                        onChange={e=>setIron(Number(e.target.value))}             placeholder="Iron"/>
          <div>
            <TextareaAutosize minRows={3} value={description} onChange={e=>setDescription(e.target.value)} style={{minWidth:"632px"}} placeholder="Description"/>
            </div>
        </div>
        <button onClick={newMealHandler}>New Meal</button>
      </ul>
    </div>
  )
}
export default MealList;  
