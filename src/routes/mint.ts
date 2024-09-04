import express, { Request, Response } from 'express';
import { Keypair } from '@solana/web3.js';
import { mintNFT } from '../actions/mint_nft';
import { WALLET_PRIVATE_KEY } from '../config';

const mintRouter = express.Router();

mintRouter.post('/mint-bark', async (req: Request, res: Response) => {
    try {
        const { name, symbol, uri } = req.body;

        // Validate inputs
        if (!name || !symbol || !uri) {
            return res.status(400).json({ success: false, message: 'Missing required fields: name, symbol, or uri' });
        }

        // Load mint authority from private key
        const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(WALLET_PRIVATE_KEY)));
        const payer = mintAuthority; // Use the same keypair for payer in this example

        // Mint the NFT
        const signature = await mintNFT(mintAuthority, payer, name, symbol, uri);
        res.json({ success: true, message: 'NFT minted successfully', signature });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ success: false, message: 'An error occurred while minting NFT' });
    }
});

export default mintRouter;
