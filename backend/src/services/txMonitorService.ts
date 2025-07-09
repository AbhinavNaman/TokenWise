import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_BASE = `https://api.helius.xyz/v0`;
const TARGET_TOKEN = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollWalletActivity() {
  const wallets = await prisma.wallet.findMany();

  for (const wallet of wallets) {
    try {
      const url = `${HELIUS_BASE}/addresses/${wallet.address}/transactions?api-key=${HELIUS_API_KEY}&limit=10`;
      const { data } = await axios.get(url);

      for (const tx of data) {
        const sig = tx.signature;
        const existing = await prisma.transaction.findUnique({ where: { txSignature: sig } });
        if (existing) continue;

        const instructions = tx.tokenTransfers || [];

        const relevantTransfer = instructions.find(
          (i: any) =>
            i.mint === TARGET_TOKEN &&
            (i.fromUserAccount === wallet.address || i.toUserAccount === wallet.address)
        );

        if (!relevantTransfer) continue;

        const direction =
          relevantTransfer.toUserAccount === wallet.address ? 'buy' : 'sell';

        await prisma.transaction.create({
          data: {
            txSignature: sig,
            walletId: wallet.id,
            tokenAmount: Number(relevantTransfer.tokenAmount),
            direction,
            protocol: tx.type || 'unknown',
            timestamp: new Date(tx.timestamp * 1000),
          },
        });

        console.log(`[+] ${wallet.address} ${direction} ${relevantTransfer.tokenAmount} via ${tx.type}`);
        //Throttle Requests (Simple + Reliable)
        //Introduce a small delay between each wallet to stay under rate limits.
        await sleep(500);
      }
    } catch (err: any) {
      console.error(`Error fetching for wallet ${wallet.address}:`, err.message);
    }
  }
}
