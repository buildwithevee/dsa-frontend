import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import axios from "axios"
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../../../constants/Constant";
import { ToastContainer } from "react-toastify";
// const TABLE_HEADS = [
//   "Products",
//   "Order ID",
//   "Delivery Date",
//   "Customer name",
//   "Status",

//   "Action",
// ];
const TABLE_HEADS = [
  "DeviceName",
  // "Order ID",
  "Model",
  "SerialNumber",
  "Assigned To",

  "Action",
];
// const TABLE_DATA = [
//   {
//     id: 100,
//     name: "Iphone 13 Pro",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "delivered",

//   },
//   {
//     id: 101,
//     name: "Macbook Pro",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "pending",

//   },
//   {
//     id: 102,
//     name: "Apple Watch",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "canceled",

//   },
//   {
//     id: 103,
//     name: "Microsoft Book",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "delivered",

//   },
//   {
//     id: 104,
//     name: "Apple Pen",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "delivered",

//   },
//   {
//     id: 105,
//     name: "Airpods",
//     order_id: 11232,
//     date: "Jun 29,2022",
//     customer: "Afaq Karim",
//     status: "delivered",

//   },
// ];

const AreaTable = () => {

  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(0);

  const fetchRecentProducts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/product/get-recent`);
      if (response.status === 200) {
        setProducts(response.data?.products)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    fetchRecentProducts();
  }, [reload])
  return (
    <section className="content-area-table">
      <ToastContainer />
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Orders</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products?.map((dataItem) => {
              return (
                <tr key={dataItem._id}>
                  <td>{dataItem.DeviceName}</td>

                  <td>{dataItem.Model}</td>
                  <td>{dataItem.SerialNumber}</td>
                  <td>{dataItem.AssignedTo}</td>

                  {/* <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.Compilance}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.Compilance}</span>
                    </div>
                  </td> */}

                  <td className="dt-cell-action">
                    <AreaTableAction id={dataItem._id} reload={setReload} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
