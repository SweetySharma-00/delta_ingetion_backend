import { Customer } from '../models/index.js';

export const findExistingExternalIds = async (externalIds) => {
  const customers = await Customer.findAll({
    attributes: ['external_id'],
    where: { external_id: externalIds }
  });
  return customers.map(c => c.external_id);
};

export const bulkInsert = async (customers, transaction) => {
  return Customer.bulkCreate(customers, { transaction, ignoreDuplicates: true });
};