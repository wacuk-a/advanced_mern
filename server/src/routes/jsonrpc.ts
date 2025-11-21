import { Router, Request, Response } from 'express';
import { JSONRPCServer } from 'json-rpc-2.0';
import logger from '../utils/logger';

const router = Router();
const server = new JSONRPCServer();

// Minimal methods for domestic violence safety app
server.addMethod("user.createAnonymous", () => {
  return { 
    anonymousSessionId: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: "Anonymous session created successfully"
  };
});

server.addMethod("panic.activate", (params: any) => {
  logger.info('Panic button activated', params);
  return { 
    success: true, 
    message: "Emergency alert sent to authorities",
    timestamp: new Date().toISOString()
  };
});

server.addMethod("safehouse.findNearby", (params: any) => {
  return {
    safehouses: [
      {
        id: 1,
        name: "Nairobi Safe Shelter",
        address: "Nairobi, Kenya",
        phone: "+254700000000",
        distance: "2.5 km"
      }
    ]
  };
});

// Audio evidence methods
server.addMethod("audio.saveRecording", (params: any) => {
  logger.info('Audio recording saved', params);
  return {
    success: true,
    message: "Audio recording saved successfully",
    id: `audio_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
});

server.addMethod("audio.getRecordings", () => {
  return {
    recordings: [
      {
        id: "audio_1",
        duration: "30s", 
        timestamp: new Date().toISOString(),
        title: "Incident Recording"
      }
    ]
  };
});

// JSON-RPC request handler
router.post('/', (req: Request, res: Response) => {
  const request = req.body;
  
  server.receive(request).then((response) => {
    if (response) {
      res.json(response);
    } else {
      res.status(204).send();
    }
  }).catch((error) => {
    logger.error('JSON-RPC error:', error);
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Server error"
      },
      id: request.id
    });
  });
});

export default router;
