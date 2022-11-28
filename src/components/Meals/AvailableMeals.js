import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useState, useEffect } from 'react';


const AvailableMeals = () => {

  const [availableMeals, setAvailableMeals]  = useState([])
  const [isLoading, setLoadingState] = useState(true)
  const [error, setHttpError] = useState(null)
  

  const fetchAvailableMeals = async ()=>{
    try {
      const response = await fetch('https://custon-hooks-default-rtdb.asia-southeast1.firebasedatabase.app/Available-Meals.json', {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      
      const fetchedData = await response.json();
      // console.log(fetchedData);
      
      const featchedMealItemsArray = [];
      for (const key in fetchedData) {
        // console.log(key.id)
        featchedMealItemsArray.push(
          {
            id: fetchedData[key].id,
            description: fetchedData[key].description,
            name: fetchedData[key].name,
            price: fetchedData[key].price
          }
        )
        // console.log(featchedMealItemsArray)
      }
      
      setAvailableMeals(featchedMealItemsArray)
      setLoadingState(false)
    } catch (error) {
      setLoadingState(false)
      setHttpError(error.message)
      console.log("error!: " + error.message)
    }
  }

  useEffect(()=>{
      fetchAvailableMeals();
  }, [])

  if (error) {
    return(
      <section className={classes.meals}>
        <Card>
          <h4 className={classes.loading}>{error}</h4>
        </Card>
      </section>
    )
  }

  const mealsList = availableMeals?.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ))

  return (
    <section className={classes.meals}>
      <Card>
        {isLoading ? <h3 className={classes.loading}>Loading...</h3> : <ul>{mealsList}</ul>}
      </Card>
    </section>
  );
};

export default AvailableMeals;
