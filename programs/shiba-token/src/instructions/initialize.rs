use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token}};
use crate::*;

pub fn initialize_handler(
    ctx: Context<Initialize>,
    treasury: Pubkey,
) -> Result<()> {
    let config_account: &mut Account<'_, ConfigAccount> = &mut ctx.accounts.config_account;
    config_account.admin = ctx.accounts.signer.key();
    config_account.treasury = treasury;
    config_account.liq_p = INIT_LIQ_P;
    config_account.main_referral_p = INIT_MAIN_REFERRAL_P;
    config_account.second_referral_p = INIT_SECOND_REFERRAL_P;
    config_account.is_paused = true;

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    space = ConfigAccount::ACCOUNT_SIZE,
    payer = signer,
    seeds = [CONFIG_SEED.as_bytes()],
    bump,
  )]
  pub config_account: Account<'info, ConfigAccount>,

  #[account(
    init,
    space = 8,
    payer = signer,
    seeds = [MINT_AUTHORITY_SEED.as_bytes()],
    bump,
  )]
  pub mint_authority: AccountInfo<'info>, 

  pub wsol_mint: Account<'info, Mint>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
}
