import { Component, ChangeDetectionStrategy } from '@angular/core';

interface TutorialStep {
  title: string;
  detail: string;
  image: string;
}

interface CompareItem {
  title: string;
  label: string;
  image: string;
  points: string[];
  type: 'enabled' | 'disabled';
}

@Component({
  selector: 'app-tutorial',
  standalone: false,
  templateUrl: './tutorial.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {
  readonly compareItems: CompareItem[] = [
    {
      title: 'WPA Enabled',
      label: 'Installable App Mode',
      image: 'tutorial/7.gif',
      type: 'enabled',
      points: ['Desktop launch icon', 'App-like window', 'Cached resources', 'Faster repeat visits']
    },
    {
      title: 'Browser Only',
      label: 'Standard Web Mode',
      image: 'tutorial/8.gif',
      type: 'disabled',
      points: ['Depends on browser tab', 'No desktop shortcut', 'Network-first loading', 'Less native feeling']
    }
  ];

  readonly tutorialSteps: TutorialStep[] = [
    {
      title: 'Open Browser Menu',
      detail: 'Tap the highlighted browser menu button to find install options.',
      image: 'tutorial/1.jpg'
    },
    {
      title: 'Choose Add',
      detail: 'Select the add-to-home or install action from the browser sheet.',
      image: 'tutorial/2.jpg'
    },
    {
      title: 'Confirm Install',
      detail: 'Review the app name and confirm the desktop installation.',
      image: 'tutorial/3.jpg'
    },
    {
      title: 'Finish Setup',
      detail: 'Let the browser create the app shortcut and window mode.',
      image: 'tutorial/4.jpg'
    },
    {
      title: 'Find the Icon',
      detail: 'The app icon appears on the device desktop or launcher.',
      image: 'tutorial/5.jpg'
    },
    {
      title: 'Launch as App',
      detail: 'Open the shortcut to use the website as a desktop-style app.',
      image: 'tutorial/6.jpg'
    }
  ];
}
