import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import Demo from './Demo';
import './style.scss';

const withOutConvertPage = ['ChangeLog', 'QuickStart'];

export default class Markdown extends React.Component {
  constructor(props) {
    super(props);
    this.components = new Map();
    this.nodeList = [];
  }

  componentDidMount() {
    this.renderDOM();
  }

  componentWillUnmount() {
    this.nodeList.forEach((element) => {
      ReactDOM.unmountComponentAtNode(element);
      element.parentNode.removeChild(element);
    });
    this.nodeList = [];
  }


  renderDOM() {
    const divNode = document.createElement('div');
    const h2Node = document.getElementById('api-node');
    divNode.setAttribute('class', 'markdown-demo-wrapper');
    // eslint-disable-next-line
    for (const [id, component] of this.components) {
      const div = document.getElementById(id);
      divNode.append(div);
      this.nodeList.push(div);
      if (div instanceof HTMLElement) {
        ReactDOM.render(component, div);
      }
    }
    this.markdownCon.insertBefore(divNode, h2Node);
  }

  render() {
    const { document, name } = this.props;
    const renderer = new marked.Renderer();

    if (typeof document === 'string') {
      if (!withOutConvertPage.includes(name)) {
        this.components.clear();

        renderer.table = (header, body) => {
          return `<table class="grid" id="grid"><thead>${header}</thead><tbody>${body}</tbody></table>`;
        };

        let html = marked(
          document
          // .replace(/## API\s?([^]+)/g, '')
          //   .replace(/##\s*API\s?([^]+)/g, '$1')
          // .replace(/(```\s?jsx([^]+?)```)/g, (match, p1) => {
            .replace(/##\s?([^]+?)((?=##))/g, (match, p1) => {
              const id = parseInt(Math.random() * 1e9, 10).toString(36);
              // console.log(p1)
              this.components.set(id, React.createElement(Demo, { ...this.props }, p1));
              return `<div id=${id} class="markdown-demo-item"></div>`;
            }),
          {
            renderer,
          },
        );

        html = html.replace('##', '').replace('API', '<h2 id="api-node" style="margin-top: 50px">API</h2>');
        // eslint-disable-next-line react/no-danger
        return <div dangerouslySetInnerHTML={{ __html: html }} className="markdown" ref={(el) => { this.markdownCon = el; }} />;
      }

      const html = marked(document, { renderer });

      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: html }} className="markdown" ref={(el) => { this.markdownCon = el; }} />;
    }

    return <span />;
  }
}
