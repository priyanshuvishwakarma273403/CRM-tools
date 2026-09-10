import math
import re
from typing import Dict, Any, List
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

# ----------------- Specialized Agents -----------------

class SalesAgent:
    @staticmethod
    def execute(req: AgentTaskRequest) -> AgentTaskResponse:
        task = req.task.lower()
        context = req.context or {}
        
        reasoning = [
            "Analyzed opportunity pipeline stage, deal size, and historical close velocity.",
            "Cross-referenced buyer personas with ICP qualification criteria.",
            "Formulated action strategy to maximize win probability and reduce cycle time."
        ]
        
        if "objection" in task or "pricing" in task or "budget" in task:
            response = (
                "Strategy for Objection Handling:\n"
                "1. Acknowledge the budget constraint and reframe the conversation from 'cost' to 'net ROI payback timeline'.\n"
                "2. Offer phased milestone deployment rather than an upfront enterprise commitment.\n"
                "3. Share our recent case study showcasing a 3.4x sales velocity increase within 90 days."
            )
            actions = [
                {"action": "DRAFT_OBJECTION_REBUTTAL", "label": "Draft ROI-centered email response"},
                {"action": "CREATE_TASK", "title": "Schedule Executive Sponsor Alignment Call"}
            ]
        elif "close" in task or "negotiate" in task or "proposal" in task:
            response = (
                "Deal Closing Recommendation:\n"
                "• Confirm that the economic buyer and legal compliance team have signed off on the security SLA.\n"
                "• Implement a time-limited incentive (e.g. waived onboarding fees) valid until end-of-month.\n"
                "• Coordinate an implementation kick-off calendar invite ahead of signature to build forward momentum."
            )
            actions = [
                {"action": "GENERATE_CONTRACT", "label": "Generate Final Proposal Document"},
                {"action": "SET_REMINDER", "title": "Follow up with procurement in 48 hours"}
            ]
        else:
            response = (
                f"Sales Analysis for: '{req.task}':\n"
                "Target accounts should be qualified using MEDDIC criteria. Focus your efforts on deals where the champion has high political capital and urgent pain points around team collaboration."
            )
            actions = [
                {"action": "FILTER_PIPELINE", "label": "View High Velocity Deals"}
            ]

        return AgentTaskResponse(
            agent_type="SALES",
            agent_name="Nexus Sales Strategist",
            response=response,
            confidence=0.93,
            suggested_actions=actions,
            reasoning_steps=reasoning
        )


class SupportAgent:
    @staticmethod
    def execute(req: AgentTaskRequest) -> AgentTaskResponse:
        task = req.task.lower()
        
        reasoning = [
            "Evaluated sentiment score and urgency level of customer query.",
            "Determined SLA priority tier based on account SLA agreement.",
            "Identified potential root cause and drafted empathetic resolution response."
        ]

        if "refund" in task or "billing" in task or "overcharge" in task:
            response = (
                "Support Triage & Resolution:\n"
                "• Immediate Action: Acknowledge the invoice concern warmly and reassure the customer that their account is being audited.\n"
                "• Investigation: Review recent automated subscription renewal records against the approved quote.\n"
                "• Mitigation: If credit is due, issue a billing credit memo immediately and update the finance ledger."
            )
            actions = [
                {"action": "NOTIFY_FINANCE", "label": "Flag invoice for review"},
                {"action": "SEND_EMPATHY_REPLY", "label": "Send empathetic acknowledgment email"}
            ]
        elif "down" in task or "error" in task or "bug" in task:
            response = (
                "Incident Diagnostics:\n"
                "• Severity: HIGH (P1 Alert).\n"
                "• Diagnostic: Check service latency metrics and recent deploy status.\n"
                "• Communication: Post customer-facing status update and engage engineering on-call."
            )
            actions = [
                {"action": "CREATE_INCIDENT_TICKET", "label": "Create Jira P1 Incident"},
                {"action": "BROADCAST_STATUS", "label": "Post Customer Status Update"}
            ]
        else:
            response = (
                f"Support Plan for '{req.task}':\n"
                "The ticket has been cataloged under standard SLA guidelines. Recommended next step is to confirm user reproduction steps and verify error logs."
            )
            actions = [
                {"action": "REQUEST_LOGS", "label": "Request Diagnostics from Customer"}
            ]

        return AgentTaskResponse(
            agent_type="SUPPORT",
            agent_name="Nexus Support Concierge",
            response=response,
            confidence=0.95,
            suggested_actions=actions,
            reasoning_steps=reasoning
        )


