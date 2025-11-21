export declare const safehouseController: {
    list(params: any): Promise<{
        safehouses: {
            id: string;
            name: string;
            address: {
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
            };
            coordinates: {
                latitude: number;
                longitude: number;
            };
            capacity: number;
            availableBeds: number;
            contact: string;
            services: string[];
            distance: number;
        }[];
    }>;
    getAvailability(params: any): Promise<{
        safehouseId: any;
        totalBeds: number;
        availableBeds: number;
        reservedBeds: number;
        occupiedBeds: number;
        isAvailable: boolean;
        nextAvailableDate: undefined;
    }>;
    book(params: any): Promise<{
        success: boolean;
        bookingId: string;
        status: "pending";
        workflowStep: number;
        nextSteps: string[];
    }>;
    checkSafetyMatch(params: any): Promise<{
        isMatch: boolean;
        safetyScore: number;
        reasons: string[];
    }>;
    arrangeTransportation(params: any): Promise<{
        success: boolean;
        bookingId: any;
        transportationDetails: {
            pickupLocation: any;
            scheduledTime: Date;
            status: "pending";
            distance: number;
        };
    }>;
    digitalCheckIn(params: any): Promise<{
        success: boolean;
        bookingId: any;
        status: "checked_in";
        needsAssessment: {
            medicalNeeds: never[];
            legalNeeds: never[];
            counselingNeeds: string[];
            children: number;
            pets: boolean;
            safetyConcerns: string[];
        };
        workflowStep: number;
    }>;
    activateServices(params: any): Promise<{
        success: boolean;
        bookingId: any;
        supportServices: {
            food: boolean;
            medical: boolean;
            legal: boolean;
            counseling: boolean;
            childcare: boolean;
            security: boolean;
        };
        workflowStep: number;
    }>;
    checkIn(params: any): Promise<{
        success: boolean;
        bookingId: any;
        status: "checked_in";
        checkedInAt: Date;
    }>;
    checkOut(params: any): Promise<{
        success: boolean;
        bookingId: any;
        status: "checked_out";
        checkedOutAt: Date;
    }>;
    getResources(params: any): Promise<{
        safehouseId: any;
        resources: {
            food: {
                available: boolean;
                capacity: number;
                currentStock: number;
            };
            medical: {
                available: boolean;
                staffOnSite: boolean;
                equipment: string[];
            };
            legal: {
                available: boolean;
                services: string[];
            };
            counseling: {
                available: boolean;
                types: string[];
            };
            security: {
                available: boolean;
                features: string[];
            };
        };
    }>;
};
//# sourceMappingURL=safehouseController.d.ts.map