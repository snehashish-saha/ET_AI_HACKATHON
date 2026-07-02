from AI.executive_ai import ExecutiveAI

ai = ExecutiveAI()

summary = ai.generate(
    incident="Gas Leak",
    zone="Gas Pipeline",
    risk_level="HIGH",
    reasons=[
        "Gas concentration exceeded safe limit.",
        "Hot Work permit is active."
    ],
    recommendations=[
        "Suspend Hot Work immediately.",
        "Evacuate affected workers."
    ],
    predictions=[
        {
            "prediction": "Gas concentration may become critical within 3 minutes."
        }
    ]
)

print("\nEXECUTIVE SUMMARY\n")
print(summary)