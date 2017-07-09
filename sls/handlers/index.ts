import HandlerWrapper from "./handlerWrapper";
// List of handlers
import frontRender from "./frontRender";
import subscribeMailingList from "./subscribeMailingList";

const handlers = {
  frontRender: HandlerWrapper.safelyWrap(frontRender),
  subscribeMailingList: HandlerWrapper.safelyWrap(subscribeMailingList),
};

export = handlers;
