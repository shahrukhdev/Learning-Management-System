// Bridges code outside React (the Axios interceptor) to React Router.
// The interceptor emits; <UnauthorizedRedirect /> listens and navigates.

const UNAUTHORIZED_EVENT = "auth:unauthorized";

// A fixed toast id lets React Toastify drop duplicate "session expired" toasts
export const SESSION_EXPIRED_TOAST_ID = "session-expired";
export const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

export const emitUnauthorized = (): void => {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
};

// Returns an unsubscribe function (handy as a useEffect cleanup)
export const onUnauthorized = (handler: () => void): (() => void) => {
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
};
