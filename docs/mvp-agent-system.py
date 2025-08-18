#!/usr/bin/env python3
"""
MVP AGENT TEAM SYSTEM v2
Account Manager as True Orchestrator
"""

import json
import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import time

class Priority(Enum):
    CRITICAL = "CRITICAL"  # Ship blocker
    HIGH = "HIGH"          # Core MVP feature
    MEDIUM = "MEDIUM"      # Nice to have
    LOW = "LOW"            # Post-MVP

class TaskStatus(Enum):
    BLOCKED = "BLOCKED"
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    DONE = "DONE"
    KILLED = "KILLED"  # Cut from scope

@dataclass
class Task:
    id: str
    title: str
    owner: str
    priority: Priority
    status: TaskStatus = TaskStatus.TODO
    deadline: Optional[str] = None
    blockers: List[str] = field(default_factory=list)
    output: Optional[Any] = None
    context: Optional[str] = None

@dataclass
class ProjectContext:
    """Everything the AM knows about your project"""
    idea: str
    target_user: str
    core_problem: str
    solution: str
    unique_value: str
    revenue_model: str
    timeline: str
    budget: float
    tech_stack: List[str]
    founder_skills: List[str]
    constraints: List[str]
    competitors: List[str]
    success_metrics: Dict[str, Any]

class BaseAgent:
    """Base agent with core functionality"""
    def __init__(self, name: str):
        self.name = name
        self.tasks: List[Task] = []
        self.project_context: Optional[ProjectContext] = None
    
    def set_context(self, context: ProjectContext):
        self.project_context = context
    
    def receive_task(self, task: Task) -> Dict:
        self.tasks.append(task)
        return self.process_task(task)
    
    def process_task(self, task: Task) -> Dict:
        """Override in subclasses"""
        return {"agent": self.name, "status": "processing", "task": task.title}

