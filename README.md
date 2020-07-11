#### Environment Variables
```
# Required
DATABASE_URL=<connection string>
ACCESS_TOKEN_SECRET_KEY=<secret>
REFRESH_TOKEN_SECRET_KEY=<secret>
COOKIE_SECRET_KEY=<secret>

# Optional
DATABASE_DEBUG=<true | false>
ACCESS_TOKEN_EXPIRATION=<JWT expiration. EG: 15m>
REFRESH_TOKEN_EXPIRATION=<JWT expiration. EG: 7d>
COOKIE_MAX_AGE=<amount in seconds>
```
**NOTE:** Make `COOKIE_MAX_AGE` and `REFRESH_TOKEN_EXPIRATION` the same to save 1 round-trip to the server. 
