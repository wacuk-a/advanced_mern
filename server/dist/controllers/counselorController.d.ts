export declare const counselorController: {
    getDashboard(params: any): Promise<{
        activePanicEvents: any[];
        urgentReports: any[];
        assignedCases: any[];
        safehouseOccupancy: number;
    }>;
    getCases(params: any): Promise<{
        cases: any[];
        total: number;
        limit: any;
        offset: any;
    }>;
    updateCase(params: any): Promise<{
        success: boolean;
        caseId: any;
        status: any;
        assignedTo: any;
        priority: any;
    }>;
    getPanicAlerts(params: any): Promise<{
        alerts: any[];
        total: number;
        limit: any;
        offset: any;
    }>;
};
//# sourceMappingURL=counselorController.d.ts.map