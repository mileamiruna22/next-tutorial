"use client";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";

interface MealPlanInput {
    dietType: string;
    calories: number;
    allergies: string;
    cuisine: string;
    snacks: string;
    days?: number;

}
interface DailyMealPlan {
    Breakfast?: string;
    Lunch?: string;
    Dinner?: string;
    Snacks?: string;
}

interface WeeklyMealPlan {
    [day: string]: DailyMealPlan;
}

interface MealPlanResponse {
    mealPlan?: WeeklyMealPlan;
    error?: string;
}

async function generateMealPlan(payload: MealPlanInput): Promise<MealPlanResponse> {
    const response = await fetch("/api/generate-mealplan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    return response.json();
}

export default function MealPlanDashboard ()
{
    const {mutate, isPending, data, isSuccess} = useMutation<MealPlanResponse, Error, MealPlanInput>({
        mutationFn: generateMealPlan,
    });

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const payload: MealPlanInput = {
            dietType: formData.get("dietType")?.toString() || "",
            calories: Number(formData.get("calories") || 2000),
            allergies: formData.get("allergies")?.toString() || "",
            cuisine: formData.get("cuising")?.toString() || "",
            snacks: formData.get("snacks")?.toString() || "",
            days: 7,
        };

        mutate(payload);
   }
   
   const daysOfTheWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {
        if (!data?.mealPlan) return undefined;
        return data?.mealPlan[day];
    }
   
    return( 
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100"> 
        <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"> 
           
            <div className="w-1/3 bg-green-600 p-8 text-white flex flex-col justify-between"> 
                <h1 className="text-2xl font-bold mb-8"> AI Meal Plan Generator </h1>
                <form onSubmit = {handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="dietType" className="block text-sm font-medium mb-1"> Diet Type</label>
                        <input 
                            type="text" 
                            id="dietType" 
                            name="dietType"
                            required 
                            placeholder="e.g., Vegetarian, Keto, Mediter" 
                            className="w-full p-2 rounded-md bg-green-700 border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="calories" className="block text-sm font-medium mb-1"> Daily Calorie Goal</label>
                        <input 
                            type="number" 
                            id="calories" 
                            name="calories"
                            required 
                            min={500}
                            max={3000}
                            placeholder="e.g., 2000" 
                            className="w-full p-2 rounded-md bg-green-700 border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="allergies" className="block text-sm font-medium mb-1"> Allergies or Restrictions</label>
                        <input 
                            type="text" 
                            id="allergies" 
                            name="allergies"
                            required 
                            placeholder="e.g., Nuts, Dairy, None"         
                            className="w-full p-2 rounded-md bg-green-700 border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="cuising" className="block text-sm font-medium mb-1"> Preferred Cuisine</label>
                        <input 
                            type="text" 
                            id="cuising" 
                            name="cuising"
                            required 
                            placeholder="e.g., Italian, Chinese, No Pref"        
                            className="w-full p-2 rounded-md bg-green-700 border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
                        />
                    </div>

                    <div className="flex items-center space-x-2">  
                        <input 
                            type="checkbox" 
                            id="snacks"  
                            name="snacks"  
                            className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor="snacks" className="text-sm font-medium"> Include Snacks</label>
                    </div>

                    <div> 
                        <button type="submit" disabled= {isPending} className="w-full bg-white text-green-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-100 transition duration-200"> 
                            {isPending? "Generating..." : "Generate Meal Plan"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-2/3 p-8"> 
                <h2 className="text-2xl font-bold text-green-700 mb-8"> Weekly Meal Plan</h2>
                {data?.mealPlan && isSuccess ? (
                    <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-4"> 
                        <div> 
                            {
                                daysOfTheWeek.map((day, key) => {
                                const mealplan = getMealPlanForDay(day);
                                return (
                                <div key={key} className="bg-white p-6 rounded-lg shadow-md mb-4 border-t-4 border-green-500">
                                    <h3 className="text-xl font-semibold text-green-700 mb-3">{day}</h3>
                                    {mealplan ? (
                                        <div className="space-y-2">
                                        <div className="text-gray-700">
                                            <strong className="text-green-600">Breakfast:</strong> {mealplan.Breakfast}
                                        </div>
                                        <div className="text-gray-700">
                                            <strong className="text-green-600">Lunch:</strong> {mealplan.Lunch}
                                        </div>
                                        <div className="text-gray-700">
                                            <strong className="text-green-600">Dinner:</strong> {mealplan.Dinner}
                                        </div>
                                        {mealplan.Snacks && (
                                            <div className="text-gray-700">
                                            <strong className="text-green-600">Snacks:</strong> {mealplan.Snacks}
                                            </div>
                                        )}
                                        </div>
                                       ) : (
                                        <p className="text-gray-500">No meal plan available.</p>
                                    )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    ) : isPending ? (
                    <Spinner />
                    ) : (
                    <p> Please generate a meal plan to see it here. </p> 
                    )} 
            </div>
        </div>
    </div>
    );
}






