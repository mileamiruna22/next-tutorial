"use client";

import { useUser } from '@clerk/nextjs';
import { Spinner } from "@/components/spinner";
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { availablePlans } from "@/lib/plans";
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

async function fetchSubscriptionStatus() {
    const response = await fetch("/api/profile/subscription-status");
    return response.json();
}

async function updatePlan(newPlan: string) {
    const response = await fetch("/api/profile/change-plan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newPlan}),
    });

    return response.json();
}

export default function Profile ()
{
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const {isLoaded, isSignedIn, user } = useUser();
    const {data: subscription, isLoading, isError, error} = useQuery({
        queryKey: ["subscription"],
        queryFn: fetchSubscriptionStatus,
        enabled: isSignedIn && isLoaded,
        staleTime: 5*60*1000
    });

    const {data: updatedPlan, mutate: updatePlanMutation, isPending: isUpdatePlanPending} = useMutation({
        mutationFn: updatePlan,
    });
    
    const currentPlan = availablePlans.find(
        (plan) => plan.interval === subscription?.subscription.subscriptionTire
    );

    function handleUpdatePlan(){
        if(selectedPlan) {
            updatePlanMutation(selectedPlan);
        }
        setSelectedPlan("");
    }

    if(!isLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Spinner /> <span className="ml-2 text-gray-700">Loading...</span></div>;
    }

    if(!isSignedIn) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-700">Please sign in to view your profile.</p></div>;
    }
    
    return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-100 to-green-50"> 
        <Toaster position="top-center"/>
        <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
           
            <div className="w-1/3 bg-green-600 p-6 flex flex-col items-center justify-center text-white text-center rounded-l-lg">
                <div className="mb-4">
                   {user.imageUrl &&  
                   <Image 
                        src={user.imageUrl} 
                        alt="User avatar" 
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-white shadow-md"
                    />}
                </div>
                <h1 className="text-xl font-semibold mb-1">{user.firstName} {user.lastName} </h1>
                <p className="text-sm opacity-90">{user.primaryEmailAddress?.emailAddress}</p>
            </div>

           
            <div className="w-2/3 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Subscription Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    { isLoading ? 
                        (
                        <div className="flex items-center text-gray-600"> 
                            <Spinner/> 
                            <span className="ml-2"> Loading subscription details.... </span> 
                            </div>
                        ) : isError? (
                            <p className="text-red-500">{error?.message}</p>
                        ) : subscription ? (
                            <div> 
                                <h3 className="text-lg font-semibold text-gray-700 mb-2"> Current Plan</h3>
                                { currentPlan ? (
                                    <div className="space-y-1 text-gray-600"> 
                                        <p>
                                            <strong className="font-medium">Plan:</strong> {currentPlan.name}
                                        </p>
                                        <p>
                                            <strong className="font-medium">Amount:</strong> {currentPlan.amount} {currentPlan.currency}
                                        </p>
                                        <p>
                                            <strong className="font-medium">Status:</strong> ACTIVE
                                        </p>
                                    </div>
                                ) : (
                                <p className="text-gray-600"> Current plan not found.</p>)}
                            </div>
                        ) : (
                            <p className="text-gray-600">You are not subscribed to any plan.</p>
                        )}
                </div>


                <div className="bg-white shadow-md rounded-lg p-4 border border-emerald-200">
                    <h3 className="text-xl font-semibold mb-2 text-emerald-600">
                        Change Subscription Plan
                    </h3>
                        <select
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                            setSelectedPlan(event.target.value)
                            }
                            defaultValue={currentPlan?.interval}
                            className="w-full px-3 py-2 border border-emerald-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                            disabled={isUpdatePlanPending}
                            >
                            <option value="" disabled>
                            Select a new plan
                            </option>
                            {availablePlans.map((plan, key) => (
                            <option key={key} value={plan.interval}>
                                {plan.name} - ${plan.amount} / {plan.interval}
                            </option>
                            ))}
                        </select>
                  `   <button onClick={handleUpdatePlan}
                        className="mt-3 p-2 bg-emerald-500 rounded-lg textwhite"
                        > Save Change</button>
                     { isUpdatePlanPending && (
                        <div className="flex items-center mt-2">
                            <Spinner/> <span> Updating Plan...</span>
                        </div>
                     )}
                </div>
            </div>
        </div>
    </div>
    );
}