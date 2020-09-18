import React, {useState, useEffect} from 'react';
import './Diet.scss';
import check  from 'check-types';
import {auth, db} from 'services/firebase';
import _ from 'lodash';
import WeeklyTable              from './WeeklyTable/WeeklyTable';
import WeeklyTableControlPanel  from './WeeklyTableControlPanel/WeeklyTableControlPanel'
import {nutritionFactsCombine} 	from 'utils/utils';
import {Container} 					        	from 'react-bootstrap';

const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

const builtInPlan =(userID) => {
  return {
    planName: "Trung Nguyen",
    data: {
      0: ["3LE6JDanEpjivreIKKPC","5ZiOeBvCo0gcdeUGvig6","VEFgyzrl6HCp3JI7Ab6t","WZ6OIKAXAzATntVydhmX"],
      1: ["WZ6OIKAXAzATntVydhmX"],
      2: ["3LE6JDanEpjivreIKKPC"],
      3: ["5ZiOeBvCo0gcdeUGvig6"],
      4: ["VEFgyzrl6HCp3JI7Ab6t"],
      5: ["WZ6OIKAXAzATntVydhmX","5ZiOeBvCo0gcdeUGvig6"],
      6: ["WZ6OIKAXAzATntVydhmX"]
    },
    userID:userID
  }
}
const builtInGoal =() => {
  return [
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
  ]
}

const DEFAULT_PLAN_ID = "EYwYQW2os0Tp7qqqrNEt";

export const DietContext = React.createContext();
const Diet = () => {
  const [dietPlan,  setDietPlan]  = useState({});
  const [dietMeals, setDietMeals] = useState([]);
  const [dietIngredients,  setDietIngredients]   = useState([]);
  const [mappedDietPlanData, setMappedDietPlanData] = useState([]);

  useEffect(()=>{
    // Get Current Diet Plan
    const unsubDiet = db.collection('diet_plans').doc(DEFAULT_PLAN_ID)
      .onSnapshot((doc)=>{
        const plan = { id: doc.id, ...doc.data() };
        // console.log(plan);
        setDietPlan(plan);
      })

    // Get Meals
    var unsubMeals;
    if( check.emptyArray(dietMeals) ){
      unsubMeals = db.collection('diet_meals').where("userID", "==", auth.currentUser.uid)
      .onSnapshot((snapshot)=>{
        const meals = snapshot.docs.map((doc)=> ({ mealID:doc.id, ...doc.data() }) );
        // console.log(meals);
        setDietMeals(meals);
      })
    }

    // Get Ingredients
    var unsubIngredients;
    if( check.emptyArray(dietIngredients) ){
      unsubIngredients = db.collection('diet_ingredients')
      .onSnapshot((snapshot)=>{
        const ingredients = snapshot.docs.map((doc)=> ({ ingredientID:doc.id, ...doc.data() }) );
        // console.log(ingredients);
        setDietIngredients(ingredients);
      })
    }
    return () => {
      unsubMeals();
      unsubDiet();
      unsubIngredients();
    }
  },[]);
  
  useEffect(()=>{
    /************************
      - dietIngredients: [{
          id: "OsddcqItZ8SuXD01IV3o"
          name: "olllkm"
          nutritionFacts: (17) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
          unit: "tbsp"
        }
      ]

      - dietMeals:[{
          id: "3LE6JDanEpjivreIKKPC"
          ingredients: Array(2)
            0: {ingredientID: "OsddcqItZ8SuXD01IV3o", serving: 1}
            1: {ingredientID: "iKqGMLGHTPZIp9PK8TIc", serving: 1}
          length: 2
          instruction: "not Obsences anymre<br/><br/>awe<br/>aw<br/>e"
          name: "Meal 1"
          userID: "6c0eYGjSayY9G2YHP8ejQhSB2Th1"
        }
      ]
      
       * MAP the mapped Meals to the 7-day Plan data
      - dietPlan {
        data:
          0: (4) ["3LE6JDanEpjivreIKKPC", "5ZiOeBvCo0gcdeUGvig6", "VEFgyzrl6HCp3JI7Ab6t", "WZ6OIKAXAzATntVydhmX"]
          1: ["WZ6OIKAXAzATntVydhmX"]
          2: ["3LE6JDanEpjivreIKKPC"]
          3: ["5ZiOeBvCo0gcdeUGvig6"]
          4: ["VEFgyzrl6HCp3JI7Ab6t"]
          5: (2) ["WZ6OIKAXAzATntVydhmX", "5ZiOeBvCo0gcdeUGvig6"]
          6: ["WZ6OIKAXAzATntVydhmX"]
        __proto__: Object
        id: "EYwYQW2os0Tp7qqqrNEt"
        planName: "Trung Nguyen"
        userID: "6c0eYGjSayY9G2YHP8ejQhSB2Th1"
    }
    ************************/
    if( !check.emptyArray(dietIngredients) && !check.emptyArray(dietMeals) && !check.emptyObject(dietPlan) ){
      // Mapping Ingredients into Meals => {mappedDietMeals}
      var mappedDietMeals = dietMeals.map((meal, index)=>{
        var nutritionFactsList = []
        var ingredients = meal.ingredients.map((ingredient,index) =>{
          // Get ingredient data from {dietIngredients} + Serving
          var found = {...dietIngredients.find(ingredientData => ingredientData.ingredientID === ingredient.ingredientID), serving: ingredient.serving} 
          // Accumulate to calculate total meal nutritionFacts
          nutritionFactsList.push({nutritionFacts: found.nutritionFacts, serving: found.serving})
          return found;
        })
        meal['ingredients'] = ingredients
        meal['mealNutritionFacts'] = nutritionFactsCombine(nutritionFactsList)
        return meal
      })
      // Maping {mappedDietMeals} into DietPlan
      var mappedDietPlan = DAYS_OF_WEEK.map((dayName, i)=>{
        var nutritionFactsList = []
        var mealData = dietPlan.data[i].map((mealID, i) => {
          var found =  mappedDietMeals.find(mealData => mealData.mealID == mealID)
          nutritionFactsList.push({nutritionFacts: found.mealNutritionFacts, serving: 1})           // Accumulate to calculate total day nutritionFacts
          return found
        })
        return { 
          mealData: mealData,
          dayName: dayName,
          dayNutritionFacts: nutritionFactsCombine(nutritionFactsList),
          nutritionGoal: builtInGoal()
        }
      })
      setMappedDietPlanData(mappedDietPlan);
    }
  },[dietIngredients, dietMeals, dietPlan]);

  const testPlan = () => {
    db.collection('diet_plans').doc()
    .set(builtInPlan(auth.currentUser.uid));
  }
  return (
    <DietContext.Provider value={{mappedDietPlanData, setMappedDietPlanData, dietMeals, setDietMeals, dietPlan}}>
      <div className="diet">
        <Container fluid>
          {(check.emptyArray(mappedDietPlanData)) ? null : 
            <React.Fragment>
              <div style={{display:"flex", justifyContent: "flex-end", margin: "5px"}}>
                <button onClick={()=>window.print()}>Print</button>
              </div>
              <div className="print-container">
                <WeeklyTable/>
              </div>
              <WeeklyTableControlPanel/>   
            </React.Fragment>
          }
          {/* <button onClick={testPlan}>Create Test Plan</button> */}
        </Container>
      </div>
    </DietContext.Provider>
  )
}
export default Diet;