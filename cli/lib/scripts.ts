import * as anchor from '@coral-xyz/anchor';
import {
  PublicKey,
  Connection,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  AddressLookupTableProgram,
} from '@solana/web3.js';
import { ammProgram, BLACK_LIST_SEED, CONFIG_SEED, connection, feeDestination, lookupTable, MARKET_ID, marketProgram, MINT_AUTHORITY_SEED, SHIBA_TOKEN_MINT, POOL_INFO_SEED, POOL_SEED, REFERRAL_SEED, USER_SEED, WSOL } from './constants';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync
} from '@solana/spl-token';
import { ConfigAccount, PoolInfo, ReferralAccount } from './types';
import { PoolKeys } from './get-pool-key';
import nacl from "tweetnacl";
import { keccak_256 } from "js-sha3";

export const createInistializeTx = async (
  admin: PublicKey,
  treasury: PublicKey,
  foundation: PublicKey,
  program: anchor.Program
) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ configAccount:", configAccount)
  const infoPool = getInfoPool(program.programId);
  console.log("🚀 ~ infoPool:", infoPool)
  const mintAuthority = getMintAuthority(program.programId);
  console.log("🚀 ~ mintAuthority:", mintAuthority)

  const ix = await program.methods
    .initialize(treasury, foundation)
    .accounts({
      admin,
      configAccount,
      mintAuthority,
      poolInfo: infoPool,
      wsolMint: WSOL,
      numTokenMint: SHIBA_TOKEN_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY
    }).instruction();

  return ix;
}

export const createLookupTableTx = async (
  authority: PublicKey, payer: PublicKey, connection: Connection
) => {
  const recentSlot = await connection.getSlot();
  const [lookupTableInstruction, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    authority,
    payer,
    recentSlot
  });

  console.log("🚀 ~ createLookupTableTx ~ lookupTableAddress:", lookupTableAddress)
  return [lookupTableInstruction, lookupTableAddress];
}

export const extendLookupTableTx = async (
  authority: PublicKey, payer: PublicKey, lookupTableAddress: PublicKey, program: anchor.Program
) => {
  const market = MARKET_ID;
  const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT)
  const configAccount = getConfigAccount(program.programId);
  const infoPool = getInfoPool(program.programId);
  const configData = await getConfigData(program);
  const { treasury, foundation } = configData.data;
  const mintAuthority = getMintAuthority(program.programId);
  const accountAddresses = [
    poolKeys.authority,
    poolKeys.baseMint,
    poolKeys.baseVault,
    poolKeys.quoteMint,
    poolKeys.quoteVault,
    poolKeys.lpMint,
    poolKeys.lpVault,
    poolKeys.configId,
    poolKeys.marketAuthority,
    poolKeys.marketBaseVault,
    poolKeys.marketBids,
    poolKeys.marketEventQueue,
    poolKeys.id,
    poolKeys.programId,
    poolKeys.openOrders,
    poolKeys.targetOrders,
    poolKeys.withdrawQueue,
    poolKeys.marketProgramId,
    poolKeys.marketAuthority,
    poolKeys.configId,
    market,
    configAccount,
    infoPool,
    treasury,
    foundation,
    mintAuthority,
  ]

  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    lookupTable: lookupTableAddress,
    authority,
    payer,
    addresses: accountAddresses,
  });

  return extendInstruction;
}

