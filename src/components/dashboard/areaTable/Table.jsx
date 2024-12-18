import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
    "Products",
    "Order ID",
    "Delivery Date",
    "Customer name",
    "Status",

    "Action",
];

const TABLE_DATA = [
    {
        id: 100,
        name: "Iphone 13 Pro",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "delivered",

    },
    {
        id: 101,
        name: "Macbook Pro",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "pending",

    },
    {
        id: 102,
        name: "Apple Watch",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "canceled",

    },
    {
        id: 103,
        name: "Microsoft Book",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "delivered",

    },
    {
        id: 104,
        name: "Apple Pen",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "delivered",

    },
    {
        id: 105,
        name: "Airpods",
        order_id: 11232,
        date: "Jun 29,2022",
        customer: "Afaq Karim",
        status: "delivered",

    },
];

const AreaTable = () => {
    return (
        <section className="content-area-table">
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
                        {TABLE_DATA?.map((dataItem) => {
                            return (
                                <tr key={dataItem.id}>
                                    <td>{dataItem.name}</td>
                                    <td>{dataItem.order_id}</td>
                                    <td>{dataItem.date}</td>
                                    <td>{dataItem.customer}</td>
                                    <td>
                                        <div className="dt-status">
                                            <span
                                                className={`dt-status-dot dot-${dataItem.status}`}
                                            ></span>
                                            <span className="dt-status-text">{dataItem.status}</span>
                                        </div>
                                    </td>

                                    <td className="dt-cell-action">
                                        <AreaTableAction />
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
