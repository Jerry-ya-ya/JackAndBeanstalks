import { Component, ChangeDetectionStrategy } from '@angular/core';

interface TutorialStep {
  titleKey: string;
  detailKey: string;
  image: string;
}

interface CompareItem {
  titleKey: string;
  labelKey: string;
  image: string;
  pointKeys: string[];
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
      titleKey: 'tutorial.compare.enabled.title',
      labelKey: 'tutorial.compare.enabled.label',
      image: 'tutorial/7.gif',
      type: 'enabled',
      pointKeys: [
        'tutorial.compare.enabled.points.desktopIcon',
        'tutorial.compare.enabled.points.appWindow',
        'tutorial.compare.enabled.points.cachedResources',
        'tutorial.compare.enabled.points.fasterVisits'
      ]
    },
    {
      titleKey: 'tutorial.compare.browser.title',
      labelKey: 'tutorial.compare.browser.label',
      image: 'tutorial/8.gif',
      type: 'disabled',
      pointKeys: [
        'tutorial.compare.browser.points.browserTab',
        'tutorial.compare.browser.points.noShortcut',
        'tutorial.compare.browser.points.networkFirst',
        'tutorial.compare.browser.points.lessNative'
      ]
    }
  ];

  readonly tutorialSteps: TutorialStep[] = [
    {
      titleKey: 'tutorial.steps.openMenu.title',
      detailKey: 'tutorial.steps.openMenu.detail',
      image: 'tutorial/1.jpg'
    },
    {
      titleKey: 'tutorial.steps.chooseAdd.title',
      detailKey: 'tutorial.steps.chooseAdd.detail',
      image: 'tutorial/2.jpg'
    },
    {
      titleKey: 'tutorial.steps.confirmInstall.title',
      detailKey: 'tutorial.steps.confirmInstall.detail',
      image: 'tutorial/3.jpg'
    },
    {
      titleKey: 'tutorial.steps.finishSetup.title',
      detailKey: 'tutorial.steps.finishSetup.detail',
      image: 'tutorial/4.jpg'
    },
    {
      titleKey: 'tutorial.steps.findIcon.title',
      detailKey: 'tutorial.steps.findIcon.detail',
      image: 'tutorial/5.jpg'
    },
    {
      titleKey: 'tutorial.steps.launchApp.title',
      detailKey: 'tutorial.steps.launchApp.detail',
      image: 'tutorial/6.jpg'
    }
  ];
}
