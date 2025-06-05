import { createSender } from '../../channel';

export const open = createSender('uiMediaModalOpen');

export type uiMediaModalOpen = {
    responseType: void,
     /**
     * Define initial folder id where the media modal will open.
     */
    initialFolderId?: string;


    entityContext?: string;

    /**
     * Define single or multiple selection.
     */
    allowMultiSelect?: boolean;

    /**
     * Defines which tab should be opened by default.
     */
    defaultTab?: 'upload' | 'library',

    /**
     * Define the file types which are allowed to be uploaded.
     * The file types are defined by their MIME type.
     * For example: "image/png, image/jpeg, image/gif"
     */
    fileAccept?: string;


    /**
     * Define the selected properties which should be returned in callback function.
     */
    selectors?: string[];

    /**
     * Callback function which will be called once the media item is selected.
     */
    callback: (mediaSelections: unknown[]) => void,
}
