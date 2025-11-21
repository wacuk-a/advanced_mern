export declare const reportingController: {
    submit(params: any): Promise<{
        success: boolean;
        reportId: string;
        status: "submitted";
        riskLevel: "medium";
        priority: "medium";
    }>;
    analyze(params: any): Promise<{
        success: boolean;
        analysis: {
            riskScore: number;
            riskLevel: "medium";
            keywords: string[];
            sentiment: "negative";
            explanation: string;
            analyzedAt: Date;
        };
    }>;
    getRiskAssessment(params: any): Promise<{
        reportId: any;
        riskScore: number;
        riskLevel: "high";
        keywords: string[];
        sentiment: "distressed";
        explanation: string;
        analyzedAt: Date;
    }>;
    getReports(params: any): Promise<{
        reports: any[];
        total: number;
        limit: any;
        offset: any;
    }>;
};
//# sourceMappingURL=reportingController.d.ts.map