import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingRef = collection(db, "listings");
        // create query
        const q = query(
          listingRef,
          where("offer", "==", true, orderBy("timeStamp", "desc"), limit(10))
        );
        // execute query
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
      } catch (error) {
        toast.error("Could not fetch Listings");
      }
    };

    fetchListings();
  }, [params]);

  const onFetchMore = async () => {
    try {
      // get reference
      const listingRef = collection(db, "listings");
      // create query
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // execute query
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prev) => [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch Listings");
    }
  };
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <React.Fragment>
          <main>
            <ul className="categoryListings">
              {listings.map((item) => (
                <ListingItem listing={item.data} id={item.id} key={item.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMore}>
              Load More
            </p>
          )}
        </React.Fragment>
      ) : (
        <p>No Current Offers</p>
      )}
    </div>
  );
};

export default Offers;
