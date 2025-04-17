import Stripe from 'stripe';
import CardPurchase from '../Models/card-purchase-model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function createPaymentIntent(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { amount, paymentMethodType = 'card', cardPackId } = req.body;

    let paymentMethodTypes = ['card'];
    if (paymentMethodType === 'apple_pay') {
      paymentMethodTypes = ['card', 'apple_pay'];
    } else if (paymentMethodType === 'us_bank_account') {
      paymentMethodTypes = ['us_bank_account'];
    }

    const paymentIntentParams = {
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: paymentMethodTypes,
      metadata: {
        userId,
        cardPackId,
      },
    };

    // For ACH payments, we need to add additional parameters
    if (paymentMethodType === 'us_bank_account') {
      paymentIntentParams.payment_method_options = {
        us_bank_account: {
          verification_method: 'instant',
        },
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    const savePurchase = new CardPurchase({
      userId: userId,
      cardPackId: cardPackId,
      amount: paymentIntent.amount / 100,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      paymentMethod: paymentMethodType,
    });

    await savePurchase.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentMethodTypes: paymentMethodTypes,
      recordSave: savePurchase
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}