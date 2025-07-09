import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/insights/summary
router.get('/summary', async (req, res) => {
  const { from, to } = req.query;

  const where: any = {};
  if (from || to) {
    where.timestamp = {};
    if (from) where.timestamp.gte = new Date(from as string);
    if (to) where.timestamp.lte = new Date(to as string);
  }

  const transactions = await prisma.transaction.findMany({ where });

  const summary = {
    totalBuys: transactions.filter(t => t.direction === 'buy').length,
    totalSells: transactions.filter(t => t.direction === 'sell').length,
    protocolUsage: {} as Record<string, number>,
    activeWallets: {} as Record<string, number>,
  };

  for (const tx of transactions) {
    summary.protocolUsage[tx.protocol] = (summary.protocolUsage[tx.protocol] || 0) + 1;
    summary.activeWallets[tx.walletId] = (summary.activeWallets[tx.walletId] || 0) + 1;
  }

  res.json(summary);
});


// GET /api/insights/export/json
router.get('/export/json', async (req, res) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
});

// GET /api/insights/export/csv


router.get('/export/csv', async (req, res) => {
  const transactions = await prisma.transaction.findMany();
  const parser = new Parser();
  const csv = parser.parse(transactions);
  res.header('Content-Type', 'text/csv');
  res.attachment('transactions.csv');
  res.send(csv);
});



export default router;
