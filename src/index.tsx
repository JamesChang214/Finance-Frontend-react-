import React from 'react';
import ReactDOM from 'react-dom';
import {
  NetworkInfo,
  WalletProvider,
  WalletStatus,
} from '@terra-money/wallet-provider';
import { Provider } from 'react-redux';
import './index.css';
import { CookiesProvider } from 'react-cookie';
import App from './app/App';
import * as serviceWorker from './server/serviceWorker';
import configureStore from './app/redux/configureStore';

const store = configureStore();

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
};

ReactDOM.render(
  <WalletProvider
    defaultNetwork={testnet}
    walletConnectChainIds={walletConnectChainIds}
  >
    <CookiesProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CookiesProvider>
  </WalletProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