export const createGenerateTx = async (
  referral: PublicKey,
  lamportAmount: number,
  ctnmUsdPriceOracle: number,
  ctnmUsdPricePool: number,
  deadline: number,
  slippage: number,
  signature: Uint8Array<ArrayBufferLike>,
  payer: PublicKey,
  program: anchor.Program
) => {
  // const market = await PoolKeys.fetchMarketId(program.provider.connection as any, SHIBA_TOKEN_MINT, WSOL, 'confirmed')
  // console.log("🚀 ~ createGenerateTx ~ market:", market)
  const market = MARKET_ID;
  const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT)
  const numReserve = await program.provider.connection.getTokenAccountBalance(poolKeys.baseVault);
  console.log("🚀 ~ createGenerateTx ~ numReserve:", numReserve)
  const wsolReserve = await program.provider.connection.getTokenAccountBalance(poolKeys.quoteVault);
  console.log("🚀 ~ createGenerateTx ~ wsolReserve:", wsolReserve)

  const tokenRatio = Number(numReserve.value.amount) / Number(wsolReserve.value.amount);
  console.log("🚀 ~ createGenerateTx ~ tokenRatio:", tokenRatio)
  const infoPoolData = await getInfoPoolData(program);
  console.log("🚀 ~ createGenerateTx ~ infoPoolData:", infoPoolData)
  const index = infoPoolData.data.totalCount;
  console.log("🚀 ~ createGenerateTx ~ accountDATA:", infoPoolData.data)
  console.log("🚀 ~ createGenerateTx ~ index:", index)
  // const userPool = getUserPool(to, index, program.programId)
  console.log("🚀 ~ createGenerateTx ~ userPool:", userPool)
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createGenerateTx ~ configAccount:", configAccount)
  const infoPool = getInfoPool(program.programId);
  console.log("🚀 ~ createGenerateTx ~ infoPool:", infoPool)
  const referralAccount = getReferralAccount(referral, program.programId);
  console.log("🚀 ~ createGenerateTx ~ referralAccount:", referralAccount)
  const referralAccountData = await getReferralAccountData(referral, program);
  const mainReferral = referralAccountData.data.referralAddress; // == referral
  console.log("🚀 ~ createGenerateTx ~ mainReferral:", mainReferral)
  const secondReferral = referralAccountData.data.pair;
  console.log("🚀 ~ createGenerateTx ~ secondReferral:", secondReferral)
  const configData = await getConfigData(program);
  console.log("🚀 ~ createGenerateTx ~ configData:", configData)
  const { treasury, foundation } = configData.data;
  console.log("🚀 ~ createGenerateTx ~ { treasury, foundation }:", { treasury, foundation })
  const toTokenVault = getAssociatedTokenAddressSync(SHIBA_TOKEN_MINT, to);
  console.log("🚀 ~ createGenerateTx ~ toTokenVault:", toTokenVault)
  const mintAuthority = getMintAuthority(program.programId);
  console.log("🚀 ~ createGenerateTx ~ mintAuthority:", mintAuthority)
  const userTokenCoin = getAssociatedTokenAddressSync(SHIBA_TOKEN_MINT, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenCoin:", userTokenCoin)
  const userTokenPc = getAssociatedTokenAddressSync(WSOL, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenPc:", userTokenPc)
  const userTokenLp = getAssociatedTokenAddressSync(poolKeys.lpMint, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenLp:", userTokenLp);

  const ix = await program.methods
    .generate(
      new anchor.BN(lamportAmount),
    new anchor.BN(lamportUsdPrice),
    new anchor.BN(ctnmUsdPriceOracle),
    new anchor.BN(ctnmUsdPricePool), 
    new anchor.BN(deadline),
    new anchor.BN(slippage),
    signature)
    .accounts({
      referralAccount,
      toTokenVault,
      userPool,
      configAccount: configAccount,
      poolInfo: infoPool,
      to,
      mainReferral,
      secondReferral,
      wsolMint: WSOL,
      numTokenMint: SHIBA_TOKEN_MINT,
      treasury,
      foundation,
      user: payer,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      //raydium accounts
      ammProgram: ammProgram,
      amm: poolKeys.id,
      ammAuthority: poolKeys.authority,
      ammOpenOrders: poolKeys.openOrders,
      ammLpMint: poolKeys.lpMint,
      ammCoinVault: poolKeys.baseVault,
      ammPcVault: poolKeys.quoteVault,
      ammTargetOrders: poolKeys.targetOrders,
      marketEventQueue: poolKeys.marketEventQueue,
      market,
      userTokenCoin,
      userTokenPc,
      userTokenLp,
    }).instruction();
  return ix;
}

export const getMessage = async (deadline:number, ctnmUsdPriceOracle, payer, program) => {
  const message = Buffer.concat([
    program.programId.toBuffer(),
    SHIBA_TOKEN_MINT.toBuffer(),
    Buffer.from(Uint8Array.of(deadline)),
    Buffer.from(Uint8Array.of(ctnmUsdPriceOracle)),
    payer.toBuffer(),
  ]);

  // Compute the keccak256 hash
  const messageHash = Buffer.from(keccak_256.array(message));

  // Sign the message using Ed25519 (Solana’s signing scheme)
  return messageHash;
}

export const createAddLiquidityTx = async (coin_amount: number, pc_amount: number, base: number, payer: PublicKey, program: anchor.Program) => {
  const market = MARKET_ID;
  const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT);
  const userTokenCoin = getAssociatedTokenAddressSync(SHIBA_TOKEN_MINT, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenCoin:", userTokenCoin)
  const userTokenPc = getAssociatedTokenAddressSync(WSOL, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenPc:", userTokenPc)
  const userTokenLp = getAssociatedTokenAddressSync(poolKeys.lpMint, payer);
  console.log("🚀 ~ createGenerateTx ~ userTokenLp:", userTokenLp)
  const ix = await program.methods
    .addLiquidity(coin_amount, pc_amount, new anchor.BN(10))
    .accounts({
      ammProgram,
      amm: poolKeys.id,
      ammAuthority: poolKeys.authority,
      ammOpenOrders: poolKeys.openOrders,
      ammTargetOrders: poolKeys.targetOrders,
      ammLpMint: poolKeys.lpMint,
      ammCoinVault: poolKeys.baseVault,
      ammPcVault: poolKeys.quoteVault,
      market,
      marketEventQueue: poolKeys.marketEventQueue,
      userTokenCoin,
      userTokenPc,
      userTokenLp,
      userOwner: payer,
      tokenProgram: TOKEN_PROGRAM_ID
    }).instruction();
}

export const createRegisterSecondReferralTx = async (
  mainReferral: PublicKey,
  payer: PublicKey,
  program: anchor.Program
) => {
  const referralAccount = getReferralAccount(mainReferral, program.programId);
  console.log("🚀 ~ referralAccount:", referralAccount)
  const ix = await program.methods.RegisterSecondReferral()
    .accounts({
      referralAccount,
      mainReferral,
      signer: payer
    }).instruction();
  return ix;
}

export const createSetFoundationTx = async (
  foundation: PublicKey,
  payer: PublicKey,
  program: anchor.Program
) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ configAccount:", configAccount)
  const ix = await program.methods.setFoundation(
    foundation,
  ).accounts({
    signer: payer,
    configAccount: configAccount,
  }).instruction();

  return ix;
}

export const createSetTreausuryTx = async (
  treasury: PublicKey,
  payer: PublicKey,
  program: anchor.Program
) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ configAccount:", configAccount)
  const ix = await program.methods.setFoundation(
    treasury,
  ).accounts({
    signer: payer,
    configAccount: configAccount,
  }).instruction();

  return ix;
}

export const createUnlockTx = async (index: number, payer: PublicKey, program: anchor.Program) => {
  const blacklist = getBlacklistAccount(payer, program.programId);
  console.log("🚀 ~ createUnlockTx ~ blacklist:", blacklist)
  const userPool = getUserPool(payer, index, program.programId);
  console.log("🚀 ~ createUnlockTx ~ userPool:", userPool)
  const infoPool = getInfoPool(program.programId);
  console.log("🚀 ~ createUnlockTx ~ infoPool:", infoPool)
  const toTokenVault = getAssociatedTokenAddressSync(SHIBA_TOKEN_MINT, payer);
  console.log("🚀 ~ createUnlockTx ~ toTokenVault:", toTokenVault)

  const ix = await program.methods.unlock(index).accounts({
    blacklist,
    userPool,
    poolInfo: infoPool,
    numTokenMint: SHIBA_TOKEN_MINT,
    toTokenVault,
    signer: payer,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  }).instruction();

  return ix;
}

export const createUpdateBlacklistTx = async (isBlacklist: boolean, address: PublicKey, payer: PublicKey, program: anchor.Program) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createUpdateBlacklistTx ~ configAccount:", configAccount)
  const blacklistAccount = getBlacklistAccount(address, program.programId)
  console.log("🚀 ~ createUpdateBlacklistTx ~ blacklistAccount:", blacklistAccount)
  const ix = await program.methods.updateBlacklist(isBlacklist).accounts({
    configAccount: configAccount,
    blacklistAccount,
    address,
    signer: payer,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY
  }).instruction();

  return ix;
}

