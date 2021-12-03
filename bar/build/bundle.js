
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value' || descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.20.1 */

    const file = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[30], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 1073741824) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[30], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[30], dirty, null));
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();
    const defaultBasepath = "/";

    function instance($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $prevLocation;
    	let $activeRoute;
    	let $announcementText;
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, "announcementText");
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(17, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(19, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(16, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, "prevLocation");
    	component_subscribe($$self, prevLocation, value => $$invalidate(18, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, "Only top-level Routers can have a \"basepath\" prop. It is ignored.", { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ["basepath", "url", "history", "primary", "a11y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("$$scope" in $$props) $$invalidate(30, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			 if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, "You cannot change the \"basepath\" prop. It is ignored.");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 196608) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 327680) {
    			// Manage focus and announce navigation to screen reader users
    			 {
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 524288) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			 if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		hasActiveRoute,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		level,
    		getInitialLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$$scope,
    		$$slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.20.1 */
    const file$1 = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[2],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$1(ctx) {
    	let current;

    	const router = new Router({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params*/ 8388629) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, $params, $location*/ 8388628) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[23], get_default_slot_context), get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, get_default_slot_changes));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[2] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3604)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 4 && { location: /*$location*/ ctx[2] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$1, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$1, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();

    function instance$1($$self, $$props, $$invalidate) {
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $parentBase;
    	let $location;
    	let $activeRoute;
    	let $params;
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId$1();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, "parentBase");
    	component_subscribe($$self, parentBase, value => $$invalidate(15, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, "params");
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Route", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("path" in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ("$$scope" in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		$parentBase,
    		$location,
    		isActive,
    		$activeRoute,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ("ssrMatch" in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ("isActive" in $$props) $$invalidate(3, isActive = $$new_props.isActive);
    	};

    	let isActive;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 45062) {
    			 {
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 81920) {
    			 $$invalidate(3, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 81928) {
    			 if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		$location,
    		isActive,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$parentBase,
    		$activeRoute,
    		registerRoute,
    		unregisterRoute,
    		focusElement,
    		route,
    		$$props,
    		$$slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.20.1 */
    const file$2 = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[1], /*props*/ ctx[2]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$2, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 131072) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
    				}
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 2 && /*ariaCurrent*/ ctx[1],
    				dirty & /*props*/ 4 && /*props*/ ctx[2]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(9, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Link", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(15, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		ariaCurrent,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(15, $$props = assign(assign({}, $$props), $$new_props));
    		if ("to" in $$props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(11, isCurrent = $$new_props.isCurrent);
    		if ("ariaCurrent" in $$props) $$invalidate(1, ariaCurrent = $$new_props.ariaCurrent);
    		if ("props" in $$props) $$invalidate(2, props = $$new_props.props);
    	};

    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 544) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			 $$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 513) {
    			 $$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 513) {
    			 $$invalidate(11, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 2048) {
    			 $$invalidate(1, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		 $$invalidate(2, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		ariaCurrent,
    		props,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		dispatch,
    		resolve,
    		navigate,
    		$$props,
    		$$restProps,
    		$$scope,
    		$$slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !("to" in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var localstorageSlim = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){return (()=>{var t={d:(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]});},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{default:()=>p});const r=(...t)=>{},n=t=>null!==t&&"Object"===t.constructor.name;let c;const o=()=>{if(void 0!==c)return c;c=!0;try{localStorage||(c=!1);}catch(t){c=!1;}return i(),c},l=String.fromCharCode(0),a=(t,e,r=!0)=>r?[...JSON.stringify(t)].map((t=>String.fromCharCode(t.charCodeAt(0)+e))).join(""):JSON.parse([...t].map((t=>String.fromCharCode(t.charCodeAt(0)-e))).join("")),s={ttl:null,encrypt:!1,encrypter:a,decrypter:(t,e)=>a(t,e,!1),secret:75},i=(t=!1)=>{if(!o())return !1;Object.keys(localStorage).forEach((e=>{const r=localStorage.getItem(e);if(!r)return;let c;try{c=JSON.parse(r);}catch(t){return}n(c)&&l in c&&(Date.now()>c.ttl||t)&&localStorage.removeItem(e);}));},p={config:s,set:(t,e,n={})=>{if(!o())return !1;const c=Object.assign(Object.assign(Object.assign({},s),n),{encrypt:!1!==n.encrypt&&(n.encrypt||s.encrypt),ttl:null===n.ttl?null:n.ttl||s.ttl});try{let n=c.ttl&&c.ttl>0?{[l]:e,ttl:Date.now()+1e3*c.ttl}:e;c.encrypt&&(c.ttl&&l in n?n[l]=(c.encrypter||r)(n[l],c.secret):n=(c.encrypter||r)(n,c.secret)),localStorage.setItem(t,JSON.stringify(n));}catch(t){return !1}},get:(t,e={})=>{if(!o())return null;const c=localStorage.getItem(t);if(!c)return null;const a=Object.assign(Object.assign(Object.assign({},s),e),{encrypt:!1!==e.encrypt&&(e.encrypt||s.encrypt),ttl:null===e.ttl?null:e.ttl||s.ttl});let i=JSON.parse(c);const p=n(i)&&l in i;if(a.decrypt||a.encrypt)try{p?i[l]=(a.decrypter||r)(i[l],a.secret):i=(a.decrypter||r)(i,a.secret);}catch(t){}return p?Date.now()>i.ttl?(localStorage.removeItem(t),null):i[l]:i},flush:i,clear:()=>{if(!o())return !1;localStorage.clear();},remove:t=>{if(!o())return !1;localStorage.removeItem(t);}};return e.default})()}));
    //# sourceMappingURL=localstorage-slim.js.map
    });
    var localstorageSlim_1 = localstorageSlim.ls;

    let user;
    let location = writable(null);
    const userTokenTTL = 600;

    // if user is not idle reset the cooldown
    localstorageSlim.flush();
    if (localstorageSlim.get('user')) {
       localstorageSlim.set('user', localstorageSlim.get('user'), { ttl: userTokenTTL });
    }

    function auth() {
       if (localstorageSlim.get('user')) {
          // validate user
          {
             user = writable({
                username: localstorageSlim.get('user', { decrypt: true }).username,
                token: localstorageSlim.get('user', { decrypt: true }).token,
                access: localstorageSlim.get('user', { decrypt: true }).access,
             });
          }
       } else {
          user = writable(null);
       }
    } auth();

    /* src\routes\~login\index.svelte generated by Svelte v3.20.1 */
    const file$3 = "src\\routes\\~login\\index.svelte";

    function create_fragment$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let input0;
    	let t0;
    	let ion_icon0;
    	let t1;
    	let div1;
    	let input1;
    	let t2;
    	let ion_icon1;
    	let t3;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			ion_icon0 = element("ion-icon");
    			t1 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t2 = space();
    			ion_icon1 = element("ion-icon");
    			t3 = space();
    			button = element("button");
    			button.textContent = "ورود";
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "placeholder", "نام کاربری");
    			attr_dev(input0, "class", "svelte-odh5to");
    			add_location(input0, file$3, 27, 9, 659);
    			set_custom_element_data(ion_icon0, "name", "person-circle-outline");
    			set_custom_element_data(ion_icon0, "class", "svelte-odh5to");
    			add_location(ion_icon0, file$3, 28, 9, 750);
    			attr_dev(div0, "class", "wrapper svelte-odh5to");
    			add_location(div0, file$3, 26, 6, 627);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "رمز عبور");
    			attr_dev(input1, "class", "svelte-odh5to");
    			add_location(input1, file$3, 31, 9, 854);
    			set_custom_element_data(ion_icon1, "name", "keypad-outline");
    			set_custom_element_data(ion_icon1, "class", "svelte-odh5to");
    			add_location(ion_icon1, file$3, 32, 9, 947);
    			attr_dev(div1, "class", "wrapper svelte-odh5to");
    			add_location(div1, file$3, 30, 6, 822);
    			attr_dev(button, "id", "login");
    			attr_dev(button, "class", "svelte-odh5to");
    			add_location(button, file$3, 34, 6, 1012);
    			attr_dev(div2, "class", "form svelte-odh5to");
    			add_location(div2, file$3, 25, 3, 601);
    			attr_dev(div3, "class", "canvas svelte-odh5to");
    			add_location(div3, file$3, 24, 0, 576);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(div0, t0);
    			append_dev(div0, ion_icon0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div1, t2);
    			append_dev(div1, ion_icon1);
    			append_dev(div2, t3);
    			append_dev(div2, button);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    				listen_dev(button, "click", /*login*/ ctx[2], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(3, $user = $$value));
    	let username, password;

    	const login = () => {
    		set_store_value(user, $user = {
    			username,
    			token: "somerandomstring",
    			access: "sudo"
    		});

    		localstorageSlim.set("user", $user, { ttl: userTokenTTL, encrypt: true });
    	};

    	document.onkeydown = e => {
    		if (e.keyCode === 13) login();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Login", $$slots, []);

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		lss: localstorageSlim,
    		navigate,
    		user,
    		userTokenTTL,
    		username,
    		password,
    		login,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ("username" in $$props) $$invalidate(0, username = $$props.username);
    		if ("password" in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$user*/ 8) {
    			 if ($user != null) {
    				navigate("/panel", { replace: true });
    			}
    		}
    	};

    	return [username, password, login, $user, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\~panel\components\Tab.svelte generated by Svelte v3.20.1 */
    const file$4 = "src\\routes\\~panel\\components\\Tab.svelte";

    // (20:3) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let ion_icon;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			ion_icon = element("ion-icon");
    			attr_dev(div, "class", "svelte-g08yit");
    			add_location(div, file$4, 20, 6, 483);
    			set_custom_element_data(ion_icon, "name", /*icon*/ ctx[2]);
    			set_custom_element_data(ion_icon, "class", "svelte-g08yit");
    			add_location(ion_icon, file$4, 21, 6, 526);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ion_icon, anchor);
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", /*logout*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);

    			if (dirty & /*icon*/ 4) {
    				set_custom_element_data(ion_icon, "name", /*icon*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ion_icon);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(20:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:3) {#if path !== 'logout'}
    function create_if_block$2(ctx) {
    	let current;

    	const link = new Link({
    			props: {
    				to: /*path*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*path*/ 2) link_changes.to = /*path*/ ctx[1];

    			if (dirty & /*$$scope, icon, name*/ 37) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:3) {#if path !== 'logout'}",
    		ctx
    	});

    	return block;
    }

    // (16:6) <Link to="{path}">
    function create_default_slot$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let ion_icon;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			ion_icon = element("ion-icon");
    			attr_dev(div, "class", "svelte-g08yit");
    			add_location(div, file$4, 16, 9, 394);
    			set_custom_element_data(ion_icon, "name", /*icon*/ ctx[2]);
    			set_custom_element_data(ion_icon, "class", "svelte-g08yit");
    			add_location(ion_icon, file$4, 17, 9, 422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ion_icon, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);

    			if (dirty & /*icon*/ 4) {
    				set_custom_element_data(ion_icon, "name", /*icon*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ion_icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(16:6) <Link to=\\\"{path}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*path*/ ctx[1] !== "logout") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			attr_dev(li, "class", "svelte-g08yit");
    			toggle_class(li, "active", /*$location*/ ctx[3] == /*name*/ ctx[0]);
    			add_location(li, file$4, 13, 0, 292);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, null);
    			}

    			if (dirty & /*$location, name*/ 9) {
    				toggle_class(li, "active", /*$location*/ ctx[3] == /*name*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(3, $location = $$value));
    	let { name } = $$props, { path } = $$props, { icon } = $$props;

    	const logout = () => {
    		localstorageSlim.remove("user");
    		window.location = "/login";
    	};

    	const writable_props = ["name", "path", "icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tab", $$slots, []);

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("path" in $$props) $$invalidate(1, path = $$props.path);
    		if ("icon" in $$props) $$invalidate(2, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({
    		lss: localstorageSlim,
    		Link,
    		location,
    		name,
    		path,
    		icon,
    		logout,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("path" in $$props) $$invalidate(1, path = $$props.path);
    		if ("icon" in $$props) $$invalidate(2, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, path, icon, $location, logout];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, path: 1, icon: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Tab> was created without expected prop 'name'");
    		}

    		if (/*path*/ ctx[1] === undefined && !("path" in props)) {
    			console.warn("<Tab> was created without expected prop 'path'");
    		}

    		if (/*icon*/ ctx[2] === undefined && !("icon" in props)) {
    			console.warn("<Tab> was created without expected prop 'icon'");
    		}
    	}

    	get name() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~dashboard\components\LineChart.svelte generated by Svelte v3.20.1 */
    const file$5 = "src\\routes\\~panel\\routes\\~dashboard\\components\\LineChart.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$5, 92, 3, 2071);
    			attr_dev(div1, "class", "chart-wrapper svelte-609h2a");
    			add_location(div1, file$5, 91, 0, 2039);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { settings } = $$props;

    	var options = {
    		series: settings.series,
    		chart: {
    			height: 350,
    			type: "line",
    			width: "100%",
    			zoom: { enabled: false },
    			animations: {
    				enabled: true,
    				easing: "linear",
    				speed: 300,
    				animateGradually: { enabled: false },
    				dynamicAnimation: { enabled: true, speed: 300 }
    			},
    			parentHeightOffset: 15,
    			background: "#eeeeee11"
    		},
    		colors: ["#CDDC39", "#9CCC65"],
    		dataLabels: { enabled: false },
    		stroke: { curve: "smooth", width: 2 },
    		title: { text: settings.title, align: "center" },
    		xaxis: {
    			categories: Array.from({ length: 24 }, (_, i) => Math.floor(i + 1)),
    			title: { text: settings.xaxis }
    		},
    		yaxis: { title: { text: settings.yaxis } },
    		legend: {
    			position: "bottom",
    			horizontalAlign: "right",
    			markers: { offsetY: 3 }
    		},
    		annotations: { position: "front" },
    		noData: { text: "در حال بارگذاری..." },
    		markers: {
    			size: 1,
    			colors: "#11111122",
    			strokeWidth: 0,
    			fillOpacity: 1,
    			discrete: [],
    			shape: "square",
    			radius: 7,
    			showNullDataPoints: true,
    			hover: { size: 2, sizeOffset: 3 }
    		}
    	};

    	const id = "chart-" + (Math.random() + 1).toString(36).substring(2);

    	onMount(async () => {
    		var chart = new ApexCharts(document.querySelector("#" + id), options);
    		chart.render();
    	});

    	const writable_props = ["settings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LineChart> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LineChart", $$slots, []);

    	$$self.$set = $$props => {
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({ onMount, settings, options, id });

    	$$self.$inject_state = $$props => {
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    		if ("options" in $$props) options = $$props.options;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, settings];
    }

    class LineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { settings: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineChart",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[1] === undefined && !("settings" in props)) {
    			console.warn("<LineChart> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<LineChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<LineChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~dashboard\components\SelectBar.svelte generated by Svelte v3.20.1 */

    const file$6 = "src\\routes\\~panel\\routes\\~dashboard\\components\\SelectBar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (8:3) {#each options as options}
    function create_each_block(ctx) {
    	let div;
    	let t_value = /*options*/ ctx[1] + "";
    	let t;
    	let div_data_valu_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[3](/*options*/ ctx[1], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "data-valu", div_data_valu_value = /*options*/ ctx[1]);
    			attr_dev(div, "class", "svelte-562xod");
    			toggle_class(div, "selected", /*value*/ ctx[0] == /*options*/ ctx[1]);
    			add_location(div, file$6, 8, 6, 157);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			if (remount) dispose();
    			dispose = listen_dev(div, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*options*/ 2 && t_value !== (t_value = /*options*/ ctx[1] + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 2 && div_data_valu_value !== (div_data_valu_value = /*options*/ ctx[1])) {
    				attr_dev(div, "data-valu", div_data_valu_value);
    			}

    			if (dirty & /*value, options*/ 3) {
    				toggle_class(div, "selected", /*value*/ ctx[0] == /*options*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:3) {#each options as options}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "selectBar svelte-562xod");
    			add_location(div, file$6, 6, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, value*/ 3) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { options } = $$props;
    	let { def } = $$props;
    	let { value = def } = $$props;
    	const writable_props = ["options", "def", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SelectBar", $$slots, []);

    	const click_handler = options => {
    		$$invalidate(0, value = options);
    	};

    	$$self.$set = $$props => {
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    		if ("def" in $$props) $$invalidate(2, def = $$props.def);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ options, def, value });

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    		if ("def" in $$props) $$invalidate(2, def = $$props.def);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, options, def, click_handler];
    }

    class SelectBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { options: 1, def: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectBar",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[1] === undefined && !("options" in props)) {
    			console.warn("<SelectBar> was created without expected prop 'options'");
    		}

    		if (/*def*/ ctx[2] === undefined && !("def" in props)) {
    			console.warn("<SelectBar> was created without expected prop 'def'");
    		}
    	}

    	get options() {
    		throw new Error("<SelectBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SelectBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get def() {
    		throw new Error("<SelectBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set def(value) {
    		throw new Error("<SelectBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SelectBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~dashboard\components\AreaChart.svelte generated by Svelte v3.20.1 */
    const file$7 = "src\\routes\\~panel\\routes\\~dashboard\\components\\AreaChart.svelte";

    function create_fragment$7(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let div2;
    	let t2;
    	let t3;
    	let div3;
    	let t5;
    	let t6;
    	let button;
    	let t7;
    	let ion_icon;
    	let current;

    	const selectbar0 = new SelectBar({
    			props: { options: [1, 4, 8, 24, 48], def: 24 },
    			$$inline: true
    		});

    	const selectbar1 = new SelectBar({
    			props: {
    				options: ["API", "فایل", "جدول"],
    				def: "API"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div2.textContent = "محدوده زمانی پیشبینی";
    			t2 = space();
    			create_component(selectbar0.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "ورودی دیتا";
    			t5 = space();
    			create_component(selectbar1.$$.fragment);
    			t6 = space();
    			button = element("button");
    			t7 = text("پیشبینی\r\n         ");
    			ion_icon = element("ion-icon");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			attr_dev(div0, "class", "svelte-1a21fm1");
    			add_location(div0, file$7, 87, 6, 1897);
    			attr_dev(div1, "class", "chart-wrapper svelte-1a21fm1");
    			add_location(div1, file$7, 86, 3, 1862);
    			attr_dev(div2, "class", "svelte-1a21fm1");
    			add_location(div2, file$7, 90, 6, 1959);
    			attr_dev(div3, "class", "svelte-1a21fm1");
    			add_location(div3, file$7, 92, 6, 2056);
    			set_custom_element_data(ion_icon, "name", "caret-back-outline");
    			set_custom_element_data(ion_icon, "class", "svelte-1a21fm1");
    			add_location(ion_icon, file$7, 96, 9, 2189);
    			attr_dev(button, "class", "svelte-1a21fm1");
    			add_location(button, file$7, 94, 6, 2152);
    			attr_dev(div4, "class", "form-wrapper svelte-1a21fm1");
    			add_location(div4, file$7, 89, 3, 1925);
    			attr_dev(div5, "class", "super-wrapper svelte-1a21fm1");
    			add_location(div5, file$7, 85, 0, 1830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			mount_component(selectbar0, div4, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div4, t5);
    			mount_component(selectbar1, div4, null);
    			append_dev(div4, t6);
    			append_dev(div4, button);
    			append_dev(button, t7);
    			append_dev(button, ion_icon);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectbar0.$$.fragment, local);
    			transition_in(selectbar1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectbar0.$$.fragment, local);
    			transition_out(selectbar1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(selectbar0);
    			destroy_component(selectbar1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { settings } = $$props;

    	var options = {
    		series: [
    			{
    				name: "مگاوات ساعت",
    				data: Array.from({ length: 24 }, (_, i) => i + Math.floor(Math.random() * 5))
    			}
    		],
    		chart: {
    			type: "area",
    			height: 350,
    			zoom: { enabled: false },
    			background: "#eeeeee11"
    		},
    		grid: {
    			xaxis: { lines: { show: true } },
    			yaxis: { lines: { show: true } }
    		},
    		fill: { type: "solid" },
    		colors: ["#76FF0355"],
    		dataLabels: { enabled: false },
    		stroke: { curve: "straight", width: 0 },
    		title: {
    			text: "مقدار پیشبینی شده مصرف برق",
    			align: "center"
    		},
    		noData: { text: "در حال بارگذاری..." },
    		subtitle: {
    			// text: "برای 24 ساعت آینده",
    			align: "center"
    		},
    		xaxis: {
    			type: "number",
    			categories: Array.from({ length: 24 }, (_, i) => Math.floor(i + 1)),
    			title: { text: "ساعت" }
    		},
    		yaxis: { opposite: false, title: { text: "MWh" } },
    		legend: { horizontalAlign: "left" }
    	};

    	const id = "chart-" + (Math.random() + 1).toString(36).substring(2);

    	onMount(async () => {
    		var chart = new ApexCharts(document.querySelector("#" + id), options);
    		chart.render();
    	});

    	const writable_props = ["settings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AreaChart> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AreaChart", $$slots, []);

    	$$self.$set = $$props => {
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		SelectBar,
    		settings,
    		options,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ("settings" in $$props) $$invalidate(1, settings = $$props.settings);
    		if ("options" in $$props) options = $$props.options;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, settings];
    }

    class AreaChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { settings: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AreaChart",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[1] === undefined && !("settings" in props)) {
    			console.warn("<AreaChart> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<AreaChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<AreaChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~dashboard\components\TwoSidedColumnChart.svelte generated by Svelte v3.20.1 */
    const file$8 = "src\\routes\\~panel\\routes\\~dashboard\\components\\TwoSidedColumnChart.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$8, 104, 3, 2619);
    			attr_dev(div1, "class", "chart-wrapper svelte-609h2a");
    			add_location(div1, file$8, 103, 0, 2587);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	var options = {
    		series: [
    			{
    				name: "Cash Flow",
    				data: [
    					1.45,
    					5.42,
    					5.9,
    					-0.42,
    					-12.6,
    					-18.1,
    					-18.2,
    					-14.16,
    					-11.1,
    					-6.09,
    					0.34,
    					3.88,
    					13.07,
    					5.8,
    					2,
    					7.37,
    					8.1,
    					13.57,
    					15.75,
    					17.1,
    					19.8,
    					-27.03,
    					-54.4,
    					-47.2,
    					-43.3,
    					-18.6,
    					-48.6,
    					-41.1,
    					-39.6,
    					-37.6,
    					-29.4,
    					-21.4,
    					-2.4
    				]
    			}
    		],
    		chart: {
    			type: "bar",
    			height: 350,
    			width: "100%",
    			background: "#eeeeee11"
    		},
    		title: {
    			text: "میزان خطای محاسبه مصرف برق",
    			align: "center"
    		},
    		plotOptions: {
    			bar: {
    				colors: {
    					ranges: [
    						{
    							from: -Infinity,
    							to: Infinity,
    							color: "#EF5350"
    						}
    					]
    				},
    				columnWidth: "80%"
    			}
    		},
    		dataLabels: { enabled: false },
    		yaxis: {
    			title: { text: "درصد خطا" },
    			labels: {
    				formatter(y) {
    					return y.toFixed(0) + "%";
    				}
    			}
    		},
    		xaxis: {
    			type: "datetime",
    			categories: [
    				"2011-01-01",
    				"2011-02-01",
    				"2011-03-01",
    				"2011-04-01",
    				"2011-05-01",
    				"2011-06-01",
    				"2011-07-01",
    				"2011-08-01",
    				"2011-09-01",
    				"2011-10-01",
    				"2011-11-01",
    				"2011-12-01",
    				"2012-01-01",
    				"2012-02-01",
    				"2012-03-01",
    				"2012-04-01",
    				"2012-05-01",
    				"2012-06-01",
    				"2012-07-01",
    				"2012-08-01",
    				"2012-09-01",
    				"2012-10-01",
    				"2012-11-01",
    				"2012-12-01",
    				"2013-01-01",
    				"2013-02-01",
    				"2013-03-01",
    				"2013-04-01",
    				"2013-05-01",
    				"2013-06-01",
    				"2013-07-01",
    				"2013-08-01",
    				"2013-09-01"
    			],
    			labels: { rotate: -90 }
    		}
    	};

    	const id = "chart-" + (Math.random() + 1).toString(36).substring(2);

    	onMount(async () => {
    		var chart = new ApexCharts(document.querySelector("#" + id), options);
    		chart.render();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TwoSidedColumnChart> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TwoSidedColumnChart", $$slots, []);
    	$$self.$capture_state = () => ({ onMount, options, id });

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) options = $$props.options;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id];
    }

    class TwoSidedColumnChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TwoSidedColumnChart",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\routes\~panel\routes\~dashboard\index.svelte generated by Svelte v3.20.1 */
    const file$9 = "src\\routes\\~panel\\routes\\~dashboard\\index.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let ion_icon;
    	let t0;
    	let span;
    	let t2;
    	let current;
    	const areachart = new AreaChart({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			ion_icon = element("ion-icon");
    			t0 = space();
    			span = element("span");
    			span.textContent = "پیشبینی جدید";
    			t2 = space();
    			create_component(areachart.$$.fragment);
    			set_custom_element_data(ion_icon, "name", "flash-outline");
    			set_custom_element_data(ion_icon, "class", "svelte-z713rn");
    			add_location(ion_icon, file$9, 55, 6, 1425);
    			add_location(span, file$9, 56, 6, 1466);
    			attr_dev(div0, "class", "tag svelte-z713rn");
    			add_location(div0, file$9, 54, 3, 1400);
    			attr_dev(div1, "class", "dashboard svelte-z713rn");
    			add_location(div1, file$9, 53, 0, 1372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, ion_icon);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(div1, t2);
    			mount_component(areachart, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(areachart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(areachart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(areachart);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	set_store_value(location, $location = "داشبورد");

    	let settings = {
    		series: [
    			{
    				name: "پیشبینی",
    				data: [
    					10,
    					41,
    					35,
    					51,
    					49,
    					62,
    					69,
    					91,
    					148,
    					10,
    					41,
    					35,
    					51,
    					49,
    					62,
    					69,
    					91,
    					148,
    					10,
    					41,
    					35,
    					51,
    					49,
    					62
    				]
    			},
    			{
    				name: "واقعی",
    				data: [
    					10 + 10,
    					41 + 10,
    					35 + 10,
    					51 + 10,
    					49 + 10,
    					62 + 10,
    					69 + 10,
    					91 + 10,
    					148 + 10,
    					10 + 10,
    					41 + 10,
    					35 + 10,
    					51 + 10,
    					49 + 10,
    					62 + 10,
    					69 + 10,
    					91 + 10,
    					148 + 10,
    					10 + 10,
    					41 + 10,
    					35 + 10,
    					51 + 10,
    					49 + 10,
    					62 + 10
    				]
    			}
    		],
    		xaxis: "ساعت",
    		yaxis: "MWh",
    		title: "مقایسه مقدار مصرف پیشبینی شده و واقعی"
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dashboard", $$slots, []);

    	$$self.$capture_state = () => ({
    		LineChart,
    		AreaChart,
    		TwoSidedComundChart: TwoSidedColumnChart,
    		location,
    		settings,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ("settings" in $$props) settings = $$props.settings;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\routes\~panel\routes\~archive\components\Forcast.svelte generated by Svelte v3.20.1 */

    const file$a = "src\\routes\\~panel\\routes\\~archive\\components\\Forcast.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let span_1;
    	let t1;
    	let ion_icon;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span_1 = element("span");
    			span_1.textContent = "پیشبینی در ساعت 9:16 برای 24 ساعت آینده";
    			t1 = space();
    			ion_icon = element("ion-icon");
    			add_location(span_1, file$a, 5, 3, 82);
    			set_custom_element_data(ion_icon, "name", "caret-forward-outline");
    			set_custom_element_data(ion_icon, "class", "svelte-33scu");
    			add_location(ion_icon, file$a, 6, 3, 139);
    			attr_dev(div, "class", "forcast svelte-33scu");
    			add_location(div, file$a, 4, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span_1);
    			append_dev(div, t1);
    			append_dev(div, ion_icon);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { date } = $$props, { time } = $$props, { span } = $$props;
    	const writable_props = ["date", "time", "span"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Forcast> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Forcast", $$slots, []);

    	$$self.$set = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("span" in $$props) $$invalidate(2, span = $$props.span);
    	};

    	$$self.$capture_state = () => ({ date, time, span });

    	$$self.$inject_state = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("span" in $$props) $$invalidate(2, span = $$props.span);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [date, time, span];
    }

    class Forcast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { date: 0, time: 1, span: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Forcast",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*date*/ ctx[0] === undefined && !("date" in props)) {
    			console.warn("<Forcast> was created without expected prop 'date'");
    		}

    		if (/*time*/ ctx[1] === undefined && !("time" in props)) {
    			console.warn("<Forcast> was created without expected prop 'time'");
    		}

    		if (/*span*/ ctx[2] === undefined && !("span" in props)) {
    			console.warn("<Forcast> was created without expected prop 'span'");
    		}
    	}

    	get date() {
    		throw new Error("<Forcast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Forcast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Forcast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Forcast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span() {
    		throw new Error("<Forcast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span(value) {
    		throw new Error("<Forcast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~archive\index.svelte generated by Svelte v3.20.1 */
    const file$b = "src\\routes\\~panel\\routes\\~archive\\index.svelte";

    function create_fragment$b(ctx) {
    	let div4;
    	let div0;
    	let ion_icon0;
    	let t0;
    	let span0;
    	let t2;
    	let div1;
    	let input;
    	let t3;
    	let button;
    	let ion_icon1;
    	let t4;
    	let t5;
    	let div2;
    	let ion_icon2;
    	let t6;
    	let span1;
    	let t8;
    	let div3;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let current;

    	const forcast0 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast1 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast2 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast3 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast4 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast5 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast6 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast7 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast8 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const forcast9 = new Forcast({
    			props: {
    				date: "5/6/2021",
    				time: "6:57PM",
    				span: 24
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			ion_icon0 = element("ion-icon");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "انتخاب تاریخ";
    			t2 = space();
    			div1 = element("div");
    			input = element("input");
    			t3 = space();
    			button = element("button");
    			ion_icon1 = element("ion-icon");
    			t4 = text("\r\n         نمایش");
    			t5 = space();
    			div2 = element("div");
    			ion_icon2 = element("ion-icon");
    			t6 = space();
    			span1 = element("span");
    			span1.textContent = "نتایج";
    			t8 = space();
    			div3 = element("div");
    			create_component(forcast0.$$.fragment);
    			t9 = space();
    			create_component(forcast1.$$.fragment);
    			t10 = space();
    			create_component(forcast2.$$.fragment);
    			t11 = space();
    			create_component(forcast3.$$.fragment);
    			t12 = space();
    			create_component(forcast4.$$.fragment);
    			t13 = space();
    			create_component(forcast5.$$.fragment);
    			t14 = space();
    			create_component(forcast6.$$.fragment);
    			t15 = space();
    			create_component(forcast7.$$.fragment);
    			t16 = space();
    			create_component(forcast8.$$.fragment);
    			t17 = space();
    			create_component(forcast9.$$.fragment);
    			set_custom_element_data(ion_icon0, "name", "calendar-outline");
    			set_custom_element_data(ion_icon0, "class", "svelte-1lp2dmq");
    			add_location(ion_icon0, file$b, 107, 6, 2744);
    			add_location(span0, file$b, 108, 6, 2788);
    			attr_dev(div0, "class", "tag svelte-1lp2dmq");
    			add_location(div0, file$b, 106, 3, 2719);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "exm");
    			attr_dev(input, "class", "svelte-1lp2dmq");
    			add_location(input, file$b, 111, 6, 2861);
    			set_custom_element_data(ion_icon1, "name", "receipt-outline");
    			set_custom_element_data(ion_icon1, "class", "svelte-1lp2dmq");
    			add_location(ion_icon1, file$b, 113, 9, 2928);
    			attr_dev(button, "id", "show");
    			attr_dev(button, "class", "svelte-1lp2dmq");
    			add_location(button, file$b, 112, 6, 2899);
    			attr_dev(div1, "class", "datePicker svelte-1lp2dmq");
    			add_location(div1, file$b, 110, 3, 2829);
    			set_custom_element_data(ion_icon2, "name", "layers-outline");
    			set_custom_element_data(ion_icon2, "class", "svelte-1lp2dmq");
    			add_location(ion_icon2, file$b, 118, 6, 3046);
    			add_location(span1, file$b, 119, 6, 3097);
    			attr_dev(div2, "class", "tag svelte-1lp2dmq");
    			add_location(div2, file$b, 117, 3, 3021);
    			attr_dev(div3, "class", "forcast-list svelte-1lp2dmq");
    			add_location(div3, file$b, 121, 3, 3131);
    			attr_dev(div4, "class", "archive svelte-1lp2dmq");
    			add_location(div4, file$b, 105, 0, 2693);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, ion_icon0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(div4, t2);
    			append_dev(div4, div1);
    			append_dev(div1, input);
    			append_dev(div1, t3);
    			append_dev(div1, button);
    			append_dev(button, ion_icon1);
    			append_dev(button, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div2, ion_icon2);
    			append_dev(div2, t6);
    			append_dev(div2, span1);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			mount_component(forcast0, div3, null);
    			append_dev(div3, t9);
    			mount_component(forcast1, div3, null);
    			append_dev(div3, t10);
    			mount_component(forcast2, div3, null);
    			append_dev(div3, t11);
    			mount_component(forcast3, div3, null);
    			append_dev(div3, t12);
    			mount_component(forcast4, div3, null);
    			append_dev(div3, t13);
    			mount_component(forcast5, div3, null);
    			append_dev(div3, t14);
    			mount_component(forcast6, div3, null);
    			append_dev(div3, t15);
    			mount_component(forcast7, div3, null);
    			append_dev(div3, t16);
    			mount_component(forcast8, div3, null);
    			append_dev(div3, t17);
    			mount_component(forcast9, div3, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forcast0.$$.fragment, local);
    			transition_in(forcast1.$$.fragment, local);
    			transition_in(forcast2.$$.fragment, local);
    			transition_in(forcast3.$$.fragment, local);
    			transition_in(forcast4.$$.fragment, local);
    			transition_in(forcast5.$$.fragment, local);
    			transition_in(forcast6.$$.fragment, local);
    			transition_in(forcast7.$$.fragment, local);
    			transition_in(forcast8.$$.fragment, local);
    			transition_in(forcast9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forcast0.$$.fragment, local);
    			transition_out(forcast1.$$.fragment, local);
    			transition_out(forcast2.$$.fragment, local);
    			transition_out(forcast3.$$.fragment, local);
    			transition_out(forcast4.$$.fragment, local);
    			transition_out(forcast5.$$.fragment, local);
    			transition_out(forcast6.$$.fragment, local);
    			transition_out(forcast7.$$.fragment, local);
    			transition_out(forcast8.$$.fragment, local);
    			transition_out(forcast9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(forcast0);
    			destroy_component(forcast1);
    			destroy_component(forcast2);
    			destroy_component(forcast3);
    			destroy_component(forcast4);
    			destroy_component(forcast5);
    			destroy_component(forcast6);
    			destroy_component(forcast7);
    			destroy_component(forcast8);
    			destroy_component(forcast9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	set_store_value(location, $location = "آرشیو پیشبینی ها");

    	onMount(() => {
    		// document.querySelector('#exm').persianDatepicker();
    		jQuery("#exm").pDatepicker({
    			inline: false,
    			format: "LL",
    			viewMode: "day",
    			initialValue: true,
    			minDate: 0,
    			maxDate: 0,
    			autoClose: true,
    			position: "auto",
    			altFormat: "lll",
    			altField: "#altfieldExample",
    			onlyTimePicker: false,
    			onlySelectOnDate: false,
    			calendarType: "persian",
    			inputDelay: 800,
    			observer: false,
    			calendar: {
    				persian: {
    					locale: "fa",
    					showHint: true,
    					leapYearMode: "algorithmic"
    				},
    				gregorian: { locale: "en", showHint: true }
    			},
    			navigator: {
    				enabled: true,
    				scroll: { enabled: true },
    				text: { btnNextText: "<", btnPrevText: ">" }
    			},
    			toolbox: {
    				enabled: true,
    				calendarSwitch: { enabled: true, format: "MMMM" },
    				todayButton: {
    					enabled: true,
    					text: { fa: "امروز", en: "Today" }
    				},
    				submitButton: {
    					enabled: true,
    					text: { fa: "تایید", en: "Submit" }
    				},
    				text: { btnToday: "امروز" }
    			},
    			timePicker: {
    				enabled: false,
    				step: 1,
    				hour: { enabled: true, step: null },
    				minute: { enabled: true, step: null },
    				second: { enabled: true, step: null },
    				meridian: { enabled: true }
    			},
    			dayPicker: { enabled: true, titleFormat: "YYYY MMMM" },
    			monthPicker: { enabled: true, titleFormat: "YYYY" },
    			yearPicker: { enabled: true, titleFormat: "YYYY" },
    			responsive: false
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Archive> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Archive", $$slots, []);
    	$$self.$capture_state = () => ({ onMount, location, Forcast, $location });
    	return [];
    }

    class Archive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Archive",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\routes\~panel\routes\~access\components\User.svelte generated by Svelte v3.20.1 */

    const file$c = "src\\routes\\~panel\\routes\\~access\\components\\User.svelte";

    function create_fragment$c(ctx) {
    	let tr;
    	let td0;
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let t5;
    	let td3;
    	let t6;
    	let t7;
    	let td4;
    	let span0;
    	let ion_icon0;
    	let t8;
    	let t9;
    	let span1;
    	let ion_icon1;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(/*id*/ ctx[0]);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(/*username*/ ctx[1]);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(/*access*/ ctx[2]);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(/*lastLogin*/ ctx[3]);
    			t7 = space();
    			td4 = element("td");
    			span0 = element("span");
    			ion_icon0 = element("ion-icon");
    			t8 = text("\r\n         ویرایش");
    			t9 = space();
    			span1 = element("span");
    			ion_icon1 = element("ion-icon");
    			t10 = text("\r\n         حذف");
    			attr_dev(td0, "class", "svelte-13ojq58");
    			add_location(td0, file$c, 5, 3, 80);
    			attr_dev(td1, "class", "svelte-13ojq58");
    			add_location(td1, file$c, 6, 3, 98);
    			attr_dev(td2, "class", "svelte-13ojq58");
    			add_location(td2, file$c, 7, 3, 122);
    			attr_dev(td3, "class", "svelte-13ojq58");
    			add_location(td3, file$c, 8, 3, 144);
    			set_custom_element_data(ion_icon0, "name", "create-outline");
    			set_custom_element_data(ion_icon0, "class", "svelte-13ojq58");
    			add_location(ion_icon0, file$c, 11, 9, 211);
    			attr_dev(span0, "class", "edit svelte-13ojq58");
    			add_location(span0, file$c, 10, 6, 181);
    			set_custom_element_data(ion_icon1, "name", "trash-bin-outline");
    			set_custom_element_data(ion_icon1, "class", "svelte-13ojq58");
    			add_location(ion_icon1, file$c, 15, 9, 361);
    			attr_dev(span1, "class", "delete svelte-13ojq58");
    			toggle_class(span1, "disabled", /*access*/ ctx[2] === "sudo");
    			add_location(span1, file$c, 14, 6, 294);
    			attr_dev(td4, "class", "svelte-13ojq58");
    			add_location(td4, file$c, 9, 3, 169);
    			add_location(tr, file$c, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, span0);
    			append_dev(span0, ion_icon0);
    			append_dev(span0, t8);
    			append_dev(td4, t9);
    			append_dev(td4, span1);
    			append_dev(span1, ion_icon1);
    			append_dev(span1, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) set_data_dev(t0, /*id*/ ctx[0]);
    			if (dirty & /*username*/ 2) set_data_dev(t2, /*username*/ ctx[1]);
    			if (dirty & /*access*/ 4) set_data_dev(t4, /*access*/ ctx[2]);
    			if (dirty & /*lastLogin*/ 8) set_data_dev(t6, /*lastLogin*/ ctx[3]);

    			if (dirty & /*access*/ 4) {
    				toggle_class(span1, "disabled", /*access*/ ctx[2] === "sudo");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { id } = $$props,
    		{ username } = $$props,
    		{ access } = $$props,
    		{ lastLogin } = $$props;

    	const writable_props = ["id", "username", "access", "lastLogin"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<User> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("User", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("username" in $$props) $$invalidate(1, username = $$props.username);
    		if ("access" in $$props) $$invalidate(2, access = $$props.access);
    		if ("lastLogin" in $$props) $$invalidate(3, lastLogin = $$props.lastLogin);
    	};

    	$$self.$capture_state = () => ({ id, username, access, lastLogin });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("username" in $$props) $$invalidate(1, username = $$props.username);
    		if ("access" in $$props) $$invalidate(2, access = $$props.access);
    		if ("lastLogin" in $$props) $$invalidate(3, lastLogin = $$props.lastLogin);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, username, access, lastLogin];
    }

    class User extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			id: 0,
    			username: 1,
    			access: 2,
    			lastLogin: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "User",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console.warn("<User> was created without expected prop 'id'");
    		}

    		if (/*username*/ ctx[1] === undefined && !("username" in props)) {
    			console.warn("<User> was created without expected prop 'username'");
    		}

    		if (/*access*/ ctx[2] === undefined && !("access" in props)) {
    			console.warn("<User> was created without expected prop 'access'");
    		}

    		if (/*lastLogin*/ ctx[3] === undefined && !("lastLogin" in props)) {
    			console.warn("<User> was created without expected prop 'lastLogin'");
    		}
    	}

    	get id() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get username() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get access() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set access(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastLogin() {
    		throw new Error("<User>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastLogin(value) {
    		throw new Error("<User>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~access\index.svelte generated by Svelte v3.20.1 */
    const file$d = "src\\routes\\~panel\\routes\\~access\\index.svelte";

    function create_fragment$d(ctx) {
    	let div3;
    	let div0;
    	let ion_icon0;
    	let t0;
    	let span0;
    	let t2;
    	let div1;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let input2;
    	let t5;
    	let button;
    	let ion_icon1;
    	let t6;
    	let t7;
    	let div2;
    	let ion_icon2;
    	let t8;
    	let span1;
    	let t10;
    	let table;
    	let tr;
    	let th0;
    	let t12;
    	let th1;
    	let t14;
    	let th2;
    	let t16;
    	let th3;
    	let t18;
    	let th4;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let current;

    	const user0 = new User({
    			props: {
    				id: "1786",
    				username: "admin",
    				access: "sudo",
    				lastLogin: "2 روز پیش"
    			},
    			$$inline: true
    		});

    	const user1 = new User({
    			props: {
    				id: "2455",
    				username: "komeiltl",
    				access: "user",
    				lastLogin: "3 ساعت پیش"
    			},
    			$$inline: true
    		});

    	const user2 = new User({
    			props: {
    				id: "9874",
    				username: "st.niazi",
    				access: "user",
    				lastLogin: "9 روز پیش"
    			},
    			$$inline: true
    		});

    	const user3 = new User({
    			props: {
    				id: "5434",
    				username: "underlord",
    				access: "user",
    				lastLogin: "3 هفته پیش"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			ion_icon0 = element("ion-icon");
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "افزودن کاربر";
    			t2 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			input2 = element("input");
    			t5 = space();
    			button = element("button");
    			ion_icon1 = element("ion-icon");
    			t6 = text("\r\n         افزودن");
    			t7 = space();
    			div2 = element("div");
    			ion_icon2 = element("ion-icon");
    			t8 = space();
    			span1 = element("span");
    			span1.textContent = "لیست کاربران";
    			t10 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "ID";
    			t12 = space();
    			th1 = element("th");
    			th1.textContent = "نام کاربری";
    			t14 = space();
    			th2 = element("th");
    			th2.textContent = "سطح دسترسی";
    			t16 = space();
    			th3 = element("th");
    			th3.textContent = "آخرین ورود";
    			t18 = space();
    			th4 = element("th");
    			th4.textContent = "تغییر";
    			t20 = space();
    			create_component(user0.$$.fragment);
    			t21 = space();
    			create_component(user1.$$.fragment);
    			t22 = space();
    			create_component(user2.$$.fragment);
    			t23 = space();
    			create_component(user3.$$.fragment);
    			set_custom_element_data(ion_icon0, "name", "add-circle-outline");
    			set_custom_element_data(ion_icon0, "class", "svelte-1nypr24");
    			add_location(ion_icon0, file$d, 8, 6, 202);
    			add_location(span0, file$d, 9, 6, 248);
    			attr_dev(div0, "class", "tag svelte-1nypr24");
    			add_location(div0, file$d, 7, 3, 177);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "new-username");
    			attr_dev(input0, "placeholder", "نام کاربری");
    			attr_dev(input0, "class", "svelte-1nypr24");
    			add_location(input0, file$d, 12, 6, 315);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "new-password");
    			attr_dev(input1, "placeholder", "رمزعبور");
    			attr_dev(input1, "class", "svelte-1nypr24");
    			add_location(input1, file$d, 13, 6, 387);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "id", "new-password-confirm");
    			attr_dev(input2, "placeholder", "تکرار رمزعبور");
    			attr_dev(input2, "class", "svelte-1nypr24");
    			add_location(input2, file$d, 14, 6, 460);
    			set_custom_element_data(ion_icon1, "name", "add-circle-outline");
    			set_custom_element_data(ion_icon1, "class", "svelte-1nypr24");
    			add_location(ion_icon1, file$d, 20, 9, 603);
    			attr_dev(button, "class", "svelte-1nypr24");
    			add_location(button, file$d, 19, 6, 584);
    			attr_dev(div1, "class", "form svelte-1nypr24");
    			add_location(div1, file$d, 11, 3, 289);
    			set_custom_element_data(ion_icon2, "name", "person-circle-outline");
    			set_custom_element_data(ion_icon2, "class", "svelte-1nypr24");
    			add_location(ion_icon2, file$d, 25, 6, 716);
    			add_location(span1, file$d, 26, 6, 765);
    			attr_dev(div2, "class", "tag svelte-1nypr24");
    			add_location(div2, file$d, 24, 3, 691);
    			attr_dev(th0, "class", "svelte-1nypr24");
    			add_location(th0, file$d, 30, 9, 836);
    			attr_dev(th1, "class", "svelte-1nypr24");
    			add_location(th1, file$d, 31, 9, 858);
    			attr_dev(th2, "class", "svelte-1nypr24");
    			add_location(th2, file$d, 32, 9, 888);
    			attr_dev(th3, "class", "svelte-1nypr24");
    			add_location(th3, file$d, 33, 9, 918);
    			attr_dev(th4, "class", "svelte-1nypr24");
    			add_location(th4, file$d, 34, 9, 948);
    			add_location(tr, file$d, 29, 6, 821);
    			attr_dev(table, "class", "svelte-1nypr24");
    			add_location(table, file$d, 28, 3, 806);
    			attr_dev(div3, "class", "access svelte-1nypr24");
    			add_location(div3, file$d, 6, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, ion_icon0);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t3);
    			append_dev(div1, input1);
    			append_dev(div1, t4);
    			append_dev(div1, input2);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			append_dev(button, ion_icon1);
    			append_dev(button, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, ion_icon2);
    			append_dev(div2, t8);
    			append_dev(div2, span1);
    			append_dev(div3, t10);
    			append_dev(div3, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t12);
    			append_dev(tr, th1);
    			append_dev(tr, t14);
    			append_dev(tr, th2);
    			append_dev(tr, t16);
    			append_dev(tr, th3);
    			append_dev(tr, t18);
    			append_dev(tr, th4);
    			append_dev(table, t20);
    			mount_component(user0, table, null);
    			append_dev(table, t21);
    			mount_component(user1, table, null);
    			append_dev(table, t22);
    			mount_component(user2, table, null);
    			append_dev(table, t23);
    			mount_component(user3, table, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user0.$$.fragment, local);
    			transition_in(user1.$$.fragment, local);
    			transition_in(user2.$$.fragment, local);
    			transition_in(user3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user0.$$.fragment, local);
    			transition_out(user1.$$.fragment, local);
    			transition_out(user2.$$.fragment, local);
    			transition_out(user3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(user0);
    			destroy_component(user1);
    			destroy_component(user2);
    			destroy_component(user3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	set_store_value(location, $location = "دسترسی");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Access> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Access", $$slots, []);
    	$$self.$capture_state = () => ({ location, User, $location });
    	return [];
    }

    class Access extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Access",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\routes\~panel\routes\~logs\components\Log.svelte generated by Svelte v3.20.1 */

    const file$e = "src\\routes\\~panel\\routes\\~logs\\components\\Log.svelte";

    function create_fragment$e(ctx) {
    	let div2;
    	let ion_icon;
    	let ion_icon_name_value;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let div2_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			ion_icon = element("ion-icon");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div0 = element("div");
    			t2 = text(/*time*/ ctx[1]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(/*date*/ ctx[2]);
    			set_custom_element_data(ion_icon, "name", ion_icon_name_value = /*icons*/ ctx[3][/*type*/ ctx[0]]);
    			set_custom_element_data(ion_icon, "class", "svelte-9iug1i");
    			add_location(ion_icon, file$e, 11, 3, 246);
    			attr_dev(div0, "class", "time svelte-9iug1i");
    			add_location(div0, file$e, 13, 3, 311);
    			attr_dev(div1, "class", "date svelte-9iug1i");
    			add_location(div1, file$e, 14, 3, 346);
    			attr_dev(div2, "class", div2_class_value = "log " + /*type*/ ctx[0] + " svelte-9iug1i");
    			add_location(div2, file$e, 10, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, ion_icon);
    			append_dev(div2, t0);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*type*/ 1 && ion_icon_name_value !== (ion_icon_name_value = /*icons*/ ctx[3][/*type*/ ctx[0]])) {
    				set_custom_element_data(ion_icon, "name", ion_icon_name_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[4], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null));
    				}
    			}

    			if (!current || dirty & /*time*/ 2) set_data_dev(t2, /*time*/ ctx[1]);
    			if (!current || dirty & /*date*/ 4) set_data_dev(t4, /*date*/ ctx[2]);

    			if (!current || dirty & /*type*/ 1 && div2_class_value !== (div2_class_value = "log " + /*type*/ ctx[0] + " svelte-9iug1i")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { type = "routine" } = $$props;
    	let { time } = $$props, { date } = $$props;

    	let icons = {
    		routine: "alert-circle-outline",
    		forcast: "stats-chart-outline",
    		setting: "cog-outline"
    	};

    	const writable_props = ["type", "time", "date"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Log> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Log", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("date" in $$props) $$invalidate(2, date = $$props.date);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, time, date, icons });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("date" in $$props) $$invalidate(2, date = $$props.date);
    		if ("icons" in $$props) $$invalidate(3, icons = $$props.icons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, time, date, icons, $$scope, $$slots];
    }

    class Log extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { type: 0, time: 1, date: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Log",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*time*/ ctx[1] === undefined && !("time" in props)) {
    			console.warn("<Log> was created without expected prop 'time'");
    		}

    		if (/*date*/ ctx[2] === undefined && !("date" in props)) {
    			console.warn("<Log> was created without expected prop 'date'");
    		}
    	}

    	get type() {
    		throw new Error("<Log>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Log>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Log>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Log>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Log>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Log>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\~panel\routes\~logs\index.svelte generated by Svelte v3.20.1 */
    const file$f = "src\\routes\\~panel\\routes\\~logs\\index.svelte";

    // (8:3) <Log type="routine" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_26(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(8:3) <Log type=\\\"routine\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:3) <Log type="forcast" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(9:3) <Log type=\\\"forcast\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(10:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(11:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_22(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(12:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(13:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(14:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(15:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(16:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(17:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(18:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(19:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(20:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(21:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(22:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(23:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(24:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(25:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(26:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(27:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(28:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(29:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(30:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(31:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(32:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(33:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:3) <Log type="setting" time="11:36 AM" date="5 Nov 2021">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("کاربر komeiltl وارد سیستم شد");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(34:3) <Log type=\\\"setting\\\" time=\\\"11:36 AM\\\" date=\\\"5 Nov 2021\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let current;

    	const log0 = new Log({
    			props: {
    				type: "routine",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log1 = new Log({
    			props: {
    				type: "forcast",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log2 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log3 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log4 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log5 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log6 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log7 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log8 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log9 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log10 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log11 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log12 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log13 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log14 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log15 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log16 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log17 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log18 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log19 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log20 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log21 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log22 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log23 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log24 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log25 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const log26 = new Log({
    			props: {
    				type: "setting",
    				time: "11:36 AM",
    				date: "5 Nov 2021",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(log0.$$.fragment);
    			t0 = space();
    			create_component(log1.$$.fragment);
    			t1 = space();
    			create_component(log2.$$.fragment);
    			t2 = space();
    			create_component(log3.$$.fragment);
    			t3 = space();
    			create_component(log4.$$.fragment);
    			t4 = space();
    			create_component(log5.$$.fragment);
    			t5 = space();
    			create_component(log6.$$.fragment);
    			t6 = space();
    			create_component(log7.$$.fragment);
    			t7 = space();
    			create_component(log8.$$.fragment);
    			t8 = space();
    			create_component(log9.$$.fragment);
    			t9 = space();
    			create_component(log10.$$.fragment);
    			t10 = space();
    			create_component(log11.$$.fragment);
    			t11 = space();
    			create_component(log12.$$.fragment);
    			t12 = space();
    			create_component(log13.$$.fragment);
    			t13 = space();
    			create_component(log14.$$.fragment);
    			t14 = space();
    			create_component(log15.$$.fragment);
    			t15 = space();
    			create_component(log16.$$.fragment);
    			t16 = space();
    			create_component(log17.$$.fragment);
    			t17 = space();
    			create_component(log18.$$.fragment);
    			t18 = space();
    			create_component(log19.$$.fragment);
    			t19 = space();
    			create_component(log20.$$.fragment);
    			t20 = space();
    			create_component(log21.$$.fragment);
    			t21 = space();
    			create_component(log22.$$.fragment);
    			t22 = space();
    			create_component(log23.$$.fragment);
    			t23 = space();
    			create_component(log24.$$.fragment);
    			t24 = space();
    			create_component(log25.$$.fragment);
    			t25 = space();
    			create_component(log26.$$.fragment);
    			attr_dev(div, "class", "logs svelte-1abd52o");
    			add_location(div, file$f, 6, 0, 150);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(log0, div, null);
    			append_dev(div, t0);
    			mount_component(log1, div, null);
    			append_dev(div, t1);
    			mount_component(log2, div, null);
    			append_dev(div, t2);
    			mount_component(log3, div, null);
    			append_dev(div, t3);
    			mount_component(log4, div, null);
    			append_dev(div, t4);
    			mount_component(log5, div, null);
    			append_dev(div, t5);
    			mount_component(log6, div, null);
    			append_dev(div, t6);
    			mount_component(log7, div, null);
    			append_dev(div, t7);
    			mount_component(log8, div, null);
    			append_dev(div, t8);
    			mount_component(log9, div, null);
    			append_dev(div, t9);
    			mount_component(log10, div, null);
    			append_dev(div, t10);
    			mount_component(log11, div, null);
    			append_dev(div, t11);
    			mount_component(log12, div, null);
    			append_dev(div, t12);
    			mount_component(log13, div, null);
    			append_dev(div, t13);
    			mount_component(log14, div, null);
    			append_dev(div, t14);
    			mount_component(log15, div, null);
    			append_dev(div, t15);
    			mount_component(log16, div, null);
    			append_dev(div, t16);
    			mount_component(log17, div, null);
    			append_dev(div, t17);
    			mount_component(log18, div, null);
    			append_dev(div, t18);
    			mount_component(log19, div, null);
    			append_dev(div, t19);
    			mount_component(log20, div, null);
    			append_dev(div, t20);
    			mount_component(log21, div, null);
    			append_dev(div, t21);
    			mount_component(log22, div, null);
    			append_dev(div, t22);
    			mount_component(log23, div, null);
    			append_dev(div, t23);
    			mount_component(log24, div, null);
    			append_dev(div, t24);
    			mount_component(log25, div, null);
    			append_dev(div, t25);
    			mount_component(log26, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const log0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log0_changes.$$scope = { dirty, ctx };
    			}

    			log0.$set(log0_changes);
    			const log1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log1_changes.$$scope = { dirty, ctx };
    			}

    			log1.$set(log1_changes);
    			const log2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log2_changes.$$scope = { dirty, ctx };
    			}

    			log2.$set(log2_changes);
    			const log3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log3_changes.$$scope = { dirty, ctx };
    			}

    			log3.$set(log3_changes);
    			const log4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log4_changes.$$scope = { dirty, ctx };
    			}

    			log4.$set(log4_changes);
    			const log5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log5_changes.$$scope = { dirty, ctx };
    			}

    			log5.$set(log5_changes);
    			const log6_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log6_changes.$$scope = { dirty, ctx };
    			}

    			log6.$set(log6_changes);
    			const log7_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log7_changes.$$scope = { dirty, ctx };
    			}

    			log7.$set(log7_changes);
    			const log8_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log8_changes.$$scope = { dirty, ctx };
    			}

    			log8.$set(log8_changes);
    			const log9_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log9_changes.$$scope = { dirty, ctx };
    			}

    			log9.$set(log9_changes);
    			const log10_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log10_changes.$$scope = { dirty, ctx };
    			}

    			log10.$set(log10_changes);
    			const log11_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log11_changes.$$scope = { dirty, ctx };
    			}

    			log11.$set(log11_changes);
    			const log12_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log12_changes.$$scope = { dirty, ctx };
    			}

    			log12.$set(log12_changes);
    			const log13_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log13_changes.$$scope = { dirty, ctx };
    			}

    			log13.$set(log13_changes);
    			const log14_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log14_changes.$$scope = { dirty, ctx };
    			}

    			log14.$set(log14_changes);
    			const log15_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log15_changes.$$scope = { dirty, ctx };
    			}

    			log15.$set(log15_changes);
    			const log16_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log16_changes.$$scope = { dirty, ctx };
    			}

    			log16.$set(log16_changes);
    			const log17_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log17_changes.$$scope = { dirty, ctx };
    			}

    			log17.$set(log17_changes);
    			const log18_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log18_changes.$$scope = { dirty, ctx };
    			}

    			log18.$set(log18_changes);
    			const log19_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log19_changes.$$scope = { dirty, ctx };
    			}

    			log19.$set(log19_changes);
    			const log20_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log20_changes.$$scope = { dirty, ctx };
    			}

    			log20.$set(log20_changes);
    			const log21_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log21_changes.$$scope = { dirty, ctx };
    			}

    			log21.$set(log21_changes);
    			const log22_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log22_changes.$$scope = { dirty, ctx };
    			}

    			log22.$set(log22_changes);
    			const log23_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log23_changes.$$scope = { dirty, ctx };
    			}

    			log23.$set(log23_changes);
    			const log24_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log24_changes.$$scope = { dirty, ctx };
    			}

    			log24.$set(log24_changes);
    			const log25_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log25_changes.$$scope = { dirty, ctx };
    			}

    			log25.$set(log25_changes);
    			const log26_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				log26_changes.$$scope = { dirty, ctx };
    			}

    			log26.$set(log26_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(log0.$$.fragment, local);
    			transition_in(log1.$$.fragment, local);
    			transition_in(log2.$$.fragment, local);
    			transition_in(log3.$$.fragment, local);
    			transition_in(log4.$$.fragment, local);
    			transition_in(log5.$$.fragment, local);
    			transition_in(log6.$$.fragment, local);
    			transition_in(log7.$$.fragment, local);
    			transition_in(log8.$$.fragment, local);
    			transition_in(log9.$$.fragment, local);
    			transition_in(log10.$$.fragment, local);
    			transition_in(log11.$$.fragment, local);
    			transition_in(log12.$$.fragment, local);
    			transition_in(log13.$$.fragment, local);
    			transition_in(log14.$$.fragment, local);
    			transition_in(log15.$$.fragment, local);
    			transition_in(log16.$$.fragment, local);
    			transition_in(log17.$$.fragment, local);
    			transition_in(log18.$$.fragment, local);
    			transition_in(log19.$$.fragment, local);
    			transition_in(log20.$$.fragment, local);
    			transition_in(log21.$$.fragment, local);
    			transition_in(log22.$$.fragment, local);
    			transition_in(log23.$$.fragment, local);
    			transition_in(log24.$$.fragment, local);
    			transition_in(log25.$$.fragment, local);
    			transition_in(log26.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(log0.$$.fragment, local);
    			transition_out(log1.$$.fragment, local);
    			transition_out(log2.$$.fragment, local);
    			transition_out(log3.$$.fragment, local);
    			transition_out(log4.$$.fragment, local);
    			transition_out(log5.$$.fragment, local);
    			transition_out(log6.$$.fragment, local);
    			transition_out(log7.$$.fragment, local);
    			transition_out(log8.$$.fragment, local);
    			transition_out(log9.$$.fragment, local);
    			transition_out(log10.$$.fragment, local);
    			transition_out(log11.$$.fragment, local);
    			transition_out(log12.$$.fragment, local);
    			transition_out(log13.$$.fragment, local);
    			transition_out(log14.$$.fragment, local);
    			transition_out(log15.$$.fragment, local);
    			transition_out(log16.$$.fragment, local);
    			transition_out(log17.$$.fragment, local);
    			transition_out(log18.$$.fragment, local);
    			transition_out(log19.$$.fragment, local);
    			transition_out(log20.$$.fragment, local);
    			transition_out(log21.$$.fragment, local);
    			transition_out(log22.$$.fragment, local);
    			transition_out(log23.$$.fragment, local);
    			transition_out(log24.$$.fragment, local);
    			transition_out(log25.$$.fragment, local);
    			transition_out(log26.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(log0);
    			destroy_component(log1);
    			destroy_component(log2);
    			destroy_component(log3);
    			destroy_component(log4);
    			destroy_component(log5);
    			destroy_component(log6);
    			destroy_component(log7);
    			destroy_component(log8);
    			destroy_component(log9);
    			destroy_component(log10);
    			destroy_component(log11);
    			destroy_component(log12);
    			destroy_component(log13);
    			destroy_component(log14);
    			destroy_component(log15);
    			destroy_component(log16);
    			destroy_component(log17);
    			destroy_component(log18);
    			destroy_component(log19);
    			destroy_component(log20);
    			destroy_component(log21);
    			destroy_component(log22);
    			destroy_component(log23);
    			destroy_component(log24);
    			destroy_component(log25);
    			destroy_component(log26);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	set_store_value(location, $location = "لاگ ها");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logs> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Logs", $$slots, []);
    	$$self.$capture_state = () => ({ location, Log, $location });
    	return [];
    }

    class Logs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logs",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\routes\~panel\index.svelte generated by Svelte v3.20.1 */
    const file$g = "src\\routes\\~panel\\index.svelte";

    // (40:18) {#if $user.access === "sudo"}
    function create_if_block_1$1(ctx) {
    	let current;

    	const tab = new Tab({
    			props: {
    				name: "دسترسی",
    				path: "/panel/access",
    				icon: "people-outline"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(40:18) {#if $user.access === \\\"sudo\\\"}",
    		ctx
    	});

    	return block;
    }

    // (55:12) <Route path="" let:params>
    function create_default_slot_5$1(ctx) {
    	let current;
    	const dashboard = new Dashboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(55:12) <Route path=\\\"\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (58:12) <Route path="dashboard" let:params>
    function create_default_slot_4$1(ctx) {
    	let current;
    	const dashboard = new Dashboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(58:12) <Route path=\\\"dashboard\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (61:12) <Route path="archive" let:params>
    function create_default_slot_3$1(ctx) {
    	let current;
    	const archive = new Archive({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(archive.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(archive, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(archive.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(archive.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(archive, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(61:12) <Route path=\\\"archive\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (64:12) {#if $user.access === "sudo"}
    function create_if_block$3(ctx) {
    	let current;

    	const route = new Route({
    			props: {
    				path: "access",
    				$$slots: {
    					default: [
    						create_default_slot_2$1,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(64:12) {#if $user.access === \\\"sudo\\\"}",
    		ctx
    	});

    	return block;
    }

    // (65:15) <Route path="access" let:params>
    function create_default_slot_2$1(ctx) {
    	let current;
    	const access = new Access({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(access.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(access, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(access.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(access.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(access, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(65:15) <Route path=\\\"access\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (69:12) <Route path="logs" let:params>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const logs = new Logs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(69:12) <Route path=\\\"logs\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (54:9) <Router>
    function create_default_slot$3(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const route0 = new Route({
    			props: {
    				path: "",
    				$$slots: {
    					default: [
    						create_default_slot_5$1,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const route1 = new Route({
    			props: {
    				path: "dashboard",
    				$$slots: {
    					default: [
    						create_default_slot_4$1,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const route2 = new Route({
    			props: {
    				path: "archive",
    				$$slots: {
    					default: [
    						create_default_slot_3$1,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*$user*/ ctx[0].access === "sudo" && create_if_block$3(ctx);

    	const route3 = new Route({
    			props: {
    				path: "logs",
    				$$slots: {
    					default: [
    						create_default_slot_1$1,
    						({ params }) => ({ 2: params }),
    						({ params }) => params ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			create_component(route3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);

    			if (/*$user*/ ctx[0].access === "sudo") {
    				if (!if_block) {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t3.parentNode, t3);
    				} else {
    					transition_in(if_block, 1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(54:9) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div8;
    	let div7;
    	let div3;
    	let nav;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t2;
    	let ul;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let div4;
    	let t8;
    	let div6;
    	let div5;
    	let t9;
    	let t10;
    	let current;

    	const tab0 = new Tab({
    			props: {
    				name: "داشبورد",
    				path: "/panel/dashboard",
    				icon: "desktop-outline"
    			},
    			$$inline: true
    		});

    	const tab1 = new Tab({
    			props: {
    				name: "آرشیو پیشبینی ها",
    				path: "archive",
    				icon: "albums-outline"
    			},
    			$$inline: true
    		});

    	let if_block = /*$user*/ ctx[0].access === "sudo" && create_if_block_1$1(ctx);

    	const tab2 = new Tab({
    			props: {
    				name: "لاگ ها",
    				path: "/panel/logs",
    				icon: "reader-outline"
    			},
    			$$inline: true
    		});

    	const tab3 = new Tab({
    			props: {
    				name: "خروج",
    				path: "logout",
    				icon: "power-outline"
    			},
    			$$inline: true
    		});

    	const router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div3 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Bar Power Forcast";
    			t2 = space();
    			ul = element("ul");
    			create_component(tab0.$$.fragment);
    			t3 = space();
    			create_component(tab1.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			create_component(tab2.$$.fragment);
    			t6 = space();
    			create_component(tab3.$$.fragment);
    			t7 = space();
    			div4 = element("div");
    			t8 = space();
    			div6 = element("div");
    			div5 = element("div");
    			t9 = text(/*$location*/ ctx[1]);
    			t10 = space();
    			create_component(router.$$.fragment);
    			attr_dev(div0, "class", "pure-u-lg-1-6 pure-u-md-2-24 pure-u-sm-2-24");
    			add_location(div0, file$g, 29, 12, 991);
    			attr_dev(div1, "class", "_logo pure-hidden-sm svelte-m8xzrq");
    			add_location(div1, file$g, 31, 15, 1136);
    			attr_dev(ul, "class", "svelte-m8xzrq");
    			add_location(ul, file$g, 32, 15, 1210);
    			attr_dev(div2, "class", "pure-u-lg-2-3 pure-u-md-5-6 pure-u-sm-5-6");
    			add_location(div2, file$g, 30, 12, 1064);
    			attr_dev(nav, "class", "svelte-m8xzrq");
    			add_location(nav, file$g, 28, 9, 972);
    			attr_dev(div3, "class", "pure-u-1");
    			add_location(div3, file$g, 27, 6, 939);
    			attr_dev(div4, "class", "pure-u-lg-1-6 pure-u-md-2-24 pure-u-sm-2-24");
    			add_location(div4, file$g, 48, 6, 1873);
    			attr_dev(div5, "class", "_plate svelte-m8xzrq");
    			add_location(div5, file$g, 52, 9, 2047);
    			attr_dev(div6, "class", "pure-u-lg-2-3 pure-u-md-5-6 pure-u-lg-2-3 pure-u-sm-5-6 _content svelte-m8xzrq");
    			add_location(div6, file$g, 49, 6, 1940);
    			attr_dev(div7, "class", "pure-g");
    			add_location(div7, file$g, 26, 3, 911);
    			attr_dev(div8, "id", "_app");
    			add_location(div8, file$g, 25, 0, 891);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, nav);
    			append_dev(nav, div0);
    			append_dev(nav, t0);
    			append_dev(nav, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t2);
    			append_dev(div2, ul);
    			mount_component(tab0, ul, null);
    			append_dev(ul, t3);
    			mount_component(tab1, ul, null);
    			append_dev(ul, t4);
    			if (if_block) if_block.m(ul, null);
    			append_dev(ul, t5);
    			mount_component(tab2, ul, null);
    			append_dev(ul, t6);
    			mount_component(tab3, ul, null);
    			append_dev(div7, t7);
    			append_dev(div7, div4);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, t9);
    			append_dev(div6, t10);
    			mount_component(router, div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$user*/ ctx[0].access === "sudo") {
    				if (!if_block) {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(ul, t5);
    				} else {
    					transition_in(if_block, 1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$location*/ 2) set_data_dev(t9, /*$location*/ ctx[1]);
    			const router_changes = {};

    			if (dirty & /*$$scope, $user*/ 9) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(tab2.$$.fragment, local);
    			transition_in(tab3.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(tab2.$$.fragment, local);
    			transition_out(tab3.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(tab0);
    			destroy_component(tab1);
    			if (if_block) if_block.d();
    			destroy_component(tab2);
    			destroy_component(tab3);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $user;
    	let $location;
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	validate_store(location, "location");
    	component_subscribe($$self, location, $$value => $$invalidate(1, $location = $$value));

    	useLocation().subscribe(l => {
    		if (!localstorageSlim.get("user")) {
    			window.location = "/";
    		}

    		localstorageSlim.flush();

    		if (localstorageSlim.get("user")) {
    			localstorageSlim.set("user", localstorageSlim.get("user"), { ttl: userTokenTTL });
    		}

    		l.pathname == "/panel" && navigate("/panel/dashboard", { replace: true });
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Panel> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Panel", $$slots, []);

    	$$self.$capture_state = () => ({
    		lss: localstorageSlim,
    		Router,
    		Route,
    		navigate,
    		useLocation,
    		location,
    		user,
    		userTokenTTL,
    		Tab,
    		Dashboard,
    		Archive,
    		Access,
    		Logs,
    		$user,
    		$location
    	});

    	return [$user, $location];
    }

    class Panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Panel",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.20.1 */
    const file$h = "src\\App.svelte";

    // (19:6) <Route path="/login" let:params>
    function create_default_slot_3$2(ctx) {
    	let current;
    	const login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(19:6) <Route path=\\\"/login\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (22:6) <Route path="/panel/*" let:params>
    function create_default_slot_2$2(ctx) {
    	let current;
    	const panel = new Panel({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(panel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(22:6) <Route path=\\\"/panel/*\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Route path="/*" let:params>
    function create_default_slot_1$2(ctx) {
    	let current;
    	const panel = new Panel({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(panel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(25:6) <Route path=\\\"/*\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (17:0) <Router>
    function create_default_slot$4(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let current;

    	const route0 = new Route({
    			props: {
    				path: "/login",
    				$$slots: {
    					default: [
    						create_default_slot_3$2,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const route1 = new Route({
    			props: {
    				path: "/panel/*",
    				$$slots: {
    					default: [
    						create_default_slot_2$2,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const route2 = new Route({
    			props: {
    				path: "/*",
    				$$slots: {
    					default: [
    						create_default_slot_1$2,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			add_location(main, file$h, 17, 3, 478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t0);
    			mount_component(route1, main, null);
    			append_dev(main, t1);
    			mount_component(route2, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(17:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current;

    	const router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Login,
    		Panel,
    		navigate,
    		user,
    		$user
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$user*/ 1) {
    			 if ($user == null) {
    				navigate("/login", { replace: true });
    			} else if (document.location.pathname === "/") {
    				navigate("/panel", { replace: true });
    			}
    		}
    	};

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
