var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { otterClient } from "./otter";
import * as caching from './caching';
// @ts-ignore
import * as alfy from 'alfy';
(() => __awaiter(void 0, void 0, void 0, function* () {
    // todo cache. this one can be cached pretty much forever
    const speech = yield caching.get(alfy.input, () => __awaiter(void 0, void 0, void 0, function* () {
        const otterApi = yield otterClient();
        return yield otterApi.getSpeech(alfy.input);
    }));
    const resultParts = speech.transcripts.map(it => it.transcript)
        .concat(` - Recorded at::${new Date(speech.end_time * 1000).toLocaleString()}`, ` - https://otter.ai/u/${speech.otid}`, ` - {{audio: ${speech.audio_url} }}`);
    console.log(resultParts.join("\n"));
}))();
