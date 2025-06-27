"use client"

import { availablePlans } from "@/lib/plans"; 
import {useMutation} from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";


type SubscribeResponse = {url: string}
type SubscribeError = {error: string}

async function subscribeToPlan(
  planType: string, 
  userId: string, 
  email:string
): Promise<SubscribeResponse> {

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

     body: JSON.stringify({
        planType,
        userId,
        email
      }),    
  });

  if (!response.ok) {
    const errorData : SubscribeError = await response.json();
    throw new Error(errorData.error || "Something went wrong.");
  }

  const data: SubscribeResponse = await response.json();

  return data;
   
}

export default function Subscribe() {

  const {user} = useUser();
  const router = useRouter();

  const userId = user?.id;
  const email = user?.emailAddresses[0]?.emailAddress || "";

  const {mutate, isPending} = useMutation<SubscribeResponse, Error, {planType: string}>({
    mutationFn: async (planType) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      return subscribeToPlan(planType, userId, email);
    }
  });

  function handleSubscribe(planType: string) {

    if (!userId) {
      router.push("/sign-up");
      return;
    }

    mutate({planType});
  }
  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Pricing</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get started on our weekly plan or upgrade to monthly or yearly when you are ready.
        </p>
      </div>

     
      <div className="flex flex-col lg:flex-row justify-center items-stretch lg:items-start gap-8 max-w-6xl mx-auto">
        {availablePlans.map((plan, key) => (
          <div
            key={key}
            className={`
              relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-lg
              p-6 pt-12 flex-1 w-full max-w-sm lg:max-w-none
              ${plan.isPopular ? "border-emerald-500 ring-2 ring-emerald-500 z-10" : ""}
            `}
          >
           
            {plan.isPopular && (
              <p className="absolute top-0 transform -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </p>
            )}

           
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-5xl font-extrabold text-gray-900 mb-2">
              <span>${plan.amount}</span>{" "}
              <span className="text-xl font-normal text-gray-500">/{plan.interval}</span>
            </p>
            <p className="text-gray-600 text-center mb-6 px-4">
              {plan.description}
            </p>

           
            <ul className="space-y-3 mb-8 text-gray-700 w-full flex-grow">
              {plan.features.map((feature, featureKey) => (
                <li key={featureKey} className="flex items-center text-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

           
            <button
              className={`
                w-full py-3 px-6 rounded-md text-lg font-medium transition-colors duration-200
                ${plan.isPopular 
                    ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                    : "bg-emerald-200 text-emerald-800 hover:bg-emerald-300" 
                } 
                ${plan.isPopular ? "shadow-md" : "shadow-sm"}
              `}

              onClick = {() => handleSubscribe(plan.interval)}
              disabled={isPending}
            >
              {isPending ? "Please waiting..." : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

