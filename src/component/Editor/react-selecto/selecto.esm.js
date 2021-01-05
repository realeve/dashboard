/* eslint-disable */
/*
Copyright (c) 2020 Daybrush
name: selecto
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/selecto.git
version: 1.5.2
*/
import Component from '@egjs/component';
import Dragger from '@daybrush/drag';
import { Properties } from 'framework-utils';
import { hasClass, addClass, removeEvent, addEvent, isObject, camelize } from '@daybrush/utils';
import ChildrenDiffer, { diff } from '@egjs/children-differ';
import DragScroll from '@scena/dragscroll';
import KeyController, { getCombi } from 'keycon';
import styled from 'css-styled';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({
      __proto__: [],
    } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}
var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }

      return t;
    };

  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  const t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === 'function')
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  const c = arguments.length;
  let r =
    c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc;
  let d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (let i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (let a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

function getClient(e) {
  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
  }
  return {
    clientX: e.clientX,
    clientY: e.clientY,
  };
}
function createElement(jsx, prevTarget, container) {
  const { tag } = jsx;
  const { children } = jsx;
  const { attributes } = jsx;
  const { className } = jsx;
  const { style } = jsx;
  const el = prevTarget || document.createElement(tag);

  for (var name in attributes) {
    el.setAttribute(name, attributes[name]);
  }

  const elChildren = el.children;
  children.forEach(function (child, i) {
    createElement(child, elChildren[i], el);
  });

  if (className) {
    className.split(' ').forEach(function (name) {
      if (!hasClass(el, name)) {
        addClass(el, name);
      }
    });
  }

  if (style) {
    const elStyle = el.style;

    for (var name in style) {
      elStyle[name] = style[name];
    }
  }

  if (!prevTarget && container) {
    container.appendChild(el);
  }

  return el;
}
function h(tag, attrs) {
  const children = [];

  for (let _i = 2; _i < arguments.length; _i++) {
    children[_i - 2] = arguments[_i];
  }

  const _a = attrs || {};
  const _b = _a.className;
  const className = _b === void 0 ? '' : _b;
  const _c = _a.style;
  const style = _c === void 0 ? {} : _c;
  const attributes = __rest(_a, ['className', 'style']);

  return {
    tag,
    className,
    style,
    attributes,
    children,
  };
}
function diffValue(prev, cur, func) {
  if (prev !== cur) {
    func(prev, cur);
  }
}
function getRect(e) {
  const _a = e.distX;
  const distX = _a === void 0 ? 0 : _a;
  const _b = e.distY;
  const distY = _b === void 0 ? 0 : _b;
  const { datas } = e;
  const { startX } = datas;
  const { startY } = datas;
  const tx = Math.min(0, distX);
  const ty = Math.min(0, distY);
  const width = Math.abs(distX);
  const height = Math.abs(distY);
  const left = startX + tx;
  const top = startY + ty;
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  };
}

const injector = styled(
  '\n:host {\n    position: fixed;\n    display: none;\n    border: 1px solid #4af;\n    background: rgba(68, 170, 255, 0.5);\n    z-index: 100;\n}\n',
);
/**
 * @memberof Selecto
 */

const CLASS_NAME = `selecto-selection ${injector.className}`;
const PROPERTIES = [
  'selectableTargets',
  'selectByClick',
  'selectFromInside',
  'continueSelect',
  'rectOffset',
  'toggleContinueSelect',
  'keyContainer',
  'hitRate',
  'scrollOptions',
  'checkInput',
  'preventDefault',
];
/**
 * @memberof Selecto
 */

const OPTIONS = __spreadArrays(
  [
    // ignore target, container,
    'dragContainer',
    'cspNonce',
  ],
  PROPERTIES,
);
const OPTION_TYPES = {
  target: null,
  container: null,
  dragContainer: null,
  selectableTargets: Array,
  selectByClick: Boolean,
  selectFromInside: Boolean,
  continueSelect: Boolean,
  toggleContinueSelect: Array,
  keyContainer: null,
  hitRate: Number,
  scrollOptions: Object,
  checkInput: Boolean,
  preventDefault: Boolean,
  cspNonce: String,
};
/**
 * @memberof Selecto
 */

