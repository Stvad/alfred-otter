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
// @ts-ignore
import * as alfy from 'alfy';
var Commands;
(function (Commands) {
    Commands["FetchSelected"] = "fetch-selected";
    Commands["FetchSince"] = "fetch-since";
})(Commands || (Commands = {}));
function getSelectedAndNewer(argument) {
    // Todo using cache as message passing mechanism is a bit questionable, but ...
    const summaries = alfy.cache.get(argument.summaryKey);
    return summaries
        .filter(it => it.startTime >= argument.selected.startTime)
        .map(it => it.id)
        .reverse();
}
const getSpeechIdsToFetch = (command, argument) => command === Commands.FetchSince ? getSelectedAndNewer(argument) : [argument.selected.id];
const toOutputItem = (speech) => speech.transcripts.map(it => it.transcript)
    .concat(` - Recorded at::${new Date(speech.end_time * 1000).toLocaleString()}`, ` - https://otter.ai/u/${speech.otid}`, ` - {{audio: ${speech.audio_url} }}`)
    .join("\n");
// Todo: Consider adding caching?
const fetchSpeeches = (speechIds) => __awaiter(void 0, void 0, void 0, function* () {
    const otterApi = yield otterClient();
    return Promise.all(speechIds.map(it => otterApi.getSpeech(it)));
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const parts = alfy.input.split(" ");
    const command = parts[0];
    const argument = JSON.parse(parts.slice(1).join('_'));
    const speechIdsToFetch = getSpeechIdsToFetch(command, argument);
    const speeches = yield fetchSpeeches(speechIdsToFetch);
    const convertedSpeeches = speeches.map(it => toOutputItem(it));
    console.log(convertedSpeeches.join("\n"));
}))();
