from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    LeadScoreRequest, LeadScoreResponse,
    DealRiskRequest, DealRiskResponse,
    CopilotQueryRequest, CopilotQueryResponse,
    EmailDraftRequest, EmailDraftResponse,
    CustomerIntelligenceRequest, CustomerIntelligenceResponse,
    AgentTaskRequest, AgentTaskResponse,
    AgentRouteRequest, AgentRouteResponse,
    AskCrmRequest, AskCrmResponse
)
from engine import (
    CrmAiEngine,
    SalesAgent,
    SupportAgent,
    MarketingAgent,
    FinanceAgent,
    ResearchAgent,
    AgentRouter,
    AskCrmEngine
)

app = FastAPI(
    title="Nexus Enterprise CRM - AI Intelligence OS",
    version="2.0.0",
    description="Enterprise AI Satellite Service providing Multi-Agent AI Orchestration, Ask My CRM Natural Language SQL Analytics, Copilot, and Predictive Scoring."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "UP", "service": "crm-ai-intelligence", "version": "2.0.0"}

# ----------------- Predictive Analytics -----------------

@app.post("/api/v1/ai/lead-score", response_model=LeadScoreResponse)
def score_lead(req: LeadScoreRequest):
    return CrmAiEngine.calculate_lead_score(req)

@app.post("/api/v1/ai/deal-risk", response_model=DealRiskResponse)
def assess_deal_risk(req: DealRiskRequest):
    return CrmAiEngine.assess_deal_risk(req)

@app.post("/api/v1/ai/copilot", response_model=CopilotQueryResponse)
def copilot_query(req: CopilotQueryRequest):
    return CrmAiEngine.answer_copilot(req)

@app.post("/api/v1/ai/email-draft", response_model=EmailDraftResponse)
def draft_email(req: EmailDraftRequest):
    return CrmAiEngine.draft_email(req)

@app.post("/api/v1/ai/customer-intelligence", response_model=CustomerIntelligenceResponse)
def customer_intelligence(req: CustomerIntelligenceRequest):
    return CrmAiEngine.calculate_customer_health(req)

# ----------------- Multi-Agent AI System -----------------

@app.post("/api/v1/ai/agent/route", response_model=AgentRouteResponse)
def route_agent_query(req: AgentRouteRequest):
    return AgentRouter.route(req)

@app.post("/api/v1/ai/agent/sales", response_model=AgentTaskResponse)
def sales_agent_endpoint(req: AgentTaskRequest):
    return SalesAgent.execute(req)

@app.post("/api/v1/ai/agent/support", response_model=AgentTaskResponse)
def support_agent_endpoint(req: AgentTaskRequest):
    return SupportAgent.execute(req)

@app.post("/api/v1/ai/agent/marketing", response_model=AgentTaskResponse)
def marketing_agent_endpoint(req: AgentTaskRequest):
    return MarketingAgent.execute(req)

@app.post("/api/v1/ai/agent/finance", response_model=AgentTaskResponse)
def finance_agent_endpoint(req: AgentTaskRequest):
    return FinanceAgent.execute(req)

@app.post("/api/v1/ai/agent/research", response_model=AgentTaskResponse)
def research_agent_endpoint(req: AgentTaskRequest):
    return ResearchAgent.execute(req)

@app.post("/api/v1/ai/agent/execute", response_model=AgentTaskResponse)
def execute_agent_task(req: AgentTaskRequest):
    agent_type = (req.agent_type or "AUTO").upper()
    if agent_type == "AUTO":
        route = AgentRouter.route(AgentRouteRequest(query=req.task, context=req.context))
        agent_type = route.selected_agent

    if agent_type == "SALES":
        return SalesAgent.execute(req)
    elif agent_type == "SUPPORT":
        return SupportAgent.execute(req)
    elif agent_type == "MARKETING":
        return MarketingAgent.execute(req)
    elif agent_type == "FINANCE":
        return FinanceAgent.execute(req)
    elif agent_type == "RESEARCH":
        return ResearchAgent.execute(req)
    else:
        return SalesAgent.execute(req)

# ----------------- Ask My CRM Natural Language SQL -----------------

@app.post("/api/v1/ai/ask-crm", response_model=AskCrmResponse)
def ask_crm_endpoint(req: AskCrmRequest):
    return AskCrmEngine.process_query(req)

# ----------------- Model Router & Context Firewall -----------------

from router import ModelRouter

@app.get("/api/v1/ai/router/providers")
def get_model_providers():
    return {"status": "SUCCESS", "providers": ModelRouter.PROVIDERS}

@app.post("/api/v1/ai/router/dispatch")
def dispatch_model_router(payload: dict):
    prompt = payload.get("prompt", "")
    task_type = payload.get("task_type", "GENERAL")
    privacy_mode = payload.get("privacy_mode", False)
    return ModelRouter.dispatch_prompt(prompt, task_type, privacy_mode)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
