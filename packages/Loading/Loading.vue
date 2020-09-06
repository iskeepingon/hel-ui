<script>
import Locale from '../Locale/locale.js';

import LoadingCircle from './LoadingCircle.vue';
import Spinner from './Spinner';
import GoogleCircle from './GoogleCircle';
import LoadingIcon from './LoadingIcon';

const preClass = 'oc-loading';

export default {
    name: 'OcLoading',
    functional: true,
    props: {
        name: {
            type: String,
            default: 'circle'
        },
        color: String,
        vertical: {
            type: Boolean,
            default: false
        },
        isWhite: {
            type: Boolean,
            default: false
        },
        loadingText: String,
        hasText: {
            type: Boolean,
            default: true
        }
    },
    render(h, context) {
        const props = context.props;
        function iconComponent () {
            if (props.name === 'circle') {
                return LoadingCircle;
            } else if (props.name === 'spinner') {
                return Spinner;
            } else if (props.name === 'googleCircle') {
                return GoogleCircle;
            } else {
                return LoadingIcon;
            }
        }
        
        const classArr = ['oc-loading', `${preClass}-${props.name}`];
        if (props.isWhite) {
            classArr.push(`${preClass}-white`);
        }
        if (typeof props.vertical === 'boolean' && !props.vertical) {
            classArr.push(`${preClass}-vertical`);
        }
        const staticClass = context.data.staticClass;
        if (staticClass) {
            classArr.push(staticClass);
        }
        context.data.staticClass = classArr.join(' ');
        return h('div', {
            class: context.data.staticClass,
            style: context.data.staticStyle,
            attrs: {
                ...context.data.attrs
            }
        }, [
            h(iconComponent(), {
                props: {
                    color: props.color,
                    name: props.name
                }
            }),
            props.hasText ? h('div', {
                class: {
                    'oc-loading-text': true
                }
            }, context.scopedSlots.default ? context.scopedSlots.default() : props.loadingText || Locale.methods.t('loading')) : '',
        ]);
    }
};
</script>
