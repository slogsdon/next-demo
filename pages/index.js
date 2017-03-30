import Link from 'next/link';
import { posts } from '../lib/wordpress';

export default class extends React.Component {
  static async getInitialProps ({ query, res }) {
    return posts().then((posts) => { return { posts }; });
  }

  render () {
    return (
      <ul>
        {this.props.posts && this.props.posts.map((post, key) => {
          return (
              <li key={key}><Link href={ '/blog?slug=' + post.slug } as={ '/blog/' + post.slug + '/' }><a>Blog: { post.title.rendered }</a></Link></li>
          );
        })}
        <li><Link href='/about/bar/'><a>About foo bar</a></Link></li>
        <li><Link href='/about/baz/'><a>About foo baz</a></Link></li>
      </ul>
    );
  }
}
