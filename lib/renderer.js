'use strict';

module.exports = function(data, options) {
  const MdIt = require('markdown-it');
  let { markdown } = this.config;

  // Temporary backward compatibility
  if (typeof markdown === 'string') {
    markdown = {
      preset: markdown
    };
    this.log.warn(`Deprecated config detected. Please use\n\nmarkdown:\n  preset: ${markdown.preset}\n\nSee https://github.com/hexojs/hexo-renderer-markdown-it#options`);
  }

  const { preset, render, enable_rules, disable_rules, plugins, anchors } = markdown;
  let parser = new MdIt(preset, render);

  if (enable_rules) {
    parser.enable(enable_rules);
  }

  if (disable_rules) {
    parser.disable(disable_rules);
  }

  if (plugins) {
    parser = plugins.reduce((parser, pugs) => {
      if (pugs instanceof Object && pugs.name) {
        return parser.use(require(pugs.name), pugs.options);
      }
      return parser.use(require(pugs));

    }, parser);
  }

  if (anchors) {
    parser = parser.use(require('./anchors'), anchors);
  }

  parser.use(require('markdown-it-task-checkbox'))
  parser.use(require('markdown-it-container'), 'success', {
    render: function(tokens, idx){
      if (tokens[idx].nesting === 1) {
        return '<article class="message is-success"><div class="message-body">\n';
      } else {
        return '</div></article>\n';
      }
    }
  })
  parser.use(require('markdown-it-container'), 'info', {
    render: function(tokens, idx){
      if (tokens[idx].nesting === 1) {
        return '<article class="message is-success"><div class="message-body">\n';
      } else {
        return '</div></article>\n';
      }
    }
  })
  parser.use(require('markdown-it-container'), 'warning', {
    render: function(tokens, idx){
      if (tokens[idx].nesting === 1) {
        return '<article class="message is-success"><div class="message-body">\n';
      } else {
        return '</div></article>\n';
      }
    }
  })
  parser.use(require('markdown-it-container'), 'danger', {
    render: function(tokens, idx){
      if (tokens[idx].nesting === 1) {
        return '<article class="message is-success"><div class="message-body">\n';
      } else {
        return '</div></article>\n';
      }
    }
  })
  parser.use(require('markdown-it-toc-and-anchor').default, {
  })
  var kt = require('katex')
  require('katex/dist/contrib/mhchem')
  parser.use(require('markdown-it-texmath').use(kt), { delimiters: 'dollars' })

  this.execFilterSync('markdown-it:renderer', parser, { context: this });

  return parser.render(data.text);
};
