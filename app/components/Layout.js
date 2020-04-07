import styled from 'styled-components';
import Navbar from './Navbar';

const Layout = styled.div`
  margin: 20;
  padding: 20;
  border: 1px solid #DDD;
`;

const withLayout = (Page) => () => (
  <Layout>
    <Navbar />
    <Page />
  </Layout>
);

export default withLayout;
