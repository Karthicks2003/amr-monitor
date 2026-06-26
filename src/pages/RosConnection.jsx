// import { useState,useRef,useEffect } from "react";
// const ROSLIB = window.ROSLIB;
// function RosConnection(p){
//     useEffect(()=>{
//         if (!ROSLIB) return;
        
//         const ros = new ROSLIB.Ros({
//             url: "ws://localhost:9090",
//         });

//         ros.on("connection", () => {
//             p.setroscon(ros);
//         });

//         ros.on("error", () => {
//             p.setroscon(null);
//         });

//         ros.on("close", () => {
//             p.setroscon(null);
//         });

//         },[])

//     return null;

// }
// export default RosConnection;

import { useEffect } from "react";

const ROSLIB = window.ROSLIB;
const ROS_URL = import.meta.env.VITE_ROS_URL;

function RosConnection(p) {

  useEffect(() => {

    if (!ROSLIB) return;

    const wsUrl = ROS_URL.replace("https://", "wss://");

    const ros = new ROSLIB.Ros({
      url: wsUrl,
    });

    ros.on("connection", () => {
      p.setroscon(ros);
    });

    ros.on("error", () => {
      p.setroscon(null);
    });

    ros.on("close", () => {
      p.setroscon(null);
    });

  }, []);

  return null;
}

export default RosConnection;