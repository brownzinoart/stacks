#!/usr/bin/env python3
"""
PROMPT ENGINEERING MASTER AGENT
World-class expert in crafting perfect prompts for any LLM
Optimizes for quality, cost, and speed across all models

Features:
- Automatic prompt optimization
- A/B testing across models
- Cost optimization
- Output quality scoring
- Prompt template library
- Real-time prompt debugging

Usage:
    python3 prompt_master.py optimize "your basic prompt"
    python3 prompt_master.py test "prompt" --models gpt-4 gpt-3.5 claude
    python3 prompt_master.py analyze results.json
    python3 prompt_master.py generate --task "classification"
"""

import os
import json
import time
import re
import asyncio
import hashlib
from typing import Dict, List, Tuple, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import argparse
from pathlib import Path
import pickle
from functools import lru_cache

# For API calls (install with: pip install openai anthropic google-generativeai cohere)
try:
    import openai
    from anthropic import Anthropic
    import google.generativeai as genai
    import cohere
except ImportError:
    print("Install required packages: pip install openai anthropic google-generativeai cohere")

# ============================================================================
# PROMPT ENGINEERING KNOWLEDGE BASE
# ============================================================================

@dataclass
class PromptTechnique:
    """Represents a prompt engineering technique"""
    name: str
    category: str  # instruction, context, output, reasoning, optimization
    effectiveness: float  # 0-1 score
    description: str
    template: str
    when_to_use: str
    example: str
    cost_impact: str  # increase, decrease, neutral

@dataclass
class OptimizedPrompt:
    """An optimized prompt with metadata"""
    original: str
    optimized: str
    techniques_used: List[str]
    expected_improvement: float
    token_count: int
    estimated_cost: float
    model_recommendations: Dict[str, float]  # model -> suitability score
    prompt_hash: str = field(default="")
    is_deterministic: bool = field(default=True)
    version: str = field(default="1.0")

@dataclass
class PromptTestResult:
    """Results from testing a prompt"""
    prompt: str
    model: str
    response: str
    quality_score: float
    latency: float
    tokens_used: int
    cost: float
    timestamp: datetime

class ModelType(Enum):
    """Supported LLM models"""
    GPT_4 = "gpt-4"
    GPT_4_TURBO = "gpt-4-turbo-preview"
    GPT_35_TURBO = "gpt-3.5-turbo"
    CLAUDE_3_OPUS = "claude-3-opus"
    CLAUDE_3_SONNET = "claude-3-sonnet"
    CLAUDE_3_HAIKU = "claude-3-haiku"
    GEMINI_PRO = "gemini-pro"
    GEMINI_ULTRA = "gemini-ultra"
    COHERE_COMMAND = "command"
    LLAMA_2 = "llama-2"
    MIXTRAL = "mixtral-8x7b"

# ============================================================================
# THE PROMPT ENGINEERING MASTER
# ============================================================================

