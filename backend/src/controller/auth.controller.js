// Signup
export const signupController = async ( request, resposne ) => {

    try {

        resposne.send('Sign up')

    } catch ( error ) { console.log('Sign up') }

}

// Login
export const loginController = async ( request, resposne ) => {

    try {

        resposne.send('Login')

    } catch ( error ) { console.log('Sign up') }

}

// Logout
export const logoutController = async ( request, response ) => {

    try {

        response.send('Logout')

    } catch ( error ) { console.log('Sign up') }

}