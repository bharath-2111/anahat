from typing import Dict


def calculate_risk(spoof_probability: float) -> Dict:
    """
    Convert the AI detector's spoof probability
    into a VoxShield risk assessment.
    """

    if spoof_probability >= 0.85:
        risk_level = "CRITICAL"
        recommendation = (
            "Do not proceed with the requested action. "
            "Perform independent callback verification and MFA."
        )

    elif spoof_probability >= 0.65:
        risk_level = "HIGH"
        recommendation = (
            "Treat the call as suspicious. "
            "Verify the caller through an independent channel before proceeding."
        )

    elif spoof_probability >= 0.40:
        risk_level = "SUSPICIOUS"
        recommendation = (
            "Request additional verification before taking sensitive action."
        )

    else:
        risk_level = "LOW"
        recommendation = (
            "No strong evidence of synthetic speech detected. "
            "Normal verification procedures may continue."
        )

    return {
        "risk_level": risk_level,
        "spoof_probability": round(spoof_probability, 4),
        "recommendation": recommendation,
    }