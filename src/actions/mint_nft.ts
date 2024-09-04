import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    TransactionSignature,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import {
    createMint,
    mintTo,
    createAssociatedTokenAccount
} from '@solana/spl-token';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { RPC_URL, TOKEN_PROGRAM_ID, METADATA_PROGRAM_ID } from '../config';
import logger from '../utils/logger';

// Initialize the Solana connection
const connection = new Connection(RPC_URL, 'confirmed');

/**
 * Create Metadata for an NFT.
 * 
 * @param mint - The public key of the mint account.
 * @param mintAuthority - The public key of the mint authority.
 * @param updateAuthority - The public key of the update authority.
 * @param name - The name of the NFT.
 * @param symbol - The symbol of the NFT.
 * @param uri - The URI pointing to the metadata JSON file.
 */
async function createMetadata(
    mint: PublicKey,
    mintAuthority: PublicKey,
    updateAuthority: PublicKey,
    name: string,
    symbol: string,
    uri: string
) {
    const metadataPDA = await Metadata.getPDA(mint);
    const metadataInstruction = Metadata.createCreateMetadataAccountV2Instruction({
        metadata: metadataPDA,
        mint,
        mintAuthority,
        updateAuthority,
        metadataData: {
            name,
            symbol,
            uri,
            sellerFeeBasisPoints: 500, // Example: 5%
            creators: null,
        },
        isMutable: true,
    });

    return metadataInstruction; // Return the instruction
}

/**
 * Mint a BARK NFT.
 * 
 * @param mintAuthority - The Keypair used for minting authority.
 * @param payer - The Keypair used for paying transaction fees.
 * @param name - The name of the NFT.
 * @param symbol - The symbol of the NFT.
 * @param uri - The URI pointing to the metadata JSON file.
 * @returns The transaction signature.
 */
export async function mintBarkNFT(
    mintAuthority: Keypair,
    payer: Keypair,
    name: string,
    symbol: string,
    uri: string
): Promise<TransactionSignature> {
    try {
        // Create a new mint account
        const mint = await createMint(connection, mintAuthority, mintAuthority.publicKey, null, 0);
  
        // Create an associated token account for the payer
        const tokenAccount = await createAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
  
        // Create a transaction to mint the NFT
        const transaction = new Transaction();
  
        // Add the mintTo instruction to mint 1 token to the associated token account
        transaction.add(
            mintTo(mint, tokenAccount, mintAuthority.publicKey, 1)
        );
  
        // Add the metadata creation instruction
        const metadataInstruction = await createMetadata(mint, mintAuthority.publicKey, mintAuthority.publicKey, name, symbol, uri);
        transaction.add(metadataInstruction);
  
        // Send and confirm the transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [mintAuthority, payer]);
        logger.info(`NFT minted successfully with signature: ${signature}`);
        return signature;
    } catch (error) {
        logger.error('Error minting NFT:', error);
        throw new Error('NFT minting failed');
    }
}
