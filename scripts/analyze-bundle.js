#!/usr/bin/env node

/**
 * Bundle Analysis Script - Phase 2 Optimization
 * Analyzes Next.js bundle size and provides optimization recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function analyzeBundleSize() {
  console.log('📊 Analyzing bundle size...\n');

  try {
    // Build the application
    console.log('Building application...');
    const buildOutput = execSync('npm run build', { encoding: 'utf8', cwd: process.cwd() });
    
    // Extract bundle size information from build output
    const lines = buildOutput.split('\n');
    const bundleInfo = [];
    let inRoutesSection = false;
    
    for (const line of lines) {
      if (line.includes('Route (app)') || line.includes('Page')) {
        inRoutesSection = true;
        continue;
      }
      
      if (inRoutesSection && line.trim() && !line.includes('├─') && !line.includes('└─')) {
        if (line.includes('kB')) {
          bundleInfo.push(line.trim());
        }
      }
      
      if (line.includes('First Load JS shared by all')) {
        inRoutesSection = false;
      }
    }
    
    console.log('📦 Bundle Analysis Results:\n');
    bundleInfo.forEach(info => console.log(`  ${info}`));
    
    // Analyze large chunks
    console.log('\n🔍 Optimization Opportunities:\n');
    
    const recommendations = [];
    
    if (buildOutput.includes('tesseract')) {
      recommendations.push('• Consider lazy-loading Tesseract.js OCR library');
    }
    
    if (buildOutput.includes('page-flip')) {
      recommendations.push('• Page-flip library could be dynamically imported');
    }
    
    // Check for large route bundles
    const largeBundles = bundleInfo.filter(info => {
      const sizeMatch = info.match(/(\d+(?:\.\d+)?)\s*kB/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        return size > 100; // Flag bundles larger than 100kB
      }
      return false;
    });
    
    if (largeBundles.length > 0) {
      recommendations.push('• Found large route bundles - consider code splitting:');
      largeBundles.forEach(bundle => {
        recommendations.push(`  - ${bundle}`);
      });
    }
    
    if (recommendations.length > 0) {
      recommendations.forEach(rec => console.log(rec));
    } else {
      console.log('✅ Bundle sizes look good!');
    }
    
    // Calculate total bundle size
    let totalSize = 0;
    bundleInfo.forEach(info => {
      const sizeMatch = info.match(/(\d+(?:\.\d+)?)\s*kB/);
      if (sizeMatch) {
        totalSize += parseFloat(sizeMatch[1]);
      }
    });
    
    console.log(`\n📊 Total estimated bundle size: ${totalSize.toFixed(1)}kB`);
    
    // Provide performance recommendations based on size
    if (totalSize > 500) {
      console.log('\n⚠️  Bundle size is large. Consider:');
      console.log('   • Implementing more code splitting');
      console.log('   • Using dynamic imports for heavy components');
      console.log('   • Optimizing image loading with Next.js Image');
    } else if (totalSize > 250) {
      console.log('\n🟡 Bundle size is moderate. Consider:');
      console.log('   • Review largest routes for optimization opportunities');
      console.log('   • Implement lazy loading for non-critical features');
    } else {
      console.log('\n✅ Bundle size looks optimal!');
    }

  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
    process.exit(1);
  }
}

// Run the analysis
analyzeBundleSize();