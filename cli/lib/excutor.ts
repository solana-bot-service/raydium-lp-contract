import { Connection, VersionedTransaction } from "@solana/web3.js";
import { connection, RPC_URL_DEVNET } from "./constants";


interface Blockhash {
  blockhash: string;
  lastValidBlockHeight: number;
}

export const execute = async (transaction: VersionedTransaction, latestBlockhash: Blockhash, isBuy: boolean = true) => {

  const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true });
  console.log("!!!!!!!!!!!!", signature);
  const confirmation = await connection.confirmTransaction(
    {
      signature,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      blockhash: latestBlockhash.blockhash,
    }
  );

  if (confirmation.value.err) {
    console.log("Confrimtaion error", confirmation.value.err)
    return ""
  } else {
    if (isBuy)
      console.log(`Success in buy transaction: https://solscan.io/tx/${signature}`)
    else
      console.log(`Success in Sell transaction: https://solscan.io/tx/${signature}`)
  }
  return signature
}
