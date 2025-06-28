import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prisma  from "@/lib/prisma"; 

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;
    
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature || "",
            webhookSecret || ""
        );
    } catch (error : any) { 
        return NextResponse.json({error: error.message}, { status: 400 });
    }


    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session)
                break;
            }

            case "invoice.payment_failed": {
                const session = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentFailed(session)
                break;
            }

            case "customer.subscription.deleted": {
                const session = event.data.object as Stripe.Subscription;
                await handleCustomerSubscriptionDeleted(session)
                break;
            }

            default:
                console.warn(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        return NextResponse.json({error : error.message}, { status: 400 });
    }

    return NextResponse.json({});
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.clerkUserId;
    if(!userId){
        console.warn("No userId found in session")
        return;
    }

    const subscriptionId = session.subscription as string;
    if(!subscriptionId) {
        console.warn("No subscriptionId found in session")
        return;
    }


    try{
        await prisma.profile.update({
            where: {userId},
            data: {
                stripesubscriptionId: subscriptionId,
                subscriptionActive: true,
                subscriptionTier: session.metadata?.planType || null,
            }

        })
    } catch (error: any) {
        console.log(error.message);
    }
    
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subId = invoice.subscription as string;
    if(!subId) {
        console.warn("No subscriptionId found in invoice");
        return;
    }

    let userId: string | undefined;
    try {
        const profile = await prisma.profile.findUnique({
            where: {stripesubscriptionId: subId},
            select: {userId: true}
        })

        if(!profile?.userId) {
            console.warn("No profile found");
            return;
        }

        userId = profile.userId;

    } catch (error: any) {
        console.warn("Error retrieving subscription:", error.message);
        return;
    }

    try {
        await prisma.profile.update({
            where: {userId: userId},
            data: {
                subscriptionActive: false,
            }
    })
    } catch (error: any) {
        console.warn("Error updating profile:", error.message);
    }

}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {

    const subId = subscription.id;

    let userId: string | undefined;
    try {
        const profile = await prisma.profile.findUnique({
            where: {stripesubscriptionId: subId},
            select: {userId: true}
        })

        if(!profile?.userId) {
            console.warn("No profile found");
            return;
        }

        userId = profile.userId;

    } catch (error: any) {
        console.warn("Error retrieving subscription:", error.message);
        return;
    }

    try {
        await prisma.profile.update({
            where: {userId: userId},
            data: {
                subscriptionActive: false,
                stripesubscriptionId: null,
                subscriptionTier: null,
            }
    })
    } catch (error: any) {
        console.warn("Error updating profile:", error.message);
    }
}