export interface IBroker {
  getAuthorizeURL: (userId?: number) => Promise<string>;
  authorize: (oathVerifier: string, oathToken: string) => Promise<boolean>;
}
