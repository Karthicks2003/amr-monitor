// ========================================
// FleetStatusPanel.jsx
// ========================================

import { useMemo, useState } from "react";
import "../styles/FleetStatusPanel.css";

export default function FleetStatusPanel({
  robots,
}) {

  // =====================================
  // DROPDOWN STATE
  // =====================================

  const [openType, setOpenType] =
    useState(null);

  // =====================================
  // ROBOT ARRAY
  // =====================================

  const robotEntries = useMemo(() => {

    return Object.entries(
      robots || {}
    );

  }, [robots]);

  // =====================================
  // ACTIVE / INACTIVE
  // =====================================

  const activeRobots =
    robotEntries.filter(
      ([_, robot]) => robot.active
    );

  const inactiveRobots =
    robotEntries.filter(
      ([_, robot]) => !robot.active
    );

  const total =
    robotEntries.length || 1;

  const activePercent =
    (
      activeRobots.length / total
    ) * 100;

  const inactivePercent =
    (
      inactiveRobots.length / total
    ) * 100;

  // =====================================
  // DONUT
  // =====================================

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const activeStroke =
    (activePercent / 100) *
    circumference;

  return (

    <div className="fleet-status-panel">

      {/* ================================= */}
      {/* LEFT SIDE */}
      {/* ================================= */}

      <div className="fleet-left">

        <div className="fleet-title">
          Robot Status
        </div>

        {/* DONUT */}
        <div className="donut-container">

          <svg
            width="180"
            height="180"
          >

            {/* BG */}

            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#374151"
              strokeWidth="18"
              fill="none"
            />

            {/* ACTIVE */}

            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#10B981"
              strokeWidth="18"
              fill="none"
              strokeDasharray={`
                ${activeStroke}
                ${circumference}
              `}
              transform="
                rotate(-90 90 90)
              "
              strokeLinecap="round"
            />

            {/* TEXT */}

            <text
              x="90"
              y="85"
              textAnchor="middle"
              fill="white"
              fontSize="28"
              fontWeight="bold"
            >
              {robotEntries.length}
            </text>

            <text
              x="90"
              y="110"
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="14"
            >
              Robots
            </text>

          </svg>

        </div>

      </div>

      {/* ================================= */}
      {/* RIGHT SIDE */}
      {/* ================================= */}

      <div className="fleet-right">

        {/* ACTIVE */}

        <div
          className="status-card active-card"
          onClick={() =>
            setOpenType(
              openType === "active"
                ? null
                : "active"
            )
          }
        >

          <div className="status-header">

            <div>

              <div className="status-title active-text">
                Active Robots
              </div>

              <div className="status-percent">
                {activePercent.toFixed(0)}%
              </div>

            </div>

            <div className="status-number active-text">
              {activeRobots.length}
            </div>

          </div>

          {/* DROPDOWN */}

          {openType === "active" && (

            <div className="dropdown-list">

              {activeRobots.map(
                ([name]) => (

                  <div
                    key={name}
                    className="robot-item"
                  >

                    <span>{name}</span>

                    <span className="robot-active">
                      ACTIVE
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* INACTIVE */}

        <div
          className="status-card inactive-card"
          onClick={() =>
            setOpenType(
              openType === "inactive"
                ? null
                : "inactive"
            )
          }
        >

          <div className="status-header">

            <div>

              <div className="status-title inactive-text">
                Inactive Robots
              </div>

              <div className="status-percent">
                {inactivePercent.toFixed(0)}%
              </div>

            </div>

            <div className="status-number inactive-text">
              {inactiveRobots.length}
            </div>

          </div>

          {/* DROPDOWN */}

          {openType === "inactive" && (

            <div className="dropdown-list">

              {inactiveRobots.map(
                ([name]) => (

                  <div
                    key={name}
                    className="robot-item"
                  >

                    <span>{name}</span>

                    <span className="robot-inactive">
                      INACTIVE
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}