import React, { Component } from 'react';
import key from './key';
import {Navbar} from 'react-bootstrap';
import Book from './book';
import {Container, Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {FormGroup, FormControl, Form} from 'react-bootstrap';
import defaultBook from './assets/Open-Book-Remixed.svg';
import noImage from './assets/No_image.svg';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      books: [],
      modalAdd: false,
      defaultImage: defaultBook,
      dateError: false,
      emptyField: false
    }
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.addHandler = this.addHandler.bind(this);
  }

  getBooks = () => {
    return this.state.books;
  }

  onEdit = (title, authors, publishedDate, imageLinks, id) => {
    let books = this.getBooks();
    books = books.map(x=>{
      if (x.volumeInfo.id === id){
        x.volumeInfo.imageLinks = imageLinks;
        x.volumeInfo.title = title;
        x.volumeInfo.publishedDate = publishedDate;
        x.volumeInfo.authors = [authors];
      }
      return x
    });
    this.setState({
      books
    });
  }

  onDelete = (id) => {
    const books = this.getBooks();
    let book = books.filter(x=>{
      return x.volumeInfo.id !== id
    })
    this.setState({
      books: book
    });
  }

  toggleAdd = () => {
    this.setState({
      modalAdd: !this.state.modalAdd
    });
  }

  imageHandler = () => {
    this.setState({
      defaultImage: this.imageLinks.value
    });
}

  addHandler = (event) => {
    event.preventDefault();
    const books = this.getBooks();

    let date = this.publishedDate.value.slice(0,4);
    let currentDate = new Date().getFullYear();
    if (Number(date) > currentDate || this.publishedDate.value === ""){
        return this.setState({dateError: true, emptyField: false, modalAdd: true});
    }
    if (this.title.value.length === 0 || this.authors.value.length === 0){
        return this.setState({emptyField: true, modalAdd: true, dateError: false});
    }
    else {
        let id = Math.random() * 100;
        books.unshift(
          {
          volumeInfo: {
          authors: [this.authors.value],
          id,
          imageLinks: this.imageLinks.value,
          publishedDate: this.publishedDate.value,
          title: this.title.value   
        }
      });
        this.setState({
          books,
          dateError: false,
          emptyField: false,
          modalAdd: false
        });   
    }
  }

  componentWillMount(){
    let query = "alfa";
    let bookNum = 20;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=%27+${query}+%27&maxResults=${bookNum}&fields=items(volumeInfo(authors%2CpublishedDate%2Ctitle%2CimageLinks(thumbnail)))&key=${key}`)
    .then(res=>{
      if (res.status===200)
      return res.json();
      else throw new Error ("Bad response from server");
    })
    .then(data => {
    data.items.map(x=>{
      return x.volumeInfo.id = Math.random() * 100;
    });
    data.items.map(x=>{
      if (x.volumeInfo.imageLinks === undefined){
        return x.volumeInfo.imageLinks = noImage;
      }
      else {
        return x.volumeInfo.imageLinks = x.volumeInfo.imageLinks.thumbnail; 
      }
    });
    this.setState({
        books: data.items
    })
  }).catch(err=>{console.log(err)});
  }
  render() {
    let books = this.state.books.map(book=>{
      return (
            <Col md={3} key={book.volumeInfo.title+book.volumeInfo.id}>
                <Book
                {...book}
                onEdit = {this.onEdit}
                onDelete = {this.onDelete}
                books = {this.state.books}
                />
            </Col>
            )
          })
    return (
      <div className="App">
        <Navbar style={{backgroundColor:"#3b5998", marginBottom: '15px'}}>
        <Navbar.Brand style={{color: 'white'}}>
            The Books Library
        </Navbar.Brand>
        <Button color="primary" onClick={this.toggleAdd}>+ Add new book</Button>
      </Navbar>
        {
            <Container fluid>
              <Row>
                {books}
              </Row>
            </Container>
        }

        <Modal isOpen={this.state.modalAdd} toggle={this.toggleAdd}>
          <ModalHeader toggle={this.toggleAdd}/>
              <Form onSubmit={this.addHandler} inline>
              <ModalBody>
              <p className="lead">
                  Please fill in all fields to add a new book
              </p>
              {
                  this.state.dateError ? <p className="alert alert-danger">Date must be earlier than current date</p> : null
              }
              {
                  this.state.emptyField ? <p className="alert alert-danger">There must be at least 1 character in the field</p> : null
              }
                  <FormGroup>
                        <FormControl className="col-md-10" placeholder="Title" inputRef={inputValue=>this.title = inputValue}/>
                  </FormGroup>
                  <FormGroup>
                      <FormControl className="col-md-10" placeholder="Author" inputRef={inputValue=>this.authors = inputValue}/>
                  </FormGroup>
                  <FormGroup>
                      <FormControl className="col-md-10" type="date" placeholder="Day of publication" inputRef={inputValue=>this.publishedDate = inputValue}/>
                  </FormGroup>
                  <FormGroup>
                      <FormControl className="col-md-10" onChange={this.imageHandler} placeholder="https://image.com" inputRef={inputValue=>this.imageLinks = inputValue} defaultValue={defaultBook}/>
                  </FormGroup>
                  <div className="picture-box">
                      <img className="picture" alt="" src={this.state.defaultImage}/>
                  </div>
              </ModalBody>
              <ModalFooter>
                  <Button color="success" className="button" onClick={this.toggleAdd} type="submit">Submit</Button>
                  <Button color="danger" className="button" onClick={this.toggleAdd}>Cancel</Button>
              </ModalFooter>
              </Form>
          </Modal>
      </div>
    );
  }
}

export default App;