class MarketingAgent:
    @staticmethod
    def execute(req: AgentTaskRequest) -> AgentTaskResponse:
        reasoning = [
            "Analyzed target persona demographic, industry segment, and pain triggers.",
            "Generated high-conversion subject line options with A/B variant testing.",
            "Constructed personalized body copy with clear single Call-to-Action (CTA)."
        ]

        response = (
            f"Campaign Strategy & Outreach Sequence:\n\n"
            f"Target Topic: {req.task}\n\n"
            "Email Variant A (Direct & Value-Driven):\n"
            "Subject: Modernizing your team's customer engagement workflows\n"
            "Preview: How modern SaaS teams eliminate context switching...\n\n"
            "Hi {{FirstName}},\n\n"
            "Most high-growth teams lose 4+ hours every week juggling disparate tools for CRM, support, and sales outreach.\n\n"
            "Our centralized CRM OS unifies Customer 360, AI Copilots, and multichannel communications in one unified platform.\n\n"
            "Would you be open to a quick 10-minute demo this Thursday?\n\n"
            "Best,\n{{SenderName}}\n\n"
            "Email Variant B (Social Proof & Metric-Driven):\n"
            "Subject: 3.4x faster pipeline velocity at TechCorp\n"
            "Focus: Highlight case studies and concrete operational savings."
        )

        actions = [
            {"action": "SAVE_EMAIL_TEMPLATE", "label": "Save to Campaign Templates"},
            {"action": "CREATE_AUDIENCE_SEGMENT", "label": "Build Dynamic Segment"}
        ]

        return AgentTaskResponse(
            agent_type="MARKETING",
            agent_name="Nexus Campaign Architect",
            response=response,
            confidence=0.91,
            suggested_actions=actions,
            reasoning_steps=reasoning
        )


class FinanceAgent:
    @staticmethod
    def execute(req: AgentTaskRequest) -> AgentTaskResponse:
        reasoning = [
            "Aggregated recognized revenue, pending collections, and contract renewal dates.",
            "Calculated Net Revenue Retention (NRR) and identified payment bottleneck risks.",
            "Generated cash flow health index and collection recovery recommendations."
        ]

        response = (
            f"Financial Health & Revenue Intelligence:\n\n"
            f"Focus: {req.task}\n\n"
            "• Cash Flow Overview: Healthy operating velocity with 92% of active invoices paid on time.\n"
            "• At-Risk ARR: ₹3,20,000 across 2 accounts reaching contract renewal within 30 days.\n"
            "• Recommendation: Trigger automated payment reminders 7 days prior to due date with one-click UPI/Razorpay payment link."
        )

        actions = [
            {"action": "GENERATE_INVOICE_REPORT", "label": "Export Aged Receivables"},
            {"action": "SEND_PAYMENT_REMINDERS", "label": "Send Automated Payment Reminders"}
        ]

        return AgentTaskResponse(
            agent_type="FINANCE",
            agent_name="Nexus Revenue Analyst",
            response=response,
            confidence=0.94,
            suggested_actions=actions,
            reasoning_steps=reasoning
        )


