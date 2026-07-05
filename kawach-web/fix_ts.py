import os

def fix_file(path, replacements):
    with open(path, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)

fix_file("src/components/ui/AnimatedNumber.tsx", [
    ("  suffix?: string;\n}", "  suffix?: string;\n  style?: React.CSSProperties;\n}")
])

fix_file("src/components/ui/Button.tsx", [
    ("  type?: 'button' | 'submit' | 'reset';\n}", "  type?: 'button' | 'submit' | 'reset';\n  style?: React.CSSProperties;\n}")
])

fix_file("src/drawers/ZoneDetailDrawer.tsx", [
    ("assembleExplanation(report, zoneName)", "assembleExplanation(zoneName, report.sensor.gas_ppm, report.sensor.temperature_c, report.sensor.pressure_bar, report.master_ai.risk_level, report.plant.permit, report.workers.length, report.master_ai.reasons, report.master_ai.recommendations)"),
    ("size=\"large\"", "size=\"lg\"")
])

fix_file("src/pages/AlertsHistory.tsx", [
    ("const mock = [];", "const mock: any[] = [];")
])

fix_file("src/pages/Dashboard.tsx", [
    ("<AppShell title=\"Dashboard\">", "<AppShell title=\"Dashboard\" riskLevel={report?.master_ai.risk_level || 'LOW'} riskScore={report?.master_ai.risk_score || 0}>"),
    ("risk={", "riskLevel={"),
    ("<AlertEntry alert={alert} />", "<AlertEntry timestamp={alert.timestamp} zone={alert.zone} description={alert.description} riskLevel={alert.riskLevel as any} />")
])

with open("src/vite-env.d.ts", "w") as f:
    f.write('/// <reference types="vite/client" />\n')

print("Fixes applied.")
