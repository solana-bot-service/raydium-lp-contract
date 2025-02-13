import { Liquidity, LiquidityPoolKeysV4, MARKET_STATE_LAYOUT_V3, Market } from "@raydium-io/raydium-sdk";
import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { ammProgram, MARKET_ID, marketProgram, WSOL } from "./constants";

export class PoolKeys {
    static SOLANA_ADDRESS = WSOL;
    static RAYDIUM_POOL_V4_PROGRAM_ID = ammProgram;
    static OPENBOOK_ADDRESS = marketProgram;
    static SOL_DECIMALS = 9

    static async fetchMarketId(connection: Connection, baseMint: PublicKey, quoteMint: PublicKey, commitment: Commitment) {
        const accounts = await connection.getProgramAccounts(
            marketProgram,
            {
                commitment,
                filters: [
                    { dataSize: MARKET_STATE_LAYOUT_V3.span },
                    {
                        memcmp: {
                            offset: MARKET_STATE_LAYOUT_V3.offsetOf("baseMint"),
                            bytes: baseMint.toBase58(),
                        },
                    },
                    {
                        memcmp: {
                            offset: MARKET_STATE_LAYOUT_V3.offsetOf("quoteMint"),
                            bytes: quoteMint.toBase58(),
                        },
                    },
                ],
            }
        );
        return accounts.map(({ account }) => MARKET_STATE_LAYOUT_V3.decode(account.data))[0].ownAddress
    }

    static async fetchMarketInfo(connection: Connection, marketId: PublicKey) {
        const marketAccountInfo = await connection.getAccountInfo(marketId, "processed");
        if (!marketAccountInfo) {
            throw new Error('Failed to fetch market info for market id ' + marketId.toBase58());
        }

        return MARKET_STATE_LAYOUT_V3.decode(marketAccountInfo.data);
    }

    static async generateV4PoolInfo(baseMint: PublicKey, quoteMint: PublicKey, marketID: PublicKey) {
        const poolInfo = Liquidity.getAssociatedPoolKeys({
            version: 4,
            marketVersion: 3,
            baseMint: baseMint,
            quoteMint: quoteMint,
            baseDecimals: 0,
            quoteDecimals: this.SOL_DECIMALS,
            programId: ammProgram,
            marketId: marketID,
            marketProgramId: marketProgram,
        });

        return { poolInfo }
    }

    static async fetchPoolKeyInfo(connection: Connection, baseMint: PublicKey, quoteMint: PublicKey) {
        const marketId = await this.fetchMarketId(connection, baseMint, quoteMint, 'confirmed');

        const marketInfo = await this.fetchMarketInfo(connection, marketId);
        const baseMintInfo = await connection.getParsedAccountInfo(baseMint, "confirmed") as MintInfo;
        const baseDecimals = baseMintInfo.value.data.parsed.info.decimals
        
        const V4PoolInfo = await this.generateV4PoolInfo(baseMint, quoteMint, marketId)
        const lpMintInfo = await connection.getParsedAccountInfo(V4PoolInfo.poolInfo.lpMint, "confirmed") as MintInfo;
        console.log({V4PoolInfo}, "poolInfo");
        return {
            id: V4PoolInfo.poolInfo.id,
            marketId: marketId,
            baseMint: baseMint,
            quoteMint: quoteMint,
            baseVault: V4PoolInfo.poolInfo.baseVault,
            quoteVault: V4PoolInfo.poolInfo.quoteVault,
            lpMint: V4PoolInfo.poolInfo.lpMint,
            baseDecimals: baseDecimals,
            quoteDecimals: this.SOL_DECIMALS,
            lpDecimals: lpMintInfo.value?.data.parsed.info.decimals,
            version: 4,
            programId: new PublicKey(this.RAYDIUM_POOL_V4_PROGRAM_ID),
            authority: V4PoolInfo.poolInfo.authority,
            openOrders: V4PoolInfo.poolInfo.openOrders,
            targetOrders: V4PoolInfo.poolInfo.targetOrders,
            withdrawQueue: new PublicKey("11111111111111111111111111111111"),
            lpVault: new PublicKey("11111111111111111111111111111111"),
            marketVersion: 3,
            marketProgramId: new PublicKey(this.OPENBOOK_ADDRESS),
            marketAuthority: Market.getAssociatedAuthority({ programId: new PublicKey(this.OPENBOOK_ADDRESS), marketId: marketId }).publicKey,
            marketBaseVault: marketInfo.baseVault,
            marketQuoteVault: marketInfo.quoteVault,
            marketBids: marketInfo.bids,
            marketAsks: marketInfo.asks,
            marketEventQueue: marketInfo.eventQueue,
            lookupTableAccount: PublicKey.default,
            configId:V4PoolInfo.poolInfo.configId
        }
    }

    static async fetchPoolKeyInfoByMarketId(connection: Connection, marketId: PublicKey, baseMint:PublicKey) {

        const quoteMint = WSOL
        const marketInfo = await this.fetchMarketInfo(connection, marketId);
        const baseMintInfo = await connection.getParsedAccountInfo(baseMint, "confirmed") as MintInfo;
        const baseDecimals = baseMintInfo.value.data.parsed.info.decimals
        
        const V4PoolInfo = await this.generateV4PoolInfo(baseMint, quoteMint, marketId)
        const lpMintInfo = await connection.getParsedAccountInfo(V4PoolInfo.poolInfo.lpMint, "confirmed") as MintInfo;
        console.log({V4PoolInfo}, "poolInfo");
        return {
            id: V4PoolInfo.poolInfo.id,
            marketId: marketId,
            baseMint: baseMint,
            quoteMint: quoteMint,
            baseVault: V4PoolInfo.poolInfo.baseVault,
            quoteVault: V4PoolInfo.poolInfo.quoteVault,
            lpMint: V4PoolInfo.poolInfo.lpMint,
            baseDecimals: baseDecimals,
            quoteDecimals: this.SOL_DECIMALS,
            lpDecimals: lpMintInfo.value?.data.parsed.info.decimals,
            version: 4,
            programId: new PublicKey(this.RAYDIUM_POOL_V4_PROGRAM_ID),
            authority: V4PoolInfo.poolInfo.authority,
            openOrders: V4PoolInfo.poolInfo.openOrders,
            targetOrders: V4PoolInfo.poolInfo.targetOrders,
            withdrawQueue: new PublicKey("11111111111111111111111111111111"),
            lpVault: new PublicKey("11111111111111111111111111111111"),
            marketVersion: 3,
            marketProgramId: new PublicKey(this.OPENBOOK_ADDRESS),
            marketAuthority: Market.getAssociatedAuthority({ programId: new PublicKey(this.OPENBOOK_ADDRESS), marketId: marketId }).publicKey,
            marketBaseVault: marketInfo.baseVault,
            marketQuoteVault: marketInfo.quoteVault,
            marketBids: marketInfo.bids,
            marketAsks: marketInfo.asks,
            marketEventQueue: marketInfo.eventQueue,
            lookupTableAccount: PublicKey.default,
            configId:V4PoolInfo.poolInfo.configId
        }
    }
}

interface MintInfo {
    value: {
        data: {
            parsed: {
                info: {
                    decimals: number
                }
            }
        }
    }
}