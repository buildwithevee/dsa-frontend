import { MdMenu } from "react-icons/md";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { Sidebar } from "../components";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <main className="page-wrapper">
      {/* Toggle button visible only on small screens */}
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
        <MdMenu size={24} />
      </button>

      <Sidebar />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
