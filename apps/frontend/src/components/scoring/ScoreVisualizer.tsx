'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';

type RiskLevel = {
  min: number;
  max: number;
  label: string;
  risk_level: string;
  color: string;
  description: string;
};

type ScoreVisualizerProps = {
  score: number;
  maxScore: number;
  riskLevel?: string;
  riskLevels: RiskLevel[];
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
};

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({
  score,
  maxScore,
  riskLevel,
  riskLevels,
  showDetails = true,
  size = 'medium',
  animated = true,
  className = ''
}) => {
  const [currentRiskLevel, setCurrentRiskLevel] = useState<RiskLevel | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Sort risk levels by min score
  const sortedRiskLevels = [...riskLevels].sort((a, b) => a.min - b.min);
  
  // Calculate percentage for gauge
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);
  
  // Determine gauge size
  const gaugeSize = {
    small: { width: 120, height: 60, thickness: 8, fontSize: 'text-lg' },
    medium: { width: 180, height: 90, thickness: 12, fontSize: 'text-2xl' },
    large: { width: 240, height: 120, thickness: 16, fontSize: 'text-4xl' }
  }[size];
  
  // Find current risk level
  useEffect(() => {
    if (riskLevels.length === 0) return;
    
    let found = null;
    
    // If riskLevel is provided, find matching risk level
    if (riskLevel) {
      found = riskLevels.find(level => level.risk_level === riskLevel);
    }
    
    // If not found by risk level, find by score
    if (!found) {
      for (const level of sortedRiskLevels) {
        if (score >= level.min && score <= level.max) {
          found = level;
          break;
        }
      }
    }
    
    // If still not found, use the highest risk level
    if (!found) {
      found = sortedRiskLevels[sortedRiskLevels.length - 1];
    }
    
    setCurrentRiskLevel(found);
  }, [score, riskLevel, riskLevels, sortedRiskLevels]);
  
  // Get risk level icon
  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal':
      case 'mild':
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'moderate':
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'moderately severe':
      case 'severe':
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'mild':
        return 'bg-lime-100 text-lime-800';
      case 'moderate':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderately severe':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get gauge color
  const getGaugeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal':
      case 'low':
        return '#4ade80'; // green-400
      case 'mild':
        return '#a3e635'; // lime-400
      case 'moderate':
      case 'medium':
        return '#facc15'; // yellow-400
      case 'moderately severe':
        return '#fb923c'; // orange-400
      case 'severe':
      case 'high':
        return '#f87171'; // red-400
      default:
        return '#94a3b8'; // slate-400
    }
  };
  
  // Calculate gradient stops for gauge
  const getGradientStops = () => {
    if (sortedRiskLevels.length === 0) {
      return [
        { offset: '0%', color: '#4ade80' },
        { offset: '100%', color: '#f87171' }
      ];
    }
    
    return sortedRiskLevels.map((level, index) => {
      const offset = `${(level.min / maxScore) * 100}%`;
      const color = level.color || getGaugeColor(level.risk_level);
      return { offset, color };
    });
  };
  
  // Get gradient ID
  const gradientId = `score-gradient-${Math.random().toString(36).substring(2, 9)}`;
  
  if (!currentRiskLevel) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-full h-24 w-24"></div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Gauge */}
      <div className="relative" style={{ width: gaugeSize.width, height: gaugeSize.height }}>
        <svg
          width={gaugeSize.width}
          height={gaugeSize.height}
          viewBox={`0 0 ${gaugeSize.width} ${gaugeSize.height}`}
          className="transform -rotate-90"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {getGradientStops().map((stop, index) => (
                <stop key={index} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d={`M ${gaugeSize.width / 2}, ${gaugeSize.height} 
                A ${gaugeSize.width / 2 - gaugeSize.thickness / 2}, ${gaugeSize.width / 2 - gaugeSize.thickness / 2} 0 1 1 ${gaugeSize.width}, ${gaugeSize.height}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={gaugeSize.thickness}
            strokeLinecap="round"
          />
          
          {/* Foreground arc */}
          <motion.path
            d={`M ${gaugeSize.width / 2}, ${gaugeSize.height} 
                A ${gaugeSize.width / 2 - gaugeSize.thickness / 2}, ${gaugeSize.width / 2 - gaugeSize.thickness / 2} 0 ${percentage > 50 ? 1 : 0} 1 
                ${gaugeSize.width / 2 + (gaugeSize.width / 2 - gaugeSize.thickness / 2) * Math.cos(Math.PI * (1 - percentage / 100))}, 
                ${gaugeSize.height - (gaugeSize.width / 2 - gaugeSize.thickness / 2) * Math.sin(Math.PI * (1 - percentage / 100))}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={gaugeSize.thickness}
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : { pathLength: percentage / 100 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Score text */}
          <text
            x={gaugeSize.width / 2}
            y={gaugeSize.height - gaugeSize.height / 4}
            textAnchor="middle"
            className={`${gaugeSize.fontSize} font-bold`}
            fill="currentColor"
            transform={`rotate(90, ${gaugeSize.width / 2}, ${gaugeSize.height - gaugeSize.height / 4})`}
          >
            {score}
          </text>
        </svg>
        
        {/* Risk level badge */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(currentRiskLevel.risk_level)}`}>
            {currentRiskLevel.label}
          </div>
          
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 p-2 bg-white rounded-md shadow-lg text-xs z-10"
              >
                <div className="text-center mb-1 font-medium">{currentRiskLevel.label}</div>
                <div className="text-gray-600">{currentRiskLevel.description}</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Details */}
      {showDetails && (
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">Score</div>
            <div className="text-sm font-medium">{score} / {maxScore}</div>
          </div>
          
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentRiskLevel.color || getGaugeColor(currentRiskLevel.risk_level), width: `${percentage}%` }}
              initial={animated ? { width: 0 } : { width: `${percentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center mb-2">
              {getRiskLevelIcon(currentRiskLevel.risk_level)}
              <span className="ml-2 text-sm font-medium text-gray-700">Risk Level: {currentRiskLevel.label}</span>
            </div>
            <p className="text-sm text-gray-600">{currentRiskLevel.description}</p>
          </div>
          
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Risk Level Scale</div>
            <div className="flex items-center">
              <div className="flex-1 h-2 rounded-l-full bg-green-400"></div>
              <div className="flex-1 h-2 bg-lime-400"></div>
              <div className="flex-1 h-2 bg-yellow-400"></div>
              <div className="flex-1 h-2 bg-orange-400"></div>
              <div className="flex-1 h-2 rounded-r-full bg-red-400"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <div>Minimal</div>
              <div>Mild</div>
              <div>Moderate</div>
              <div>Severe</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreVisualizer;
