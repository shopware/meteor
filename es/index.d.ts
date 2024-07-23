import * as window from './window';
import * as notification from './notification';
import * as toast from './toast';
import * as context from './context';
import * as componentSection from './ui/component-section';
import * as cms from './ui/cms';
import * as location from './location';
import * as menu from './ui/menu';
import * as settings from './ui/settings';
import * as mainModule from './ui/main-module';
import * as module from './ui/module';
import * as modal from './ui/modal';
import * as actionButton from './ui/action-button';
import * as webhook from './app/action';
import * as data from './data';
import * as iap from './iap';
import type EntityCollectionType from './_internals/data/EntityCollection';
import type { Entity as EntityType } from './_internals/data/Entity';
import composables from './data/composables';
declare const app: {
    webhook: typeof webhook;
};
declare const ui: {
    componentSection: typeof componentSection;
    tabs: (tabPositionId: string) => {
        addTabItem: (messageOptions: Omit<import("./channel").MessageDataType<"uiTabsAddTabItem">, "positionId"> & import("./channel").BaseMessageOptions) => Promise<void>;
    };
    menu: typeof menu;
    settings: typeof settings;
    mainModule: typeof mainModule;
    module: typeof module;
    modal: typeof modal;
    actionButton: typeof actionButton;
};
/**
 * The main export which will be available by direct imports.
 */
export { window, notification, toast, context, ui, cms, location, app, data, composables, iap, };
/**
 * Declare global EntitySchema namespace for allowing to extend the entity definitions
 */
declare global {
    namespace EntitySchema {
        type EntityCollection<EntityName extends keyof EntitySchema.Entities> = EntityCollectionType<EntityName>;
        type Entity<EntityName extends keyof EntitySchema.Entities> = EntityType<EntityName>;
        interface Entities {
            private_example_entity: private_example_entity;
            private_example_entity_two: private_example_entity_two;
        }
        interface private_example_entity {
            id: string;
        }
        interface private_example_entity_two {
            id: string;
        }
    }
}
