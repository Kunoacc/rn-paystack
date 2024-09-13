# react-native-paystack

This is a react native library for paystack that supports more recent conventions around how payments are handled via paystack on react native applications on both iOS and Android.

## Installation

```sh
npm install rn-pstack
```

## Usage

### PayWithPaystackCheckout

#### 1. Import the component

First, import the `PayWithPaystackCheckout` component from the library:

```js
import { PayWithPaystackCheckout } from 'rn-pstack';
```

#### 2. Set up the component

Use the `PayWithPaystackCheckout` component in your React Native app:

```jsx
<PayWithPaystackCheckout
  checkoutUrl="https://checkout.paystack.com/your-unique-checkout-url"
  onSuccess={(reference) => console.log('Payment successful:', reference)}
  onCancel={() => console.log('Payment cancelled')}
  onError={(error) => console.log('Payment error:', error)}
  activityIndicatorColor="#000000"
/>
```

#### 3. Props

- `checkoutUrl` (required): The unique Paystack checkout URL for the transaction.
- `onSuccess` (required): Callback function called when the payment is successful. It receives the transaction reference as a parameter.
- `onCancel` (required): Callback function called when the user cancels the payment.
- `onError` (required): Callback function called when an error occurs during the payment process.
- `activityIndicatorColor` (optional): Color of the loading indicator. Default is system color.
- `containerStyle` (optional): Style object for the container view.
- `webViewStyle` (optional): Style object for the WebView.

#### 4. Handling responses

The component will automatically handle the payment flow and call the appropriate callback function based on the transaction result.

- On successful payment, `onSuccess` will be called with the transaction reference.
- If the user cancels the payment, `onCancel` will be called.
- If an error occurs during the payment process, `onError` will be called with an error message.

#### 5. Customization

You can customize the appearance of the component using the `containerStyle` and `webViewStyle` props:

```jsx
<PayWithPaystackCheckout
  checkoutUrl="https://checkout.paystack.com/your-unique-checkout-url"
  onSuccess={(reference) => console.log('Payment successful:', reference)}
  onCancel={() => console.log('Payment cancelled')}
  onError={(error) => console.log('Payment error:', error)}
  containerStyle={{ backgroundColor: '#f0f0f0' }}
  webViewStyle={{ borderRadius: 10 }}
/>
```

### 2. PayWithPaystackInline

#### Import the component

```js
import { PayWithPaystackInline } from 'rn-pstack';
```

#### Use the component

```jsx
<PayWithPaystackInline
  paystackKey="your-paystack-public-key"
  billingEmail="customer@example.com"
  amount="10000"
  onSuccess={(reference) => console.log('Payment successful:', reference)}
  onCancel={() => console.log('Payment cancelled')}
  onError={(error) => console.log('Payment error:', error)}
  activityIndicatorColor="#000000"
/>
```

#### Props

- `paystackKey` (required): Your Paystack public key.
- `billingEmail` (required): The customer's email address.
- `amount` (required): The amount to be paid (in the smallest currency unit, e.g., kobo for NGN).
- `onSuccess` (required): Callback function called when the payment is successful. It receives the transaction reference as a parameter.
- `onCancel` (required): Callback function called when the user cancels the payment.
- `onError` (required): Callback function called when an error occurs during the payment process.
- `activityIndicatorColor` (optional): Color of the loading indicator. Default is system color.
- `containerStyle` (optional): Style object for the container view.
- `webViewStyle` (optional): Style object for the WebView.
- `currency` (optional): The transaction currency (default: NGN).
- `channels` (optional): Payment channels to enable.
- `refNumber` (optional): Unique transaction reference.
- `firstName` (optional): Customer's first name.
- `lastName` (optional): Customer's last name.
- `phone` (optional): Customer's phone number.
- `billingName` (optional): Customer's billing name.
- `subaccount` (optional): The subaccount to split the payment with.

This component provides an inline payment form for Paystack transactions, allowing for a more customized payment experience within your React Native app.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
