import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
// FIX: Explicitly import the `process` object to resolve TypeScript type errors in a Node.js environment.
import process from 'process';

const router = Router();

const UPLINK_DIR = path.join(process.cwd(), 'uplink_data');
const SYNC_FILE_PATH = path.join(process.cwd(), 'mission_update_packet.json');


// Ensure uplink directory exists
const ensureUplinkDir = async () => {
  try {
    await fs.access(UPLINK_DIR);
  } catch {
    await fs.mkdir(UPLINK_DIR);
    console.log(`Created uplink data directory at: ${UPLINK_DIR}`);
  }
};

ensureUplinkDir();


// Endpoint to simulate data uplink from MAITRI client
router.post('/uplink', async (req: Request, res: Response) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ message: 'Request body is empty.' });
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `uplink_${timestamp}.json`;
  const filePath = path.join(UPLINK_DIR, filename);

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully saved uplink data to ${filename}`);
    res.status(200).json({ message: `Uplink successful. Data saved to ${filename}` });
  } catch (error) {
    console.error('Failed to save uplink data:', error);
    res.status(500).json({ message: 'Failed to save uplink data.' });
  }
});


// Endpoint to simulate receiving an update from Base Station
router.get('/sync', async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(SYNC_FILE_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Failed to read sync file:', error);
    res.status(500).json({ message: 'Failed to retrieve mission update packet.' });
  }
});

export default router;