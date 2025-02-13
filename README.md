# Shiba Token Liquidity Pool on Raydium

A Solana program demonstrating Raydium liquidity pool integration, built with Anchor framework. This project showcases how to interact with Raydium's AMM to manage liquidity positions.

## 🛠 Prerequisites

Make sure you have the following installed:
- Solana CLI (v2.0.25)
- Anchor CLI (v0.29.0)
- Rust (v1.81.0)
- Node.js (v22.13.0)

## 🚀 Features

- Create Raydium liquidity pools
- Add liquidity to existing pools
- Remove liquidity from pools
- Full integration with Raydium's AMM protocol

## 🏗 Project Structure

```
├── programs/
│   └── shiba-token/
│       ├── src/
│       │   ├── instructions/
│       │   │   ├── add_liquidity.rs
│       │   │   └── remove_liquidity.rs
│       │   └── lib.rs
└── tests/
    └── shiba-token.ts
```

## 💫 Test the program

1. Build the program:
```bash
anchor build
```

2. Run tests:
```bash
anchor test
```

## 🔒 Security

- All accounts are properly checked and validated
- Integration with Raydium's secure AMM protocol
- Comprehensive testing suite
