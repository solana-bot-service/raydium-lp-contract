use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9MKQUJxTgX4HbetajYfvg69xXU6f1TXiuqezVgQjHa65");

#[program]
pub mod shiba_token {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        treasury: Pubkey,
    ) -> Result<()> {
        initialize_handler(ctx, treasury)
    }

    pub fn create_raydium_pool<'info>(
        ctx: Context<CreateRaydiumPool<'info>>,
        nonce: u8,
        init_coin_amount: u64,
        init_pc_amount: u64,
    ) -> Result<()> {
        create_raydium_pool_handler(ctx, nonce, init_coin_amount, init_pc_amount)
    }

    pub fn add_liquidity<'info>(
        ctx: Context<AddLiquidity>,
        max_coin_amount: u64,
        max_pc_amount: u64,
        base_side: u64,
    ) -> Result<()> {
        add_liquidity_handler(ctx, max_coin_amount, max_pc_amount, base_side)
    }

    pub fn remove_liquidity<'info>(
        ctx: Context<RemoveLiquidity>,
        lp_amount: u64,
    ) -> Result<()> {
        remove_liquidity_handler(ctx, lp_amount)
    }
}
