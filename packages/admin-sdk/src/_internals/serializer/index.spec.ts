import Entity from '../data/Entity';
import SerializerFactory from './index';
import { handle, send } from '../../channel';
import EntityCollection from '../data/EntityCollection';
import Criteria from '../../data/Criteria';

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
})

describe('index.ts', () => {
  it('should convert entities with circular reference', () => {
    // @ts-expect-error - We don't care about valid entities here
    const entity = new Entity('foo', 'jest', {
        // @ts-expect-error - We don't care about valid entities here
        lineItems: new EntityCollection('line_items', 'line_item', undefined, new Criteria(), [
            // @ts-expect-error - We don't care about valid entities here
            new Entity('line_item_1', 'line_item', {
                id: 'line_item_1',
                quantity: 1,
                versionId: 1,
                price: {
                    unitPrice: 100,
                    totalPrice: 100,
                },
                // @ts-expect-error - We don't care about valid entities here
                children: new EntityCollection('line_item', 'order_line_item', undefined, new Criteria(), [
                    // @ts-expect-error - We don't care about valid entities here
                    new Entity('extension', 'order_line_item_foreign_keys_extension', {
                        id: 'extension',
                        key: 'value',
                        parent: undefined,
                    }),
                    // @ts-expect-error - We don't care about valid entities here
                    new Entity('extension', 'order_line_item_foreign_keys_extension', {
                        id: 'extension2',
                        key: 'value',
                    })
                ]),
            }),
            // @ts-expect-error - We don't care about valid entities here
            new Entity('line_item_2', 'line_item', {
                id: 'line_item_2',
                quantity: 1,
                versionId: 1,
                price: {
                    unitPrice: 100,
                    totalPrice: 100,
                },
            }),
        ]),
    });
    
    // @ts-expect-error - Create circular reference
    entity.lineItems.first(0).children.getAt(0).parent = entity.lineItems.getAt(0);

    const messageData = {
      entity,
    };

    const result = serialize(messageData);

    // this is a regression test for a bug that caused the serializer to fail
    // expect the circular reference to be converted
    expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0] instanceof Entity).toBe(false);
    expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[1] instanceof Entity).toBe(false);
    expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0].__draft__.parent.children instanceof EntityCollection).toBe(false);
    expect(result.entity.__draft__.lineItems.__entities__[0].__draft__.children.__entities__[0].__draft__.parent).toStrictEqual({
        __$CR__: 'root.entity.lineItems.0'
    });

    const deserialized = deserialize(result, new MessageEvent('message'));

    // expect the circular reference to be converted back
    expect(deserialized.entity.lineItems.getAt(0).children.getAt(0).parent).toBe(deserialized.entity.lineItems.getAt(0));
  });
});