class AccountManager:
    """
    The TRUE orchestrator. Learns your idea, maintains context, 
    delegates intelligently, and keeps you on track.
    """
    def __init__(self):
        self.name = "Account Manager"
        self.project_context: Optional[ProjectContext] = None
        self.agents = {}
        self.all_tasks = []
        self.decisions_made = []
        self.current_sprint = []
        self.roadmap = {}
        self.conversation_history = []
        
    def initialize_team(self):
        """Set up all agent teams"""
        self.agents = {
            "design": DesignTeam("Design"),
            "ux": UXTeam("UX/UI"),
            "strategy": StrategyTeam("Strategy"),
            "analytics": AnalyticsTeam("Analytics"),
            "social": SocialMediaTeam("Social Media"),
            "genz": GenZExpert("Gen Z Expert"),
            "genalpha": GenAlphaExpert("Gen Alpha Expert"),
            "engagement": EngagementExpert("Engagement Expert"),
            "influencer": InfluencerExpert("Influencer Expert"),
            "virality": SocialMediaViralityExpert("Virality Expert"),
            "financial": FinancialAdvisor("Financial Advisor"),
            "investor": InvestorRelations("Investor Relations"),
            "marketing": MarketingTeam("Marketing"),
            "media": MediaTeam("Media"),
            "dev": DevTeam("Dev Team"),
            "qa": QATeam("QA Team"),
            "testing": TestingTeam("Testing"),
            "research": UXResearchTeam("UX/Market Research")
        }
    
    def onboard_founder(self) -> Dict:
        """Initial onboarding to understand the project deeply"""
        questions = {
            "idea": "In one sentence, what are you building?",
            "problem": "What specific problem does this solve?",
            "user": "Who desperately needs this? Be specific.",
            "solution": "How does your solution work in simple terms?",
            "different": "What makes this different from existing solutions?",
            "revenue": "How will you make money from day 1?",
            "skills": "What can YOU personally build/do? (coding, design, sales, etc)",
            "timeline": "When do you need to launch? (be realistic)",
            "budget": "What's your budget? (be honest, even if it's $0)",
            "blockers": "What's your biggest concern about building this?"
        }
        
        print("\n" + "="*60)
        print("ACCOUNT MANAGER: Let's get real about your MVP.")
        print("="*60)
        print("\nI need to understand your project to orchestrate effectively.")
        print("Answer honestly - BS wastes both our time.\n")
        
        context_data = {}
        for key, question in questions.items():
            response = input(f"📊 {question}\n→ ")
            context_data[key] = response
            self.conversation_history.append({"question": question, "answer": response})
        
        # Process and create context
        self.project_context = ProjectContext(
            idea=context_data["idea"],
            target_user=context_data["user"],
            core_problem=context_data["problem"],
            solution=context_data["solution"],
            unique_value=context_data["different"],
            revenue_model=context_data["revenue"],
            timeline=context_data["timeline"],
            budget=float(context_data["budget"]) if context_data["budget"].replace("$","").replace(",","").isdigit() else 0,
            tech_stack=[],
            founder_skills=context_data["skills"].split(","),
            constraints=[context_data["blockers"]],
            competitors=[],
            success_metrics={}
        )
        
        # Share context with all agents
        for agent in self.agents.values():
            agent.set_context(self.project_context)
        
        return self.analyze_and_plan()
    
    def analyze_and_plan(self) -> Dict:
        """Analyze the idea and create execution plan"""
        analysis = {
            "verdict": "",
            "mvp_scope": "",
            "cut_features": [],
            "week_1_focus": "",
            "week_2_focus": "",
            "biggest_risk": "",
            "first_milestone": "",
            "team_assignments": {}
        }
        
        # Brutal honesty about the idea
        if len(self.project_context.idea.split()) > 15:
            analysis["verdict"] = "❌ Too complex. Simplify to ONE core feature."
        elif self.project_context.budget == 0 and "marketplace" in self.project_context.idea.lower():
            analysis["verdict"] = "⚠️ Marketplaces need budget for both sides. Rethink or get funds."
        elif not self.project_context.revenue_model or "later" in self.project_context.revenue_model.lower():
            analysis["verdict"] = "❌ No revenue model = dead startup. Fix this first."
        else:
            analysis["verdict"] = "✅ Viable. Let's build."
        
        # Define MVP scope based on context
        analysis["mvp_scope"] = self._define_mvp_scope()
        analysis["cut_features"] = self._identify_cuts()
        
        # Create 2-week sprint plan
        analysis["week_1_focus"] = self._plan_week_1()
        analysis["week_2_focus"] = self._plan_week_2()
        
        # Identify risks
        analysis["biggest_risk"] = self._identify_main_risk()
        analysis["first_milestone"] = "First paying customer in 14 days"
        
        # Initial team assignments
        analysis["team_assignments"] = self._create_initial_assignments()
        
        # Store the plan
        self.roadmap = analysis
        
        return analysis
    
    def process_request(self, request: str) -> Dict:
        """
        Process any request from founder with full context awareness
        """
        self.conversation_history.append({"founder": request, "timestamp": datetime.datetime.now()})
        
        response = {
            "request": request,
            "context_check": self._check_alignment(request),
            "decision": "",
            "assignments": {},
            "next_steps": [],
            "warnings": []
        }
        
        # Check if request aligns with MVP
        if not self._aligns_with_mvp(request):
            response["decision"] = "BLOCKED: This doesn't align with your MVP scope."
            response["warnings"].append(f"Focus on: {self.roadmap['mvp_scope']}")
            response["next_steps"] = ["Revisit after MVP ships"]
            return response
        
        # Parse request and delegate
        task_type = self._categorize_request(request)
        relevant_teams = self._identify_relevant_teams(task_type)
        
        # Create tasks and assign
        for team in relevant_teams:
            task = self._create_task(request, team)
            self.current_sprint.append(task)
            
            # Get team's response
            team_response = self.agents[team].receive_task(task)
            response["assignments"][team] = team_response
            
            # Track the task
            self.all_tasks.append(task)
        
        # Synthesize responses and give founder clear direction
        response["decision"] = self._make_decision(response["assignments"])
        response["next_steps"] = self._define_next_steps(response["assignments"])
        
        # Check for blockers
        blockers = self._check_for_blockers()
        if blockers:
            response["warnings"].extend(blockers)
        
        return response
    
    def daily_check_in(self) -> Dict:
        """Proactive daily check-in with founder"""
        check_in = {
            "day": len(self.conversation_history),
            "progress": {},
            "blockers": [],
            "decisions_needed": [],
            "today_focus": "",
            "reminder": ""
        }
        
        # Check task progress
        for task in self.current_sprint:
            if task.status == TaskStatus.DONE:
                check_in["progress"][task.title] = "✅ Complete"
            elif task.status == TaskStatus.IN_PROGRESS:
                check_in["progress"][task.title] = "🔄 In Progress"
            elif task.status == TaskStatus.BLOCKED:
                check_in["blockers"].append(f"🚫 {task.title}: {task.blockers}")
        
        # What needs founder input?
        if self.project_context.timeline == "2 weeks" and check_in["day"] > 7:
            check_in["decisions_needed"].append("Cut features or extend timeline?")
            check_in["reminder"] = "DEFAULT TO CUTTING. Ship on time."
        
        # Today's focus
        check_in["today_focus"] = self._get_today_focus(check_in["day"])
        
        return check_in
    
    def pivot_recommendation(self) -> Optional[Dict]:
        """Recommend pivot if data suggests it"""
        if not self._should_consider_pivot():
            return None
        
        return {
            "signal": "No user engagement after 50 customer interviews",
            "recommendation": "Pivot to adjacent problem users actually mentioned",
            "new_direction": self._suggest_pivot_direction(),
            "keep": "Your tech stack and team",
            "change": "The problem you're solving",
            "timeline": "Make decision in 48 hours"
        }
    
    # Helper methods
    def _define_mvp_scope(self) -> str:
        problem = self.project_context.core_problem.lower()
        if "track" in problem or "monitor" in problem:
            return "Basic dashboard + one key metric + daily email"
        elif "connect" in problem or "match" in problem:
            return "Simple matching algorithm + chat + payment"
        elif "automate" in problem:
            return "One workflow automated end-to-end"
        else:
            return "Core feature that solves the main problem"
    
    def _identify_cuts(self) -> List[str]:
        cuts = ["Admin panel", "Mobile app", "Advanced analytics", "Social features", 
                "Customization options", "Multiple user types", "API", "Integrations"]
        return cuts[:5]  # Top 5 things to cut
    
    def _plan_week_1(self) -> str:
        if "coding" in " ".join(self.project_context.founder_skills).lower():
            return "Build core backend + basic frontend + payment integration"
        else:
            return "No-code MVP + 20 customer interviews + landing page"
    
    def _plan_week_2(self) -> str:
        return "Polish core flow + onboard 10 beta users + iterate based on feedback"
    
    def _identify_main_risk(self) -> str:
        if self.project_context.budget == 0:
            return "No budget for marketing. Need organic growth strategy."
        elif "technical" not in " ".join(self.project_context.founder_skills).lower():
            return "Non-technical founder. Consider no-code or find technical co-founder."
        else:
            return "User adoption. Need validation before building."
    
    def _create_initial_assignments(self) -> Dict:
        assignments = {}
        
        # Always start with research
        assignments["research"] = "Validate problem with 10 potential users TODAY"
        
        # Based on founder skills
        if "coding" in " ".join(self.project_context.founder_skills).lower():
            assignments["dev"] = "Set up basic repo, auth, and database"
        else:
            assignments["strategy"] = "Identify no-code tools for MVP"
        
        if "design" in " ".join(self.project_context.founder_skills).lower():
            assignments["design"] = "Create low-fi wireframes of core flow"
        else:
            assignments["ux"] = "Map user journey on paper"
        
        # Everyone needs these
        assignments["financial"] = "Calculate runway and burn rate"
        assignments["marketing"] = "Set up landing page and email capture"
        
        return assignments
    
    def _check_alignment(self, request: str) -> str:
        if any(word in request.lower() for word in ["feature", "add", "new"]):
            return "⚠️ Feature creep detected. Does this align with MVP?"
        return "✅ Aligned with MVP scope"
    
    def _aligns_with_mvp(self, request: str) -> bool:
        danger_words = ["redesign", "rebuild", "additional", "extra", "nice to have"]
        return not any(word in request.lower() for word in danger_words)
    
    def _categorize_request(self, request: str) -> str:
        request_lower = request.lower()
        if any(word in request_lower for word in ["build", "code", "develop"]):
            return "development"
        elif any(word in request_lower for word in ["design", "ui", "ux"]):
            return "design"
        elif any(word in request_lower for word in ["market", "growth", "users"]):
            return "marketing"
        elif any(word in request_lower for word in ["test", "feedback", "validate"]):
            return "validation"
        else:
            return "strategy"
    
    def _identify_relevant_teams(self, task_type: str) -> List[str]:
        team_map = {
            "development": ["dev", "qa", "testing"],
            "design": ["design", "ux"],
            "marketing": ["marketing", "social", "engagement"],
            "validation": ["research", "analytics"],
            "strategy": ["strategy", "financial"]
        }
        return team_map.get(task_type, ["strategy"])
    
    def _create_task(self, request: str, team: str) -> Task:
        return Task(
            id=f"TASK-{len(self.all_tasks)+1}",
            title=request[:50],
            owner=team,
            priority=Priority.CRITICAL,
            deadline="48 hours",
            context=f"Related to: {self.project_context.idea}"
        )
    
    def _make_decision(self, assignments: Dict) -> str:
        if len(assignments) > 3:
            return "APPROVED: But executing in parallel. Don't wait for perfection."
        else:
            return "APPROVED: Focus on this before moving forward."
    
    def _define_next_steps(self, assignments: Dict) -> List[str]:
        steps = []
        for team, response in assignments.items():
            if isinstance(response, dict) and "next_action" in response:
                steps.append(response["next_action"])
        
        if not steps:
            steps = ["Execute assigned tasks", "Report back in 24 hours", "No meetings, just build"]
        
        return steps[:3]  # Top 3 next steps
    
    def _check_for_blockers(self) -> List[str]:
        blockers = []
        for task in self.current_sprint:
            if task.status == TaskStatus.BLOCKED:
                blockers.append(f"Task {task.id} blocked: {task.blockers}")
        return blockers
    
    def _get_today_focus(self, day: int) -> str:
        week1_focus = {
            1: "Validate core problem with users",
            2: "Build authentication and database",
            3: "Create core feature backend",
            4: "Build minimal frontend",
            5: "Integrate payments",
            6: "Internal testing",
            7: "Fix critical bugs only"
        }
        week2_focus = {
            8: "Launch to 5 beta users",
            9: "Gather feedback, fix breaks",
            10: "Launch to 20 users",
            11: "Implement highest-impact feedback",
            12: "Prepare for public launch",
            13: "Launch on one channel",
            14: "Get first paying customer"
        }
        
        if day <= 7:
            return week1_focus.get(day, "Keep building")
        else:
            return week2_focus.get(day - 7, "Focus on users")
    
    def _should_consider_pivot(self) -> bool:
        # Check signals for pivot
        no_user_interest = len([t for t in self.all_tasks if "research" in t.owner and t.status == TaskStatus.DONE]) > 3
        no_progress = len([t for t in self.all_tasks if t.status == TaskStatus.DONE]) < 2
        return no_user_interest or no_progress
    
    def _suggest_pivot_direction(self) -> str:
        return "Focus on the ONE thing users actually asked for in interviews"

