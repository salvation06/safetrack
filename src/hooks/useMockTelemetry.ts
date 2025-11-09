import { useState, useEffect, useCallback, useRef } from "react";
import { RiskState, TelemetryData, AlertEvent, AlertEventType } from "@/types/monitoring";

const API_URL = "https://safetrackv2-665484552551.us-central1.run.app/";
const SIMULATION_INTERVAL_MS = 5000;
const TEMP_INCREASE_PER_TICK = 0.5;
const MAX_TEMP = 95;
const START_TEMP = 80;
const TEMP_TO_TRIGGER_ALERTS_F = 85;

const baseTelemetry = {
  buckle_state: "BUCKLED",
  seat_presence: true,
  motion_state: "STILL",
  vehicle_moving: false,
  t_buckled: 0,
};

function getRandomCoords() {
  const cities = [
    { name: "Los Angeles, CA", lat: 34.0522, lon: -118.2437 },
    { name: "Houston, TX", lat: 29.7604, lon: -95.3698 },
    { name: "New York, NY", lat: 40.7128, lon: -74.0060 },
    { name: "Chicago, IL", lat: 41.8781, lon: -87.6298 },
    { name: "Miami, FL", lat: 25.7617, lon: -80.1918 },
  ];

  const city = cities[Math.floor(Math.random() * cities.length)];
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lonOffset = (Math.random() - 0.5) * 0.02;
  const lat = city.lat + latOffset;
  const lon = city.lon + lonOffset;

  console.log(`📍 Selected location: ${city.name} (${lat.toFixed(6)}, ${lon.toFixed(6)})`);

  return { 
    lat: parseFloat(lat.toFixed(6)), 
    lon: parseFloat(lon.toFixed(6)) 
  };
}

function stateToType(state: string): AlertEventType {
  switch (state) {
    case "CRITICAL": return "critical";
    case "ALERT": return "alert";
    case "WATCH": return "watch";
    case "SOCIAL": return "social";
    default: return "telemetry";
  }
}

