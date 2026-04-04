export default (sequelize, DataTypes) => {
  const CustomerStatus = sequelize.define('CustomerStatus', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'customer_status',
    timestamps: false
  });

  return CustomerStatus;
};