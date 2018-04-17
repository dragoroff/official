import { Component, OnInit } from '@angular/core';
import {BookService} from './../shared/services/books.service';
import {Book} from './../shared/models/book.model';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  book:Book;
  constructor(private myBookService:BookService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => 
      this.myBookService.getBookInfo(params.id).subscribe((x)=>{
        this.book=x;
      })
  );
           
  }

  goBack(){
    this.router.navigate([`/bookStore/products`]);
  }

}
