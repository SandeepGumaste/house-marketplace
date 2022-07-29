import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { toast } from "react-toastify";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch listing");
      }
    };
    fetchListing();

    return () => {};
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <img
                src={url}
                style={{
                  objectFit: "cover",
                  maxHeight: "30vh",
                  width: "100%",
                }}
                alt="house-img"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type}</p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} Discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms} Bedroom{listing.bedrooms > 1 && "s"}
          </li>
          <li>
            {listing.bathrooms} Bathroom{listing.bathrooms > 1 && "s"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        {listing?.geolocation?.lat && listing?.geolocation?.lng && (
          <div>
            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
              <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
        {/*Map*/}

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
