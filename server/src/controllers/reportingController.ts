import { Report } from '../models/Report';
import { logger } from '../utils/logger';
import { analyzeReportWithAI } from '../services/aiService';

interface ReportingContext {
  user?: any;
  anonymousSessionId?: string;
}

export const reportingController = {
  submit: async (params: any, context: ReportingContext) => {
    try {
      const { reportType, text, images, audio, video, location, incidentDate, riskAssessment } = params;
      const { user, anonymousSessionId } = context;

      // Create report
      const report = new Report({
        userId: user?._id,
        anonymousSessionId: anonymousSessionId || user?.anonymousSessionId,
        reportType,
        content: {
          text: text || '',
          images: images || [],
          audio: audio,
          video: video
        },
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          timestamp: new Date()
        } : undefined,
        incidentDate: incidentDate ? new Date(incidentDate) : undefined,
        status: 'submitted',
        priority: 'medium'
      });

      // If risk assessment provided, use it
      if (riskAssessment) {
        report.aiAnalysis = {
          riskScore: riskAssessment.riskScore,
          riskLevel: riskAssessment.riskLevel,
          keywords: riskAssessment.keywords || [],
          sentiment: riskAssessment.sentiment || 'neutral',
          explanation: riskAssessment.explanation || '',
          analyzedAt: new Date()
        };

        if (riskAssessment.riskLevel === 'critical') {
          report.priority = 'urgent';
        } else if (riskAssessment.riskLevel === 'high') {
          report.priority = 'high';
        }
      }

      await report.save();

      // Perform AI analysis if not already provided
      if (!report.aiAnalysis) {
        try {
          const aiAnalysis = await analyzeReportWithAI({
            text: report.content.text,
            images: report.content.images,
            reportType
          });

          report.aiAnalysis = {
            riskScore: aiAnalysis.riskScore,
            riskLevel: aiAnalysis.riskLevel,
            keywords: aiAnalysis.keywords,
            sentiment: aiAnalysis.sentiment,
            explanation: aiAnalysis.explanation,
            analyzedAt: new Date()
          };

          // Set priority based on risk level
          if (aiAnalysis.riskLevel === 'critical') {
            report.priority = 'urgent';
          } else if (aiAnalysis.riskLevel === 'high') {
            report.priority = 'high';
          }
        } catch (error) {
          logger.error('AI analysis failed:', error);
          // Continue without AI analysis
        }
      }

      await report.save();

      return {
        success: true,
        reportId: report._id,
        status: report.status,
        riskLevel: report.aiAnalysis?.riskLevel,
        priority: report.priority
      };
    } catch (error: any) {
      logger.error('Submit report error:', error);
      throw new Error(`Failed to submit report: ${error.message}`);
    }
  },

  analyze: async (params: any, context: ReportingContext) => {
    try {
      const { reportId, text, images, reportType } = params;
      const { user, anonymousSessionId } = context;

      // If reportId provided, analyze existing report
      if (reportId) {
        const report = await Report.findOne({
          _id: reportId,
          $or: [
            { userId: user?._id },
            { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
          ]
        });

        if (!report) {
          throw new Error('Report not found');
        }

        // Perform AI analysis
        const aiAnalysis = await analyzeReportWithAI({
          text: report.content.text,
          images: report.content.images,
          reportType: report.reportType
        });

        report.aiAnalysis = {
          riskScore: aiAnalysis.riskScore,
          riskLevel: aiAnalysis.riskLevel,
          keywords: aiAnalysis.keywords,
          sentiment: aiAnalysis.sentiment,
          explanation: aiAnalysis.explanation,
          analyzedAt: new Date()
        };

        // Update priority based on risk level
        if (aiAnalysis.riskLevel === 'critical') {
          report.priority = 'urgent';
        } else if (aiAnalysis.riskLevel === 'high') {
          report.priority = 'high';
        }

        await report.save();

        return {
          success: true,
          analysis: report.aiAnalysis
        };
      } else {
        // Analyze provided text/images directly (for pre-submission analysis)
        const aiAnalysis = await analyzeReportWithAI({
          text: text || '',
          images: images || [],
          reportType: reportType || 'other'
        });

        return {
          success: true,
          riskScore: aiAnalysis.riskScore,
          riskLevel: aiAnalysis.riskLevel,
          keywords: aiAnalysis.keywords,
          sentiment: aiAnalysis.sentiment,
          explanation: aiAnalysis.explanation
        };
      }
    } catch (error: any) {
      logger.error('Analyze report error:', error);
      throw new Error(`Failed to analyze report: ${error.message}`);
    }
  },

  getRiskAssessment: async (params: any, context: ReportingContext) => {
    try {
      const { reportId } = params;
      const { user, anonymousSessionId } = context;

      const report = await Report.findOne({
        _id: reportId,
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      });

      if (!report) {
        throw new Error('Report not found');
      }

      if (!report.aiAnalysis) {
        throw new Error('Report has not been analyzed yet');
      }

      return {
        reportId: report._id,
        riskScore: report.aiAnalysis.riskScore,
        riskLevel: report.aiAnalysis.riskLevel,
        keywords: report.aiAnalysis.keywords,
        sentiment: report.aiAnalysis.sentiment,
        explanation: report.aiAnalysis.explanation,
        analyzedAt: report.aiAnalysis.analyzedAt
      };
    } catch (error: any) {
      logger.error('Get risk assessment error:', error);
      throw new Error(`Failed to get risk assessment: ${error.message}`);
    }
  },

  getReports: async (params: any, context: ReportingContext) => {
    try {
      const { status, priority, limit = 50, offset = 0 } = params;
      const { user, anonymousSessionId } = context;

      // Build query
      const query: any = {
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      };

      if (status) query.status = status;
      if (priority) query.priority = priority;

      const reports = await Report.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .select('-content.images -content.audio -content.video'); // Exclude large files

      const total = await Report.countDocuments(query);

      return {
        reports: reports.map(r => ({
          id: r._id,
          reportType: r.reportType,
          status: r.status,
          priority: r.priority,
          riskLevel: r.aiAnalysis?.riskLevel,
          riskScore: r.aiAnalysis?.riskScore,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt
        })),
        total,
        limit,
        offset
      };
    } catch (error: any) {
      logger.error('Get reports error:', error);
      throw new Error(`Failed to get reports: ${error.message}`);
    }
  }
};

