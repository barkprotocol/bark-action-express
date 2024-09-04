import { Router } from 'express';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { rpc, host, TOKEN_2022_PROGRAM_ID } from '../config';
import TransactionBuilder from '../build/build';
import BN from 'bn.js';

const donation_usdc = Router();

// Configuration endpoint for USDC donation
donation_usdc.get('/donate-usdc-config', (req, res) => {
    const obj = {
        icon: "https://ucarecdn.com/de8494e3-47f4-4b21-a9a4-221f836ffbc1/donation_usdc.png",
        title: "Donate USDC",
        description: "Enter USDC amount and click Send",
        label: "donate",
        links: {
            "actions": [
                {
                    "label": "Send",
                    "href": `${host}/donate-usdc-build?amount={amount}`,
                    "parameters": [
                        {
                            "name": "amount",
                            "label": "USDC Amount",
                            "required": true
                        }
                    ]
                }
            ]
        }
    };
    res.json(obj);
});

// Endpoint to handle USDC donation
donation_usdc.post('/donate-usdc-build', async (req, res) => {
    try {
        const { account } = req.body;
        const { amount, priority } = req.query;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const decimals = 6; // USDC has 6 decimal places
        const amountInLamports = new BN(Number(amount) * Math.pow(10, decimals)); // Convert USDC amount to lamports
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.USDC_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // USDC Treasury Address

        // SPL Token Transfer instruction format
        const usdcTransferIx = new TransactionInstruction({
            keys: [
                { pubkey: from, isSigner: true, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true }
            ],
            programId: TOKEN_2022_PROGRAM_ID,
            data: Buffer.concat([
                Buffer.from([1]), // Instruction index for transfer (change if necessary)
                new BN(0).toArray('le', 32), // Source Token Account (must be adjusted)
                new BN(0).toArray('le', 32), // Destination Token Account (must be adjusted)
                amountInLamports.toArray('le', 8) // Amount in lamports (8 bytes)
            ]),
        });

        const txConfig = {
            rpc,
            account,
            instructions: [usdcTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(rpc);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} USDC!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

export { donation_usdc };
