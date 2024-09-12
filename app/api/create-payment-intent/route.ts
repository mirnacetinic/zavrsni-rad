import getUser from '@/app/actions/getUser';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if(process.env.STRIPE_SECRET_KEY === undefined) throw new Error("Stripe secret undifined!");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
    apiVersion: '2024-04-10'
});

export async function POST(req:Request) {
    const user = await getUser();
    if(!user) return NextResponse.json(null, { status:401, headers : { message:'Unauthorised'}})
    const body = await req.json();
    const { price } = body;
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount : parseFloat(price) * 100,
        currency : 'eur',
        automatic_payment_methods : {enabled:true},
        setup_future_usage: 'off_session'     
    })

    if(paymentIntent) return NextResponse.json(paymentIntent);

    return NextResponse.json(null);

}