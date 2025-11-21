import winston from 'winston';
declare const logger: winston.Logger;
export default logger;
export declare const requestLogger: (req: any, res: any, next: any) => void;
export declare const performanceMonitor: (operation: string, fn: Function) => any;
export declare const dbQueryLogger: (query: string, parameters: any[] | undefined, duration: number) => void;
//# sourceMappingURL=logger.d.ts.map