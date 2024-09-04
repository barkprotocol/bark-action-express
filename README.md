# BARK Blinks: Solana Action Express Server

## Overview

**BARK Blinks** is a Solana Actions Server powered by Node.js and Express.js. It provides modular action endpoints for performing transactions on the Solana blockchain, such as donating USDC, SOL, and other SPL tokens. The project includes a live mint blink feature integrated with Dialect, a messaging protocol for Web3 applications.

## Features

- **Solana Blinks**: Support for live mint blink actions integrated with Dialect.
- **Donation Actions**: Default support for USDC (or other SPL tokens) donations. Includes a SOL donation action as well.
- **Modular Endpoints**: Easily extendable to add new actions or endpoints for different Solana-based transactions.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18.x or later) - [Download Node.js](https://nodejs.org/)
- **NPM** (version 6.x or later, comes with Node.js) - [NPM Documentation](https://www.npmjs.com/get-npm)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **Solana CLI** (optional but recommended) - [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli)

## Installation

### Step 1: Clone the Repository

Clone the BARK Blinks repository to your local machine.

```bash
git clone https://github.com/barkprotocol/bark-action-express.git
```

Navigate into the project directory:

```bash
cd bark-action-express
```

### Step 2: Install Dependencies

Install the necessary dependencies using NPM:

```bash
npm install
```

This command will install all the packages listed in the `package.json` file, which are required to run the server.

### Step 3: Set Up Environment Variables

Create a `.env` file in the root of the project directory to store your environment variables. The `.env` file should include the following:

```bash
# Solana Cluster URL (Mainnet, Testnet, or Devnet)
SOLANA_CLUSTER=https://api.mainnet-beta.solana.com

# Dialect API Key (if you're using Dialect for live mint blinks)
DIALECT_API_KEY=your-dialect-api-key

# Port for the Express server (optional)
PORT=3000

# Wallet private key (for testing purposes; store securely in production)
WALLET_PRIVATE_KEY=your-wallet-private-key
```

Make sure to replace `your-dialect-api-key` and `your-wallet-private-key` with your actual Dialect API key and wallet private key, respectively. If you're running on a different Solana cluster (e.g., testnet), adjust the `SOLANA_CLUSTER` accordingly.

### Step 4: Start the Server

Once everything is set up, you can start the server by running:

```bash
npm start
```

By default, the server will run on `http://localhost:3000`. You can change the port by modifying the `PORT` variable in the `.env` file.

### Step 5: Testing the Endpoints

With the server running, you can test the available endpoints using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

For example, to test the USDC donation blink:

1. Open Postman or your preferred API testing tool.
2. Set the request type to `POST`.
3. Use the endpoint `http://localhost:3000/api/donate/usdc`.
4. Add a JSON body like this:

   ```json
   {
     "amount": 10.0,
     "recipient": "RecipientWalletAddress"
   }
   ```

5. Send the request.

The server should process the donation and respond with a confirmation.

### Optional: Run the Server in Development Mode

To run the server in development mode with hot-reloading, you can use `nodemon`:

1. Install `nodemon` globally if you haven't already:

   ```bash
   npm install -g nodemon
   ```

2. Start the server in development mode:

   ```bash
   npm run dev
   ```

This will automatically restart the server whenever you make changes to the code.

### Step 6: Deploying to Production

For production deployment, consider using a process manager like [PM2](https://pm2.keymetrics.io/) and hosting platforms like [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), or [DigitalOcean](https://www.digitalocean.com/).

#### Example PM2 Deployment:

1. Install PM2 globally:

   ```bash
   npm install -g pm2
   ```

2. Start your application using PM2:

   ```bash
   pm2 start npm --name "bark-action-express" -- start
   ```

This ensures that your server remains running and can be restarted automatically if it crashes.

## Usage

### Available Endpoints

#### 1. USDC Donation Blink (Default)

- **Endpoint:** `/api/donate/usdc`
- **Method:** `POST`
- **Description:** Accepts a USDC donation.
- **Request Body:**
  
  ```json
  {
    "amount": 10.0,
    "recipient": "RecipientWalletAddress"
  }
  ```

#### 2. SOL Donation Blink

- **Endpoint:** `/api/donate/sol`
- **Method:** `POST`
- **Description:** Accepts a SOL donation.
- **Request Body:**

  ```json
  {
    "amount": 0.1,
    "recipient": "RecipientWalletAddress"
  }
  ```

### Live Mint Blink

This feature allows for real-time minting actions. To use the live mint blink, ensure that you have your Dialect credentials configured.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

1. **Fork the repository.**
2. **Create a feature branch:** `git checkout -b feature/YourFeature`
3. **Commit your changes:** `git commit -m 'Add some feature'`
4. **Push to the branch:** `git push origin feature/YourFeature`
5. **Open a pull request.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Solana](https://solana.com/) for providing a high-performance blockchain.
- [Dialect](https://www.dialect.to/) for integrating messaging into Web3.
- The open-source community for continuous inspiration and contributions.