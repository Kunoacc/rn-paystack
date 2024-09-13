// PayWithPaystackInline.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { PayWithPaystackInlineProps } from '../interfaces';

const PayWithPaystackInline: React.FC<PayWithPaystackInlineProps> = ({
  paystackKey,
  billingEmail,
  amount,
  currency = 'NGN',
  channels = ['card'],
  refNumber,
  firstName,
  lastName,
  phone,
  billingName,
  subaccount,
  onSuccess,
  onCancel,
  onError,
  activityIndicatorColor = 'green',
  containerStyle,
  webViewStyle,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const getPaystackContent = () => {
    const refNumberString = refNumber ? `ref: '${refNumber}',` : '';
    const subAccountString = subaccount ? `subaccount: '${subaccount}',` : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paystack Inline</title>
        </head>
        <body onload="payWithPaystack()" style="background-color:#fff;height:100vh">
          <script src="https://js.paystack.co/v2/inline.js"></script>
          <script type="text/javascript">
            function payWithPaystack() {
              var paystack = new PaystackPop();
              paystack.newTransaction({
                key: '${paystackKey}',
                email: '${billingEmail}',
                amount: ${parseFloat(amount) * 100},
                currency: '${currency}',
                channels: ${JSON.stringify(channels)},
                ${refNumberString}
                ${subAccountString}
                firstname: '${firstName || ''}',
                lastname: '${lastName || ''}',
                phone: '${phone || ''}',
                metadata: {
                  custom_fields: [
                    {
                      display_name: '${firstName || ''} ${lastName || ''}',
                      variable_name: '${billingName || ''}',
                      value: ''
                    }
                  ]
                },
                onSuccess: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({status: 'success', reference: response.reference}));
                },
                onCancel: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({status: 'cancelled'}));
                }
              });
            }
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.status === 'success') {
        onSuccess(data.reference);
      } else if (data.status === 'cancelled') {
        onCancel();
      } else {
        onError('An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      onError('Failed to process payment response');
    }
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <WebView
        source={{ html: getPaystackContent() }}
        style={[styles.webView, webViewStyle]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onMessage={handleMessage}
        ref={webViewRef}
      />
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activityIndicatorColor} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PayWithPaystackInline;
