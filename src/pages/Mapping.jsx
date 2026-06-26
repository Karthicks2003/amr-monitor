// ========================================
// Mapping.jsx
// ========================================

import { useEffect, useRef, useState } from "react";

import "../styles/Mapping.css";

const Mapping = ({
  roscon,
  selectedMap,
  setSelectedMap
}) => {

  const token =
    localStorage.getItem("token");

  const canvasRef =
    useRef(null);

  const mapCacheRef =
    useRef(null);

  const mapDataRef =
    useRef(null);

  const robotRef =
    useRef({
      x: 0,
      y: 0,
      theta: 0
    });

  const rafRef =
    useRef(null);

  const ROSLIB =
    window.ROSLIB;

  const [maps, setMaps] =
    useState([]);

  const [isPopupOpen, setPopupOpen] =
    useState(false);

  const [mapName, setMapName] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  // ========================================
  // FETCH MAPS
  // ========================================

  const fetchMaps = async () => {

    try {

      const res = await fetch(
        "https://occupant-perm-neurosis.ngrok-free.dev/maps",
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

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    fetchMaps();

  }, []);

  // ========================================
  // ROS MAP
  // ========================================

  useEffect(() => {

    if (!roscon || !ROSLIB) {
      return;
    }

    const drawRobot = () => {

      const canvas =
        canvasRef.current;

      const mapData =
        mapDataRef.current;

      const cache =
        mapCacheRef.current;

      if (
        !canvas ||
        !mapData ||
        !cache
      ) {
        return;
      }

      const ctx =
        canvas.getContext("2d");

      const {
        width,
        height,
        resolution,
        origin
      } = mapData.info;

      const cellSize = 4;

      ctx.putImageData(
        cache,
        0,
        0
      );

      const robot =
        robotRef.current;

      const rx =
        (robot.x -
          origin.position.x)
        / resolution;

      const ry =
        (robot.y -
          origin.position.y)
        / resolution;

      const px =
        rx * cellSize;

      const py =
        (height - ry - 1)
        * cellSize;

      ctx.save();

      ctx.translate(px, py);

      ctx.rotate(-robot.theta);

      // ROBOT BODY

      ctx.fillStyle =
        "#2563eb";

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        16,
        0,
        Math.PI * 2
      );

      ctx.fill();

      // DIRECTION

      ctx.strokeStyle =
        "white";

      ctx.lineWidth = 4;

      ctx.beginPath();

      ctx.moveTo(0, 0);

      ctx.lineTo(20, 0);

      ctx.stroke();

      ctx.restore();
    };

    const scheduleRobotDraw =
      () => {

        if (rafRef.current)
          return;

        rafRef.current =
          requestAnimationFrame(
            () => {

              rafRef.current =
                null;

              drawRobot();
            }
          );
      };

    const drawMap = (
      mapData
    ) => {

      const canvas =
        canvasRef.current;

      if (!canvas)
        return;

      const {
        width,
        height
      } = mapData.info;

      const cellSize = 4;

      canvas.width =
        width * cellSize;

      canvas.height =
        height * cellSize;

      const ctx =
        canvas.getContext("2d");

      const imgData =
        ctx.createImageData(
          canvas.width,
          canvas.height
        );

      const d =
        imgData.data;

      for (
        let y = 0;
        y < height;
        y++
      ) {

        for (
          let x = 0;
          x < width;
          x++
        ) {

          const val =
            mapData.data[
              y * width + x
            ];

          let bright = 220;

          if (val === 0)
            bright = 255;

          if (val === 100)
            bright = 90;

          const flippedY =
            height - y - 1;

          for (
            let dy = 0;
            dy < cellSize;
            dy++
          ) {

            for (
              let dx = 0;
              dx < cellSize;
              dx++
            ) {

              const idx =
                (
                  (
                    flippedY *
                    cellSize +
                    dy
                  ) *
                  canvas.width +
                  (
                    x *
                    cellSize +
                    dx
                  )
                ) * 4;

              d[idx] =
                bright;

              d[idx + 1] =
                bright;

              d[idx + 2] =
                bright;

              d[idx + 3] =
                255;
            }
          }
        }
      }

      ctx.putImageData(
        imgData,
        0,
        0
      );

      mapCacheRef.current =
        imgData;

      drawRobot();
    };

    // MAP TOPIC

    const mapTopic =
      new ROSLIB.Topic({

        ros: roscon,

        name: "/map",

        messageType:
          "nav_msgs/OccupancyGrid",
      });

    mapTopic.subscribe(
      (msg) => {

        mapDataRef.current =
          msg;

        drawMap(msg);
      }
    );

    // ODOM

    const odomTopic =
      new ROSLIB.Topic({

        ros: roscon,

        name:
          "/robot1/odom",

        messageType:
          "nav_msgs/Odometry",
      });

    odomTopic.subscribe(
      (msg) => {

        const pos =
          msg.pose.pose.position;

        const ori =
          msg.pose.pose.orientation;

        const siny =
          2 *
          (
            ori.w * ori.z +
            ori.x * ori.y
          );

        const cosy =
          1 -
          2 *
          (
            ori.y * ori.y +
            ori.z * ori.z
          );

        robotRef.current = {

          x: pos.x,

          y: pos.y,

          theta:
            Math.atan2(
              siny,
              cosy
            ),
        };

        scheduleRobotDraw();
      }
    );

    return () => {

      mapTopic.unsubscribe();

      odomTopic.unsubscribe();

      if (rafRef.current) {

        cancelAnimationFrame(
          rafRef.current
        );
      }
    };

  }, [roscon]);

  // ========================================
  // SAVE MAP
  // ========================================

  const saveMap = async () => {

    if (!mapName) {

      alert(
        "Enter map name"
      );

      return;
    }

    setIsSaving(true);

    try {

      const res = await fetch(
        "https://occupant-perm-neurosis.ngrok-free.dev/save-map",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            name: mapName
          })
        }
      );

      const data =
        await res.json();

      if (!data.error) {

        await fetchMaps();

        setMapName("");

        setPopupOpen(false);

        alert(
          "Map Saved"
        );
      }

    } catch (err) {

      console.log(err);
    }

    setIsSaving(false);
  };

  return (

    <div className="mapping-page">

      {/* ========================================
          LEFT
      ======================================== */}

      <div className="mapping-sidebar">

        <div className="mapping-header">

          <div>

            <h2>
              Saved Maps
            </h2>

            <p>
              Select navigation map
            </p>

          </div>

          <button
            className="new-map-btn"
            onClick={() =>
              setPopupOpen(true)
            }
          >
            +
          </button>

        </div>

        <div className="mapping-list">

          {
            maps.map((map) => (

              <div
                key={map.id}

                className={
                  selectedMap ===
                  map.name
                    ? "mapping-card active"
                    : "mapping-card"
                }

                onClick={() =>
                  setSelectedMap(
                    map.name
                  )
                }
              >

                <h3>
                  {map.name}
                </h3>

                <p>
                  Navigation Map
                </p>

              </div>
            ))
          }

        </div>

      </div>

      {/* ========================================
          RIGHT
      ======================================== */}

      <div className="mapping-view">

        <div className="mapping-topbar">

          <div>

            <h2>
              Live Mapping
            </h2>

            <p>
              Real-time SLAM view
            </p>

          </div>

          <button
            className="save-btn"
            onClick={() =>
              setPopupOpen(true)
            }
          >
            Save Map
          </button>

        </div>

        <div className="map-canvas-wrapper">

          <canvas
            ref={canvasRef}
            className="mapping-canvas"
          />

        </div>

      </div>

      {/* ========================================
          SAVE POPUP
      ======================================== */}

      {
        isPopupOpen && (

          <div className="popup-overlay">

            <div className="save-popup">

              <h2>
                Save Map
              </h2>

              <input
                type="text"

                placeholder="Enter map name"

                value={mapName}

                onChange={(e) =>
                  setMapName(
                    e.target.value
                  )
                }
              />

              <div className="popup-buttons">

                <button
                  onClick={() =>
                    setPopupOpen(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  onClick={saveMap}
                >
                  {
                    isSaving
                      ? "Saving..."
                      : "Save"
                  }
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Mapping;