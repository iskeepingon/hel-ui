<script>
import _ from 'lodash';

export default {
    name: 'OcButton',
    functional: true,
    props: {
        type: {
            type: String,
            default: 'default'
        },
        nativeType: {
            type: String,
            default: 'button'
        },
        plain: {
            type: Boolean,
            default: false
        },
        block: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: '加载中...'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        iconPosition: {
            type: String,
            default: 'left'
        },
        size: {
            type: String,
            default: 'normal'
        }
    },
    render(h, context) {
        const props = context.props;
        return h('div', {
            class: {
                'oc-button': true,
                [`is-${props.type}`]: true,
                [`is-${props.size}`]: true,
                [`is-position-${props.iconPosition}`]: true,
                'is-plain': props.plain,
                'is-block': props.block,
                'is-disabled': props.disabled,
                'is-round': props.round,
                'is-loading': props.loading
            },
            style: context.data.staticStyle,
            attrs: {
                role: 'button',
                ...context.data.attrs
            },
            props: {
                type: props.nativeType
            },
            on: context.listeners
        }, props.loading ? [
            h('OcIcon', {
                props: {
                    name: 'loading'
                }
            }),
            h('div', props.loadingText)
        ] : [
            props.icon ? h('OcIcon', {
                props: {
                    name: props.icon
                }
            }) : '',
            context.scopedSlots.default ? h('div', context.scopedSlots.default()) : ''
        ]);
    }
};
</script>