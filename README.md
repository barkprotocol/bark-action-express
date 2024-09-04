# BARK Actions Server

## Description

BARK Actions Server is a Solana-based application powered by Node.js and Express.js. It includes endpoints for minting NFTs, processing donations in SOL, USDC, and BARK tokens, and additional features for managing transactions.

## Features

- **Mint NFTs**: Create and mint BARK NFTs with custom metadata.
- **Donation Endpoints**: Handle donations in SOL, USDC, and BARK tokens.
- **Transaction Management**: Build and send Solana transactions with dynamic fee and compute unit estimation.
- **Logging**: Integrated logging with Winston, including console and file logging with rotation.

## Prerequisites

- Node.js (>= 18.x)
- npm (>= 8.x) or yarn
- Solana CLI (for local development)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/barkprotocol/bark-actions-server.git
   cd bark-actions-server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   SOLANA_CLUSTER=https://api.mainnet-beta.solana.com

   TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPod5JSc4dK7eaDDgQ4a
   TOKEN_2022_PROGRAM_ID=TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
   METADATA_PROGRAM_ID=

   DIALECT_API_KEY=your-dialect-api-key

   PORT=3000

   WALLET_PRIVATE_KEY=your-wallet-private-key

   RPC_URL=https://api.mainnet-beta.solana.com

   HOST_URL=http://localhost:3000

   BARK_TREASURY_ADDRESS=BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo
   NFT_MINT_ADDRESS=gEb7nD9yLkau1P4uyMdke9byJNrat61suH4vYiPUuiR
   ```

## Scripts

- **Start the Server**

  ```bash
  npm start
  # or
  yarn start
  ```

- **Run Tests**

  ```bash
  npm test
  # or
  yarn test
  ```

- **Watch Tests**

  ```bash
  npm run test:watch
  # or
  yarn test:watch
  ```

## Endpoints

### Mint NFT

- **POST** `/api/mint`
- **Description**: Mint a new BARK NFT.
- **Request Body**:
  ```json
  {
    "name": "NFT Name",
    "symbol": "NFTSYMBOL",
    "uri": "https://example.com/metadata.json"
  }
  ```

### Donation Endpoints

- **POST** `/api/donate/sol`
  - **Description**: Donate SOL to the specified address.
  - **Request Body**:
    ```json
    {
      "account": "SolPublicKey",
      "amount": "10",
      "priority": "High"
    }
    ```

- **POST** `/api/donate/usdc`
  - **Description**: Donate USDC to the specified address.
  - **Request Body**:
    ```json
    {
      "account": "SolPublicKey",
      "amount": "100",
      "priority": "Medium"
    }
    ```

- **POST** `/api/donate/bark`
  - **Description**: Donate BARK tokens to the specified address.
  - **Request Body**:
    ```json
    {
      "account": "SolPublicKey",
      "amount": "5000",
      "priority": "Low"
    }
    ```

## Logger

The application uses Winston for logging, with the following configuration:

- **Console Transport**: Logs messages to the console with colorized output.
- **File Transport**: Logs messages to a file with daily rotation. Logs are stored in the `logs` directory with filenames based on the date.

### Custom Log Levels

- **error**: Red
- **warn**: Yellow
- **info**: Green
- **debug**: Blue

## Development

1. **Build the Project**

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Run in Development Mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

MIT License. See `LICENSE` for details.

## Contact

For any questions or issues, please reach out to [support@example.com](mailto:support@example.com).

---

Feel free to adjust the contact information, repository URL, and any other details specific to your project.