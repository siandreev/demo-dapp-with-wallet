import './App.scss'
import {THEME, TonConnect, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";

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
            <TxForm />
            {/*<TonProofDemo />*/}
            <Footer />
        </div>
      </TonConnectUIProvider>
  )
}

export default App
