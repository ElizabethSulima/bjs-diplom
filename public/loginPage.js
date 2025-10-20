const userForm = new UserForm();

function handleApiResponseFactory(setErrorMessage) {
  return (response) => {
    if (response.success === true) {
      location.reload();
    } else {
      setErrorMessage(response.error);
    }
  };
}

userForm.loginFormCallback = (data) => {
  ApiConnector.login(
    data,
    handleApiResponseFactory(userForm.setLoginErrorMessage.bind(userForm))
  );
};

userForm.registerFormCallback = (data) => {
  ApiConnector.register(
    data,
    handleApiResponseFactory(userForm.setRegisterErrorMessage.bind(userForm))
  );
};
