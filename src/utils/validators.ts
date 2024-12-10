const validatePasswords = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  if (regex.test(password)) return true;
  else return false;
};
const ValidateConfirmPasswords = (password: string, confirmPass: string) => {
  let error;
  if (password != confirmPass) {
    error = "Password and confirm password must match!";
  }
  return error;
};

const validateEmailId = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(email);
  if (isValidEmail) return true;
  else return false;
};

export { ValidateConfirmPasswords, validateEmailId, validatePasswords };
