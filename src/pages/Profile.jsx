import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { app } from "../firebase.config";
const Profile = () => {
  const [changeDetails, setChangeDetails] = useState(false);
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const onLogout = () => {
    authData.signOut();
    navigate("/");
  };
  useEffect(() => {
    const auth = getAuth(app);
    setAuthData(auth);
    setFormData({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
    });
  }, []);

  const { name, email } = formData;
  const onSubmit = async () => {
    try {
      if (authData.currentUser.displayName !== name) {
        // Update display name in firebase

        await updateProfile(authData.currentUser, {
          displayName: name,
        });
        // update in firestore
        const userRef = doc(db, "users", authData.currentUser.uid);
        await updateDoc(userRef, { name });
        toast.success("Saved");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  return !name ? (
    "Loading"
  ) : (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