export const createUpdateMultiplierTx = async (multiplier12: number, multiplier6: number, multiplier3: number, payer: PublicKey, program: anchor.Program) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createUpdateMultiplierTx ~ configAccount:", configAccount)

  const ix = await program.methods.updateMultiplier(multiplier12, multiplier6, multiplier3)
    .accounts({
      configAccount: configAccount,
      signer: payer
    }).instruction();

  return ix;
}

export const createUpdatePercentageTx = async (liqP: number, mainReferralP: number, secondReferralP: number, treasuryP: number, foundationP: number, payer: PublicKey, program: anchor.Program) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createUpdatePercentageTx ~ configAccount:", configAccount)
  const ix = await program.methods.updatePercentage(liqP, mainReferralP, secondReferralP, treasuryP, foundationP)
    .accounts({
      configAccount: configAccount,
      signer: payer,
    }).instruction();

  return ix;
}

export const createUpdateReferralTx = async (referral: PublicKey, isMainReferral: boolean, payer: PublicKey, program: anchor.Program) => {
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createUpdateReferralTx ~ configAccount:", configAccount)
  const referralAccount = getReferralAccount(referral, program.programId);
  console.log("🚀 ~ createUpdateReferralTx ~ referralAccount:", referralAccount)

  const refData = getReferralAccountData(referral, program);

  const ix = await program.methods.updateReferral(isMainReferral)
    .accounts({
      configAccount: configAccount,
      referral,
      referralAccount,
      signer: payer,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    }).instruction();

  return ix;
}

