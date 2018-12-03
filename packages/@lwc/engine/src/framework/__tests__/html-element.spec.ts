import { compileTemplate } from 'test-utils';

import { createElement, LightningElement } from '../main';
import assertLogger from '../../shared/assert';
import { registerTemplate } from '../template';

const emptyTemplate = compileTemplate(`<template></template>`);

describe('html-element', () => {
    describe('#setAttributeNS()', () => {
        it('should set attribute on host element when element is nested in template', () => {
            class Child extends LightningElement {
                setFoo() {
                    this.setAttributeNS('x', 'foo', 'bar');
                }
            }
            Child.publicMethods = ['setFoo'];

            const html = compileTemplate(`
                <template>
                    <x-child></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }
            const element = createElement('should-set-attribute-on-host-element-when-element-is-nested-in-template', { is: Parent });
            document.body.appendChild(element);
            const child = element.shadowRoot.querySelector('x-child');
            child.setFoo();

            expect(child.hasAttributeNS('x', 'foo')).toBe(true);
            expect(child.getAttributeNS('x', 'foo')).toBe('bar');
        });

        it('should set attribute on host element', () => {
            class MyComponent extends LightningElement {
                setFoo() {
                    this.setAttributeNS('x', 'foo', 'bar');
                }
            }
            MyComponent.publicMethods = ['setFoo'];
            const element = createElement('x-foo', { is: MyComponent });
            element.setFoo();
            expect(element.hasAttributeNS('x', 'foo')).toBe(true);
            expect(element.getAttributeNS('x', 'foo')).toBe('bar');
        });

        it('should throw an error if attempting to call setAttributeNS during construction', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(() => {
                        this.setAttributeNS('x', 'foo', 'bar');
                    }).toThrowError("Assert Violation: Failed to construct '<x-foo>': The result must not have attributes.");
                }
            }
            createElement('x-foo', { is: MyComponent });
        });
    });

    describe('#setAttribute()', () => {
        it('should set attribute on host element when element is nested in template', () => {
            class Child extends LightningElement {
                setFoo() {
                    this.setAttribute('foo', 'bar');
                }
            }
            Child.publicMethods = ['setFoo'];

            const html = compileTemplate(`
                <template>
                    <x-child></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }
            const element = createElement('x-parent', { is: Parent });
            document.body.appendChild(element);

            const child = element.shadowRoot.querySelector('x-child');
            child.setFoo();

            expect(child.hasAttribute('foo')).toBe(true);
            expect(child.getAttribute('foo')).toBe('bar');
        });

        it('should set attribute on host element', () => {
            class MyComponent extends LightningElement {
                setFoo() {
                    this.setAttribute('foo', 'bar');
                }
            }
            MyComponent.publicMethods = ['setFoo'];

            const element = createElement('x-cmp', { is: MyComponent });

            element.setFoo();
            expect(element.hasAttribute('foo')).toBe(true);
            expect(element.getAttribute('foo')).toBe('bar');
        });

        it('should throw an error if attempting to call setAttribute during construction', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.setAttribute('foo', 'bar');
                }
            }
            expect(() => {
                createElement('throw-during-construction', { is: MyComponent });
            }).toThrowError(
                /The result must not have attributes./
            );
        });
    });

    describe('#removeAttributeNS()', () => {
        it('should remove namespaced attribute on host element when element is nested in template', () => {
            class Child extends LightningElement {
                removeTitle() {
                    this.removeAttributeNS('x', 'title');
                }
            }
            Child.publicMethods = ['removeTitle'];
            function html($api) {
                return [$api.c('x-child', Child, {
                    attrs: {
                        'x:title': 'foo',
                    }
                })];
            }
            registerTemplate(html);
            // TODO: The template compiler doesn't allow unknown attributes. This test should be revisited
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const element = createElement('remove-namespaced-attribute-on-host-element', { is: Parent });
            document.body.appendChild(element);

            const child = element.shadowRoot.querySelector('x-child');
            child.removeTitle();

            expect(child.hasAttributeNS('x', 'title')).toBe(false);
        });

        it('should remove attribute on host element', () => {
            class MyComponent extends LightningElement {
                removeTitle() {
                    this.removeAttributeNS('x', 'title');
                }
            }
            MyComponent.publicMethods = ['removeTitle'];
            const element = createElement('x-foo', { is: MyComponent });

            element.setAttributeNS('x', 'title', 'foo');
            element.removeTitle();

            expect(element.hasAttributeNS('x', 'title')).toBe(false);
        });
    });

    describe('#removeAttribute()', () => {
        it('should remove attribute on host element when element is nested in template', () => {
            class Child extends LightningElement {
                removeTitle() {
                    this.removeAttribute('title');
                }
            }
            Child.publicMethods = ['removeTitle'];

            const html = compileTemplate(`
                <template>
                    <x-child title="foo"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const element = createElement('element-is-nested-in-template', { is: Parent });
            document.body.appendChild(element);

            const child = element.shadowRoot.querySelector('x-child');
            child.removeTitle();

            expect(child.hasAttribute('title')).toBe(false);
        });

        it('should remove attribute on host element', () => {
            class MyComponent extends LightningElement {
                removeTitle() {
                    this.removeAttribute('title');
                }
            }
            MyComponent.publicMethods = ['removeTitle'];

            const element = createElement('should-remove-attribute-on-host-element', { is: MyComponent });
            element.title = 'foo';

            element.removeTitle();
            expect(element.hasAttribute('title')).toBe(false);
        });
    });

    describe('#getBoundingClientRect()', () => {
        it('should throw during construction', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.getBoundingClientRect();
                }
            }

            expect(() => {
                createElement('x-cmp', { is: MyComponent });
            }).toThrowError(
                /this.getBoundingClientRect\(\) should not be called during the construction/
            );
        });
    });

    describe('#classList()', () => {
        it('should throw when adding classList during construction', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.classList.add('foo');
                }
            }

            expect(() => {
                createElement('x-cmp', { is: MyComponent });
            }).toThrowError(
                /The result must not have attributes./
            );
        });

        it('should have a valid classList during connectedCallback', () => {
            expect.assertions(2);

            class MyComponent extends LightningElement {
                connectedCallback() {
                    this.classList.add('foo');
                    expect(this.classList.contains('foo')).toBe(true);
                }
            }

            const elm = createElement('x-cmp', { is: MyComponent });
            document.body.appendChild(elm);

            expect(elm.classList.contains('foo')).toBe(true);
        });
    });

    describe('#getAttributeNS()', () => {
        it('should return correct attribute value', () => {
            class MyComponent extends LightningElement {
                getXTitle() {
                    return this.getAttributeNS('x', 'title');
                }
            }
            MyComponent.publicMethods = ['getXTitle'];

            const elm = createElement('x-cmp', { is: MyComponent });
            elm.setAttributeNS('x', 'title', 'foo');

            expect(elm.getXTitle()).toBe('foo');
        });
    });

    describe('#getAttribute()', () => {
        it('should throw when no attribute name is provided', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.getAttribute();
                }
            }

            expect(() => {
                createElement('x-cmp', { is: MyComponent });
            }).toThrowError(
                /Failed to execute 'getAttribute'/
            );
        });
        it('should not throw when attribute name matches a declared public property', () => {
            expect.assertions(1);
            const def = class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(() => this.getAttribute('foo')).not.toThrow();
                }
            };
            def.publicProps = { foo: "default value" };
            createElement('x-foo', { is: def });
        });
        it('should be null for non-valid attribute names', () => {
            expect.assertions(3);
            const def = class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(this.getAttribute(null)).toBeNull();
                    expect(this.getAttribute(undefined)).toBeNull();
                    expect(this.getAttribute("")).toBeNull();
                }
            };
            createElement('x-foo', { is: def });
        });
        it('should be null for non-existing attributes', () => {
            expect.assertions(1);
            const def = class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(this.getAttribute("foo-bar-baz")).toBeNull();
                }
            };
            createElement('x-foo', { is: def });
        });

    });

    describe('#dispatchEvent', function() {
        it('should throw when event is dispatched during construction', function() {
            class Foo extends LightningElement {
                constructor() {
                    super();
                    this.dispatchEvent(new CustomEvent('constructorevent'));
                }
            }
            expect(() => {
                createElement('x-foo', { is: Foo });
            }).toThrow(
                /this.dispatchEvent\(\) should not be called during the construction/
            );
        });

        it('should log warning when element is not connected', function() {
            class Foo extends LightningElement {
                dispatch(evt) {
                    this.dispatchEvent(evt);
                }
            }
            Foo.publicMethods = ['dispatch'];

            const elm = createElement('x-foo', { is: Foo });

            expect(() => (
                elm.dispatch(new CustomEvent('warning'))
            )).toLogWarning(
                'Unreachable event "warning" dispatched from disconnected element <x-foo>. Events can only reach the parent element after the element is connected (via connectedCallback) and before the element is disconnected(via disconnectedCallback).'
            );
        });

        it('should not log warning when element is connected', function() {
            class Foo extends LightningElement {
                dispatch(evt) {
                    this.dispatchEvent(evt);
                }
            }
            Foo.publicMethods = ['dispatch'];

            const elm = createElement('x-foo', { is: Foo });
            document.body.appendChild(elm);

            expect(() => (
                elm.dispatch(new CustomEvent('warning'))
            )).not.toLogWarning();
        });

        it('should log warning when event name contains non-alphanumeric lowercase characters', function() {
            class Foo extends LightningElement {
                connectedCallback() {
                    this.dispatchEvent(new CustomEvent('foo1-$'));
                }
            }

            const elm = createElement('x-foo', { is: Foo });

            expect(() => (
                document.body.appendChild(elm)
            )).toLogWarning(
                `Invalid event type "foo1-$" dispatched in element <x-foo>. Event name should only contain lowercase alphanumeric characters.`
            );
        });

        it('should log warning when event name does not start with alphabetic lowercase characters', function() {
            class Foo extends LightningElement {
                connectedCallback() {
                    this.dispatchEvent(new CustomEvent('123'));
                }
            }
            const elm = createElement('x-foo', { is: Foo });

            expect(() => (
                document.body.appendChild(elm)
            )).toLogWarning(
                `Invalid event type "123" dispatched in element <x-foo>. Event name should only contain lowercase alphanumeric characters.`
            );
        });

        it('should not log warning for alphanumeric lowercase event name', function() {
            class Foo extends LightningElement {
                connectedCallback() {
                    this.dispatchEvent(new CustomEvent('foo1234abc'));
                }
            }

            const elm = createElement('x-foo', { is: Foo });

            expect(() => (
                document.body.appendChild(elm)
            )).not.toLogWarning();
        });

        it('should get native click event in host', function () {
            expect.assertions(3);

            let elm;

            const html = compileTemplate(`
                <template>
                    <div></div>
                </template>
            `);
            class Foo extends LightningElement {
                constructor() {
                    super();
                    this.template.addEventListener('click', (e) => {
                        expect(e.composed).toBe(true);
                        expect(e.target).toBe(this.template.querySelector('div')); // notice that target is visible for the root, always
                        expect(e.currentTarget).toBe(elm); // notice that currentTarget is host element instead of root since root is just an illusion for now.
                    });
                }
                render() {
                    return html;
                }
            }

            elm = createElement('x-foo', { is: Foo });
            document.body.appendChild(elm);

            elm.shadowRoot.querySelector('div').click();
        });

        it('should get native events from template', function () {
            expect.assertions(2);

            const html = compileTemplate(`
                <template>
                    <div onclick={handleClick}></div>
                </template>
            `);
            class Foo extends LightningElement {
                handleClick(e: Event) {
                    expect(e.target).toBe(this.template.querySelector('div'));
                    expect(e.currentTarget).toBe(this.template.querySelector('div'));
                }
                render() {
                    return html;
                }
            }

            const elm = createElement('x-foo', { is: Foo });
            document.body.appendChild(elm);

            elm.shadowRoot.querySelector('div').click();
        });

        it('should get custom events in root when marked as bubbles=true', function () {
            expect.assertions(6);
            let elm;

            const html = compileTemplate(`
                <template>
                    <div></div>
                </template>
            `);
            class Foo extends LightningElement {
                constructor() {
                    super();
                    this.template.addEventListener('xyz', (e) => {
                        expect(e.bubbles).toBe(true);
                        expect(e.target).toBe(this.template.querySelector('div')); // notice that target is host element
                        expect(e.currentTarget).toBe(elm); // notice that currentTarget is host element
                    });
                }
                render() {
                    return html;
                }
            }

            elm = createElement('x-foo', { is: Foo });
            document.body.appendChild(elm);

            const divElm = elm.shadowRoot.querySelector('div');
            divElm.dispatchEvent(new CustomEvent('xyz'));
            divElm.dispatchEvent(new CustomEvent('xyz', { bubbles: true, composed: true }));
            divElm.dispatchEvent(new CustomEvent('xyz', { bubbles: true, composed: false }));
        });

        it('should listen for custom events declare in template', function () {
            expect.assertions(6);

            const html = compileTemplate(`
                <template>
                    <div onxyz={handleXyz}></div>
                </template>
            `);
            class Foo extends LightningElement {
                handleXyz(e: Event) {
                    expect(e.target).toBe(this.template.querySelector('div'));
                    expect(e.currentTarget).toBe(this.template.querySelector('div'));
                }
                render() {
                    return html;
                }
            }

            const elm = createElement('x-foo', { is: Foo });
            document.body.appendChild(elm);

            const divElm = elm.shadowRoot.querySelector('div');
            divElm.dispatchEvent(new CustomEvent('xyz'));
            divElm.dispatchEvent(new CustomEvent('xyz', { bubbles: true, composed: true }));
            divElm.dispatchEvent(new CustomEvent('xyz', { bubbles: true, composed: false }));
        });
    });

    describe('#tagName', () => {
        it('should throw when accessed', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.tagName;
                }
            }

            expect(() => {
                createElement('x-foo', { is: MyComponent });
            }).toThrow(
                /Usage of property `tagName` is disallowed/
            );
        });
    });

    describe('#tracked', () => {
        it('should not warn if component has untracked state property', function() {
            class MyComponent extends LightningElement {
                state = {};
            }

            expect(() => (
                createElement('x-foo', { is: MyComponent })
            )).not.toLogWarning();
        });
        it('should not warn if component has tracked state property', function() {
            class MyComponent extends LightningElement {
                state = {};
            }
            MyComponent.track = { state: 1 };

            expect(() => (
                createElement('x-foo-tracked-state', { is: MyComponent })
            )).not.toLogWarning();
        });
        it('should be mutable during construction', () => {
            let state;
            const o = { foo: 1, bar: 2, baz: 1 };
            const def = class MyComponent extends LightningElement {
                state = {
                    foo: undefined,
                    bar: undefined,
                    baz: undefined,
                };
                constructor() {
                    super();
                    this.state = o;
                    this.state.baz = 3;
                    state = this.state;
                }
            };
            def.track = { state: 1 };
            createElement('x-foo', { is: def });
            expect(state.foo).toBe(1);
            expect(state.bar).toBe(2);
            expect(state.baz).toBe(3);
            expect(o.foo).toBe(1);
            expect(o.bar).toBe(2);
            expect(o.baz).toBe(3);
            expect(o).not.toBe(state);
        });
        it('should accept member properties', () => {
            let state;
            const o = { foo: 1 };
            const def = class MyComponent extends LightningElement {
                state = { x: 1, y: o };
                constructor() {
                    super();
                    state = this.state;
                }
            };
            def.track = { state: 1 };
            createElement('x-foo', { is: def });
            expect({ x: 1, y: o }).toEqual(state);
            expect(state.y).not.toBe(o);
        });
        it('should not throw an error when assigning observable object', function() {
            expect.assertions(1);
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(() => {
                        this.state = {};
                    }).not.toThrow();
                }
            }
            MyComponent.track = { state: 1 };
            createElement('x-foo', { is: MyComponent });
        });
    });

    describe('global HTML Properties', () => {
        it('should always return null', () => {
            expect.assertions(1);
            const def = class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(this.getAttribute('title')).toBeNull();
                }
            };
            createElement('x-foo', { is: def }).setAttribute('title', 'cubano');
        });

        it('should set user specified value during setAttribute call', () => {
            let userDefinedTabIndexValue = -1;
            class MyComponent extends LightningElement {
                renderedCallback() {
                    userDefinedTabIndexValue = this.getAttribute("tabindex");
                }
            }
            const elm = createElement('x-foo', {is: MyComponent});
            elm.setAttribute('tabindex', '0');
            document.body.appendChild(elm);

            expect(userDefinedTabIndexValue).toBe('0');
        }),

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should log console error when user land code changes attribute via querySelector', () => {
            jest.spyOn(assertLogger, 'logError');

            class Child extends LightningElement {}

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const parentElm = createElement('x-parent', { is: Parent });
            document.body.appendChild(parentElm);

            const childElm = parentElm.shadowRoot.querySelector('x-child');
            childElm.setAttribute('title', "value from parent");

            expect(assertLogger.logError).toBeCalled();
            assertLogger.logError.mockRestore();
        });

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should log console error when user land code removes attribute via querySelector', () => {
            jest.spyOn(assertLogger, 'logError');

            class Child extends LightningElement {}

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const parentElm = createElement('x-parent', { is: Parent });
            document.body.appendChild(parentElm);

            const childElm = parentElm.shadowRoot.querySelector('x-child');
            childElm.removeAttribute('title');

            expect(assertLogger.logError).toBeCalled();
            assertLogger.logError.mockRestore();
        });

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should log error message when attribute is set via elm.setAttribute if reflective property is defined', () => {
            jest.spyOn(assertLogger, 'logError');

            class Child extends LightningElement {}

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
                renderedCallback() {
                    this.template.querySelector('x-child').setAttribute('tabindex', 0);
                }
            }

            const elm = createElement('x-foo', {is: Parent});
            document.body.appendChild(elm);

            return Promise.resolve().then( () => {
                expect(assertLogger.logError).toBeCalled();
                assertLogger.logError.mockRestore();
            });
        });

        it('should not throw when accessing attribute in root elements', () => {
            class Parent extends LightningElement {}
            const elm = createElement('x-foo', {is: Parent});
            document.body.appendChild(elm);
            elm.setAttribute('tabindex', 1);
        });

        it('should delete existing attribute prior rendering', () => {
            const def = class MyComponent extends LightningElement {};
            const elm = createElement('x-foo', { is: def });
            elm.setAttribute('title', 'parent title');
            elm.removeAttribute('title');
            document.body.appendChild(elm);

            expect(elm.getAttribute('title')).not.toBe('parent title');
        });
    });

    describe('#toString()', () => {
        it('should rely on the class.name', () => {
            expect.assertions(1);
            const def = class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(this.toString()).toBe('[object MyComponent]');
                }
            };
            createElement('x-foo', { is: def });
        });
    });

    describe('#data layer', () => {
        it('should allow custom instance getter and setter', () => {
            let cmp, a, ctx;

            class MyComponent extends LightningElement  {
                constructor() {
                    super();
                    cmp = this;
                }
                setFoo() {
                    Object.defineProperty(this, 'foo', {
                        set(value) {
                            ctx = this;
                            a = value;
                        }
                    });
                }
            }
            MyComponent.publicProps = { foo: true };
            MyComponent.publicMethods = ['setFoo'];

            const elm = createElement('x-foo', { is: MyComponent });
            elm.foo = 1;
            document.body.appendChild(elm);
            elm.setFoo();
            elm.foo = 2;

            expect(a).toBe(2);
            expect(cmp).toBe(ctx);
        });
    });

    describe('#tabIndex', function() {
        it('should have a valid value during connectedCallback', function() {
            expect.assertions(1);

            class MyComponent extends LightningElement {
                connectedCallback() {
                    expect(this.tabIndex).toBe(3);
                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('tabindex', 3);
            document.body.appendChild(elm);
        });

        it('should have a valid value after initial render', function() {
            class MyComponent extends LightningElement {
                getTabIndex() {
                    return this.tabIndex;
                }
            }
            MyComponent.publicMethods = ['getTabIndex'];

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('tabindex', 3);
            document.body.appendChild(elm);

            expect(elm.getTabIndex()).toBe(3);
        });

        it('should set tabindex correctly', function() {
            class MyComponent extends LightningElement {
                connectedCallback() {
                    this.tabIndex = 2;
                }

                getTabIndex() {
                    return this.tabIndex;
                }
            }
            MyComponent.publicMethods = ['getTabIndex'];

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('tabindex', 3);
            document.body.appendChild(elm);

            expect(elm.tabIndex).toBe(2);
            expect(elm.getTabIndex()).toBe(2);
        });

        it('should not trigger render cycle', function() {
            let callCount = 0;
            class MyComponent extends LightningElement {
                connectedCallback() {
                    this.tabIndex = 2;
                }
                render() {
                    callCount += 1;
                    return emptyTemplate;
                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('tabindex', 3);
            document.body.appendChild(elm);

            return Promise.resolve().then(() => {
                expect(callCount).toBe(1);
            });
        });

        it('should allow parent component to overwrite internally set tabIndex', function() {
            class MyComponent extends LightningElement {
                connectedCallback() {
                    this.tabIndex = 2;
                }

                getTabIndex() {
                    return this.tabIndex;
                }
            }
            MyComponent.publicMethods = ['getTabIndex'];

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('tabindex', 3);
            document.body.appendChild(elm);
            elm.setAttribute('tabindex', 4);


            expect(elm.tabIndex).toBe(4);
            expect(elm.getTabIndex()).toBe(4);
        });

        it('should throw if setting tabIndex during render', function() {
            class MyComponent extends LightningElement {
                render() {
                    this.tabIndex = 2;
                    return emptyTemplate;
                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            expect(() => {
                document.body.appendChild(elm);
            }).toThrowError(
                /render\(\) method has side effects on the state/
            );
        });

        it('should throw if setting tabIndex during construction', function() {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.tabIndex = 2;
                }
            }

            expect(() => {
                createElement('x-foo', { is: MyComponent });
            }).toThrowError(
                /The result must not have attributes./
            );
        });

        it('should not throw when tabIndex is not reflected to element', () => {
            class MyComponent extends LightningElement {
                get tabIndex() {
                    return 0;
                }

                set tabIndex(value) {

                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            expect(() => {
                elm.tabIndex = -1;
            }).not.toThrow();
        });

        it('should not throw when tabIndex is reflected to element', () => {
            class MyComponent extends LightningElement {
                get tabIndex() {
                    return this.getAttribute('tabindex');
                }

                set tabIndex(value) {
                    this.setAttribute('tabindex', value);
                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            expect(() => {
                elm.tabIndex = -1;
            }).not.toThrow();
        });
    });

    describe('life-cycles', function() {
        it('should guarantee that the element is rendered when inserted in the DOM', function() {
            let rendered = 0;
            class MyComponent extends LightningElement {
                render() {
                    rendered++;
                    return emptyTemplate;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            expect(rendered).toBe(0);
            document.body.appendChild(elm);
            expect(rendered).toBe(1);
        });

        it('should guarantee that the connectedCallback is invoked sync after the element is inserted in the DOM', function() {
            let called = 0;
            class MyComponent extends LightningElement {
                render() {
                    return emptyTemplate;
                }
                connectedCallback() {
                    called++;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            expect(called).toBe(0);
            document.body.appendChild(elm);
            expect(called).toBe(1);
        });

        it('should guarantee that the connectedCallback is invoked before render after the element is inserted in the DOM', function() {
            const ops: string[] = [];
            class MyComponent extends LightningElement {
                render() {
                    ops.push('render');
                    return emptyTemplate;
                }
                connectedCallback() {
                    ops.push('connected');
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            expect(ops).toEqual(['connected', 'render']);
        });

        it('should guarantee that the disconnectedCallback is invoked sync after the element is removed from the DOM', function() {
            let called = 0;
            class MyComponent extends LightningElement {
                disconnectedCallback() {
                    called++;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            expect(called).toBe(0);
            document.body.removeChild(elm);
            expect(called).toBe(1);
        });

        it('should not render even if there is a mutation if the element is not in the DOM yet', function() {
            let rendered = 0;
            class MyComponent extends LightningElement {
                render() {
                    rendered++;
                    this.x; // reactive
                    return emptyTemplate;
                }
            }
            MyComponent.publicProps = { x: 1 };
            const elm = createElement('x-foo', { is: MyComponent });
            elm.x = 2;
            return Promise.resolve().then(() => {
                expect(rendered).toBe(0);
            });
        });

        it('should not render if the element was removed from the DOM', function() {
            let rendered = 0;
            class MyComponent extends LightningElement {
                render() {
                    rendered++;
                    this.x; // reactive
                    return emptyTemplate;
                }
            }
            MyComponent.publicProps = { x: 1 };
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            document.body.removeChild(elm);
            expect(rendered).toBe(1);
            elm.x = 2;
            return Promise.resolve().then(() => {
                expect(rendered).toBe(1);
            });
        });

        it('should observe moving the element thru the DOM tree', function() {
            let rendered = 0;
            let connected = 0;
            let disconnected = 0;
            class MyComponent extends LightningElement {
                render() {
                    rendered++;
                    return emptyTemplate;
                }
                connectedCallback() {
                    connected++;
                }
                disconnectedCallback() {
                    disconnected++;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            expect(rendered).toBe(0);
            document.body.appendChild(elm);
            expect(rendered).toBe(1);
            const div = document.createElement('div');
            document.body.appendChild(div);
            div.appendChild(elm);
            expect(rendered).toBe(2);
            expect(connected).toBe(2);
            expect(disconnected).toBe(1);
        });

        it('should not throw error when accessing a non-observable property from tracked property when not rendering', function() {
            class MyComponent extends LightningElement {
                state = {};
                set foo(value) {
                    this.state.foo = value;
                }
                get foo() {
                    return this.state.foo;
                }
            }

            MyComponent.publicProps = {
                foo: {}
            };

            MyComponent.track = { state: 1 };

            const elm = createElement('x-foo', { is: MyComponent });
            elm.foo = new Map();
            expect(() => {
                elm.foo;
            }).not.toThrow();
        });

        it('should not log a warning when setting tracked value to null', function() {
            class MyComponent extends LightningElement {
                state = {};
                connectedCallback() {
                    this.state.foo = null;
                    this.state.foo;
                }
            }
            MyComponent.track = { state: 1 };
            const elm = createElement('x-foo-tracked-null', { is: MyComponent });

            expect(() => (
                document.body.appendChild(elm)
            )).not.toLogWarning();
        });

        it('should not log a warning when initializing api value to null', function() {
            class MyComponent extends LightningElement {
                foo = null;
            }
            MyComponent.publicProps = {
                foo: {}
            };
            const elm = createElement('x-foo-init-api', { is: MyComponent });

            expect(() => (
                document.body.appendChild(elm)
            )).not.toLogWarning();
        });
    });

    describe('Inheritance', () => {
        it('should inherit public getters and setters correctly', () => {
            class MyParent extends LightningElement {
                get foo() {}
                set foo(value) {}
            }
            MyParent.publicProps = {
                foo: {}
            };
            class MyComponent extends MyParent {

            }
            expect(() => {
                createElement('getter-inheritance', { is: MyComponent })
            }).not.toThrow();
        });

        it('should call correct inherited public setter', () => {
            let count = 0;
            class MyParent extends LightningElement {
                get foo() {}
                set foo(value) {
                    count += 1;
                }
            }
            MyParent.publicProps = {
                foo: {}
            };
            class MyComponent extends MyParent {

            }

            const elm = createElement('getter-inheritance', { is: MyComponent });
            elm.foo = 'bar';
            expect(count).toBe(1);
        });
    });

    describe('Aria Properties', () => {
        describe('#role', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-aria-role', { is: MyComponent });
                element.role = 'tab';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'role')).toBe('tab');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-role', { is: MyComponent });
                element.role = 'tab';
                expect(element.role).toBe('tab');
            });

            it('should return correct value when nothing has been set', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-role', { is: MyComponent });
                expect(element.role).toBe(null);
            });

            it('should return null by default', () => {
                class MyComponent extends LightningElement {}
                const element = createElement('prop-getter-aria-role', { is: MyComponent });
                document.body.appendChild(element);
                expect(element.role).toBe(null);
            });

            it('should call setter when defined', () => {
                let called = 0;
                class MyComponent extends LightningElement {
                    get role() {}
                    set role(value) {
                        called += 1;
                    }
                }
                MyComponent.publicProps = {
                    role: {}
                };
                const element = createElement('prop-getter-aria-role', { is: MyComponent });
                document.body.appendChild(element);
                element.role = 'tab';
                expect(called).toBe(1);
            });
        });

        describe('#ariaChecked', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-aria-checked', { is: MyComponent });
                element.ariaChecked = 'true';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'aria-checked')).toBe('true');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-checked', { is: MyComponent });
                element.ariaChecked = 'true';
                expect(element.ariaChecked).toBe('true');
            });

            it('should return correct value when nothing has been set', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-checked', { is: MyComponent });
                expect(element.ariaChecked).toBe(null);
            });
        });

        describe('#ariaLabel', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-aria-label', { is: MyComponent });
                element.ariaLabel = 'label';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'aria-label')).toBe('label');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-label', { is: MyComponent });
                element.ariaLabel = 'label';
                expect(element.ariaLabel).toBe('label');
            });

            it('should return correct value when nothing has been set', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-aria-label', { is: MyComponent });
                expect(element.ariaLabel).toBe(null);
            });
        });
    });

    describe('global HTML Properties', () => {
        describe('#lang', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-lang', { is: MyComponent });
                element.lang = 'en';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'lang')).toBe('en');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-lang', { is: MyComponent });
                element.lang = 'en';
                expect(element.lang).toBe('en');
            });

            it('should call setter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    set lang(value) {
                        count += 1;
                    }
                    get lang() {}
                }
                MyComponent.publicProps = {
                    lang: {}
                };

                const element = createElement('prop-setter-lang', { is: MyComponent });
                element.lang = 'en';

                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        {lang}
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set lang(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count += 1;
                    }
                }

                const element = createElement('prop-setter-lang-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.lang = 'en';
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    get lang() {
                        count += 1;
                        return 'en';
                    }
                }
                MyComponent.publicProps = {
                    lang: {}
                };

                const element = createElement('prop-getter-lang-imperative', { is: MyComponent });

                expect(element.lang).toBe('en');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{lang}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount++;
                    }
                }
                const element = createElement('prop-lang-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.lang = 'en';
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('en');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.lang = 'en';
                    }
                }
                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );
            });
        });

        describe('#hidden', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-hidden', { is: MyComponent });
                element.hidden = true;
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'hidden')).toBe('');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-hidden', { is: MyComponent });
                element.hidden = true;
                expect(element.hidden).toBe(true);
            });

            it('should call setter defined in component', () => {
                let count = 0;
                class MyComponent extends LightningElement {
                    set hidden(value) {
                        count += 1;
                    }
                    get hidden() {}
                }
                MyComponent.publicProps = {
                    hidden: {}
                };

                const element = createElement('prop-setter-hidden', { is: MyComponent });
                element.hidden = true;

                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{hidden}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set hidden(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count++;
                    }
                }
                const element = createElement('prop-setter-hidden-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.hidden = true;
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    get hidden() {
                        count += 1;
                        return 'hidden';
                    }
                }
                MyComponent.publicProps = {
                    hidden: {}
                };

                const element = createElement('prop-getter-hidden-imperative', { is: MyComponent });

                expect(element.hidden).toBe('hidden');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{hidden}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount++;
                    }
                }

                const element = createElement('prop-hidden-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.hidden = true;
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('true');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.hidden = true;
                    }
                }

                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );

            });
        });

        describe('#dir', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-dir', { is: MyComponent });
                element.dir = 'ltr';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'dir')).toBe('ltr');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-dir', { is: MyComponent });
                element.dir = 'ltr';
                expect(element.dir).toBe('ltr');
            });

            it('should call setter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    set dir(value) {
                        count += 1;
                    }
                    get dir() {}
                }

                MyComponent.publicProps = {
                    dir: {}
                };

                const element = createElement('prop-setter-dir', { is: MyComponent });
                element.dir = 'ltr';

                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{dir}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set dir(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count++;
                    }
                }

                const element = createElement('prop-setter-dir-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.dir = 'ltr';
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    get dir() {
                        count += 1;
                        return 'ltr';
                    }
                }
                MyComponent.publicProps = {
                    dir: {}
                };

                const element = createElement('prop-getter-dir-imperative', { is: MyComponent });

                expect(element.dir).toBe('ltr');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{dir}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount++;
                    }
                }

                const element = createElement('prop-dir-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.dir = 'ltr';
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('ltr');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.dir = 'ltr';
                    }
                }
                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );

            });
        });

        describe('#id', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-id', { is: MyComponent });
                element.id = 'id';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'id')).toBe('id');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-id', { is: MyComponent });
                element.id = 'id';
                expect(element.id).toBe('id');
            });

            it('should call setter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    set id(value) {
                        count += 1;
                    }
                    get id() {}
                }
                MyComponent.publicProps = {
                    id: {}
                };

                const element = createElement('prop-setter-id', { is: MyComponent });
                element.id = 'id';

                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{id}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set id(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count++;
                    }
                }

                const element = createElement('prop-setter-id-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.id = 'ltr';
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    get id() {
                        count += 1;
                        return 'id';
                    }
                }
                MyComponent.publicProps = {
                    id: {}
                };

                const element = createElement('prop-getter-id-imperative', { is: MyComponent });

                expect(element.id).toBe('id');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{id}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount += 1;
                    }
                }

                const element = createElement('prop-id-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.id = 'id';
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('id');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.id = 'id';
                    }
                }
                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );

            });
        });

        describe('#accessKey', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-accessKey', { is: MyComponent });
                element.accessKey = 'accessKey';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'accesskey')).toBe('accessKey');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-accessKey', { is: MyComponent });
                element.accessKey = 'accessKey';
                expect(element.accessKey).toBe('accessKey');
            });

            it('should call setter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    set accessKey(value) {
                        count += 1;
                    }
                    get accessKey() {}
                }
                MyComponent.publicProps = {
                    accessKey: {}
                };

                const element = createElement('prop-setter-accessKey', { is: MyComponent });
                element.accessKey = 'accessKey';

                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{accessKey}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set accessKey(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count += 1;
                    }
                }

                const element = createElement('prop-setter-accessKey-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.accessKey = 'accessKey';
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;
                class MyComponent extends LightningElement {
                    get accessKey() {
                        count += 1;
                        return 'accessKey';
                    }
                }
                MyComponent.publicProps = {
                    accessKey: {}
                };
                const element = createElement('prop-getter-accessKey-imperative', { is: MyComponent });
                expect(element.accessKey).toBe('accessKey');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{accessKey}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount++;
                    }
                }

                const element = createElement('prop-accessKey-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.accessKey = 'accessKey';
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('accessKey');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.accessKey = 'accessKey';
                    }
                }
                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );

            });
        });

        describe('#title', () => {
            it('should reflect attribute by default', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-reflect-title', { is: MyComponent });
                element.title = 'title';
                expect(HTMLEmbedElement.prototype.getAttribute.call(element, 'title')).toBe('title');
            });

            it('should return correct value from getter', () => {
                class MyComponent extends LightningElement {

                }
                const element = createElement('prop-getter-title', { is: MyComponent });
                element.title = 'title';
                expect(element.title).toBe('title');
            });

            it('should call setter defined in component', () => {
                let count = 0;
                class MyComponent extends LightningElement {
                    set title(value) {
                        count += 1;
                    }
                    get title() {}
                }
                MyComponent.publicProps = {
                    title: {}
                };
                const element = createElement('prop-setter-title', { is: MyComponent });
                element.title = {},
                expect(count).toBe(1);
            });

            it('should not be reactive when defining own setter', () => {
                let count = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{title}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    set title(value) {}
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        count++;
                    }
                }

                const element = createElement('prop-setter-title-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.title = 'title';
                return Promise.resolve().then(() => {
                    expect(count).toBe(1);
                });
            });

            it('should call getter defined in component', () => {
                let count = 0;

                class MyComponent extends LightningElement {
                    get title() {
                        count += 1;
                        return 'title';
                    }
                }
                MyComponent.publicProps = {
                    title: {}
                };

                const element = createElement('prop-getter-title-imperative', { is: MyComponent });

                expect(element.title).toBe('title');
                expect(count).toBe(1);
            });

            it('should be reactive by default', () => {
                let renderCount = 0;

                const html = compileTemplate(`
                    <template>
                        <div>{title}</div>
                    </template>
                `);
                class MyComponent extends LightningElement {
                    render() {
                        return html;
                    }
                    renderedCallback() {
                        renderCount += 1;
                    }
                }

                const element = createElement('prop-title-reactive', { is: MyComponent });
                document.body.appendChild(element);

                element.title = 'title';
                return Promise.resolve().then(() => {
                    expect(renderCount).toBe(2);
                    expect(element.shadowRoot.querySelector('div').textContent).toBe('title');
                });
            });

            it('should throw an error when setting default value in constructor', () => {
                class MyComponent extends LightningElement {
                    constructor() {
                        super();
                        this.title = 'title';
                    }
                }
                expect(() => {
                    createElement('x-foo', { is: MyComponent });
                }).toThrowError(
                    /The result must not have attributes./
                );

            });
        });

        it('should always return null', () => {
            expect.assertions(1);

            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    expect(this.getAttribute('title')).toBeNull();
                }
            }

            const elm = createElement('x-foo', { is: MyComponent });
            elm.setAttribute('title', 'cubano');
        });

        it('should set user specified value during setAttribute call', () => {
            let userDefinedTabIndexValue = -1;

            class MyComponent extends LightningElement {
                renderedCallback() {
                    userDefinedTabIndexValue = this.getAttribute("tabindex");
                }
            }

            const elm = createElement('x-foo', {is: MyComponent});
            elm.setAttribute('tabindex', '0');
            document.body.appendChild(elm);

            expect(userDefinedTabIndexValue).toBe('0');
        }),

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should log console error when user land code changes attribute via querySelector', () => {
            jest.spyOn(assertLogger, 'logError');

            class Child extends LightningElement {}

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const parentElm = createElement('x-parent', { is: Parent });
            document.body.appendChild(parentElm);

            const childElm = parentElm.shadowRoot.querySelector('x-child');
            childElm.setAttribute('title', "value from parent");

            expect(assertLogger.logError).toBeCalled();
            assertLogger.logError.mockRestore();
        });

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should log console error when user land code removes attribute via querySelector', () => {
            jest.spyOn(assertLogger, 'logError');

            class Child extends LightningElement {}

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const parentElm = createElement('x-parent', { is: Parent });
            document.body.appendChild(parentElm);

            const childElm = parentElm.shadowRoot.querySelector('x-child');
            childElm.removeAttribute('title');

            expect(assertLogger.logError).toBeCalled();
            assertLogger.logError.mockRestore();
        });

        it('should log console error accessing props in constructor', () => {
            class MyComponent extends LightningElement {
                constructor() {
                    super();
                    this.a = this.title;
                }
            }

            expect(() => {
                createElement('prop-setter-title', { is: MyComponent });
            }).toLogError(
                `[object:vm MyComponent (0)] constructor should not read the value of property "title". The owner component has not yet set the value. Instead use the constructor to set default values for properties.`
            );
        });

        // TODO: This test log multiple errors. We should fix this before migrating to expect().toLogError()
        it('should not log error message when arbitrary attribute is set via elm.setAttribute', () => {
            jest.spyOn(assertLogger, 'logError');
            class MyComponent extends LightningElement {}
            const elm = createElement('x-foo', {is: MyComponent});
            elm.setAttribute('foo', 'something');
            document.body.appendChild(elm);

            return Promise.resolve().then( () => {
                expect(assertLogger.logError).not.toBeCalled();
                assertLogger.logError.mockRestore();
            });
        });

        it('should delete existing attribute prior rendering', () => {
            const def = class MyComponent extends LightningElement {}
            const elm = createElement('x-foo', { is: def });
            elm.setAttribute('title', 'parent title');
            elm.removeAttribute('title');
            document.body.appendChild(elm);

            return Promise.resolve().then( () => {
                expect(elm.getAttribute('title')).not.toBe('parent title');
            });
        });

        it('should correctly set child attribute', () => {
            let childTitle = null;

            class Child extends LightningElement {
                renderedCallback() {
                    childTitle = this.getAttribute('title');
                }
            }

            const html = compileTemplate(`
                <template>
                    <x-child title="child title"></x-child>
                </template>
            `, {
                modules: {
                    'x-child': Child
                }
            });
            class Parent extends LightningElement {
                render() {
                    return html;
                }
            }

            const parentElm = createElement('x-parent', { is: Parent });
            parentElm.setAttribute('title', 'parent title');
            document.body.appendChild(parentElm);
            const childElm = parentElm.shadowRoot.querySelector('x-child');

            expect(childElm.getAttribute('title')).toBe('child title');
        });
    });

    describe('integration', () => {
        describe('with locker', () => {
            it('should support manual construction', () => {
                const seed = {};
                function SecureBase() {
                    if (this instanceof SecureBase) {
                        LightningElement.prototype.constructor.call(this);
                    } else {
                        return LightningElement;
                    }
                }
                SecureBase.__circular__ = true;
                const html = compileTemplate(`<template></template>`);
                class Foo extends SecureBase {
                    render() {
                        return html;
                    }
                }
                const elm = createElement('x-parent', { is: Foo });
                document.body.appendChild(elm);
            });
        });
    });

    describe('.template', () => {
        describe('.activeElement', () => {
            it('should be null when no active element is found', () => {
                let template;
                const html = compileTemplate(`
                    <template>
                        <input />
                    </template>
                `);
                class Foo extends LightningElement {
                    constructor() {
                        super();
                        template = this.template;
                    }
                    render() {
                        return html;
                    }
                }
                const elm = createElement('x-parent', { is: Foo });
                document.body.appendChild(elm);
                expect(template.activeElement).toBe(null);
            });

            it('should be null when the active element is outside of the shadow', () => {
                let template;
                const html = compileTemplate(`
                    <template>
                        <input />
                    </template>
                `);
                class Foo extends LightningElement {
                    constructor() {
                        super();
                        template = this.template;
                    }
                    render() {
                        return html;
                    }
                }
                const elm = createElement('x-parent', { is: Foo });
                const outsideInput = document.createElement('input');
                document.body.appendChild(elm);
                document.body.appendChild(outsideInput);
                outsideInput.focus();
                expect(template.activeElement).toBe(null);
                expect(document.activeElement).toBe(outsideInput);
            });

            it('should be a local input when focused', () => {
                let template;
                const html = compileTemplate(`
                    <template>
                        <input />
                    </template>
                `);
                class Foo extends LightningElement {
                    constructor() {
                        super();
                        template = this.template;
                    }
                    render() {
                        return html;
                    }
                }
                const elm = createElement('x-parent', { is: Foo });
                document.body.appendChild(elm);
                const input = template.querySelector('input');
                input.focus();
                expect(template.activeElement).toBe(input);
            });
        });
    });
});