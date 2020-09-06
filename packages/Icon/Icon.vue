<script>
import '@/assets/js/iconfont.js';

export default {
    name: 'OcIcon',
    functional: true,
    props: {
        name: {
            type: String,
            default: '',
            valide: true
        }
    },
    render(h, context) {
        const imgReg = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
        let isUrl = false;
        if (imgReg.test(context.props.name)) {
            isUrl = true;
        } else {
            // const IMG = new Image();
            // IMG.onload = () => {
            //     this.isUrl = true;
            // };
            // IMG.onerror = () => {
            //     this.isUrl = false;
            // };
            // IMG.src = this.name;
            isUrl = false;
        }

        const staticClass = context.data.staticClass;
        context.data.staticClass = staticClass ? `oc-icon ${staticClass}` : 'oc-icon';
        
        if (isUrl) {
            return h('div', context.data, [
                h('img', {
                    attrs: {
                        'src': context.props.name
                    }
                })
            ]);
        } else {
            return h('div', context.data, [
                h('svg', {
                    attrs:  {
                        'aria-hidden': true
                    }
                }, [
                    h('use', {
                        attrs: {
                            'xlink:href': `#icon-${context.props.name}`
                        }
                    })
                ])
            ]);
        }
    }
};
</script>
