// ========================================
// RobotInfoPanel.jsx
// ========================================

import { useState } from "react";
import "../styles/RobotInfoPanel.css";

export default function RobotInfoPanel({
  robots,
}) {

  // =====================================
  // OPEN ROBOT
  // =====================================

  const [selectedRobot, setSelectedRobot] =
    useState(null);

  // =====================================
  // TOGGLE
  // =====================================

  const handleToggle = (robotName) => {

    if (selectedRobot === robotName) {

      setSelectedRobot(null);

      return;
    }

    setSelectedRobot(robotName);
  };

  return (

    <div className="robot-info-panel">

      {/* TITLE */}

      <h2 className="robot-panel-title">
        Robots
      </h2>

      {/* ROBOTS */}

      {
        Object.entries(robots).map(
          ([name, robot]) => {

            const isOpen =
              selectedRobot === name;

            return (

              <div
                key={name}
                className="robot-card"
              >

                {/* HEADER */}

                <div
                  className="robot-card-header"
                  onClick={() =>
                    handleToggle(name)
                  }
                >

                  {/* LEFT */}

                  <div>

                    <div className="robot-name">
                      {name}
                    </div>

                    <div
                      className={
                        robot.active
                          ? "robot-status active"
                          : "robot-status offline"
                      }
                    >

                      {
                        robot.active
                          ? "ACTIVE"
                          : "OFFLINE"
                      }

                    </div>

                  </div>

                  {/* BATTERY */}

                  <div className="robot-battery">
                    🔋 {robot.battery}%
                  </div>

                </div>

                {/* DETAILS */}

                {
                  isOpen && (

                    <div className="robot-details">

                      <InfoRow
                        label="Model"
                        value={robot.model}
                      />

                      <InfoRow
                        label="Position X"
                        value={robot.x.toFixed(2)}
                      />

                      <InfoRow
                        label="Position Y"
                        value={robot.y.toFixed(2)}
                      />

                      <InfoRow
                        label="Theta"
                        value={robot.theta.toFixed(2)}
                      />

                      <InfoRow
                        label="Battery"
                        value={`${robot.battery}%`}
                      />

                      <InfoRow
                        label="Status"
                        value={
                          robot.active
                            ? "ACTIVE"
                            : "OFFLINE"
                        }
                      />

                    </div>
                  )
                }

              </div>
            );
          }
        )
      }

    </div>
  );
}

// ========================================
// INFO ROW
// ========================================

function InfoRow({
  label,
  value,
}) {

  return (

    <div className="info-row">

      <span className="info-label">
        {label}
      </span>

      <span className="info-value">
        {value}
      </span>

    </div>
  );
}