import React, {useState,useEffect} from 'react';
import './Diet.scss';
import {db} from '../../services/firebase';
import _ from 'lodash';
import DaysOfWeek           from './DaysOfWeek/DaysOfWeek';
import DaysOfWeekController from './DaysOfWeekController/DaysOfWeekController'
import MealList             from './MealList/MealList';

// const nutritionTemplate   = [
//   'Protein', 'Carbohydrates', 'Fiber', 'Sugars',
//   'Fat', 'Saturated', 'Polyunsaturated','Monounsaturated', 
//   'Trans', 'Cholesterol', 'Sodium', 'Potassium', 
//   'Vitamin A', 'Vitamin C', 'Calcium', 'Iron'
// ];
// const nutritionGoal = [
//   201, 268, 38, 101, 89, 30, 0, 0, 0, 300, 2300, 3500,
//   100, 100, 100, 100
// ]

const nutritionPlan = {
  planName: "first one",
  nutritionGoal: [
    {name: "Calories", value:2680}, 
    {name: "Protein", value:201}, 
    {name: "Carbohydrates", value:268}, 
    {name: "Fiber", value:38}, 
    {name: "Sugars", value:101}, 
    {name: "Fat", value:89}, 
    {name: "Saturated", value:30}, 
    {name: "Polyunsaturated", value:0}, 
    {name: "Monounsaturated", value:0}, 
    {name: "Trans", value:0}, 
    {name: "Cholesterol", value:300}, 
    {name: "Sodium", value:2300}, 
    {name: "Potassium", value:3500},
    {name: "Vitamin A", value:100}, 
    {name: "Vitamin C", value:100}, 
    {name: "Calcium", value:100}, 
    {name: "Iron", value:100}
  ],
  data: {
    0: ["hmwQycj3fEoLkTQh4VaE","mzHhzivZe20ZuZtmce1h"],
    1: ["mzHhzivZe20ZuZtmce1h"],
    2: ["mzHhzivZe20ZuZtmce1h"],
    3: ["mzHhzivZe20ZuZtmce1h"],
    4: ["mzHhzivZe20ZuZtmce1h"],
    5: ["mzHhzivZe20ZuZtmce1h"],
    6: ["mzHhzivZe20ZuZtmce1h"]
  }
}
const DEFAULT_PLAN = "first one";
const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]
const Diet = () => {
  const [meals, setMeals] = useState([]);
  const [dietPlans, setDietPlans]  = useState([]);
  const [dietPlan,  setDietPlan]   = useState({});

  useEffect(()=>{
    // Get Meal!
    const unsubMeals = db.collection('diet_meals')
    .onSnapshot((snapshot)=>{
      const meals = snapshot.docs.map((doc)=> ({ id:doc.id, ...doc.data() }) );
      // meals = _.sortBy(meals, 'order')  //
      // console.log(meals);
      setMeals(meals || []);
    })
    
    // Get Diet Selected Plan & ALL Plans
    const unsubDiet = db.collection('diet')
    .onSnapshot((snapshot)=>{
      const dietPlans = snapshot.docs.map((doc)=> ({ id: doc.id, ...doc.data() }) );
      setDietPlans(dietPlans || []);
      // console.log(dietPlans);
      // Get Default Plan
      const defaultPlan =  _.find(dietPlans, {'planName': DEFAULT_PLAN});
      setDietPlan(defaultPlan || {});
      // console.log(defaultPlan);
    })
    return () => {
      unsubMeals();
      unsubDiet();
    }
  },[]);

  const testHandler = () => {
    // db.collection('diet').doc('iWWpcGyovKHF3L7KAtJI')
    // .set(nutritionPlan);
  }
  const EW = () => {
    db.collection('diet_meals').doc()
    .set({
      name: `${_.uniqueId()}`,
      nutritionFacts: [ 
        {name: 'Calories', value: -1}, 
        {name: 'Protein', value: -1}, 
        {name: 'Carbohydrates', value: -1},
        {name: 'Fiber', value: -1}, 
        {name: 'Sugars', value: -1}, 
        {name: 'Fat', value: -1}, 
        {name: 'Saturated', value: -1}, 
        {name: 'Polyunsaturated', value: -1},
        {name: 'Monounsaturated', value: -1}, 
        {name: 'Trans', value: -1}, 
        {name: 'Cholesterol', value: -1}, 
        {name: 'Sodium', value: -1}, 
        {name: 'Potassium', value: -1},
        {name: 'Vitamin A', value: -1}, 
        {name: 'Vitamin C', value: -1}, 
        {name: 'Calcium', value: -1}, 
        {name: 'Iron', value: -1}
      ],
      order: meals.length
    });
  }
  const [textarea, setTextarea] = useState("");
  const textAreaConvertHandler = ()=>{
    console.log(textarea);
  }
  return (
    <div className="diet">
      <div className="container-fluid">
        <DaysOfWeek           meals={meals} dietPlan={dietPlan} DAYS_OF_WEEK={DAYS_OF_WEEK} setDietPlan={setDietPlan}/>
        <DaysOfWeekController meals={_.sortBy(meals,'order')} dietPlan={dietPlan} DAYS_OF_WEEK={DAYS_OF_WEEK}/>   
        <MealList             meals={_.sortBy(meals,'order')} setMeals={setMeals}/>
        {/* <button onClick={newMealHandler}>New Meal</button> */}
        <button onClick={testHandler}>Test</button>
        <button onClick={textAreaConvertHandler}>Text Area Converter</button>
        <div className="row">
          <div className="col-6" >
            <textarea name="" id="" cols="30" rows="5" style={{width: "100%"}} onChange={e=>setTextarea(e.target.value.replace(/\r?\n/g, '<br/>'))}></textarea>
          </div>
          <div className="col-6">{textarea}</div>
        </div>
      </div>
    </div>
  )
}
export default Diet;