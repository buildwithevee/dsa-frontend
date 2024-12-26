import axios from "axios";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { apiBaseUrl } from "../../../constants/Constant";
import { useEffect, useState } from "react";

const AreaCards = () => {
  const [stats, setStats] = useState({})

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/product/stats`)
      console.log(response.data);
      setStats(response?.data?.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    fetchStats();
  }, [])
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Pc's",
          value: stats.totalPc,

        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "This month Pc's",
          value: stats.totalPCThisMonth,

        }}
      />

      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={100}
        cardInfo={{
          title: "Todays Pc's",
          value: stats.totalPCThisMonth,

        }}
      />
    </section>
  );
};

export default AreaCards;
