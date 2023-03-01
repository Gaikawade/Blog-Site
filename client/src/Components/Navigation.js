import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

function NavScrollExample() {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Add Post</Nav.Link>
            <Nav.Link href="#action2">My Posts</Nav.Link>
            <Nav.Link href="#action2">Users</Nav.Link>
            <Nav.Link href="#action2">Posts</Nav.Link>
            <Nav.Link href="#action2">Admins</Nav.Link>
            
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          &nbsp; &nbsp;
          <Dropdown drop='start'>
            <Dropdown.Toggle>
              More
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href='#'>Admin Login</Dropdown.Item>
              <Dropdown.Item href='#'>Admin Register</Dropdown.Item>
              <Dropdown.Item href='#'>Logout</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;