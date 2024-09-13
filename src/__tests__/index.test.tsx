import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PayWithPaystackCheckout from '../components/PayWithPaystackCheckout';
import PayWithPaystackInline from '../components/PayWithPaystackInline';

// Mock WebView
jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  const MockWebView = (props: any) => {
    return <View {...props} testID="mock-webview" />;
  };
  return { WebView: MockWebView };
});

describe('PayWithPaystackCheckout', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <PayWithPaystackCheckout
        checkoutUrl="https://checkout.paystack.com/test"
        onSuccess={() => {}}
        onCancel={() => {}}
        onError={() => {}}
      />
    );
    expect(getByTestId('mock-webview')).toBeTruthy();
  });

  it('calls onSuccess when transaction is successful', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackCheckout
        checkoutUrl="https://checkout.paystack.com/test"
        onSuccess={onSuccess}
        onCancel={() => {}}
        onError={() => {}}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({
          type: 'transaction',
          data: { success: true, reference: 'test-ref' },
        }),
      },
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('test-ref');
    });
  });

  it('calls onCancel when close event is received', async () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackCheckout
        checkoutUrl="https://checkout.paystack.com/test"
        onSuccess={() => {}}
        onCancel={onCancel}
        onError={() => {}}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({ type: 'close' }),
      },
    });

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('calls onError when transaction fails', async () => {
    const onError = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackCheckout
        checkoutUrl="https://checkout.paystack.com/test"
        onSuccess={() => {}}
        onCancel={() => {}}
        onError={onError}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({
          type: 'transaction',
          data: { success: false, errors: 1 },
        }),
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Transaction failed with 1 errors');
    });
  });
});

describe('PayWithPaystackInline', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <PayWithPaystackInline
        paystackKey="test-key"
        billingEmail="test@example.com"
        amount="1000"
        onSuccess={() => {}}
        onCancel={() => {}}
        onError={() => {}}
      />
    );
    expect(getByTestId('mock-webview')).toBeTruthy();
  });

  it('calls onSuccess when transaction is successful', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackInline
        paystackKey="test-key"
        billingEmail="test@example.com"
        amount="1000"
        onSuccess={onSuccess}
        onCancel={() => {}}
        onError={() => {}}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({ status: 'success', reference: 'test-ref' }),
      },
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('test-ref');
    });
  });

  it('calls onCancel when transaction is cancelled', async () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackInline
        paystackKey="test-key"
        billingEmail="test@example.com"
        amount="1000"
        onSuccess={() => {}}
        onCancel={onCancel}
        onError={() => {}}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({ status: 'cancelled' }),
      },
    });

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('calls onError when an unexpected error occurs', async () => {
    const onError = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackInline
        paystackKey="test-key"
        billingEmail="test@example.com"
        amount="1000"
        onSuccess={() => {}}
        onCancel={() => {}}
        onError={onError}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: JSON.stringify({ status: 'error' }),
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });

  it('handles malformed JSON in onMessage', async () => {
    const onError = jest.fn();
    const { getByTestId } = render(
      <PayWithPaystackInline
        paystackKey="test-key"
        billingEmail="test@example.com"
        amount="1000"
        onSuccess={() => {}}
        onCancel={() => {}}
        onError={onError}
      />
    );

    const webView = getByTestId('mock-webview');
    fireEvent(webView, 'message', {
      nativeEvent: {
        data: 'invalid json',
      },
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        'Failed to process payment response'
      );
    });
  });
});
