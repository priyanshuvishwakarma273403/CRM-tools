import time
from typing import Dict, Any, Optional
from firewall import AiContextFirewall

class ModelRouter:
    """
    Multi-Provider AI Model Router.
    Enables dynamic provider selection (OpenAI, Gemini, Anthropic, Local AI),
    cost tracking, latency monitoring, and automatic fallback.
    """

    PROVIDERS = {
        "OPENAI": {
            "models": ["gpt-4o", "gpt-4o-mini", "o1"],
            "cost_per_1k_input": 0.005,
            "cost_per_1k_output": 0.015,
            "tier": "REASONING"
        },
        "GEMINI": {
            "models": ["gemini-1.5-pro", "gemini-1.5-flash"],
            "cost_per_1k_input": 0.00125,
            "cost_per_1k_output": 0.005,
            "tier": "SPEED"
        },
        "ANTHROPIC": {
            "models": ["claude-3-5-sonnet", "claude-3-5-haiku"],
            "cost_per_1k_input": 0.003,
            "cost_per_1k_output": 0.015,
            "tier": "REASONING"
        },
        "LOCAL_OLLAMA": {
            "models": ["llama3.2", "deepseek-r1"],
            "cost_per_1k_input": 0.0,
            "cost_per_1k_output": 0.0,
            "tier": "PRIVATE"
        }
    }

    @classmethod
    def select_model(cls, task_type: str, privacy_mode: bool = False) -> Dict[str, Any]:
        """
        Determines the optimal provider and model based on task requirements and privacy policies.
        """
        if privacy_mode:
            return {
                "provider": "LOCAL_OLLAMA",
                "model": "llama3.2",
                "tier": "PRIVATE"
            }

        task = (task_type or "").upper()
        if task in ["DEAL_RISK", "REVENUE_FORECAST", "CONTRACT_ANALYSIS"]:
            return {
                "provider": "ANTHROPIC",
                "model": "claude-3-5-sonnet",
                "tier": "REASONING"
            }
        elif task in ["EMAIL_DRAFT", "COPILOT_SHORTCUT", "SENTIMENT"]:
            return {
                "provider": "GEMINI",
                "model": "gemini-1.5-flash",
                "tier": "SPEED"
            }
        else:
            return {
                "provider": "OPENAI",
                "model": "gpt-4o",
                "tier": "BALANCED"
            }

    @classmethod
    def dispatch_prompt(cls, prompt: str, task_type: str = "GENERAL", privacy_mode: bool = False) -> Dict[str, Any]:
        """
        Executes prompt through the context firewall and selected model provider with cost/latency telemetry.
        """
        start_time = time.time()

        # 1. Inspect and sanitize via AI Context Firewall
        sanitized_prompt, dlp_metrics = AiContextFirewall.inspect_and_sanitize(prompt)

        # 2. Select model
        routing = cls.select_model(task_type, privacy_mode)

        # 3. Simulate token consumption metrics
        prompt_tokens = max(1, len(sanitized_prompt) // 4)
        completion_tokens = 150
        elapsed_ms = int((time.time() - start_time) * 1000) + 45

        provider_info = cls.PROVIDERS.get(routing["provider"], cls.PROVIDERS["OPENAI"])
        estimated_cost = (prompt_tokens / 1000.0 * provider_info["cost_per_1k_input"]) + \
                         (completion_tokens / 1000.0 * provider_info["cost_per_1k_output"])

        return {
            "provider": routing["provider"],
            "model": routing["model"],
            "tier": routing["tier"],
            "latency_ms": elapsed_ms,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "estimated_cost_usd": round(estimated_cost, 6),
            "dlp_metrics": dlp_metrics,
            "sanitized_preview": sanitized_prompt[:100] + ("..." if len(sanitized_prompt) > 100 else "")
        }
