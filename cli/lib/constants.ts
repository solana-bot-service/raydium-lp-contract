import { Connection, PublicKey } from "@solana/web3.js";
import { MAINNET_PROGRAM_ID, DEVNET_PROGRAM_ID } from "@raydium-io/raydium-sdk"


export const PROGRAM_ID = new PublicKey("9MKQUJxTgX4HbetajYfvg69xXU6f1TXiuqezVgQjHa65")


export const lookupTable = new PublicKey("6YQpDRxhW3KjCbGPP8yk9BE3HuC8A8wxKXy7KNrpPsZM");
export const cluster:string = "devnet";
export const RPC_URL_DEVNET = "https://devnet.helius-rpc.com/?api-key=44b7171f-7de7-4e68-9d08-eff1ef7529bd"
export const SOL_VAULT_SEED = "sol-vault";
export const TOKEN_VAULT_SEED = "token-vault";
export const CONFIG_SEED = "config";
export const POOL_INFO_SEED = "pool_info";
export const POOL_SEED = "pool";
export const REFERRAL_SEED = "referral";
export const USER_SEED = "user";
export const BLACK_LIST_SEED = "blacklist";
export const WHITE_LIST_SEED = "whitelist";
export const MINT_AUTHORITY_SEED = "mint-authority";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
export const SHIBA_TOKEN_MINT =new PublicKey("9MKQUJxTgX4HbetajYfvg69xXU6f1TXiuqezVgQjHa65")
export const WSOL = new PublicKey("So11111111111111111111111111111111111111112")
export const MARKET_ID = new PublicKey("7LdXubmYtbbJNyBtzmRSEUwoZ8gSfg1WwxMv4n48sHrv")

export const RPC_URL = cluster == "mainnet-beta" ? "https://mainnet.helius-rpc.com/?api-key=36fe5fc9-8598-4302-a28f-a93d9cc441b7" :"https://devnet.helius-rpc.com/?api-key=44b7171f-7de7-4e68-9d08-eff1ef7529bd" ;
export const connection = new Connection(RPC_URL, 'confirmed'); 
export const raydiumProgramId =
cluster == "mainnet-beta" ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID;
export const ammProgram =
cluster == "mainnet-beta"
    ? new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8") // mainnet-beta
    : new PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8"); // devnet

export const marketProgram =
  cluster == "mainnet-beta"
    ? new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX") // mainnet-beta
    : new PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj"); // devnet

export const feeDestination =
  cluster == "mainnet-beta"
    ? new PublicKey("7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5") // mainnet-beta
    : new PublicKey("3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR"); // Devnet

// export const marketProgram =
//   cluster == "mainnet-beta"
//     ? new PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj") // mainnet-beta
//     : new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"); // devnet