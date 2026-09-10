from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LeadScoreRequest(BaseModel):
    lead_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = "Technology"
    company_size: Optional[int] = 50
    source: Optional[str] = "WEBSITE"
    interaction_count: Optional[int] = 1
    email_opened: Optional[bool] = False
    website_visits: Optional[int] = 1
    annual_revenue: Optional[float] = 0.0

class LeadScoreResponse(BaseModel):
    lead_id: str
    score: int = Field(..., ge=0, le=100)
    conversion_probability: float
    grade: str # A, B, C, D
    top_factors: List[str]
    suggested_action: str

class DealRiskRequest(BaseModel):
    deal_id: str
    title: str
    value: float
    stage: str
    days_in_stage: int
    days_since_last_contact: int
    competitor_mentioned: Optional[bool] = False
    sentiment_score: Optional[float] = 0.5 # 0.0 to 1.0

class DealRiskResponse(BaseModel):
    deal_id: str
    risk_level: str # LOW, MEDIUM, HIGH, CRITICAL
    risk_score: int # 0 to 100
    risk_factors: List[str]
    recommended_mitigation: str

class CopilotQueryRequest(BaseModel):
    query: str
    organization_id: Optional[str] = None
    user_role: Optional[str] = "SALES_AGENT"
    context: Optional[Dict[str, Any]] = None

class CopilotQueryResponse(BaseModel):
    answer: str
    confidence: float
    action_type: Optional[str] = None # NAVIGATE, DRAFT_EMAIL, CREATE_TASK, SHOW_DEALS
    suggested_records: Optional[List[Dict[str, Any]]] = None

class EmailDraftRequest(BaseModel):
    recipient_name: str
    company_name: Optional[str] = None
    deal_stage: Optional[str] = None
    intent: str # FOLLOW_UP, INTRODUCTION, PROPOSAL_CHECKIN, REENGAGEMENT
    tone: Optional[str] = "PROFESSIONAL" # PROFESSIONAL, CASUAL, PERSUASIVE
    key_points: Optional[List[str]] = []

class EmailDraftResponse(BaseModel):
    subject: str
    body: str
    suggested_call_to_action: str

class CustomerIntelligenceRequest(BaseModel):
    customer_id: str
    name: str
    lifetime_value: float
    support_tickets_count: int
    last_interaction_days: int
    nps_score: Optional[int] = 8
    product_usage_frequency: Optional[str] = "DAILY" # DAILY, WEEKLY, RARELY

class CustomerIntelligenceResponse(BaseModel):
    customer_id: str
    health_score: int # 0 to 100
    status: str # HEALTHY, AT_RISK, CRITICAL
    churn_probability: float # 0.0 to 1.0
    upsell_opportunity: bool
    recommended_playbook: str

# ----------------- Multi-Agent AI OS Models -----------------

class AgentTaskRequest(BaseModel):
    task: str
    organization_id: Optional[str] = None
    user_id: Optional[str] = None
    agent_type: Optional[str] = "AUTO" # AUTO, SALES, SUPPORT, MARKETING, FINANCE, RESEARCH
    context: Optional[Dict[str, Any]] = None

class AgentTaskResponse(BaseModel):
    agent_type: str
    agent_name: str
    response: str
    confidence: float
    suggested_actions: List[Dict[str, Any]] = []
    reasoning_steps: List[str] = []

class AgentRouteRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class AgentRouteResponse(BaseModel):
    selected_agent: str
    reason: str
    confidence: float

# ----------------- Ask My CRM (Safe NL-to-SQL Analytics) -----------------

class AskCrmRequest(BaseModel):
    query: str
    organization_id: Optional[str] = None
    user_role: Optional[str] = "MANAGER"

class AskCrmResponse(BaseModel):
    answer: str
    generated_sql: Optional[str] = None
    data: Optional[List[Dict[str, Any]]] = None
    chart_type: Optional[str] = "METRIC" # METRIC, BAR, PIE, TABLE
    safety_check_passed: bool = True
