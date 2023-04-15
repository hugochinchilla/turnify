export class ErrorResponse extends Error {
  readonly response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}
