import { Country, CustomerStatus } from '../models/index.js';

export const getCountryMap = async () => {
  const countries = await Country.findAll({ attributes: ['id', 'code'] });
  console.log("countries", countries)
  return Object.fromEntries(countries.map(c => [c.code.toUpperCase(), c.id]));
};

export const getStatusMap = async () => {
  const statuses = await CustomerStatus.findAll({ attributes: ['id', 'code'] });
  return Object.fromEntries(statuses.map(s => [s.code.toUpperCase(), s.id]));
};