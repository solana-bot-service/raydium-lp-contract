# Shiba Token Liquidity Pool on Raydium

A Solana program demonstrating Raydium liquidity pool integration, built with Anchor framework. This project showcases how to interact with Raydium's AMM to manage liquidity positions.

## Have a project in mind? Ping me if you need help!

[![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:cashblaze129@gmail.com)
[![Telegram](https://img.shields.io/badge/Telegram-0088cc?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/cashblaze129)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discordapp.com/users/965772784653443215)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/legend-keyvel-alston)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cashblaze129)

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
