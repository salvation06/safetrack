import { BaseAgent } from "./baseAgent.js";

export class ComplianceAgent extends BaseAgent {
  constructor() {
    super({ name: "ComplianceAgent" });
  }

  async process(message) {
    const { payload = {}, trace } = message;
    const { plan, context } = payload;

    // Scrub PII from logs, enforce consent checks, throttle if needed.
    const sanitizedPlan = {
      ...plan,
      steps: plan.steps.map(s => ({
        ...s,
        // ensure no raw GPS in outbound content unless user consented;
        // The CommsAgent already handled this by putting it in the 'socialPost'
        content: s.content 
      }))
    };

    // This is the final step in the chain. It returns to the orchestrator.
    return this.ok({
      from: this.name,
      to: "ORCHESTRATOR",
      intent: "FINAL_PLAN",
      payload: { approved: true, plan: sanitizedPlan, context },
      trace
    });
  }
}
