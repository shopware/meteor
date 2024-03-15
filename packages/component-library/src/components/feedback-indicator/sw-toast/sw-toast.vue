<template>
<div class="sw-toast" :class="classes" @mouseenter="pauseTimer" @mouseleave="resumeTimer">
    <div class="sw-toast__content">
        <div class="sw-toast__pre-icon" v-if="toast.preIcon">
            <sw-icon :name="toast.preIcon" />
        </div>

        <div class="sw-toast__message">
            {{ toast.msg }}
        </div>

        <div
            v-if="!toast.action"
            class="sw-toast__close-action"
            @click="onRemoveToast"
        >
            <sw-icon name="solid-times-circle-s" />
        </div>
    </div>

    <div v-if="showTimer" class="sw-toast__timer">
        <div class="sw-toast__timer-loader"></div>
    </div>
</div>
</template>

<script setup lang="ts">
import SwIcon from '@/components/icons-media/sw-icon/sw-icon.vue';
import { defineProps, toRefs, type PropType, computed, watch, ref } from 'vue';

export interface Toast {
    id: string,
    msg: string,
    pos: 'center'|'right',
    type: 'success'|'error'|'info',
    autoClose: boolean,
};

const emit = defineEmits(['remove-toast'])

const props = defineProps({
    toast: {
        type: Object as PropType<Toast>,
        required: true,
    },
    showTimer: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const { toast, showTimer } = toRefs(props);

const classes = computed(() => {
    return {
        'sw-toast__success': toast.value.type === 'success',
        'sw-toast__error': toast.value.type === 'error',
        'sw-toast__info': toast.value.type === 'info',
    }
})

let timeoutId = ref<number|undefined>(undefined);
let timeoutStartTime = ref<number|undefined>(undefined);
let remainingTimeOut = ref(5500);

watch(showTimer, (newValue) => {
    // Stop timer?
    if (!newValue) {
        // CallbackId exists?
        if (timeoutId.value) {
            window.clearTimeout(timeoutId.value);
            timeoutId.value = undefined;
        }

        return;
    }

    // Start timer
    timeoutStartTime.value = Date.now();
    timeoutId.value = window.setTimeout(() => {
        onRemoveToast();
    }, remainingTimeOut.value);

}, { immediate: true })

function pauseTimer() {
    // Terminate current timeout
    window.clearTimeout(timeoutId.value);

    const previousTime = timeoutStartTime.value ?? Date.now();

    // Calculate the remaining timeout for the toast
    remainingTimeOut.value = remainingTimeOut.value - (Date.now() - previousTime);
}

function resumeTimer() {
    if (!showTimer.value) {
        return;
    }

    // Start timer
    timeoutStartTime.value = Date.now();
    timeoutId.value = window.setTimeout(() => {
        onRemoveToast();
    }, remainingTimeOut.value);
}

function onRemoveToast() {
    // Timout can be skipped for manual removal
    if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
    }

    emit('remove-toast', toast.value.id);
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/variables.scss";

.sw-toast {
    position: absolute;
    bottom: 0;
    border-radius: 4px;
    margin-bottom: 17px;
    display: flex;
    flex-direction: column;
    height: 51px;
    transition: transform 5s ease, opacity 2s ease, height 5s ease;
    transform-origin: bottom;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 2px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);

    &:hover {
        .sw-toast__timer-loader {
            animation-play-state: paused;
        }
    }

    &__content {
        display: flex;
        align-items: center;
    }
    
    &__success {
        background-color: $color-emerald-500;

        .sw-toast__close-action {
            border-left: 1px solid $color-emerald-900;
        }

        .sw-toast__timer {
            background-color: $color-emerald-900;
        }
    }

    &__error {
        background-color: $color-crimson-500;
        
        .sw-toast__close-action {
            border-left: 1px solid $color-crimson-900;
        }

        .sw-toast__timer {
            background-color: $color-crimson-900;
        }
    }

    &__info {
        background-color: $color-darkgray-700;

        .sw-toast__close-action {
            border-left: 1px solid $color-darkgray-900;
        }

        .sw-toast__timer {
            background-color: $color-darkgray-900;
        }
    }

    &__message {
        padding: 16px 24px;
        color: $color-white;
        font-family: $font-family-default;
        font-size: $font-size-xs;
        font-style: normal;
        font-weight: $font-weight-semi-bold;
        line-height: 16px; /* 114.286% */
        letter-spacing: 0.08px;
    }

    &__close-action {
        height: 100%;
        display: flex;
        padding: 12px;
        justify-content: flex-end;
        align-items: center;
        cursor: pointer;
        color: $color-white;
    }

    &__timer {
        height: 3px;
        width: 100%;
        border-radius: 0 0 4px 4px;
        background-color: $color-white;

        &-loader {
            top: 0;
            left: 100%;
            width: 100%;
            height: 100%;
            background-color: white;
            transform-origin: 0% 0%;
            animation: shrink 5s forwards linear 0.5s;
        }

        @keyframes shrink {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }
    }
}
</style>