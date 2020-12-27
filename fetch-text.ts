import {otterClient} from "./otter"
import * as caching from './caching'

// @ts-ignore
import * as alfy from 'alfy'

(async () => {
    // todo cache. this one can be cached pretty much forever

    const speech = await caching.get(alfy.input, async () => {
        const otterApi = await otterClient()
        return await otterApi.getSpeech(alfy.input)
    })

    const resultParts = speech.transcripts.map(it => it.transcript)
        .concat(
            ` - Recorded at::${new Date(speech.end_time * 1000).toLocaleString()}`,
            ` - https://otter.ai/u/${speech.otid}`,
            ` - {{audio: ${speech.audio_url} }}`)

    console.log(resultParts.join("\n"))
})()
