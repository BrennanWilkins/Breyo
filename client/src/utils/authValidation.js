const emailTest = (
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const getEmails = emails => {
  return emails.match(/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g);
};

export const isEmail = email => emailTest.test(email);

// validate the signup form inputs
export const signupValidation = (email, fullName,  pass, confPass) => {
  const nameTest = /^[ a-zA-Z]+$/;
  if (!email.length) {
    return 'Please enter your email.';
  }
  if (!pass.length) {
    return 'Your password cannot be empty.';
  }
  if (!fullName.length) {
    return 'Please enter your name';
  }
  if (fullName.length > 100) {
    return 'Your full name must be less than 100 characters.';
  }
  if (!isEmail(email)) {
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
  if (!fullName.match(nameTest)) {
    return 'Your full name can only be letters from a to z.';
  }
  return '';
};

export const loginValidation = (email, pass) => {
  if (!email.length) {
    return 'Please enter your email.';
  }
  if (!pass.length) {
    return 'Please enter your password.';
  }
  return '';
}

export const changePassValidation = (oldPass, newPass, confPass) => {
  if (!oldPass.length) {
    return 'Please enter your old password.';
  }
  if (!newPass.length) {
    return 'Please enter your new password.';
  }
  if (!confPass.length) {
    return 'Please re-enter your new password.';
  }
  if (newPass.length < 8) {
    return 'Your new password must be at least 8 characters.';
  }
  if (newPass.length > 100) {
    return 'Your new password cannot be over 100 characters.';
  }
  if (newPass !== confPass) {
    return 'New password and confirm password must be the same.';
  }
  return '';
};
