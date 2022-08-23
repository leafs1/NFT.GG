import '../styles/globals.css';
import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar className='bg-dark' expand="lg" >
        <Container >
          <Navbar.Brand href="/" >NFT.gg</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" >
              <Link className='navLink' href="/" passHref>
                <Nav.Link className='navButton'>Packs</Nav.Link>
              </Link>
              <Link href="/marketplace" passHref>
                <Nav.Link className='navButton'>Marketplace</Nav.Link>
              </Link>
              <Link href="/create-item" passHref>
                <Nav.Link className='navButton'>Sell Digital Asset</Nav.Link>
              </Link>
              <Link href="/my-assets" passHref>
                <Nav.Link className='navButton'>My Digital Assets</Nav.Link>
              </Link>
              <Link href="/creator-dashboard" passHref>

                <Nav.Link className='navButton'>Creator Dashboard</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Component {...pageProps} />

    </div>
  );
}

export default MyApp;
