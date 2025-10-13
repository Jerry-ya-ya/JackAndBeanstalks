import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  standalone: false,
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {
  tutorialImagePaths: string[] = [
    'tutorial/1.jpg',
    'tutorial/2.jpg',
    'tutorial/3.jpg',
    'tutorial/4.jpg',
    'tutorial/5.jpg',
    'tutorial/6.jpg'
  ];
}