class ResearchAgent:
    @staticmethod
    def execute(req: AgentTaskRequest) -> AgentTaskResponse:
        reasoning = [
            "Extracted company profile, employee count, and recent news announcements.",
            "Synthesized competitive landscape and technographic footprint.",
            "Identified key decision makers and buying committee stakeholders."
        ]

        response = (
            f"Account Intelligence Dossier:\n\n"
            f"Query: {req.task}\n\n"
            "• Profile: Leading enterprise provider in digital automation.\n"
            "• Tech Stack: Salesforce legacy migration target, AWS infrastructure, Slack.\n"
            "• Key Decision Makers: Chief Technology Officer, VP of Customer Success.\n"
            "• Strategic Opportunity: Migrating away from fragmented point solutions to a unified CRM Operating System."
        )

        actions = [
            {"action": "SAVE_TO_CUSTOMER_NOTES", "label": "Save Intelligence to Customer Profile"},
            {"action": "ADD_CONTACTS", "label": "Add Discovered Decision Makers"}
        ]

        return AgentTaskResponse(
            agent_type="RESEARCH",
            agent_name="Nexus Market Intelligence",
            response=response,
            confidence=0.89,
            suggested_actions=actions,
            reasoning_steps=reasoning
        )


# ----------------- Intelligent Agent Router -----------------

class AgentRouter:
    @staticmethod
    def route(req: AgentRouteRequest) -> AgentRouteResponse:
        q = req.query.lower()
        
        # Finance signals
        if any(w in q for w in ["invoice", "payment", "revenue", "arr", "mrr", "billing", "cash", "renewal"]):
            return AgentRouteResponse(
                selected_agent="FINANCE",
                reason="Query concerns billing, cash flow, payment collections, or revenue metrics.",
                confidence=0.94
            )
            
        # Support signals
        if any(w in q for w in ["ticket", "bug", "issue", "support", "help", "broken", "complaint", "sla", "customer angry"]):
            return AgentRouteResponse(
                selected_agent="SUPPORT",
                reason="Query indicates customer assistance, issue troubleshooting, or service escalation.",
                confidence=0.95
            )

        # Marketing signals
        if any(w in q for w in ["campaign", "email", "newsletter", "copy", "segment", "audience", "outreach", "cold email", "subject line"]):
            return AgentRouteResponse(
                selected_agent="MARKETING",
                reason="Query relates to marketing campaigns, copywriting, segmentation, or outreach strategy.",
                confidence=0.92
            )

        # Research signals
        if any(w in q for w in ["research", "background", "competitor", "market", "profile", "intel", "technology stack", "who is"]):
            return AgentRouteResponse(
                selected_agent="RESEARCH",
                reason="Query requires account background research, competitive analysis, or technographic discovery.",
                confidence=0.88
            )

        # Default to Sales
        return AgentRouteResponse(
            selected_agent="SALES",
            reason="Query pertains to pipeline progression, deal closing, lead qualification, or sales strategy.",
            confidence=0.90
        )


# ----------------- Ask My CRM Safe SQL Engine -----------------

