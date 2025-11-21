export declare const communicationController: {
    sendMessage(params: any): Promise<{
        success: boolean;
        messageId: string;
        conversationId: any;
        timestamp: Date;
    }>;
    getMessages(params: any): Promise<{
        messages: any[];
        total: number;
    }>;
    shareLocation(params: any): Promise<{
        success: boolean;
        messageId: string;
        location: {
            latitude: any;
            longitude: any;
            address: any;
            timestamp: Date;
        };
    }>;
    initiateVideo(params: any): Promise<{
        success: boolean;
        sessionId: string;
        from: any;
    }>;
};
//# sourceMappingURL=communicationController.d.ts.map