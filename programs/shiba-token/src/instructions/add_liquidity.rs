use anchor_lang::prelude::*;
use anchor_spl::token::Token;

use amm_anchor::Deposit;

pub fn add_liquidity_handler(
    ctx: Context<AddLiquidity>,
    max_coin_amount: u64,
    max_pc_amount: u64,
    base_side: u64,
) -> Result<()> {
    add_liquidity_processor(
        max_coin_amount,
        max_pc_amount,
        base_side,
        ctx.accounts.amm_program.clone(),
        ctx.accounts.amm.clone(),
        ctx.accounts.amm_authority.clone(),
        ctx.accounts.amm_open_orders.clone(),
        ctx.accounts.amm_target_orders.clone(),
        ctx.accounts.amm_lp_mint.clone(),
        ctx.accounts.amm_coin_vault.clone(),
        ctx.accounts.amm_pc_vault.clone(),
        ctx.accounts.market.clone(),
        ctx.accounts.market_event_queue.clone(),
        ctx.accounts.user_token_coin.clone(),
        ctx.accounts.user_token_pc.clone(),
        ctx.accounts.user_token_lp.clone(),
        ctx.accounts.user_owner.clone(),
        ctx.accounts.token_program.clone(),
    )
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    /// CHECK: Safe
    pub amm_program: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm Account
    #[account(mut)]
    pub amm: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm authority, a PDA create with seed = [b"amm authority"]
    #[account()]
    pub amm_authority: UncheckedAccount<'info>,
    /// CHECK: Safe. AMM open_orders Account.
    #[account()]
    pub amm_open_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. AMM target orders account. To store plan orders infomations.
    #[account(mut)]
    pub amm_target_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. LP mint account. Must be empty, owned by $authority.
    #[account(mut)]
    pub amm_lp_mint: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_coin_vault account, $authority can transfer amount.
    #[account(mut)]
    pub amm_coin_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_pc_vault account, $authority can transfer amount.
    #[account(mut)]
    pub amm_pc_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook market account, OpenBook program is the owner.
    pub market: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook market event queue account, OpenBook program is the owner.
    pub market_event_queue: UncheckedAccount<'info>,
    /// CHECK: Safe. User token coin to deposit into.
    #[account(mut)]
    pub user_token_coin: UncheckedAccount<'info>,
    /// CHECK: Safe. User token pc to deposit into.
    #[account(mut)]
    pub user_token_pc: UncheckedAccount<'info>,
    /// CHECK: Safe. User lp token, to deposit the generated tokens, user is the owner
    #[account(mut)]
    pub user_token_lp: UncheckedAccount<'info>,
    /// CHECK: Safe. User wallet account
    #[account(mut)]
    pub user_owner: Signer<'info>,
    /// CHECK: Safe. The spl token program
    pub token_program: Program<'info, Token>,
}

pub fn add_liquidity_processor<'info>(
    max_coin_amount: u64,
    max_pc_amount: u64,
    base_side: u64,
    amm_program: UncheckedAccount<'info>,
    amm: UncheckedAccount<'info>,
    amm_authority: UncheckedAccount<'info>,
    amm_open_orders: UncheckedAccount<'info>,
    amm_target_orders: UncheckedAccount<'info>,
    amm_lp_mint: UncheckedAccount<'info>,
    amm_coin_vault: UncheckedAccount<'info>,
    amm_pc_vault: UncheckedAccount<'info>,
    market: UncheckedAccount<'info>,
    market_event_queue: UncheckedAccount<'info>,
    user_token_coin: UncheckedAccount<'info>,
    user_token_pc: UncheckedAccount<'info>,
    user_token_lp: UncheckedAccount<'info>,
    user_owner: Signer<'info>,
    token_program: Program<'info, Token>,
) -> Result<()> {
    let cpi_accounts = Deposit {
        amm,
        amm_authority,
        amm_open_orders,
        amm_target_orders,
        amm_lp_mint,
        amm_coin_vault,
        amm_pc_vault,
        market,
        market_event_queue,
        user_token_coin,
        user_token_pc,
        user_token_lp,
        user_owner,
        token_program,
    };
    let cpi_program = amm_program.to_account_info();
    amm_anchor::deposit(
        CpiContext::new(cpi_program, cpi_accounts),
        max_coin_amount,
        max_pc_amount,
        base_side,
    )
}
