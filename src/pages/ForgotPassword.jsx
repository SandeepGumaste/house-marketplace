import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const onChange = (e) => {
    setEmail(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success(`Password reset link has been sent to
       ${email}`);
    } catch (error) {
      toast.error("Request failed. Please try again.");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            className="emailInput"
          />
          <Link className="forgotPasswordLink" to="/sign-in">
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="white" width={34} height={34} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
