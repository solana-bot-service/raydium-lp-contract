use amm_anchor::Initialize2;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::Token};

pub fn create_raydium_pool_handler<'info>(
    ctx: Context<CreateRaydiumPool<'info>>,
    nonce: u8,
    init_coin_amount: u64,
    init_pc_amount: u64,
) -> Result<()> {
    let open_time = Clock::get()?.unix_timestamp as u64;

    let cpi_accounts = Initialize2 {
        amm: ctx.accounts.amm.clone(),
        amm_authority: ctx.accounts.amm_authority.clone(),
        amm_open_orders: ctx.accounts.amm_open_orders.clone(),
        amm_lp_mint: ctx.accounts.amm_lp_mint.clone(),
        amm_coin_mint: ctx.accounts.amm_coin_mint.clone(),
        amm_pc_mint: ctx.accounts.amm_pc_mint.clone(),
        amm_coin_vault: ctx.accounts.amm_coin_vault.clone(),
        amm_pc_vault: ctx.accounts.amm_pc_vault.clone(),
        amm_target_orders: ctx.accounts.amm_target_orders.clone(),
        amm_config: ctx.accounts.amm_config.clone(),
        create_fee_destination: ctx.accounts.create_fee_destination.clone(),
        market_program: ctx.accounts.market_program.clone(),
        market: ctx.accounts.market.clone(),
        user_wallet: ctx.accounts.user_wallet.clone(),
        user_token_coin: ctx.accounts.user_token_coin.clone(),
        user_token_pc: ctx.accounts.user_token_pc.clone(),
        user_token_lp: ctx.accounts.user_token_lp.clone(),
        token_program: ctx.accounts.token_program.clone(),
        associated_token_program: ctx.accounts.associated_token_program.clone(),
        system_program: ctx.accounts.system_program.clone(),
        sysvar_rent: ctx.accounts.sysvar_rent.clone(),
    };
    let cpi_program = ctx.accounts.amm_program.to_account_info();

    amm_anchor::initialize(
        CpiContext::new(cpi_program, cpi_accounts),
        nonce,
        open_time,
        init_pc_amount,
        init_coin_amount,
    )
}

#[derive(Accounts)]
pub struct CreateRaydiumPool<'info> {
    /// CHECK: Safe
    pub amm_program: UncheckedAccount<'info>,
    /// CHECK: Safe. The new amm Account to be create, a PDA create with seed = [program_id, openbook_market_id, b"amm_associated_seed"]
    #[account(mut)]
    pub amm: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm authority, a PDA create with seed = [b"amm authority"]
    #[account()]
    pub amm_authority: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm open_orders Account, a PDA create with seed = [program_id, openbook_market_id, b"open_order_associated_seed"]
    #[account(mut)]
    pub amm_open_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. Pool lp mint account. Must be empty, owned by $authority.
    #[account(mut)]
    pub amm_lp_mint: UncheckedAccount<'info>,
    /// CHECK: Safe. Coin mint account
    #[account(
        owner = token_program.key()
    )]
    pub amm_coin_mint: UncheckedAccount<'info>,
    /// CHECK: Safe. Pc mint account
    #[account(
        owner = token_program.key()
    )]
    pub amm_pc_mint: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_coin_vault Account. Must be non zero, owned by $authority
    #[account(mut)]
    pub amm_coin_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_pc_vault Account. Must be non zero, owned by $authority.
    #[account(mut)]
    pub amm_pc_vault: UncheckedAccount<'info>,
    /// CHECK: Safe. amm_target_orders Account. Must be non zero, owned by $authority.
    #[account(mut)]
    pub amm_target_orders: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm Config.
    #[account(mut)]
    pub amm_config: UncheckedAccount<'info>,
    /// CHECK: Safe. Amm create_fee_destination.
    #[account(mut)]
    pub create_fee_destination: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook program.
    // #[account(
    // address = amm_anchor::openbook_program_id::id(),
    // address = Pubkey::from_str(MARKET_PROGRAM).unwrap(),
    // )]
    pub market_program: UncheckedAccount<'info>,
    /// CHECK: Safe. OpenBook market. OpenBook program is the owner.
    #[account(
        owner = market_program.key(),
    )]
    pub market: UncheckedAccount<'info>,
    /// CHECK: Safe. The user wallet create the pool
    #[account(mut)]
    pub user_wallet: Signer<'info>,
    /// CHECK: Safe. The user coin token
    #[account(
        mut,
        owner = token_program.key(),
    )]
    pub user_token_coin: UncheckedAccount<'info>,
    /// CHECK: Safe. The user pc token
    #[account(
        mut,
        owner = token_program.key(),
    )]
    pub user_token_pc: UncheckedAccount<'info>,
    /// CHECK: Safe. The user lp token
    #[account(mut)]
    pub user_token_lp: UncheckedAccount<'info>,
    /// CHECK: Safe. The spl token program
    pub token_program: Program<'info, Token>,
    /// CHECK: Safe. The associated token program
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: Safe. System program
    pub system_program: Program<'info, System>,
    /// CHECK: Safe. Rent program
    pub sysvar_rent: Sysvar<'info, Rent>,
}
