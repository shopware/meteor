import { createSender } from '../../channel';
import { getWindowSrc } from '../../_internals/utils';

export const add = createSender('uiComponentSectionRenderer', {
    src: getWindowSrc() ?? undefined,
});

interface BaseSectionRenderer {
    responseType: void;
    positionId: string;
    src?: string;
}

interface CardComponentRender extends BaseSectionRenderer {
    component: 'card';
    props: {
        title?: string;
        subtitle?: string;
        locationId: string;
        tabs?: CardTabRenderer[];
    };
}

interface CardTabRenderer {
    name: string;
    label: string;
    locationId: string;
}

interface HtmlElementRender extends BaseSectionRenderer {
    component: keyof HTMLElementTagNameMap;
    props: Record<string, unknown>;
}

export type uiComponentSectionRenderer = CardComponentRender | HtmlElementRender;
