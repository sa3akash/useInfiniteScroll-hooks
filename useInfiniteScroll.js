import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useInfiniteScroll(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setData([]);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    axios({
      method: "GET",
      url: url,
      params: { _page: pageNumber },
    })
      .then((res) => {
        setData((prevBooks) => {
          return [...new Set([...prevBooks, ...res.data])];
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [pageNumber, url]);

  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (pageNumber >= 10) return; // limit to page numbers
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, pageNumber]
  );

  return { data, loading, error, lastElementRef };
}



// how to use 

// const { data, loading, error, lastElementRef } = useInfiniteScroll("https://jsonplaceholder.typicode.com/posts");



