import { useState, useEffect } from "react";
import axios from "axios";

export const FetchApi = () => {
  // const [datas, setDatas] = useState([]);

  function getData() {
    const url = "https://cloud.etica-inc.com/api/huachen_status";

    const res = axios.get(url).then((item) => console.log(item.data));
    // setDatas(data);
    return res;
    // console.log(datas);
  }
  useEffect(() => {
    //   const interval = setInterval(() => {
    getData();
    // }, 5000);

    //   return () => {
    //     clearInterval(interval);
    //   };
  }, []);
};
