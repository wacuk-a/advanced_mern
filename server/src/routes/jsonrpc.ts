import { Router, Request, Response } from 'express';
import { JSONRPCServer, JSONRPCRequest } from 'json-rpc-2.0';
import { panicButtonController } from '../controllers/panicButtonController';
import { safehouseController } from '../controllers/safehouseController';
import { reportingController } from '../controllers/reportingController';
import { counselorController } from '../controllers/counselorController';
import { communicationController } from '../controllers/communicationController';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
const server = new JSONRPCServer();

// Register JSON-RPC methods
server.addMethod('panic.activate', panicButtonController.activate);
server.addMethod('panic.deactivate', panicButtonController.deactivate);
server.addMethod('panic.getStatus', panicButtonController.getStatus);
server.addMethod('panic.recordEvidence', panicButtonController.recordEvidence);
server.addMethod('panic.updateLocation', panicButtonController.updateLocation);

server.addMethod('safehouse.list', safehouseController.list);
server.addMethod('safehouse.getAvailability', safehouseController.getAvailability);
server.addMethod('safehouse.book', safehouseController.book);
server.addMethod('safehouse.checkSafetyMatch', safehouseController.checkSafetyMatch);
server.addMethod('safehouse.arrangeTransportation', safehouseController.arrangeTransportation);
server.addMethod('safehouse.digitalCheckIn', safehouseController.digitalCheckIn);
server.addMethod('safehouse.activateServices', safehouseController.activateServices);
server.addMethod('safehouse.checkIn', safehouseController.checkIn);
server.addMethod('safehouse.checkOut', safehouseController.checkOut);
server.addMethod('safehouse.getResources', safehouseController.getResources);

server.addMethod('reporting.submit', reportingController.submit);
server.addMethod('reporting.analyze', reportingController.analyze);
server.addMethod('reporting.getRiskAssessment', reportingController.getRiskAssessment);
server.addMethod('reporting.getReports', reportingController.getReports);

server.addMethod('counselor.getDashboard', counselorController.getDashboard);
server.addMethod('counselor.getCases', counselorController.getCases);
server.addMethod('counselor.updateCase', counselorController.updateCase);
server.addMethod('counselor.getPanicAlerts', counselorController.getPanicAlerts);

server.addMethod('communication.sendMessage', communicationController.sendMessage);
server.addMethod('communication.getMessages', communicationController.getMessages);
server.addMethod('communication.shareLocation', communicationController.shareLocation);
server.addMethod('communication.initiateVideo', communicationController.initiateVideo);

server.addMethod('user.createAnonymous', userController.createAnonymous);
server.addMethod('user.updateProfile', userController.updateProfile);
server.addMethod('user.getProfile', userController.getProfile);
server.addMethod('user.emergencyWipe', userController.emergencyWipe);

// JSON-RPC request handler
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const jsonRPCRequest: JSONRPCRequest = req.body;
    
    // Add user context to request
    const context = {
      user: (req as any).user,
      anonymousSessionId: (req as any).anonymousSessionId,
      ip: req.ip,
      headers: req.headers
    };

    const response = await server.receive(jsonRPCRequest, context);
    
    if (response) {
      res.json(response);
    } else {
      res.status(204).send();
    }
  } catch (error: any) {
    logger.error('JSON-RPC error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id: req.body.id || null
    });
  }
});

// Batch request support
router.post('/batch', authenticate, async (req: Request, res: Response) => {
  try {
    const requests: JSONRPCRequest[] = req.body;
    const context = {
      user: (req as any).user,
      anonymousSessionId: (req as any).anonymousSessionId,
      ip: req.ip,
      headers: req.headers
    };

    const responses = await Promise.all(
      requests.map(request => server.receive(request, context))
    );

    res.json(responses.filter(r => r !== null));
  } catch (error: any) {
    logger.error('JSON-RPC batch error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    });
  }
});

export { router as jsonRpcRouter };

