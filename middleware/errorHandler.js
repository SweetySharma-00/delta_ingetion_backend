export const errorHandler = (err, req, res, next) => {
  // Joi validation errors
  if (err.isJoi) {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.details.map(d => d.message)
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Record already exists'
    });
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Lookup value not found'
    });
  }

  // Fallback for unexpected errors
  console.error(err);
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong. Please try again later.'
  });
};