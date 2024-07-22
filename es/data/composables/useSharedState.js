var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SerializerFactory from './../../_internals/serializer';
import localforage from 'localforage';
import { reactive, watch, onBeforeUnmount } from 'vue';
import { handle, send } from '../../channel';
const { serialize, deserialize } = SerializerFactory({
    handle: handle,
    send: send,
});
function setItem({ key, newValue, persistentSharedValueStore, persistentSharedValueStoreBroadcast, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const serializedValue = serialize(newValue);
        yield persistentSharedValueStore.setItem(key, serializedValue);
        persistentSharedValueStoreBroadcast.postMessage({
            type: 'store-change',
            key: key,
        });
    });
}
function createValueWatcher({ key, sharedValue, persistentSharedValueStore, persistentSharedValueStoreBroadcast, getPendingValue, }) {
    return watch(() => sharedValue.value, (newValue) => __awaiter(this, void 0, void 0, function* () {
        if (getPendingValue()) {
            return;
        }
        yield setItem({
            key,
            newValue,
            persistentSharedValueStore,
            persistentSharedValueStoreBroadcast,
        });
    }), { deep: true });
}
function setRemoteValue({ setPendingValue, removeWatcher, setWatcher, store, key, sharedValue, }) {
    setPendingValue(true);
    removeWatcher();
    store.getItem(key)
        .then((value) => {
        if (value === null) {
            return;
        }
        const deserializedValue = deserialize(value, new MessageEvent('message'));
        sharedValue.value = deserializedValue;
    })
        .finally(() => {
        setPendingValue(false);
        setWatcher();
    });
}
/**
 *
 * @param key - Shared state key
 * @param initalValue - Initial value
 * @returns
 */
export function useSharedState(key, initalValue) {
    let isPending = false;
    const getPendingValue = () => isPending;
    const setPendingValue = (newValue) => {
        isPending = newValue;
    };
    const removeWatcher = () => {
        unwatchValue();
    };
    const setWatcher = () => {
        unwatchValue();
        unwatchValue = createValueWatcher({
            key,
            sharedValue,
            persistentSharedValueStore,
            persistentSharedValueStoreBroadcast,
            getPendingValue,
        });
    };
    const persistentSharedValueStore = localforage.createInstance({
        name: 'adminExtensionSDK',
        storeName: 'persistentSharedValueStore',
    });
    const persistentSharedValueStoreBroadcast = new BroadcastChannel('persistentSharedValueStore');
    const sharedValue = reactive({
        value: initalValue,
    });
    let unwatchValue = createValueWatcher({
        key,
        sharedValue,
        persistentSharedValueStore,
        persistentSharedValueStoreBroadcast,
        getPendingValue,
    });
    const eventListener = (event) => {
        if (event.data.type !== 'store-change') {
            return;
        }
        if (event.data.key !== key) {
            return;
        }
        setRemoteValue({
            setPendingValue,
            removeWatcher,
            setWatcher,
            store: persistentSharedValueStore,
            key,
            sharedValue,
        });
    };
    persistentSharedValueStoreBroadcast.addEventListener('message', eventListener);
    onBeforeUnmount(() => {
        persistentSharedValueStoreBroadcast.close();
        persistentSharedValueStoreBroadcast.removeEventListener('message', eventListener);
    });
    // Get initial value from remote
    setRemoteValue({
        setPendingValue,
        removeWatcher,
        setWatcher,
        store: persistentSharedValueStore,
        key,
        sharedValue,
    });
    // Set inital value when remote value is not available
    persistentSharedValueStore.getItem(key)
        .then((value) => __awaiter(this, void 0, void 0, function* () {
        if (value !== null) {
            return;
        }
        yield setItem({
            key,
            newValue: initalValue,
            persistentSharedValueStore,
            persistentSharedValueStoreBroadcast,
        });
    }))
        // Handle error silently because the broadcast channel could be closed
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => { });
    return sharedValue;
}
//# sourceMappingURL=useSharedState.js.map