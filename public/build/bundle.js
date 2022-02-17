
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
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
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-lazy/src/components/Placeholder.svelte generated by Svelte v3.46.4 */

    const file$9 = "node_modules/svelte-lazy/src/components/Placeholder.svelte";

    // (1:0) {#if placeholder}
    function create_if_block$3(ctx) {
    	let div;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_if_block_2$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*placeholder*/ 1) show_if = null;
    		if (typeof /*placeholder*/ ctx[0] === 'string') return 0;
    		if (show_if == null) show_if = !!['function', 'object'].includes(typeof /*placeholder*/ ctx[0]);
    		if (show_if) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx, -1))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", placeholderClass);
    			add_location(div, file$9, 1, 2, 20);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(1:0) {#if placeholder}",
    		ctx
    	});

    	return block;
    }

    // (5:66) 
    function create_if_block_2$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*placeholderProps*/ ctx[1]];
    	var switch_value = /*placeholder*/ ctx[0];

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
    		switch_instance = new switch_value(switch_props());
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
    			const switch_instance_changes = (dirty & /*placeholderProps*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*placeholderProps*/ ctx[1])])
    			: {};

    			if (switch_value !== (switch_value = /*placeholder*/ ctx[0])) {
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(5:66) ",
    		ctx
    	});

    	return block;
    }

    // (3:4) {#if typeof placeholder === 'string'}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*placeholder*/ ctx[0]);
    			add_location(div, file$9, 3, 6, 99);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 1) set_data_dev(t, /*placeholder*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(3:4) {#if typeof placeholder === 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*placeholder*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*placeholder*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*placeholder*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    const placeholderClass = 'svelte-lazy-placeholder';

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Placeholder', slots, []);
    	let { placeholder = null } = $$props;
    	let { placeholderProps = null } = $$props;
    	const writable_props = ['placeholder', 'placeholderProps'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Placeholder> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('placeholderProps' in $$props) $$invalidate(1, placeholderProps = $$props.placeholderProps);
    	};

    	$$self.$capture_state = () => ({
    		placeholder,
    		placeholderProps,
    		placeholderClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('placeholderProps' in $$props) $$invalidate(1, placeholderProps = $$props.placeholderProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [placeholder, placeholderProps];
    }

    class Placeholder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { placeholder: 0, placeholderProps: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Placeholder",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<Placeholder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Placeholder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderProps() {
    		throw new Error("<Placeholder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderProps(value) {
    		throw new Error("<Placeholder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-lazy/src/index.svelte generated by Svelte v3.46.4 */
    const file$8 = "node_modules/svelte-lazy/src/index.svelte";

    // (13:24) 
    function create_if_block_2$1(ctx) {
    	let placeholder_1;
    	let current;

    	placeholder_1 = new Placeholder({
    			props: {
    				placeholder: /*placeholder*/ ctx[1],
    				placeholderProps: /*placeholderProps*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(placeholder_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(placeholder_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const placeholder_1_changes = {};
    			if (dirty & /*placeholder*/ 2) placeholder_1_changes.placeholder = /*placeholder*/ ctx[1];
    			if (dirty & /*placeholderProps*/ 4) placeholder_1_changes.placeholderProps = /*placeholderProps*/ ctx[2];
    			placeholder_1.$set(placeholder_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholder_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholder_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(placeholder_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(13:24) ",
    		ctx
    	});

    	return block;
    }

    // (2:2) {#if loaded}
    function create_if_block$2(ctx) {
    	let div;
    	let div_intro;
    	let t;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);
    	let if_block = !/*contentShow*/ ctx[3] && /*placeholder*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", contentClass);
    			attr_dev(div, "style", /*contentStyle*/ ctx[5]);
    			add_location(div, file$8, 2, 4, 88);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*contentStyle*/ 32) {
    				attr_dev(div, "style", /*contentStyle*/ ctx[5]);
    			}

    			if (!/*contentShow*/ ctx[3] && /*placeholder*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*contentShow, placeholder*/ 10) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			transition_in(default_slot_or_fallback, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, /*fadeOption*/ ctx[0] || {});
    					div_intro.start();
    				});
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(2:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (8:12) Lazy load content
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Lazy load content");
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(8:12) Lazy load content",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if !contentShow && placeholder}
    function create_if_block_1$1(ctx) {
    	let placeholder_1;
    	let current;

    	placeholder_1 = new Placeholder({
    			props: {
    				placeholder: /*placeholder*/ ctx[1],
    				placeholderProps: /*placeholderProps*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(placeholder_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(placeholder_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const placeholder_1_changes = {};
    			if (dirty & /*placeholder*/ 2) placeholder_1_changes.placeholder = /*placeholder*/ ctx[1];
    			if (dirty & /*placeholderProps*/ 4) placeholder_1_changes.placeholderProps = /*placeholderProps*/ ctx[2];
    			placeholder_1.$set(placeholder_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholder_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholder_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(placeholder_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:4) {#if !contentShow && placeholder}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[4]) return 0;
    		if (/*placeholder*/ ctx[1]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", /*rootClass*/ ctx[6]);
    			set_style(div, "height", /*rootInitialHeight*/ ctx[7]);
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*load*/ ctx[8].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
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
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
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

    const contentClass = 'svelte-lazy-content';

    function addListeners(handler) {
    	document.addEventListener('scroll', handler, true);
    	window.addEventListener('resize', handler);
    }

    function removeListeners(handler) {
    	document.removeEventListener('scroll', handler, true);
    	window.removeEventListener('resize', handler);
    }

    function getContainerHeight(e) {
    	if (e && e.target && e.target.getBoundingClientRect) {
    		return e.target.getBoundingClientRect().bottom;
    	} else {
    		return window.innerHeight;
    	}
    }

    // From underscore souce code
    function throttle(func, wait, options) {
    	let context, args, result;
    	let timeout = null;
    	let previous = 0;
    	if (!options) options = {};

    	const later = function () {
    		previous = options.leading === false ? 0 : new Date();
    		timeout = null;
    		result = func.apply(context, args);
    		if (!timeout) context = args = null;
    	};

    	return function (event) {
    		const now = new Date();
    		if (!previous && options.leading === false) previous = now;
    		const remaining = wait - (now - previous);
    		context = this;
    		args = arguments;

    		if (remaining <= 0 || remaining > wait) {
    			if (timeout) {
    				clearTimeout(timeout);
    				timeout = null;
    			}

    			previous = now;
    			result = func.apply(context, args);
    			if (!timeout) context = args = null;
    		} else if (!timeout && options.trailing !== false) {
    			timeout = setTimeout(later, remaining);
    		}

    		return result;
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let contentStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Src', slots, ['default']);
    	let { height = 0 } = $$props;
    	let { offset = 150 } = $$props;
    	let { fadeOption = { delay: 0, duration: 400 } } = $$props;
    	let { resetHeightDelay = 0 } = $$props;
    	let { onload = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { placeholderProps = null } = $$props;
    	let { class: className = '' } = $$props;
    	const rootClass = 'svelte-lazy' + (className ? ' ' + className : '');
    	const rootInitialHeight = getStyleHeight();
    	let loaded = false;
    	let contentShow = true;

    	function load(node) {
    		setHeight(node);

    		const loadHandler = throttle(
    			e => {
    				const nodeTop = node.getBoundingClientRect().top;
    				const expectedTop = getContainerHeight(e) + offset;

    				if (nodeTop <= expectedTop) {
    					$$invalidate(4, loaded = true);
    					resetHeight(node);
    					onload && onload(node);
    					removeListeners(loadHandler);
    				}
    			},
    			200
    		);

    		addListeners(loadHandler);

    		setTimeout(() => {
    			loadHandler();
    		});

    		return {
    			destroy: () => {
    				removeListeners(loadHandler);
    			}
    		};
    	}

    	function getStyleHeight() {
    		return typeof height === 'number' ? height + 'px' : height;
    	}

    	function setHeight(node) {
    		if (height) {
    			node.style.height = getStyleHeight();
    		}
    	}

    	function resetHeight(node) {
    		setTimeout(
    			() => {
    				const isLoading = checkImgLoadingStatus(node); // Add a delay to wait for remote resources like images to load

    				if (!isLoading) {
    					node.style.height = 'auto';
    				}
    			},
    			resetHeightDelay
    		); // Add a delay to wait for remote resources like images to load
    	}

    	function checkImgLoadingStatus(node) {
    		const img = node.querySelector('img');

    		if (!img) {
    			return false;
    		}

    		if (!img.complete) {
    			$$invalidate(3, contentShow = false);

    			node.addEventListener(
    				'load',
    				() => {
    					// Use auto height if loading successfully
    					$$invalidate(3, contentShow = true);

    					node.style.height = 'auto';
    				},
    				{ capture: true, once: true }
    			);

    			node.addEventListener(
    				'error',
    				() => {
    					// Show content with fixed height if there is error
    					$$invalidate(3, contentShow = true);
    				},
    				{ capture: true, once: true }
    			);

    			return true;
    		}

    		if (img.naturalHeight === 0) {
    			// Use fixed height if img has zero height
    			return true;
    		}

    		return false;
    	}

    	const writable_props = [
    		'height',
    		'offset',
    		'fadeOption',
    		'resetHeightDelay',
    		'onload',
    		'placeholder',
    		'placeholderProps',
    		'class'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(9, height = $$props.height);
    		if ('offset' in $$props) $$invalidate(10, offset = $$props.offset);
    		if ('fadeOption' in $$props) $$invalidate(0, fadeOption = $$props.fadeOption);
    		if ('resetHeightDelay' in $$props) $$invalidate(11, resetHeightDelay = $$props.resetHeightDelay);
    		if ('onload' in $$props) $$invalidate(12, onload = $$props.onload);
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('placeholderProps' in $$props) $$invalidate(2, placeholderProps = $$props.placeholderProps);
    		if ('class' in $$props) $$invalidate(13, className = $$props.class);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		Placeholder,
    		height,
    		offset,
    		fadeOption,
    		resetHeightDelay,
    		onload,
    		placeholder,
    		placeholderProps,
    		className,
    		rootClass,
    		contentClass,
    		rootInitialHeight,
    		loaded,
    		contentShow,
    		load,
    		addListeners,
    		removeListeners,
    		getStyleHeight,
    		setHeight,
    		resetHeight,
    		checkImgLoadingStatus,
    		getContainerHeight,
    		throttle,
    		contentStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(9, height = $$props.height);
    		if ('offset' in $$props) $$invalidate(10, offset = $$props.offset);
    		if ('fadeOption' in $$props) $$invalidate(0, fadeOption = $$props.fadeOption);
    		if ('resetHeightDelay' in $$props) $$invalidate(11, resetHeightDelay = $$props.resetHeightDelay);
    		if ('onload' in $$props) $$invalidate(12, onload = $$props.onload);
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('placeholderProps' in $$props) $$invalidate(2, placeholderProps = $$props.placeholderProps);
    		if ('className' in $$props) $$invalidate(13, className = $$props.className);
    		if ('loaded' in $$props) $$invalidate(4, loaded = $$props.loaded);
    		if ('contentShow' in $$props) $$invalidate(3, contentShow = $$props.contentShow);
    		if ('contentStyle' in $$props) $$invalidate(5, contentStyle = $$props.contentStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*contentShow*/ 8) {
    			$$invalidate(5, contentStyle = !contentShow ? 'display: none' : '');
    		}
    	};

    	return [
    		fadeOption,
    		placeholder,
    		placeholderProps,
    		contentShow,
    		loaded,
    		contentStyle,
    		rootClass,
    		rootInitialHeight,
    		load,
    		height,
    		offset,
    		resetHeightDelay,
    		onload,
    		className,
    		$$scope,
    		slots
    	];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			height: 9,
    			offset: 10,
    			fadeOption: 0,
    			resetHeightDelay: 11,
    			onload: 12,
    			placeholder: 1,
    			placeholderProps: 2,
    			class: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get height() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fadeOption() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fadeOption(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetHeightDelay() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resetHeightDelay(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onload() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onload(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderProps() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderProps(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.46.4 */
    const file$7 = "src/pages/Home.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (18:8) <Lazy height={300}>
    function create_default_slot$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "assets/pictures/" + /*subject*/ ctx[1].dir + "/IMG_1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 18, 10, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subjects*/ 1 && !src_url_equal(img.src, img_src_value = "assets/pictures/" + /*subject*/ ctx[1].dir + "/IMG_1.jpg")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(18:8) <Lazy height={300}>",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#each subjects as subject}
    function create_each_block$3(ctx) {
    	let div;
    	let lazy;
    	let t0;
    	let h1;
    	let a;
    	let t1_value = /*subject*/ ctx[1].title + "";
    	let t1;
    	let a_href_value;
    	let t2;
    	let p;
    	let t3_value = /*subject*/ ctx[1].description + "";
    	let t3;
    	let t4;
    	let current;

    	lazy = new Src({
    			props: {
    				height: 300,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lazy.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			a = element("a");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(a, "href", a_href_value = '#' + /*subject*/ ctx[1].dir);
    			add_location(a, file$7, 20, 12, 672);
    			add_location(h1, file$7, 20, 8, 668);
    			add_location(p, file$7, 22, 8, 744);
    			attr_dev(div, "class", "brick hover-effect");
    			set_style(div, "background-color", "black");
    			add_location(div, file$7, 16, 6, 474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lazy, div, null);
    			append_dev(div, t0);
    			append_dev(div, h1);
    			append_dev(h1, a);
    			append_dev(a, t1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lazy_changes = {};

    			if (dirty & /*$$scope, subjects*/ 17) {
    				lazy_changes.$$scope = { dirty, ctx };
    			}

    			lazy.$set(lazy_changes);
    			if ((!current || dirty & /*subjects*/ 1) && t1_value !== (t1_value = /*subject*/ ctx[1].title + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*subjects*/ 1 && a_href_value !== (a_href_value = '#' + /*subject*/ ctx[1].dir)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty & /*subjects*/ 1) && t3_value !== (t3_value = /*subject*/ ctx[1].description + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lazy);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(16:4) {#each subjects as subject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div3;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let h10;
    	let t3;
    	let h11;
    	let t5;
    	let h12;
    	let t7;
    	let div2;
    	let current;
    	let each_value = /*subjects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			h10 = element("h1");
    			h10.textContent = "Willkommen zur Kunstgalerie";
    			t3 = space();
    			h11 = element("h1");
    			h11.textContent = "des Birklehof!";
    			t5 = space();
    			h12 = element("h1");
    			h12.textContent = "Willkommen zur Kunstgalerie des Birklehof!";
    			t7 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = "assets/others/landing.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 8, 4, 121);
    			attr_dev(div0, "class", "overlay");
    			add_location(div0, file$7, 9, 4, 172);
    			attr_dev(h10, "class", "main-title big-title");
    			add_location(h10, file$7, 10, 4, 204);
    			attr_dev(h11, "class", "main-title big-title");
    			add_location(h11, file$7, 11, 4, 274);
    			attr_dev(h12, "class", "small-title");
    			add_location(h12, file$7, 12, 4, 331);
    			attr_dev(div1, "class", "landing");
    			add_location(div1, file$7, 7, 2, 95);
    			attr_dev(div2, "class", "masonry");
    			add_location(div2, file$7, 14, 2, 414);
    			add_location(div3, file$7, 6, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h10);
    			append_dev(div1, t3);
    			append_dev(div1, h11);
    			append_dev(div1, t5);
    			append_dev(div1, h12);
    			append_dev(div3, t7);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*subjects*/ 1) {
    				each_value = /*subjects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { subjects = [] } = $$props;
    	const writable_props = ['subjects'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('subjects' in $$props) $$invalidate(0, subjects = $$props.subjects);
    	};

    	$$self.$capture_state = () => ({ Lazy: Src, subjects });

    	$$self.$inject_state = $$props => {
    		if ('subjects' in $$props) $$invalidate(0, subjects = $$props.subjects);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subjects];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { subjects: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get subjects() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subjects(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/components/IconBase.svelte generated by Svelte v3.46.4 */

    const file$6 = "node_modules/svelte-icons/components/IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$1(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$6, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$6, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
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
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;
    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*viewBox*/ ctx[1] === undefined && !('viewBox' in props)) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/io/IoIosArrowBack.svelte generated by Svelte v3.46.4 */
    const file$5 = "node_modules/svelte-icons/io/IoIosArrowBack.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z");
    			add_location(path, file$5, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosArrowBack', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosArrowBack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowBack",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* node_modules/svelte-icons/io/IoIosArrowForward.svelte generated by Svelte v3.46.4 */
    const file$4 = "node_modules/svelte-icons/io/IoIosArrowForward.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z");
    			add_location(path, file$4, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosArrowForward', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosArrowForward extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosArrowForward",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* node_modules/svelte-icons/io/IoIosClose.svelte generated by Svelte v3.46.4 */
    const file$3 = "node_modules/svelte-icons/io/IoIosClose.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z");
    			add_location(path, file$3, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IoIosClose', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class IoIosClose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IoIosClose",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/Subject.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/pages/Subject.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (91:10) <Lazy height={300}>
    function create_default_slot$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image_path*/ ctx[1] + (/*i*/ ctx[9] + 1).toString() + '.jpg')) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 91, 12, 2827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(91:10) <Lazy height={300}>",
    		ctx
    	});

    	return block;
    }

    // (89:4) {#each Array(subject.max_image_id) as _, i}
    function create_each_block$2(ctx) {
    	let div;
    	let lazy;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	lazy = new Src({
    			props: {
    				height: 300,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*i*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lazy.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "brick clickable");
    			add_location(div, file$2, 89, 6, 2722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lazy, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const lazy_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				lazy_changes.$$scope = { dirty, ctx };
    			}

    			lazy.$set(lazy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lazy);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(89:4) {#each Array(subject.max_image_id) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div12;
    	let div3;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let h10;
    	let t2_value = /*subject*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let h11;
    	let t4_value = /*subject*/ ctx[0].title + "";
    	let t4;
    	let t5;
    	let div1;
    	let p0;
    	let t6_value = /*subject*/ ctx[0].class + "";
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*subject*/ ctx[0].materials + "";
    	let t8;
    	let t9;
    	let p2;
    	let t10_value = /*subject*/ ctx[0].description + "";
    	let t10;
    	let t11;
    	let div2;
    	let a;
    	let p3;
    	let t13;
    	let div10;
    	let div5;
    	let div4;
    	let ioiosarrowback;
    	let t14;
    	let img1;
    	let img1_src_value;
    	let t15;
    	let div7;
    	let div6;
    	let ioiosarrowforward;
    	let t16;
    	let div9;
    	let div8;
    	let ioiosclose;
    	let t17;
    	let div11;
    	let div11_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	ioiosarrowback = new IoIosArrowBack({ $$inline: true });
    	ioiosarrowforward = new IoIosArrowForward({ $$inline: true });
    	ioiosclose = new IoIosClose({ $$inline: true });
    	let each_value = Array(/*subject*/ ctx[0].max_image_id);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div3 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			h10 = element("h1");
    			t2 = text(t2_value);
    			t3 = space();
    			h11 = element("h1");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			t10 = text(t10_value);
    			t11 = space();
    			div2 = element("div");
    			a = element("a");
    			p3 = element("p");
    			p3.textContent = "Zurück zur Übersicht";
    			t13 = space();
    			div10 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			create_component(ioiosarrowback.$$.fragment);
    			t14 = space();
    			img1 = element("img");
    			t15 = space();
    			div7 = element("div");
    			div6 = element("div");
    			create_component(ioiosarrowforward.$$.fragment);
    			t16 = space();
    			div9 = element("div");
    			div8 = element("div");
    			create_component(ioiosclose.$$.fragment);
    			t17 = space();
    			div11 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img0.src, img0_src_value = /*image_path*/ ctx[1] + (Math.floor(Math.random() * (/*subject*/ ctx[0].max_image_id - 1)) + 1).toString() + '.jpg')) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Landing");
    			add_location(img0, file$2, 48, 4, 1522);
    			attr_dev(div0, "class", "overlay");
    			add_location(div0, file$2, 49, 4, 1644);
    			attr_dev(h10, "class", "big-title");
    			add_location(h10, file$2, 50, 4, 1676);
    			attr_dev(h11, "class", "small-title");
    			add_location(h11, file$2, 51, 4, 1723);
    			attr_dev(p0, "class", "class");
    			add_location(p0, file$2, 53, 6, 1797);
    			attr_dev(p1, "class", "materials");
    			add_location(p1, file$2, 56, 6, 1856);
    			attr_dev(p2, "class", "description");
    			add_location(p2, file$2, 59, 6, 1923);
    			attr_dev(div1, "class", "info");
    			add_location(div1, file$2, 52, 4, 1772);
    			add_location(p3, file$2, 65, 8, 2058);
    			attr_dev(a, "href", "#Home");
    			attr_dev(a, "class", "back-link");
    			add_location(a, file$2, 64, 6, 2015);
    			add_location(div2, file$2, 63, 4, 2003);
    			attr_dev(div3, "class", "landing");
    			add_location(div3, file$2, 47, 2, 1496);
    			attr_dev(div4, "class", "icon");
    			add_location(div4, file$2, 71, 6, 2208);
    			attr_dev(div5, "id", "next_left");
    			attr_dev(div5, "class", "clickable");
    			add_location(div5, file$2, 70, 4, 2142);
    			attr_dev(img1, "id", "focus_image");
    			if (!src_url_equal(img1.src, img1_src_value = "")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Please wait ... ");
    			add_location(img1, file$2, 75, 4, 2282);
    			attr_dev(div6, "class", "icon");
    			add_location(div6, file$2, 77, 6, 2407);
    			attr_dev(div7, "id", "next_right");
    			attr_dev(div7, "class", "clickable");
    			add_location(div7, file$2, 76, 4, 2339);
    			attr_dev(div8, "class", "icon");
    			add_location(div8, file$2, 82, 6, 2547);
    			attr_dev(div9, "id", "close");
    			attr_dev(div9, "class", "clickable");
    			add_location(div9, file$2, 81, 4, 2484);
    			attr_dev(div10, "id", "overlay");
    			add_location(div10, file$2, 69, 2, 2119);
    			attr_dev(div11, "class", "masonry");
    			attr_dev(div11, "style", div11_style_value = /*subject*/ ctx[0].style);
    			add_location(div11, file$2, 87, 2, 2624);
    			add_location(div12, file$2, 46, 0, 1488);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div3);
    			append_dev(div3, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, h10);
    			append_dev(h10, t2);
    			append_dev(div3, t3);
    			append_dev(div3, h11);
    			append_dev(h11, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(div1, t9);
    			append_dev(div1, p2);
    			append_dev(p2, t10);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, p3);
    			append_dev(div12, t13);
    			append_dev(div12, div10);
    			append_dev(div10, div5);
    			append_dev(div5, div4);
    			mount_component(ioiosarrowback, div4, null);
    			append_dev(div10, t14);
    			append_dev(div10, img1);
    			append_dev(div10, t15);
    			append_dev(div10, div7);
    			append_dev(div7, div6);
    			mount_component(ioiosarrowforward, div6, null);
    			append_dev(div10, t16);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			mount_component(ioiosclose, div8, null);
    			append_dev(div12, t17);
    			append_dev(div12, div11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div11, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div5, "click", /*next_left*/ ctx[3], false, false, false),
    					listen_dev(div7, "click", /*next_right*/ ctx[4], false, false, false),
    					listen_dev(div9, "click", hide_image$1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*subject*/ 1 && !src_url_equal(img0.src, img0_src_value = /*image_path*/ ctx[1] + (Math.floor(Math.random() * (/*subject*/ ctx[0].max_image_id - 1)) + 1).toString() + '.jpg')) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if ((!current || dirty & /*subject*/ 1) && t2_value !== (t2_value = /*subject*/ ctx[0].title + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*subject*/ 1) && t4_value !== (t4_value = /*subject*/ ctx[0].title + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*subject*/ 1) && t6_value !== (t6_value = /*subject*/ ctx[0].class + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*subject*/ 1) && t8_value !== (t8_value = /*subject*/ ctx[0].materials + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*subject*/ 1) && t10_value !== (t10_value = /*subject*/ ctx[0].description + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*show_image, image_path, subject*/ 7) {
    				each_value = Array(/*subject*/ ctx[0].max_image_id);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div11, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*subject*/ 1 && div11_style_value !== (div11_style_value = /*subject*/ ctx[0].style)) {
    				attr_dev(div11, "style", div11_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiosarrowback.$$.fragment, local);
    			transition_in(ioiosarrowforward.$$.fragment, local);
    			transition_in(ioiosclose.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiosarrowback.$$.fragment, local);
    			transition_out(ioiosarrowforward.$$.fragment, local);
    			transition_out(ioiosclose.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_component(ioiosarrowback);
    			destroy_component(ioiosarrowforward);
    			destroy_component(ioiosclose);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function hide_image$1() {
    	document.getElementById('overlay').style.display = 'none';
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Subject', slots, []);
    	onMount(() => window.scrollTo(0, 0));

    	let { subject = {
    		title: '',
    		dir: '',
    		max_image_id: 0,
    		class: '',
    		materials: '',
    		description: '',
    		style: ''
    	} } = $$props;

    	const image_path = 'assets/pictures/' + subject.dir + '/IMG_';
    	let curr_image_id = 0;

    	function show_image(image_id) {
    		curr_image_id = image_id + 1;
    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + '.jpg';
    		document.getElementById('overlay').style.display = 'block';
    	}

    	function next_left() {
    		curr_image_id -= 1;

    		if (curr_image_id < 1) {
    			curr_image_id = subject.max_image_id;
    		}

    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + '.jpg';
    	}

    	function next_right() {
    		curr_image_id += 1;

    		if (curr_image_id > subject.max_image_id) {
    			curr_image_id = 1;
    		}

    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + '.jpg';
    	}

    	const writable_props = ['subject'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Subject> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => {
    		show_image(i);
    	};

    	$$self.$$set = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    	};

    	$$self.$capture_state = () => ({
    		IoIosArrowBack,
    		IoIosArrowForward,
    		IoIosClose,
    		Lazy: Src,
    		onMount,
    		subject,
    		image_path,
    		curr_image_id,
    		show_image,
    		hide_image: hide_image$1,
    		next_left,
    		next_right
    	});

    	$$self.$inject_state = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    		if ('curr_image_id' in $$props) curr_image_id = $$props.curr_image_id;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subject, image_path, show_image, next_left, next_right, click_handler];
    }

    class Subject extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { subject: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Subject",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get subject() {
    		throw new Error("<Subject>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<Subject>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Subject_Subcategories.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/pages/Subject_Subcategories.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (107:12) <Lazy height={300}>
    function create_default_slot(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image_path*/ ctx[1] + (/*j*/ ctx[12] + /*category*/ ctx[7].image_range[0]).toString() + /*category*/ ctx[7].ending)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Please wait ... ");
    			add_location(img, file$1, 107, 14, 3534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subject*/ 1 && !src_url_equal(img.src, img_src_value = /*image_path*/ ctx[1] + (/*j*/ ctx[12] + /*category*/ ctx[7].image_range[0]).toString() + /*category*/ ctx[7].ending)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(107:12) <Lazy height={300}>",
    		ctx
    	});

    	return block;
    }

    // (105:8) {#each Array(category.image_range[1]-category.image_range[0]+1) as _, j}
    function create_each_block_1(ctx) {
    	let div;
    	let lazy;
    	let current;
    	let mounted;
    	let dispose;

    	lazy = new Src({
    			props: {
    				height: 300,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*j*/ ctx[12], /*category*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lazy.$$.fragment);
    			attr_dev(div, "class", "brick clickable");
    			add_location(div, file$1, 105, 10, 3382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lazy, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const lazy_changes = {};

    			if (dirty & /*$$scope, subject*/ 8193) {
    				lazy_changes.$$scope = { dirty, ctx };
    			}

    			lazy.$set(lazy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lazy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lazy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lazy);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(105:8) {#each Array(category.image_range[1]-category.image_range[0]+1) as _, j}",
    		ctx
    	});

    	return block;
    }

    // (103:4) {#each subject.categories as category}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let div_style_value;
    	let current;
    	let each_value_1 = Array(/*category*/ ctx[7].image_range[1] - /*category*/ ctx[7].image_range[0] + 1);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "masonry");
    			attr_dev(div, "style", div_style_value = /*subject*/ ctx[0].style);
    			add_location(div, file$1, 103, 6, 3247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*show_image, subject, image_path*/ 7) {
    				each_value_1 = Array(/*category*/ ctx[7].image_range[1] - /*category*/ ctx[7].image_range[0] + 1);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*subject*/ 1 && div_style_value !== (div_style_value = /*subject*/ ctx[0].style)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(103:4) {#each subject.categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div11;
    	let div3;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let h10;
    	let t2_value = /*subject*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let h11;
    	let t4_value = /*subject*/ ctx[0].title + "";
    	let t4;
    	let t5;
    	let div1;
    	let p0;
    	let t6_value = /*subject*/ ctx[0].class + "";
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = /*subject*/ ctx[0].materials + "";
    	let t8;
    	let t9;
    	let p2;
    	let t10_value = /*subject*/ ctx[0].description + "";
    	let t10;
    	let t11;
    	let div2;
    	let a;
    	let p3;
    	let t13;
    	let div10;
    	let div5;
    	let div4;
    	let ioiosarrowback;
    	let t14;
    	let img1;
    	let img1_src_value;
    	let t15;
    	let div7;
    	let div6;
    	let ioiosarrowforward;
    	let t16;
    	let div9;
    	let div8;
    	let ioiosclose;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;
    	ioiosarrowback = new IoIosArrowBack({ $$inline: true });
    	ioiosarrowforward = new IoIosArrowForward({ $$inline: true });
    	ioiosclose = new IoIosClose({ $$inline: true });
    	let each_value = /*subject*/ ctx[0].categories;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div3 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			h10 = element("h1");
    			t2 = text(t2_value);
    			t3 = space();
    			h11 = element("h1");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			t10 = text(t10_value);
    			t11 = space();
    			div2 = element("div");
    			a = element("a");
    			p3 = element("p");
    			p3.textContent = "Zurück zur Übersicht";
    			t13 = space();
    			div10 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			create_component(ioiosarrowback.$$.fragment);
    			t14 = space();
    			img1 = element("img");
    			t15 = space();
    			div7 = element("div");
    			div6 = element("div");
    			create_component(ioiosarrowforward.$$.fragment);
    			t16 = space();
    			div9 = element("div");
    			div8 = element("div");
    			create_component(ioiosclose.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img0.src, img0_src_value = /*image_path*/ ctx[1] + (Math.floor(Math.random() * (/*subject*/ ctx[0].max_image_id - 1)) + 1).toString() + '.jpg')) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Landing");
    			add_location(img0, file$1, 62, 4, 2113);
    			attr_dev(div0, "class", "overlay");
    			add_location(div0, file$1, 63, 4, 2235);
    			attr_dev(h10, "class", "big-title");
    			add_location(h10, file$1, 64, 4, 2267);
    			attr_dev(h11, "class", "small-title");
    			add_location(h11, file$1, 65, 4, 2314);
    			attr_dev(p0, "class", "class");
    			add_location(p0, file$1, 67, 6, 2388);
    			attr_dev(p1, "class", "materials");
    			add_location(p1, file$1, 70, 6, 2447);
    			attr_dev(p2, "class", "description");
    			add_location(p2, file$1, 73, 6, 2514);
    			attr_dev(div1, "class", "info");
    			add_location(div1, file$1, 66, 4, 2363);
    			add_location(p3, file$1, 79, 8, 2649);
    			attr_dev(a, "href", "#Home");
    			attr_dev(a, "class", "back-link");
    			add_location(a, file$1, 78, 6, 2606);
    			add_location(div2, file$1, 77, 4, 2594);
    			attr_dev(div3, "class", "landing");
    			add_location(div3, file$1, 61, 2, 2087);
    			attr_dev(div4, "class", "icon");
    			add_location(div4, file$1, 85, 6, 2799);
    			attr_dev(div5, "id", "next_left");
    			attr_dev(div5, "class", "clickable");
    			add_location(div5, file$1, 84, 4, 2733);
    			attr_dev(img1, "id", "focus_image");
    			if (!src_url_equal(img1.src, img1_src_value = "")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$1, 89, 4, 2873);
    			attr_dev(div6, "class", "icon");
    			add_location(div6, file$1, 91, 6, 2982);
    			attr_dev(div7, "id", "next_right");
    			attr_dev(div7, "class", "clickable");
    			add_location(div7, file$1, 90, 4, 2914);
    			attr_dev(div8, "class", "icon");
    			add_location(div8, file$1, 96, 6, 3122);
    			attr_dev(div9, "id", "close");
    			attr_dev(div9, "class", "clickable");
    			add_location(div9, file$1, 95, 4, 3059);
    			attr_dev(div10, "id", "overlay");
    			add_location(div10, file$1, 83, 2, 2710);
    			add_location(div11, file$1, 60, 0, 2079);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div3);
    			append_dev(div3, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, h10);
    			append_dev(h10, t2);
    			append_dev(div3, t3);
    			append_dev(div3, h11);
    			append_dev(h11, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(div1, t9);
    			append_dev(div1, p2);
    			append_dev(p2, t10);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, p3);
    			append_dev(div11, t13);
    			append_dev(div11, div10);
    			append_dev(div10, div5);
    			append_dev(div5, div4);
    			mount_component(ioiosarrowback, div4, null);
    			append_dev(div10, t14);
    			append_dev(div10, img1);
    			append_dev(div10, t15);
    			append_dev(div10, div7);
    			append_dev(div7, div6);
    			mount_component(ioiosarrowforward, div6, null);
    			append_dev(div10, t16);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			mount_component(ioiosclose, div8, null);
    			append_dev(div11, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div11, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div5, "click", /*next_left*/ ctx[3], false, false, false),
    					listen_dev(div7, "click", /*next_right*/ ctx[4], false, false, false),
    					listen_dev(div9, "click", hide_image, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*subject*/ 1 && !src_url_equal(img0.src, img0_src_value = /*image_path*/ ctx[1] + (Math.floor(Math.random() * (/*subject*/ ctx[0].max_image_id - 1)) + 1).toString() + '.jpg')) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if ((!current || dirty & /*subject*/ 1) && t2_value !== (t2_value = /*subject*/ ctx[0].title + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*subject*/ 1) && t4_value !== (t4_value = /*subject*/ ctx[0].title + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*subject*/ 1) && t6_value !== (t6_value = /*subject*/ ctx[0].class + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*subject*/ 1) && t8_value !== (t8_value = /*subject*/ ctx[0].materials + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*subject*/ 1) && t10_value !== (t10_value = /*subject*/ ctx[0].description + "")) set_data_dev(t10, t10_value);

    			if (dirty & /*subject, Array, show_image, image_path*/ 7) {
    				each_value = /*subject*/ ctx[0].categories;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div11, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ioiosarrowback.$$.fragment, local);
    			transition_in(ioiosarrowforward.$$.fragment, local);
    			transition_in(ioiosclose.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ioiosarrowback.$$.fragment, local);
    			transition_out(ioiosarrowforward.$$.fragment, local);
    			transition_out(ioiosclose.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(ioiosarrowback);
    			destroy_component(ioiosarrowforward);
    			destroy_component(ioiosclose);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function hide_image() {
    	document.getElementById('overlay').style.display = 'none';
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Subject_Subcategories', slots, []);
    	onMount(() => window.scrollTo(0, 0));

    	let { subject = {
    		title: '',
    		dir: '',
    		max_image_id: 0,
    		categories: [],
    		class: '',
    		materials: '',
    		description: '',
    		style: ''
    	} } = $$props;

    	const image_path = 'assets/pictures/' + subject.dir + '/IMG_';
    	let curr_image_id = 0;

    	function show_image(image_id, ending = '.jpg') {
    		document.getElementById('focus_image').src = '';
    		curr_image_id = image_id + 1;
    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + ending;
    		document.getElementById('overlay').style.display = 'block';
    	}

    	function next_left() {
    		curr_image_id -= 1;

    		if (curr_image_id < 1) {
    			curr_image_id = subject.max_image_id;
    		}

    		let ending = '.jpg';

    		subject.categories.forEach(category => {
    			if (category.image_range[0] <= curr_image_id && category.image_range[1] >= curr_image_id) {
    				ending = category.ending;
    			}
    		});

    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + ending;
    	}

    	function next_right() {
    		curr_image_id += 1;

    		if (curr_image_id > subject.max_image_id) {
    			curr_image_id = 1;
    		}

    		let ending = '.jpg';

    		subject.categories.forEach(category => {
    			if (category.image_range[0] <= curr_image_id && category.image_range[1] >= curr_image_id) {
    				ending = category.ending;
    			}
    		});

    		document.getElementById('focus_image').src = image_path + curr_image_id.toString() + ending;
    	}

    	const writable_props = ['subject'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Subject_Subcategories> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (j, category) => {
    		show_image(j + category.image_range[0] - 1, category.ending);
    	};

    	$$self.$$set = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    	};

    	$$self.$capture_state = () => ({
    		IoIosArrowBack,
    		IoIosArrowForward,
    		IoIosClose,
    		Lazy: Src,
    		onMount,
    		subject,
    		image_path,
    		curr_image_id,
    		show_image,
    		hide_image,
    		next_left,
    		next_right
    	});

    	$$self.$inject_state = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    		if ('curr_image_id' in $$props) curr_image_id = $$props.curr_image_id;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subject, image_path, show_image, next_left, next_right, click_handler];
    }

    class Subject_Subcategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { subject: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Subject_Subcategories",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get subject() {
    		throw new Error("<Subject_Subcategories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<Subject_Subcategories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (254:1) {#if page==="#Home" || page===""}
    function create_if_block_2(ctx) {
    	let home;
    	let current;

    	home = new Home({
    			props: { subjects: /*subjects*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(254:1) {#if page===\\\"#Home\\\" || page===\\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (259:2) {#if page === '#' + subject.dir}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*subject*/ ctx[3].categories && /*subject*/ ctx[3].categories !== []) return 0;
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
    			if_block.p(ctx, dirty);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(259:2) {#if page === '#' + subject.dir}",
    		ctx
    	});

    	return block;
    }

    // (262:3) {:else}
    function create_else_block(ctx) {
    	let subject;
    	let current;

    	subject = new Subject({
    			props: { subject: /*subject*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(subject.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(subject, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(subject.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(subject.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(subject, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(262:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:3) {#if subject.categories && subject.categories !== []}
    function create_if_block_1(ctx) {
    	let subject_subcategories;
    	let current;

    	subject_subcategories = new Subject_Subcategories({
    			props: { subject: /*subject*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(subject_subcategories.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(subject_subcategories, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(subject_subcategories.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(subject_subcategories.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(subject_subcategories, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(260:3) {#if subject.categories && subject.categories !== []}",
    		ctx
    	});

    	return block;
    }

    // (258:1) {#each subjects as subject}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*page*/ ctx[0] === '#' + /*subject*/ ctx[3].dir && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*page*/ ctx[0] === '#' + /*subject*/ ctx[3].dir) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*page*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(258:1) {#each subjects as subject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*page*/ ctx[0] === "#Home" || /*page*/ ctx[0] === "") && create_if_block_2(ctx);
    	let each_value = /*subjects*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "alt", "Birklehof | Privates Internat & Gymnasium");
    			set_style(img, "cursor", "pointer");
    			attr_dev(img, "id", "logo");
    			if (!src_url_equal(img.src, img_src_value = "./assets/others/logo.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 251, 2, 7486);
    			attr_dev(div, "class", "toolbar");
    			add_location(div, file, 250, 1, 7462);
    			add_location(main, file, 249, 0, 7454);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, img);
    			append_dev(main, t0);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*page*/ ctx[0] === "#Home" || /*page*/ ctx[0] === "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*page*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*subjects, page*/ 3) {
    				each_value = /*subjects*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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

    function openInNewTab(url) {
    	window.open(url, '_blank').focus();
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let page = document.location.hash;

    	window.onpopstate = function (_event) {
    		$$invalidate(0, page = document.location.hash);
    	};

    	// TODO Schuhe von links nach rechts
    	const subjects = [
    		{
    			title: 'Waldboden',
    			dir: 'Waldboden',
    			max_image_id: 9,
    			class: 'Klasse 7, Dezember 2021',
    			materials: 'Acryl auf Papier, ca. 40 x 40 cm',
    			description: 'Wir gingen gemeinsam in den Wald um Skizzen von den organischen Gegenständen, die auf dem Waldboden zu sehen sind, zu erfassen. Ausgehend von diesen Zeichnungen haben die SchülerInnen begonnen Schicht für Schicht die Waldböden zu malen.'
    		},
    		{
    			title: 'Schwarzwald',
    			dir: 'Schwarzwald',
    			max_image_id: 10,
    			class: 'Q2, Feb 2022',
    			materials: 'Aquarell auf Papier, ca. 20 x 30 cm',
    			description: 'Raumtiefe entsteht durch Landschaftsebenen, Proportionen und die Luftperspektive (Verblassen und Verblauen von in der Ferne liegenden Bildelementen). In dieser praktischen Arbeit wurden typische Schwarzwaldlandschaften umgesetzt. '
    		},
    		{
    			title: 'Stillleben',
    			dir: 'Stillleben',
    			max_image_id: 5,
    			class: 'Q1, Feb 2022',
    			materials: 'Acryl auf Leinwand, 40 x 50 cm',
    			description: 'Nach der kunstgeschichtlichen Auseinandersetzung mit Stillleben verschiedener Epochen, erprobten und entwickelten die Schülerinnen einen eigenen Stil und setzten diesen in ihrem individuellen Stillleben um.'
    		},
    		{
    			title: 'Ausstellungsraum',
    			dir: 'Ausstellungsraum',
    			max_image_id: 19,
    			categories: [
    				{ ending: '.jpg', image_range: [1, 3] },
    				{ ending: '.jpg', image_range: [4, 7] },
    				{ ending: '.jpg', image_range: [8, 8] },
    				{ ending: '.jpg', image_range: [9, 13] },
    				{ ending: '.jpg', image_range: [14, 16] },
    				{ ending: '.jpg', image_range: [17, 19] }
    			],
    			class: 'Q1, Juni 2021',
    			materials: 'Modelle aus Holzpappe und PVC-Folien',
    			description: 'Es sollte ein minimalistisches Einraum-Gebäude entworfen werden, welches an einem spezifischen Ort auf dem Birklehofgelände gebaut werden könnte, um SchülerInnen-Arbeiten auszustellen. Inspirationsquelle dazu war die Arbeit Peter Zumthors, insbesondere das Kunsthaus Bregenz.'
    		},
    		{
    			title: 'Konsumwaren',
    			dir: 'Konsumwaren',
    			max_image_id: 25,
    			categories: [
    				{ ending: '.jpg', image_range: [2, 4] },
    				{ ending: '.jpg', image_range: [5, 7] },
    				{ ending: '.jpg', image_range: [8, 8] },
    				{ ending: '.jpg', image_range: [9, 10] },
    				{ ending: '.jpg', image_range: [11, 13] },
    				{ ending: '.jpg', image_range: [14, 16] },
    				{ ending: '.jpg', image_range: [17, 19] },
    				{ ending: '.jpg', image_range: [20, 22] },
    				{ ending: '.jpg', image_range: [23, 25] }
    			],
    			class: 'Klassen 10B & 10C, Juli 2021',
    			materials: 'Hartschaumskulpturen, Permanentmarker und Acrylfarben, ca. 10 x 15 cm',
    			description: 'Das Material eignet sich gut, um täuschend echte Reproduktionen zu gestalten. Die Aufgabenstellung war, einen Artikel nachzuahmen und in der Bemalung eine kritische Botschaft zu verstecken, die wie das Künstliche des Produkt selbst, erst bei näherer Betrachtung offenbart wird.'
    		},
    		{
    			title: 'Fotoworkshop mit Jan von Holleben',
    			dir: 'Workshop',
    			max_image_id: 17,
    			categories: [
    				{ ending: '.jpg', image_range: [1, 9] },
    				{ ending: '.GIF', image_range: [10, 17] }
    			],
    			class: '14 SchülerInnen der Orientierungsstufe, Jan 2022',
    			materials: 'Fotografien und Stop Motion Animationen',
    			description: 'Die BirklehoferInnen hatte während einem Wochenende die Möglichkeit mit dem Fotokünstler Jan von Holleben ihre fantastischen Ideen in Bildern umzusetzen. Dieser Workshop wurde durch die Elisabeth-Schneider-Stiftung möglich gemacht.\n' + '\n' + '©Jan von Holleben 2022'
    		},
    		{
    			title: 'Schmuckstücke',
    			dir: 'Schmuckstuecke',
    			max_image_id: 6,
    			class: 'Q1, Dez 2021',
    			materials: 'Bleistift und Buntstifte, 30 x 50 cm',
    			description: 'Hier war es die Aufgabe, verschiedene künstliche und natürliche Objekte zu arrangieren und die verschiedenen Oberflächenstrukturen möglichst naturalistisch umzusetzen'
    		},
    		{
    			title: 'Möbeldesign',
    			dir: 'Moebeldesign',
    			max_image_id: 30,
    			categories: [
    				{ ending: '.jpg', image_range: [1, 3] },
    				{ ending: '.jpg', image_range: [4, 8] },
    				{ ending: '.jpg', image_range: [9, 14] },
    				{ ending: '.jpg', image_range: [15, 19] },
    				{ ending: '.jpg', image_range: [20, 22] },
    				{ ending: '.jpg', image_range: [23, 26] },
    				{ ending: '.jpg', image_range: [27, 30] }
    			],
    			class: 'Klasse 6, Feb 2022',
    			materials: 'Modelle aus Holzpappe, Strohhalmen ect, ca. 10 x 15 cm',
    			description: 'Auf spielerische Art und Weise hat sich die Klasse dem Thema Möbeldesign genähert und ein Modell entworfen, welches zwei unterschiedliche Funktionen hat.'
    		},
    		{
    			title: 'Fragmente',
    			dir: 'Fragmente',
    			max_image_id: 6,
    			class: 'Klasse 8 und 9 MuK, April 2021',
    			materials: 'Bleistift, Fineliner, Filzstifte, vers. Formate',
    			description: 'Während dem Fernunterricht setzten sich die SchülerInnen mit Bildfragmenten und linearen Zeichnungsformen auseinander. Nach verschiedenen Übungen sollte in Kleingruppen Bilder fragmentiert werden und die jeweiligen Fragmente mit unterschiedlichen linearen Gestaltungsmethoden umgesetzt werden.',
    			style: 'column-count: 2 !important;'
    		},
    		{
    			title: 'Schuhstudie',
    			dir: 'Schuhstudie',
    			max_image_id: 11,
    			class: 'Klassen 10A & 10B, Nov 2021',
    			materials: 'Bleistift, Fineliner, Kohle, Kreide, Buntstifte, Acryl, Aquarell, Zeichenpapier ca. 35 x 50 cm',
    			description: 'Lernen zu Zeichnen bedeutet vor allem genau hinzusehen, das Auge zu schärfen und zu üben, das Gesehene wiederzugeben. In dieser Studie sollte ein Schuh jeweils linear, mit Fokus auf hell/dunkel, mit naturalistischer Farbgebung und am Ende in einer freien Mischform umgesetzt werden.'
    		},
    		{
    			title: 'Körpergefühl',
    			dir: 'Koerpergefuehl',
    			max_image_id: 22,
    			categories: [
    				{ ending: '.jpg', image_range: [1, 3] },
    				{ ending: '.jpg', image_range: [4, 8] },
    				{ ending: '.jpg', image_range: [9, 12] },
    				{ ending: '.jpg', image_range: [13, 15] },
    				{ ending: '.jpg', image_range: [16, 17] },
    				{ ending: '.jpg', image_range: [18, 22] }
    			],
    			class: 'Klassen 8, Feb 2022',
    			materials: 'Ton',
    			description: 'Ein bestimmtes Gefühl sollte bei diesen Arbeiten über die Körperhaltung der Figuren zum Ausdruck gebracht werden.'
    		},
    		{
    			title: 'Kunstdiktat',
    			dir: 'Kunstdiktat',
    			max_image_id: 9,
    			class: 'Klasse 6 & 9B',
    			materials: 'Bleistifte / Filzstifte, ca. 20 x 30 cm',
    			description: 'Das Kunstdiktat ist eine spielerische Übung zur Bildbetrachtung. Berühmte Werke werden der gegenüber sitzenden Person beschrieben, diese wiederum versucht das Beschriebene zu zeichnen. Beide können die Werke nicht sehen.'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => openInNewTab("https://www.birklehof.de/");

    	$$self.$capture_state = () => ({
    		Home,
    		Subject,
    		Subject_Subcategories,
    		page,
    		openInNewTab,
    		subjects
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, subjects, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