# AGENT TEAMS - Each with specific expertise

class DesignTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Design",
            "approach": "Mobile-first, single page, no animations",
            "timeline": "24 hours for wireframes, 48 for high-fidelity",
            "tools": "Figma only. Share link for feedback.",
            "deliverable": f"3 screens max for {self.project_context.idea if self.project_context else 'MVP'}",
            "next_action": "Create wireframe of main user flow"
        }

class UXTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "UX",
            "focus": "Reduce clicks to value. Simplify onboarding.",
            "user_flow": "Sign up → First value → Payment",
            "principles": "Clarity > Cleverness. Speed > Beauty.",
            "next_action": "Map critical path in 5 steps or less"
        }

class StrategyTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        context = self.project_context
        return {
            "team": "Strategy",
            "positioning": f"The simplest way to {context.core_problem if context else 'solve problem'}",
            "differentiator": "Speed and simplicity",
            "go_to_market": "Direct to user, no middlemen",
            "next_action": "Define one-sentence value prop"
        }

class AnalyticsTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Analytics",
            "essential_metrics": ["Daily Active Users", "Conversion Rate", "Churn", "Revenue"],
            "tools": "Google Analytics + Mixpanel free tier",
            "setup_time": "2 hours max",
            "next_action": "Install basic tracking on signup and payment"
        }

class SocialMediaTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Social Media",
            "platform": "Where your users already are (check research)",
            "content": "Build in public. Share struggles and wins.",
            "frequency": "Daily updates, weekly summaries",
            "next_action": "Post MVP progress screenshot today"
        }

class GenZExpert(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        if self.project_context and "gen z" in self.project_context.target_user.lower():
            return {
                "team": "Gen Z Expert",
                "critical": "Mobile-only. TikTok-first. Instant gratification.",
                "features": "Social proof, streaks, shareable moments",
                "pricing": "Free tier mandatory. $4.99/month max.",
                "next_action": "Add share button to every screen"
            }
        return {"team": "Gen Z Expert", "verdict": "Not your target. Skip Gen Z optimization."}

class GenAlphaExpert(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Gen Alpha Expert",
            "reality": "They're kids. Target parents instead.",
            "approach": "Parent dashboard + kid-safe features",
            "next_action": "Add parental controls if relevant"
        }

class EngagementExpert(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Engagement Expert",
            "hook": "Value in first 30 seconds",
            "retention": "Daily email/notification with value",
            "habit": "Same time, every day",
            "next_action": "Design day-1 experience"
        }

class InfluencerExpert(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Influencer Expert",
            "strategy": "Micro-influencers only (1K-10K followers)",
            "approach": "Give free access, ask for honest review",
            "budget": "$0. Product access only.",
            "next_action": "List 10 micro-influencers in your niche"
        }

class SocialMediaViralityExpert(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Virality Expert",
            "formula": "Unexpected + Emotional + Timely",
            "format": "Video > Image > Text",
            "hook": "First 3 seconds are everything",
            "next_action": "Create one piece of content with wow factor"
        }

class FinancialAdvisor(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        context = self.project_context
        budget = context.budget if context else 0
        return {
            "team": "Financial Advisor",
            "runway": f"{int(budget/500) if budget > 0 else 0} months at $500/month burn",
            "essential_costs": ["Domain ($12)", "Hosting ($20)", "Email ($10)"],
            "revenue_target": "$100 in week 2, $1000 in month 2",
            "next_action": "Set up Stripe and price at 10x what you think"
        }

class InvestorRelations(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Investor Relations",
            "advice": "No investors until $10K MRR",
            "focus": "Revenue > Pitch deck",
            "if_desperate": "Friends & Family round, $25K max",
            "next_action": "Ignore investors, focus on customers"
        }

class MarketingTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Marketing",
            "week_1": "Landing page + 100 emails",
            "week_2": "Launch to email list",
            "channels": "ONE: ProductHunt OR HackerNews OR Twitter",
            "content": "Case study of building in public",
            "next_action": "Write launch post draft (200 words max)"
        }

class MediaTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Media",
            "strategy": "Ignore until 100 customers",
            "if_pressed": "Local newspaper/blog only",
            "story": "Founder solving own problem",
            "next_action": "Skip media, talk to users instead"
        }

class DevTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        context = self.project_context
        stack = context.tech_stack if context else []
        return {
            "team": "Dev",
            "stack": "Next.js + Supabase + Stripe. Nothing else.",
            "architecture": "Monolith. One repository. One deploy.",
            "timeline": "Working prototype in 3 days",
            "shortcuts": "Use templates, libraries, and ChatGPT",
            "next_action": "npx create-next-app and start building"
        }

class QATeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "QA",
            "strategy": "Test payment flow only",
            "everything_else": "Users will find bugs for free",
            "tools": "Manual testing. No automation until 1000 users.",
            "next_action": "Test signup → payment → access flow 10 times"
        }

class TestingTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "Testing",
            "approach": "Friends & family first",
            "feedback": "Watch them use it. Say nothing.",
            "metrics": "Can they sign up without help?",
            "next_action": "Get 3 people to test today"
        }

class UXResearchTeam(BaseAgent):
    def process_task(self, task: Task) -> Dict:
        return {
            "team": "UX Research",
            "method": "Quick calls. 15 minutes max.",
            "questions": ["What's your biggest pain with [problem]?",
                         "How do you solve this today?",
                         "Would you pay $X for a solution?"],
            "sample": "10 users minimum",
            "next_action": "Call 3 potential users today"
        }

# MAIN ORCHESTRATION SYSTEM

