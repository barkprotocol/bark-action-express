import { Router } from 'express';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { rpc, host, TOKEN_PROGRAM_ID } from '../config';
import TransactionBuilder from '../build/build';
import BN from 'bn.js';

const donation_bark = Router();

// Configuration endpoint for BARK token donation
donation_bark.get('/donate-bark-config', (req, res) => {
    const obj = {
        icon: "https://ucarecdn.com/2138a07e-c7e0-4482-820e-105a49d39ede/donation_bark.png",
        title: "Donate BARK Tokens",
        description: "Enter BARK amount and click Send",
        label: "donate",
        links: {
            "actions": [
                {
                    "label": "Send",
                    "href": `${host}/donate-bark-build?amount={amount}`,
                    "parameters": [
                        {
                            "name": "amount",
                            "label": "BARK Amount",
                            "required": true
                        }
                    ]
                }
            ]
        }
    };
    res.json(obj);
});

// Endpoint to handle BARK token donation
donation_bark.post('/donate-bark-build', async (req, res) => {
    try {
        const { account } = req.body;
        const { amount, priority } = req.query;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const decimals = 9;
        const amountInLamports = new BN(Number(amount) * Math.pow(10, decimals)); // Convert BARK amount to lamports
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.BARK_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // BARK Treasury Address
        const tokenProgramId = TOKEN_PROGRAM_ID;

        // SPL Token Transfer instruction format
        const barkTransferIx = new TransactionInstruction({
            keys: [
                { pubkey: from, isSigner: true, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true }
            ],
            programId: tokenProgramId,
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
            instructions: [barkTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(rpc);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} BARK tokens!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

export { donation_bark };
