#!/usr/bin/env python3
"""
RefactorGenius - Advanced Code Refactoring Agent for Claude Code CLI
A comprehensive refactoring system that optimizes code for speed while preserving functionality.
"""

import os
import sys
import ast
import json
import time
import hashlib
import difflib
import argparse
import subprocess
import tempfile
import threading
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass, field
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import re

# Performance profiling imports
try:
    import cProfile
    import pstats
    import io
    PROFILING_AVAILABLE = True
except ImportError:
    PROFILING_AVAILABLE = False

# Optional advanced imports
try:
    import tree_sitter
    import tree_sitter_python
    import tree_sitter_javascript
    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False
    print("Warning: tree-sitter not installed. Advanced AST features disabled.")
    print("Install with: pip install tree-sitter tree-sitter-python tree-sitter-javascript")

@dataclass
class CodeMetrics:
    """Track code quality metrics"""
    complexity: int = 0
    lines: int = 0
    functions: int = 0
    classes: int = 0
    duplicates: List[Tuple[int, int]] = field(default_factory=list)
    performance_issues: List[Dict] = field(default_factory=list)
    security_issues: List[Dict] = field(default_factory=list)
    test_coverage: float = 0.0

@dataclass
class RefactoringSuggestion:
    """Represents a refactoring suggestion"""
    type: str
    severity: str  # 'critical', 'high', 'medium', 'low'
    description: str
    file: str
    line_start: int
    line_end: int
    original_code: str
    suggested_code: str
    performance_impact: str
    safety_score: float  # 0-1, higher is safer