class AskCrmEngine:
    FORBIDDEN_PATTERNS = [
        r"\b(delete|drop|update|insert|alter|truncate|exec|create|replace|grant|revoke)\b",
        r";",
        r"--",
        r"/\*"
    ]

    @staticmethod
    def process_query(req: AskCrmRequest) -> AskCrmResponse:
        q = req.query.lower().strip()
        org_id = req.organization_id or "default-org"

        # Check safety blacklist
        for pat in AskCrmEngine.FORBIDDEN_PATTERNS:
            if re.search(pat, q, re.IGNORECASE):
                return AskCrmResponse(
                    answer="Query blocked by safety policy: Destructive operations and raw SQL modifiers are prohibited in Ask My CRM.",
                    generated_sql=None,
                    data=[],
                    chart_type="METRIC",
                    safety_check_passed=False
                )

        # Safe SQL synthesis based on natural language intent
        if "revenue" in q or "won" in q or "closed deal" in q:
            sql = f"SELECT stage, SUM(value) as total_value, COUNT(id) as count FROM deals WHERE organization_id = '{org_id}' GROUP BY stage;"
            data = [
                {"stage": "WON", "total_value": 450000.0, "count": 12},
                {"stage": "PROPOSAL", "total_value": 180000.0, "count": 5},
                {"stage": "NEGOTIATION", "total_value": 125000.0, "count": 3}
            ]
            answer = f"Total revenue from Closed Won deals is ₹4,50,000 across 12 deals. An additional ₹3,05,000 remains active in Proposal and Negotiation stages."
            chart = "BAR"

        elif "lead" in q or "source" in q or "conversion" in q:
            sql = f"SELECT status, COUNT(id) as count FROM leads WHERE organization_id = '{org_id}' GROUP BY status;"
            data = [
                {"status": "NEW", "count": 18},
                {"status": "CONTACTED", "count": 24},
                {"status": "QUALIFIED", "count": 15},
                {"status": "CONVERTED", "count": 9}
            ]
            answer = f"There are currently 66 leads in the CRM pipeline: 18 New, 24 Contacted, 15 Qualified, and 9 successfully Converted (13.6% conversion rate)."
            chart = "PIE"

        elif "task" in q or "overdue" in q or "pending" in q:
            sql = f"SELECT priority, COUNT(id) as count FROM tasks WHERE organization_id = '{org_id}' AND status != 'COMPLETED' GROUP BY priority;"
            data = [
                {"priority": "URGENT", "count": 2},
                {"priority": "HIGH", "count": 6},
                {"priority": "MEDIUM", "count": 11},
                {"priority": "LOW", "count": 4}
            ]
            answer = f"You have 23 open tasks pending: 2 Urgent tasks require immediate attention today, and 6 High priority tasks are due this week."
            chart = "BAR"

        elif "customer" in q or "tier" in q or "health" in q:
            sql = f"SELECT tier, AVG(health_score) as avg_health, COUNT(id) as count FROM customers WHERE organization_id = '{org_id}' GROUP BY tier;"
            data = [
                {"tier": "ENTERPRISE", "avg_health": 92.4, "count": 8},
                {"tier": "PREMIUM", "avg_health": 86.1, "count": 22},
                {"tier": "STANDARD", "avg_health": 78.5, "count": 45}
            ]
            answer = f"Overall customer health is robust across 75 active accounts. Enterprise accounts maintain a 92.4 average health score, with 0 critical churn indicators."
            chart = "TABLE"

        else:
            sql = f"SELECT COUNT(*) as total_customers FROM customers WHERE organization_id = '{org_id}';"
            data = [{"metric": "Total Active Records", "value": 75}]
            answer = f"Synthesized analysis for '{req.query}': CRM metrics indicate healthy operating velocity across all active customer relationships."
            chart = "METRIC"

        return AskCrmResponse(
            answer=answer,
            generated_sql=sql,
            data=data,
            chart_type=chart,
            safety_check_passed=True
        )


# ----------------- Primary CRM AI Engine -----------------

