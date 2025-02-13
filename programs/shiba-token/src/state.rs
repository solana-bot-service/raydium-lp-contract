use anchor_lang::prelude::*;

#[account]
pub struct ConfigAccount {
    pub admin: Pubkey,
    pub syncer: Pubkey,
    pub verifier: Pubkey,
    pub treasury: Pubkey,
    pub liq_p: u16,
    pub main_referral_p: u16,
    pub second_referral_p: u16,
    pub is_paused: bool,
}
impl ConfigAccount {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<ConfigAccount>();

    pub fn new(
        admin: Pubkey,
        syncer: Pubkey,
        verifier: Pubkey,
        treasury: Pubkey,
        liq_p: u16,
        main_referral_p: u16,
        second_referral_p: u16,
        is_paused: bool,
    ) -> Self {
        Self {
            admin,
            syncer,
            verifier,
            treasury,
            liq_p,
            main_referral_p,
            second_referral_p,
            is_paused,
        }
    }
}

#[account]
pub struct ReferralAccount {
    pub referral_address: Pubkey,
    pub is_main_referral: bool,
    pub pair: Pubkey,
}
impl ReferralAccount {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<ReferralAccount>();
    pub fn new(referral_address: Pubkey, is_main_referral: bool, pair: Pubkey) -> Self {
        Self {
            referral_address,
            is_main_referral,
            pair,
        }
    }
}

#[account]
pub struct LockedEntriesCount {
    pub count: u16,
    pub address: Pubkey,
}
impl LockedEntriesCount {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<LockedEntriesCount>();
    pub fn new(count: u16, address: Pubkey) -> Self {
        Self { count, address }
    }
}

#[account]
pub struct LockedEntries {
    pub address: Pubkey,
    pub index: u16,
    pub lamport_amount: u64,
    pub lamport_usd_price: u64,
    pub ctnm_usd_price_oracle: u64,
    pub ctnm_usd_price_pool: u64,
    pub timestamp: i64,
}
impl LockedEntries {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<LockedEntries>();
}

#[account]
pub struct BlacklistAccount {
    pub address: Pubkey,
    pub is_blacklist: bool,
}
impl BlacklistAccount {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<BlacklistAccount>();

    pub fn new(address: Pubkey, is_blacklist: bool) -> Self {
        Self {
            address,
            is_blacklist,
        }
    }
}

#[account]
pub struct LookupTableAccount {
    pub accounts: Vec<Pubkey>,
}

#[account]
pub struct ReferralEarning {
    pub amount: u64,
}
impl ReferralEarning {
    pub const ACCOUNT_SIZE: usize = 8 + std::mem::size_of::<ReferralEarning>();
}