export const createTransferMintAuthorityTx = async (newMintAuthority: PublicKey, payer: PublicKey, program: anchor.Program) => {
  const mintAuthority = getMintAuthority(program.programId);
  console.log("🚀 ~ createTransferMintAuthorityTx ~ mintAuthority:", mintAuthority)
  const configAccount = getConfigAccount(program.programId);
  console.log("🚀 ~ createTransferMintAuthorityTx ~ configAccount:", configAccount)
  const ix = await program.methods.transferMintAuthority()
    .accounts({
      mintAuthority,
      newMintAuthority,
      mint: SHIBA_TOKEN_MINT,
      configAccount,
      signer: payer,
      tokenProgram: TOKEN_PROGRAM_ID
    }).instruction();

  return ix;
}

export const getBlacklistAccount = (address: PublicKey, programId: PublicKey) => {
  const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from(BLACK_LIST_SEED), address.toBytes()], programId);
  return mintAuthority;
}

export const getMintAuthority = (programId: PublicKey) => {
  const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from(MINT_AUTHORITY_SEED)], programId);
  return mintAuthority;
}

export const getUserPool = (to: PublicKey, index: number, programId: PublicKey) => {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(index, 0);
  const [userPool] = PublicKey.findProgramAddressSync([Buffer.from(POOL_SEED), to.toBytes(), buffer], programId);
  return userPool;
}

export const getInfoPool = (programId: PublicKey) => {
  const [infoPool] = PublicKey.findProgramAddressSync([Buffer.from(POOL_INFO_SEED)], programId);
  return infoPool;
}

export const getInfoPoolData = async (program: anchor.Program) => {
  const infoPool = getInfoPool(program.programId);
  const data = await program.account.poolInfo.fetch(infoPool);
  console.log("🚀 ~ getInfoPoolData ~ data:", data)
  return {
    key: infoPool,
    data: data as unknown as PoolInfo
  }
}

export const getReferralAccount = (referral: PublicKey, programId: PublicKey) => {
  const [mainReferral] = PublicKey.findProgramAddressSync([Buffer.from(REFERRAL_SEED), referral.toBytes()], programId)
  return mainReferral;
}

export const getReferralAccountData = async (referral: PublicKey, program: anchor.Program) => {
  const mainReferral = getReferralAccount(referral, program.programId);
  const mainReferralData = await program.account.referralAccount.fetch(mainReferral);
  console.log("🚀 ~ getReferralAccountData ~ mainReferralData:", mainReferralData)
  return {
    key: mainReferral,
    data: mainReferralData as unknown as ReferralAccount
  }
}

export const getConfigAccount = (programId: PublicKey) => {
  const [configAccount] = PublicKey.findProgramAddressSync([Buffer.from(CONFIG_SEED)], programId)
  return configAccount;
}

export const getConfigData = async (program: anchor.Program) => {
  const configAccount = getConfigAccount(program.programId);
  const data = await program.account.configAccount.fetch(configAccount);
  console.log("🚀 ~ getConfigData ~ data:", data)

  return {
    key: configAccount,
    data: data as unknown as ConfigAccount
  }
}


