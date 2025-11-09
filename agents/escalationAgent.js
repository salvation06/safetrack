import { BaseAgent } from "./baseAgent.js";

// ✅ DEMO TIMER: Set to 30 seconds for the hackathon
const SOCIAL_MEDIA_THRESHOLD_SEC = 30;

export class EscalationAgent extends BaseAgent {
  constructor() {
    super({ name: "EscalationAgent" });
  }

  async process(message) {
    const { payload = {}, trace } = message;
    const { state, note, context } = payload;

    // 'note' now contains { title, body, socialPost }
    const { title, body, socialPost } = note;
    
    // ✅ FIX: Read the 't_unacknowledged' timer from the context
    const timeUnacknowledged = context.t_unacknowledged || 0;

    const plan = {
      state,
      steps: [
        // Tier 1: App Push
        { 
          tier: 1, 
          channel: "push", 
          target: "primary_caregiver", 
          timeout_sec: 120, 
          content: { title, body } 
        },
        // Tier 2: SMS Backup
        { 
          tier: 2, 
          channel: "sms", 
          target: "secondary_caregiver", 
          timeout_sec: 120, 
          content: { title, body } 
        }
      ]
    };

    // ✅ FIX: Trigger Tier 3 based on 'timeUnacknowledged'
    if (timeUnacknowledged >= SOCIAL_MEDIA_THRESHOLD_SEC) {
      console.log(`EscalationAgent: Unacked for ${timeUnacknowledged}s. Triggering Tier 3.`);
      plan.steps.push({
        tier: 3,
        channel: "social_media_mock",
        target: "@SafeTrackAlerts",
        timeout_sec: 0,
        content: {
          post: socialPost 
        }
      });
    }

    return this.ok({
      from: this.name,
      to: "ComplianceAgent",
      intent: "APPROVE_OUTBOUND",
      payload: { plan, context },
      trace
    });
  }
}
