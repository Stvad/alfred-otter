import {getOtid, otterClient, SpeechViewSummary} from './otter'
import {SearchResult, SpeechSummary} from 'otter.ai-api'
import * as caching from './caching'

// @ts-ignore
import * as alfy from 'alfy'

// todo way to invalidate cache?
const cacheTimeMs = parseInt(process.env.searchCacheTimeMs || "180000")
const summaryKey = "summaryKey"

const allSpeeches = async () =>
    await caching.get('allItems', async () => {
        const otterApi = await otterClient()
        let speeches = await otterApi.getSpeeches()

        saveSummary(speeches)

        return speeches.map(it => ({
            title: it.title || it.summary,
            subtitle: renderTime(it.start_time),
            arg: argFor(it),
        }))
    }, cacheTimeMs)

const matchingSpeeches = async (query: string) =>
    await caching.get(query, async () => {
        const otterApi = await otterClient()
        let speeches = await otterApi.speechSearch(query)

        saveSummary(speeches)

        return speeches.map(it => ({
            title: it.matched_transcripts.map(ts => ts.matched_transcript).join(" "),
            subtitle: renderTime(it.start_time),
            arg: argFor(it),
        }))
    }, cacheTimeMs)

const saveSummary = (speeches: Array<SpeechSummary | SearchResult>) => {
    const summaries = speeches.map(it => buildViewSummary(it))
    alfy.cache.set(summaryKey, summaries)
}

const renderTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleString()

const argFor = (speech: SpeechSummary | SearchResult) => JSON.stringify({
    selected: buildViewSummary(speech),
    summaryKey,
})

const buildViewSummary = (speech: SpeechSummary | SearchResult): SpeechViewSummary => ({
    id: speech.speech_id,
    startTime: speech.start_time,
    displayId: getOtid(speech),
});

(async () => {
    // todo open otter web view variation
    const query = alfy.input?.trim()
    if (query) {
        alfy.output(await matchingSpeeches(query))
    } else {
        alfy.output(await allSpeeches())
    }
})()
