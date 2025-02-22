use anchor_lang::prelude::*;
use anchor_spl::token::Token;

use amm_anchor::Withdraw;

pub fn remove_liquidity_handler(ctx: Context<RemoveLiquidity>, amount: u64) -> Result<()> {
    let cpi_accounts = Withdraw {
        amm: ctx.accounts.amm.clone(),
        amm_authority: ctx.accounts.amm_authority.clone(),
        amm_open_orders: ctx.accounts.amm_open_orders.clone(),
        amm_target_orders: ctx.accounts.amm_target_orders.clone(),
        amm_lp_mint: ctx.accounts.amm_lp_mint.clone(),
        amm_coin_vault: ctx.accounts.amm_coin_vault.clone(),
        amm_pc_vault: ctx.accounts.amm_pc_vault.clone(),
        market_program: ctx.accounts.market_program.clone(),
        market: ctx.accounts.market.clone(),
        market_coin_vault: ctx.accounts.market_coin_vault.clone(),
        market_pc_vault: ctx.accounts.market_pc_vault.clone(),
        market_vault_signer: ctx.accounts.market_vault_signer.clone(),
        user_token_lp: ctx.accounts.user_token_lp.clone(),
        user_token_coin: ctx.accounts.user_token_coin.clone(),
        user_token_pc: ctx.accounts.user_token_pc.clone(),
        user_owner: ctx.accounts.user_owner.clone(),
        market_event_q: ctx.accounts.market_event_q.clone(),
        market_bids: ctx.accounts.market_bids.clone(),
        market_asks: ctx.accounts.market_asks.clone(),
        token_program: ctx.accounts.token_program.clone(),
    };
    let cpi_program = ctx.accounts.amm_program.to_account_info();
    amm_anchor::withdraw(CpiContext::new(cpi_program, cpi_accounts), amount)
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    /// CHECK: Safe
    pub amm_program: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm account
    #[account(mut)]
    pub amm: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm authority Account
    #[account()]
    pub amm_authority: UncheckedAccount<'info>,
    /// CHECK: Safe. amm open_orders Account
    #[account(mut)]
    pub amm_open_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. amm target_orders Account. To store plan orders infomations.
    #[account(mut)]
    pub amm_target_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. pool lp mint account. Must be empty, owned by $authority.
    #[account(mut)]
    pub amm_lp_mint: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_coin_vault Amm Account to withdraw FROM,
    #[account(mut)]
    pub amm_coin_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_pc_vault Amm Account to withdraw FROM,
    #[account(mut)]
    pub amm_pc_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook program id
    pub market_program: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook market Account. OpenBook program is the owner.
    #[account(mut)]
    pub market: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook coin_vault Account
    #[account(mut)]
    pub market_coin_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook pc_vault Account
    #[account(mut)]
    pub market_pc_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook vault_signer Account
    pub market_vault_signer: UncheckedAccount<'info>,
    /// CHECK: Safe. user lp token Account. Source lp, amount is transferable by $authority.
    #[account(mut)]
    pub user_token_lp: UncheckedAccount<'info>,
    /// CHECK: Safe. user token coin Account. user Account to credit.
    #[account(mut)]
    pub user_token_coin: UncheckedAccount<'info>,
    /// CHECK: Safe. user token pc Account. user Account to credit.
    #[account(mut)]
    pub user_token_pc: UncheckedAccount<'info>,
    /// CHECK: Safe. User wallet account
    #[account(mut)]
    pub user_owner: Signer<'info>,
    /// CHECK: Safe. OpenBook event queue account
    #[account(mut)]
    pub market_event_q: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook bid account
    #[account(mut)]
    pub market_bids: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook ask account
    #[account(mut)]
    pub market_asks: UncheckedAccount<'info>,
    /// CHECK: Safe. The spl token program
    pub token_program: Program<'info, Token>,
}
