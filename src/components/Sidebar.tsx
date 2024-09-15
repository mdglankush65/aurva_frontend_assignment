import { Meal } from "../constants";

const Sidebar = ({
  mealDetails,
  setMealDetails,
}: {
  mealDetails: Meal;
  setMealDetails: (meal: Meal | null) => void;
}) => {
  return (
    <div className="z-10 w-1/3 p-3 bg-white border border-gray-300 rounded-lg fixed top-0 right-0 h-full overflow-auto">
      {/* Meal Title */}
      <div className="flex justify-between text-center">
        <div className="w-full text-xl font-semibold text-gray-600 mb-2 ">
          {mealDetails.strMeal}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => setMealDetails(null)}
        >
          X
        </div>
      </div>

      {/* Meal Image */}
      <img
        src={mealDetails.strMealThumb}
        alt={mealDetails.strMeal}
        className="w-full rounded-lg object-cover mb-4"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mealDetails.strTags &&
          mealDetails.strTags.split(",").map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-purple-200 text-purple-800 px-3 py-1 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* Details */}
      <div className="w-full mb-4 text-gray-500 font-semibold text-start ">
        <div className="flex justify-between text-sm mb-2 ">
          <div className="w-1/2">Category</div>
          <div className="w-1/2">{mealDetails.strCategory}</div>
        </div>
        <div className="flex justify-between text-sm mb-2 ">
          <div className="w-1/2">Area</div>
          <div className="w-1/2">{mealDetails.strArea}</div>
        </div>
        <div className="flex justify-between text-sm mb-2 ">
          <div className="w-1/2">YouTube</div>
          <div className="w-1/2">
            <a
              href={mealDetails.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:cursor-pointer"
            >
              Watch Recipe
            </a>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border border-gray-400 rounded-lg p-3">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Instructions:
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {mealDetails.strInstructions}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;