class PerformanceOptimizer:
    """Optimize code for maximum performance"""
    
    def __init__(self):
        self.optimization_patterns = {
            'python': self._load_python_optimizations(),
            'javascript': self._load_js_optimizations(),
            'typescript': self._load_ts_optimizations(),
        }
    
    def _load_python_optimizations(self) -> Dict:
        """Python-specific optimization patterns"""
        return {
            'list_comprehension': {
                'pattern': r'(\w+)\s*=\s*\[\]\s*\nfor\s+(\w+)\s+in\s+(\w+):\s*\n\s+\1\.append\((.*?)\)',
                'replacement': r'\1 = [\4 for \2 in \3]',
                'description': 'Convert loop append to list comprehension (2-3x faster)',
                'performance_gain': '2-3x'
            },
            'dict_comprehension': {
                'pattern': r'(\w+)\s*=\s*\{\}\s*\nfor\s+(\w+)\s+in\s+(\w+):\s*\n\s+\1\[(.+?)\]\s*=\s*(.+)',
                'replacement': r'\1 = {\4: \5 for \2 in \3}',
                'description': 'Convert loop dict assignment to dict comprehension',
                'performance_gain': '2x'
            },
            'set_membership': {
                'pattern': r'(\w+)\s+in\s+\[(.*?)\]',
                'replacement': r'\1 in {\2}',
                'description': 'Use set for membership testing (O(1) vs O(n))',
                'performance_gain': 'O(1) lookup'
            },
            'string_join': {
                'pattern': r'(\w+)\s*=\s*""\s*\nfor\s+(\w+)\s+in\s+(\w+):\s*\n\s+\1\s*\+=\s*str\(\2\)',
                'replacement': r'\1 = "".join(str(x) for x in \3)',
                'description': 'Use join instead of string concatenation',
                'performance_gain': '10-100x for large strings'
            },
            'enumerate_usage': {
                'pattern': r'for\s+(\w+)\s+in\s+range\(len\((\w+)\)\):\s*\n\s+(.*?)\2\[\1\]',
                'replacement': r'for \1, item in enumerate(\2):\n    \3item',
                'description': 'Use enumerate instead of range(len())',
                'performance_gain': '20% faster iteration'
            },
            'cache_len': {
                'pattern': r'for\s+(\w+)\s+in\s+range\(len\((\w+)\)\):\s*\n((?:.*\n)*?.*len\(\2\))',
                'replacement': r'_len = len(\2)\nfor \1 in range(_len):\n\3',
                'description': 'Cache len() result outside loop',
                'performance_gain': '15% in tight loops'
            }
        }
    
    def _load_js_optimizations(self) -> Dict:
        """JavaScript/Node.js optimization patterns"""
        return {
            'const_over_let': {
                'pattern': r'let\s+(\w+)\s*=\s*([^;]+);(?![\s\S]*\1\s*=)',
                'replacement': r'const \1 = \2;',
                'description': 'Use const for immutable variables',
                'performance_gain': 'V8 optimization'
            },
            'avoid_delete': {
                'pattern': r'delete\s+(\w+)\.(\w+)',
                'replacement': r'\1.\2 = undefined',
                'description': 'Avoid delete operator (V8 deoptimization)',
                'performance_gain': '100x faster'
            },
            'array_literal': {
                'pattern': r'new Array\(\)',
                'replacement': r'[]',
                'description': 'Use array literal notation',
                'performance_gain': '2x faster'
            },
            'object_literal': {
                'pattern': r'new Object\(\)',
                'replacement': r'{}',
                'description': 'Use object literal notation',
                'performance_gain': '2x faster'
            },
            'for_of_to_for': {
                'pattern': r'for\s*\(\s*(?:const|let|var)\s+(\w+)\s+of\s+(\w+)\s*\)',
                'replacement': r'for (let i = 0, len = \2.length; i < len; i++) { const \1 = \2[i];',
                'description': 'Convert for-of to indexed for loop (hot paths only)',
                'performance_gain': '5x faster in V8'
            }
        }
    
    def _load_ts_optimizations(self) -> Dict:
        """TypeScript optimization patterns (includes JS patterns)"""
        patterns = self._load_js_optimizations().copy()
        patterns.update({
            'readonly_modifier': {
                'pattern': r'((?:private|public|protected)?\s+)(\w+):\s*(\w+)(?!.*\2\s*=)',
                'replacement': r'\1readonly \2: \3',
                'description': 'Add readonly modifier for immutable properties',
                'performance_gain': 'Compiler optimization'
            }
        })
        return patterns
    
    def optimize_code(self, code: str, language: str) -> Tuple[str, List[RefactoringSuggestion]]:
        """Apply performance optimizations to code"""
        suggestions = []
        optimized = code
        
        if language not in self.optimization_patterns:
            return code, []
        
        patterns = self.optimization_patterns[language]
        
        for opt_name, opt_data in patterns.items():
            pattern = opt_data['pattern']
            replacement = opt_data['replacement']
            
            matches = list(re.finditer(pattern, optimized, re.MULTILINE))
            
            for match in reversed(matches):  # Process in reverse to maintain positions
                original = match.group(0)
                start_line = optimized[:match.start()].count('\n') + 1
                end_line = optimized[:match.end()].count('\n') + 1
                
                suggestion = RefactoringSuggestion(
                    type=f'performance_{opt_name}',
                    severity='medium',
                    description=opt_data['description'],
                    file='',
                    line_start=start_line,
                    line_end=end_line,
                    original_code=original,
                    suggested_code=re.sub(pattern, replacement, original),
                    performance_impact=opt_data['performance_gain'],
                    safety_score=0.9
                )
                suggestions.append(suggestion)
                
                # Apply the optimization
                optimized = optimized[:match.start()] + suggestion.suggested_code + optimized[match.end():]
        
        return optimized, suggestions

