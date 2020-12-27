import {createClient} from 'otter.ai-api'

// @ts-ignore
import * as alfy from 'alfy'

function validateEnv() {
    if (!process.env.email?.trim() || !process.env.password?.trim()) {
        alfy.error("Please specify your email and password in workflow variables")
        process.exit()
    }
}

export const otterClient = async () => {
    validateEnv()
    return await createClient({
        email: process.env.email!!, // TODO actually prompt user for missing variables
        password: process.env.password!!,
    })
}
