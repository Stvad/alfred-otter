// @ts-ignore
import * as alfy from 'alfy'
import { Speech } from 'otter.ai-api'
import { getExportTemplate, otterClient, SpeechViewSummary } from "./otter"


enum Commands {
    FetchSelected = "fetch-selected",
    FetchSince = "fetch-since",
}

interface Argument {
    selected: SpeechViewSummary,
    summaryKey: string
}

function getSelectedAndNewer(argument: Argument) {
    // Todo using cache as message passing mechanism is a bit questionable, but ...
    const summaries = alfy.cache.get(argument.summaryKey) as Array<SpeechViewSummary>

    return summaries
        .filter(it => it.startTime >= argument.selected.startTime)
        .map(it => it.id)
        .reverse()
}

const getSpeechIdsToFetch = (command: Commands, argument: Argument) =>
    command === Commands.FetchSince ? getSelectedAndNewer(argument) : [argument.selected.id]

const toOutputItem = (speech: Speech) => {
    let fullTranscript = speech.transcripts.map(it => it.transcript)
    return eval('`' + getExportTemplate() + '`')
}

// Todo: Consider adding caching?
const fetchSpeeches = async (speechIds: Array<string>) => {
    const otterApi = await otterClient()
    return Promise.all(speechIds.map(it => otterApi.getSpeech(it)))
}

(async () => {
    const parts = alfy.input.split(" ")
    const command = parts[0]
    const argument = JSON.parse(parts.slice(1).join('_')) as Argument

    const speechIdsToFetch = getSpeechIdsToFetch(command, argument)
    const speeches = await fetchSpeeches(speechIdsToFetch)

    const convertedSpeeches = speeches.map(it => toOutputItem(it))

    console.log(convertedSpeeches.join("\n"))
})()
