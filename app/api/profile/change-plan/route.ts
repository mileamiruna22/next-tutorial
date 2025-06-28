import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prisma  from "@/lib/prisma";
import {stripe} from "@/lib/stripe";
import { getPriceIDFromType } from "@/lib/plans";

export async function POST(request: NextRequest) {
    try{
        const clerkUser  = await currentUser()
        if (!clerkUser?.id) {
            return NextResponse.json({error: "Unauthorized"});
        }

        const {newPlan} = await request.json();

        if (!newPlan) {
            return NextResponse.json({error: "New plan is required."});
        }

        const profile = await prisma.profile.findUnique({
            where: {userId: clerkUser.id},
        });

        if (!profile) {
            return NextResponse.json({error: "Profile not found."}, { status: 404 });
        }


        if (!profile.stripesubscriptionId) {
            return NextResponse.json({error: "No active subscription found."}, { status: 404 });
        }

        const subscriptionId = profile.stripesubscriptionId;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionItemId = subscription.items.data[0].id

        if (!subscriptionItemId) {
            return NextResponse.json({error: "No active subscription found."});
        }
       
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            items: [{
                id: subscriptionItemId,
                price: getPriceIDFromType(newPlan),
            }],
            proration_behavior: "create_prorations",
        });
       
       await prisma.profile.update({
            where: {userId: clerkUser.id},
            data: {
                subscriptionTire: newPlan,
                stripesubscriptionId: updatedSubscription.id,
                subscriptionActive: true,
            },
        });
       
        return NextResponse.json({subscription: updatedSubscription});



    } catch (error:any) {
        return NextResponse.json({error: "Internal error."}, { status: 500 });
    }

}