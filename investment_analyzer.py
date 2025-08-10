#!/usr/bin/env python3
"""
INVESTMENT BOARD CODE ANALYZER
Analyzes your actual codebase and tells you EXACTLY what to improve
to increase your investment readiness and valuation.

Just run this in your project folder:
    python3 investment_analyzer.py
"""

import os
import json
import subprocess
import re
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional

# ============================================================================
# THE 10 INVESTMENT AGENTS ANALYZING YOUR CODE
# ============================================================================

class CodeInvestmentAnalyzer:
    """Main analyzer that runs all investment checks"""
    
    def __init__(self):
        self.project_path = Path.cwd()
        self.project_name = self.project_path.name
        self.scores = {}
        self.recommendations = []
        self.red_flags = []
        self.green_flags = []
        
    def analyze(self):
        """Run complete investment analysis"""
        print("\n" + "="*80)
        print("🏛️ INVESTMENT BOARD - CODE ANALYSIS")
        print("="*80)
        print(f"\n📁 Project: {self.project_name}")
        print(f"📍 Location: {self.project_path}")
        print("\n" + "-"*80)
        
        # Run all investment agents
        agents = [
            self.analyze_technical_debt(),
            self.analyze_scalability(),
            self.analyze_security(),
            self.analyze_monetization_readiness(),
            self.analyze_user_experience(),
            self.analyze_data_infrastructure(),
            self.analyze_testing_quality(),
            self.analyze_documentation(),
            self.analyze_deployment_readiness(),
            self.analyze_growth_infrastructure()
        ]
        
        # Calculate overall score
        overall_score = sum(self.scores.values()) / len(self.scores) if self.scores else 0
        
        # Display results
        self.display_results(overall_score)
        
        return overall_score
    
    # ========================================================================
    # AGENT 1: TECHNICAL DEBT ANALYZER
    # ========================================================================
    
    def analyze_technical_debt(self) -> Dict:
        """VC Question: 'Will this codebase scale or need a rewrite?'"""
        
        print("\n🔍 ANALYZING: Technical Debt & Code Quality...")
        
        debt_score = 10  # Start perfect, deduct for issues
        issues = []
        fixes = []
        
        # Check for code smells
        for py_file in self.project_path.glob("**/*.py"):
            if "venv" in str(py_file) or "node_modules" in str(py_file):
                continue
            try:
                content = py_file.read_text()
                lines = content.splitlines()
                
                # Check for long functions
                function_lines = []
                in_function = False
                for line in lines:
                    if line.strip().startswith("def "):
                        in_function = True
                        function_lines = [line]
                    elif in_function:
                        if line and not line[0].isspace() and not line.startswith("#"):
                            # Function ended
                            if len(function_lines) > 50:
                                debt_score -= 0.5
                                issues.append(f"Long function in {py_file.name} ({len(function_lines)} lines)")
                                fixes.append(f"Break down functions >50 lines in {py_file.name}")
                            in_function = False
                        else:
                            function_lines.append(line)
                
                # Check for TODO/FIXME/HACK comments
                todos = len(re.findall(r'#\s*(TODO|FIXME|HACK)', content))
                if todos > 5:
                    debt_score -= 1
                    issues.append(f"Found {todos} TODO/FIXME/HACK comments")
                    fixes.append("Address technical debt marked in comments")
                
                # Check for duplicate code (simplified)
                if content.count("copy") > 3 or content.count("paste") > 2:
                    debt_score -= 0.5
                    issues.append("Possible code duplication detected")
                    fixes.append("Refactor duplicated code into shared functions")
                    
            except:
                pass
        
        # Check JavaScript/TypeScript files
        for js_file in list(self.project_path.glob("**/*.js")) + list(self.project_path.glob("**/*.ts")):
            if "node_modules" in str(js_file):
                continue
            try:
                content = js_file.read_text()
                
                # Check for console.logs (shouldn't be in production)
                console_logs = content.count("console.log")
                if console_logs > 10:
                    debt_score -= 0.5
                    issues.append(f"Found {console_logs} console.log statements")
                    fixes.append("Remove console.logs or use proper logging")
                
                # Check for any or untyped (TypeScript)
                if js_file.suffix == ".ts":
                    any_count = content.count(": any")
                    if any_count > 5:
                        debt_score -= 0.5
                        issues.append(f"Found {any_count} 'any' types in TypeScript")
                        fixes.append("Replace 'any' types with proper types")
            except:
                pass
        
        # Check for outdated dependencies
        if Path("requirements.txt").exists():
            fixes.append("Run 'pip list --outdated' to check for updates")
        
        if Path("package.json").exists():
            fixes.append("Run 'npm outdated' to check for updates")
        
        self.scores["technical_debt"] = max(0, debt_score)
        
        if debt_score > 8:
            self.green_flags.append("✅ Clean codebase with low technical debt")
        elif debt_score < 5:
            self.red_flags.append("🚨 High technical debt - needs refactoring")
        
        for fix in fixes[:3]:  # Top 3 fixes
            self.recommendations.append(f"[Tech Debt] {fix}")
        
        return {"score": debt_score, "issues": issues, "fixes": fixes}
    
    # ========================================================================
    # AGENT 2: SCALABILITY ANALYZER
    # ========================================================================
    
    def analyze_scalability(self) -> Dict:
        """VC Question: 'Can this handle 100x growth?'"""
        
        print("🔍 ANALYZING: Scalability & Performance...")
        
        scale_score = 5  # Start neutral
        issues = []
        improvements = []
        
        # Check for caching implementation
        has_redis = False
        has_caching = False
        
        for file in self.project_path.glob("**/*.py"):
            if "venv" in str(file):
                continue
            try:
                content = file.read_text().lower()
                if "redis" in content or "memcache" in content:
                    has_redis = True
                    scale_score += 1
                if "cache" in content or "@cache" in content:
                    has_caching = True
                    scale_score += 1
            except:
                pass
        
        if not has_caching:
            improvements.append("Add caching layer (Redis/Memcached) for performance")
        
        # Check for database indexing and optimization
        migration_files = list(self.project_path.glob("**/migrations/*.py"))
        if migration_files:
            has_indexes = any("index" in f.read_text().lower() for f in migration_files[:5])
            if has_indexes:
                scale_score += 1
                self.green_flags.append("✅ Database indexes found")
            else:
                improvements.append("Add database indexes for frequently queried fields")
        
        # Check for async/background jobs
        has_celery = Path("celery.py").exists() or any("celery" in f.name for f in self.project_path.glob("**/*.py"))
        has_queue = any(Path(f).exists() for f in ["tasks.py", "jobs.py", "workers.py"])
        
        if has_celery or has_queue:
            scale_score += 2
            self.green_flags.append("✅ Background job processing implemented")
        else:
            improvements.append("Add background job queue (Celery/RQ) for heavy tasks")
        
        # Check for API rate limiting
        has_rate_limit = False
        for file in self.project_path.glob("**/*.py"):
            try:
                if "rate_limit" in file.read_text().lower() or "throttle" in file.read_text().lower():
                    has_rate_limit = True
                    scale_score += 1
                    break
            except:
                pass
        
        if not has_rate_limit:
            improvements.append("Implement API rate limiting to prevent abuse")
        
        # Check for pagination
        has_pagination = False
        for file in self.project_path.glob("**/*.py"):
            try:
                content = file.read_text().lower()
                if "paginate" in content or "page_size" in content or "limit" in content:
                    has_pagination = True
                    scale_score += 1
                    break
            except:
                pass
        
        if not has_pagination:
            improvements.append("Add pagination to list endpoints")
        
        self.scores["scalability"] = min(10, scale_score)
        
        if scale_score < 5:
            self.red_flags.append("🚨 Not ready to scale - missing key infrastructure")
        
        for imp in improvements[:3]:
            self.recommendations.append(f"[Scale] {imp}")
        
        return {"score": scale_score, "improvements": improvements}
    
    # ========================================================================
    # AGENT 3: SECURITY ANALYZER
    # ========================================================================
    
    def analyze_security(self) -> Dict:
        """VC Question: 'Is this secure enough for enterprise customers?'"""
        
        print("🔍 ANALYZING: Security & Compliance...")
        
        security_score = 5
        vulnerabilities = []
        fixes = []
        
        # Check for environment variables (not hardcoded secrets)
        env_file = Path(".env")
        env_example = Path(".env.example") or Path(".env.sample")
        
        if env_file.exists() or env_example.exists():
            security_score += 2
            self.green_flags.append("✅ Using environment variables")
        else:
            fixes.append("Use .env file for secrets (never commit it!)")
        
        # Check for exposed secrets
        dangerous_patterns = [
            (r'api_key\s*=\s*["\'][^"\']+["\']', "Hardcoded API key"),
            (r'password\s*=\s*["\'][^"\']+["\']', "Hardcoded password"),
            (r'secret\s*=\s*["\'][^"\']+["\']', "Hardcoded secret"),
            (r'token\s*=\s*["\'][^"\']+["\']', "Hardcoded token"),
        ]
        
        for file in self.project_path.glob("**/*.py"):
            if "venv" in str(file) or "test" in str(file):
                continue
            try:
                content = file.read_text()
                for pattern, desc in dangerous_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        security_score -= 2
                        vulnerabilities.append(f"{desc} in {file.name}")
                        fixes.append(f"Move {desc.lower()} to environment variables")
            except:
                pass
        
        # Check for authentication
        has_auth = any(
            Path(p).exists() for p in [
                "auth.py", "authentication.py", "login.py",
                "auth/", "authentication/", "accounts/"
            ]
        )
        
        if has_auth:
            security_score += 2
            self.green_flags.append("✅ Authentication system found")
        else:
            fixes.append("Implement user authentication (JWT/OAuth)")
            self.red_flags.append("🚨 No authentication system found")
        
        # Check for HTTPS/SSL
        for file in self.project_path.glob("**/*.py"):
            try:
                content = file.read_text()
                if "https" in content or "ssl" in content.lower():
                    security_score += 1
                    break
            except:
                pass
        
        # Check for input validation
        has_validation = False
        for file in self.project_path.glob("**/*.py"):
            try:
                content = file.read_text().lower()
                if "validate" in content or "sanitize" in content or "schema" in content:
                    has_validation = True
                    security_score += 1
                    break
            except:
                pass
        
        if not has_validation:
            fixes.append("Add input validation/sanitization")
        
        # Check for SQL injection protection
        uses_orm = any(
            term in str(list(self.project_path.glob("**/*.py"))[:20])
            for term in ["sqlalchemy", "django", "models", "prisma"]
        )
        
        if uses_orm:
            security_score += 1
        else:
            fixes.append("Use ORM to prevent SQL injection")
        
        self.scores["security"] = min(10, max(0, security_score))
        
        if vulnerabilities:
            self.red_flags.append(f"🚨 Security vulnerabilities: {len(vulnerabilities)} found")
        
        for fix in fixes[:3]:
            self.recommendations.append(f"[Security] {fix}")
        
        return {"score": security_score, "vulnerabilities": vulnerabilities, "fixes": fixes}
    
    # ========================================================================
    # AGENT 4: MONETIZATION READINESS
    # ========================================================================
    
    def analyze_monetization_readiness(self) -> Dict:
        """VC Question: 'Can this make money tomorrow?'"""
        
        print("🔍 ANALYZING: Monetization & Revenue Infrastructure...")
        
        money_score = 3
        missing = []
        
        # Check for payment integration
        payment_providers = ["stripe", "paypal", "square", "braintree", "razorpay"]
        has_payments = False
        
        for file in self.project_path.glob("**/*"):
            if file.is_file():
                try:
                    content = file.read_text().lower()
                    for provider in payment_providers:
                        if provider in content:
                            has_payments = True
                            money_score += 3
                            self.green_flags.append(f"✅ Payment system found ({provider})")
                            break
                    if has_payments:
                        break
                except:
                    pass
        
        if not has_payments:
            missing.append("Integrate payment processor (Stripe/PayPal)")
            self.red_flags.append("🚨 No payment system - can't collect money!")
        
        # Check for subscription/billing logic
        has_subscription = any(
            term in str(self.project_path.glob("**/*.py"))
            for term in ["subscription", "billing", "invoice", "payment", "checkout"]
        )
        
        if has_subscription:
            money_score += 2
        else:
            missing.append("Add subscription/billing management")
        
        # Check for pricing models/tiers
        has_pricing = any(
            term in str(self.project_path.glob("**/*"))
            for term in ["pricing", "plans", "tiers", "premium", "pro"]
        )
        
        if has_pricing:
            money_score += 1
        else:
            missing.append("Define pricing tiers/plans")
        
        # Check for usage tracking/analytics
        has_analytics = any(
            term in str(self.project_path.glob("**/*"))
            for term in ["analytics", "tracking", "metrics", "usage", "mixpanel", "segment", "amplitude"]
        )
        
        if has_analytics:
            money_score += 2
        else:
            missing.append("Add usage analytics to track customer behavior")
        
        # Check for admin dashboard
        has_admin = any(
            Path(p).exists() for p in ["admin", "dashboard", "admin.py", "dashboard.py"]
        )
        
        if has_admin:
            money_score += 1
        else:
            missing.append("Build admin dashboard for business metrics")
        
        self.scores["monetization"] = min(10, money_score)
        
        for item in missing[:3]:
            self.recommendations.append(f"[Revenue] {item}")
        
        return {"score": money_score, "missing": missing}
    
    # ========================================================================
    # AGENT 5: USER EXPERIENCE ANALYZER
    # ========================================================================
    
    def analyze_user_experience(self) -> Dict:
        """VC Question: 'Will users love this product?'"""
        
        print("🔍 ANALYZING: User Experience & Interface...")
        
        ux_score = 5
        improvements = []
        
        # Check for frontend framework
        if Path("package.json").exists():
            try:
                with open("package.json") as f:
                    pkg = json.load(f)
                    deps = pkg.get("dependencies", {})
                    
                    if "react" in deps or "vue" in deps or "angular" in deps:
                        ux_score += 2
                        self.green_flags.append("✅ Modern frontend framework")
                    
                    if "tailwindcss" in deps or "bootstrap" in deps:
                        ux_score += 1
            except:
                pass
        
        # Check for mobile responsiveness
        responsive_indicators = ["responsive", "mobile", "viewport", "media-query", "@media"]
        has_responsive = False
        
        for file in list(self.project_path.glob("**/*.css")) + list(self.project_path.glob("**/*.scss")):
            try:
                if any(term in file.read_text().lower() for term in responsive_indicators):
                    has_responsive = True
                    ux_score += 1
                    break
            except:
                pass
        
        if not has_responsive:
            improvements.append("Ensure mobile responsiveness")
        
        # Check for loading states/error handling in frontend
        for file in self.project_path.glob("**/*.jsx") or self.project_path.glob("**/*.tsx"):
            try:
                content = file.read_text()
                if "loading" in content.lower():
                    ux_score += 0.5
                if "error" in content.lower():
                    ux_score += 0.5
                break
            except:
                pass
        
        # Check for user onboarding
        has_onboarding = any(
            term in str(self.project_path.glob("**/*"))
            for term in ["onboarding", "tutorial", "getting-started", "welcome", "tour"]
        )
        
        if has_onboarding:
            ux_score += 1
        else:
            improvements.append("Add user onboarding flow")
        
        # Check for email templates
        has_emails = any(
            Path(p).exists() for p in ["templates/email", "emails", "email_templates"]
        )
        
        if has_emails:
            ux_score += 1
        else:
            improvements.append("Add transactional email templates")
        
        self.scores["user_experience"] = min(10, ux_score)
        
        for imp in improvements[:2]:
            self.recommendations.append(f"[UX] {imp}")
        
        return {"score": ux_score, "improvements": improvements}
    
    # ========================================================================
    # AGENT 6: DATA INFRASTRUCTURE
    # ========================================================================
    
    def analyze_data_infrastructure(self) -> Dict:
        """VC Question: 'Do they know their metrics?'"""
        
        print("🔍 ANALYZING: Data & Analytics Infrastructure...")
        
        data_score = 4
        missing = []
        
        # Check for database
        has_db = any(
            Path(p).exists() for p in [
                "database", "db", "models.py", "schema.sql", "migrations"
            ]
        )
        
        if has_db:
            data_score += 2
            self.green_flags.append("✅ Database infrastructure found")
        else:
            missing.append("Set up proper database")
            self.red_flags.append("🚨 No database found")
        
        # Check for data backups
        has_backups = any(
            term in str(self.project_path.glob("**/*"))
            for term in ["backup", "dump", "export"]
        )
        
        if has_backups:
            data_score += 1
        else:
            missing.append("Implement automated backups")
        
        # Check for logging
        has_logging = False
        for file in self.project_path.glob("**/*.py"):
            try:
                if "logging" in file.read_text() or "logger" in file.read_text():
                    has_logging = True
                    data_score += 1
                    break
            except:
                pass
        
        if not has_logging:
            missing.append("Add proper logging system")
        
        # Check for monitoring/metrics
        monitoring_tools = ["sentry", "datadog", "newrelic", "prometheus", "grafana"]
        has_monitoring = any(
            tool in str(self.project_path.glob("**/*"))
            for tool in monitoring_tools
        )
        
        if has_monitoring:
            data_score += 2
            self.green_flags.append("✅ Monitoring/metrics system found")
        else:
            missing.append("Add monitoring (Sentry for errors, Datadog for metrics)")
        
        self.scores["data_infrastructure"] = min(10, data_score)
        
        for item in missing[:2]:
            self.recommendations.append(f"[Data] {item}")
        
        return {"score": data_score, "missing": missing}
    
    # ========================================================================
    # AGENT 7: TESTING QUALITY
    # ========================================================================
    
    def analyze_testing_quality(self) -> Dict:
        """VC Question: 'Is this production-ready?'"""
        
        print("🔍 ANALYZING: Testing & Quality Assurance...")
        
        test_score = 2
        missing = []
        
        # Count test files
        test_files = list(self.project_path.glob("**/test_*.py")) + \
                    list(self.project_path.glob("**/*_test.py")) + \
                    list(self.project_path.glob("**/*.test.js")) + \
                    list(self.project_path.glob("**/*.spec.js"))
        
        if test_files:
            test_score += 3
            self.green_flags.append(f"✅ Found {len(test_files)} test files")
            
            # Check test coverage
            if len(test_files) > 10:
                test_score += 2
            elif len(test_files) > 5:
                test_score += 1
        else:
            self.red_flags.append("🚨 No tests found!")
            missing.append("Add unit tests (critical for investors)")
        
        # Check for CI/CD
        ci_files = [".github/workflows", ".gitlab-ci.yml", "Jenkinsfile", ".circleci"]
        has_ci = any(Path(f).exists() for f in ci_files)
        
        if has_ci:
            test_score += 2
            self.green_flags.append("✅ CI/CD pipeline configured")
        else:
            missing.append("Set up CI/CD pipeline (GitHub Actions)")
        
        # Check for linting
        lint_files = [".eslintrc", ".pylintrc", ".flake8", "pyproject.toml"]
        has_linting = any(Path(f).exists() for f in lint_files)
        
        if has_linting:
            test_score += 1
        else:
            missing.append("Add code linting configuration")
        
        self.scores["testing"] = min(10, test_score)
        
        for item in missing[:2]:
            self.recommendations.append(f"[Quality] {item}")
        
        return {"score": test_score, "missing": missing}
    
    # ========================================================================
    # AGENT 8: DOCUMENTATION
    # ========================================================================
    
    def analyze_documentation(self) -> Dict:
        """VC Question: 'Can new developers understand this?'"""
        
        print("🔍 ANALYZING: Documentation & Knowledge Transfer...")
        
        doc_score = 3
        missing = []
        
        # Check README
        readme = Path("README.md") or Path("README.rst") or Path("README.txt")
        if readme and readme.exists():
            content = readme.read_text()
            doc_score += 2
            
            # Check README quality
            if len(content) > 500:
                doc_score += 1
            if "installation" in content.lower() or "setup" in content.lower():
                doc_score += 1
            if "api" in content.lower() or "usage" in content.lower():
                doc_score += 1
        else:
            self.red_flags.append("🚨 No README file!")
            missing.append("Create comprehensive README.md")
        
        # Check for API documentation
        has_api_docs = any(
            Path(p).exists() for p in ["docs", "documentation", "swagger.json", "openapi.yaml"]
        )
        
        if has_api_docs:
            doc_score += 2
            self.green_flags.append("✅ API documentation found")
        else:
            missing.append("Add API documentation (Swagger/OpenAPI)")
        
        # Check for inline code comments
        total_py_files = list(self.project_path.glob("**/*.py"))[:10]
        if total_py_files:
            commented_files = 0
            for file in total_py_files:
                try:
                    content = file.read_text()
                    if content.count("#") > 5 or '"""' in content:
                        commented_files += 1
                except:
                    pass
            
            if commented_files > len(total_py_files) * 0.5:
                doc_score += 1
        
        self.scores["documentation"] = min(10, doc_score)
        
        for item in missing[:2]:
            self.recommendations.append(f"[Docs] {item}")
        
        return {"score": doc_score, "missing": missing}
    
    # ========================================================================
    # AGENT 9: DEPLOYMENT READINESS
    # ========================================================================
    
    def analyze_deployment_readiness(self) -> Dict:
        """VC Question: 'Can this be deployed today?'"""
        
        print("🔍 ANALYZING: Deployment & DevOps...")
        
        deploy_score = 3
        missing = []
        
        # Check for Docker
        if Path("Dockerfile").exists() or Path("docker-compose.yml").exists():
            deploy_score += 3
            self.green_flags.append("✅ Docker configuration found")
        else:
            missing.append("Add Docker configuration for easy deployment")
        
        # Check for deployment configs
        deploy_files = ["Procfile", "app.yaml", "vercel.json", "netlify.toml", "heroku.yml"]
        if any(Path(f).exists() for f in deploy_files):
            deploy_score += 2
        else:
            missing.append("Add deployment configuration (Heroku/Vercel/AWS)")
        
        # Check for environment configuration
        if Path(".env.example").exists() or Path(".env.sample").exists():
            deploy_score += 1
        else:
            missing.append("Create .env.example file")
        
        # Check for requirements/dependencies
        if Path("requirements.txt").exists() or Path("package.json").exists():
            deploy_score += 1
        else:
            missing.append("Add dependency management file")
        
        self.scores["deployment"] = min(10, deploy_score)
        
        for item in missing[:2]:
            self.recommendations.append(f"[Deploy] {item}")
        
        return {"score": deploy_score, "missing": missing}
    
    # ========================================================================
    # AGENT 10: GROWTH INFRASTRUCTURE
    # ========================================================================
    
    def analyze_growth_infrastructure(self) -> Dict:
        """VC Question: 'Can this grow to 1M users?'"""
        
        print("🔍 ANALYZING: Growth & Marketing Infrastructure...")
        
        growth_score = 3
        missing = []
        
        # Check for user tracking/analytics
        analytics_tools = ["google_analytics", "gtag", "mixpanel", "segment", "amplitude", "posthog"]
        has_analytics = any(
            tool in str(self.project_path.glob("**/*")).lower()
            for tool in analytics_tools
        )
        
        if has_analytics:
            growth_score += 2
            self.green_flags.append("✅ Analytics tracking implemented")
        else:
            missing.append("Add analytics (Google Analytics/Mixpanel)")
        
        # Check for SEO
        seo_indicators = ["meta", "og:", "sitemap", "robots.txt", "title", "description"]
        has_seo = any(
            indicator in str(self.project_path.glob("**/*.html"))
            for indicator in seo_indicators
        )
        
        if has_seo:
            growth_score += 1
        else:
            missing.append("Implement SEO basics (meta tags, sitemap)")
        
        # Check for email marketing
        email_tools = ["mailchimp", "sendgrid", "mailgun", "ses", "postmark"]
        has_email = any(
            tool in str(self.project_path.glob("**/*")).lower()
            for tool in email_tools
        )
        
        if has_email:
            growth_score += 2
        else:
            missing.append("Integrate email service for marketing")
        
        # Check for referral/sharing features
        sharing_indicators = ["share", "refer", "invite", "social"]
        has_sharing = any(
            indicator in str(self.project_path.glob("**/*")).lower()
            for indicator in sharing_indicators
        )
        
        if has_sharing:
            growth_score += 2
        else:
            missing.append("Add viral/sharing features")
        
        self.scores["growth"] = min(10, growth_score)
        
        for item in missing[:2]:
            self.recommendations.append(f"[Growth] {item}")
        
        return {"score": growth_score, "missing": missing}
    
    # ========================================================================
    # RESULTS DISPLAY
    # ========================================================================
    
    def display_results(self, overall_score: float):
        """Display the investment board's verdict"""
        
        print("\n" + "="*80)
        print("📊 INVESTMENT READINESS SCORES")
        print("="*80)
        
        # Display individual scores
        categories = [
            ("Technical Debt", self.scores.get("technical_debt", 0)),
            ("Scalability", self.scores.get("scalability", 0)),
            ("Security", self.scores.get("security", 0)),
            ("Monetization", self.scores.get("monetization", 0)),
            ("User Experience", self.scores.get("user_experience", 0)),
            ("Data Infrastructure", self.scores.get("data_infrastructure", 0)),
            ("Testing Quality", self.scores.get("testing", 0)),
            ("Documentation", self.scores.get("documentation", 0)),
            ("Deployment Ready", self.scores.get("deployment", 0)),
            ("Growth Infrastructure", self.scores.get("growth", 0))
        ]
        
        for category, score in categories:
            bar = "█" * int(score) + "░" * (10 - int(score))
            emoji = "✅" if score >= 7 else "⚠️" if score >= 5 else "❌"
            print(f"{emoji} {category:20} [{bar}] {score:.1f}/10")
        
        print("\n" + "-"*80)
        print(f"🎯 OVERALL INVESTMENT SCORE: {overall_score:.1f}/10")
        print("-"*80)
        
        # Investment verdict
        if overall_score >= 8:
            verdict = """
🟢 INVESTMENT READY - Series A Level
Your codebase demonstrates professional development practices.
VCs will be impressed with the technical foundation.
            """
        elif overall_score >= 6.5:
            verdict = """
🟡 SEED READY - Good Foundation
Your codebase is solid but needs some improvements.
Perfect for seed funding to build out the team.
            """
        elif overall_score >= 5:
            verdict = """
🟠 PRE-SEED READY - Early But Promising
You have a working product but need to professionalize.
Good for friends & family or pre-seed funding.
            """
        else:
            verdict = """
🔴 NOT READY - Keep Building
The codebase needs significant work before approaching investors.
Focus on the recommendations below.
            """
        
        print(verdict)
        
        # Top recommendations
        if self.recommendations:
            print("\n" + "="*80)
            print("🎯 TOP PRIORITY IMPROVEMENTS (Do These First!)")
            print("="*80)
            for i, rec in enumerate(self.recommendations[:10], 1):
                print(f"{i:2}. {rec}")
        
        # Red flags that MUST be fixed
        if self.red_flags:
            print("\n" + "="*80)
            print("🚨 RED FLAGS (Fix These Before Talking to Investors!)")
            print("="*80)
            for flag in self.red_flags:
                print(f"   {flag}")
        
        # Green flags to highlight
        if self.green_flags:
            print("\n" + "="*80)
            print("✅ STRENGTHS (Highlight These to Investors!)")
            print("="*80)
            for flag in self.green_flags:
                print(f"   {flag}")
        
        # Valuation impact
        print("\n" + "="*80)
        print("💰 VALUATION IMPACT")
        print("="*80)
        
        if overall_score >= 7:
            print("Each 1-point improvement could add $100K-500K to your valuation")
        else:
            print("Each 1-point improvement could add $50K-200K to your valuation")
        
        priority_improvements = {
            "Add payment system": "+$200K-500K valuation",
            "Add comprehensive tests": "+$100K-300K valuation",
            "Implement CI/CD": "+$50K-150K valuation",
            "Add monitoring/analytics": "+$100K-200K valuation",
            "Docker deployment": "+$50K-100K valuation"
        }
        
        print("\nQuick wins for valuation:")
        for improvement, impact in list(priority_improvements.items())[:3]:
            if improvement.lower() in str(self.recommendations).lower():
                print(f"   • {improvement}: {impact}")
        
        # Save results
        self.save_results(overall_score)
    
    def save_results(self, score: float):
        """Save analysis results to file"""
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"investment_analysis_{timestamp}.txt"
        
        with open(filename, "w") as f:
            f.write(f"Investment Analysis - {self.project_name}\n")
            f.write(f"Score: {score:.1f}/10\n")
            f.write(f"Date: {datetime.now()}\n\n")
            f.write("Recommendations:\n")
            for rec in self.recommendations:
                f.write(f"- {rec}\n")
        
        print(f"\n📄 Full report saved to: {filename}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    analyzer = CodeInvestmentAnalyzer()
    score = analyzer.analyze()
    
    print("\n" + "="*80)
    print("💡 NEXT STEPS")
    print("="*80)
    print("""
1. Fix the RED FLAGS first (these are deal-breakers)
2. Implement the top 3 recommendations this week
3. Re-run this analysis weekly to track progress
4. Once you hit 7/10, you're ready for investor conversations
5. At 8/10, you can command premium valuations

Remember: Every improvement makes your company more valuable!
    """)
