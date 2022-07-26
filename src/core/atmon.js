/**
 * atmon runtime.
 * 
 */
class Atmon {

    /**
     * Register the component into web browser as the custom defined element.
     * 
     * @param {*} compt 
     */
    static register(compt) {
        if (compt == 'undefined' || compt == null) {
            return;
        }

        // check the component.
        if (!compt.prototype.ename instanceof Function) {
            throw new Error('register component error, invalid component "ename" function.');
        }


        // Every component of atmon should have the 'deps' function
        // in the custom component class to define the dependencies. 
        // The atmon frontend framework will parse the dependencies
        // recursively if they have the sub dependencies.
        if (compt.prototype.deps instanceof Function) {
            let subs = compt.prototype.deps();
            if (subs != 'undefined' && subs instanceof Array) {
                subs.forEach(function (sub) {
                    Atmon.register(sub);
                })
            }
        }
        customElements.define(compt.prototype.ename(), compt);
    }

    /**
     * Build component constructor.
     * 
     * @param {*} compt 
     * @param {*} func 
     * @param {*} mode 
     */
    static construct(compt, func, mode) {
        if (compt == 'undefined' || compt == null) {
            throw new Error('construct component error, invalid component.');
        }
        if (!func instanceof Function) {
            throw new Error('construct component error, invalid function.');
        }

        let comptContent = func();
        if (!typeof (comptContent) == 'string') {
            throw new Error('construct component error, invalid function return type.');
        }

        if (!typeof (mode) == 'string') {
            throw new Error('construct component error, invalid mode type.');
        }
        if (mode != 'open' && mode != 'closed') {
            throw new Error('construct component error, invalid mode value, mode should be "open" or "closed".');
        }

        const wrapper = document.createElement('div');
        wrapper.insertAdjacentHTML('beforeend', comptContent);
        compt.attachShadow({ mode: mode }).appendChild(wrapper);;
    }
}