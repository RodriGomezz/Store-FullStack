import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title',
  standalone: true,
})
export class titlePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return ''; // Handle the case where the input string is empty or null
    }

    // Split the input string by spaces and return the first five words
    const words = value.split(' ').slice(0, 5); // Slice the array to get the first 5 words
    return words.join(' '); // Join the words back together with spaces
  }
}
