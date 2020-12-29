var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from 'otter.ai-api';
// @ts-ignore
import * as alfy from 'alfy';
function validateEnv() {
    var _a, _b;
    if (!((_a = process.env.email) === null || _a === void 0 ? void 0 : _a.trim()) || !((_b = process.env.password) === null || _b === void 0 ? void 0 : _b.trim())) {
        alfy.error("Please specify your email and password in workflow variables");
        process.exit();
    }
}
export const otterClient = () => __awaiter(void 0, void 0, void 0, function* () {
    validateEnv();
    return yield createClient({
        email: process.env.email,
        password: process.env.password,
    });
});
export const isSearchResult = (speech) => speech.speech_otid !== undefined;
export const getOtid = (speech) => {
    if (isSearchResult(speech)) {
        return speech.speech_otid;
    }
    return speech.otid;
};
