export interface PaystackBaseProps {
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
  activityIndicatorColor?: string;
  containerStyle?: object;
  webViewStyle?: object;
}

export interface PayWithPaystackCheckoutProps extends PaystackBaseProps {
  checkoutUrl: string;
}

export interface PayWithPaystackInlineProps extends PaystackBaseProps {
  paystackKey: string;
  billingEmail: string;
  amount: string;
  currency?: string;
  channels?: string[];
  refNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  billingName?: string;
  subaccount?: string;
}

export interface TransactionData {
  success: boolean;
  reference?: string;
  errors?: number;
}
