export class BaseAgent {
  constructor({ name }) {
    this.name = name;
  }

  /**
   * Agent2Agent message envelope:
   * {
   * "type": "A2A_MESSAGE",
   * "from": "SensingAgent",
   * "to": "RiskPolicyAgent",
   * "intent": "EVALUATE_RISK",
   * "payload": { ...domainData... },
   * "trace": [{agent, intent, ts}]
   * }
   */
  async handle(message) {
    if (!message || message.type !== "A2A_MESSAGE") {
      return this.error("INVALID_MESSAGE", "Expected A2A_MESSAGE");
    }
    
    try {
      return this.process(message);
    } catch (e) {
      console.error(`Error in agent ${this.name}:`, e);
      return this.error("PROCESS_FAILED", e.message);
    }
  }

  // override in subclasses
  async process(message) {
    return this.error("NOT_IMPLEMENTED", "process() not implemented");
  }

  ok({ to, from, intent, payload, trace = [] }) {
    return {
      type: "A2A_MESSAGE",
      from,
      to,
      intent,
      payload,
      trace: [...trace, { agent: from, intent, ts: new Date().toISOString() }]
    };
  }

  error(code, detail) {
    return {
      type: "A2A_ERROR",
      agent: this.name,
      code,
      detail,
      ts: new Date().toISOString()
    };
  }
}
