import re
from typing import Dict, Any, Tuple

class AiContextFirewall:
    """
    AI Context Firewall & Data Loss Prevention (DLP) engine.
    Scans and redacts PII, financial data, and credentials before transmission to external LLMs.
    """

    # Patterns for sensitive data detection
    CREDIT_CARD_PATTERN = r"\b(?:\d{4}[-\s]?){3}\d{4}\b"
    SSN_PATTERN = r"\b\d{3}-\d{2}-\d{4}\b"
    API_KEY_PATTERN = r"\b(?:sk-[a-zA-Z0-9]{24,}|crm_live_[a-zA-Z0-9]{24,}|whsec_[a-zA-Z0-9]{24,})\b"
    PASSWORD_PATTERN = r"(?i)\b(?:password|secret|passcode|token)\s*[:=]\s*['\"]?([^\s'\"]+)"

    @classmethod
    def inspect_and_sanitize(cls, text: str, tenant_policy: Dict[str, Any] = None) -> Tuple[str, Dict[str, int]]:
        """
        Inspects text, redacts sensitive entities, and returns sanitized text with detection metrics.
        """
        if not text:
            return text, {}

        metrics = {
            "credit_cards_redacted": 0,
            "ssn_redacted": 0,
            "api_keys_redacted": 0,
            "passwords_redacted": 0
        }

        # 1. Redact Credit Cards
        def redact_cc(match):
            metrics["credit_cards_redacted"] += 1
            return "[REDACTED_CREDIT_CARD]"
        sanitized = re.sub(cls.CREDIT_CARD_PATTERN, redact_cc, text)

        # 2. Redact SSNs
        def redact_ssn(match):
            metrics["ssn_redacted"] += 1
            return "[REDACTED_SSN]"
        sanitized = re.sub(cls.SSN_PATTERN, redact_ssn, sanitized)

        # 3. Redact API Keys and Secrets
        def redact_api_key(match):
            metrics["api_keys_redacted"] += 1
            return "[REDACTED_SECRET_KEY]"
        sanitized = re.sub(cls.API_KEY_PATTERN, redact_api_key, sanitized)

        # 4. Redact Passwords
        def redact_pw(match):
            metrics["passwords_redacted"] += 1
            return match.group(0).replace(match.group(1), "[REDACTED_PASSWORD]")
        sanitized = re.sub(cls.PASSWORD_PATTERN, redact_pw, sanitized)

        return sanitized, metrics
