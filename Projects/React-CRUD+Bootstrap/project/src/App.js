import React, { Component } from 'react';
import './App.css';
import data from './data';
import Person from './Person';
import AddPerson from './AddPerson';
import {Navbar, Grid, Row, Col, Form, FormControl} from 'react-bootstrap';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      persons: data,
      filteredPersons: '',
      dropdownOpen: false
    }
    this.onDelete = this.onDelete.bind(this);
    this.addUser = this.addUser.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.filterHandler = this.filterHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.sorting = this.sorting.bind(this);
    this.reverseSorting = this.reverseSorting.bind(this);
  }

  sorting = () => {
    const persons = this.getPeople();
    const filt = this.getFilteredPeople();
    let sortPersons;
    if (filt){
      sortPersons = filt.sort((a,b)=>{
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
      if (a > b)
        return 1;
      if (b > a)
        return -1;
      else return 0;
    });
    }
    else {
      sortPersons = persons.sort((a,b)=>{
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a > b)
          return 1;
        if (b > a)
          return -1;
          else return 0;
      });
    }
    this.setState({
      persons: sortPersons
    });
  }
  reverseSorting = () => {
    const persons = this.getPeople();
    const filt = this.getFilteredPeople();
    let revSortPersons;
    if (filt){
      revSortPersons = filt.sort((a,b)=>{
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
      if (a > b)
        return -1;
      if (b > a)
        return 1;
        else return 0;
    });
    }
    else {
      revSortPersons = persons.sort((a,b)=>{
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a > b)
          return -1;
        if (b > a)
          return 1;
          else return 0;
      });
    }
    this.setState({
      persons: revSortPersons
    });
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  getPeople = () => {
    return this.state.persons;
  }
  getFilteredPeople = () => {
    return this.state.filteredPersons;
  }

  onDelete = (id) => {
    const persons = this.getPeople();
    let filt = this.getFilteredPeople();
    let person = persons.filter(x=>{
      return x.id !== id
    });
    if (filt){
      filt = filt.filter(x=>{
        return x.id !== id
      });
    }
    this.setState({
      persons: person,
      filteredPersons: filt
    })
  }

  addUser = (name, address, phone, picture, id) => {
    const persons = this.getPeople();
    const filtered = this.getFilteredPeople();
    persons.unshift({
      picture, name, phone, address, id
    });
    if (filtered){
      filtered.unshift({
        picture, name, phone, address, id
      });
    }
    this.setState({
      persons,
      filteredPersons: filtered
    });
  }
  
  onEdit = (name, address, phone, picture, id) => {
    let persons = this.getPeople();
    let filtered = this.getFilteredPeople();
    persons = persons.map(x=>{
      if (x.id === id){
        x.picture = picture;
        x.name = name;
        x.phone = phone;
        x.address = address;
      }
      return x
    });
    if (filtered){
      filtered = filtered.map(z=>{
        if (z.id === id){
          z.picture = picture;
          z.name = name;
          z.phone = phone;
          z.address = address;
        }
        return z
      })
    }
    this.setState({
      persons,
      filteredPersons: filtered
    });
    this.filterHandler();
  }
  filterHandler = () => {
    let people = this.getPeople();;
    people = people.filter(x=>{
      return x.name.toLowerCase().indexOf(this.filterInput.value.toLowerCase()) !== -1;
    });
    this.setState({
      filteredPersons: people
    })
  }

  render() {
    console.log('State', this.state);
    return (
      <div className="App">
      <Navbar style={{backgroundColor:"#3b5998", marginBottom: '15px'}}>
        <Navbar.Brand>
          <Navbar.Header style={{color: 'white'}}>
           Facebook
          </Navbar.Header>
        </Navbar.Brand>
      </Navbar>
      <AddPerson
      onSubmit={this.addUser}
      />
       <Grid className="grid">
              <Row style={{marginTop: "10px"}}>
              <Col xs={3} md={2}>
                  <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                      <span className="lead">Name</span>
                      </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>
                        <a onClick={this.sorting}>A-Z</a>
                        </DropdownItem>
                        <DropdownItem>
                        <a onClick={this.reverseSorting}>Z-A</a>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
              </Col>
              <Col xs={3} md={2}>
                  <p className="lead">Address</p>
              </Col>
              <Col xs={3} md={3}>
                  <p className="lead">Phone</p>
              </Col>
              <Col xs={3} md={2}>
                  <p className="lead">Picture</p>
              </Col>
              </Row>
          </Grid>
          <Grid>
            <Row>
              <Col xs={4} md={2}/>
                <Col xs={6} md={4}>
                    <Form onSelect={this.filterHandler}>
                        <FormControl placeholder="Find a person..." inputRef={input => this.filterInput = input}/>
                    </Form>
                </Col>
                </Row>
            </Grid>
        {this.state.filteredPersons ? (
          this.state.filteredPersons.map(person=>{
            return (
              <Person
              key={person.name+person.address+person.phone+person.picture+person.id}
              {...person}
              onDelete={this.onDelete}
              onEdit={this.onEdit}
              />
            )
          })
        ) : (
          this.state.persons.map(person=>{
            return (
              <Person 
                key={person.name+person.address+person.phone+person.picture+person.id}
                {...person}
                onDelete={this.onDelete}
                onEdit={this.onEdit}
              />            
              )
          }) 
        )
        }
      </div>
    );
  }
}

export default App;