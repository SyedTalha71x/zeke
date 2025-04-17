import Stripe from 'stripe';
import CardPurchase from '../Models/card-purchase-model.js';
import { buffer } from 'micro';
import connectToDB from '../Utils/db.js';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await connectToDB();

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      const metadata = paymentIntent.metadata;
      const userId = metadata?.userId;
      const cardPackId = metadata?.cardPackId;

      try {
        await CardPurchase.create({
          userId,
          cardPackId,
          amount: paymentIntent.amount / 100,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        });

        console.log('Card purchase saved.');
      } catch (err) {
        console.error('Failed to save card purchase:', err);
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
