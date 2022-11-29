var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from '@upstash/qstash';
export class Spera {
    constructor(params) {
        this.url = params.url;
        this.qstash = new Client({
            token: params.qStashToken,
        });
        this.functions = params.functions;
    }
    send(name, 
    // @ts-expect-error
    payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env['NODE_ENV'] === 'development') {
                return fetch(this.url, {
                    method: 'POST',
                    body: JSON.stringify({ name, payload }),
                });
            }
            return this.qstash.publishJSON(Object.assign({ url: this.url, body: { name, payload } }, options));
        });
    }
}
