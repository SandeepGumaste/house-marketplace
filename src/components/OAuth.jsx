import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";
const OAuth = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async (type) => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //   check for user and create if doesn't exist
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
        navigate("/");
      } else if (docSnap.exists() && type === "signIn") {
        navigate("/");

        toast.error("User already exists. Try Logging in.");
      } else if (docSnap.exists() && type === "signUp") {
        toast.error("User already exists. Try Logging in.");
      }
    } catch (error) {
      toast.error("Google authorization failed!");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="googleIcon" />
      </button>
    </div>
  );
};

export default OAuth;
