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

        const canceledSubscription = await stripe.subscriptions.update(
            subscriptionId, 
        {
            cancel_at_period_end: true,
        });

        await prisma.profile.update({
            where: {userId: clerkUser.id},
            data: {
                subscriptionTire: null,
                stripesubscriptionId: null,
                subscriptionActive: false,
            },
        });

        return NextResponse.json({subscription: canceledSubscription});

    } catch (error:any) {
        return NextResponse.json({error: "Internal error."}, { status: 500 });
    }

}