import {otterClient} from "./otter"

const alfy = require('alfy')

interface Speech {
    title: string | null,
    summary: string,
    created_at: number,
    speech_id: string,
}

(async () => {
    // todo search, export all in range
    // todo open otter web view variation
    const allItems = 'allItems'
    let speechItems = alfy.cache.get(allItems)

    if (!speechItems) {
        const otterApi = await otterClient()
        let speeches = await otterApi.getSpeeches()

        speechItems = speeches.map((it: Speech) => ({
            title: it.title || it.summary,
            subtitle: new Date(it.created_at * 1000).toLocaleString(),
            arg: it.speech_id,
        }))

        // todo way to invalidate cache or maybe just make time configurable?
        alfy.cache.set(allItems, speechItems, {maxAge: 120000})
    }

    alfy.output(speechItems)
})()
