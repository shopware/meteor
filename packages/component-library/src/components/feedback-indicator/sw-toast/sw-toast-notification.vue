<template>
<div class="sw-toast-notification" :class="classes" @mouseenter="pauseTimer" @mouseleave="resumeTimer">
    <div class="sw-toast-notification__content">
        <sw-icon
            v-if="toast.icon"
            :name="toast.icon"
        />

        <div class="sw-toast-notification__message">
            {{ toast.msg }}
        </div>

        <div
            v-if="!toast.action"
            class="sw-toast-notification__close-action"
            @click="onRemoveToast"
        >
            <sw-icon name="solid-times-circle-s" />
        </div>
    </div>

    <div v-if="showTimer" class="sw-toast-notification__timer">
        <div class="sw-toast-notification__timer-loader"></div>
    </div>
</div>
</template>

<script setup lang="ts">
import SwIcon from '@/components/icons-media/sw-icon/sw-icon.vue';
import { defineProps, toRefs, type PropType, computed, watch, ref } from 'vue';
import type { Toast } from './sw-toast.vue';

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
        'sw-toast-notification__positive': toast.value.type === 'positive',
        'sw-toast-notification__critical': toast.value.type === 'critical',
        'sw-toast-notification__default': toast.value.type === 'default',
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
    console.log('RESUMING TIMER');

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

.sw-toast-notification {
    position: absolute;
    bottom: 0;
    border-radius: 4px;
    margin-bottom: 17px;
    display: flex;
    flex-direction: column;
    height: 56px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 2px 1px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);

    &:hover {
        .sw-toast-notification__timer-loader {
            animation-play-state: paused;
        }
    }

    &__content {
        height: 100%;
        display: flex;
        align-items: center;

    }
    
    &__positive {
        background-color: $color-emerald-500;

        .sw-toast-notification__close-action {
            border-left: 1px solid $color-emerald-900;
        }

        .sw-toast-notification__timer {
            background-color: $color-emerald-900;
        }
    }

    &__critical {
        background-color: $color-crimson-500;
        
        .sw-toast-notification__close-action {
            border-left: 1px solid $color-crimson-900;
        }

        .sw-toast-notification__timer {
            background-color: $color-crimson-900;
        }
    }

    &__default {
        background-color: $color-darkgray-700;

        .sw-toast-notification__close-action {
            border-left: 1px solid $color-darkgray-900;
        }

        .sw-toast-notification__timer {
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
        margin-left: auto;
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