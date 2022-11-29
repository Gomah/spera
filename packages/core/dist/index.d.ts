import { PublishJsonRequest } from '@upstash/qstash';
export interface SperaParams<FnType> {
    /** API Endpoint url, e.g: /api/queue */
    url: string;
    /** qStash token */
    qStashToken: string;
    /** Your "functions" object */
    functions: FnType;
}
export declare class Spera<FnType> {
    private qstash;
    url: string;
    functions: FnType;
    constructor(params: SperaParams<FnType>);
    send<T extends keyof typeof this.functions>(name: T, payload: Parameters<FnType[T]>[0], options?: Omit<PublishJsonRequest, 'body'>): Promise<Response | {
        messageId: string;
    }>;
}
