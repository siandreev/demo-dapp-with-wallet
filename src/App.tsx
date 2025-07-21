import './App.scss'
import {THEME, TonConnect, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";

const connector = new TonConnect({ manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json', walletsListSource: 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/tonkeeper-deeplink/wallets-v2.json' });

function App() {
  return (
      <TonConnectUIProvider
          connector={connector}
          uiPreferences={{ theme: THEME.DARK }}
          actionsConfiguration={{
              twaReturnUrl: 'https://t.me/tc_twa_demo_bot/start'
          }}
      >
        <div className="app">
            <Header />
            <a href="https://app.tonkeeper.com/transfer/UQDNzlh0XSZdb5_Qrlx5QjyZHVAO74v5oMeVVrtF_5Vt1rIt">Test transfer link with address</a>
            <a href="https://app.tonkeeper.com/transfer/EQD2NmD_lH5f5u1Kj3KfGyTvhZSX0Eg6qp2a5IQUKXxOG21n?jetton=EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs&amount=200000">Test full transfer link</a>
            <TxForm />
            {/*<TonProofDemo />*/}
            <Footer />
        </div>
      </TonConnectUIProvider>
  )
}

export default App
