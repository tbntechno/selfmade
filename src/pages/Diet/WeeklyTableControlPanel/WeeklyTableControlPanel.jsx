import React, {useState,useEffect,useContext} from 'react';
import './WeeklyTableControlPanel.scss';
import _ from 'lodash';
import check from 'check-types';
import clone from 'clone-deep';
import Select from 'react-select';
import {db} from 'services/firebase';
import {Container, Row, Col} from 'react-bootstrap';
import {DietContext} from '../Diet';

const WeeklyTableControlPanel = () => {
  const { mappedDietPlanData, setMappedDietPlanData, dietMeals, setDietMeals, dietPlan } = useContext(DietContext)
  const searchableDietMeals = dietMeals.map(meal=>({label: meal.name, value:meal.mealID}))
  // Add Form
  const [seletedDayAddMeal, setSeletedDayAddMeal]   = useState(0);
  const [seletedMealAddMeal, setSeletedMealAddMeal] = useState(""); // default = null, not-picking = ""
  // Remove Form
  const [selectedDayRemoveMeal, setSelectedDayRemoveMeal] = useState(0);
  const [selectedMealRemoveMeal, setSelectedMealRemoveMeal] = useState(0);

  
  // Add Meal Handler
  const addMealHandler = ()=>{
    if (check.emptyString(seletedMealAddMeal) || check.null(seletedMealAddMeal)){
      alert("Meal has not selected"); return;
    }
    // console.log(seletedDayAddMeal, seletedMealAddMeal)
    if( window.confirm("Are you sure you want to add this meal?") ){
      let temp = clone(dietPlan);
      temp.data[seletedDayAddMeal].push(seletedMealAddMeal);
      const { id, ...newDietPlan} = temp;
      db.collection('diet_plans').doc(id)
        .update(newDietPlan);
    }
  } 

  // Remove Meal Handler
  const removeMealHandler = () =>{
    // console.log(selectedDayRemoveMeal, selectedMealRemoveMeal);
    if( check.emptyArray( dietPlan.data[selectedDayRemoveMeal] )){
      alert("There is no meals to remove in this day"); return;
    }

    if(window.confirm("Are you sure you want to remove this meal?")){
      var temp     = clone(dietPlan);
      temp.data[selectedDayRemoveMeal].splice(selectedMealRemoveMeal,1);
      const { id, ...newDietPlan} = temp;
      db.collection('diet_plans').doc(id)
        .update(newDietPlan);
    }
  }

  return (
    <Row className="weekly-table-control-panel">
      <Col xs={6}>
        <select className="day-select form-control" onChange={(e)=>{setSeletedDayAddMeal(e.target.value)}}>
          {mappedDietPlanData.map((data,i) =>{
            return <option key={i} value={i}>{data.dayName}</option>
          })}
        </select>
        <div style={{marginLeft:"5px", marginRight:"-5px", marginBottom:"5px"}}>
          <Select options={searchableDietMeals} onChange={(meal)=>setSeletedMealAddMeal(meal && meal.value)} isClearable={true} placeholder="Search a Meal"/>
        </div>
        <div className="add-meal-btn">
          <button onClick={addMealHandler}>Add Meal</button>
        </div>
      </Col>

      <Col xs={6}>
        <select className="day-select form-control" onChange={(e)=>{setSelectedDayRemoveMeal(e.target.value);setSelectedMealRemoveMeal(0)}}>
          {mappedDietPlanData.map((data,i) =>{
            return <option key={i} value={i}>{data.dayName}</option>
          })}
        </select>
        <select className="meal-select form-control" onChange={(e)=>{setSelectedMealRemoveMeal(Number(e.target.value))}}>
          { mappedDietPlanData[selectedDayRemoveMeal].mealData.map((meal,i) =>{
            return <option key={i} value={i}>{meal.name}</option>
          })}
        </select>
        <div onClick={removeMealHandler} className="add-meal-btn">
          <button>Remove Meal</button>
        </div>
      </Col>
    </Row>
  )
}
export default WeeklyTableControlPanel;