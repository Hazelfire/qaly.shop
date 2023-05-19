import Link from "next/link";
import Layout from "./Layout";

const NotFoundPage = () => (
  <Layout>
    <div className="container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <a>Go Back Home</a>
      </Link>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }

        h1 {
          font-size: 3em;
          color: #333;
        }

        h2 {
          color: #666;
        }

        p {
          color: #999;
        }

        a {
          color: #0070f3;
          margin-top: 1em;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  </Layout>
);

export default NotFoundPage;
