import { Program, Wallet, web3 } from "@coral-xyz/anchor";
import * as anchor from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { lookupTable, MINT_AUTHORITY_SEED, PROGRAM_ID } from './lib/constants';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  Ed25519Program,
  BlockTimestamp
} from '@solana/web3.js';

import { IDL } from '../target/types/shiba_token';
import { createGenerateTx, createInistializeTx, createLookupTableTx, createRegisterSecondReferralTx, createSetFoundationTx, createSetTreausuryTx, createTransferMintAuthorityTx, createUnlockTx, createUpdateBlacklistTx, createUpdateMultiplierTx, createUpdatePercentageTx, createUpdateReferralTx, extendLookupTableTx, getMessage, getSignature } from "./lib/scripts";
import { execute } from "./lib/excutor";
import nacl from "tweetnacl";

interface ISetConnectionParams {
  cluster: web3.Cluster; // env from CLI global params
  wallet: NodeWallet | Wallet; // needs to be both for TS & CLI differences
  signerKeypair: Keypair;
  rpc?: string;
  fm?: number;
}

let connection: Connection = null;
let program: Program = null;
let provider: anchor.Provider = null;
let payer: NodeWallet | Wallet = null;
let feeMultiplier: number = 1;
let programId = new anchor.web3.PublicKey(PROGRAM_ID);
let signer: Keypair;


export const setConnection = async ({
  cluster,
  wallet,
  signerKeypair,
  rpc,
  fm,
}: ISetConnectionParams) => {
  console.log('Solana Cluster:', cluster);
  console.log('RPC URL:', rpc);
  console.log('Fee Multiplier:', fm);

  if (!rpc) {
    connection = new web3.Connection(web3.clusterApiUrl(cluster));
  } else {
    connection = new web3.Connection(rpc);
  }

  // Configure the client to use the local cluster.
  anchor.setProvider(
    new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      commitment: 'confirmed',
    })
  );
  payer = wallet;
  signer = signerKeypair;

  provider = anchor.getProvider();
  console.log('Wallet Address: ', wallet.publicKey.toBase58());

  // Generate the program client from IDL.
  program = new anchor.Program(IDL as anchor.Idl, programId);
  console.log('ProgramId: ', program.programId.toBase58());

  if (fm) {
    feeMultiplier = fm;
    console.log('Fee Multiplier: ', fm);
  }
};

export const getGasIxs = () => {
  if (feeMultiplier === 1) return [];

  const updateCpIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: Math.floor(5_000_000 * feeMultiplier),
  });
  const updateCuIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.floor(200_000 * feeMultiplier),
  });
  return [updateCpIx, updateCuIx];
};

export const createLookupTable = async (
  admin: PublicKey
) => {
  try {
    const [lookupTableInstruction, lookupTableAddress] = await createLookupTableTx(admin, admin, connection);
    const tx = new Transaction().add(
      lookupTableInstruction as any,
      await extendLookupTableTx(admin, admin, lookupTableAddress as any, program)
    )

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);

  } catch (env) {
    console.log(env)
  }
}

export const initPro = async (
  admin: PublicKey, treasury: PublicKey, foundation: PublicKey
) => {
  try {
    const tx = new Transaction().add(
      await createInistializeTx(admin, treasury, foundation, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const transferAuthority = async (newAuthority: PublicKey) => {
  try {
    const tx = new Transaction().add(
      await createTransferMintAuthorityTx(newAuthority, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const generate = async (
  referral: PublicKey,
  lamportAmount: number,
  ctnmUsdPriceOracle: number,
  ctnmUsdPricePool: number,
  deadline: number,
  slippage: number
) => {
  try {
    const messageHash = await getMessage(deadline, ctnmUsdPriceOracle, payer.publicKey, program);
    const signature = nacl.sign.detached(messageHash, signer.secretKey);

    const lookupTableAccount = await connection.getAddressLookupTable(lookupTable);
    const lookupTableAccounts = lookupTableAccount.value.state.addresses;
    console.log("🚀 ~ generate ~ lookupTableAccounts:", lookupTableAccounts)

    const recentBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: recentBlockhash.blockhash,
      instructions: [
        await createGenerateTx(
          referral,
          lamportAmount,
          ctnmUsdPriceOracle,
          ctnmUsdPricePool,
          deadline,
          slippage,
          signature,
          payer.publicKey,
          program)
      ]
    }).compileToV0Message([lookupTableAccount.value])

    const tx = new VersionedTransaction(messageV0);
    console.log("🚀 ~ generate ~ signer:", signer)
    tx.sign([signer]);
    const txSig = await execute(tx, recentBlockhash);

    // const txId = await connection.sendRawTransaction(tx.serialize(), {
    //   preflightCommitment: "confirmed",
    //   skipPreflight: true
    // });

    console.log('txHash: ', txSig);
  } catch (e) {
    console.log(e)
  }
}

export const registerSecondReferral = async (mainReferral: PublicKey) => {
  try {
    const tx = new Transaction().add(
      await createRegisterSecondReferralTx(mainReferral, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const setFoundation = async (foundation: PublicKey) => {
  try {
    const tx = new Transaction().add(
      await createSetFoundationTx(foundation, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const setTreasury = async (treasury: PublicKey) => {
  try {
    const tx = new Transaction().add(
      await createSetTreausuryTx(treasury, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const unlock = async (index: number) => {
  try {
    const tx = new Transaction().add(
      await createUnlockTx(index, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const updateBlacklist = async (isBlacklist: boolean, address: PublicKey) => {
  try {
    const tx = new Transaction().add(
      await createUpdateBlacklistTx(isBlacklist, address, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const updateMultiplier = async (multiplier12: number, multiplier6: number, multiplier3: number) => {
  try {
    const tx = new Transaction().add(
      await createUpdateMultiplierTx(multiplier12, multiplier6, multiplier3, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}


export const updatePercentage = async (liqP: number, mainReferralP: number, secondReferralP: number, treasuryP: number, foundationP: number) => {
  try {
    const tx = new Transaction().add(
      await createUpdatePercentageTx(liqP, mainReferralP, secondReferralP, treasuryP, foundationP, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const updateReferral = async (referral: PublicKey, isMainReferral: boolean) => {
  try {
    const tx = new Transaction().add(
      await createUpdateReferralTx(referral, isMainReferral, payer.publicKey, program)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;

    payer.signTransaction(tx);

    const txId = await provider.sendAndConfirm(tx, [], {
      commitment: 'confirmed',
    })

    console.log('==> txHash: ', txId);
  } catch (e) {
    console.log(e)
  }
}

export const getMintAuthority = async () => {
  const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from(MINT_AUTHORITY_SEED)], programId);
  return mintAuthority;
}




