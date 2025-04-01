export default function errorSetter(res, setErrors) {
    const errors = res.payload.errors
    if (errors) {
        setErrors(errors)
    } else {
        setErrors([])
    }
}