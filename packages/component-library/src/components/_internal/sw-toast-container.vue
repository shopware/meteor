<template>
    <div class="sw-toast-container">
        <div class="sw-toast-container__left">
            <!-- Placeholder for aligning the single toast container -->
        </div>

        <div class="sw-toast-container__center">
            <TransitionGroup name="toasts">
                <SwToast
                    v-for="(ct, index) in centerToasts"
                    :key="`ct-${ct.id}`"
                    :toast="ct"
                    :showTimer="index === toasts.length - 1 && ct.type !== 'error'"
                    @remove-toast="onRemoveToast"
                />
            </TransitionGroup>
        </div>

        <div class="sw-toast-container__right">
            <!-- <TransitionGroup name="toasts">
                <SwToast
                    v-for="(rt, index) in rightToasts"
                    :key="`rt-${rt.id}`"
                    :toast="rt"
                    :showTimer="index === toasts.length - 1 && rt.type !== 'error'"
                    @remove-toast="onRemoveToast"
                />
            </TransitionGroup> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, type PropType, computed, toRefs } from 'vue';
import SwToast from '../feedback-indicator/sw-toast/sw-toast.vue';

const emit = defineEmits(['remove-toast']);

const props = defineProps({
    toasts: {
        type: Array as PropType<Toast[]>,
        required: true,
    }
});

const { toasts } = toRefs(props);

const centerToasts = computed(() => {
    return toasts.value.filter(t => t.pos === 'center');
});

const rightToasts = computed(() => {
    return toasts.value.filter(t => t.pos === 'right');
});

function onRemoveToast(id: string) {
    emit('remove-toast', id);
}
</script>

<style lang="scss">

.sw-toast-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background-color: lightblue;
    display: flex;
    justify-content: space-between;

    &__left {
        flex: 1;
    }

    &__center {
        flex: 1;
    }

    &__right {
        flex: 1;
    }

    .sw-toast {
        z-index: 9999;
        width: 420px;
        transition: 3s all ease;
    }

    .sw-toast:nth-last-child(1) {
        transform: translate3d(0, 0, 0);
        z-index: 10000;
    }

    .sw-toast:nth-last-child(2) {
        transform: translate3d(0, -35px, 0) scale(0.95, 0.1);
        z-index: 10000;
    }

    .sw-toast:nth-last-child(3) {
        transform: translate3d(0, -45px, 0) scale(0.90, 0.1);
        z-index: 10000;
    }

    .sw-toast:nth-last-child(n+2) {
        .sw-toast__content {
            opacity: 0;
        }
    }

    .toasts-enter-active,
    .toasts-leave-active {
        //  transition: transform 360s ease;
     }
}

// .sw-toast-container {
//     width: 100%;
//     display: flex;
//     justify-content: flex-end;
//     align-items: flex-end;
//     position: fixed;
//     bottom: 0;

//     &__center {
//         position: relative;
//         width: 33%;
//         display: flex;
//         flex-direction: column;

//         .sw-toast {
//             transform: translate3d(0, 0, 0);
//             transition: transform 3s ease, opacity 3s ease, height 3s ease;
//             transform-origin: bottom;
//             align-self: center;
//             z-index: 9999;
//         }

//         .sw-toast:nth-last-child(1) {
//             transform: translate3d(100px, 0, 0);
//             z-index: 10000;
//         }

//         .sw-toast:nth-last-child(2) {
//             // top
//             //transform: scale(0.95, 0.1) translate3d(0, -90px, 0);

//             // bottom
//             transform: translate3d(0, -55px, 0);
//             // height: 4px;
//             // width: 90%;
            
//             .sw-toast__content {
//                 opacity: 0;
//             }

//             .sw-toast__timer {
//                 opacity: 0;
//             }
//         }

//         .sw-toast:nth-last-child(3) {
//             // top
//             // transform: scale(0.9, 0.1) translate3d(0, -180px, 0);
//             transform: translate3d(0, -62px, 0);
//             // height: 4px;
//             // width: 85%;
//             .sw-toast__content {
//                 opacity: 0;
//             }

//             .sw-toast__timer {
//                 opacity: 0;
//             }
//         }

//         .sw-toast:nth-last-child(n+4) {
//             //transform: translate3d(0, -110px, 0);
//             height: 4px;
//             opacity: 0;
//             .sw-toast__content {
//                 opacity: 0;
//             }

//             .sw-toast__timer {
//                 opacity: 0;
//             }
//         }
//     }

//     &__right {
//         width: 33%;
//         display: flex;
//         justify-content: center;
//         flex-direction: column;

//         .sw-toast {
//             align-self: flex-end;
//             z-index: 9999;
//         }
//     }

//     //.toasts-move, /* apply transition to moving elements */
//     .toasts-enter-active,
//     .toasts-leave-active {
//         transition: transform 3s ease, opacity 3s ease;
//     }

//     .toasts-move {
//         transition: transform 1s ease;
//     }

//     .toasts-enter-from,
//     .toasts-leave-to {
//         opacity: 0;
//         transform: translate3d(0, 50px, 0);
//     }

//     .toasts-enter-from.sw-toast:nth-last-child(1),
//     .toasts-leave-to.sw-toast:nth-last-child(1)  {
//         transform: translate3d(0, 50px, 0);
//     }

//     /* ensure leaving items are taken out of layout flow so that moving
//     animations can be calculated correctly. */
//     .toasts-leave-active {
//         position: fixed;
//     }
// }
</style>