class PromptEngineeringMaster:
    """
    The ultimate prompt engineering expert who knows every technique,
    every model's quirks, and how to get the best results at the lowest cost.
    """
    
    def __init__(self):
        self.techniques_db = self._load_techniques_database()
        self.model_costs = self._load_model_costs()
        self.prompt_templates = self._load_prompt_templates()
        self.test_results = []
        self.api_keys = self._load_api_keys()
        self.cache_dir = Path(".prompt_cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.response_cache = {}
        self.prompt_version = "2.0"  # Increment when changing core logic
        
    def _load_techniques_database(self) -> List[PromptTechnique]:
        """Load comprehensive prompt engineering techniques"""
        
        techniques = [
            # ========== INSTRUCTION TECHNIQUES ==========
            PromptTechnique(
                name="Role Playing",
                category="instruction",
                effectiveness=0.85,
                description="Assign a specific role/persona to the AI",
                template="You are {role}, an expert in {domain} with {experience} years of experience. {additional_context}",
                when_to_use="When you need domain-specific expertise or a particular communication style",
                example='You are a senior software architect at Google with 15 years of experience in distributed systems. Review this code:',
                cost_impact="neutral"
            ),
            
            PromptTechnique(
                name="Chain of Thought (CoT)",
                category="reasoning",
                effectiveness=0.92,
                description="Encourage step-by-step reasoning",
                template="Let's think about this step by step:\n{task}\nShow your reasoning for each step.",
                when_to_use="Complex reasoning, math problems, logic puzzles",
                example="Let's solve this step by step:\nQuestion: If a train travels 120km in 2 hours, what's its speed?\nStep 1: Identify what we're looking for (speed)\nStep 2: Recall the formula (speed = distance/time)\nStep 3: Calculate (120km / 2h = 60km/h)",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Few-Shot Learning",
                category="context",
                effectiveness=0.88,
                description="Provide examples of desired input-output pairs",
                template="Here are some examples:\n{examples}\n\nNow, {task}:",
                when_to_use="When you need consistent formatting or specific patterns",
                example="""Examples:
Input: "The movie was terrible" → Sentiment: Negative
Input: "I loved the food" → Sentiment: Positive
Input: "It was okay" → Sentiment: Neutral

Now analyze: "The service exceeded expectations" → Sentiment:""",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Output Structuring",
                category="output",
                effectiveness=0.90,
                description="Define exact output format with delimiters",
                template="Format your response as:\n{format_specification}\nUse {delimiter} to separate sections.",
                when_to_use="When you need parseable, consistent output",
                example="""Return your analysis in this format:
<analysis>
<summary>One line summary here</summary>
<details>Detailed explanation</details>
<confidence>0-100 score</confidence>
</analysis>""",
                cost_impact="decrease"
            ),
            
            PromptTechnique(
                name="Self-Consistency",
                category="reasoning",
                effectiveness=0.91,
                description="Generate multiple solutions and select the best",
                template="Generate 3 different approaches to {task}. Compare them and select the best one.",
                when_to_use="Critical decisions, complex problems needing validation",
                example="Generate 3 different marketing strategies for this product. Compare their pros/cons and recommend the best.",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Constitutional AI",
                category="instruction",
                effectiveness=0.87,
                description="Build in safety and ethical constraints",
                template="Follow these principles:\n{principles}\nIf any conflict arises, prioritize {priority}.",
                when_to_use="Sensitive content, ethical considerations, safety-critical applications",
                example="""Follow these principles:
1. Never generate harmful content
2. Protect user privacy
3. Be factually accurate
If these conflict, prioritize user safety first.""",
                cost_impact="neutral"
            ),
            
            PromptTechnique(
                name="Tree of Thoughts",
                category="reasoning",
                effectiveness=0.94,
                description="Explore multiple reasoning paths like a decision tree",
                template="Consider this problem:\n{problem}\n1. Generate 3 initial approaches\n2. For each approach, generate 2 refinements\n3. Evaluate all paths and choose the best",
                when_to_use="Complex problems with multiple valid solutions",
                example="Problem: Design a caching system\n1. Generate 3 approaches (LRU, LFU, Adaptive)\n2. For each, consider 2 implementations\n3. Evaluate and recommend",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Socratic Method",
                category="reasoning",
                effectiveness=0.86,
                description="Use questions to guide reasoning",
                template="Answer by first asking yourself:\n{questions}\nThen provide your conclusion.",
                when_to_use="Educational content, debugging, critical thinking",
                example="""To solve this bug, ask yourself:
1. What is the expected behavior?
2. What is actually happening?
3. What changed recently?
4. What assumptions am I making?
Then provide your diagnosis.""",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Negative Prompting",
                category="instruction",
                effectiveness=0.83,
                description="Specify what NOT to do",
                template="Do {task}.\nDo NOT: {negative_constraints}",
                when_to_use="When common mistakes occur or specific behaviors must be avoided",
                example="Write a summary of this article.\nDo NOT: Include personal opinions, exceed 100 words, or use technical jargon.",
                cost_impact="neutral"
            ),
            
            PromptTechnique(
                name="Meta-Prompting",
                category="optimization",
                effectiveness=0.89,
                description="Ask the model to improve its own prompt",
                template="Here's my task: {task}\nHow would you rewrite this prompt to get better results?",
                when_to_use="Prompt optimization, discovering better approaches",
                example="My prompt: 'Explain quantum computing'\nHow would you rewrite this to get a clearer, more structured explanation?",
                cost_impact="increase"
            ),
            
            # ========== ADVANCED TECHNIQUES ==========
            PromptTechnique(
                name="Prompt Chaining",
                category="optimization",
                effectiveness=0.93,
                description="Break complex tasks into chained smaller prompts",
                template="Step 1: {first_task}\n[Use output as input]\nStep 2: {second_task}",
                when_to_use="Complex multi-step processes, maintaining context",
                example="Step 1: Extract key points from this article\nStep 2: Generate questions about each key point\nStep 3: Answer the questions comprehensively",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="ReAct Pattern",
                category="reasoning",
                effectiveness=0.95,
                description="Reasoning + Acting for tool use",
                template="Thought: {reasoning}\nAction: {tool_use}\nObservation: {result}\nThought: {next_reasoning}",
                when_to_use="When integrating with external tools or APIs",
                example="""Thought: I need to find the current weather
Action: weather_api(city="San Francisco")
Observation: 72°F, sunny
Thought: Based on the weather, I recommend...""",
                cost_impact="increase"
            ),
            
            PromptTechnique(
                name="Compression Technique",
                category="optimization",
                effectiveness=0.82,
                description="Compress verbose prompts without losing meaning",
                template="[Compressed]: {key_points} → {expected_output}",
                when_to_use="Reducing token usage while maintaining quality",
                example="[Compressed]: Article summary, 3 points, professional tone, <100 words",
                cost_impact="decrease"
            ),
            
            PromptTechnique(
                name="Emotional Stimuli",
                category="instruction",
                effectiveness=0.79,
                description="Add emotional context for better engagement",
                template="{task}\nThis is really important to me because {emotional_context}.",
                when_to_use="Creative tasks, empathetic responses",
                example="Help me write this letter. This is really important because it's for my daughter's teacher who made a huge difference.",
                cost_impact="neutral"
            ),
            
            PromptTechnique(
                name="Exemplar-Based Learning",
                category="context",
                effectiveness=0.91,
                description="Provide gold-standard examples",
                template="Here's a perfect example of what I want:\n{exemplar}\n\nNow create something similar for:\n{task}",
                when_to_use="When quality standards are critical",
                example="Here's a perfect API response:\n{JSON example with all fields}\n\nNow generate a response for this request:",
                cost_impact="increase"
            )
        ]
        
        return techniques
    
    def _load_model_costs(self) -> Dict[str, Dict[str, float]]:
        """Load cost per 1K tokens for each model"""
        
        return {
            "gpt-4": {"input": 0.03, "output": 0.06},
            "gpt-4-turbo-preview": {"input": 0.01, "output": 0.03},
            "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},
            "claude-3-opus": {"input": 0.015, "output": 0.075},
            "claude-3-sonnet": {"input": 0.003, "output": 0.015},
            "claude-3-haiku": {"input": 0.00025, "output": 0.00125},
            "gemini-pro": {"input": 0.00025, "output": 0.0005},
            "gemini-ultra": {"input": 0.007, "output": 0.021},
            "command": {"input": 0.0015, "output": 0.0015},
            "mixtral-8x7b": {"input": 0.0007, "output": 0.0007}
        }
    
    def _load_prompt_templates(self) -> Dict[str, str]:
        """Load task-specific prompt templates"""
        
        return {
            "classification": """Task: Classify the following text into one of these categories: {categories}

Text: {input}

Analysis approach:
1. Identify key indicators
2. Consider context
3. Make classification

Classification: [category]
Confidence: [0-100]
Reasoning: [brief explanation]""",

            "summarization": """Create a {length} summary of the following content:

Content: {input}

Requirements:
- Capture main points
- Maintain factual accuracy
- Use {tone} tone
- {additional_requirements}

Summary:""",

            "code_generation": """You are an expert {language} developer.

Task: {task_description}

Requirements:
- Follow {style_guide} style guide
- Include error handling
- Add comprehensive comments
- Optimize for {optimization_target}

Constraints: {constraints}

Generate the code:""",

            "data_extraction": """Extract the following information from the text:

Fields to extract:
{fields}

Text: {input}

Return as JSON:
{
  "field1": "value1",
  "field2": "value2"
}""",

            "creative_writing": """Genre: {genre}
Tone: {tone}
Length: {length}

Context: {context}

Task: {task}

Additional requirements: {requirements}

Begin writing:""",

            "analysis": """Conduct a comprehensive analysis of:

{subject}

Analysis framework:
1. {dimension_1}
2. {dimension_2}
3. {dimension_3}

Provide insights, patterns, and recommendations.

Analysis:""",

            "question_answering": """Context: {context}

Question: {question}

Instructions:
- Answer based solely on the provided context
- If the answer isn't in the context, say "Information not found"
- Be concise but complete
- Cite relevant parts of the context

Answer:""",

            "translation": """Translate the following from {source_language} to {target_language}:

{text}

Requirements:
- Maintain the original tone and style
- Preserve cultural nuances
- Keep proper nouns unchanged
- {additional_requirements}

Translation:""",

            "reasoning": """Problem: {problem}

Approach this systematically:
1. Understand the problem
2. Identify key information
3. Apply relevant principles
4. Show step-by-step reasoning
5. Verify the solution

Solution:""",

            "evaluation": """Evaluate the following {subject} based on these criteria:

{criteria}

Subject: {input}

For each criterion:
- Score (1-10)
- Justification
- Suggestions for improvement

Evaluation:""",

            "book_recommendation": """You are an expert librarian with deep knowledge of literature across all genres.

User Query: {query}
User Context: {context}

Analyze this request systematically:
1. Extract key themes, genres, and preferences
2. Consider user's reading level and interests
3. Identify 3-5 highly relevant book recommendations
4. For each book, provide:
   - Title and Author
   - Brief description (2-3 sentences)
   - Why it matches the user's request
   - Genre and reading level

IMPORTANT: Provide identical recommendations for identical queries.

Recommendations:""",

            "book_search": """Search Query: {query}
Search Context: {search_context}

Generate optimized search parameters for book discovery:

1. Primary Keywords: [extract 3-5 main terms]
2. Alternative Keywords: [synonyms and related terms]
3. Genre Filters: [applicable genres]
4. Metadata Filters: [publication year, author, etc.]
5. Semantic Intent: [what the user is really looking for]

Ensure consistent results for identical searches.

Search Parameters:""",

            "content_analysis": """Analyze the following content for book recommendations:

Content: {content}
Analysis Type: {analysis_type}

Provide structured analysis:
1. Main Themes: [identify 3-5 key themes]
2. Genre Classification: [primary and secondary genres]
3. Emotional Tone: [mood and atmosphere]
4. Target Audience: [age group and interests]
5. Similar Works: [comparable books/authors]

Analysis:"""
        }
    
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables"""
        
        return {
            "openai": os.getenv("OPENAI_API_KEY", ""),
            "anthropic": os.getenv("ANTHROPIC_API_KEY", ""),
            "google": os.getenv("GOOGLE_API_KEY", ""),
            "cohere": os.getenv("COHERE_API_KEY", "")
        }
    
    # ========================================================================
    # CACHING & CONSISTENCY METHODS
    # ========================================================================
    
    def _generate_prompt_hash(self, prompt: str, context: Dict[str, Any] = None) -> str:
        """Generate deterministic hash for prompt + context"""
        content = prompt
        if context:
            # Sort context keys for deterministic hashing
            sorted_context = json.dumps(context, sort_keys=True)
            content = f"{prompt}__CONTEXT__{sorted_context}"
        
        return hashlib.sha256(content.encode()).hexdigest()[:16]
    
    def _get_cached_result(self, prompt_hash: str, result_type: str = "optimization"):
        """Retrieve cached result if exists"""
        cache_file = self.cache_dir / f"{result_type}_{prompt_hash}.pkl"
        
        if cache_file.exists():
            try:
                with open(cache_file, 'rb') as f:
                    cached_data = pickle.load(f)
                    # Check if cache is still valid (version check)
                    if cached_data.get('version') == self.prompt_version:
                        return cached_data.get('result')
            except Exception as e:
                print(f"Cache read error: {e}")
                cache_file.unlink(missing_ok=True)
        
        return None
    
    def _cache_result(self, prompt_hash: str, result: Any, result_type: str = "optimization"):
        """Cache result with version info"""
        cache_file = self.cache_dir / f"{result_type}_{prompt_hash}.pkl"
        
        cache_data = {
            'version': self.prompt_version,
            'timestamp': datetime.now().isoformat(),
            'result': result
        }
        
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(cache_data, f)
        except Exception as e:
            print(f"Cache write error: {e}")
    
    def _ensure_deterministic_sequence(self, prompts: List[str]) -> List[str]:
        """Validate and optimize prompt sequence for consistency"""
        
        optimized_sequence = []
        context_carry_forward = {}
        
        for i, prompt in enumerate(prompts):
            # Add sequence context
            if i > 0:
                prompt = f"[Step {i+1} of {len(prompts)}] Building on previous analysis:\n\n{prompt}"
                
            # Ensure each prompt has deterministic elements
            if "temperature" not in prompt.lower():
                prompt += "\n\nIMPORTANT: Provide consistent, deterministic responses."
            
            # Add context from previous steps
            if context_carry_forward:
                context_section = "Previous context: " + json.dumps(context_carry_forward, sort_keys=True)
                prompt = f"{context_section}\n\n{prompt}"
            
            optimized_sequence.append(prompt)
            
            # Extract key information for next step
            context_carry_forward[f'step_{i+1}'] = f"prompt_length_{len(prompt)}"
        
        return optimized_sequence
    
    # ========================================================================
    # PROMPT OPTIMIZATION
    # ========================================================================
    
    def optimize_prompt(self, original_prompt: str, task_type: str = "general", context: Dict[str, Any] = None) -> OptimizedPrompt:
        """Optimize a prompt using best practices with caching for consistency"""
        
        # Generate hash for caching
        prompt_hash = self._generate_prompt_hash(original_prompt, context)
        
        # Check cache first
        cached_result = self._get_cached_result(prompt_hash, "optimization")
        if cached_result:
            print("\n✅ Retrieved consistent result from cache")
            return cached_result
        
        print("\n" + "="*80)
        print("🧠 PROMPT OPTIMIZATION ANALYSIS")
        print("="*80)
        print(f"\nPrompt Hash: {prompt_hash}")
        print(f"Original prompt ({len(original_prompt)} chars):")
        print(f'"{original_prompt[:200]}..."' if len(original_prompt) > 200 else f'"{original_prompt}"')
        
        # Analyze original prompt
        issues = self._analyze_prompt_issues(original_prompt)
        
        # Apply relevant techniques
        optimized = original_prompt
        techniques_used = []
        
        # Apply fixes based on issues
        if "no_role" in issues:
            optimized = self._apply_technique("Role Playing", optimized, task_type)
            techniques_used.append("Role Playing")
        
        if "no_structure" in issues:
            optimized = self._apply_technique("Output Structuring", optimized, task_type)
            techniques_used.append("Output Structuring")
        
        if "vague_instructions" in issues:
            optimized = self._add_specificity(optimized)
            techniques_used.append("Specific Instructions")
        
        if "no_examples" in issues and task_type != "general":
            optimized = self._apply_technique("Few-Shot Learning", optimized, task_type)
            techniques_used.append("Few-Shot Learning")
        
        # Add reasoning for complex tasks
        if self._is_complex_task(optimized):
            optimized = self._apply_technique("Chain of Thought", optimized, task_type)
            techniques_used.append("Chain of Thought")
        
        # Calculate improvements
        token_count = self._estimate_tokens(optimized)
        improvement = self._calculate_improvement(original_prompt, optimized)
        cost = self._estimate_cost(token_count)
        
        # Model recommendations
        model_recs = self._recommend_models(optimized, task_type)
        
        result = OptimizedPrompt(
            original=original_prompt,
            optimized=optimized,
            techniques_used=techniques_used,
            expected_improvement=improvement,
            token_count=token_count,
            estimated_cost=cost,
            model_recommendations=model_recs,
            prompt_hash=prompt_hash,
            is_deterministic=True,
            version=self.prompt_version
        )
        
        # Cache the result for future consistency
        self._cache_result(prompt_hash, result, "optimization")
        
        self._display_optimization_results(result)
        
        return result
    
    def _analyze_prompt_issues(self, prompt: str) -> List[str]:
        """Identify issues in the prompt"""
        
        issues = []
        
        # Check for role definition
        if not any(phrase in prompt.lower() for phrase in ["you are", "act as", "behave like"]):
            issues.append("no_role")
        
        # Check for output structure
        if not any(phrase in prompt.lower() for phrase in ["format", "structure", "return", "output"]):
            issues.append("no_structure")
        
        # Check for vague instructions
        vague_words = ["some", "things", "stuff", "maybe", "probably", "might"]
        if any(word in prompt.lower() for word in vague_words):
            issues.append("vague_instructions")
        
        # Check for examples
        if "example" not in prompt.lower() and len(prompt) < 100:
            issues.append("no_examples")
        
        # Check for reasoning instructions
        if len(prompt) > 50 and not any(phrase in prompt.lower() for phrase in ["think", "reason", "explain", "why"]):
            issues.append("no_reasoning")
        
        return issues
    
    def _apply_technique(self, technique_name: str, prompt: str, task_type: str) -> str:
        """Apply a specific technique to the prompt"""
        
        technique = next((t for t in self.techniques_db if t.name == technique_name), None)
        if not technique:
            return prompt
        
        if technique_name == "Role Playing":
            role = self._determine_role(task_type)
            return f"{role}\n\n{prompt}"
        
        elif technique_name == "Output Structuring":
            structure = self._determine_structure(task_type)
            return f"{prompt}\n\n{structure}"
        
        elif technique_name == "Few-Shot Learning":
            examples = self._generate_examples(task_type)
            return f"{examples}\n\n{prompt}"
        
        elif technique_name == "Chain of Thought":
            return f"{prompt}\n\nThink through this step-by-step and show your reasoning."
        
        return prompt
    
    def _determine_role(self, task_type: str) -> str:
        """Determine appropriate role based on task"""
        
        roles = {
            "code": "You are a senior software engineer with expertise in clean code and best practices.",
            "writing": "You are a professional writer with expertise in clear, engaging communication.",
            "analysis": "You are a data analyst with strong analytical and critical thinking skills.",
            "creative": "You are a creative director with innovative thinking and artistic vision.",
            "general": "You are a helpful expert assistant."
        }
        
        return roles.get(task_type, roles["general"])
    
    def _determine_structure(self, task_type: str) -> str:
        """Determine output structure based on task"""
        
        structures = {
            "code": "Format your response as:\n```language\n[code here]\n```\nFollowed by explanation.",
            "analysis": "Structure your response as:\n1. Summary\n2. Key Findings\n3. Recommendations",
            "general": "Provide a clear, structured response with appropriate sections."
        }
        
        return structures.get(task_type, structures["general"])
    
    def _add_specificity(self, prompt: str) -> str:
        """Add specific instructions to vague prompts"""
        
        additions = []
        
        if "summarize" in prompt.lower():
            additions.append("Provide a 3-5 sentence summary capturing the main points.")
        
        if "explain" in prompt.lower():
            additions.append("Explain clearly with examples where appropriate.")
        
        if "help" in prompt.lower():
            additions.append("Provide specific, actionable advice.")
        
        if additions:
            return f"{prompt}\n\n{' '.join(additions)}"
        
        return prompt
    
    def _generate_examples(self, task_type: str) -> str:
        """Generate relevant examples for the task"""
        
        if task_type == "classification":
            return """Example:
Input: "The product arrived damaged" → Category: Complaint
Input: "Love this service!" → Category: Praise"""
        
        elif task_type == "code":
            return """Example of clean code:
```python
def calculate_total(items: List[Item]) -> float:
    \"\"\"Calculate total price with tax.\"\"\"
    subtotal = sum(item.price for item in items)
    return subtotal * 1.08  # 8% tax
```"""
        
        return ""
    
    def _is_complex_task(self, prompt: str) -> bool:
        """Determine if task requires complex reasoning"""
        
        complex_indicators = [
            "analyze", "compare", "evaluate", "design", "architect",
            "solve", "debug", "optimize", "plan", "strategy"
        ]
        
        return any(indicator in prompt.lower() for indicator in complex_indicators)
    
    def _estimate_tokens(self, text: str) -> int:
        """Accurate token estimation using multiple heuristics"""
        # More accurate estimation considering:
        # - Word boundaries
        # - Punctuation
        # - Special tokens
        
        words = text.split()
        tokens = 0
        
        for word in words:
            # Base word count
            tokens += 1
            
            # Add for punctuation and special chars
            special_chars = sum(1 for c in word if c in '.,!?;:()[]{}"\'-')
            tokens += special_chars * 0.5
            
            # Add for longer words (subword tokenization)
            if len(word) > 6:
                tokens += (len(word) - 6) * 0.3
        
        # Add overhead for system tokens
        tokens += len(text.split('\n')) * 0.1  # Newlines
        
        return max(int(tokens), len(text) // 4)  # Fallback to original method
    
    def _calculate_improvement(self, original: str, optimized: str) -> float:
        """Calculate deterministic expected improvement percentage"""
        
        base_score = 0.5  # Start at 50%
        
        # Deterministic scoring based on measurable improvements
        improvements = [
            ("You are" in optimized and "You are" not in original, 0.15),
            ("step-by-step" in optimized.lower(), 0.20),
            ("Example" in optimized and "Example" not in original, 0.15),
            (any(delimiter in optimized for delimiter in ["```", "---", "###"]), 0.10),
            ("Format" in optimized and "Format" not in original, 0.08),
            (len(optimized) > len(original) * 1.5, 0.12),  # Comprehensive instructions
            (optimized.count('\n') > original.count('\n'), 0.05),  # Better structure
        ]
        
        for condition, score_add in improvements:
            if condition:
                base_score += score_add
        
        return min(base_score, 0.95)  # Cap at 95% improvement
    
    def _estimate_cost(self, tokens: int) -> float:
        """Estimate cost across different models"""
        
        # Average cost for GPT-3.5
        return (tokens / 1000) * 0.002
    
    def _recommend_models(self, prompt: str, task_type: str) -> Dict[str, float]:
        """Recommend best models for this prompt"""
        
        recommendations = {}
        
        # GPT-4 for complex reasoning
        if self._is_complex_task(prompt):
            recommendations["gpt-4-turbo-preview"] = 0.95
            recommendations["claude-3-opus"] = 0.93
            recommendations["gemini-ultra"] = 0.90
        
        # Cost-effective for simple tasks
        elif len(prompt) < 200:
            recommendations["gpt-3.5-turbo"] = 0.90
            recommendations["claude-3-haiku"] = 0.88
            recommendations["gemini-pro"] = 0.85
        
        # Balanced
        else:
            recommendations["gpt-4-turbo-preview"] = 0.85
            recommendations["claude-3-sonnet"] = 0.87
            recommendations["gpt-3.5-turbo"] = 0.80
        
        return dict(sorted(recommendations.items(), key=lambda x: x[1], reverse=True))
    
    # ========================================================================
    # PROMPT TESTING
    # ========================================================================
    
    async def test_prompt_across_models(self, prompt: str, models: List[str], ensure_consistency: bool = True) -> List[PromptTestResult]:
        """Test a prompt across multiple models with consistency guarantees"""
        
        prompt_hash = self._generate_prompt_hash(prompt, {"models": sorted(models)})
        
        # Check cache for consistent results
        if ensure_consistency:
            cached_results = self._get_cached_result(prompt_hash, "testing")
            if cached_results:
                print("\n✅ Retrieved consistent test results from cache")
                return cached_results
        
        print("\n" + "="*80)
        print("🧪 TESTING PROMPT ACROSS MODELS")
        print("="*80)
        print(f"Prompt Hash: {prompt_hash}")
        
        results = []
        
        for model in models:
            print(f"\nTesting on {model}...")
            
            try:
                result = await self._test_on_model(prompt, model)
                results.append(result)
                
                print(f"✓ Response received ({result.latency:.2f}s, {result.tokens_used} tokens)")
                print(f"  Quality Score: {result.quality_score:.2f}/10")
                print(f"  Cost: ${result.cost:.4f}")
                
            except Exception as e:
                print(f"✗ Error: {e}")
        
        # Cache results for consistency
        if ensure_consistency:
            self._cache_result(prompt_hash, results, "testing")
        
        # Analyze results
        self._analyze_test_results(results)
        
        return results
    
    async def _test_on_model(self, prompt: str, model: str) -> PromptTestResult:
        """Test prompt on a specific model with deterministic elements"""
        
        # Add deterministic instructions to prompt for consistency
        deterministic_prompt = f"{prompt}\n\nIMPORTANT: Provide consistent, reproducible responses."
        
        start_time = time.time()
        
        # Call appropriate API based on model
        if "gpt" in model:
            response, tokens = await self._call_openai(deterministic_prompt, model)
        elif "claude" in model:
            response, tokens = await self._call_anthropic(deterministic_prompt, model)
        elif "gemini" in model:
            response, tokens = await self._call_google(deterministic_prompt, model)
        else:
            response, tokens = "Model not implemented", 0
        
        latency = time.time() - start_time
        
        # Calculate quality score
        quality = self._assess_response_quality(response, prompt)
        
        # Calculate cost
        cost = self._calculate_cost(tokens, model)
        
        return PromptTestResult(
            prompt=deterministic_prompt,
            model=model,
            response=response,
            quality_score=quality,
            latency=latency,
            tokens_used=tokens,
            cost=cost,
            timestamp=datetime.now()
        )
    
    async def _call_openai(self, prompt: str, model: str) -> Tuple[str, int]:
        """Call OpenAI API"""
        
        if not self.api_keys["openai"]:
            return "OpenAI API key not found. Set OPENAI_API_KEY environment variable.", 0
        
        # Simulated response for demo
        # In production, use: openai.ChatCompletion.create()
        response = f"OpenAI {model} response to: {prompt[:50]}..."
        tokens = self._estimate_tokens(prompt + response)
        
        return response, tokens
    
    async def _call_anthropic(self, prompt: str, model: str) -> Tuple[str, int]:
        """Call Anthropic API"""
        
        if not self.api_keys["anthropic"]:
            return "Anthropic API key not found. Set ANTHROPIC_API_KEY environment variable.", 0
        
        # Simulated response for demo
        response = f"Claude {model} response to: {prompt[:50]}..."
        tokens = self._estimate_tokens(prompt + response)
        
        return response, tokens
    
    async def _call_google(self, prompt: str, model: str) -> Tuple[str, int]:
        """Call Google Gemini API"""
        
        if not self.api_keys["google"]:
            return "Google API key not found. Set GOOGLE_API_KEY environment variable.", 0
        
        # Simulated response for demo
        response = f"Gemini {model} response to: {prompt[:50]}..."
        tokens = self._estimate_tokens(prompt + response)
        
        return response, tokens
    
    def _assess_response_quality(self, response: str, prompt: str) -> float:
        """Assess quality deterministically for consistency (0-10)"""
        
        # Use hash for consistent scoring of identical responses
        response_hash = hashlib.md5(response.encode()).hexdigest()
        
        score = 5.0  # Base score
        
        # Deterministic scoring criteria
        quality_factors = [
            # Length appropriateness (deterministic ranges)
            (50 <= len(response) <= 2000, 1.0),
            (2000 < len(response) <= 5000, 0.5),
            (len(response) < 50, -1.0),
            
            # Structure indicators (deterministic)
            (response.count('\n') >= 2, 0.8),
            ('.' in response, 0.5),
            (':' in response, 0.3),
            ('-' in response or '*' in response, 0.4),
            
            # Completeness indicators
            (response.rstrip().endswith(('.', '!', '?', '"', ')', ']')), 0.7),
            (not response.endswith(('...', 'cont', 'continue')), 0.5),
            
            # Content depth indicators
            (len(response.split()) >= 20, 0.6),
            (response.count(',') >= 2, 0.3),  # Complex sentences
        ]
        
        # Apply deterministic scoring
        for condition, score_delta in quality_factors:
            if condition:
                score += score_delta
        
        # Relevance scoring (deterministic keyword overlap)
        prompt_words = set(w.lower() for w in prompt.split() if len(w) > 2)
        response_words = set(w.lower() for w in response.split() if len(w) > 2)
        
        if prompt_words:
            relevance = len(prompt_words & response_words) / len(prompt_words)
            score += relevance * 2.0
        
        return min(max(score, 0), 10.0)  # Clamp between 0-10
    
    def _calculate_cost(self, tokens: int, model: str) -> float:
        """Calculate cost for tokens on model"""
        
        model_key = model.replace("-", "_")
        if model_key in self.model_costs:
            # Assume 50/50 input/output split for estimation
            input_cost = (tokens / 2 / 1000) * self.model_costs[model_key]["input"]
            output_cost = (tokens / 2 / 1000) * self.model_costs[model_key]["output"]
            return input_cost + output_cost
        
        return 0.0
    
    def _analyze_test_results(self, results: List[PromptTestResult]):
        """Analyze and compare test results"""
        
        if not results:
            return
        
        print("\n" + "="*80)
        print("📊 COMPARATIVE ANALYSIS")
        print("="*80)
        
        # Sort by quality
        by_quality = sorted(results, key=lambda x: x.quality_score, reverse=True)
        
        print("\n🏆 QUALITY RANKING:")
        for i, r in enumerate(by_quality, 1):
            print(f"{i}. {r.model}: {r.quality_score:.2f}/10")
        
        # Sort by cost
        by_cost = sorted(results, key=lambda x: x.cost)
        
        print("\n💰 COST RANKING (cheapest first):")
        for i, r in enumerate(by_cost, 1):
            print(f"{i}. {r.model}: ${r.cost:.4f}")
        
        # Sort by speed
        by_speed = sorted(results, key=lambda x: x.latency)
        
        print("\n⚡ SPEED RANKING:")
        for i, r in enumerate(by_speed, 1):
            print(f"{i}. {r.model}: {r.latency:.2f}s")
        
        # Best value (quality/cost ratio)
        by_value = sorted(results, key=lambda x: x.quality_score / (x.cost + 0.001), reverse=True)
        
        print("\n💎 BEST VALUE (quality per dollar):")
        for i, r in enumerate(by_value[:3], 1):
            value_score = r.quality_score / (r.cost + 0.001)
            print(f"{i}. {r.model}: {value_score:.0f} quality/dollar")
        
        print("\n🎯 RECOMMENDATION:")
        best_overall = by_value[0]
        print(f"Use {best_overall.model} for best value")
        print(f"Use {by_quality[0].model} for highest quality")
        print(f"Use {by_cost[0].model} for lowest cost")
    
    # ========================================================================
    # PROMPT GENERATION
    # ========================================================================
    
    def generate_book_search_prompt(self, search_query: str, user_context: Dict[str, Any] = None) -> str:
        """Generate optimized prompt specifically for book search consistency"""
        
        # Create deterministic context
        context_str = json.dumps(user_context or {}, sort_keys=True)
        prompt_hash = self._generate_prompt_hash(search_query, user_context)
        
        # Check cache
        cached_prompt = self._get_cached_result(prompt_hash, "book_search")
        if cached_prompt:
            return cached_prompt
        
        base_prompt = f"""You are an expert book recommendation AI with access to comprehensive literary knowledge.

IMPORTANT: Provide identical results for identical searches to ensure user consistency.

User Search: "{search_query}"
User Context: {context_str}

Analyze and respond with exactly this structure:
<analysis>
<intent>Primary intent of the search</intent>
<themes>Key themes to match</themes>
<preferences>Inferred user preferences</preferences>
</analysis>

<recommendations>
<book>
<title>Title</title>
<author>Author</author>
<match_score>0-100</match_score>
<reasoning>Why this matches the search</reasoning>
</book>
[Repeat for 3-5 books]
</recommendations>

<search_metadata>
<query_hash>{prompt_hash}</query_hash>
<timestamp>Use consistent format</timestamp>
</search_metadata>

Provide your analysis and recommendations:"""
        
        # Cache the generated prompt
        self._cache_result(prompt_hash, base_prompt, "book_search")
        
        return base_prompt
    
    def generate_prompt(self, task: str, requirements: Dict[str, Any]) -> str:
        """Generate a high-quality prompt for a specific task"""
        
        # Check for book-specific tasks
        if task in ["book_recommendation", "book_search", "content_analysis"] and "query" in requirements:
            return self.generate_book_search_prompt(requirements["query"], requirements.get("context"))
        
        print("\n" + "="*80)
        print("🎨 GENERATING OPTIMIZED PROMPT")
        print("="*80)
        
        # Get base template
        template = self.prompt_templates.get(task, self.prompt_templates["general"])
        
        # Fill in template
        prompt = template
        for key, value in requirements.items():
            placeholder = f"{{{key}}}"
            if placeholder in prompt:
                prompt = prompt.replace(placeholder, str(value))
        
        # Apply optimization techniques
        if task in ["analysis", "reasoning", "code_generation"]:
            prompt = self._apply_technique("Chain of Thought", prompt, task)
        
        if task in ["classification", "data_extraction"]:
            prompt = self._apply_technique("Few-Shot Learning", prompt, task)
        
        # Add role if not present
        if "You are" not in prompt:
            prompt = f"{self._determine_role(task)}\n\n{prompt}"
        
        print(f"\n📝 Generated {task} prompt:")
        print("-" * 40)
        print(prompt)
        print("-" * 40)
        
        # Estimate performance
        tokens = self._estimate_tokens(prompt)
        print(f"\n📊 Estimated tokens: {tokens}")
        print(f"💰 Estimated cost (GPT-3.5): ${self._estimate_cost(tokens):.4f}")
        
        # Recommend models
        models = self._recommend_models(prompt, task)
        print(f"\n🤖 Recommended models:")
        for model, score in list(models.items())[:3]:
            print(f"  • {model}: {score:.0%} suitability")
        
        return prompt
    
    # ========================================================================
    # DISPLAY FUNCTIONS
    # ========================================================================
    
    def _display_optimization_results(self, result: OptimizedPrompt):
        """Display optimization results with consistency info"""
        
        print("\n" + "="*80)
        print("✨ OPTIMIZED PROMPT")
        print("="*80)
        
        print(result.optimized)
        
        print("\n" + "="*80)
        print("📈 OPTIMIZATION METRICS")
        print("="*80)
        print(f"Prompt Hash: {result.prompt_hash}")
        print(f"Deterministic: {'Yes' if result.is_deterministic else 'No'}")
        print(f"Version: {result.version}")
        
        print(f"""
Techniques Applied: {', '.join(result.techniques_used)}
Expected Improvement: {result.expected_improvement:.0%}
Token Count: {result.token_count} (from {self._estimate_tokens(result.original)})
Estimated Cost: ${result.estimated_cost:.4f}

🤖 BEST MODELS FOR THIS PROMPT:""")
        
        for model, score in list(result.model_recommendations.items())[:3]:
            cost_per_call = (result.token_count / 1000) * self.model_costs.get(model, {}).get("input", 0.001)
            print(f"  {model}: {score:.0%} match (${cost_per_call:.4f}/call)")
        
        print("\n💡 TIPS FOR FURTHER IMPROVEMENT:")
        print("  • Add specific examples from your domain")
        print("  • Include edge cases in instructions")
        print("  • Test with multiple models for best results")
        print("  • Use prompt chaining for complex tasks")
        print("  • Enable caching for consistent results on repeat queries")
        print("  • Use deterministic prompts for book search consistency")
    
    def show_technique_library(self):
        """Display all available techniques"""
        
        print("\n" + "="*80)
        print("📚 PROMPT ENGINEERING TECHNIQUE LIBRARY")
        print("="*80)
        
        categories = {}
        for technique in self.techniques_db:
            if technique.category not in categories:
                categories[technique.category] = []
            categories[technique.category].append(technique)
        
        for category, techniques in categories.items():
            print(f"\n📂 {category.upper()}")
            print("-" * 40)
            
            for t in techniques:
                effectiveness_bar = "█" * int(t.effectiveness * 10)
                print(f"\n  📌 {t.name}")
                print(f"     Effectiveness: {effectiveness_bar} {t.effectiveness:.0%}")
                print(f"     When to use: {t.when_to_use}")
                print(f"     Cost impact: {t.cost_impact}")
                print(f"     Example: {t.example[:100]}...")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="Prompt Engineering Master")
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Optimize command
    optimize_parser = subparsers.add_parser("optimize", help="Optimize a prompt")
    optimize_parser.add_argument("prompt", help="Prompt to optimize")
    optimize_parser.add_argument("--task", default="general", help="Task type")
    
    # Test command
    test_parser = subparsers.add_parser("test", help="Test across models")
    test_parser.add_argument("prompt", help="Prompt to test")
    test_parser.add_argument("--models", nargs="+", default=["gpt-3.5-turbo"],
                            help="Models to test")
    test_parser.add_argument("--consistency", action="store_true", default=True,
                            help="Enable caching for consistent results")
    
    # Book search command
    book_parser = subparsers.add_parser("book", help="Generate book search prompt")
    book_parser.add_argument("query", help="Book search query")
    book_parser.add_argument("--context", type=json.loads, default={},
                            help="User context as JSON")
    
    # Generate command
    generate_parser = subparsers.add_parser("generate", help="Generate optimized prompt")
    generate_parser.add_argument("--task", required=True, help="Task type")
    generate_parser.add_argument("--requirements", type=json.loads, default={},
                                help="Requirements as JSON")
    
    # Library command
    library_parser = subparsers.add_parser("library", help="Show technique library")
    
    args = parser.parse_args()
    
    master = PromptEngineeringMaster()
    
    if args.command == "optimize":
        master.optimize_prompt(args.prompt, args.task)
        
    elif args.command == "test":
        asyncio.run(master.test_prompt_across_models(args.prompt, args.models, args.consistency))
        
    elif args.command == "book":
        book_prompt = master.generate_book_search_prompt(args.query, args.context)
        print("\n" + "="*80)
        print("📚 BOOK SEARCH PROMPT GENERATED")
        print("="*80)
        print(book_prompt)
        
    elif args.command == "generate":
        master.generate_prompt(args.task, args.requirements)
        
    elif args.command == "library":
        master.show_technique_library()
        
    else:
        print("Usage examples:")
        print('  python3 prompt_master.py optimize "Summarize this article"')
        print('  python3 prompt_master.py test "Explain quantum computing" --models gpt-4 gpt-3.5-turbo')
        print('  python3 prompt_master.py generate --task classification --requirements \'{"categories":"positive,negative,neutral"}\'')
        print('  python3 prompt_master.py library')
    
    print("\n" + "="*80)
    print("💡 PRO TIPS")
    print("="*80)
    print("""
1. Start with GPT-3.5 for testing, then upgrade to GPT-4 for production
2. Use Claude for nuanced, creative tasks
3. Use Gemini for cost-effective, high-volume processing
4. Always test the same prompt across 3+ models
5. Optimize for the cheapest model that meets quality requirements
6. CONSISTENCY: Enable caching to ensure identical queries return identical results
7. BOOK SEARCHES: Use deterministic prompts and structured outputs for consistency
8. SEQUENCE: Use prompt chaining with context carryover for complex tasks
    """)

if __name__ == "__main__":
    main()
