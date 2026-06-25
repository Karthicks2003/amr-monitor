import { IoHome } from "react-icons/io5";

import { FaMapMarkerAlt } from "react-icons/fa";

import { RiRobot3Fill } from "react-icons/ri";

import { IoSettingsSharp } from "react-icons/io5";

import { FaUser } from "react-icons/fa";

import { IoMdNotifications } from "react-icons/io";

function Sidebar({
  activePage,
  setActivePage
}) {

  const menus = [

    {
      name: "Dashboard",
      icon: <IoHome />
    },

    {
      name: "Mapping",
      icon: <FaMapMarkerAlt />
    },

    {
      name: "Robots",
      icon: <RiRobot3Fill />
    },

    {
      name: "Tasks",
      icon: <IoMdNotifications />
    },

    {
      name: "Settings",
      icon: <IoSettingsSharp />
    },

    {
      name: "About",
      icon: <FaUser />
    },
  ];

  return (

    <div className="sidebar">

      <div className="sidebar-logo">
        AMR
      </div>

      <div className="sidebar-menu">

        {
          menus.map((item) => (

            <button
              key={item.name}

              className={
                activePage === item.name
                  ? "sidebar-button active"
                  : "sidebar-button"
              }

              onClick={() =>
                setActivePage(item.name)
              }
            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </button>
          ))
        }

      </div>

    </div>
  );
}

export default Sidebar;