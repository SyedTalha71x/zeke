import Stripe from 'stripe';
import CardPurchase from '../Models/card-purchase-model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function createPaymentIntent(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.user?.userId
    if(!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { amount, paymentMethodType = 'card', cardPackId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: [paymentMethodType],
      metadata: {
        userId,
        cardPackId,
      },
    });

    const savePurchase = new CardPurchase({
        userId: userId,
        cardPackId:  cardPackId,
      amount: paymentIntent.amount / 100,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    await savePurchase.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      recordSave: savePurchase
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
