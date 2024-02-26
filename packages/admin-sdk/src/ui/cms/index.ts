import { createSender } from '../../channel';

export const registerCmsElement = createSender('cmsRegisterElement');
export const registerCmsBlock = createSender('cmsRegisterBlock');

export type cmsRegisterElement = {
    responseType: void,

    /**
     * The unique name of the cms element, which will also be used to generate locationIds - Should have vendor prefix
     *
     * @example 'company-my-image-slider' will result in the location ids:
     * - 'company-my-image-slider-element' for the element in the cms itself
     * - 'company-my-image-slider-preview' for the preview in the cms element selection
     * - 'company-my-image-slider-config' for the configuration modal of a placed element
     */
    name: string,

    /**
     * The label, which is visible when selecting the cms element - Use snippet keys here!
     */
    label: string,

    /**
     * Object containing the defaultConfig; same like in plugin development.
     * @url https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element
     */
    defaultConfig: {
        [key: string]: unknown,
    },
};

export type cmsRegisterBlock = {
    responseType: void,

    /**
     * A unique technical name for your block. We recommend to use a shorthand prefix for your company, e.g. "Swag" for shopware AG.
     */
    name: string,

    /**
     * The category your block is associated with, e.g. "commerce", "form", "image", "sidebar", "text-image", "text", "video", etc.
     * 
     * New custom categories will get the following snippet key: "apps.sw-cms.detail.label.blockCategory.{categoryName}"
     */
    category?: ('commerce'|'form'|'image'|'sidebar'|'text-image'|'text'|'video') | string & Record<never, never>,

    /**
     * Your block's label which will be shown in the CMS module in the Administration.
     */
    label: string,

    /**
     * Define the slots of the block. Each slot is a single div. The element property is the name of the element that can be placed in the slot.
     */
    slots: Array<{
        element: string,
    }>,

    /**
     * Define the layout of the block. The grid property is a shorthand for the CSS grid property. The grid property is optional.
     */
    slotLayout?: {
        /**
         * The grid layout for the block. Each slot is a single div. Can be defined with the CSS shorthand property "grid":
         * https://developer.mozilla.org/en-US/docs/Web/CSS/grid
         * 
         * Examples:
         * 1 column layout example: "auto / auto"
         * 2 column layout example: "auto / auto auto"
         * 2 row layout example: "auto auto / auto-flow auto"
         */
        grid?: string,
    },

    // The preview image for the block. Minimum width should be 350px
    previewImage?: string,
}
