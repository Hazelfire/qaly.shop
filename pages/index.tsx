import styled from "styled-components";
import Layout from "./Layout";

const Title = styled.h1`
  text-align: center;
  margin-top: 20px;
`;

const CharityList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CharityItem = styled.li`
  margin: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const HomePage = () => {
  const charities = ["Charity 1", "Charity 2", "Charity 3", "Charity 4"];

  return (
    <Layout>
      <Title>Charities</Title>
      <CharityList>
        {charities.map((charity, index) => (
          <CharityItem key={index}>{charity}</CharityItem>
        ))}
      </CharityList>
    </Layout>
  );
};

export default HomePage;
