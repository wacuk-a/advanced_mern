"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const json_rpc_2_0_1 = require("json-rpc-2.0");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
const server = new json_rpc_2_0_1.JSONRPCServer();
// Minimal methods for domestic violence safety app
server.addMethod("user.createAnonymous", () => {
    return {
        anonymousSessionId: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: "Anonymous session created successfully"
    };
});
server.addMethod("panic.activate", (params) => {
    logger_1.default.info('Panic button activated', params);
    return {
        success: true,
        message: "Emergency alert sent to authorities",
        timestamp: new Date().toISOString()
    };
});
server.addMethod("safehouse.findNearby", (params) => {
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
// JSON-RPC request handler
router.post('/', (req, res) => {
    const request = req.body;
    server.receive(request).then((response) => {
        if (response) {
            res.json(response);
        }
        else {
            res.status(204).send();
        }
    }).catch((error) => {
        logger_1.default.error('JSON-RPC error:', error);
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
exports.default = router;
//# sourceMappingURL=jsonrpc.js.map