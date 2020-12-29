var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOtid, otterClient } from './otter';
import * as caching from './caching';
// @ts-ignore
import * as alfy from 'alfy';
// todo way to invalidate cache?
const cacheTimeMs = parseInt(process.env.searchCacheTimeMs || "180000");
const summaryKey = "summaryKey";
const allSpeeches = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield caching.get('allItems', () => __awaiter(void 0, void 0, void 0, function* () {
        const otterApi = yield otterClient();
        let speeches = yield otterApi.getSpeeches();
        saveSummary(speeches);
        return speeches.map(it => ({
            title: it.title || it.summary,
            subtitle: renderTime(it.start_time),
            arg: argFor(it),
        }));
    }), cacheTimeMs);
});
const matchingSpeeches = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield caching.get(query, () => __awaiter(void 0, void 0, void 0, function* () {
        const otterApi = yield otterClient();
        let speeches = yield otterApi.speechSearch(query);
        saveSummary(speeches);
        return speeches.map(it => ({
            title: it.matched_transcripts.map(ts => ts.matched_transcript).join(" "),
            subtitle: renderTime(it.start_time),
            arg: argFor(it),
        }));
    }), cacheTimeMs);
});
const saveSummary = (speeches) => {
    const summaries = speeches.map(it => buildViewSummary(it));
    alfy.cache.set(summaryKey, summaries);
};
const renderTime = (timestamp) => new Date(timestamp * 1000).toLocaleString();
const argFor = (speech) => JSON.stringify({
    selected: buildViewSummary(speech),
    summaryKey,
});
const buildViewSummary = (speech) => ({
    id: speech.speech_id,
    startTime: speech.start_time,
    displayId: getOtid(speech),
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // todo open otter web view variation
    const query = (_a = alfy.input) === null || _a === void 0 ? void 0 : _a.trim();
    if (query) {
        alfy.output(yield matchingSpeeches(query));
    }
    else {
        alfy.output(yield allSpeeches());
    }
}))();
