import { PublicKey } from '@solana/web3.js';

// Function to ensure environment variables are set correctly
function getEnvVar(name: string, fallback: string): string {
    const value = process.env[name];
    if (!value) {
        if (fallback) {
            console.warn(`Environment variable ${name} not found. Using fallback value.`);
            return fallback;
        } else {
            throw new Error(`Environment variable ${name} is required but not set.`);
        }
    }
    return value;
}

// Solana RPC URL
export const RPC_URL = getEnvVar('RPC_URL', 'https://api.mainnet-beta.solana.com');

// Token Program IDs
export const TOKEN_PROGRAM_ID = new PublicKey(getEnvVar('TOKEN_PROGRAM_ID', 'TokenkegQfeZyiNwAJbNbGKPod5JSc4dK7eaDDgQ4a'));
export const TOKEN_2022_PROGRAM_ID = new PublicKey(getEnvVar('TOKEN_2022_PROGRAM_ID', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'));

// BARK Mint and Treasury Addresses
export const NFT_MINT_ADDRESS = getEnvVar('NFT_MINT_ADDRESS', 'NFTMintAddressHere');
export const BARK_TREASURY_ADDRESS = getEnvVar('BARK_TREASURY_ADDRESS', 'BARKTreasuryAddressHere');

// USDC Treasury Address
export const USDC_TREASURY_ADDRESS = getEnvVar('USDC_TREASURY_ADDRESS', 'USDCTreasuryAddressHere');

// Metaplex Metadata Program ID
export const METADATA_PROGRAM_ID = new PublicKey(getEnvVar('METADATA_PROGRAM_ID', 'MetaPlexProgramIDHere'));

// Dialect API Key
export const DIALECT_API_KEY = getEnvVar('DIALECT_API_KEY', '');

// Wallet Private Key
export const WALLET_PRIVATE_KEY = getEnvVar('WALLET_PRIVATE_KEY', '');

// Security Note: Be sure to handle WALLET_PRIVATE_KEY securely and avoid exposing it in logs or error messages.
