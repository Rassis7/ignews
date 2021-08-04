import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  stripeCustomerId: string,
  createAction = false,
) {
  // Buscar o usuário no FaunaDB com o stripeCustomerId
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          stripeCustomerId,
        ),
      ),
    ),
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  // Salvar os dados da subscription no FaunaDB
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData },
      ),
    );
    return;
  }

  await fauna.query(
    q.Replace(
      q.Select(
        'ref',
        q.Get(
          q.Match(
            q.Index('subscription_by_id'),
            subscriptionId,
          ),
        ),
      ),
      { data: subscriptionData },
    ),
  );
}
