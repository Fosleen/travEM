import "./Login.scss";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import Logo from "../../../assets/images/travem-logo-grey.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { handleLogin } from "../../../api/users";

const Login = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignoreS
            errors.username = "Unesi korisničko ime";
          }

          if (!values.password) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignoreS
            errors.password = "Unesi lozinku";
          }

          return errors;
        }}
        onSubmit={handleLogin}
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