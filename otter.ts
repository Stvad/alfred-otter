import {createClient} from 'otter.ai-api'

export const otterClient = async () => await createClient({
    email: process.env.email,
    password: process.env.password,
})
