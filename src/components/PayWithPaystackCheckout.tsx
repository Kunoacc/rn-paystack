import React, { useRef, useState } from 'react';
import type {
  PayWithPaystackCheckoutProps,
  TransactionData,
} from '../interfaces';
import WebView from 'react-native-webview';
import type {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

const PAYSTACK_TRANSACTION_STATUS_API_URL = 'https://api.paystack.co';
const PAYSTACK_CLOSE_URL = 'https://standard.paystack.co/close';

const PayWithPaystackCheckout: React.FC<PayWithPaystackCheckoutProps> = ({
  checkoutUrl,
  onSuccess,
  onCancel,
  onError,
  activityIndicatorColor,
  containerStyle,
  webViewStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = useRef<WebView>(null);

  const injectedJavaScript = `
    (function() {
      function interceptRequests(originalFunction) {
        return function(...args) {
          return originalFunction.apply(this, args).then(async (response) => {
            const clone = response.clone();
            const url = clone.url;
            if (url.includes('${PAYSTACK_TRANSACTION_STATUS_API_URL}')) {
              const json = await clone.json();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'transaction',
                data: json
              }));
            }
            return response;
          });
        };
      }

      window.fetch = interceptRequests(window.fetch);
      
      const originalXHROpen = window.XMLHttpRequest.prototype.open;
      window.XMLHttpRequest.prototype.open = function(...args) {
        this.addEventListener('load', function() {
          if (this.responseURL.includes('${PAYSTACK_TRANSACTION_STATUS_API_URL}')) {
            try {
              const json = JSON.parse(this.responseText);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'transaction',
                data: json
              }));
            } catch (e) {
              console.error('Error parsing XHR response:', e);
            }
          }
        });
        originalXHROpen.apply(this, args);
      };

      window.addEventListener('popstate', function(event) {
        if (event.state && event.state.is_popup_close) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'close' }));
        }
      });
    })();
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const { type, data } = JSON.parse(event.nativeEvent.data);
      if (type === 'transaction') {
        handleTransaction(data as TransactionData);
      } else if (type === 'close') {
        onCancel();
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleTransaction = (transactionData: TransactionData) => {
    if (transactionData.success) {
      onSuccess(transactionData.reference || '');
    } else if (transactionData.errors && transactionData.errors > 0) {
      onError(`Transaction failed with ${transactionData.errors} errors`);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url.includes(PAYSTACK_CLOSE_URL)) {
      onCancel();
    }
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <WebView
        ref={webviewRef}
        source={{ uri: checkoutUrl }}
        style={[styles.webView, webViewStyle]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
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

export default PayWithPaystackCheckout;
