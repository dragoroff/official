import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <div class="text-center">
    <p>&copy; all rights reserved - Anna Karp -{{year}}</p>
  </div>
  `,
  styles: [`
  p{
    text-align:center;
    margin-top:20px;
  }
  `]
})
export class FooterComponent {

  year = new Date().getFullYear();

}
