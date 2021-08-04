import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk,
    );
  }

  return Buffer.concat(chunks);
}

// Para desabilitar o entendimento padrão do next, do que está vindo da requisição.
// Por padrão vem como JSON, mas aqui queremos que seja uma String por conta o Stream do Stripe
// https://nextjs.org/docs/api-routes/api-middlewares
// bodyParser Enables body parsing, you can disable it if you want to consume it as a Stream:
export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
    return;
  }
  const buf = await buffer(req);
  const secret = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    res.status(400).send(`WEBHOOK ERROR: ${error.message}`);
    return;
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    console.log('EVENTO: ', event);
    try {
      switch (type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const { id, customer } = event.data.object as Stripe.Subscription;
          await saveSubscription(
            id,
            customer.toString(),
          );
        }
          break;
        case 'checkout.session.completed': {
          const { subscription, customer } = event.data.object as Stripe.Checkout.Session;
          await saveSubscription(
            subscription.toString(),
            customer.toString(),
            true,
          );
        }
          break;
        default:
          throw new Error('Unhandled event.');
      }
    } catch (error) {
      res.json({ error: 'Webhook handler failed.' });
      return;
    }
  }

  res.json({ received: true });
};
