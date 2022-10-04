export class EsAPIError extends Error {
    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, EsAPIError.prototype);
    }
}