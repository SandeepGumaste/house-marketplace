import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import Category from "./pages/Category";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import EditListing from "./pages/EditListing";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/contact/:landlordId" element={<PrivateRoute />}>
            <Route path="/contact/:landlordId" element={<Contact />} />
          </Route>
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/edit-listing/:listingId" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer position="top-center" newestOnTop={true} />
    </>
  );
}

export default App;
