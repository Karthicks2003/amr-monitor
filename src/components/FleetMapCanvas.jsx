// ========================================
// FleetMapCanvas.jsx
// ========================================

import { useEffect, useRef } from "react";
import "../styles/FleetMapCanvas.css";

const ROSLIB = window.ROSLIB;

export default function FleetMapCanvas({
  ros,
  robots,
  setRobots,
}) {

  // ======================================
  // REFS
  // ======================================

  const canvasRef = useRef(null);

  const mapImageRef = useRef(null);

  const mapInfoRef = useRef(null);

  const robotsRef = useRef({});

  const initializedRef = useRef(false);

  const robotSubscribersRef = useRef({});

  const animationRef = useRef(null);

  // ======================================
  // CAMERA
  // ======================================

  const cameraRef = useRef({

    scale: 1,

    offsetX: 0,
    offsetY: 0,

    isDragging: false,

    lastX: 0,
    lastY: 0,
  });

  // ======================================
  // EFFECT
  // ======================================

  useEffect(() => {

    if (!ros) return;

    const canvas =
      canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    ctx.imageSmoothingEnabled =
      false;

    // ======================================
    // OFFSCREEN MAP
    // ======================================

    const mapCanvas =
      document.createElement("canvas");

    const mapCtx =
      mapCanvas.getContext("2d");

    // ======================================
    // RESIZE
    // ======================================

    const resizeCanvas = () => {

      const parent =
        canvas.parentElement;

      canvas.width =
        parent.clientWidth;

      canvas.height =
        parent.clientHeight;
    };

    // ======================================
    // WORLD TO MAP
    // ======================================

    const worldToMap = (
      wx,
      wy
    ) => {

      const mapInfo =
        mapInfoRef.current;

      if (!mapInfo) {

        return {
          x: wx * 50,
          y: -wy * 50,
        };
      }

      const resolution =
        mapInfo.resolution;

      const originX =
        mapInfo.origin.position.x;

      const originY =
        mapInfo.origin.position.y;

      const mx =
        (wx - originX) /
        resolution;

      const my =
        mapInfo.height -
        (wy - originY) /
        resolution;

      return {
        x: mx,
        y: my,
      };
    };

    // ======================================
    // GRID
    // ======================================

    const drawGrid = () => {

      const gridSize = 50;

      ctx.strokeStyle =
        "rgba(255,255,255,0.04)";

      ctx.lineWidth = 1;

      for (
        let x = 0;
        x < canvas.width;
        x += gridSize
      ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
          x,
          canvas.height
        );

        ctx.stroke();
      }

      for (
        let y = 0;
        y < canvas.height;
        y += gridSize
      ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
          canvas.width,
          y
        );

        ctx.stroke();
      }
    };

    // ======================================
    // PATHS
    // ======================================

    const drawRobotPaths = () => {

      const camera =
        cameraRef.current;

      Object.values(
        robotsRef.current
      ).forEach((robot) => {

        if (
          !robot.path ||
          robot.path.length < 2
        ) {
          return;
        }

        ctx.save();

        ctx.translate(
          camera.offsetX,
          camera.offsetY
        );

        ctx.scale(
          camera.scale,
          camera.scale
        );

        ctx.beginPath();

        robot.path.forEach(
          (point, index) => {

            const pos =
              worldToMap(
                point.x,
                point.y
              );

            if (index === 0) {

              ctx.moveTo(
                pos.x,
                pos.y
              );

            } else {

              ctx.lineTo(
                pos.x,
                pos.y
              );
            }
          }
        );

        ctx.strokeStyle =
          "rgba(59,130,246,0.8)";

        ctx.lineWidth =
          2 / camera.scale;

        ctx.stroke();

        ctx.restore();
      });
    };

    // ======================================
    // ROBOTS
    // ======================================

    const drawRobots = () => {

      const camera =
        cameraRef.current;

      Object.entries(
        robotsRef.current
      ).forEach(
        ([name, robot]) => {

          const pos =
            worldToMap(
              robot.x,
              robot.y
            );

          ctx.save();

          ctx.translate(
            camera.offsetX,
            camera.offsetY
          );

          ctx.scale(
            camera.scale,
            camera.scale
          );

          ctx.translate(
            pos.x,
            pos.y
          );

          ctx.rotate(
            -robot.theta
          );

          // ======================================
          // ROBOT COLOR
          // ======================================

          ctx.fillStyle =
            !robot.online
              ? "#6b7280"
              : robot.active
                ? "#22c55e"
                : "#ef4444";

          // ======================================
          // ROBOT BODY
          // ======================================

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            12,
            0,
            Math.PI * 2
          );

          ctx.fill();

          ctx.strokeStyle =
            "#ffffff";

          ctx.lineWidth =
            2 / camera.scale;

          ctx.stroke();

          // ======================================
          // DIRECTION LINE
          // ======================================

          ctx.beginPath();

          ctx.moveTo(0, 0);

          ctx.lineTo(20, 0);

          ctx.strokeStyle =
            "#ffffff";

          ctx.stroke();

          // ======================================
          // TEXT
          // ======================================

          ctx.rotate(robot.theta);

          ctx.scale(
            1 / camera.scale,
            1 / camera.scale
          );

          const text =
            `${name} (${robot.battery}%)`;

          const textWidth =
            ctx.measureText(text)
              .width;

          let batteryColor =
            "#22c55e";

          if (
            robot.battery < 60
          ) {

            batteryColor =
              "#facc15";
          }

          if (
            robot.battery < 30
          ) {

            batteryColor =
              "#ef4444";
          }

          ctx.fillStyle =
            batteryColor;

          ctx.font =
            "bold 14px Arial";

          ctx.fillText(
            text,
            18,
            -15
          );

          ctx.restore();
        }
      );
    };

    // ======================================
    // DRAW SCENE
    // ======================================

    const drawScene = () => {

      const camera =
        cameraRef.current;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.fillStyle =
        "#111827";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      drawGrid();

      // ======================================
      // MAP
      // ======================================

      if (mapImageRef.current) {

        ctx.save();

        ctx.translate(
          camera.offsetX,
          camera.offsetY
        );

        ctx.scale(
          camera.scale,
          camera.scale
        );

        ctx.drawImage(
          mapImageRef.current,
          0,
          0
        );

        ctx.restore();
      }

      drawRobotPaths();

      drawRobots();
    };

    // ======================================
    // RENDER LOOP
    // ======================================

    const renderLoop = () => {

      drawScene();

      animationRef.current =
        requestAnimationFrame(
          renderLoop
        );
    };

    // ======================================
    // MAP
    // ======================================

    const renderMap = (
      map
    ) => {

      mapInfoRef.current =
        map.info;

      const mapWidth =
        map.info.width;

      const mapHeight =
        map.info.height;

      mapCanvas.width =
        mapWidth;

      mapCanvas.height =
        mapHeight;

      const imageData =
        mapCtx.createImageData(
          mapWidth,
          mapHeight
        );

      for (
        let y = 0;
        y < mapHeight;
        y++
      ) {

        for (
          let x = 0;
          x < mapWidth;
          x++
        ) {

          const index =
            y * mapWidth + x;

          const value =
            map.data[index];

          let r, g, b;

          if (value === 0) {

            r = 240;
            g = 240;
            b = 240;

          } else if (
            value === 100
          ) {

            r = 30;
            g = 30;
            b = 30;

          } else {

            r = 110;
            g = 110;
            b = 110;
          }

          const flippedY =
            mapHeight -
            y -
            1;

          const pixel =
            (
              flippedY *
              mapWidth +
              x
            ) * 4;

          imageData.data[pixel + 0] = r;
          imageData.data[pixel + 1] = g;
          imageData.data[pixel + 2] = b;
          imageData.data[pixel + 3] = 255;
        }
      }

      mapCtx.putImageData(
        imageData,
        0,
        0
      );

      mapImageRef.current =
        mapCanvas;

      // ======================================
      // INITIAL FIT
      // ======================================

      if (
        !initializedRef.current
      ) {

        const camera =
          cameraRef.current;

        const scale =
          Math.min(
            canvas.width / mapWidth,
            canvas.height / mapHeight
          ) * 0.9;

        camera.scale = scale;

        camera.offsetX =
          (
            canvas.width -
            mapWidth * scale
          ) / 2;

        camera.offsetY =
          (
            canvas.height -
            mapHeight * scale
          ) / 2;

        initializedRef.current =
          true;
      }
    };

    // ======================================
    // ROBOT SUBSCRIBER
    // ======================================

    const createRobotSubscription = (
      robotName,
      odomTopic
    ) => {

      if (
        robotSubscribersRef.current[
          robotName
        ]
      ) {
        return;
      }

      setRobots((prev) => {

        const updated = {

          ...prev,

          [robotName]: {

            x: 0,
            y: 0,

            theta: 0,

            active: false,

            online: true,

            lastSeen:
              Date.now(),

            battery:
              Math.floor(
                Math.random() * 100
              ),

            model: "AMR",

            path: [],
          },
        };

        robotsRef.current =
          updated;

        return updated;
      });

      const topic =
        new ROSLIB.Topic({

          ros,

          name: odomTopic,

          messageType:
            "nav_msgs/Odometry",
        });

      topic.subscribe((msg) => {

        const position =
          msg.pose.pose.position;

        const orientation =
          msg.pose.pose.orientation;

        const siny =
          2 *
          (
            orientation.w *
            orientation.z +
            orientation.x *
            orientation.y
          );

        const cosy =
          1 -
          2 *
          (
            orientation.y *
            orientation.y +
            orientation.z *
            orientation.z
          );

        const yaw =
          Math.atan2(
            siny,
            cosy
          );

        const linearX =
          msg.twist.twist.linear.x;

        const angularZ =
          msg.twist.twist.angular.z;

        const isActive =
          Math.abs(linearX) > 0.01 ||
          Math.abs(angularZ) > 0.01;

        setRobots((prev) => {

          const oldRobot =
            prev[robotName] || {};

          const updated = {

            ...prev,

            [robotName]: {

              ...oldRobot,

              x: position.x,
              y: position.y,

              theta: yaw,

              active: isActive,

              online: true,

              lastSeen:
                Date.now(),

              path: [

                ...(oldRobot.path || []),

                {
                  x: position.x,
                  y: position.y,
                },

              ].slice(-200),
            },
          };

          robotsRef.current =
            updated;

          return updated;
        });
      });

      robotSubscribersRef.current[
        robotName
      ] = topic;
    };

    // ======================================
    // DISCOVER ROBOTS
    // ======================================

    const discoverRobots = () => {

      ros.getTopics((topics) => {

        const odomTopics =
          topics.topics.filter(
            (topic) => {

              return (
                topic.endsWith(
                  "/odom"
                ) &&
                topic !== "/odom"
              );
            }
          );

        odomTopics.forEach(
          (topicName) => {

            const robotName =
              topicName.split("/")[1];

            createRobotSubscription(
              robotName,
              topicName
            );
          }
        );
      });
    };

    // ======================================
    // OFFLINE CHECK
    // ======================================

    const offlineTimer =
      setInterval(() => {

        setRobots((prev) => {

          const updated = {
            ...prev,
          };

          Object.keys(
            updated
          ).forEach(
            (robotName) => {

              updated[
                robotName
              ].online =
                Date.now() -
                  updated[
                    robotName
                  ].lastSeen <
                3000;
            }
          );

          robotsRef.current =
            updated;

          return updated;
        });

      }, 1000);

    // ======================================
    // MAP TOPIC
    // ======================================

    const mapTopic =
      new ROSLIB.Topic({

        ros,

        name: "/map",

        messageType:
          "nav_msgs/OccupancyGrid",
      });

    mapTopic.subscribe(
      renderMap
    );

    discoverRobots();

    const discoverTimer =
      setInterval(
        discoverRobots,
        5000
      );

    // ======================================
    // ZOOM
    // ======================================

    const handleWheel = (
      e
    ) => {

      e.preventDefault();

      const camera =
        cameraRef.current;

      const zoom =
        e.deltaY < 0
          ? 1.1
          : 0.9;

      const mouseX =
        e.offsetX;

      const mouseY =
        e.offsetY;

      const worldX =
        (
          mouseX -
          camera.offsetX
        ) / camera.scale;

      const worldY =
        (
          mouseY -
          camera.offsetY
        ) / camera.scale;

      camera.scale *= zoom;

      camera.scale =
        Math.max(
          0.2,
          Math.min(
            camera.scale,
            20
          )
        );

      camera.offsetX =
        mouseX -
        worldX *
          camera.scale;

      camera.offsetY =
        mouseY -
        worldY *
          camera.scale;
    };

    // ======================================
    // PAN
    // ======================================

    const handleMouseDown = (
      e
    ) => {

      const camera =
        cameraRef.current;

      camera.isDragging =
        true;

      camera.lastX =
        e.clientX;

      camera.lastY =
        e.clientY;
    };

    const handleMouseMove = (
      e
    ) => {

      const camera =
        cameraRef.current;

      if (
        !camera.isDragging
      ) {
        return;
      }

      const dx =
        e.clientX -
        camera.lastX;

      const dy =
        e.clientY -
        camera.lastY;

      camera.offsetX += dx;

      camera.offsetY += dy;

      camera.lastX =
        e.clientX;

      camera.lastY =
        e.clientY;
    };

    const handleMouseUp = () => {

      cameraRef.current
        .isDragging = false;
    };

    // ======================================
    // EVENTS
    // ======================================

    canvas.addEventListener(
      "wheel",
      handleWheel
    );

    canvas.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    resizeCanvas();

    renderLoop();

    // ======================================
    // CLEANUP
    // ======================================

    return () => {

      cancelAnimationFrame(
        animationRef.current
      );

      clearInterval(
        offlineTimer
      );

      clearInterval(
        discoverTimer
      );

      mapTopic.unsubscribe();

      Object.values(
        robotSubscribersRef.current
      ).forEach((topic) => {

        topic.unsubscribe();
      });

      canvas.removeEventListener(
        "wheel",
        handleWheel
      );

      canvas.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };

  }, [ros]);

  // ======================================
  // JSX
  // ======================================

  return (

    <canvas
      ref={canvasRef}
      className="fleet_canvas"
    />

  );
}