const EVENTS = [
  'dragStart',
  'drag',
  'dragEnd',
  'selectStart',
  'select',
  'selectEnd',
  'keydown',
  'keyup',
  'scroll',
];
/**
 * @memberof Selecto
 */

const METHODS = ['clickTarget', 'setSelectedTargets', 'triggerDragStart'];

/**
 * Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.
 
 * @extends eg.Component
 */

const Selecto =
  /* #__PURE__ */
  (function (_super) {
    __extends(Selecto, _super);
    /**
     *
     */

    function Selecto(options) {
      if (options === void 0) {
        options = {};
      }

      const _this = _super.call(this) || this;

      _this.selectedTargets = [];
      _this.differ = new ChildrenDiffer();
      _this.dragScroll = new DragScroll();

      _this.onDragStart = function (e, clickedTarget) {
        const { datas } = e;
        const { clientX } = e;
        const { clientY } = e;
        const { inputEvent } = e;
        const _a = _this.options;
        const { continueSelect } = _a;
        const { selectFromInside } = _a;
        const { selectByClick } = _a;

        const selectableTargets = _this.getSelectableTargets();

        const selectableRects = selectableTargets.map(function (target) {
          const rect = target.getBoundingClientRect();
          const { left } = rect;
          const { top } = rect;
          const { width } = rect;
          const { height } = rect;
          return {
            left,
            top,
            right: left + width,
            bottom: top + height,
            width,
            height,
          };
        });
        datas.selectableTargets = selectableTargets;
        datas.selectableRects = selectableRects;
        datas.startSelectedTargets = _this.selectedTargets;
        let pointTarget = clickedTarget || document.elementFromPoint(clientX, clientY);
        const hitRect = {
          left: clientX,
          top: clientY,
          right: clientX,
          bottom: clientY,
          width: 0,
          height: 0,
        };

        while (pointTarget) {
          if (selectableTargets.indexOf(pointTarget) > -1) {
            break;
          }

          pointTarget = pointTarget.parentElement;
        }

        let firstPassedTargets = pointTarget ? [pointTarget] : [];
        const hasInsideTargets = firstPassedTargets.length > 0;
        const isPreventSelect = !selectFromInside && hasInsideTargets;

        if (isPreventSelect && !selectByClick) {
          return false;
        }

        const { type } = inputEvent;
        const isTrusted = type === 'mousedown' || type === 'touchstart';
        /**
         * When the drag starts, the dragStart event is called.
         * Call the stop () function if you have a specific element or don't want to raise a select
         * @memberof Selecto
         * @event dragStart
         * @param {OnDragStart} - Parameters for the dragStart event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("dragStart", e => {
         *   if (e.inputEvent.target.tagName === "SPAN") {
         *     e.stop();
         *   }
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */

        const result = isTrusted ? _this.trigger('dragStart', e) : true;

        if (!result) {
          return false;
        }

        if (!continueSelect) {
          _this.selectedTargets = [];
        } else {
          firstPassedTargets = _this.getSelectedTargets(firstPassedTargets);
        }

        _this.select(firstPassedTargets, hitRect, inputEvent, true);

        datas.startX = clientX;
        datas.startY = clientY;
        datas.selectedTargets = firstPassedTargets;

        const { x } = _this.rectOffset;
        const { y } = _this.rectOffset;

        _this.target.style.cssText += `left:0px;top:0px;transform: translate(${clientX - x}px, ${
          clientY - y
        }px)`;

        if (isPreventSelect && selectByClick) {
          _this.onDragEnd(e);

          inputEvent.preventDefault();
          return false;
        }
        if (type === 'touchstart') {
          inputEvent.preventDefault();
        }

        const { scrollOptions } = _this.options;

        if (scrollOptions && scrollOptions.container) {
          _this.dragScroll.dragStart(e, scrollOptions);
        }

        return true;
      };

      _this.onDrag = function (e) {
        const { scrollOptions } = _this.options;

        if (scrollOptions && scrollOptions.container) {
          if (_this.dragScroll.drag(e, scrollOptions)) {
            return;
          }
        }

        _this.check(e);
      };

      _this.onDragEnd = function (e) {
        const { datas } = e;
        const rect = getRect(e);

        _this.dragScroll.dragEnd();

        _this.target.style.cssText += 'display: none;';

        _this.trigger('dragEnd', { ...e, rect });

        _this.selectEnd(datas.startSelectedTargets, datas.selectedTargets, rect, e);

        _this.selectedTargets = datas.selectedTargets;
      };

      _this.onKeyDown = function (e) {
        if (!_this.sameCombiKey(e)) {
          return;
        }

        _this.continueSelect = true;
        /**
         * When you keydown the key you specified in toggleContinueSelect, the keydown event is called.
         * @memberof Selecto
         * @event keydown
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   toggleContinueSelect: "shift";
         *   keyContainer: window,
         * });
         *
         * selecto.on("keydown", () => {
         *   document.querySelector(".button").classList.add("selected");
         * }).on("keyup", () => {
         *   document.querySelector(".button").classList.remove("selected");
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */

        _this.trigger('keydown', {});
      };

      _this.onKeyUp = function (e) {
        if (!_this.sameCombiKey(e)) {
          return;
        }

        _this.continueSelect = false;
        /**
         * When you keyup the key you specified in toggleContinueSelect, the keyup event is called.
         * @memberof Selecto
         * @event keyup
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   toggleContinueSelect: "shift";
         *   keyContainer: window,
         * });
         *
         * selecto.on("keydown", () => {
         *   document.querySelector(".button").classList.add("selected");
         * }).on("keyup", () => {
         *   document.querySelector(".button").classList.remove("selected");
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */

        _this.trigger('keyup', {});
      };

      _this.onBlur = function () {
        if (_this.toggleContinueSelect && _this.continueSelect) {
          _this.trigger('keyup', {});
        }
      };

      _this.onDocumentSelectStart = function (e) {
        if (!_this.dragger.isFlag()) {
          return;
        }

        let { dragContainer } = _this;

        if (dragContainer === window) {
          dragContainer = document.documentElement;
        }

        const containers =
          dragContainer instanceof Element ? [dragContainer] : [].slice.call(dragContainer);
        const { target } = e;
        containers.some(function (container) {
          if (container === target || container.contains(target)) {
            e.preventDefault();
            return true;
          }
        });
      };

      _this.target = options.target;
      _this.container = options.container;
      _this.options = {
        target: null,
        container: null,
        dragContainer: null,
        selectableTargets: [],
        selectByClick: true,
        selectFromInside: true,
        hitRate: 100,
        continueSelect: false,
        toggleContinueSelect: null,
        keyContainer: null,
        scrollOptions: undefined,
        checkInput: false,
        preventDefault: false,
        cspNonce: '',
        ...options,
      };

      _this.initElement();

      _this.initDragScroll();

      _this.setKeyController();

      return _this;
    }
    /**
     * You can set the currently selected targets.
     */

    const __proto = Selecto.prototype;

    __proto.setSelectedTargets = function (selectedTargets) {
      this.selectedTargets = selectedTargets;
      this.differ = new ChildrenDiffer(selectedTargets);
      return this;
    };

    __proto.setKeyContainer = function (keyContainer) {
      const _this = this;

      const { options } = this;
      diffValue(options.keyContainer, keyContainer, function () {
        options.keyContainer = keyContainer;

        _this.setKeyController();
      });
    };

    __proto.setToggleContinueSelect = function (toggleContinueSelect) {
      const _this = this;

      const { options } = this;
      diffValue(options.toggleContinueSelect, toggleContinueSelect, function () {
        options.toggleContinueSelect = toggleContinueSelect;

        _this.setKeyEvent();
      });
    };

    __proto.setPreventDefault = function (value) {
      this.dragger.options.preventDefault = value;
    };

    __proto.setCheckInput = function (value) {
      this.dragger.options.checkInput = value;
    };
    /**
     * `OnDragStart` is triggered by an external event.
     * @param - external event
     * @example
     * import Selecto from "selecto";
     *
     * const selecto = new Selecto();
     *
     * window.addEventListener("mousedown", e => {
     *   selecto.triggerDragStart(e);
     * });
     */

    __proto.triggerDragStart = function (e) {
      this.dragger.triggerDragStart(e);
      return this;
    };
    /**
     * Destroy elements, properties, and events.
     */

    __proto.destroy = function () {
      this.off();
      this.keycon && this.keycon.destroy();
      this.dragger.unset();
      this.injectResult.destroy();
      removeEvent(document, 'selectstart', this.onDocumentSelectStart);
      this.keycon = null;
      this.dragger = null;
      this.injectResult = null;
      this.target = null;
      this.container = null;
      this.options = null;
    };
    /**
     * External click or mouse events can be applied to the selecto.
     * @params - Extenal click or mouse event
     * @params - Specify the clicked target directly.
     */

    __proto.clickTarget = function (e, clickedTarget) {
      const _a = getClient(e);
      const { clientX } = _a;
      const { clientY } = _a;

      const dragEvent = {
        datas: {},
        clientX,
        clientY,
        inputEvent: e,
      };

      if (this.onDragStart(dragEvent, clickedTarget)) {
        this.onDragEnd(dragEvent);
      }

      return this;
    };

    __proto.setKeyController = function () {
      const _a = this.options;
      const { keyContainer } = _a;
      const { toggleContinueSelect } = _a;

      if (this.keycon) {
        this.keycon.destroy();
        this.keycon = null;
      }

      if (toggleContinueSelect) {
        this.keycon = new KeyController(keyContainer || window);
        this.keycon.keydown(this.onKeyDown).keyup(this.onKeyUp).on('blur', this.onBlur);
      }
    };

    __proto.setKeyEvent = function () {
      const { toggleContinueSelect } = this.options;

      if (!toggleContinueSelect || this.keycon) {
        return;
      }

      this.setKeyController();
    };

    __proto.initElement = function () {
      this.target = createElement(
        h('div', {
          className: CLASS_NAME,
        }),
        this.target,
        this.container,
      );
      const { target } = this;
      const _a = this.options;
      const { dragContainer } = _a;
      const { checkInput } = _a;
      const { preventDefault } = _a;
      this.dragContainer =
        typeof dragContainer === 'string'
          ? [].slice.call(document.querySelectorAll(dragContainer))
          : this.options.dragContainer || this.target.parentNode;
      this.dragger = new Dragger(this.dragContainer, {
        container: window,
        checkInput,
        preventDefault,
        dragstart: this.onDragStart,
        drag: this.onDrag,
        dragend: this.onDragEnd,
      });
      addEvent(document, 'selectstart', this.onDocumentSelectStart);
      this.injectResult = injector.inject(target, {
        nonce: this.options.cspNonce,
      });
    };

    __proto.hitTest = function (selectRect, clientX, clientY, targets, rects) {
      const _a = this.options;
      const { hitRate } = _a;
      const { selectByClick } = _a;
      const { left } = selectRect;
      const { top } = selectRect;
      const { right } = selectRect;
      const { bottom } = selectRect;
      const passedTargets = [];
      rects.forEach(function (rect, i) {
        const rectLeft = rect.left;
        const rectTop = rect.top;
        const rectRight = rect.right;
        const rectBottom = rect.bottom;
        const isStart =
          rectLeft <= clientX &&
          clientX <= rectRight &&
          rectTop <= clientY &&
          clientY <= rectBottom;
        const rectSize = (rectRight - rectLeft) * (rectBottom - rectTop);
        const testLeft = Math.max(rectLeft, left);
        const testRight = Math.min(rectRight, right);
        const testTop = Math.max(rectTop, top);
        const testBottom = Math.min(rectBottom, bottom);

        if (selectByClick && isStart) {
          passedTargets.push(targets[i]);
          return;
        }

        if (testRight < testLeft || testBottom < testTop) {
          return;
        }

        const rate = Math.round(
          (((testRight - testLeft) * (testBottom - testTop)) / rectSize) * 100,
        );

        if (rate >= hitRate) {
          passedTargets.push(targets[i]);
        }
      });
      return passedTargets;
    };

    __proto.initDragScroll = function () {
      const _this = this;

      this.dragScroll
        .on('scroll', function (_a) {
          const { container } = _a;
          const { direction } = _a;

          _this.trigger('scroll', {
            container,
            direction,
          });
        })
        .on('move', function (_a) {
          const { offsetX } = _a;
          const { offsetY } = _a;
          const { inputEvent } = _a;
          const { datas } = inputEvent;
          datas.startX -= offsetX;
          datas.startY -= offsetY;
          datas.selectableRects.forEach(function (rect) {
            rect.top -= offsetY;
            rect.bottom -= offsetY;
            rect.left -= offsetX;
            rect.right -= offsetX;
          });

          _this.dragger.scrollBy(offsetX, offsetY, inputEvent.inputEvent, false);

          inputEvent.distX += offsetX;
          inputEvent.distY += offsetY;

          _this.check(inputEvent);
        });
    };

    __proto.getSelectableTargets = function () {
      const selectableTargets = [];
      this.options.selectableTargets.forEach(function (target) {
        if (isObject(target)) {
          selectableTargets.push(target);
        } else {
          const elements = [].slice.call(document.querySelectorAll(target));
          elements.forEach(function (el) {
            selectableTargets.push(el);
          });
        }
      });
      return selectableTargets;
    };

    __proto.getSelectedTargets = function (passedTargets) {
      const _a = diff(this.selectedTargets, passedTargets);
      const { list } = _a;
      const { prevList } = _a;
      const { added } = _a;
      const { removed } = _a;

      return added
        .map(function (index) {
          return list[index];
        })
        .concat(
          removed.map(function (index) {
            return prevList[index];
          }),
        );
    };

    __proto.select = function (selectedTargets, rect, inputEvent, isStart) {
      const _a = this.differ.update(selectedTargets);
      const { added } = _a;
      const { removed } = _a;
      const { prevList } = _a;
      const { list } = _a;

      if (isStart) {
        /**
         * When the select(drag) starts, the selectStart event is called.
         * @memberof Selecto
         * @event selectStart
         * @param {Selecto.OnSelect} - Parameters for the selectStart event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("selectStart", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * }).on("selectEnd", e => {
         *   e.afterAdded.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.afterRemoved.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        this.trigger('selectStart', {
          selected: selectedTargets,
          added: added.map(function (index) {
            return list[index];
          }),
          removed: removed.map(function (index) {
            return prevList[index];
          }),
          rect,
          inputEvent,
        });
      }

      if (added.length || removed.length) {
        /**
         * When the select in real time, the select event is called.
         * @memberof Selecto
         * @event select
         * @param {Selecto.OnSelect} - Parameters for the select event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        this.trigger('select', {
          selected: selectedTargets,
          added: added.map(function (index) {
            return list[index];
          }),
          removed: removed.map(function (index) {
            return prevList[index];
          }),
          rect,
          inputEvent,
        });
      }
    };

    __proto.selectEnd = function (startSelectedTargets, selectedTargets, rect, e) {
      const { inputEvent } = e;
      const { isDouble } = e;

      const _a = diff(startSelectedTargets, selectedTargets);
      const { added } = _a;
      const { removed } = _a;
      const { prevList } = _a;
      const { list } = _a;

      const _b = diff(this.selectedTargets, selectedTargets);
      const afterAdded = _b.added;
      const afterRemoved = _b.removed;
      const afterPrevList = _b.prevList;
      const afterList = _b.list;

      const { type } = inputEvent;
      const isDragStart = type === 'mousedown' || type === 'touchstart';
      /**
       * When the select(dragEnd or click) ends, the selectEnd event is called.
       * @memberof Selecto
       * @event selectEnd
       * @param {Selecto.OnSelectEnd} - Parameters for the selectEnd event
       * @example
       * import Selecto from "selecto";
       *
       * const selecto = new Selecto({
       *   container: document.body,
       *   selectByClick: true,
       *   selectFromInside: false,
       * });
       *
       * selecto.on("selectStart", e => {
       *   e.added.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.removed.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * }).on("selectEnd", e => {
       *   e.afterAdded.forEach(el => {
       *     el.classList.add("selected");
       *   });
       *   e.afterRemoved.forEach(el => {
       *     el.classList.remove("selected");
       *   });
       * });
       */

      this.trigger('selectEnd', {
        selected: selectedTargets,
        added: added.map(function (index) {
          return list[index];
        }),
        removed: removed.map(function (index) {
          return prevList[index];
        }),
        afterAdded: afterAdded.map(function (index) {
          return afterList[index];
        }),
        afterRemoved: afterRemoved.map(function (index) {
          return afterPrevList[index];
        }),
        isDragStart,
        isDouble: !!isDouble,
        rect,
        inputEvent,
      });
    };

    __proto.check = function (e) {
      const { datas } = e;
      const { inputEvent } = e;

      // bug fix 修复父组件位置不为0，0时，rect偏移
      const { x } = this.rectOffset;
      const { y } = this.rectOffset;

      const rect = getRect(e);
      const top = rect.top - y;
      const left = rect.left - x;
      const { width } = rect;
      const { height } = rect;

      this.target.style.cssText +=
        `${'display: block;' + 'left:0px;top:0px;'}` +
        `transform: translate(${left}px, ${top}px);` +
        `width:${width}px;height:${height}px;`;
      const passedTargets = this.hitTest(
        rect,
        datas.startX,
        datas.startY,
        datas.selectableTargets,
        datas.selectableRects,
      );
      const selectedTargets = this.getSelectedTargets(passedTargets);
      this.trigger('drag', { ...e, rect });
      this.select(selectedTargets, rect, inputEvent);
      datas.selectedTargets = selectedTargets;
    };

    __proto.sameCombiKey = function (e) {
      const toggleContinueSelect = [].concat(this.options.toggleContinueSelect);
      const combi = getCombi(e.inputEvent, e.key);
      return toggleContinueSelect.every(function (key) {
        return combi.indexOf(key) > -1;
      });
    };

    Selecto = __decorate(
      [
        Properties(PROPERTIES, function (prototype, property) {
          const attributes = {
            enumerable: true,
            configurable: true,
            get() {
              return this.options[property];
            },
          };
          const setter = camelize(`set ${property}`);

          if (prototype[setter]) {
            attributes.set = function (value) {
              this[setter](value);
            };
          } else {
            attributes.set = function (value) {
              this.options[property] = value;
            };
          }

          Object.defineProperty(prototype, property, attributes);
        }),
      ],
      Selecto,
    );
    return Selecto;
  })(Component);

export default Selecto;
export { CLASS_NAME, EVENTS, METHODS, OPTIONS, OPTION_TYPES, PROPERTIES };
// # sourceMappingURL=selecto.esm.js.map
