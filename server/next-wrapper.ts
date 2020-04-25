import Server from 'next/dist/next-server/server/next-server';
import Hapi from 'hapi';
import { UrlObject } from 'url';
import { ParsedUrlQuery } from 'querystring';

type Handler = Hapi.Lifecycle.Method | Hapi.HandlerDecorations | undefined;

const nextHandlerWrapper = (app: Server): Handler => {
  const handler = app.getRequestHandler();
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    // @ts-ignore
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

const defaultHandlerWrapper = (app: Server): Handler => {
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    const { res, req } = raw;
    const { pathname, query } = url as UrlObject;
    const html = await app.renderToHTML(req, res, pathname || '/', query as ParsedUrlQuery);
    return h.response(html || undefined).code(res.statusCode);
  };
};

const pathWrapper = (app: Server, pathName: string): Handler => {
  return async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { raw, url } = request;
    // @ts-ignore
    const { query, params } = url;
    const html = await app.renderToHTML(raw.req, raw.res, pathName, { ...query, ...params });
    return h.response(html || undefined).code(raw.res.statusCode);
  };
};

export { pathWrapper, defaultHandlerWrapper, nextHandlerWrapper };
