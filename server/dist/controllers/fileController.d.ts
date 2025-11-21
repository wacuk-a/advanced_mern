import { Request, Response, NextFunction } from 'express';
export declare const uploadFile: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const uploadMultipleFiles: ((req: Request, res: Response, next: NextFunction) => void)[];
export declare const getFiles: (req: Request, res: Response, next: NextFunction) => void;
export declare const getFile: (req: Request, res: Response, next: NextFunction) => void;
export declare const serveFile: (req: Request, res: Response, next: NextFunction) => void;
export declare const deleteFile: (req: Request, res: Response, next: NextFunction) => void;
export declare const updateFile: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=fileController.d.ts.map