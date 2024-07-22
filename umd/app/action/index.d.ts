export declare const actionExecute: (messageOptions: import("../../channel").MessageDataType<"actionExecute"> & import("../../channel").BaseMessageOptions) => Promise<void>;
export type actionExecute = {
    responseType: void;
    /**
     * The webhook url of your app.
     */
    url: string;
    /**
     * The payload you want to send.
     */
    entityIds: string[];
    /**
     * The entity this action is for.
     */
    entity: string;
};
