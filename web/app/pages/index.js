import Link from 'next/link';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const placeholderEvents = [
  {
    id: 1,
    title: 'Tournament May 10th',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum`,
    imageURL: 'https://place-hold.it/150x150',
  },
  {
    id: 2,
    title: 'Tournament May 11th',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum`,
    imageURL: 'https://place-hold.it/150x150',
  },
  {
    id: 3,
    title: 'Tournament May 12th',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum`,
    imageURL: 'https://place-hold.it/150x150',
  },
];


const Index = () => (
  <>
    <Navbar height='8vh'/>
    <ContentWrapper height='87vh'>
      <Hero>
        <HeroHeader>eBridge</HeroHeader>
        <HeroSubHeader>Free Online Bridge</HeroSubHeader>
        <Link href='/dashboard'>
          <ActionButton>Play Bridge Now</ActionButton>
        </Link>
      </Hero>
      <SubContentWrapper>
        <NewsWrapper>
          <h1>News & Updates</h1>
          <EventsList>
            {placeholderEvents.map(event => (
              <EventItem key={event.id}>
                <EventImage imageURL={event.imageURL}/>
              </EventItem>
            ))}
          </EventsList>
        </NewsWrapper>
        <NewsWrapper>
          <h1>Upcoming Events</h1>
        </NewsWrapper>
      </SubContentWrapper>
    </ContentWrapper>
    <Footer height='5vh'/>
  </>
);

const ContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  height: ${props => props.height};
`;

const Hero = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-image: url('/images/cards-table.jpg');
  background-size: auto;
  background-position: center;

  height: 34%;
  width: 100vw;
`;

const HeroHeader = styled.h1`
  color: #fff;
  font-family:  ${props => props.theme.fonts.quicksand};
`;

const HeroSubHeader = styled.h3`
  color: #fff;
  font-family:  ${props => props.theme.fonts.quicksand};
`;

const ActionButton = styled.button`
  cursor: pointer;
  background: ${props => props.theme.colors.orange};
  color: #fff;
  border: none;
  padding: 1rem;
`;

const SubContentWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 66%;
`;

const NewsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 50%;
  height: 100%;
  padding: 3rem;
  justify-content: center;
`;

const EventsList = styled.ul`
  list-style: none;
`;

const EventItem = styled.li`
`;

const EventImage = styled.div`
  border: 1px solid black;
  background-image: ${props => `url('${props.imageURL}')`};
  background-size: auto;
  background-position: center;
  
`;

export default Index;
