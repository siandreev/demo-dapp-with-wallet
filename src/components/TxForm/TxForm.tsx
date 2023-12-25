import React, {useCallback, useEffect, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Address, beginCell, JettonMaster, JettonWallet, toNano, TonClient} from 'ton';


const client=  new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
	apiKey: '7811f84d0075fd1a99e602153e4358d2ac97055b475526de45bc5f6fa7001e06'
});

async function packJettonBoc({ jetton, from, to, amount }: {jetton: string, from: string, to: string, amount: number | bigint}): Promise<{  payload: string, address: string; amount: string}> {
	const jettonMaster = client.open(JettonMaster.create(Address.parse(jetton)));
	const walletAddressFrom = await jettonMaster.getWalletAddress(Address.parse(from));

	const jettonTransfer = beginCell()
		.storeUint(0xf8a7ea5, 32) // request_transfer op
		.storeUint(0, 64)
		.storeCoins(amount)
		.storeAddress(Address.parse(to))
		.storeAddress(Address.parse(from))
		.storeBit(false) // null custom_payload
		.storeCoins(toNano('0.01'))
		.storeBit(false) // forward_payload in this slice, not separate cell
		.endCell();

	return {
		payload: jettonTransfer.toBoc().toString('base64'),
		address: walletAddressFrom.toRawString(),
		amount: '70000000'
	};
}

// @ts-ignore
window.packJettonBoc = packJettonBoc;
console.log(
	"Вот так можно создать данные транзакции трансфера жетонов:",
`
packJettonBoc({ 
	jetton: "<JETTON_MASTER_ADDRESS>",
	from: "<FROM_TON_WALLET_ADDRESS>", 
	to: "<TO_TON_WALLET_ADDRESS>",
	amount: <AMOUNT_IN_NANO_JETTONS>" })
.then(console.log);
`)
// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
	// The transaction is valid for 10 minutes from now, in unix epoch seconds.
	validUntil: Math.floor(Date.now() / 1000) + 600,
	messages: [

		{
			// The receiver's address.
			address: '0:8a5a9c7b70d329be670de4e6cce652d464765114aa98038c66c3d8ceaf2d19b0',
			// Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
			amount: '5000000',
			// (optional) State initialization in boc base64 format.
			stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
			// (optional) Payload in boc base64 format.
			payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
		},

		// Uncomment the following message to send two messages in one transaction.
		/*
    {
      // Note: Funds sent to this address will not be returned back to the sender.
      address: '0:2ecf5e47d591eb67fa6c56b02b6bb1de6a530855e16ad3082eaa59859e8d5fdc',
      amount: toNano('0.01').toString(),
    }
    */

	],
};

export function TxForm() {
	const [tx, setTx] = useState(defaultTx);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();

	const onChange = useCallback((value: object) => setTx((value as { updated_src: typeof defaultTx }).updated_src), []);

	useEffect(() => {
		if (!wallet?.account.address) {
			setTx(defaultTx);
		} else {
			const makeTx = async () => {
				const receiver = 'EQD2NmD_lH5f5u1Kj3KfGyTvhZSX0Eg6qp2a5IQUKXxOG21n';
				const txses = await Promise.all([
						packJettonBoc({
							jetton: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA', // jUSD
							from: wallet.account.address,
							to: receiver,
							amount: 10000
						}),
						packJettonBoc({
							jetton: 'EQDcBkGHmC4pTf34x3Gm05XvepO5w60DNxZ-XT4I6-UGG5L5',  // jWBTC
							from: wallet.account.address,
							to: receiver,
							amount: 1
						})
					]
				);

				setTx({
					validUntil: Math.floor(Date.now() / 1000) + 600,
					messages: [
						{
							address: receiver,
							amount: '10000000'
						},
						...txses
					]

				})
			}
			makeTx();
		}
	}, [wallet?.account.address]);

	return (
		<div className="send-tx-form">
			<h3>Configure and send transaction</h3>
			<ReactJson src={tx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
			{wallet ? (
				<button onClick={() => tonConnectUi.sendTransaction(tx)}>
					Send transaction
				</button>
			) : (
				<button onClick={() => tonConnectUi.openModal()}>Connect wallet to send the transaction</button>
			)}
		</div>
	);
}
