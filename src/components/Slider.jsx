import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "./Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    getListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map(({ data, id }) => {
            const navUrl = `/category/${data.type}/${id}`;
            return (
              <SwiperSlide key={id} onClick={() => navigate(navUrl)}>
                <img
                  src={data.imageUrls[0]}
                  alt="heroImage"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    maxHeight: "25vh",
                  }}
                />
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  {data.discountedPrice ?? data.regularPrice}$
                  {data.type === "rent" && " / month"}
                </p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
};

export default Slider;
