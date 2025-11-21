interface SupportServices {
    food: boolean;
    medical: boolean;
    legal: boolean;
    counseling: boolean;
    childcare: boolean;
    security: boolean;
}
export declare const safehouseBookingWorkflow: {
    createReservation(params: any): Promise<{
        bookingId: string;
        safehouseId: any;
        userId: any;
        checkInDate: Date;
        status: "pending";
        specialNeeds: any;
        createdAt: Date;
    }>;
    processIntake(bookingId: string, intakeData: any): Promise<{
        success: boolean;
        bookingId: string;
        intakeCompleted: boolean;
        needsAssessment: any;
    }>;
    arrangeSecureTransportation(bookingId: string, pickupLocation: any): Promise<{
        bookingId: string;
        pickupLocation: any;
        scheduledTime: Date;
        status: "scheduled";
        driverContact: string;
        estimatedDuration: string;
    }>;
    performSafetyAssessment(userId: string, safehouseId: string): Promise<{
        userId: string;
        safehouseId: string;
        safetyScore: number;
        isCompatible: boolean;
        recommendations: string[];
        assessedAt: Date;
    }>;
    activateSupportServices(bookingId: string, services: string[]): Promise<{
        bookingId: string;
        supportServices: SupportServices;
    }>;
    completeCheckIn(bookingId: string, checkInData: any): Promise<any>;
    processCheckOut(bookingId: string, feedback: any): Promise<{
        bookingId: string;
        status: "checked_out";
        checkOutTime: Date;
        durationStay: number;
        followUpRequired: any;
        nextSteps: any;
    }>;
};
export {};
//# sourceMappingURL=safehouseBookingWorkflow.d.ts.map