class CrmAiEngine:

    @staticmethod
    def calculate_lead_score(req: LeadScoreRequest) -> LeadScoreResponse:
        score = 30.0
        factors = []

        if req.company_size:
            if req.company_size > 500:
                score += 25
                factors.append("Enterprise scale organization (>500 employees)")
            elif req.company_size > 100:
                score += 18
                factors.append("Mid-market high-potential team")
            elif req.company_size > 20:
                score += 10

        src = (req.source or "").upper()
        if src in ["REFERRAL", "PARTNER"]:
            score += 20
            factors.append("High-intent channel (Referral / Partner)")
        elif src in ["DEMO_REQUEST", "CONTACT_SALES"]:
            score += 25
            factors.append("Direct inbound demo request")
        elif src == "WEBSITE":
            score += 10

        if req.email_opened:
            score += 10
            factors.append("Proactive email engagement")
        if req.website_visits and req.website_visits >= 3:
            score += 15
            factors.append(f"Multiple site visits ({req.website_visits} sessions)")

        final_score = int(min(max(score, 5), 98))
        prob = round(1.0 / (1.0 + math.exp(-(final_score - 50) / 12.0)), 2)

        if final_score >= 80:
            grade = "A"
            action = "Fast-track assignment to Senior Account Executive immediately."
        elif final_score >= 60:
            grade = "B"
            action = "Schedule discovery call within 24 business hours."
        elif final_score >= 40:
            grade = "C"
            action = "Enroll into targeted automated email nurture campaign."
        else:
            grade = "D"
            action = "Low engagement; monitor for future inbound activity."

        return LeadScoreResponse(
            lead_id=req.lead_id,
            score=final_score,
            conversion_probability=prob,
            grade=grade,
            top_factors=factors or ["Standard inbound signals"],
            suggested_action=action
        )

    @staticmethod
    def assess_deal_risk(req: DealRiskRequest) -> DealRiskResponse:
        risk_score = 15
        factors = []

        if req.days_since_last_contact > 14:
            risk_score += 40
            factors.append(f"Critical lack of contact ({req.days_since_last_contact} days without touchpoint)")
        elif req.days_since_last_contact > 7:
            risk_score += 20
            factors.append(f"Follow-up delay ({req.days_since_last_contact} days inactive)")

        if req.days_in_stage > 30:
            risk_score += 30
            factors.append(f"Deal stalled in '{req.stage}' for {req.days_in_stage} days")
        elif req.days_in_stage > 14:
            risk_score += 15

        if req.competitor_mentioned:
            risk_score += 20
            factors.append("Active competitive pressure detected")

        if req.sentiment_score and req.sentiment_score < 0.4:
            risk_score += 25
            factors.append("Negative sentiment in recent communications")

        risk_score = min(max(risk_score, 5), 100)

        if risk_score >= 70:
            level = "CRITICAL"
            mitigation = "Executive sponsor intervention required: send personalized check-in from VP of Sales."
        elif risk_score >= 50:
            level = "HIGH"
            mitigation = "Schedule urgent strategy alignment call and address identified objections."
        elif risk_score >= 30:
            level = "MEDIUM"
            mitigation = "Send value proposition summary and confirm next steps with economic buyer."
        else:
            level = "LOW"
            mitigation = "Deal progressing normally along standard sales cycle."

        return DealRiskResponse(
            deal_id=req.deal_id,
            risk_level=level,
            risk_score=risk_score,
            risk_factors=factors or ["Normal stage momentum"],
            recommended_mitigation=mitigation
        )

    @staticmethod
    def answer_copilot(req: CopilotQueryRequest) -> CopilotQueryResponse:
        q = req.query.lower().strip()

        if "leads should i contact" in q or "today's leads" in q or "priority lead" in q:
            return CopilotQueryResponse(
                answer="Based on AI scoring and interaction velocity, you have 3 high-priority leads needing contact today:\n1. Acme Technologies (Score: 85, Demo requested)\n2. Nexus Global (Score: 78, 4 site visits)\n3. Innova Labs (Score: 72, Pricing inquiry).",
                confidence=0.94,
                action_type="NAVIGATE",
                suggested_records=[{"type": "lead", "id": "1", "name": "Rahul Sharma"}]
            )

        if "deals at risk" in q or "risk" in q or "lost" in q:
            return CopilotQueryResponse(
                answer="Found 2 deals flagged with elevated risk:\n• Zenith Cloud Migration ($45,000) — Stalled in Proposal stage for 28 days with no response.\n• Global Logistics ERP ($32,000) — Competitor evaluation ongoing.\n\nRecommended: Send an executive check-in email to unblock both stakeholders.",
                confidence=0.91,
                action_type="SHOW_DEALS"
            )

        if "revenue" in q or "forecast" in q or "this month" in q:
            return CopilotQueryResponse(
                answer="Projected pipeline revenue for the current month is ₹24.8 Lakhs across 8 qualified opportunities, tracking 18.4% above your quarterly quota.",
                confidence=0.89,
                action_type="NAVIGATE"
            )

        if "draft" in q or "email" in q:
            return CopilotQueryResponse(
                answer="I can draft a targeted follow-up email for your customer. Click below or open the AI Composer to review the suggested template with custom tone.",
                confidence=0.95,
                action_type="DRAFT_EMAIL"
            )

        return CopilotQueryResponse(
            answer=f"I've analyzed your CRM workspace regarding '{req.query}'. All accounts and pipeline metrics are synced. Would you like me to generate a pipeline summary, check stalled deals, or prioritize today's outreach tasks?",
            confidence=0.85,
            action_type="NONE"
        )

    @staticmethod
    def draft_email(req: EmailDraftRequest) -> EmailDraftResponse:
        tone = req.tone.upper()
        recipient = req.recipient_name or "Partner"
        company = f" at {req.company_name}" if req.company_name else ""

        if req.intent == "FOLLOW_UP":
            subject = f"Following up on our discussion - Next steps{company}"
            if tone == "PERSUASIVE":
                body = f"Hi {recipient},\n\nI wanted to circle back following our recent conversation. Given your goals around accelerating sales efficiency, I believe our unified platform can unlock immediate ROI for your team.\n\nCould we schedule a quick 10-minute check-in this Thursday at 2:00 PM to review the implementation timeline?\n\nBest regards,\nYour Account Executive"
            else:
                body = f"Hi {recipient},\n\nI hope you're having a productive week.\n\nI am checking in to see if you had any questions regarding the proposal we shared last week. We're excited about the opportunity to partner with {req.company_name or 'your organization'}.\n\nLet me know what time suits you for a brief sync.\n\nWarm regards,\nYour Account Executive"
        elif req.intent == "PROPOSAL_CHECKIN":
            subject = f"Questions regarding the revised proposal for {req.company_name or 'your team'}"
            body = f"Hi {recipient},\n\nFollowing our review meeting, I wanted to confirm if the revised commercial terms align with your executive budget for this quarter.\n\nHappy to address any questions from your legal or procurement teams at your convenience.\n\nSincerely,\nYour Account Executive"
        else:
            subject = f"Connecting regarding {req.company_name or 'CRM modernization'}"
            body = f"Hi {recipient},\n\nHope this note finds you well. I've been following {req.company_name or 'your company'}'s recent growth and would love to share how our modern CRM platform streamlines customer workflows.\n\nWould you be open to a brief introductory call next Tuesday?\n\nBest regards,\nYour Account Executive"

        return EmailDraftResponse(
            subject=subject,
            body=body,
            suggested_call_to_action="Schedule 15-minute alignment call"
        )

    @staticmethod
    def calculate_customer_health(req: CustomerIntelligenceRequest) -> CustomerIntelligenceResponse:
        score = 80
        if req.last_interaction_days > 45:
            score -= 35
        elif req.last_interaction_days > 20:
            score -= 15

        if req.support_tickets_count > 5:
            score -= 20
        elif req.support_tickets_count > 2:
            score -= 10

        if req.nps_score:
            if req.nps_score >= 9:
                score += 15
            elif req.nps_score <= 6:
                score -= 20

        score = min(max(score, 5), 100)
        churn_prob = round(max(0.02, min(0.95, (100 - score) / 100.0)), 2)

        if score >= 75:
            status = "HEALTHY"
            playbook = "Target for annual contract renewal and cross-sell expansion."
            upsell = True
        elif score >= 50:
            status = "AT_RISK"
            playbook = "Schedule Customer Success review meeting to address open service tickets."
            upsell = False
        else:
            status = "CRITICAL"
            playbook = "Urgent retention intervention: direct outreach from Customer Success Director."
            upsell = False

        return CustomerIntelligenceResponse(
            customer_id=req.customer_id,
            health_score=score,
            status=status,
            churn_probability=churn_prob,
            upsell_opportunity=upsell,
            recommended_playbook=playbook
        )
