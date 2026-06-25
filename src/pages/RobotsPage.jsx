import "../styles/RobotsPage.css";

export default function RobotsPage({
  robots,
}) {

  return (

    <div className="robots-page">

      {/* HEADER */}

      <div className="robots-header">

        <h1>
          Robot Info
        </h1>

      </div>

      {/* TABLE */}

      <div className="robots-table">

        {/* TABLE HEADER */}

        <div className="table-head">

          <div>ID</div>

          <div>Name</div>

          <div>Position</div>

          <div>Battery</div>

          <div>Status</div>

        </div>

        {/* ROBOTS */}

        {
          Object.entries(robots).map(
            ([name, robot], index) => (

              <div
                key={name}
                className="table-row"
              >

                <div>
                  {index + 1}
                </div>

                <div>
                  {name}
                </div>

                <div>
                  X:
                  {robot.x?.toFixed(2)}
                  {" "}
                  Y:
                  {robot.y?.toFixed(2)}
                </div>

                <div>
                  {robot.battery || 100}%
                </div>

                <div>

                  <span
                    className={
                      robot.active
                        ? "status active"
                        : "status offline"
                    }
                  >

                    {
                      robot.active
                        ? "ACTIVE"
                        : "OFFLINE"
                    }

                  </span>

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}