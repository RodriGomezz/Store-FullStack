import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  slides = [
    {
      url: 'https://source.unsplash.com/1600x900/?nature,water',
    },
    {
      url: 'https://source.unsplash.com/1600x1600/?nature,forest',
    },
  ];
}
