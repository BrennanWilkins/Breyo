// validate the signup form inputs
export const signupValidation = (email, fullName,  pass, confPass) => {
  const emailTest = (
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (email.length === 0) {
    return 'Please enter your email.';
  }
  if (pass.length === 0) {
    return 'Your password cannot be empty.';
  }
  if (fullName.length === 0) {
    return 'Please enter your name';
  }
  if (!emailTest.test(email)) {
    return 'Please enter a valid email.';
  }
  if (pass.length < 8) {
    return 'Your password must be at least 8 characters.';
  }
  if (pass.length > 100) {
    return 'Your password cannot be over 100 characters.';
  }
  if (pass !== confPass) {
    return 'Password and Confirm Password must be the same.';
  }
  return '';
};

export const loginValidation = (email, pass) => {
  if (email.length === 0) {
    return 'Please enter your email.';
  }
  if (pass.length === 0) {
    return 'Please enter your password.';
  }
  return '';
}
