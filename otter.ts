import {createClient, SearchResult, SpeechSummary} from 'otter.ai-api'


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
        email: process.env.email!!,
        password: process.env.password!!,
    })
}

export interface SpeechViewSummary {
    startTime: number
    id: string
    displayId: string
}

export const isSearchResult = (speech: SpeechSummary | SearchResult): speech is SearchResult =>
    (speech as SearchResult).speech_otid !== undefined

export const getOtid =  (speech: SpeechSummary | SearchResult): string => {
    if (isSearchResult(speech)) {
        return speech.speech_otid
    }
    return speech.otid
}
