import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openAI = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: 'https://api.openrouter.ai/api/v1',
});

export async function POST(request: NextRequest) {

    try {
        const { dietType, calories, allergies, cuisine, snacks, days } = await request.json();

       const prompt= `
        You are a professional nutritionist. Create a ${days}-day meal plan for an 
        individual following a ${dietType} diet for ${calories} calories per day.

        Allergies or restrictions: ${allergies || "none"}.
        Preferred cuisine: ${cuisine || "no preference"}.
        Snacks included: ${snacks ? "yes" : "no"}.

        For each day, provide:

            - Breakfast
            - Lunch
            - Dinner
            ${snacks ? "- Snacks" : ""}

        Use simple ingredients and provide brief instructions. 
        Include approximate calorie counts for each meal.
        Structure the response as a JSON object where each day is a key, and each 
        meal (breakfast, lunch, dinner, snacks) is a subkey. Example:
        {
            "Monday": {
                "Breakfast": "Oatmeal with fruits - 350 calories",
                "Lunch": "Grilled chicken salad - 500 calories",
                "Dinner": "Steamed vegetables with quinoa - 600 calories",
                "Snacks": "Greek yogurt - 150 calories"
            },
            "Tuesday": {
                "Breakfast": "Smoothie bowl - 300 calories",
                "Lunch": "Turkey sandwich - 450 calories",
                "Dinner": "Baked salmon with asparagus - 700 calories",
                "Snacks": "Almonds - 200 calories"
            }
            // ... and so on for each day
        }

        Return just the JSON with no extra commentaries and no backticks.
       `;

       const response = await openAI.chat.completions.create({
            model: 'meta-llama/llama-3.2-3b-instruct:free',
            messages: [
                {
                    role: 'user',
                    content: prompt
                },
            ],

            temperature: 0.7,
            max_tokens: 1500,
        });

        const aiContent = response.choices[0].message.content!.trim();
        let parsedMealPlan: {[day: string]: DailyMealPlan};

        try {
            parsedMealPlan = JSON.parse(aiContent);
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            return NextResponse.json(
                {error: "Failed to parse meal plan. Please try again."}, 
                {status: 500}
            );
        }

        if(typeof parsedMealPlan !== 'object' || parsedMealPlan === null) {
            return NextResponse.json(
                {error: "Invalid meal plan format. Please try again."}, 
                {status: 500}
            );
        }

        return NextResponse.json({mealPlan: parsedMealPlan}, {status: 200});
      
    } catch (error: any) {
        return NextResponse.json({error: "internal error"}, {status: 500});
    }

}

interface DailyMealPlan {
    Breakfast?: string;
    Lunch?: string;
    Dinner?: string;
    Snacks?: string;
}