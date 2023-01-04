/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */

// Ref: https://cookpete.com/react-player/
const DEFAULT_PATTERN = [
  '.mp4',
  '.webm',
  '.ogv',
  '.mp3',
  '.m3u8',
  '.mpd',
  '.mov',
  'soundcloud.com',
  'youtube.com',
  'facebook.com',
  'vimeo.com',
  'twitter.tv',
  'streamable.com',
  'wistia.com',
  'dailymotion.com',
  'mixcloud.com',
  'vidyard.com',
  'kaltura.com',
];

function checkPatterns(patterns, url) {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return url.includes(pattern);
    }
    // Check if patterns is a regex
    if (Object.prototype.toString.call(pattern) === '[object RegExp]') {
      return pattern.test(url);
    }
    return false;
  });
}

function isURL(url) {
  const urlRegex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g,
  );

  return urlRegex.test(url);
}

function plugin(options) {
  let patterns = [...DEFAULT_PATTERN];

  if (options) {
    const { patterns: customPatterns = [] } = options;
    if (Array.isArray(customPatterns) === false) {
      throw new Error(
        'remark-plugin-transform-video: Patterns should be an array',
      );
    }

    patterns = [...DEFAULT_PATTERN, ...customPatterns];
  }

  // NOTE: Create function inside the plugin to access options
  async function transformer(tree) {
    const { visit } = await import('unist-util-visit');

    const test = (node) => {
      const checkType = ['link', 'text'];

      if (!checkType.includes(node.type)) {
        return false;
      }

      const checkValue = node.value ? node.value : node.url;

      return isURL(checkValue) && checkPatterns(patterns, checkValue);
    };

    visit(tree, test, (node, index, parent) => {
      const url = node.value ? node.value : node.url;
      // NOTE: Set data-type-iframe to 'video' to be able to differentiate between
      // video and normal iframe
      const newValue = `<iframe data-type-iframe="video" width="100%" height="100%" style="aspect-ratio: 16/9;" src="${url}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`; // iframe copied from youtube share button

      // We swap parent (usually "paragraph" node) with the new value if there
      // is only one child as there is no others "text" node in the
      // "paragraph" node
      if (parent.children.length === 1) {
        parent.type = 'html';
        parent.value = newValue;
        parent.children = [];
        return;
      }

      // We only swap the 'link' node with the new value if node is not the
      // only child
      node.type = 'html';
      node.value = newValue;
      node.children = [];
      delete node.url;
      delete node.title;
    });
  }
  return transformer;
}

module.exports = plugin;