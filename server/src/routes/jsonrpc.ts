import { Router, Request, Response } from 'express';
import { JSONRPCServer } from 'json-rpc-2.0';
import logger from '../utils/logger';

// Import controllers
import { panicButtonController } from '../controllers/panicButtonController';
import { safehouseController } from '../controllers/safehouseController';
import { reportingController } from '../controllers/reportingController';
import { counselorController } from '../controllers/counselorController';
import { communicationController } from '../controllers/communicationController';
import { userController } from '../controllers/userController';

const router = Router();
const server = new JSONRPCServer();

// Add methods without complex context typing
server.addMethod("panic.activate", (params: any) => 
  panicButtonController.activate(params));

server.addMethod("panic.deactivate", (params: any) => 
  panicButtonController.deactivate(params));

server.addMethod("panic.getStatus", (params: any) => 
  panicButtonController.getStatus(params));

server.addMethod("panic.recordEvidence", (params: any) => 
  panicButtonController.recordEvidence(params));

server.addMethod("panic.updateLocation", (params: any) => 
  panicButtonController.updateLocation(params));

// Safehouse methods
server.addMethod("safehouse.list", (params: any) => 
  safehouseController.list(params));

server.addMethod("safehouse.getAvailability", (params: any) => 
  safehouseController.getAvailability(params));

server.addMethod("safehouse.book", (params: any) => 
  safehouseController.book(params));

server.addMethod("safehouse.checkSafetyMatch", (params: any) => 
  safehouseController.checkSafetyMatch(params));

server.addMethod("safehouse.arrangeTransportation", (params: any) => 
  safehouseController.arrangeTransportation(params));

server.addMethod("safehouse.digitalCheckIn", (params: any) => 
  safehouseController.digitalCheckIn(params));

server.addMethod("safehouse.activateServices", (params: any) => 
  safehouseController.activateServices(params));

server.addMethod("safehouse.checkIn", (params: any) => 
  safehouseController.checkIn(params));

server.addMethod("safehouse.checkOut", (params: any) => 
  safehouseController.checkOut(params));

server.addMethod("safehouse.getResources", (params: any) => 
  safehouseController.getResources(params));

// Reporting methods
server.addMethod("reporting.submit", (params: any) => 
  reportingController.submit(params));

server.addMethod("reporting.analyze", (params: any) => 
  reportingController.analyze(params));

server.addMethod("reporting.getRiskAssessment", (params: any) => 
  reportingController.getRiskAssessment(params));

server.addMethod("reporting.getReports", (params: any) => 
  reportingController.getReports(params));

// Counselor methods
server.addMethod("counselor.getDashboard", (params: any) => 
  counselorController.getDashboard(params));

server.addMethod("counselor.getCases", (params: any) => 
  counselorController.getCases(params));

server.addMethod("counselor.updateCase", (params: any) => 
  counselorController.updateCase(params));

server.addMethod("counselor.getPanicAlerts", (params: any) => 
  counselorController.getPanicAlerts(params));

// Communication methods
server.addMethod("communication.sendMessage", (params: any) => 
  communicationController.sendMessage(params));

server.addMethod("communication.getMessages", (params: any) => 
  communicationController.getMessages(params));

server.addMethod("communication.shareLocation", (params: any) => 
  communicationController.shareLocation(params));

server.addMethod("communication.initiateVideo", (params: any) => 
  communicationController.initiateVideo(params));

// User methods
server.addMethod("user.generateAnonymousToken", (params: any) => 
  userController.generateAnonymousToken(params));

server.addMethod("user.updateEmergencyContacts", (params: any) => 
  userController.updateEmergencyContacts(params));

server.addMethod("user.updateSafetyPlan", (params: any) => 
  userController.updateSafetyPlan(params));

// JSON-RPC endpoint
router.post('/', async (req: Request, res: Response) => {
  try {
    const jsonRPCRequest = req.body;

    logger.info('JSON-RPC request received', { 
      method: jsonRPCRequest.method,
      id: jsonRPCRequest.id 
    });

    const response = await server.receive(jsonRPCRequest);

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
      id: null
    });
  }
});

// Batch request support
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const requests = req.body;

    logger.info('JSON-RPC batch request received', { 
      count: requests.length 
    });

    const responses = await Promise.all(
      requests.map((request: any) => server.receive(request))
    );

    res.json(responses.filter(response => response !== null));
  } catch (error: any) {
    logger.error('JSON-RPC batch error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id: null
    });
  }
});

export default router;
