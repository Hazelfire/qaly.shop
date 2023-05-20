import Layout from "./_layout";

const HomePage = () => {
  const charities = ["Charity 1", "Charity 2", "Charity 3", "Charity 4"];

  return (
    <Layout>
      <h1 className="title">Charities</h1>
      <ul className="charity-list">
        {charities.map((charity, index) => (
          <li key={index} className="charity-item">
            {charity}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .title {
          text-align: center;
          margin-top: 20px;
        }

        .charity-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .charity-item {
          margin: 10px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
