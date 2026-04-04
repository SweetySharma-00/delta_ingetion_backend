import { ingestCustomers } from '../services/customerService.js';
import customerSchema from '../validation/customerSchema.js';

export const ingest = async (req, res, next) => {
  try {
    const dryRun = req.query.dryRun === 'true';
    const payload = req.body;

    const validated = payload.map(p => {
      const { error, value } = customerSchema.validate(p);
      if (error) {
        error.isJoi = true; 
        throw error;
      }
      return value;
    });

    const result = await ingestCustomers(validated, dryRun);
    res.json(result);
  } catch (err) {
    next(err); 
  }
};