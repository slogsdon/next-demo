import React from 'react';
import ReactMarkdown from 'react-markdown';
import {post} from '../lib/wordpress';

// const posts = [
//   { slug: 'hello-world', title: 'Hello world' },
//   { slug: 'another-blog-post', title: 'Another blog post' }
// ];

export default class extends React.Component {
  static async getInitialProps ({ query, res }) {
    return post(query.slug).then((post) => { return { post }; });
  }

  render () {
    const { post } = this.props;

    if (!post) return <h1>Not found</h1>;

    return (
      <div>
        <h1>{post.title.rendered}</h1>
        <ReactMarkdown source={post.content.rendered} />
      </div>
    );
  }
}
