class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
