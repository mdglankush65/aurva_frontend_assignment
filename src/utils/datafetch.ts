import axios from "axios";

export const fetchCategories = async () => {
  try {
    const res = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    // console.log(res.data.categories);
    return res.data.categories.slice(8, 13);
  } catch (error) {
    console.log(error);
  }
};

export const fetchMeals = async (category: string) => {
  try {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    // console.log("In the API => ",res.data);
    return res.data.meals.slice(0, 5);
  } catch (error) {
    console.log(error);
  }
};

export const fetchIngredients = async (ingredients: string) => {
  try {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTags = async (area: string) => {
  try {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchDetails = async (meal: string) => {
  try {
    const name = meal.split(" ")[0];

    const id = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );

    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id.data.meals[0].idMeal}`
    );

    console.log("Inside api call ", res.data.meals[0]);

    return res.data.meals[0];
  } catch (error) {
    console.log(error);
  }
};
