import sequelize from '../db.js';
import { DataTypes } from 'sequelize';
import CustomerModel from './customer.js';
import CountryModel from './country.js';
import CustomerStatusModel from './customerStatus.js';

const Customer = CustomerModel(sequelize, DataTypes);
const Country = CountryModel(sequelize, DataTypes);
const CustomerStatus = CustomerStatusModel(sequelize, DataTypes);

// Associations
Customer.belongsTo(Country, { foreignKey: 'country_id' });
Customer.belongsTo(CustomerStatus, { foreignKey: 'status_id' });

export { sequelize, Customer, Country, CustomerStatus };