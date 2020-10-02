export const actionTypes = {
  REQUEST_STARTED: 'REQUEST_STARTED',
  REQUEST_FINISHED: 'REQUEST_FINISHED',
  REQUEST_FAILED: 'REQUEST_FAILED',
};

export function requestStarted(requestType) {
  return {
    type: actionTypes.REQUEST_STARTED,
    requestType,
  };
}

export function requestFinished(requestType, data) {
  return {
    type: actionTypes.REQUEST_FINISHED,
    requestType,
    data,
  };
}

export function requestFailed(requestType, error) {
  return {
    type: actionTypes.REQUEST_FAILED,
    requestType,
    error,
  };
}
