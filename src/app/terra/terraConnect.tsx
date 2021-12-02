import React, { useCallback, useState , Component} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useWallet, WalletStatus, useConnectedWallet, TxResult, UserDenied, CreateTxFailed, TxFailed, Timeout, TxUnspecifiedError } from '@terra-money/wallet-provider';
import { MsgSend, StdFee } from '@terra-money/terra.js';
import * as terraActions from '../terra/wallet/terraActions';
import { Grid, Menu, Button, Dropdown, Divider } from 'semantic-ui-react';

interface props {
  terraConnectWallet
}

export function TerraConnect() {

  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const connectedWallet = useConnectedWallet();

  const toAddress = 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9';
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet();

  const postTx = useCallback(() => {
    if (!connectedWallet) {
      return;
    }

    if (!connectedWallet.network.chainID.startsWith('tequila')) {
      alert(`Please only execute this example on Testnet`);
      return;
    }

    setTxResult(null);

    connectedWallet
      .post({
        fee: new StdFee(1000000, '200000uusd'),
        msgs: [
          new MsgSend(connectedWallet.walletAddress, toAddress, {
            uusd: 100000,
          }),
        ],
      })
      .then((nextTxResult: TxResult) => {
        console.log(nextTxResult);
        setTxResult(nextTxResult);
      })
      .catch((error: unknown) => {
        if (error instanceof UserDenied) {
          setTxError('User Denied');
        } else if (error instanceof CreateTxFailed) {
          setTxError('Create Tx Failed: ' + error.message);
        } else if (error instanceof TxFailed) {
          setTxError('Tx Failed: ' + error.message);
        } else if (error instanceof Timeout) {
          setTxError('Timeout');
        } else if (error instanceof TxUnspecifiedError) {
          setTxError('Unspecified Error: ' + error.message);
        } else {
          setTxError(
            'Unknown Error: ' +
              (error instanceof Error ? error.message : String(error)),
          );
        }
      });
  }, [connectedWallet]);

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <Button
              key={'install-' + connectType}
              fluid
              color="green"
              style={{ marginTop: '1rem', minWidth: '250px' }}
              onClick={() => install(connectType)}
              >
                Install {connectType}
            </Button>
          ))}
          {availableConnectTypes.map((connectType) => (
            connectType != 'READONLY' && (
              <Button.Group vertical>
                <Button
                  fluid
                  color="green"
                  style={{ marginTop: '1rem', minWidth: '250px' }}
                  onClick={() => connect(connectType)}
                  >
                    Connect using {connectType == "CHROME_EXTENSION" ? "Chrome Extenstion": "Terra Station"}
                </Button>
              </Button.Group>
            )
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <Button 
          color="green"
          style={{ marginTop: '1rem', minWidth: '250px' }}
          onClick={() => disconnect()}>
            Disconnect Wallet
        </Button>
      )}
      <section>
        <pre>
          <b>DEBUG</b>
          <br />
          <small>
            {JSON.stringify(
              {
                status,
                network,
                wallets,
                availableConnectTypes,
                availableInstallTypes,
              },
              null,
              2,
            )}
          </small>
        </pre>
      </section>
    </div>
  );
}


export default withRouter(connect(
  (state) => {
    const acctName = 'test';
    return {
      acctName,
    };
  },
  dispatch => ({
    terraConnectWallet: () => {
      dispatch(terraActions.terraConnectRoutine());
    },
  })
)(TerraConnect));