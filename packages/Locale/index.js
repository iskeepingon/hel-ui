import Vue from 'vue';
import defaultLang from './lang/zh-CN';

function isDef(value) {
  return value !== undefined && value !== null;
}

function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function assignKey(to, from, key) {
  const val = from[key];

  if (!isDef(val)) {
    return;
  }

  if (!hasOwnProperty.call(to, key) || !isObj(val) || typeof val === 'function') {
    to[key] = val;
  } else {
    // eslint-disable-next-line no-use-before-define
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

function deepAssign(to, from) {
  Object.keys(from).forEach(key => {
    assignKey(to, from, key);
  });

  return to;
}

let defaultMessages = defaultLang;

Vue.prototype.$vantLang = 'zh-CN';
Vue.prototype.$vantMessages = {
  'zh-CN': defaultMessages
};

export default {
  messages() {
    return Vue.prototype.$vantMessages[Vue.prototype.$vantLang];
  },
  add(messages = {}) {
    deepAssign(Vue.prototype.$vantMessages, messages);
  },
  use(lang, messages) {
    Vue.prototype.$vantLang = lang;
    this.add({
      [lang]: messages
    });
  }
};