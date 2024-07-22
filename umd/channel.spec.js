var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "flush-promises", "./_internals/privileges/missing-privileges-error"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    const flush_promises_1 = __importDefault(require("flush-promises"));
    const missing_privileges_error_1 = __importDefault(require("./_internals/privileges/missing-privileges-error"));
    // Channel send timout + 1000
    jest.setTimeout(8000);
    let send;
    let handle;
    let createSender;
    let createHandler;
    let subscribe;
    let publish;
    let setExtensions;
    describe('Test the channel bridge from iFrame to admin', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            window.addEventListener('message', (event) => {
                if (event.origin === '') {
                    event.stopImmediatePropagation();
                    const eventWithOrigin = new MessageEvent('message', {
                        data: event.data,
                        origin: window.location.href,
                    });
                    window.dispatchEvent(eventWithOrigin);
                }
            });
            const channel = yield __syncRequire ? Promise.resolve().then(() => __importStar(require('./channel'))) : new Promise((resolve_1, reject_1) => { require(['./channel'], resolve_1, reject_1); }).then(__importStar);
            send = channel.send;
            handle = channel.handle;
            createSender = channel.createSender;
            createHandler = channel.createHandler;
            subscribe = channel.subscribe;
            publish = channel.publish;
            setExtensions = channel.setExtensions;
            setExtensions({
                'test-extension': {
                    baseUrl: 'http://localhost',
                    permissions: {},
                },
            });
        }));
        beforeEach(() => {
            // reset extensions
            setExtensions({});
        });
        it('should send "reload" command to the admin', (done) => {
            const removeListener = handle('windowReload', (result) => {
                expect(result).toEqual({});
                removeListener();
                done();
            });
            send('windowReload', {});
        });
        it('should send "reload" command to the admin also without options', (done) => {
            const removeListener = handle('windowReload', (result) => {
                expect(result).toEqual({});
                removeListener();
                done();
            });
            // safety check if non-ts user aren't providing options
            // @ts-expect-error
            send('windowReload');
        });
        it('should get value back from admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const PAGE_TITLE = 'Awesome page title';
            const removeListener = handle('getPageTitle', () => {
                return PAGE_TITLE;
            });
            const pageTitle = yield send('getPageTitle', {});
            expect(pageTitle).toEqual(PAGE_TITLE);
            removeListener();
        }));
        it('should create a sender and handler with required options', () => __awaiter(void 0, void 0, void 0, function* () {
            const getPageTitle = createSender('getPageTitle');
            const handlePageTitle = createHandler('getPageTitle');
            const PAGE_TITLE = 'Awesome page title';
            const removeListener = handlePageTitle(() => {
                return PAGE_TITLE;
            });
            const pageTitle = yield getPageTitle({});
            expect(pageTitle).toEqual(PAGE_TITLE);
            removeListener();
        }));
        it('should create a sender and handler with optional options', () => __awaiter(void 0, void 0, void 0, function* () {
            const reload = createSender('windowReload', {});
            const handleReload = createHandler('windowReload');
            const removeListener = handleReload(() => { });
            yield reload();
            removeListener();
        }));
        it('should convert functions in options and call them on the handler side', (done) => {
            const buttonMethodMock = jest.fn(() => { });
            const dispatchNotification = createSender('notificationDispatch');
            const handleNotification = createHandler('notificationDispatch');
            const removeListener = handleNotification(({ actions }) => __awaiter(void 0, void 0, void 0, function* () {
                if (!actions || (actions === null || actions === void 0 ? void 0 : actions.length) <= 0) {
                    fail('The notification handler does not get any actions from the sender');
                    return;
                }
                const firstAction = actions[0];
                if (!firstAction.method) {
                    fail('"method" in the firstAction is undefined');
                }
                expect(typeof firstAction.method).toBe('function');
                expect(buttonMethodMock).toHaveBeenCalledTimes(0);
                yield firstAction.method();
                expect(buttonMethodMock).toHaveBeenCalledTimes(1);
            }));
            dispatchNotification({
                title: 'Notification with action',
                message: 'The action should contain a callable method',
                actions: [
                    {
                        label: 'Button with method',
                        method: () => buttonMethodMock()
                    }
                ]
            }).then(() => {
                removeListener();
                done();
            });
        });
        it('should convert functions in options and call them on the handler side with arguments and return value', () => __awaiter(void 0, void 0, void 0, function* () {
            const methodMock = jest.fn((firstNumber, secondNumber) => {
                return firstNumber * secondNumber;
            });
            const sendMultiply = createSender('_multiply');
            const handleMultiply = createHandler('_multiply');
            const removeListener = handleMultiply(({ firstNumber, secondNumber }) => {
                return Promise.resolve(methodMock(firstNumber, secondNumber));
            });
            const result = yield sendMultiply({ firstNumber: 7, secondNumber: 8 });
            expect(result).toEqual(56);
            removeListener();
        }));
        it('should get data from published messages when subscribed', () => __awaiter(void 0, void 0, void 0, function* () {
            const localeMethodMock = jest.fn();
            const fallbackLocaleMethodMock = jest.fn();
            const removeSubscription = subscribe('contextLocale', ({ locale, fallbackLocale }) => {
                localeMethodMock(locale);
                fallbackLocaleMethodMock(fallbackLocale);
            });
            expect(localeMethodMock).toHaveBeenCalledTimes(0);
            expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(0);
            publish('contextLocale', {
                locale: 'en-GB',
                fallbackLocale: 'en-GB',
            });
            yield (0, flush_promises_1.default)();
            expect(localeMethodMock).toHaveBeenCalledTimes(1);
            expect(localeMethodMock).toHaveBeenLastCalledWith('en-GB');
            expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(1);
            expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');
            publish('contextLocale', {
                locale: 'de-DE',
                fallbackLocale: 'en-GB',
            });
            yield (0, flush_promises_1.default)();
            expect(localeMethodMock).toHaveBeenCalledTimes(2);
            expect(localeMethodMock).toHaveBeenLastCalledWith('de-DE');
            expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
            expect(fallbackLocaleMethodMock).toHaveBeenLastCalledWith('en-GB');
            removeSubscription();
            publish('contextLocale', {
                locale: 'nl-NL',
                fallbackLocale: 'en-GB',
            });
            yield (0, flush_promises_1.default)();
            expect(localeMethodMock).toHaveBeenCalledTimes(2);
            expect(fallbackLocaleMethodMock).toHaveBeenCalledTimes(2);
        }));
        it('should reject send with missing privileges', () => {
            send('_privileges', {}).catch(e => {
                const expectedError = new missing_privileges_error_1.default('_privileges', ['additional:not_entity_related', 'create:user', 'read:user', 'update:user', 'delete:user']);
                expect(e.message).toEqual(expectedError.message);
            });
        });
        it('should not call handle callback with missing extensions', () => {
            const callback = jest.fn();
            const removeHandle = handle('_privileges', callback);
            // Simulate a postMessage call from an iFrame
            window.dispatchEvent(new Event('message'));
            removeHandle();
            expect(callback).toHaveBeenCalledTimes(0);
        });
        it('should not call handle callback with missing privileges', () => {
            const url = 'http://example.com';
            const callback = jest.fn();
            // change the extensions for this test
            setExtensions({});
            const removeHandle = handle('_privileges', callback);
            const event = new Event('message');
            // Simulate a postMessage call from an iFrame with a none registered origin
            window.dispatchEvent(event);
            // Simulate a postMessage call from an iFrame
            // @ts-expect-error
            event.origin = url;
            window.dispatchEvent(event);
            removeHandle();
            expect(callback).toHaveBeenCalledTimes(0);
        });
    });
});
//# sourceMappingURL=channel.spec.js.map