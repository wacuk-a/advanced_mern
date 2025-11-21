export declare const userController: {
    generateAnonymousToken(params: any): Promise<{
        success: boolean;
        token: string;
        userId: import("mongoose").Types.ObjectId;
        isAnonymous: boolean;
    }>;
    updateEmergencyContacts(params: any): Promise<{
        success: boolean;
        emergencyContacts: any;
    }>;
    updateSafetyPlan(params: any): Promise<{
        success: boolean;
        safetyPlan: any;
    }>;
};
//# sourceMappingURL=userController.d.ts.map