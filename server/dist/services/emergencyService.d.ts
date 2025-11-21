export declare const emergencyService: {
    notifyEmergencyContacts(contacts: any[], message: string, location: any): Promise<{
        success: boolean;
        notified: number;
    }>;
    contactEmergencyServices(location: any, details: string): Promise<{
        success: boolean;
        message: string;
        timestamp: Date;
    }>;
    calculateRiskLevel(factors: any): Promise<string>;
};
//# sourceMappingURL=emergencyService.d.ts.map