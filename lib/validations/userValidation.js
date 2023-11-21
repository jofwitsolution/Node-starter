import yup from "yup";

async function validateSignup(data) {
  const schema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email().required().label("Email"),
    phone: yup.string().required().label("Phone number"),
    lastName: yup.string().min(2).max(50).required().label("Last name"),
    firstName: yup.string().min(2).max(50).required().label("First name"),
  });

  try {
    await schema.validate(data);

    return null;
  } catch (error) {
    console.error(error.errors[0]);
    return error.errors[0];
  }
}

async function validateSignin(data) {
  const schema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().required().label("Email"),
  });

  try {
    await schema.validate(data);

    return null;
  } catch (error) {
    console.error(error.errors[0]);
    return error.errors[0];
  }
}

export { validateSignin, validateSignup };
