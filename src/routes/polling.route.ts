import EventEmitter from 'events';
import { Router } from 'express';

const eventEmitter = new EventEmitter();
const TIMEOUT_MS = 29 * 1000;
const router = Router();

router.get('/:txId', async (req, res) => {
  const { txId } = req.params;

  if (!txId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  handleLongOperation(txId);

  let timeout: NodeJS.Timeout;
  const handleLongOperationResult = async (payload: any) => {
    clearTimeout(timeout);
    return res.status(200).json(payload);
  };

  timeout = setTimeout(() => {
    eventEmitter.off(txId, handleLongOperationResult);
    return res.status(204).end();
  }, TIMEOUT_MS);

  eventEmitter.once(txId, handleLongOperationResult);
});

// This happens in a different process
const handleLongOperation = async (txId: string) => {
  if (txId === 'long') {
    // very long operation
    await new Promise((resolve) => setTimeout(resolve, 40 * 1000));
  }

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  // Randomly generate a payload
  const payload = {
    status: 'success',
    message: 'Long operation completed',
  };

  eventEmitter.emit(txId, payload);
};

export default router;
