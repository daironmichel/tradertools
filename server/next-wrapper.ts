import Server from 'next/dist/next-server/server/next-server';
import Hapi from 'hapi';
import { UrlObject } from 'url';
import { ParsedUrlQuery } from 'querystring';

type Handler = Hapi.Lifecycle.Method | Hapi.HandlerDecorations | undefined;

const nextRouteHandler = (nextApp: Server): Handler => {
  const handler = nextApp.getRequestHandler();
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    // @ts-ignore
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

const nextDefaultHandler = (nextApp: Server): Handler => {
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    const { res, req } = raw;
    const { pathname, query } = url as UrlObject;
    const html = await nextApp.renderToHTML(req, res, pathname || '/', query as ParsedUrlQuery);
    return h.response(html || undefined).code(res.statusCode);
  };
};

const nextPathHandler = (nextApp: Server, pathName: string): Handler => {
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    // @ts-ignore
    const { query, params } = url;
    const html = await nextApp.renderToHTML(raw.req, raw.res, pathName, { ...query, ...params });
    return h.response(html || undefined).code(raw.res.statusCode);
  };
};

export { nextPathHandler, nextDefaultHandler, nextRouteHandler };
