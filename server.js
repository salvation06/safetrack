import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SensingAgent } from "./agents/sensingAgent.js";
import { RiskPolicyAgent } from "./agents/riskPolicyAgent.js";
import { CommsAgent } from "./agents/commsAgent.js";
import { EscalationAgent } from "./agents/escalationAgent.js";
import { ComplianceAgent } from "./agents/complianceAgent.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const agents = {
  SensingAgent: new SensingAgent(),
  RiskPolicyAgent: new RiskPolicyAgent(),
  CommsAgent: new CommsAgent(),
  EscalationAgent: new EscalationAgent(),
  ComplianceAgent: new ComplianceAgent()
};

/** Generic agent endpoint: POST /agents/:name  */
app.post("/agents/:name", async (req, res) => {
  const name = req.params.name;
  const agent = agents[name];
  if (!agent) return res.status(404).json({ error: `Unknown agent: ${name}` });

  try {
    const msg = req.body;
    const result = await agent.handle(msg);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

/**
 * Orchestrator: chains Sensing -> RiskPolicy -> Comms -> Escalation -> Compliance
 * POST /orchestrate
 * body: { telemetry: {...}, acked?: boolean }
 */
app.post("/orchestrate", async (req, res) => {
  try {
    const initial = {
      type: "A2A_MESSAGE",
      from: "Client",
      to: "SensingAgent",
      intent: "NORMALIZE_TELEMETRY",
      payload: { telemetry: req.body.telemetry, acked: !!req.body.acked },
      trace: [{ agent: "Client", intent: "START", ts: new Date().toISOString() }]
    };

    // This is your Agent2Agent orchestration chain
    const s = await agents.SensingAgent.handle(initial);
    if (s.type === 'A2A_ERROR') throw new Error(s.detail);

    const r = await agents.RiskPolicyAgent.handle(s);
    if (r.type === 'A2A_ERROR') throw new Error(r.detail);

    const c = await agents.CommsAgent.handle(r);
    if (c.type === 'A2A_ERROR') throw new Error(c.detail);

    const e = await agents.EscalationAgent.handle(c);
    if (e.type === 'A2A_ERROR') throw new Error(e.detail);
    
    const k = await agents.ComplianceAgent.handle(e);
    if (k.type === 'A2A_ERROR') throw new Error(k.detail);

    // Final plan is in 'k'
    res.json({ final_plan: k.payload, trace: k.trace, full_pipeline: { s, r, c, e, k } });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Agents service listening on :${PORT}`));