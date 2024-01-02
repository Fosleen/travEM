import "./Login.scss";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import Logo from "../../../assets/travem-logo-grey.png";
import { Field, Formik, Form } from "formik";

const Login = () => {
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
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
            console.log("Vrijednosti su", values);
          }, 400);
        }}
      >
        {({ handleSubmit, isSubmitting, errors, touched }) => (
          <Form className="login-form-wrapper-form" onSubmit={handleSubmit}>
            <div className="login-form-title-wrapper">
              <h2>Dobrodošao natrag!</h2>
            </div>

            <Field
              name="username"
              type="text"
              as={Input}
              adminView
              label="Korisničko ime"
              error={touched.username && errors.username}
            />

            <Field
              name="password"
              type="password"
              as={Input}
              adminView
              label="Lozinka"
              error={touched.password && errors.password}
            />
            <div className="login-form-button-wrapper">
              <Button
                type="submit"
                disabled={isSubmitting}
                grey
                onClick={() => {}}
              >
                Prijavi se
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
