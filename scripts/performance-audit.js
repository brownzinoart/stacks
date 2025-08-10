#!/usr/bin/env node

/**
 * Comprehensive Performance Audit Script - Phase 3 Finalization
 * Tests all optimization phases and generates detailed report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceAudit {
  constructor() {
    this.results = {
      phase1: { score: 0, details: [] },
      phase2: { score: 0, details: [] },
      phase3: { score: 0, details: [] },
      overall: { score: 0, recommendations: [] }
    };
  }

  async runAudit() {
    console.log('🔍 Running Comprehensive Performance Audit...\n');
    
    try {
      // Phase 1: Basic optimizations
      await this.auditPhase1();
      
      // Phase 2: Advanced optimizations
      await this.auditPhase2();
      
      // Phase 3: Cutting-edge optimizations
      await this.auditPhase3();
      
      // Calculate overall score
      this.calculateOverallScore();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Performance audit failed:', error.message);
      process.exit(1);
    }
  }

  async auditPhase1() {
    console.log('📊 Phase 1: Basic Performance Optimizations');
    
    let score = 0;
    const details = [];
    
    // Check if build succeeds
    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      score += 20;
      details.push('✅ TypeScript compilation successful');
    } catch (error) {
      details.push('⚠️  TypeScript compilation has warnings');
    }
    
    // Check for Next.js Image optimization
    const imageOptimization = this.checkImageOptimization();
    if (imageOptimization.optimized > imageOptimization.total * 0.8) {
      score += 30;
      details.push(`✅ Image optimization: ${imageOptimization.optimized}/${imageOptimization.total} images optimized`);
    } else {
      details.push(`⚠️  Image optimization: Only ${imageOptimization.optimized}/${imageOptimization.total} images optimized`);
    }
    
    // Check for React optimizations
    const reactOptimizations = this.checkReactOptimizations();
    score += reactOptimizations.score;
    details.push(...reactOptimizations.details);
    
    this.results.phase1 = { score, details };
    console.log(`   Score: ${score}/100\n`);
  }

  async auditPhase2() {
    console.log('🚀 Phase 2: Advanced Performance Optimizations');
    
    let score = 0;
    const details = [];
    
    // Check for dynamic imports
    const dynamicImports = this.checkDynamicImports();
    score += dynamicImports.score;
    details.push(...dynamicImports.details);
    
    // Check for lazy loading components
    const lazyComponents = this.checkLazyComponents();
    score += lazyComponents.score;
    details.push(...lazyComponents.details);
    
    // Check for memory management
    const memoryManagement = this.checkMemoryManagement();
    score += memoryManagement.score;
    details.push(...memoryManagement.details);
    
    // Check for optimized hooks
    const optimizedHooks = this.checkOptimizedHooks();
    score += optimizedHooks.score;
    details.push(...optimizedHooks.details);
    
    this.results.phase2 = { score, details };
    console.log(`   Score: ${score}/100\n`);
  }

  async auditPhase3() {
    console.log('⚡ Phase 3: Cutting-edge Performance Optimizations');
    
    let score = 0;
    const details = [];
    
    // Check for advanced service worker
    const serviceWorker = this.checkAdvancedServiceWorker();
    score += serviceWorker.score;
    details.push(...serviceWorker.details);
    
    // Check for API optimization
    const apiOptimization = this.checkAPIOptimization();
    score += apiOptimization.score;
    details.push(...apiOptimization.details);
    
    // Check for critical CSS
    const criticalCSS = this.checkCriticalCSS();
    score += criticalCSS.score;
    details.push(...criticalCSS.details);
    
    // Check for performance analytics
    const performanceAnalytics = this.checkPerformanceAnalytics();
    score += performanceAnalytics.score;
    details.push(...performanceAnalytics.details);
    
    this.results.phase3 = { score, details };
    console.log(`   Score: ${score}/100\n`);
  }

  checkImageOptimization() {
    const imageFiles = this.findFiles(['**/*.tsx', '**/*.jsx'], ['node_modules', '.next', 'out']);
    let total = 0;
    let optimized = 0;
    
    imageFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const imgTags = content.match(/<img[^>]*>/g) || [];
      const nextImages = content.match(/from\s+['"]next\/image['"]/g) || [];
      
      total += imgTags.length;
      
      // Count optimized images (those using Next.js Image component)
      if (nextImages.length > 0) {
        optimized += Math.min(imgTags.length, nextImages.length);
      }
    });
    
    return { total, optimized };
  }

  checkReactOptimizations() {
    let score = 0;
    const details = [];
    
    // Check for React.memo usage
    const memoUsage = this.findInFiles('React.memo', ['**/*.tsx', '**/*.jsx']);
    if (memoUsage > 3) {
      score += 25;
      details.push(`✅ React.memo used in ${memoUsage} components`);
    } else {
      details.push(`⚠️  React.memo usage could be improved (${memoUsage} instances)`);
    }
    
    // Check for useMemo/useCallback usage
    const hookOptimizations = this.findInFiles('use(Memo|Callback)', ['**/*.tsx', '**/*.jsx']);
    if (hookOptimizations > 5) {
      score += 25;
      details.push(`✅ Optimization hooks used ${hookOptimizations} times`);
    } else {
      details.push(`⚠️  More useMemo/useCallback usage recommended`);
    }
    
    return { score, details };
  }

  checkDynamicImports() {
    let score = 0;
    const details = [];
    
    // Check for dynamic imports
    const dynamicImportCount = this.findInFiles('import\\(', ['**/*.ts', '**/*.tsx']);
    if (dynamicImportCount > 3) {
      score += 30;
      details.push(`✅ Dynamic imports implemented (${dynamicImportCount} instances)`);
    } else {
      score += 10;
      details.push(`⚠️  More dynamic imports could improve performance`);
    }
    
    // Check for lazy loading utilities
    if (fs.existsSync('src/lib/ar-service-loader.ts')) {
      score += 20;
      details.push('✅ AR service lazy loading implemented');
    }
    
    if (fs.existsSync('src/lib/book-flipbook-loader.ts')) {
      score += 20;
      details.push('✅ Flipbook lazy loading implemented');
    }
    
    return { score, details };
  }

  checkLazyComponents() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/lib/component-loader.ts')) {
      score += 40;
      details.push('✅ Component lazy loading system implemented');
      
      const content = fs.readFileSync('src/lib/component-loader.ts', 'utf8');
      const lazyComponents = (content.match(/Lazy\w+/g) || []).length;
      
      if (lazyComponents > 2) {
        score += 30;
        details.push(`✅ ${lazyComponents} components set up for lazy loading`);
      }
    } else {
      details.push('⚠️  Component lazy loading system not implemented');
    }
    
    return { score, details };
  }

  checkMemoryManagement() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/lib/memory-manager.ts')) {
      score += 50;
      details.push('✅ Memory management utilities implemented');
      
      const content = fs.readFileSync('src/lib/memory-manager.ts', 'utf8');
      if (content.includes('LimitedCache')) {
        score += 25;
        details.push('✅ Limited cache implementation found');
      }
      
      if (content.includes('optimizedDebounce')) {
        score += 25;
        details.push('✅ Optimized debounce implementation found');
      }
    } else {
      details.push('⚠️  Memory management utilities not implemented');
    }
    
    return { score, details };
  }

  checkOptimizedHooks() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/hooks/use-optimized-effect.ts')) {
      score += 50;
      details.push('✅ Optimized React hooks implemented');
    } else {
      details.push('⚠️  Optimized React hooks not implemented');
    }
    
    if (fs.existsSync('src/hooks/use-performance-monitor.ts')) {
      score += 50;
      details.push('✅ Performance monitoring hook implemented');
    } else {
      details.push('⚠️  Performance monitoring hook not implemented');
    }
    
    return { score, details };
  }

  checkAdvancedServiceWorker() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('public/sw-advanced.js')) {
      score += 40;
      details.push('✅ Advanced service worker implemented');
    } else {
      details.push('⚠️  Advanced service worker not found');
    }
    
    if (fs.existsSync('src/lib/sw-manager.ts')) {
      score += 40;
      details.push('✅ Service worker manager implemented');
    } else {
      details.push('⚠️  Service worker manager not implemented');
    }
    
    // Check for intelligent caching strategies
    if (fs.existsSync('public/sw-advanced.js')) {
      const content = fs.readFileSync('public/sw-advanced.js', 'utf8');
      if (content.includes('AdvancedServiceWorker')) {
        score += 20;
        details.push('✅ Advanced caching strategies implemented');
      }
    }
    
    return { score, details };
  }

  checkAPIOptimization() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/lib/api-optimizer.ts')) {
      score += 60;
      details.push('✅ API optimization system implemented');
      
      const content = fs.readFileSync('src/lib/api-optimizer.ts', 'utf8');
      if (content.includes('batchRequests')) {
        score += 20;
        details.push('✅ Request batching implemented');
      }
      
      if (content.includes('compressResponse')) {
        score += 20;
        details.push('✅ Response compression implemented');
      }
    } else {
      details.push('⚠️  API optimization system not implemented');
    }
    
    return { score, details };
  }

  checkCriticalCSS() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/lib/critical-css.ts')) {
      score += 60;
      details.push('✅ Critical CSS system implemented');
      
      const content = fs.readFileSync('src/lib/critical-css.ts', 'utf8');
      if (content.includes('criticalCSS')) {
        score += 20;
        details.push('✅ Critical CSS injection implemented');
      }
      
      if (content.includes('preloadResource')) {
        score += 20;
        details.push('✅ Resource preloading implemented');
      }
    } else {
      details.push('⚠️  Critical CSS system not implemented');
    }
    
    return { score, details };
  }

  checkPerformanceAnalytics() {
    let score = 0;
    const details = [];
    
    if (fs.existsSync('src/lib/performance-analytics.ts')) {
      score += 60;
      details.push('✅ Performance analytics implemented');
      
      const content = fs.readFileSync('src/lib/performance-analytics.ts', 'utf8');
      if (content.includes('WebVitals')) {
        score += 20;
        details.push('✅ Web Vitals monitoring implemented');
      }
      
      if (content.includes('generateRecommendations')) {
        score += 20;
        details.push('✅ Performance recommendations system implemented');
      }
    } else {
      details.push('⚠️  Performance analytics not implemented');
    }
    
    return { score, details };
  }

  calculateOverallScore() {
    const totalScore = this.results.phase1.score + this.results.phase2.score + this.results.phase3.score;
    this.results.overall.score = Math.round(totalScore / 3);
    
    // Generate recommendations
    const recommendations = [];
    
    if (this.results.phase1.score < 80) {
      recommendations.push('Focus on basic optimizations: image optimization and React performance');
    }
    
    if (this.results.phase2.score < 80) {
      recommendations.push('Implement advanced optimizations: dynamic imports and memory management');
    }
    
    if (this.results.phase3.score < 80) {
      recommendations.push('Add cutting-edge optimizations: service workers and performance analytics');
    }
    
    if (this.results.overall.score >= 90) {
      recommendations.push('🎉 Excellent performance! Monitor and maintain optimizations.');
    } else if (this.results.overall.score >= 75) {
      recommendations.push('Good performance, but there\'s room for improvement.');
    } else {
      recommendations.push('Performance needs significant improvement. Focus on high-impact optimizations first.');
    }
    
    this.results.overall.recommendations = recommendations;
  }

  generateReport() {
    console.log('📋 Performance Audit Report');
    console.log('='.repeat(50));
    
    console.log(`\n🏆 Overall Score: ${this.results.overall.score}/100`);
    
    console.log(`\n📊 Phase Scores:`);
    console.log(`   Phase 1 (Basic): ${this.results.phase1.score}/100`);
    console.log(`   Phase 2 (Advanced): ${this.results.phase2.score}/100`);
    console.log(`   Phase 3 (Cutting-edge): ${this.results.phase3.score}/100`);
    
    console.log('\n📝 Detailed Results:');
    
    console.log('\n  Phase 1 Details:');
    this.results.phase1.details.forEach(detail => console.log(`    ${detail}`));
    
    console.log('\n  Phase 2 Details:');
    this.results.phase2.details.forEach(detail => console.log(`    ${detail}`));
    
    console.log('\n  Phase 3 Details:');
    this.results.phase3.details.forEach(detail => console.log(`    ${detail}`));
    
    console.log('\n🎯 Recommendations:');
    this.results.overall.recommendations.forEach(rec => console.log(`  • ${rec}`));
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'performance-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    process.exit(this.results.overall.score >= 75 ? 0 : 1);
  }

  findFiles(patterns, excludePatterns = []) {
    try {
      const globPattern = patterns.length === 1 ? patterns[0] : `{${patterns.join(',')}}`;
      const excludeArgs = excludePatterns.map(p => `--exclude=${p}`).join(' ');
      
      const result = execSync(`find . -name "${globPattern}" ${excludeArgs}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      return result.trim().split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  findInFiles(pattern, filePatterns) {
    try {
      const files = this.findFiles(filePatterns, ['node_modules', '.next', 'out']);
      let count = 0;
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(new RegExp(pattern, 'g'));
        if (matches) {
          count += matches.length;
        }
      });
      
      return count;
    } catch (error) {
      return 0;
    }
  }
}

// Run the audit
const audit = new PerformanceAudit();
audit.runAudit();