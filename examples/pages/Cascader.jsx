import React from 'react';

import Markdown from '../components/markdown';
import '../../components/cascader/style';
import '../../components/dropdown/style';
import '../../components/tag-input/style';

export default class Avatar extends Markdown {
  // eslint-disable-next-line
  document() {
    return require('../docs/cascader.md');
  }
}
