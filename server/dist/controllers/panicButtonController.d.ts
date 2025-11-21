export declare const panicButtonController: {
    activate(params: any): Promise<{
        success: boolean;
        eventId: string;
        status: "active";
        countdownSeconds: number;
    }>;
    deactivate(params: any): Promise<{
        success: boolean;
        status: any;
    }>;
    getStatus(params: any): Promise<{
        eventId: string;
        status: "active";
        location: {
            latitude: number;
            longitude: number;
            timestamp: Date;
        };
        riskLevel: "high";
        emergencyServicesContacted: boolean;
        createdAt: Date;
    }>;
    recordEvidence(params: any): Promise<{
        success: boolean;
        eventId: any;
    }>;
    updateLocation(params: any): Promise<{
        success: boolean;
        location: any;
    }>;
};
//# sourceMappingURL=panicButtonController.d.ts.map