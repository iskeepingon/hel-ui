import Locale from './index';

const camelizeRE = /-(\w)/g;

function camelize(str) {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

function isDef(value) {
  return value !== undefined && value !== null;
}

function get(object, path) {
  const keys = path.split('.');
  let result = object;
  keys.forEach(key => {
    if (isDef(result[key])) {
      result = result[key];
    }
  });

  return result;
}

function t (path) {
  const prefix = camelize(path) + '.';
  const message = get(Locale.messages(), prefix);
  return typeof message === 'function' ? message(path) : message;
}

export default {
  methods: {
    t(...args) {
      return t.apply(this, args);
    }
  }
};