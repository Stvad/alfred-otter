// @ts-ignore
import * as alfy from 'alfy'
import { createClient, SearchResult, SpeechSummary } from 'otter.ai-api'


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

export function getExportTemplate(): string {
    var exportTemplateConfigVar = process.env.exportTemplate?.trim()
    if (!exportTemplateConfigVar) {
        return [
            "${speech.transcripts.map(it => it.transcript)}",
            " - Recorded at::${new Date(speech.end_time * 1000).toLocaleString()}",
            " - https://otter.ai/u/${speech.otid}",
            " - {{audio: ${speech.audio_url} }}"
        ].join("\n")
    } else {
        return exportTemplateConfigVar
    }
}

export const isSearchResult = (speech: SpeechSummary | SearchResult): speech is SearchResult =>
    (speech as SearchResult).speech_otid !== undefined

export const getOtid = (speech: SpeechSummary | SearchResult): string => {
    if (isSearchResult(speech)) {
        return speech.speech_otid
    }
    return speech.otid
}
