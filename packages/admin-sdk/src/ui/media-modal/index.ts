import { createSender } from '../../channel';

export const open = createSender('uiMediaModalOpen');
export const openSaveMedia = createSender('uiMediaModalOpenSaveMedia');
export const select = createSender('uiMediaModalSelect');

/**
 * An additional tab of the media modal that renders a location of the app which opened it.
 */
export type MediaModalTab = {
    /**
     * The label of the tab. Snippet keys are translated.
     */
    label: string,

    /**
     * The location the tab renders. It selects items with `ui.mediaModal.select()`.
     */
    locationId: string,
}

export type uiMediaModalOpen = {
    responseType: void,
     /**
      * Define initial folder id where the media modal will open.
      */
    initialFolderId?: string,

    entityContext?: string,

    /**
     * Define single or multiple selection.
     */
    allowMultiSelect?: boolean,

    /**
     * Defines which tab should be opened by default.
     */
    defaultTab?: 'upload' | 'library',

    /**
     * Define the file types which are allowed to be uploaded.
     * The file types are defined by their MIME type.
     * For example: "image/png, image/jpeg, image/gif"
     */
    fileAccept?: string,

    /**
     * Define the selected properties which should be returned in callback function.
     */
    selectors?: string[],

    /**
     * Additional tabs, after the built-in ones, that render locations of the app which opens the
     * modal. They exist only for this opening of the modal.
     */
    tabs?: MediaModalTab[],

    /**
     * Callback function which will be called once the media item is selected.
     * It also receives the selection of an additional tab (`ui.mediaModal.select()`).
     */
    callback: (mediaSelections: unknown[]) => void,
}

/**
 * Sent from the location of an additional tab (`tabs` of `ui.mediaModal.open()`): passes the
 * selection to the callback of the open media modal and closes the modal.
 */
export type uiMediaModalSelect = {
    responseType: void,

    /**
     * The selected items, passed unchanged to the callback.
     */
    selection: unknown[],
}

export type uiMediaModalOpenSaveMedia = {
  responseType: void,
  initialFolderId?: string,
  initialFileName?: string,
  fileType?: string,
  callback: (params: { fileName: string, folderId: string, mediaId?: string }) => void,
}
