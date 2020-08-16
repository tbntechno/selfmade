import React, {useState,useEffect} from 'react';
import './WeeklyDietPlanEditor.scss';
import {db} from '../../../services/firebase';
import _ from 'lodash';
import check from 'check-types';
import clone from 'clone-deep';

const WeeklyDietPlanEditor = ({dietPlan, meals, DAYS_OF_WEEK}) => {
  // Add Form
  const [seletedDayAddMeal, setSeletedDayAddMeal]   = useState(0);
  const [seletedMealAddMeal, setSeletedMealAddMeal] = useState("");
  // Remove Form
  const [selectedDayRemoveMeal, setSelectedDayRemoveMeal] = useState(0);
  const [selectedMealRemoveMeal, setSelectedMealRemoveMeal] = useState(0);

  /* ***********
    above if we use useState(meals) => meals empty
    - Reason:
    + In the parrent Component (meals) are fetch using ComponenetDidMount()
      > How ComponentDidMount() work (not sure):
        Parent trying to mount everything
          => mount the child
          => chil is mounted
          => ComponenetDidMount in Child is called 
          => but there is no data is Child's ComponenetDidMount cuz Parent's ComponenetDidMount didnt fetch data!!
    - Solution:
      Use effect to track (meals) updated in Parent's ComponenetDidMount 
   */
  useEffect(()=>{
    setSeletedMealAddMeal(meals[0]? meals[0].id : "");
    setSelectedMealRemoveMeal(0);
    return;
  },[meals,dietPlan]);

  const addMealHandler = ()=>{
    if( check.emptyObject(dietPlan) && 
        check.emptyObject(dietPlan.data) &&
        check.undefined  (dietPlan.data[seletedDayAddMeal])){
      return;
    }

    if (seletedMealAddMeal === ""){
      alert("There is no meal"); return;
    }
    const confirmed = window.confirm("You Wanna Add?");
    if(confirmed){
      let updatedDietPlan     = clone(dietPlan);
      updatedDietPlan.data[seletedDayAddMeal].push(seletedMealAddMeal);
      const { id, ...newDietPlan} = updatedDietPlan;
      db.collection('diet').doc(id)
        .update(newDietPlan);
    }
  } 
  const removeMealHandler = (e) =>{
    if( check.emptyObject(dietPlan) && 
        check.emptyObject(dietPlan.data) &&
        check.undefined  (dietPlan.data[selectedDayRemoveMeal])){
      return;
    }
    if( check.emptyArray( dietPlan.data[selectedDayRemoveMeal] ) ){
      alert("There is no Meals in this day"); return;
    }
    const confirmed = window.confirm("You Wanna Remove?");
    if(confirmed){
      let updatedDietPlan     = clone(dietPlan);
      updatedDietPlan.data[selectedDayRemoveMeal].splice(selectedMealRemoveMeal,1);
      const { id, ...newDietPlan} = updatedDietPlan;
      db.collection('diet').doc(id)
        .update(newDietPlan);
    }

    console.log(selectedDayRemoveMeal, selectedMealRemoveMeal);
  }
  return (
    <div className="daysofweek-controller row">
      <div className="col-6">
        <select className="day-select form-control" onChange={(e)=>{setSeletedDayAddMeal(e.target.value)}}>
          {DAYS_OF_WEEK && DAYS_OF_WEEK.map((dayName,i) =>{
            return <option key={i} value={i}>{dayName}</option>
          })}
        </select>
        <select className="meal-select form-control" onChange={(e)=>{setSeletedMealAddMeal(e.target.value)}}>
          {meals && meals.map((meal,i) =>{
            return <option key={meal.id} value={meal.id}>{meal.name}</option>
          })}
        </select>
        <div className="add-meal-btn">
          <button onClick={addMealHandler}>Add Meal</button>
        </div>
      </div>

      <div className="col-6">
        <select className="day-select form-control" onChange={(e)=>{setSelectedDayRemoveMeal(e.target.value)}}>
          { DAYS_OF_WEEK.map((dayName,i) =>{
            return <option key={i} value={i}>{dayName}</option>
          })}
        </select>
        <select className="meal-select form-control" onChange={(e)=>{setSelectedMealRemoveMeal(e.target.value)}}>
          { dietPlan.data && dietPlan.data[selectedDayRemoveMeal].map((meal,index) =>{
            return <option key={index} value={index}>{index}</option>
          })}
        </select>
        <div onClick={removeMealHandler} className="add-meal-btn">
          <button>Remove Meal</button>
        </div>
      </div>
    </div>
  )
}
export default WeeklyDietPlanEditor;