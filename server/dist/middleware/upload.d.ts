export declare const uploadSingle: (fieldName: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMultiple: (fieldName: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const validateFile: (file: Express.Multer.File) => {
    isValid: boolean;
    error?: string;
};
export declare const generateFileUrl: (filename: string) => string;
export declare const getFilePath: (filename: string) => string;
export declare const deleteFile: (filename: string) => Promise<boolean>;
//# sourceMappingURL=upload.d.ts.map