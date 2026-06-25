import { useState } from "react";

import RosConnection from "./RosConnection";

import Sidebar from "../components/Sidebar";

import Dashboard from "./Dashboard";

import RobotsPage from "./RobotsPage";

import Mapping from "./Mapping";

import "../styles/Home.css";

function Home() {

  const [ros, setros] = useState(null);

  const [activePage, setActivePage] =
    useState("Dashboard");

  // GLOBAL ROBOTS

  const [robots, setRobots] =
    useState({});

  // GLOBAL MAP

  const [selectedMap, setSelectedMap] =
    useState(null);

  return (

    <div className="home-container">

      <RosConnection setroscon={setros} />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="main-content">

        {/* TOP BAR */}

        <div className="topbar">

          <div>

            <h2>{activePage}</h2>

            <p>
              AMR Fleet Monitoring System
            </p>

          </div>

          <div className="status-dot" />

        </div>

        {/* PAGE CONTENT */}

        <div className="content-area">

  {/* DASHBOARD */}

  <div
    style={{
      display:
        activePage === "Dashboard"
          ? "block"
          : "none",

      height: "100%"
    }}
  >

    <Dashboard
      roscon={ros}

      robots={robots}
      setRobots={setRobots}

      selectedMap={selectedMap}
      setSelectedMap={setSelectedMap}
    />

  </div>

  {/* ROBOTS */}

  <div
    style={{
      display:
        activePage === "Robots"
          ? "block"
          : "none",

      height: "100%"
    }}
  >

    <RobotsPage
      robots={robots}
    />

  </div>

  {/* MAPPING */}

  <div
    style={{
      display:
        activePage === "Mapping"
          ? "block"
          : "none",

      height: "100%"
    }}
  >

    <Mapping
      roscon={ros}

      selectedMap={selectedMap}
      setSelectedMap={setSelectedMap}
    />

  </div>

</div>

      </div>

    </div>
  );
}

export default Home;