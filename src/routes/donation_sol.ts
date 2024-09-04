import { Router } from 'express';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { rpc, host } from '../config';
import TransactionBuilder from '../build/build';

const donation_sol = Router();

// Configuration endpoint for SOL donation
donation_sol.get('/donate-sol-config', (req, res) => {
    const obj = {
        icon: "https://ucarecdn.com/9d42462f-cd40-40ac-a218-00932eaae06a/donation_sol.png",
        title: "Donate SOL",
        description: "Enter SOL amount and click Send",
        label: "donate",
        links: {
            "actions": [
                {
                    "label": "Send",
                    "href": `${host}/donate-sol-build?amount={amount}`,
                    "parameters": [
                        {
                            "name": "amount",
                            "label": "SOL Amount",
                            "required": true
                        }
                    ]
                }
            ]
        }
    };
    res.json(obj);
});

// Endpoint to handle SOL donation
donation_sol.post('/donate-sol-build', async (req, res) => {
    try {
        const { account } = req.body;
        const { amount, priority } = req.query;

        if (!account || !PublicKey.isOnCurve(account) || !amount || isNaN(Number(amount))) {
            return res.status(400).json({ message: 'Invalid input: ensure account is a valid public key and amount is a number' });
        }

        const amountInLamports = Number(amount) * 1e9; // Convert SOL amount to lamports (1 SOL = 1e9 lamports)
        const from = new PublicKey(account);
        const to = new PublicKey(process.env.SOL_TREASURY_ADDRESS || 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'); // Treasury Address

        const solTransferIx = SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports: amountInLamports,
        });

        const txConfig = {
            rpc,
            account,
            instructions: [solTransferIx],
            serialize: true,
            encode: true,
            priority: priority as 'VeryHigh' | 'High' | 'Medium' | 'Low' | 'Min'
        };

        const builder = new TransactionBuilder(rpc);
        const tx = await builder.buildTransaction(txConfig);
        tx.message = `You sent ${amount} SOL!`;
        res.json(tx);
    } catch (err) {
        console.error('Donation error:', err);
        res.status(500).json({ message: 'An error occurred while processing the donation' });
    }
});

export { donation_sol };
