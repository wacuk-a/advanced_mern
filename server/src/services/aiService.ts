import { logger } from '../utils/logger';
import axios from 'axios';

interface AIAnalysisRequest {
  text?: string;
  images?: string[];
  reportType: string;
}

interface AIAnalysisResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'distressed';
  explanation: string;
}

// Risk assessment keywords
const HIGH_RISK_KEYWORDS = [
  'kill', 'death', 'die', 'suicide', 'murder', 'threat', 'weapon', 'gun', 'knife',
  'hurt', 'harm', 'danger', 'afraid', 'scared', 'fear', 'terrified', 'trapped',
  'escape', 'help', 'emergency', 'urgent', 'immediate', 'now', 'today'
];

const MEDIUM_RISK_KEYWORDS = [
  'abuse', 'violence', 'assault', 'attack', 'hit', 'beat', 'punch', 'kick',
  'control', 'isolate', 'threaten', 'intimidate', 'harass', 'stalking'
];

export async function analyzeReportWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
  try {
    // This is a simplified AI analysis
    // In production, integrate with:
    // - OpenAI GPT-4 for text analysis
    // - Google Vision API for image analysis
    // - Custom ML models for risk assessment

    let riskScore = 0;
    const keywords: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' | 'distressed' = 'neutral';
    let explanation = '';

    const text = (request.text || '').toLowerCase();

    // Analyze text for keywords
    HIGH_RISK_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        riskScore += 15;
        keywords.push(keyword);
        sentiment = 'distressed';
      }
    });

    MEDIUM_RISK_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        riskScore += 8;
        keywords.push(keyword);
        if (sentiment === 'neutral') sentiment = 'negative';
      }
    });

    // Analyze report type
    if (request.reportType === 'abuse') {
      riskScore += 20;
    } else if (request.reportType === 'threat') {
      riskScore += 25;
    } else if (request.reportType === 'incident') {
      riskScore += 15;
    }

    // Analyze images if provided (placeholder)
    if (request.images && request.images.length > 0) {
      riskScore += 10;
      // In production, use image analysis API
      // const imageAnalysis = await analyzeImages(request.images);
      // riskScore += imageAnalysis.riskScore;
    }

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 80) {
      riskLevel = 'critical';
      explanation = 'Critical risk detected. Immediate intervention recommended.';
    } else if (riskScore >= 60) {
      riskLevel = 'high';
      explanation = 'High risk detected. Urgent attention required.';
    } else if (riskScore >= 40) {
      riskLevel = 'medium';
      explanation = 'Medium risk detected. Review and follow-up recommended.';
    } else {
      riskLevel = 'low';
      explanation = 'Low risk detected. Standard processing.';
    }

    // Generate explanation
    if (keywords.length > 0) {
      explanation += ` Detected keywords: ${keywords.slice(0, 5).join(', ')}.`;
    }

    // In production, use actual AI service:
    // try {
    //   const response = await axios.post(process.env.AI_SERVICE_URL, {
    //     text: request.text,
    //     images: request.images,
    //     reportType: request.reportType
    //   });
    //   return response.data;
    // } catch (error) {
    //   logger.error('AI service error:', error);
    //   // Fall back to basic analysis
    // }

    return {
      riskScore,
      riskLevel,
      keywords: [...new Set(keywords)], // Remove duplicates
      sentiment,
      explanation
    };
  } catch (error) {
    logger.error('AI analysis error:', error);
    // Return default analysis on error
    return {
      riskScore: 50,
      riskLevel: 'medium',
      keywords: [],
      sentiment: 'neutral',
      explanation: 'Analysis unavailable. Manual review recommended.'
    };
  }
}

async function analyzeImages(images: string[]): Promise<{ riskScore: number }> {
  // Placeholder for image analysis
  // In production, use Google Vision API or similar
  return { riskScore: 0 };
}

