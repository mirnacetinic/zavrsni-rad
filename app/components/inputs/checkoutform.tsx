import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  email: string;
  unit: string;
  price: number;
  image?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, onSuccess, email, unit, price, image }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const sendConfirmation = async () => {
    const message = `
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for your payment of €${price} for your reservation at ${unit}.</p>
      <p>We are pleased to confirm your booking. Below are the details:</p>
      <ul>
        <li><strong>Unit:</strong> ${unit}</li>
        <li><strong>Amount Paid:</strong> €${price}</li>
      </ul>
      <p>We look forward to your stay with us!</p>
      <p>Best regards,<br/>Your StayAway</p>
    `;

    try {
      const response = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject: 'Payment Confirmation', message }),
      });

      if (response.ok) {
        toast.success('Confirmation email sent');
      } else {
        toast.error('Failed to send confirmation email');
      }
    } catch (error) {
      toast.error('An error occurred while sending the confirmation email');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const cardholderName = `${firstName} ${lastName}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: cardholderName,
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'An error occurred.');
      setIsLoading(false);
    } else {
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            toast.success('Payment succeeded!');
            await sendConfirmation(); 
            onSuccess(paymentIntent.id);
            break;
          case 'processing':
            toast('Your payment is processing.');
            break;
          case 'requires_payment_method':
            toast.error('Your payment was not successful, please try again.');
            break;
          default:
            toast.error('Something went wrong.');
            break;
        }
      } else {
        toast.error('Something went wrong.');
      }
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" className="p-4 mt-4 flex flex-col justify-center" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="first-name"
          name="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="last-name"
          name="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <PaymentElement id="payment-element" options={{ layout: 'auto' }} />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="form_button mt-4">
        <span id="button-text">
          {isLoading ? 'Loading...' : 'Pay now'}
        </span>
      </button>
    </form>
  );
};

export default CheckoutForm;
