import { BaseAgent } from "./baseAgent.js";

export class RiskPolicyAgent extends BaseAgent {
  constructor() {
    super({ name: "RiskPolicyAgent" });
  }

  async process(message) {
    const { payload = {}, trace } = message;
    const { features = {}, acked = false } = payload;
    
    const { present, childIsMoving, T_out, t_still, gps, t_unacknowledged } = features;

    let state = "SAFE";
    let reason = "No risk";

    // Guard Clauses: The only "SAFE" conditions
    if (!present) {
      state = "SAFE";
      reason = "Child not present (seat unbuckled).";
    } 
    else if (T_out < 85) {
      state = "SAFE";
      reason = `Temperature ${T_out}F is below 85F threshold.`;
    }
    // ✅ FIX: If acknowledged, go to WATCH but DON'T send to CommsAgent
    else if (acked) {
      state = "WATCH";
      reason = `User acknowledged. Monitoring high-risk condition (T_out=${T_out}F).`;
      
      // ✅ Return directly to orchestrator (no alerts while acked)
      return this.ok({
        from: this.name,
        to: "ORCHESTRATOR",
        intent: "FINAL_PLAN",
        payload: { 
          approved: true, 
          plan: { state: "WATCH", steps: [] }, 
          context: { ...features } 
        },
        trace
      });
    }
    // Main Alert Logic: Child present + Hot + NOT acked
    else {
      state = "ALERT";
      
      if (childIsMoving) {
        reason = `Child is MOVING in a stationary hot car. T_out=${T_out}F.`;
      } else {
        reason = `Child has been STILL for ${t_still}s in a stationary hot car. T_out=${T_out}F.`;
      }
    }

    // If SAFE, return directly
    if (state === "SAFE") {
      return this.ok({
        from: this.name,
        to: "ORCHESTRATOR",
        intent: "FINAL_PLAN",
        payload: { approved: true, plan: { state: "SAFE", steps: [] }, context: { ...features } },
        trace
      });
    }

    // Otherwise (ALERT state), send to CommsAgent
    console.log(`RiskPolicyAgent: State=${state}, t_unacknowledged=${t_unacknowledged}, reason=${reason}`);
    
    return this.ok({
      from: this.name,
      to: "CommsAgent",
      intent: "CRAFT_MESSAGE",
      payload: { state, reason, context: { ...features } },
      trace
    });
  }
}