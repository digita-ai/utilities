import { JWK, JWT } from '@solid/jose';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DGTErrorArgument } from '../../errors/models/dgt-error-argument.model';

const DEFAULT_MAX_AGE = 3600; // Default token expiration, in seconds

export class DGTSourceSolidToken extends JWT {

    static issueFor(resourceServerUri: string, sessionKey: string, clientId: string, idToken: string): Observable<any> {
        if (resourceServerUri == null) {
            throw new DGTErrorArgument('resourceServerUri is undefined', { resourceServerUri });
        }
        if (sessionKey == null) {
            throw new DGTErrorArgument('sessionKey is undefined', { sessionKey, clientId, resourceServerUri });
        }
        if (clientId == null) {
            throw new DGTErrorArgument('clientId is undefined', { clientId });
        }
        if (idToken == null) {
            throw new DGTErrorArgument('idToken is undefined', { idToken });
        }
        const jwk = JSON.parse(sessionKey);

        let aud = '';
        try {
            aud = new URL(resourceServerUri).origin;
        } catch (e) {
            throw new DGTErrorArgument(DGTSourceSolidToken.name, `Error while parsing uri: ${resourceServerUri}`, e);
        }

        return from(JWK.importKey(jwk))
            .pipe(
                map(importedSessionJwk => {
                    const options = {
                        aud,
                        key: importedSessionJwk,
                        iss: clientId,
                        idToken,
                    };

                    return DGTSourceSolidToken.issue(options);
                }),
                switchMap((jwt: any) => from(jwt.encode())),
            );
    }

    static issue(options) {
        const { aud, key, iss } = options;

        const alg = key.alg;
        const iat = options.iat || Math.floor(Date.now() / 1000);
        const max = options.max || DEFAULT_MAX_AGE;

        const exp = iat + max; // token expiration

        const header = { alg };
        const payload = { iss, aud, exp, iat, id_token: options.idToken, token_type: 'pop' };

        return new JWT({ header, payload, key: key.cryptoKey }, { filter: false });
        // return new DGTSourceSolidToken({ header, payload, key: key.cryptoKey }, { filter: false }); // cannot invoke without new on jwt
    }

    private static decodeToken(accessToken: string): any {
        if (!accessToken) {
            throw new DGTErrorArgument('AccessToken should be set', accessToken);
        }
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const split = atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
        const jsonPayload = decodeURIComponent(split);
        return JSON.parse(jsonPayload);
    }

    static isExpired(accessToken: string): boolean {
        const json = DGTSourceSolidToken.decodeToken(accessToken);
        let expired = false;
        if (json.exp) {
            const unixNow = Math.round((new Date()).getTime() / 1000);
            expired = json.exp < unixNow;
        }
        return expired;
    }

    constructor(data: any, other: any) {
        super(data, other);
    }
}
