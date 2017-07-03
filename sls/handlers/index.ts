import HandlerWrapper from "./handlerWrapper";
// List of handlers
import frontRender from "./frontRender";

const handlers = {
  frontRender: HandlerWrapper.safelyWrap(frontRender),
};

export = handlers;
