export type FetchErrorTypeName = "network" | "unknown" | "access";
export type FetchErrorDetails = Response | Error;

export class FetchError extends Error {
  type: FetchErrorTypeName;
  details?: FetchErrorDetails;

  constructor(
    type: FetchErrorTypeName,
    message: string,
    details?: FetchErrorDetails
  ) {
    super(message);
    this.type = type;
    this.details = details;
  }
}
