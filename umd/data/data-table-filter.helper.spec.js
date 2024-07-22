var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Criteria", "./data-table-filter.helper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Criteria_1 = __importDefault(require("./Criteria"));
    const data_table_filter_helper_1 = require("./data-table-filter.helper");
    describe('src/app/service/criteria-helper.service.ts', () => {
        describe('addDataTableFilters', () => {
            it.each([
                { filters: [], expected: new Criteria_1.default() },
                {
                    filters: [
                        {
                            id: 'test',
                            label: 'Test',
                            type: {
                                id: 'options',
                                options: [],
                            },
                        },
                    ],
                    expected: new Criteria_1.default(),
                },
                {
                    filters: [
                        {
                            id: 'test',
                            label: 'Test',
                            type: {
                                id: 'options',
                                options: [
                                    {
                                        id: 'test',
                                        label: 'Test',
                                    },
                                ],
                            },
                        },
                    ],
                    expected: new Criteria_1.default().addFilter(Criteria_1.default.equals('test', 'test')),
                },
                {
                    filters: [
                        {
                            id: 'test',
                            label: 'Test',
                            type: {
                                id: 'options',
                                options: [
                                    {
                                        id: 'test',
                                        label: 'Test',
                                    },
                                    {
                                        id: 'test2',
                                        label: 'Test2',
                                    },
                                ],
                            },
                        },
                    ],
                    expected: new Criteria_1.default()
                        .addFilter(Criteria_1.default.equals('test', 'test'))
                        .addFilter(Criteria_1.default.equals('test', 'test2')),
                },
                {
                    filters: [
                        {
                            id: 'test',
                            label: 'Test',
                            type: {
                                id: 'options',
                                options: [
                                    {
                                        id: 'test',
                                        label: 'Test',
                                    },
                                ],
                            },
                        },
                        {
                            id: 'test2',
                            label: 'Test2',
                            type: {
                                id: 'options',
                                options: [
                                    {
                                        id: 'test2',
                                        label: 'Test2',
                                    },
                                ],
                            },
                        },
                    ],
                    expected: new Criteria_1.default()
                        .addFilter(Criteria_1.default.equals('test', 'test'))
                        .addFilter(Criteria_1.default.equals('test2', 'test2')),
                },
            ])('should adds filters to criteria', ({ filters, expected }) => {
                const result = (0, data_table_filter_helper_1.addDataTableFilters)(new Criteria_1.default(), filters);
                expect(result).toStrictEqual(expected);
            });
        });
    });
});
//# sourceMappingURL=data-table-filter.helper.spec.js.map