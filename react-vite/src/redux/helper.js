
export const reduxError = (newState, payload) => {
    if (payload && "errors" in payload) {
        newState.errors = payload.errors
        return newState
    }
    return null
}