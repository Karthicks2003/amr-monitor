// ========================================
// RobotControlPanel.jsx
// ========================================

import { useEffect, useRef, useState } from "react";
import nipplejs from "nipplejs";

import "../styles/RobotControlPanel.css";

const ROSLIB = window.ROSLIB;

export default function RobotControlPanel({
  ros,
  robots,
}) {

  // ========================================
  // STATES
  // ========================================

  const [selectedRobot, setSelectedRobot] =
    useState("");

  const [linearSpeed, setLinearSpeed] =
    useState(0.5);

  const [angularSpeed, setAngularSpeed] =
    useState(1.0);

  // ========================================
  // REFS
  // ========================================

  const joystickRef = useRef(null);

  const cmdVelRef = useRef(null);

  const moveTimerRef = useRef(null);

  // ========================================
  // CMD_VEL
  // ========================================

  useEffect(() => {

    if (!ros || !selectedRobot) {
      return;
    }

    const cmdVel =
      new ROSLIB.Topic({

        ros,

        name:
          `/${selectedRobot}/cmd_vel`,

        messageType:
          "geometry_msgs/Twist",
      });

    cmdVelRef.current = cmdVel;

    return () => {

      stopRobot();

      cmdVelRef.current = null;
    };

  }, [ros, selectedRobot]);

  // ========================================
  // SEND VELOCITY
  // ========================================

  const sendVelocity = (
    linear,
    angular
  ) => {

    if (!cmdVelRef.current) {
      return;
    }

    const twist =
      new ROSLIB.Message({

        linear: {
          x: linear,
          y: 0,
          z: 0,
        },

        angular: {
          x: 0,
          y: 0,
          z: angular,
        },
      });

    cmdVelRef.current.publish(
      twist
    );
  };

  // ========================================
  // STOP
  // ========================================

  const stopRobot = () => {

    for (let i = 0; i < 5; i++) {

      setTimeout(() => {

        sendVelocity(0, 0);

      }, i * 30);
    }
  };

  // ========================================
  // JOYSTICK
  // ========================================

  useEffect(() => {

    if (!joystickRef.current) {
      return;
    }

    const manager =
      nipplejs.create({

        zone:
          joystickRef.current,

        mode: "static",

        position: {
          left: "50%",
          top: "50%",
        },

        color: "#3b82f6",

        size: 170,

        restJoystick: true,

        restOpacity: 0.7,
      });

    // ========================================
    // MOVE
    // ========================================

    manager.on(
      "move",
      (event, nipple) => {

        if (!selectedRobot) {
          return;
        }

        if (!nipple) {
          return;
        }

        const distance =
          nipple.distance || 0;

        const radian =
          nipple.angle?.radian || 0;

        const force =
          Math.min(
            distance / 75,
            1
          );

        // DEADZONE

        if (force < 0.15) {

          sendVelocity(0, 0);

          return;
        }

        const linear =
          Math.sin(radian) *
          linearSpeed *
          force;

        const angular =
          -Math.cos(radian) *
          angularSpeed *
          force;

        clearTimeout(
          moveTimerRef.current
        );

        moveTimerRef.current =
          setTimeout(() => {

            sendVelocity(
              linear,
              angular
            );

          }, 20);
      }
    );

    // ========================================
    // END
    // ========================================

    manager.on(
      "end",
      () => {

        clearTimeout(
          moveTimerRef.current
        );

        stopRobot();
      }
    );

    return () => {

      manager.destroy();
    };

  }, [
    selectedRobot,
    linearSpeed,
    angularSpeed,
  ]);

  // ========================================
  // JSX
  // ========================================

  return (

    <div className="robot-control-panel">

      {/* LEFT */}

      <div className="control-left">

        {/* TOP BAR */}

        <div className="top-bar">

          <select
            value={selectedRobot}
            onChange={(e) =>
              setSelectedRobot(
                e.target.value
              )
            }
          >

            <option value="">
              Select Robot
            </option>

            {
              Object.keys(robots).map(
                (robotName) => (

                  <option
                    key={robotName}
                    value={robotName}
                  >
                    {robotName}
                  </option>
                )
              )
            }

          </select>

          <button
            className="stop-btn"
            onClick={stopRobot}
          >
            STOP
          </button>

        </div>

        {/* SPEED SECTION */}

        <div className="speed-section">

          {/* LINEAR */}

          <div className="slider-box">

            <div className="slider-header">

              <span>
                Linear Speed
              </span>

              <span>
                {linearSpeed.toFixed(1)}
              </span>

            </div>

            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={linearSpeed}
              onChange={(e) =>
                setLinearSpeed(
                  parseFloat(
                    e.target.value
                  )
                )
              }
              className="speed-slider"
            />

          </div>

          {/* ANGULAR */}

          <div className="slider-box">

            <div className="slider-header">

              <span>
                Angular Speed
              </span>

              <span>
                {angularSpeed.toFixed(1)}
              </span>

            </div>

            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={angularSpeed}
              onChange={(e) =>
                setAngularSpeed(
                  parseFloat(
                    e.target.value
                  )
                )
              }
              className="speed-slider"
            />

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="control-right">

        <div
          ref={joystickRef}
          className="joystick-area"
        />

      </div>

    </div>
  );
}