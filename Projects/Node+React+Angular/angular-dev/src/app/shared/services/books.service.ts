import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BookRootObject, Book } from './../models/book.model';
import { of } from 'rxjs/observable/of';

@Injectable()
export class BookService {

    constructor(private httpClient: HttpClient) { }


    getBooksInfoByQuery(query: string = "a"): Observable<BookRootObject> {
        return this.httpClient
            .get<BookRootObject>(`/api/book/name/${query}`);
    }


    getBookInfo(id: string): Observable<Book> {
        return this.httpClient
            .get<Book>(`/api/book/id/${id}`);
    }
}