export const useMockTelemetry = () => {
  const [riskState, setRiskState] = useState<RiskState>("SAFE");
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [isAcked, setIsAcked] = useState(false);
  const [gpsCoords] = useState(() => getRandomCoords());
  const [timeStill, setTimeStill] = useState(0);
  
  const [telemetry, setTelemetry] = useState<TelemetryData>(() => ({
    gps: gpsCoords,
    buckleState: "BUCKLED",
    seatPresence: true,
    motionState: "STILL",
    vehicleMoving: false,
    temperatureF: START_TEMP,
    battery: 100,
    connectionStatus: "wifi",
    timestamp: new Date().toISOString(),
  }));

  const timeElapsedRef = useRef(0);
  const currentTempRef = useRef(START_TEMP);
  const timeStillRef = useRef(0);
  const timeUnacknowledgedRef = useRef(0);
  const socialMediaPostedRef = useRef(false);
  const isAckedRef = useRef(false);

  useEffect(() => { isAckedRef.current = isAcked; }, [isAcked]);

  const runSimulationTick = useCallback(async () => {
    console.log("\n🔄 ========== NEW TICK ==========");
    
    const newTimeElapsed = timeElapsedRef.current + SIMULATION_INTERVAL_MS / 1000;
    const newTemp = currentTempRef.current < MAX_TEMP 
      ? currentTempRef.current + TEMP_INCREASE_PER_TICK 
      : MAX_TEMP;
    
    const newMotionState: "STILL" | "MOVING" = newTemp >= TEMP_TO_TRIGGER_ALERTS_F ? "MOVING" : "STILL";
    
    // ✅ FIX: timeStill only resets when motion changes from STILL to MOVING
    const newTimeStill = newMotionState === "STILL" 
      ? timeStillRef.current + SIMULATION_INTERVAL_MS / 1000 
      : 0;

    timeElapsedRef.current = newTimeElapsed;
    currentTempRef.current = newTemp;
    timeStillRef.current = newTimeStill;
    setTimeStill(newTimeStill);

    console.log(`📊 State: temp=${newTemp.toFixed(1)}°F, motion=${newMotionState}, timeStill=${newTimeStill.toFixed(0)}s, timeUnacked=${timeUnacknowledgedRef.current}s, isAcked=${isAckedRef.current}`);

    const currentTelemetry = {
      ...baseTelemetry,
      motion_state: newMotionState,
      t_still: newTimeStill,
      t_buckled: newTimeElapsed,
      outside_temp_f: newTemp,
      gps: gpsCoords,
      t_unacknowledged: timeUnacknowledgedRef.current,
    };

    const body = {
      telemetry: currentTelemetry,
      acked: isAckedRef.current,
    };

    try {
      const response = await fetch(`${API_URL}orchestrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Agent API Error: ${response.statusText}`);

      const data = await response.json();
      const finalPlan = data?.final_plan?.plan ?? {};
      const finalState = (finalPlan.state ?? "SAFE") as RiskState;

      console.log(`📥 API Response: state=${finalState}, steps=${finalPlan.steps?.length || 0}`);

      setTelemetry({
        gps: gpsCoords,
        buckleState: "BUCKLED",
        seatPresence: true,
        motionState: newMotionState,
        vehicleMoving: false,
        temperatureF: newTemp,
        battery: 100,
        connectionStatus: "wifi",
        timestamp: new Date().toISOString(),
      });
      
      setRiskState(finalState);

      // ✅ FIX: Only reset alert-related timers when SAFE, NOT timeStill
      if (finalState === "SAFE") {
        console.log("✅ State is SAFE - Resetting alert timers only");
        timeUnacknowledgedRef.current = 0;
        socialMediaPostedRef.current = false;
        // ✅ DON'T reset timeStill here - it should keep counting
        if (isAckedRef.current) {
          setIsAcked(false);
          isAckedRef.current = false;
        }
        return;
      }

      const socialStep = finalPlan.steps?.find(
        (step: any) => step.tier === 3 && step.channel === 'social_media_mock'
      );

      if (socialStep && !socialMediaPostedRef.current) {
        console.log("🚨 TIER 3 TRIGGERED: Posting to social media!");
        const postContent = socialStep.content?.post || "Public safety alert issued.";
        
        const socialAlert: AlertEvent = {
          id: `social-${Date.now()}`,
          message: postContent,
          type: 'social',
          riskState: finalState,
          timestamp: new Date().toISOString(),
          acknowledged: true,
          acknowledgedBy: "System",
        };
        
        setAlerts((prev) => [socialAlert, ...prev]);
        socialMediaPostedRef.current = true;
        isAckedRef.current = true;
        setIsAcked(true);
        
        console.log("✅ Social post created, auto-acknowledged");
        return;
      }

      if (finalState !== "SAFE" && !isAckedRef.current && !socialMediaPostedRef.current) {
        console.log(`⚠️ Creating alert #${alerts.length + 1}`);
        
        let commsContent = finalPlan?.steps?.[0]?.content 
          || data?.full_pipeline?.c?.payload?.note;

        let message = `${finalState} Alert`;
        if (commsContent?.title && commsContent?.body) {
          message = `${commsContent.title}: ${commsContent.body}`.trim();
        } else if (commsContent?.title) {
          message = commsContent.title;
        } else if (commsContent?.body) {
          message = commsContent.body;
        }

        const sanitized = message
          .replace(/undefined/gi, "")
          .replace(/\s+/g, " ")
          .trim();

        const finalMessage = sanitized && !sanitized.toLowerCase().includes("ai failure")
          ? sanitized
          : `${finalState}: Check vehicle immediately`;

        const newAlert: AlertEvent = {
          id: `alert-${Date.now()}-${Math.random()}`,
          message: finalMessage,
          type: stateToType(finalState),
          riskState: finalState,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        };

        setAlerts((prev) => {
          console.log(`✅ Alert added. Total alerts: ${prev.length + 1}`);
          return [newAlert, ...prev];
        });
      }

      if (finalState !== "SAFE" && !isAckedRef.current) {
        const newUnackedTime = timeUnacknowledgedRef.current + SIMULATION_INTERVAL_MS / 1000;
        timeUnacknowledgedRef.current = newUnackedTime;
        console.log(`⏱️ Unacked timer: ${newUnackedTime}s`);
      } else {
        timeUnacknowledgedRef.current = 0;
      }

    } catch (error) {
      console.error("❌ API Error:", error);
    }
  }, [gpsCoords, alerts.length]);

  useEffect(() => {
    console.log("🚀 Starting simulation timer");
    const timer = setInterval(runSimulationTick, SIMULATION_INTERVAL_MS);
    return () => {
      console.log("🛑 Stopping simulation timer");
      clearInterval(timer);
    };
  }, [runSimulationTick]);

  const acknowledgeAlert = (alertId: string) => {
    console.log(`✅ User acknowledged alert: ${alertId}`);
    setIsAcked(true);
    isAckedRef.current = true;
    timeUnacknowledgedRef.current = 0;
    
    setAlerts((prev) =>
      prev.map((alert) => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedBy: "User" } 
          : alert
      ),
    );
  };

  return {
    telemetry,
    riskState,
    alerts,
    acknowledgeAlert,
    timeStill,
  };
};