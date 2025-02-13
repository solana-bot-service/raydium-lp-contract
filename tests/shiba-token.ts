import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ShibaToken } from "../target/types/shiba_token";
import { ComputeBudgetProgram, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import adminKey from '../keys/admin.json';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { SHIBA_TOKEN_MINT, WSOL, SOL_VAULT_SEED, ammProgram, marketProgram, feeDestination, MARKET_ID } from "../cli/lib/constants";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token"
import BN from "bn.js";
import { PoolKeys } from "../cli/lib/get-pool-key";

const admin = Keypair.fromSecretKey(new Uint8Array(adminKey));
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.ShibaToken as Program<ShibaToken>;
const getProgramPDABySeeds = (programId: PublicKey, seeds: Array<Buffer>) => {
  return PublicKey.findProgramAddressSync(seeds, programId)
}

const tokenMint = SHIBA_TOKEN_MINT;
const [configAccount] = getProgramPDABySeeds(program.programId, [Buffer.from('config')]);
const [poolInfo] = getProgramPDABySeeds(program.programId, [Buffer.from('pool_info')])
const [solVault, solVaultBump] = getProgramPDABySeeds(program.programId, [Buffer.from(SOL_VAULT_SEED)])
const userWallet = admin.publicKey
const userTokenCoin = getAssociatedTokenAddressSync(tokenMint, userWallet);
const userTokenPc = getAssociatedTokenAddressSync(WSOL, userWallet);

describe("shiba-token", async () => {

  //Liquidity size
  const coin_amount = new BN(2000000000);
  const pc_amount = new BN(1000000000);

  // Configure the client to use the local cluster.
  // it("Is initialized!", async () => {

  //   // Add your test here.

  //   const tx = await program.methods.initialize(admin.publicKey, admin.publicKey)
  //     .accounts({
  //       configAccount: configAccount,
  //       poolInfo: poolInfo,
  //       wsolMint: WSOL,
  //       numTokenMint: SHIBA_TOKEN_MINT,
  //       signer: admin.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
  //       systemProgram: SystemProgram.programId,
  //       rent: SYSVAR_RENT_PUBKEY,
  //     }).rpc()
  //   console.log("Your transaction signature", tx);
  // });

  it("Create Pool", async () => {
    // const market = await createMarket(admin, SHIBA_TOKEN_MINT);
    const market = MARKET_ID;
    const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT)
    const [amm, ammBump] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("amm_associated_seed")])
    const [baseVault] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("coin_vault_associated_seed")])
    const [quoteVault] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("pc_vault_associated_seed")])
    const [ammAuthority] = getProgramPDABySeeds(ammProgram, [Buffer.from("amm authority")])
    const [ammOpenOrders] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("open_order_associated_seed")])
    const [targetOrders] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("target_associated_seed")])
    const [lpMint] = getProgramPDABySeeds(ammProgram, [ammProgram.toBuffer(), market.toBuffer(), Buffer.from("lp_mint_associated_seed")])
    const [ammConfig] = getProgramPDABySeeds(ammProgram, [Buffer.from("amm_config_account_seed")])
    //ATAs
    const userTokenLp = getAssociatedTokenAddressSync(lpMint, userWallet);

    const tx = await program.methods.createRaydiumPool(252, coin_amount, pc_amount).accounts({
      ammProgram,
      amm: poolKeys.id,
      ammAuthority: poolKeys.authority,
      ammOpenOrders: poolKeys.openOrders,
      ammLpMint: poolKeys.lpMint,
      ammCoinMint: poolKeys.baseMint,
      ammPcMint: WSOL,
      ammCoinVault: poolKeys.baseVault,
      ammPcVault: poolKeys.quoteVault,
      ammConfig: poolKeys.configId,
      ammTargetOrders: poolKeys.targetOrders,
      marketProgram,
      market,
      userTokenCoin,
      userTokenPc,
      userWallet,
      userTokenLp,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      sysvarRent: SYSVAR_RENT_PUBKEY,
      createFeeDestination: feeDestination
    }).preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_000_000
      })
    ]).transaction();

    // const { blockhash } = await program.provider.connection.getLatestBlockhash();
    // tx.feePayer = userWallet
    // tx.recentBlockhash = blockhash;
    // tx.sign(admin);
    // console.dir(await program.provider.connection.simulateTransaction(tx), { depth: null });
    tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash
    const sig = await program.provider.connection.sendTransaction(tx, [admin], { skipPreflight: true })
    console.log("Successfully Add Pool : ", sig)
  })

  it("Add Liquidity", async () => {
    const market = MARKET_ID;
    const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT)
    const userTokenLp = getAssociatedTokenAddressSync(poolKeys.lpMint, userWallet, true);

    console.log({ poolKeys });

    const tx = await program.methods.addLiquidity(coin_amount, pc_amount, new BN(10)).accounts({
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
      userOwner: admin.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID
    }).preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_000_000
      })
    ]).transaction()

    /**
     * ================================================================================
     * Simulation
     * ================================================================================
     * */
    // const { blockhash } = await program.provider.connection.getLatestBlockhash();
    // tx.feePayer = userWallet
    // tx.recentBlockhash = blockhash;
    // tx.sign(admin);
    // console.dir(await program.provider.connection.simulateTransaction(tx), { depth: null });
    tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash
    const sig = await program.provider.connection.sendTransaction(tx, [admin], { skipPreflight: true })
    console.log("Successfully Add Pool : ", sig)


    /**
     * =================================================================================
     * Invoke Transaction
     * =================================================================================
     */
    //tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash
    // const sig = await program.provider.connection.sendTransaction(tx, [admin], { skipPreflight: true })
    // console.log("Successfully Add Pool : ", sig)
  })

  it("Remove Liquidity", async () => {
    const market = MARKET_ID;
    const poolKeys = await PoolKeys.fetchPoolKeyInfoByMarketId(program.provider.connection as any, market, SHIBA_TOKEN_MINT)
    const userTokenLp = getAssociatedTokenAddressSync(poolKeys.lpMint, userWallet, true);
    const lp_amount = new BN(1000000000);
    console.log({ poolKeys });

    const tx = await program.methods.removeLiquidity(lp_amount).accounts({
      ammProgram,
      amm: poolKeys.id,
      ammAuthority: poolKeys.authority,
      ammOpenOrders: poolKeys.openOrders,
      ammTargetOrders: poolKeys.targetOrders,
      ammLpMint: poolKeys.lpMint,
      ammCoinVault: poolKeys.baseVault,
      ammPcVault: poolKeys.quoteVault,
      market,
      marketEventQ: poolKeys.marketEventQueue,
      userTokenCoin,
      userTokenPc,
      userTokenLp,
      userOwner: admin.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      marketProgram: marketProgram,
      marketCoinVault: poolKeys.baseVault,
      marketPcVault: poolKeys.quoteVault,
      marketVaultSigner: userWallet,
      marketBids: poolKeys.marketBids,
      marketAsks: poolKeys.marketAsks,
    }).preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_000_000
      })
    ]).transaction()
  })
});
