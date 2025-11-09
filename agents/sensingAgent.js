import { BaseAgent } from "./baseAgent.js";

export class SensingAgent extends BaseAgent {
  constructor() {
    super({ name: "SensingAgent" });
  }

  async process(message) {
    const { payload = {}, trace } = message;
    const { telemetry = {}, acked = false } = payload;

    // --- UPDATED FEATURES ---
    const features = {
      // 1. "Child is Present" is true if the buckle is buckled.
      present: telemetry.buckle_state === "BUCKLED",
      
      // 2. "Child is Moving" is true ONLY if the PIR sensor sends "MOVING".
      childIsMoving: telemetry.motion_state === "MOVING",
      
      // 3. "t_still" is timer of *how long since last motion*.
      t_still: Number(telemetry.t_still ?? 0),

      // 4. ✅ NEW: Pass through the unacknowledged timer
      t_unacknowledged: Number(telemetry.t_unacknowledged ?? 0),
      
      T_out: Number(telemetry.outside_temp_f ?? 70),
      gps: telemetry.gps ?? null,
    };
    // --- END UPDATED FEATURES ---

    return this.ok({
      from: this.name,
      to: "RiskPolicyAgent",
      intent: "EVALUATE_RISK",
      payload: { features, acked },
      trace
    });
  }
}

