import { Report } from '../models/Report';
import { PanicEvent } from '../models/PanicEvent';
import { Safehouse } from '../models/Safehouse';
import { SafehouseBooking } from '../models/SafehouseBooking';
import { logger } from '../utils/logger';

interface CounselorContext {
  user?: any;
}

export const counselorController = {
  getDashboard: async (params: any, context: CounselorContext) => {
    try {
      const { user } = context;

      if (!user || (user.role !== 'counselor' && user.role !== 'admin')) {
        throw new Error('Unauthorized: Counselor access required');
      }

      // Get active panic events
      const activePanicEvents = await PanicEvent.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(10);

      // Get urgent reports
      const urgentReports = await Report.find({
        status: { $in: ['submitted', 'under_review', 'assigned'] },
        priority: { $in: ['high', 'urgent'] }
      })
        .sort({ createdAt: -1 })
        .limit(10);

      // Get assigned cases
      const assignedCases = await Report.find({
        assignedTo: user._id,
        status: { $in: ['assigned', 'in_progress'] }
      })
        .sort({ createdAt: -1 });

      // Get safehouse availability
      const safehouses = await Safehouse.find({
        ngoId: user.ngoId
      });

      const totalBeds = safehouses.reduce((sum, sh) => sum + sh.capacity.totalBeds, 0);
      const availableBeds = safehouses.reduce((sum, sh) => sum + sh.capacity.availableBeds, 0);
      const occupiedBeds = safehouses.reduce((sum, sh) => sum + sh.capacity.occupiedBeds, 0);

      // Get pending bookings
      const pendingBookings = await SafehouseBooking.find({
        status: 'pending'
      })
        .populate('safehouseId', 'name')
        .sort({ createdAt: -1 })
        .limit(10);

      return {
        activePanicEvents: activePanicEvents.map(e => ({
          id: e._id,
          triggerType: e.triggerType,
          location: e.location,
          riskLevel: e.riskLevel,
          createdAt: e.createdAt
        })),
        urgentReports: urgentReports.map(r => ({
          id: r._id,
          reportType: r.reportType,
          priority: r.priority,
          riskLevel: r.aiAnalysis?.riskLevel,
          createdAt: r.createdAt
        })),
        assignedCases: assignedCases.map(c => ({
          id: c._id,
          reportType: c.reportType,
          status: c.status,
          priority: c.priority,
          createdAt: c.createdAt
        })),
        safehouseStats: {
          totalBeds,
          availableBeds,
          occupiedBeds,
          utilizationRate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0
        },
        pendingBookings: pendingBookings.map(b => ({
          id: b._id,
          safehouseName: (b.safehouseId as any).name,
          requestedCheckIn: b.requestedCheckIn,
          numberOfGuests: b.numberOfGuests,
          createdAt: b.createdAt
        }))
      };
    } catch (error: any) {
      logger.error('Get dashboard error:', error);
      throw new Error(`Failed to get dashboard: ${error.message}`);
    }
  },

  getCases: async (params: any, context: CounselorContext) => {
    try {
      const { user } = context;
      const { status, priority, limit = 50, offset = 0 } = params;

      if (!user || (user.role !== 'counselor' && user.role !== 'admin')) {
        throw new Error('Unauthorized: Counselor access required');
      }

      const query: any = {};

      if (status) query.status = status;
      if (priority) query.priority = priority;

      // If not admin, show only assigned cases or unassigned cases
      if (user.role === 'counselor') {
        query.$or = [
          { assignedTo: user._id },
          { assignedTo: null, status: { $in: ['submitted', 'under_review'] } }
        ];
      }

      const cases = await Report.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .populate('assignedTo', 'email role');

      const total = await Report.countDocuments(query);

      return {
        cases: cases.map(c => ({
          id: c._id,
          reportType: c.reportType,
          status: c.status,
          priority: c.priority,
          riskLevel: c.aiAnalysis?.riskLevel,
          riskScore: c.aiAnalysis?.riskScore,
          assignedTo: c.assignedTo ? {
            id: (c.assignedTo as any)._id,
            email: (c.assignedTo as any).email,
            role: (c.assignedTo as any).role
          } : null,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        })),
        total,
        limit,
        offset
      };
    } catch (error: any) {
      logger.error('Get cases error:', error);
      throw new Error(`Failed to get cases: ${error.message}`);
    }
  },

  updateCase: async (params: any, context: CounselorContext) => {
    try {
      const { caseId, status, assignedTo, priority, notes } = params;
      const { user } = context;

      if (!user || (user.role !== 'counselor' && user.role !== 'admin')) {
        throw new Error('Unauthorized: Counselor access required');
      }

      const report = await Report.findById(caseId);
      if (!report) {
        throw new Error('Case not found');
      }

      if (status) report.status = status;
      if (assignedTo) report.assignedTo = assignedTo;
      if (priority) report.priority = priority;
      if (notes) {
        report.notes.push({
          addedBy: user._id,
          content: notes,
          timestamp: new Date()
        });
      }

      await report.save();

      return {
        success: true,
        caseId: report._id,
        status: report.status,
        assignedTo: report.assignedTo,
        priority: report.priority
      };
    } catch (error: any) {
      logger.error('Update case error:', error);
      throw new Error(`Failed to update case: ${error.message}`);
    }
  },

  getPanicAlerts: async (params: any, context: CounselorContext) => {
    try {
      const { user } = context;
      const { status, limit = 50, offset = 0 } = params;

      if (!user || (user.role !== 'counselor' && user.role !== 'admin')) {
        throw new Error('Unauthorized: Counselor access required');
      }

      const query: any = {};
      if (status) query.status = status;

      const panicEvents = await PanicEvent.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      const total = await PanicEvent.countDocuments(query);

      return {
        alerts: panicEvents.map(e => ({
          id: e._id,
          triggerType: e.triggerType,
          location: e.location,
          locationHistory: e.locationHistory,
          riskLevel: e.riskLevel,
          status: e.status,
          emergencyServicesContacted: e.emergencyServicesContacted,
          createdAt: e.createdAt,
          resolvedAt: e.resolvedAt
        })),
        total,
        limit,
        offset
      };
    } catch (error: any) {
      logger.error('Get panic alerts error:', error);
      throw new Error(`Failed to get panic alerts: ${error.message}`);
    }
  }
};