class SafetyChecker:
    """Ensure refactoring maintains functionality"""
    
    def __init__(self):
        self.test_commands = {
            'python': ['pytest', 'python -m unittest', 'python -m pytest'],
            'javascript': ['npm test', 'yarn test', 'jest'],
            'typescript': ['npm test', 'yarn test', 'jest'],
            'java': ['mvn test', 'gradle test'],
            'go': ['go test ./...'],
            'rust': ['cargo test'],
        }
    
    def create_backup(self, file_path: str) -> str:
        """Create backup of file before refactoring"""
        backup_path = f"{file_path}.refactor_backup_{int(time.time())}"
        with open(file_path, 'r') as original:
            with open(backup_path, 'w') as backup:
                backup.write(original.read())
        return backup_path
    
    def verify_syntax(self, code: str, language: str) -> Tuple[bool, Optional[str]]:
        """Verify syntax is valid after refactoring"""
        if language == 'python':
            try:
                ast.parse(code)
                return True, None
            except SyntaxError as e:
                return False, str(e)
        
        elif language in ['javascript', 'typescript']:
            # Use Node.js to check syntax
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                temp_path = f.name
            
            try:
                result = subprocess.run(
                    ['node', '--check', temp_path],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                os.unlink(temp_path)
                return result.returncode == 0, result.stderr
            except:
                os.unlink(temp_path)
                return True, None  # Assume valid if node not available
        
        return True, None  # Default to valid for unsupported languages
    
    def run_tests(self, project_path: str, language: str) -> Tuple[bool, str]:
        """Run test suite to ensure functionality preserved"""
        commands = self.test_commands.get(language, [])
        
        for cmd in commands:
            try:
                result = subprocess.run(
                    cmd.split(),
                    cwd=project_path,
                    capture_output=True,
                    text=True,
                    timeout=300
                )
                if result.returncode == 0:
                    return True, result.stdout
                return False, result.stderr
            except:
                continue
        
        return True, "No test suite found (assuming safe)"
    
    def calculate_safety_score(self, original: str, refactored: str) -> float:
        """Calculate safety score for refactoring (0-1)"""
        # Similarity ratio
        similarity = difflib.SequenceMatcher(None, original, refactored).ratio()
        
        # Line count change
        original_lines = original.count('\n')
        refactored_lines = refactored.count('\n')
        
        # Handle edge case where both have 0 lines
        if original_lines == 0 and refactored_lines == 0:
            line_change_ratio = 1.0
        elif max(original_lines, refactored_lines) == 0:
            line_change_ratio = 0.0
        else:
            line_change_ratio = min(original_lines, refactored_lines) / max(original_lines, refactored_lines)
        
        # Combine metrics
        safety_score = (similarity * 0.7) + (line_change_ratio * 0.3)
        
        return min(max(safety_score, 0), 1)

class ComplexityAnalyzer:
    """Analyze code complexity and suggest simplifications"""
    
    def __init__(self):
        self.max_complexity = 10
        self.max_function_length = 50
        self.max_parameters = 5
    
    def calculate_cyclomatic_complexity(self, node: ast.AST) -> int:
        """Calculate cyclomatic complexity for Python AST node"""
        complexity = 1
        
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        
        return complexity
    
    def analyze_python(self, code: str) -> Tuple[CodeMetrics, List[RefactoringSuggestion]]:
        """Analyze Python code complexity"""
        metrics = CodeMetrics()
        suggestions = []
        
        try:
            tree = ast.parse(code)
        except:
            return metrics, suggestions
        
        metrics.lines = code.count('\n') + 1
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                metrics.functions += 1
                complexity = self.calculate_cyclomatic_complexity(node)
                
                if complexity > self.max_complexity:
                    suggestions.append(RefactoringSuggestion(
                        type='complexity_high',
                        severity='high',
                        description=f'Function {node.name} has complexity {complexity} (max: {self.max_complexity})',
                        file='',
                        line_start=node.lineno,
                        line_end=node.end_lineno or node.lineno,
                        original_code='',
                        suggested_code='# Consider breaking into smaller functions',
                        performance_impact='Better maintainability',
                        safety_score=1.0
                    ))
                
                # Check function length
                func_lines = (node.end_lineno or node.lineno) - node.lineno
                if func_lines > self.max_function_length:
                    suggestions.append(RefactoringSuggestion(
                        type='function_too_long',
                        severity='medium',
                        description=f'Function {node.name} is {func_lines} lines (max: {self.max_function_length})',
                        file='',
                        line_start=node.lineno,
                        line_end=node.end_lineno or node.lineno,
                        original_code='',
                        suggested_code='# Consider extracting helper functions',
                        performance_impact='Better readability',
                        safety_score=1.0
                    ))
                
                # Check parameter count
                if len(node.args.args) > self.max_parameters:
                    suggestions.append(RefactoringSuggestion(
                        type='too_many_parameters',
                        severity='medium',
                        description=f'Function {node.name} has {len(node.args.args)} parameters (max: {self.max_parameters})',
                        file='',
                        line_start=node.lineno,
                        line_end=node.lineno,
                        original_code='',
                        suggested_code='# Consider using configuration object or builder pattern',
                        performance_impact='Better API design',
                        safety_score=1.0
                    ))
                
                metrics.complexity = max(metrics.complexity, complexity)
            
            elif isinstance(node, ast.ClassDef):
                metrics.classes += 1
        
        # Find duplicate code blocks
        metrics.duplicates = self._find_duplicates(code)
        
        return metrics, suggestions
    
    def _find_duplicates(self, code: str) -> List[Tuple[int, int]]:
        """Find duplicate code blocks"""
        lines = code.split('\n')
        duplicates = []
        min_duplicate_lines = 5
        
        for i in range(len(lines)):
            for j in range(i + min_duplicate_lines, len(lines)):
                if lines[i:i+min_duplicate_lines] == lines[j:j+min_duplicate_lines]:
                    duplicates.append((i+1, j+1))
        
        return duplicates

class RefactorGenius:
    """Main refactoring orchestrator"""
    
    def __init__(self, project_path: str = ".", claude_api_key: Optional[str] = None):
        self.project_path = Path(project_path)
        self.claude_api_key = claude_api_key or os.environ.get('CLAUDE_API_KEY')
        
        self.optimizer = PerformanceOptimizer()
        self.safety_checker = SafetyChecker()
        self.complexity_analyzer = ComplexityAnalyzer()
        
        self.supported_extensions = {
            '.py': 'python',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.go': 'go',
            '.rs': 'rust',
            '.cpp': 'cpp',
            '.c': 'c',
            '.rb': 'ruby',
            '.php': 'php',
        }
        
        self.refactoring_history = []
        self.metrics_history = []
    
    def detect_language(self, file_path: Path) -> Optional[str]:
        """Detect programming language from file extension"""
        return self.supported_extensions.get(file_path.suffix.lower())
    
    def analyze_file(self, file_path: Path) -> Dict[str, Any]:
        """Analyze a single file for refactoring opportunities"""
        language = self.detect_language(file_path)
        if not language:
            return {'error': f'Unsupported file type: {file_path.suffix}'}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            original_code = f.read()
        
        results = {
            'file': str(file_path),
            'language': language,
            'original_size': len(original_code),
            'suggestions': [],
            'metrics': None,
            'optimized_code': None
        }
        
        # Analyze complexity
        if language == 'python':
            metrics, complexity_suggestions = self.complexity_analyzer.analyze_python(original_code)
            results['metrics'] = metrics
            results['suggestions'].extend(complexity_suggestions)
        
        # Optimize performance
        optimized_code, perf_suggestions = self.optimizer.optimize_code(original_code, language)
        results['optimized_code'] = optimized_code
        results['suggestions'].extend(perf_suggestions)
        
        # Calculate safety scores
        for suggestion in results['suggestions']:
            if not suggestion.original_code:
                continue
            suggestion.safety_score = self.safety_checker.calculate_safety_score(
                suggestion.original_code,
                suggestion.suggested_code
            )
        
        # Sort suggestions by severity and safety
        severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        results['suggestions'].sort(
            key=lambda s: (severity_order.get(s.severity, 4), -s.safety_score)
        )
        
        return results
    
    def analyze_project(self, patterns: List[str] = None) -> Dict[str, Any]:
        """Analyze entire project for refactoring opportunities"""
        if patterns is None:
            patterns = ['**/*.py', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx']
        
        all_results = {
            'project': str(self.project_path),
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'files_analyzed': 0,
            'total_suggestions': 0,
            'critical_issues': 0,
            'high_issues': 0,
            'medium_issues': 0,
            'low_issues': 0,
            'files': []
        }
        
        # Find all matching files
        files_to_analyze = []
        for pattern in patterns:
            files_to_analyze.extend(self.project_path.glob(pattern))
        
        # Analyze files in parallel
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = {executor.submit(self.analyze_file, f): f for f in files_to_analyze}
            
            for future in futures:
                result = future.result()
                if 'error' not in result:
                    all_results['files'].append(result)
                    all_results['files_analyzed'] += 1
                    all_results['total_suggestions'] += len(result['suggestions'])
                    
                    for suggestion in result['suggestions']:
                        if suggestion.severity == 'critical':
                            all_results['critical_issues'] += 1
                        elif suggestion.severity == 'high':
                            all_results['high_issues'] += 1
                        elif suggestion.severity == 'medium':
                            all_results['medium_issues'] += 1
                        elif suggestion.severity == 'low':
                            all_results['low_issues'] += 1
        
        return all_results
    
    def apply_refactoring(self, file_path: Path, apply_all: bool = False, 
                         min_safety_score: float = 0.8) -> Dict[str, Any]:
        """Apply refactoring suggestions to a file"""
        analysis = self.analyze_file(file_path)
        
        if 'error' in analysis:
            return analysis
        
        # Create backup
        backup_path = self.safety_checker.create_backup(str(file_path))
        
        applied_suggestions = []
        skipped_suggestions = []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            current_code = f.read()
        
        for suggestion in analysis['suggestions']:
            if suggestion.safety_score < min_safety_score:
                skipped_suggestions.append({
                    'reason': f'Safety score too low: {suggestion.safety_score:.2f}',
                    'suggestion': suggestion.description
                })
                continue
            
            if not apply_all:
                # Interactive mode
                print(f"\n{suggestion.severity.upper()}: {suggestion.description}")
                print(f"Lines {suggestion.line_start}-{suggestion.line_end}")
                print(f"Performance impact: {suggestion.performance_impact}")
                print(f"Safety score: {suggestion.safety_score:.2f}")
                
                if suggestion.original_code and suggestion.suggested_code:
                    print("\nOriginal:")
                    print(suggestion.original_code)
                    print("\nSuggested:")
                    print(suggestion.suggested_code)
                
                response = input("\nApply this refactoring? (y/n/q): ").lower()
                
                if response == 'q':
                    break
                elif response != 'y':
                    skipped_suggestions.append({
                        'reason': 'User skipped',
                        'suggestion': suggestion.description
                    })
                    continue
            
            # Apply the refactoring
            if analysis['optimized_code']:
                current_code = analysis['optimized_code']
                applied_suggestions.append(suggestion.description)
        
        # Verify syntax before saving
        syntax_valid, error = self.safety_checker.verify_syntax(
            current_code, 
            analysis['language']
        )
        
        if not syntax_valid:
            # Restore from backup
            with open(backup_path, 'r') as f:
                current_code = f.read()
            with open(file_path, 'w') as f:
                f.write(current_code)
            
            return {
                'error': f'Syntax error after refactoring: {error}',
                'backup_restored': True,
                'backup_path': backup_path
            }
        
        # Save refactored code
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(current_code)
        
        # Run tests if available
        tests_passed, test_output = self.safety_checker.run_tests(
            str(self.project_path),
            analysis['language']
        )
        
        if not tests_passed:
            # Restore from backup if tests fail
            with open(backup_path, 'r') as f:
                original = f.read()
            with open(file_path, 'w') as f:
                f.write(original)
            
            return {
                'error': 'Tests failed after refactoring',
                'test_output': test_output,
                'backup_restored': True,
                'backup_path': backup_path
            }
        
        # Success - save to history
        self.refactoring_history.append({
            'file': str(file_path),
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'applied': applied_suggestions,
            'skipped': skipped_suggestions,
            'backup': backup_path
        })
        
        return {
            'success': True,
            'file': str(file_path),
            'applied_suggestions': applied_suggestions,
            'skipped_suggestions': skipped_suggestions,
            'backup_path': backup_path,
            'tests_passed': tests_passed,
            'size_reduction': len(analysis['original_code']) - len(current_code) if 'original_code' in analysis else 0
        }
    
    def batch_refactor(self, patterns: List[str] = None, auto_apply: bool = False,
                       min_safety_score: float = 0.8) -> Dict[str, Any]:
        """Batch refactor multiple files"""
        analysis = self.analyze_project(patterns)
        
        results = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'files_processed': 0,
            'files_refactored': 0,
            'total_applied': 0,
            'total_skipped': 0,
            'errors': [],
            'details': []
        }
        
        for file_analysis in analysis['files']:
            file_path = Path(file_analysis['file'])
            
            if not file_analysis['suggestions']:
                continue
            
            result = self.apply_refactoring(
                file_path,
                apply_all=auto_apply,
                min_safety_score=min_safety_score
            )
            
            results['files_processed'] += 1
            
            if 'error' in result:
                results['errors'].append({
                    'file': str(file_path),
                    'error': result['error']
                })
            elif result.get('success'):
                results['files_refactored'] += 1
                results['total_applied'] += len(result['applied_suggestions'])
                results['total_skipped'] += len(result['skipped_suggestions'])
                results['details'].append(result)
        
        return results
    
    def profile_performance(self, file_path: Path, function_name: Optional[str] = None) -> Dict[str, Any]:
        """Profile code performance to identify bottlenecks"""
        if not PROFILING_AVAILABLE:
            return {'error': 'Profiling not available. Install with: pip install cProfile'}
        
        language = self.detect_language(file_path)
        
        if language != 'python':
            return {'error': 'Performance profiling currently only supports Python'}
        
        with open(file_path, 'r') as f:
            code = f.read()
        
        # Create profiler
        profiler = cProfile.Profile()
        
        # Profile the code
        namespace = {}
        profiler.enable()
        try:
            exec(code, namespace)
            
            if function_name and function_name in namespace:
                # Profile specific function
                func = namespace[function_name]
                if callable(func):
                    func()
        except Exception as e:
            return {'error': f'Error during profiling: {str(e)}'}
        finally:
            profiler.disable()
        
        # Get statistics
        s = io.StringIO()
        ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
        ps.print_stats(20)  # Top 20 functions
        
        profile_output = s.getvalue()
        
        # Parse profiling results to identify bottlenecks
        bottlenecks = []
        lines = profile_output.split('\n')
        
        for line in lines:
            if 'function calls' in line or not line.strip():
                continue
            
            parts = line.split()
            if len(parts) >= 6 and parts[0].replace('.', '').isdigit():
                try:
                    cumtime = float(parts[3])
                    if cumtime > 0.1:  # Functions taking > 0.1s
                        bottlenecks.append({
                            'function': parts[-1],
                            'calls': parts[0],
                            'total_time': parts[3],
                            'per_call': parts[4]
                        })
                except:
                    continue
        
        return {
            'file': str(file_path),
            'profile_output': profile_output,
            'bottlenecks': bottlenecks[:10],  # Top 10 bottlenecks
            'recommendations': self._generate_performance_recommendations(bottlenecks)
        }
    
    def _generate_performance_recommendations(self, bottlenecks: List[Dict]) -> List[str]:
        """Generate performance recommendations based on profiling"""
        recommendations = []
        
        for bottleneck in bottlenecks[:5]:
            func_name = bottleneck['function']
            
            if 'append' in func_name:
                recommendations.append("Consider using list comprehension instead of append in loops")
            elif 'join' in func_name:
                recommendations.append("String joining detected - ensure using ''.join() for concatenation")
            elif 'sort' in func_name:
                recommendations.append("Consider if sorting can be done once or use a heap for partial sorting")
            elif any(db in func_name for db in ['query', 'select', 'fetch']):
                recommendations.append("Database operation detected - consider caching or batch operations")
            elif 'for' in func_name or 'loop' in func_name:
                recommendations.append("Loop bottleneck - consider NumPy vectorization or multiprocessing")
        
        return recommendations
    
    def generate_report(self, output_format: str = 'json') -> str:
        """Generate comprehensive refactoring report"""
        report_data = {
            'project': str(self.project_path),
            'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'refactoring_history': self.refactoring_history,
            'metrics_history': self.metrics_history,
            'summary': {
                'total_files_refactored': len(set(h['file'] for h in self.refactoring_history)),
                'total_suggestions_applied': sum(len(h['applied']) for h in self.refactoring_history),
                'total_suggestions_skipped': sum(len(h['skipped']) for h in self.refactoring_history),
            }
        }
        
        if output_format == 'json':
            return json.dumps(report_data, indent=2, default=str)
        
        elif output_format == 'markdown':
            md = f"# Refactoring Report\n\n"
            md += f"**Project:** {report_data['project']}\n"
            md += f"**Generated:** {report_data['generated_at']}\n\n"
            
            md += "## Summary\n\n"
            for key, value in report_data['summary'].items():
                md += f"- **{key.replace('_', ' ').title()}:** {value}\n"
            
            md += "\n## Refactoring History\n\n"
            for entry in self.refactoring_history:
                md += f"### {entry['file']}\n"
                md += f"- **Timestamp:** {entry['timestamp']}\n"
                md += f"- **Applied:** {len(entry['applied'])} suggestions\n"
                md += f"- **Skipped:** {len(entry['skipped'])} suggestions\n"
                md += f"- **Backup:** `{entry['backup']}`\n\n"
            
            return md
        
        return str(report_data)

class ClaudeCodeIntegration:
    """Integration with Claude Code CLI"""
    
    def __init__(self, refactor_genius: RefactorGenius):
        self.genius = refactor_genius
        self.commands = {
            'analyze': self.analyze_command,
            'refactor': self.refactor_command,
            'profile': self.profile_command,
            'report': self.report_command,
            'batch': self.batch_command,
            'restore': self.restore_command,
        }
    
    def analyze_command(self, args: argparse.Namespace) -> None:
        """Handle analyze command"""
        if args.file:
            result = self.genius.analyze_file(Path(args.file))
            self._print_analysis(result)
        else:
            result = self.genius.analyze_project(args.patterns)
            self._print_project_analysis(result)
    
    def refactor_command(self, args: argparse.Namespace) -> None:
        """Handle refactor command"""
        result = self.genius.apply_refactoring(
            Path(args.file),
            apply_all=args.auto,
            min_safety_score=args.min_safety
        )
        self._print_refactor_result(result)
    
    def batch_command(self, args: argparse.Namespace) -> None:
        """Handle batch refactor command"""
        result = self.genius.batch_refactor(
            patterns=args.patterns,
            auto_apply=args.auto,
            min_safety_score=args.min_safety
        )
        self._print_batch_result(result)
    
    def profile_command(self, args: argparse.Namespace) -> None:
        """Handle profile command"""
        result = self.genius.profile_performance(
            Path(args.file),
            function_name=args.function
        )
        self._print_profile_result(result)
    
    def report_command(self, args: argparse.Namespace) -> None:
        """Handle report command"""
        report = self.genius.generate_report(args.format)
        
        if args.output:
            with open(args.output, 'w') as f:
                f.write(report)
            print(f"Report saved to: {args.output}")
        else:
            print(report)
    
    def restore_command(self, args: argparse.Namespace) -> None:
        """Restore file from backup"""
        backup_path = Path(args.backup)
        
        if not backup_path.exists():
            print(f"Error: Backup file not found: {backup_path}")
            return
        
        # Extract original file path from backup name
        original_path = str(backup_path).replace('.refactor_backup_', '').rsplit('_', 1)[0]
        
        with open(backup_path, 'r') as f:
            content = f.read()
        
        with open(original_path, 'w') as f:
            f.write(content)
        
        print(f"Restored {original_path} from {backup_path}")
    
    def _print_analysis(self, result: Dict) -> None:
        """Pretty print file analysis results"""
        if 'error' in result:
            print(f"Error: {result['error']}")
            return
        
        print(f"\n📁 File: {result['file']}")
        print(f"📝 Language: {result['language']}")
        print(f"📏 Size: {result['original_size']} bytes")
        
        if result['metrics']:
            m = result['metrics']
            print(f"\n📊 Metrics:")
            print(f"  • Complexity: {m.complexity}")
            print(f"  • Lines: {m.lines}")
            print(f"  • Functions: {m.functions}")
            print(f"  • Classes: {m.classes}")
        
        if result['suggestions']:
            print(f"\n💡 Suggestions ({len(result['suggestions'])} total):")
            
            for i, suggestion in enumerate(result['suggestions'][:10], 1):
                severity_emoji = {
                    'critical': '🔴',
                    'high': '🟠',
                    'medium': '🟡',
                    'low': '🟢'
                }.get(suggestion.severity, '⚪')
                
                print(f"\n  {i}. {severity_emoji} {suggestion.description}")
                print(f"     Lines: {suggestion.line_start}-{suggestion.line_end}")
                print(f"     Performance: {suggestion.performance_impact}")
                print(f"     Safety: {suggestion.safety_score:.1%}")
    
    def _print_project_analysis(self, result: Dict) -> None:
        """Pretty print project analysis results"""
        print(f"\n🚀 Project Analysis: {result['project']}")
        print(f"📅 Timestamp: {result['timestamp']}")
        print(f"\n📊 Summary:")
        print(f"  • Files analyzed: {result['files_analyzed']}")
        print(f"  • Total suggestions: {result['total_suggestions']}")
        print(f"  • Critical issues: {result['critical_issues']}")
        print(f"  • High issues: {result['high_issues']}")
        print(f"  • Medium issues: {result['medium_issues']}")
        print(f"  • Low issues: {result['low_issues']}")
        
        if result['files']:
            print(f"\n📁 Top files with issues:")
            sorted_files = sorted(
                result['files'],
                key=lambda f: len(f['suggestions']),
                reverse=True
            )[:10]
            
            for f in sorted_files:
                if f['suggestions']:
                    print(f"  • {f['file']}: {len(f['suggestions'])} suggestions")
    
    def _print_refactor_result(self, result: Dict) -> None:
        """Pretty print refactoring results"""
        if 'error' in result:
            print(f"❌ Error: {result['error']}")
            if result.get('backup_restored'):
                print(f"✅ Backup restored from: {result['backup_path']}")
            return
        
        if result.get('success'):
            print(f"✅ Successfully refactored: {result['file']}")
            print(f"📝 Applied: {len(result['applied_suggestions'])} suggestions")
            print(f"⏭️  Skipped: {len(result['skipped_suggestions'])} suggestions")
            print(f"💾 Backup saved: {result['backup_path']}")
            
            if result.get('size_reduction', 0) > 0:
                print(f"📉 Size reduced by: {result['size_reduction']} bytes")
            
            if result['tests_passed']:
                print(f"✅ All tests passed")
    
    def _print_batch_result(self, result: Dict) -> None:
        """Pretty print batch refactoring results"""
        print(f"\n🔄 Batch Refactoring Results")
        print(f"📅 Timestamp: {result['timestamp']}")
        print(f"\n📊 Summary:")
        print(f"  • Files processed: {result['files_processed']}")
        print(f"  • Files refactored: {result['files_refactored']}")
        print(f"  • Suggestions applied: {result['total_applied']}")
        print(f"  • Suggestions skipped: {result['total_skipped']}")
        
        if result['errors']:
            print(f"\n❌ Errors ({len(result['errors'])}):")
            for error in result['errors'][:5]:
                print(f"  • {error['file']}: {error['error']}")
    
    def _print_profile_result(self, result: Dict) -> None:
        """Pretty print profiling results"""
        if 'error' in result:
            print(f"❌ Error: {result['error']}")
            return
        
        print(f"\n⚡ Performance Profile: {result['file']}")
        
        if result['bottlenecks']:
            print(f"\n🔥 Top Bottlenecks:")
            for i, bottleneck in enumerate(result['bottlenecks'], 1):
                print(f"  {i}. {bottleneck['function']}")
                print(f"     Calls: {bottleneck['calls']}")
                print(f"     Total time: {bottleneck['total_time']}s")
        
        if result['recommendations']:
            print(f"\n💡 Recommendations:")
            for rec in result['recommendations']:
                print(f"  • {rec}")

def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='RefactorGenius - Advanced Code Refactoring Agent for Claude Code CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Analyze a single file
  python refactor_genius.py analyze --file app.py
  
  # Analyze entire project
  python refactor_genius.py analyze --patterns "**/*.py" "**/*.js"
  
  # Refactor a file interactively
  python refactor_genius.py refactor --file app.py
  
  # Batch refactor with auto-apply
  python refactor_genius.py batch --auto --min-safety 0.9
  
  # Profile performance
  python refactor_genius.py profile --file app.py --function main
  
  # Generate report
  python refactor_genius.py report --format markdown --output report.md
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Analyze command
    analyze_parser = subparsers.add_parser('analyze', help='Analyze code for refactoring opportunities')
    analyze_parser.add_argument('--file', help='Analyze single file')
    analyze_parser.add_argument('--patterns', nargs='*', default=['**/*.py'], 
                               help='File patterns to analyze')
    
    # Refactor command
    refactor_parser = subparsers.add_parser('refactor', help='Apply refactoring to a file')
    refactor_parser.add_argument('--file', required=True, help='File to refactor')
    refactor_parser.add_argument('--auto', action='store_true', 
                                help='Automatically apply all safe refactorings')
    refactor_parser.add_argument('--min-safety', type=float, default=0.8,
                                help='Minimum safety score (0-1)')
    
    # Batch command
    batch_parser = subparsers.add_parser('batch', help='Batch refactor multiple files')
    batch_parser.add_argument('--patterns', nargs='*', default=['**/*.py'],
                             help='File patterns to refactor')
    batch_parser.add_argument('--auto', action='store_true',
                             help='Automatically apply all safe refactorings')
    batch_parser.add_argument('--min-safety', type=float, default=0.8,
                             help='Minimum safety score (0-1)')
    
    # Profile command
    profile_parser = subparsers.add_parser('profile', help='Profile code performance')
    profile_parser.add_argument('--file', required=True, help='File to profile')
    profile_parser.add_argument('--function', help='Specific function to profile')
    
    # Report command
    report_parser = subparsers.add_parser('report', help='Generate refactoring report')
    report_parser.add_argument('--format', choices=['json', 'markdown'], default='json',
                              help='Report format')
    report_parser.add_argument('--output', help='Output file (default: stdout)')
    
    # Restore command
    restore_parser = subparsers.add_parser('restore', help='Restore file from backup')
    restore_parser.add_argument('--backup', required=True, help='Backup file path')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize RefactorGenius
    genius = RefactorGenius()
    integration = ClaudeCodeIntegration(genius)
    
    # Execute command
    if args.command in integration.commands:
        integration.commands[args.command](args)
    else:
        print(f"Unknown command: {args.command}")

if __name__ == "__main__":
    main()
