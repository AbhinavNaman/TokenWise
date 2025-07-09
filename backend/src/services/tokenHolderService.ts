import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const RPC_URL = "https://api.mainnet-beta.solana.com";
const RPC_URL = "https://mainnet.helius-rpc.com/?api-key=6bca12c2-402e-4e3e-a19c-041f00a08455";
const connection = new Connection(RPC_URL, "confirmed");

const TARGET_TOKEN_MINT = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";

export async function fetchAndStoreTopHolders(limit = 60) {
  const mint = new PublicKey(TARGET_TOKEN_MINT);

  const accounts = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters: [
        { dataSize: AccountLayout.span },
        {
          memcmp: {
            offset: 0, 
            bytes: mint.toBase58(),
          },
        },
      ],
    }
  );

  console.log(`Found ${accounts.length} token accounts.`);

  const balancesMap: Record<string, number> = {};

  for (const acc of accounts) {
    const data = AccountLayout.decode(acc.account.data);
    const owner = new PublicKey(data.owner).toBase58();
    const amount = Number(data.amount);

    if (!balancesMap[owner]) balancesMap[owner] = 0;
    balancesMap[owner] += amount;
  }

  const topHolders = Object.entries(balancesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  await prisma.wallet.deleteMany();
  for (const [address, amount] of topHolders) {
    await prisma.wallet.create({
      data: {
        address,
        tokenAmount: amount,
      },
    });
  }

  console.log(`Stored top ${limit} holders to database.`);
}
