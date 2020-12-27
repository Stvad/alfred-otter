import {otterClient} from './otter'
import * as caching from './caching'

// @ts-ignore
import * as alfy from 'alfy'

// todo way to invalidate cache?
const cacheTimeMs = parseInt(process.env.searchCacheTimeMs || "180000")

const allSpeeches = async () =>
    await caching.get('allItems', async () => {
        const otterApi = await otterClient()
        let speeches = await otterApi.getSpeeches()

        return speeches.map(it => ({
            title: it.title || it.summary,
            subtitle: renderTime(it.start_time),
            arg: it.speech_id,
        }))
    }, cacheTimeMs)

const matchingSpeeches = async (query: string) =>
    await caching.get(query, async () => {
        const otterApi = await otterClient()
        let speeches = await otterApi.speechSearch(query)

        return speeches.map(it => ({
            title: it.matched_transcripts.map(ts => ts.matched_transcript).join(" "),
            subtitle: renderTime(it.start_time),
            arg: it.speech_id,
        }))
    }, cacheTimeMs)

const renderTime = (timestamp: number) => new Date(timestamp * 1000).toLocaleString();

(async () => {
    // todo export all in range
    // todo open otter web view variation
    const query = alfy.input?.trim()
    if (query) {
        alfy.output(await matchingSpeeches(query))
    } else {
        alfy.output(await allSpeeches())
    }
})()
