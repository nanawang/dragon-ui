import Notification from '../notification';

const defaultOptions = {
  prefixCls: 'za-message',
  isMessage: true,
};

function proxy(theme: string) {
  return (config?: object) => {
    Notification[theme]({ ...config, ...defaultOptions });
  };
}

export default {
  primary: proxy('primary'),
  success: proxy('success'),
  warning: proxy('warning'),
  danger: proxy('danger'),
  loading: proxy('loading'),
  config(options) {
    Notification({ ...defaultOptions, ...options });
  },
};
