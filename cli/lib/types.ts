import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export interface ConfigAccount {
  admin:PublicKey;
  treasury: PublicKey;
  foundation: PublicKey;
  liqP: number;
  mainReferralP: number;
  secondReferralP: number;
  treasuryP: number;
  foundationP: number; 
  multiplier12: number;
  multiplier6: number;
  multiplier3: number;
}

export interface PoolInfo {
  totalLockedAmount: number,
  userCount: number,
  totalCount: number
}

export interface ReferralAccount {
  referralAddress: PublicKey,
  isMainReferral: boolean,
  pair: PublicKey,
}