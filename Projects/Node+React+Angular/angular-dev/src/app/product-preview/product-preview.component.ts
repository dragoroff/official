import { Component, OnInit, Input } from '@angular/core';
import {Book} from './../shared/models/book.model';
@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css']
})
export class ProductPreviewComponent implements OnInit {

  @Input() bookPreview:Book;

  constructor() { }

  ngOnInit() {
  }
 
}
