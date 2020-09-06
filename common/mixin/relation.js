export function ChildrenMixin(parent, options = {}) {
    return Vue.extend({

    });
}

export function ParentMixin(parent) {
    return {
        provide() {
            return {
                [parent]: this
            }
        },
        data() {
            return {
                children: []
            };
        }
    };
}