class MVPOrchestrator:
    """
    Full system with Account Manager as orchestrator
    """
    def __init__(self):
        self.am = AccountManager()
        self.am.initialize_team()
        self.session_active = True
        
    def start(self):
        """Start interactive session with founder"""
        print("\n" + "="*60)
        print(" MVP ORCHESTRATION SYSTEM v2")
        print(" Your Account Manager is ready to ship your MVP")
        print("="*60)
        
        # Onboard founder
        analysis = self.am.onboard_founder()
        
        # Show analysis
        self.display_analysis(analysis)
        
        # Start interactive loop
        self.run_interactive_session()
    
    def display_analysis(self, analysis: Dict):
        """Display initial analysis"""
        print("\n" + "="*60)
        print(" MVP ANALYSIS & EXECUTION PLAN")
        print("="*60)
        
        print(f"\n📊 VERDICT: {analysis['verdict']}")
        print(f"\n🎯 MVP SCOPE:\n   {analysis['mvp_scope']}")
        
        print(f"\n✂️  CUT THESE FEATURES:")
        for feature in analysis['cut_features']:
            print(f"   ❌ {feature}")
        
        print(f"\n📅 WEEK 1: {analysis['week_1_focus']}")
        print(f"📅 WEEK 2: {analysis['week_2_focus']}")
        
        print(f"\n⚠️  BIGGEST RISK: {analysis['biggest_risk']}")
        print(f"\n🏁 FIRST MILESTONE: {analysis['first_milestone']}")
        
        print(f"\n👥 INITIAL TEAM ASSIGNMENTS:")
        for team, task in analysis['team_assignments'].items():
            print(f"   {team.upper()}: {task}")
    
    def run_interactive_session(self):
        """Interactive session with founder"""
        print("\n" + "="*60)
        print(" INTERACTIVE MODE")
        print("="*60)
        print("\nI'm your Account Manager. I'll orchestrate everything.")
        print("Commands: 'status', 'help', 'pivot', 'ship', 'exit'\n")
        
        while self.session_active:
            # Daily check-in
            check_in = self.am.daily_check_in()
            if check_in["day"] % 1 == 0:  # Daily
                self.display_check_in(check_in)
            
            # Get founder input
            request = input("\n🚀 What do you need? → ").strip()
            
            if request.lower() == 'exit':
                print("\n✅ Remember: Ship something terrible quickly.")
                break
            elif request.lower() == 'status':
                self.show_status()
            elif request.lower() == 'help':
                self.show_help()
            elif request.lower() == 'pivot':
                pivot = self.am.pivot_recommendation()
                if pivot:
                    self.display_pivot(pivot)
                else:
                    print("No pivot needed yet. Keep pushing.")
            elif request.lower() == 'ship':
                self.prepare_for_launch()
            else:
                # Process regular request
                response = self.am.process_request(request)
                self.display_response(response)
    
    def display_check_in(self, check_in: Dict):
        """Display daily check-in"""
        print(f"\n📅 Day {check_in['day']} Check-in")
        print("-" * 40)
        
        if check_in["progress"]:
            print("Progress:")
            for task, status in check_in["progress"].items():
                print(f"  {status} {task}")
        
        if check_in["blockers"]:
            print("\n⚠️ Blockers:")
            for blocker in check_in["blockers"]:
                print(f"  {blocker}")
        
        print(f"\n🎯 Today's Focus: {check_in['today_focus']}")
        
        if check_in["reminder"]:
            print(f"\n💡 Remember: {check_in['reminder']}")
    
    def display_response(self, response: Dict):
        """Display AM's response to request"""
        print(f"\n{'='*50}")
        print(f"✅ {response['decision']}")
        print(f"{'='*50}")
        
        if response["warnings"]:
            print("\n⚠️ WARNINGS:")
            for warning in response["warnings"]:
                print(f"  - {warning}")
        
        if response["assignments"]:
            print("\n📋 TEAM RESPONSES:")
            for team, details in response["assignments"].items():
                print(f"\n{team.upper()}:")
                if isinstance(details, dict):
                    for key, value in details.items():
                        if key != "team":
                            print(f"  {key}: {value}")
        
        if response["next_steps"]:
            print("\n🎯 NEXT STEPS:")
            for i, step in enumerate(response["next_steps"], 1):
                print(f"  {i}. {step}")
    
    def display_pivot(self, pivot: Dict):
        """Display pivot recommendation"""
        print("\n" + "="*50)
        print(" 🔄 PIVOT RECOMMENDATION")
        print("="*50)
        for key, value in pivot.items():
            print(f"{key}: {value}")
    
    def show_status(self):
        """Show current project status"""
        total_tasks = len(self.am.all_tasks)
        completed = len([t for t in self.am.all_tasks if t.status == TaskStatus.DONE])
        
        print(f"\n📊 PROJECT STATUS")
        print(f"  Total Tasks: {total_tasks}")
        print(f"  Completed: {completed}")
        print(f"  Progress: {int((completed/total_tasks)*100) if total_tasks > 0 else 0}%")
        print(f"  Days Active: {len(self.am.conversation_history)}")
    
    def show_help(self):
        """Show available commands"""
        print("\n📖 AVAILABLE COMMANDS:")
        print("  'status' - See project progress")
        print("  'pivot' - Get pivot recommendation")
        print("  'ship' - Prepare for launch")
        print("  'exit' - End session")
        print("\n  Or just tell me what you need help with!")
    
    def prepare_for_launch(self):
        """Final launch checklist"""
        checklist = {
            "✅ Payment processing works": "Stripe connected and tested",
            "✅ Users can sign up": "Auth flow complete",
            "✅ Core feature works": "One thing, working perfectly",
            "✅ Analytics installed": "You know who uses what",
            "✅ Support channel ready": "Email is enough",
            "✅ Legal docs added": "Terms & Privacy (use templates)",
            "⏳ Everything else": "Ship now, fix later"
        }
        
        print("\n" + "="*50)
        print(" 🚀 LAUNCH CHECKLIST")
        print("="*50)
        
        for item, detail in checklist.items():
            print(f"\n{item}")
            print(f"  → {detail}")
        
        print("\n" + "="*50)
        print(" YOU'RE READY. SHIP IT.")
        print(" Your MVP should embarrass you. That's perfect.")
        print("="*50)

# EXECUTION
if __name__ == "__main__":
    # Start the orchestrator
    orchestrator = MVPOrchestrator()
    orchestrator.start()