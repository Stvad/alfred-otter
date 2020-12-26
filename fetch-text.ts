import {otterClient} from "./otter"

const alfy = require('alfy');

(async () => {
    // todo cache. this one can be cached pretty much forever
    const otterApi = await otterClient()
    let speech = await otterApi.getSpeech(alfy.input)

    const resultParts = speech.transcripts.map(it => it.transcript)
        .concat(
            ` - Recorded at::${new Date(speech.end_time * 1000).toLocaleString()}`,
            ` - https://otter.ai/u/${speech.otid}`,
            ` - {{audio: ${speech.audio_url} }}`)

    console.log(resultParts.join("\n"))
})()
