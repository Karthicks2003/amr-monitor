import { useEffect, useRef, useState } from "react";

import "../styles/Dashboard.css";

import FleetMapCanvas from "../components/FleetMapCanvas";

import RobotInfoPanel from "../components/RobotInfoPanel";

import RobotControlPanel from "../components/RobotControlPanel";

import FleetStatusPanel from "../components/FleetStatusPanel";

const Dashboard = ({
  roscon,
  robots,
  setRobots,
  selectedMap,
  setSelectedMap
}) => {


    const [maps, setMaps] =
        useState([]);

    const fetchedRef =
        useRef(false);

    const token =
        localStorage.getItem("token");

    // =========================
    // FETCH MAPS
    // =========================

    const fetchMaps = async () => {

        try {

            const res = await fetch(
                "http://localhost:8000/maps",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await res.json();

            setMaps(data.maps || []);

        } catch (err) {

            console.log(err);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        if (fetchedRef.current)
            return;

        fetchedRef.current = true;

        fetchMaps();

    }, []);

    // =========================
    // LOAD MAP
    // =========================

    const loadMap = async (
        mapName
    ) => {

        try {

            const res = await fetch(
                "http://localhost:8000/navigation-map",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: mapName
                    })
                }
            );

            const data =
                await res.json();

            if (!data.error) {

                setSelectedMap(
                    mapName
                );
            }

        } catch (err) {

            console.log(err);
        }
    };

    return (

        <div className="dashboard_page">

            {/* =======================
                TOP SECTION
            ======================= */}

            <div className="home_container">

                {/* =======================
                    MAP
                ======================= */}

                <div className="canvas_map">

                    {
                        selectedMap ? (

                            <FleetMapCanvas
                                ros={roscon}
                                robots={robots}
                                setRobots={setRobots}
                            />

                        ) : (

                            <div className="empty_map">

                                <h2>
                                    No Map Selected
                                </h2>

                                <p>
                                    Select a saved map
                                    from the right panel
                                </p>

                            </div>
                        )
                    }

                </div>

                {/* =======================
                    RIGHT PANEL
                ======================= */}

                <div className="side_container">

                    {/* MAP LIST */}

                    <div className="map_bar">

                        <div className="section-header">

                            <h2>
                                Saved Maps
                            </h2>

                        </div>

                        <div className="map_list">

                            {
                                maps.map((map) => (

                                    <div
                                        key={map.id}

                                        className="map_card"

                                        onClick={() =>
                                            loadMap(
                                                map.name
                                            )
                                        }
                                    >

                                        <div>

                                            <h3>
                                                {map.name}
                                            </h3>

                                            <p>
                                                Navigation Map
                                            </p>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                    {/* ROBOT INFO */}

                    <div className="task_bar">

                        <RobotInfoPanel
                            robots={robots}
                        />

                    </div>

                </div>

            </div>

            {/* =======================
                BOTTOM SECTION
            ======================= */}

            <div className="below_container">

    {/* CONTROL PANEL */}

    <div className="control_panel">

        <RobotControlPanel
            ros={roscon}
            robots={robots}
        />

    </div>

    {/* ROBOT STATUS */}

    <div className="robot_status">

        <FleetStatusPanel
            robots={robots}
        />

    </div>

</div>

        </div>
    );
};

export default Dashboard;