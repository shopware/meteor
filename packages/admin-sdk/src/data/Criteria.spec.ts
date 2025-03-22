import Criteria, { setDefaultValues } from "./Criteria";

describe('Test Criteria class', () => {
  it('should default to page===1 & limit===0', () => {
    const criteria = new Criteria();

    expect(criteria.getLimit()).toBe(0);
    expect(criteria.getPage()).toBe(1);
  });

  it('should respect altered default values', () => {
    setDefaultValues({ limit: 42 });
    const criteria = new Criteria();

    expect(criteria.getLimit()).toBe(42);
    expect(criteria.getPage()).toBe(1);
  });

  it('should able to add a title', () => {
    const criteria = new Criteria();

    expect(criteria.getTitle()).toBe(null);
    criteria.setTitle('foo');
    expect(criteria.getTitle()).toBe('foo');
  });

  test('add query', () => {
    const criteria = new Criteria();

    criteria.addQuery(Criteria.equals("foo", "bar"), 100);

    const obj = criteria.parse();

    expect(obj.query).toEqual([
      { score: 100, query: { type: "equals", field: "foo", value: "bar" } },
    ]);
  });

  test('add query with score field', () => {
    const criteria = new Criteria();

    criteria.addQuery(Criteria.equals("foo", "bar"), 100, 'test');

    const obj = criteria.parse();

    expect(obj.query).toEqual([
      { score: 100, query: { type: "equals", field: "foo", value: "bar" }, scoreField: 'test' },
    ]);
  });
});
