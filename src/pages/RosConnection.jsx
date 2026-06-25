import { useState,useRef,useEffect } from "react";
const ROSLIB = window.ROSLIB;
function RosConnection(p){
    useEffect(()=>{
        if (!ROSLIB) return;
        
        const ros = new ROSLIB.Ros({
            url: "ws://localhost:9090",
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

        },[])

    return null;

}
export default RosConnection;