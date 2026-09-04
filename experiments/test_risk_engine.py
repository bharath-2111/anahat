import sys
import os

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.insert(0, PROJECT_ROOT)

from backend.risk.risk_engine import calculate_risk


test_scores = [
    0.20,
    0.50,
    0.70,
    0.90
]


print("\n==============================")
print("VOXSHIELD RISK ENGINE TEST")
print("==============================")

for score in test_scores:

    result = calculate_risk(score)

    print("\n------------------------------")
    print(f"Spoof Probability : {score:.2f}")
    print(f"Risk Level        : {result['risk_level']}")
    print(f"Recommendation    : {result['recommendation']}")