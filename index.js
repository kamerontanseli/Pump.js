(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['b'], function (b) {
            return (root.pump = factory(b));
        });
    } else {
        // Browser globals
        root.pump = factory(root.b);
    }
}(typeof self !== 'undefined' ? self : this, function (b) {

  class Controller {
    constructor (name, el) {
      this.name = name;
      this.el = el;
      this.__events = {};
      this.data = {
        has: name => this.el.hasAttribute('data-'+name),
        get: name => this.el.getAttribute('data-'+name),
        set: (name, value) => this.el.setAttribute('data-'+name, value)
      };
    }
    connect () {
      this.__setTargets();
      this.__setActions();
      this.data.set('initialised', 'true');
    }
    disconnect () {
      this.__removeActions();
    }
    targets () {
      return [];
    }
    __setTargets () {
      for (const target of this.targets()) {
        this[`${target}Target`] = this.el.querySelector(
          `[data-target="${this.name}.${target}"]`
        );
        this[`${target}Targets`] = this.el.querySelectorAll(
          `[data-target="${this.name}.${target}"]`
        );
      }
    }
    __setActions () {
      const actions = this.el.querySelectorAll(`[data-action*="->${this.name}"]`);
      for (const element of actions) {
        const [event, _, method] = element.getAttribute('data-action').split(/\-\>|#/g);
        this.__events[event] = { element, method: this[method].bind(this) };
        element.addEventListener(event, this.__events[event].method);
      }
    }
    __removeActions() {
      for (const key of Object.keys(this.__events)) {
        this.__events[key].element.removeEventListener(key, this.__events[event].method);
      }
    }
  }

    class Application {
      constructor (mount) {
        this.mount = document.querySelector(mount);
        this.controllers = {};
      }
      register (name, controller) {
        this.controllers[name] = controller;
      }
      attachControllers () {
        const controllers = Object.keys(this.controllers);

        for (const ctrl of controllers) {
          const targets = this.mount.querySelectorAll(`[data-controller="${ctrl}"]:not([data-initialised="true"])`);
          for (const target of targets) {
            const controller = new this.controllers[ctrl](ctrl, target);
            controller.connect();
          }
        }
      }
      start () {
        this.attachControllers();
        setInterval(this.attachControllers.bind(this), 1000);
      }
    }

    return { Controller, Application };
}));