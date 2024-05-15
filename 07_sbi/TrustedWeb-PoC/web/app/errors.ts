export const errorMessage = (error: Error) => {
  if (error.message.includes('Invariant failed:')) {
    if (error.message.includes('user type incorrect.')) {
      return 'Already logged in with another user type.';
    }
  }
  return 'unknown error.';
};
