import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Book } from './../_models/book'
import { productActions } from '../_actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newBook: new Book(),
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const { name, value } = event.target;
        const { newBook } = this.state;
        this.setState({
            newBook: {
                ...newBook,
                [name]: value
            }
        });
    }
    handleSubmit(event) {
        this.setState({ submitted: true });
        const { newBook } = this.state;
        const { dispatch } = this.props;
        if (newBook) {

            let { title, subtitle, authors, publisher, publishedDate, description, pageCount, smallThumbnail, language, amount } = { ...newBook };
            let formatBook = {
                volumeInfo: {
                    title,
                    subtitle,
                    authors: [authors],
                    publisher,
                    publishedDate,
                    description,
                    pageCount,
                    imageLinks: {
                        smallThumbnail,
                        thumbnail: ""
                    },
                    language
                },
                saleInfo: {
                    listPrice: {
                        amount,
                        currencyCode: ""
                    }
                }
            };

            dispatch(productActions.add(formatBook, this.props.user.token));
        }
    }

    render() {
        const { user } = this.props;
        const { submitted, newBook } = this.state;
        if (user) {
            return (
                <div className="col-md-10 col-md-offset-1">
                    <div className="col-md-10 col-md-offset-1">
                        <h2>Add product</h2>

                        {
                            Object.keys(newBook).map((element, index) => (
                                <div className='form-group'>
                                    <label>{element}:</label>
                                    <input type="text" className="form-control"
                                        key={index}
                                        name={element}
                                        value={newBook[element]}
                                        onChange={this.handleChange} />
                                </div>
                            ))
                        }

                        <div className="form-group">
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Register</button>
                            {submitted &&
                                <img alt="please wait" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                            <Link to="/managmentSystem" className="btn btn-link">Cancel</Link>
                        </div>
                    </div>

                </div>
            );
        }


        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi Guest!</h1>
                <p> Please log in with React!!</p>
                <p>
                    <Link to="/managmentSystem/login" className="btn btn-link">Cancel</Link>

                    <Link to="/managmentSystem/register" className="btn btn-link">Register</Link>
                </p>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedAddProductPage = connect(mapStateToProps)(HomePage);
export { connectedAddProductPage as AddProductPage };