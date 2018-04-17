import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { BookService } from './../shared/services/books.service';
import { Book } from './../shared/models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {


  @ViewChild("bookFilterInput") bookFilterRef: ElementRef;

  bookList: Book[];
  constructor(private myBookService: BookService,
    private router: Router) { }

  ngOnInit() {
    this.myBookService.getBooksInfoByQuery().subscribe((x) => {
      this.bookList = x.items;
    });

  }

  searchBooks(str: string) {
    console.log(this.bookFilterRef.nativeElement.value);

    this.myBookService.getBooksInfoByQuery(str).subscribe((x) => {
      this.bookList = x.items;
    });
  }

  showFullDetail(id: string) {
    this.router.navigate([`/bookStore/products/${id}`]);
  }
}
