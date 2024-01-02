import "./Login.scss";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import Logo from "../../../assets/travem-logo-grey.png";

const Login = () => {
  return (
    <div className="login-form-wrapper">
      <div className="login-form-logo-wrapper">
        <img src={Logo} alt="" />
      </div>
      <form className="login-form-wrapper-form">
        <h2>Dobrodošao natrag!</h2>
        <Input
          label={"Korisničko ime"}
          placeholder={"Unesi korisničko ime"}
          name="username"
          onChange={() => {}}
          adminView
        />
        <Input
          label={"Lozinka"}
          placeholder={"Unesi lozinku"}
          name="password"
          onChange={() => {}}
          adminView
        />
        <Button type="submit" onClick={() => {}} grey>
          Prijavi se
        </Button>
      </form>
    </div>
  );
};

export default Login;
