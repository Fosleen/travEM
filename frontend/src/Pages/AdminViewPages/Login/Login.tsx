//@ts-nocheck

import { useContext } from "react";
import "./Login.scss";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import Logo from "../../../assets/images/travem-logo-grey.avif";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginUser } from "../../../api/users";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useContext(AuthContext); // Get setUser from context

  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    await loginUser(values, navigate, {
      setSubmitting,
      setUser,
    });
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-form-logo-wrapper">
        <img src={Logo} alt="" />
      </div>

      <Formik
        initialValues={{ username: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = "Unesi korisničko ime";
          }

          if (!values.password) {
            errors.password = "Unesi lozinku";
          }

          return errors;
        }}
        onSubmit={handleLogin} // Pass the wrapper function
      >
        <Form className="login-form-wrapper-form">
          <div className="login-form-title-wrapper">
            <h2>Dobrodošao natrag!</h2>
          </div>

          <Field
            name="username"
            type="text"
            as={Input}
            adminView
            label="Korisničko ime"
          />
          <ErrorMessage name="username" component="div" />

          <Field
            name="password"
            type="password"
            as={Input}
            adminView
            label="Lozinka"
          />
          <ErrorMessage name="password" component="div" />

          <div className="login-form-button-wrapper">
            <Button type="submit" grey onClick={() => {}}>
              Prijavi se
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
