

export interface Plan{
    name: string;
    amount: number;
    currency: string;
    interval: string;
    isPopular?: boolean;
    description: string;
    features: string[]
}

export const availablePlans: Plan[] = [

    {
        name: "Weekly Plan",
        amount: 9.99,
        currency: "USD",
        interval: "week",
        isPopular: false,
        description: "Get started with our weekly plan. Perfect for trying out our service.",
        features: [ 
            "Unlimited AI meal plans", 
            "AI Nutrition Insights", 
            "Cancel anytime" 
        ],
    },

     {
        name: "Monthly Plan",
        amount: 39.99,
        currency: "USD",
        interval: "month",
        isPopular: true,
        description: "Perfect for ongoing, month-to-month access to our service.",
        features: [ 
            "Unlimited AI meal plans", 
            "Priority AI support", 
            "Cancel anytime" 
        ],
    },

     {
        name: "Yearly Plan",
        amount: 299.99,
        currency: "USD",
        interval: "year",
        isPopular: false,
        description: "Best value for those committed to improving their nutrition long-term.",
        features: [ 
            "Unlimited AI meal plans", 
            "All premium features", 
            "Cancel anytime" 
        ],
    },
]

const priceIDMap: Record<string, string> = {
    week: process.env.STRIPE_PRICE_WEEKLY!,
    month: process.env.STRIPE_PRICE_MONTHLY!,
    year: process.env.STRIPE_PRICE_YEARLY!
}
export const getPriceIDFromType = (planType: string) => priceIDMap[planType];