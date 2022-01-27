class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.name = 'UserExistsError';
  }
}

module.exports = UserExistsError;
