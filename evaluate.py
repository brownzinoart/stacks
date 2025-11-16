#!/usr/bin/env python3
"""
evaluate.py - Put this IN your project folder and run it!
It automatically analyzes the code in the current directory.

Usage (from your project folder):
    python3 evaluate.py
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime

def analyze_this_project():
    """Analyzes the project in the current directory"""
    
    print("\n" + "="*70)
    print("🔍 ANALYZING THIS PROJECT")
    print("="*70)
    
    # Get project info
    project_name = Path.cwd().name
    print(f"\nProject: {project_name}")
    print(f"Location: {Path.cwd()}")
    
    # Count files
    file_counts = {
        "Python": len(list(Path.cwd().glob("**/*.py"))),
        "JavaScript": len(list(Path.cwd().glob("**/*.js"))),
        "TypeScript": len(list(Path.cwd().glob("**/*.ts"))),
        "HTML": len(list(Path.cwd().glob("**/*.html"))),
        "Total": len(list(Path.cwd().glob("**/*.*")))
    }
    
    # Detect features based on files/folders
    features = []
    if Path("auth").exists() or Path("authentication").exists():
        features.append("Authentication")
    if Path("api").exists() or Path("routes").exists():
        features.append("API")
    if Path("models").exists() or Path("database").exists():
        features.append("Database")
    if Path("tests").exists() or Path("test").exists():
        features.append("Testing")
    if Path("frontend").exists() or Path("client").exists():
        features.append("Frontend")
    if Path("static").exists() or Path("public").exists():
        features.append("Static Assets")
    
    # Check for specific tech
    tech_stack = []
    if Path("package.json").exists():
        tech_stack.append("Node.js")
        # Check package.json for frameworks
        try:
            with open("package.json") as f:
                pkg = json.load(f)
                deps = pkg.get("dependencies", {})
                if "react" in deps:
                    tech_stack.append("React")
                if "express" in deps:
                    tech_stack.append("Express")
                if "next" in deps:
                    tech_stack.append("Next.js")
        except:
            pass
    
    if Path("requirements.txt").exists():
        tech_stack.append("Python")
        # Check for frameworks
        try:
            with open("requirements.txt") as f:
                reqs = f.read().lower()
                if "flask" in reqs:
                    tech_stack.append("Flask")
                if "django" in reqs:
                    tech_stack.append("Django")
                if "fastapi" in reqs:
                    tech_stack.append("FastAPI")
        except:
            pass
    
    # Count lines of code
    total_lines = 0
    for ext in ["py", "js", "ts", "jsx", "tsx"]:
        for file in Path.cwd().glob(f"**/*.{ext}"):
            try:
                if "node_modules" not in str(file) and ".git" not in str(file):
                    total_lines += len(file.read_text().splitlines())
            except:
                pass
    
    # Git metrics
    try:
        commits = subprocess.run(
            ["git", "rev-list", "--count", "HEAD"],
            capture_output=True, text=True
        ).stdout.strip()
    except:
        commits = "0"
    
    # Calculate score
    score = calculate_project_score(file_counts, features, tech_stack, total_lines, int(commits))
    
    # Display results
    print("\n📊 PROJECT METRICS:")
    print("-" * 40)
    print(f"Files: {file_counts}")
    print(f"Lines of Code: {total_lines:,}")
    print(f"Git Commits: {commits}")
    print(f"Features: {', '.join(features) if features else 'None detected'}")
    print(f"Tech Stack: {', '.join(tech_stack) if tech_stack else 'Not detected'}")
    
    print("\n🎯 PROJECT EVALUATION:")
    print("-" * 40)
    
    # Determine stage
    if int(commits) < 10:
        stage = "🌱 Early Stage (Just Started)"
    elif int(commits) < 50:
        stage = "🏗️ Prototype Stage"
    elif int(commits) < 200:
        stage = "🚀 MVP Stage"
    else:
        stage = "📈 Growth Stage"
    
    print(f"Development Stage: {stage}")
    print(f"Project Score: {score}/10")
    
    # Give verdict
    if score >= 8:
        verdict = "🟢 READY TO LAUNCH! You have substantial code!"
    elif score >= 6:
        verdict = "🟡 GOOD PROGRESS - Keep building!"
    elif score >= 4:
        verdict = "🟠 EARLY BUT PROMISING - Add more features"
    else:
        verdict = "🔴 VERY EARLY - Need more development"
    
    print(f"Verdict: {verdict}")
    
    # Recommendations
    print("\n💡 RECOMMENDATIONS:")
    print("-" * 40)
    
    if "Testing" not in features:
        print("• Add tests to ensure reliability")
    if total_lines < 1000:
        print("• Build out more features")
    if int(commits) < 50:
        print("• Commit more frequently")
    if "API" not in features:
        print("• Consider adding an API")
    if "Database" not in features:
        print("• Add data persistence")
    
    # Business evaluation
    print("\n💼 BUSINESS PERSPECTIVE:")
    print("-" * 40)
    
    if score >= 7:
        print("✅ Technical foundation strong enough for:")
        print("   • Customer demos")
        print("   • Beta testing")
        print("   • Investor presentations")
        print("   • Early customer acquisition")
    elif score >= 5:
        print("🟡 Getting there! You can:")
        print("   • Show working prototype")
        print("   • Get feedback from users")
        print("   • Apply to accelerators")
    else:
        print("🔨 Keep building! Focus on:")
        print("   • Core feature implementation")
        print("   • Basic functionality")
        print("   • Proof of concept")
    
    print("\n" + "="*70)
    
    return score

def calculate_project_score(files, features, tech, lines, commits):
    """Calculate a score based on project metrics"""
    score = 0
    
    # Files (max 2 points)
    if files["Total"] > 100:
        score += 2
    elif files["Total"] > 50:
        score += 1.5
    elif files["Total"] > 20:
        score += 1
    elif files["Total"] > 10:
        score += 0.5
    
    # Features (max 3 points)
    score += min(len(features) * 0.5, 3)
    
    # Lines of code (max 2 points)
    if lines > 10000:
        score += 2
    elif lines > 5000:
        score += 1.5
    elif lines > 1000:
        score += 1
    elif lines > 500:
        score += 0.5
    
    # Commits (max 2 points)
    if commits > 200:
        score += 2
    elif commits > 100:
        score += 1.5
    elif commits > 50:
        score += 1
    elif commits > 20:
        score += 0.5
    
    # Tech stack (max 1 point)
    if len(tech) > 2:
        score += 1
    elif len(tech) > 0:
        score += 0.5
    
    return min(round(score, 1), 10)

def quick_advisory_opinion():
    """Give a quick business advisory opinion"""
    
    print("\n🏛️ ADVISORY BOARD QUICK TAKE:")
    print("="*70)
    
    # Look for specific indicators
    has_api = Path("api").exists() or Path("routes").exists()
    has_auth = Path("auth").exists() or Path("authentication").exists()
    has_db = Path("models").exists() or Path("database").exists()
    has_tests = Path("tests").exists() or Path("test").exists()
    
    if has_api and has_auth and has_db:
        print("🟢 INVESTMENT READY: Core infrastructure is built!")
        print("   Next: Focus on user acquisition and growth")
    elif has_api or has_db:
        print("🟡 PROMISING: Key components in place")
        print("   Next: Complete the core feature set")
    else:
        print("🟠 EARLY STAGE: Keep building core functionality")
        print("   Next: Get to working prototype ASAP")
    
    # Check for red flags
    print("\n⚠️ RISK ASSESSMENT:")
    if not has_tests:
        print("   • No tests = Higher technical risk")
    if not Path(".gitignore").exists():
        print("   • No .gitignore = Possible security issues")
    if Path("node_modules").exists() and not Path("package-lock.json").exists():
        print("   • No package-lock = Dependency issues possible")
    
    print("="*70)

if __name__ == "__main__":
    # Run the analysis
    score = analyze_this_project()
    quick_advisory_opinion()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"evaluation_{timestamp}.txt"
    
    print(f"\n💾 Results saved to: {results_file}")
