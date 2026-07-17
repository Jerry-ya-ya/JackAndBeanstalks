import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

interface WorklogEntry {
  date: string;
  items: string[];
}

interface WorklogSection {
  title: string;
  entries: WorklogEntry[];
}

@Component({
  selector: 'app-update',
  standalone: false,
  templateUrl: './update.component.html',
  styleUrl: './update.component.css',
})
export class UpdateComponent implements OnInit {
  sections: WorklogSection[] = [];
  displaySections: WorklogSection[] = [];
  latestEntry: WorklogEntry | null = null;
  loading = true;
  error = '';

  private readonly worklogUrl = '/assets/doc/worklog.md';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadWorklog();
  }

  private async loadWorklog() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${this.worklogUrl}?v=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Worklog request failed with ${response.status}`);
      }

      const markdown = await response.text();
      this.sections = this.parseWorklog(markdown);
      this.displaySections = this.reverseWorklog(this.sections);
      this.latestEntry = this.findLatestEntry(this.sections);

      if (!this.latestEntry) {
        this.error = 'Update log is empty or cannot be parsed.';
      }
    } catch (error) {
      console.error('Failed to load update log:', error);
      this.error = 'Update log is unavailable right now.';
    } finally {
      window.clearTimeout(timeoutId);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private parseWorklog(markdown: string): WorklogSection[] {
    const sections: WorklogSection[] = [];
    let currentSection: WorklogSection | null = null;
    let currentEntry: WorklogEntry | null = null;
    let pendingItemIndex: number | null = null;

    for (const rawLine of markdown.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) {
        pendingItemIndex = null;
        continue;
      }

      const htmlTitle = line.match(/^<h1[^>]*>\s*(.*?)\s*<\/h1>$/i);
      if (htmlTitle) {
        currentSection = { title: this.cleanMarkdownText(htmlTitle[1]), entries: [] };
        sections.push(currentSection);
        currentEntry = null;
        pendingItemIndex = null;
        continue;
      }

      const heading = line.match(/^(#{1,6})\s*(.*?)\s*#*$/);
      if (heading) {
        const level = heading[1].length;
        const title = this.cleanMarkdownText(heading[2]);

        if (level === 1) {
          currentSection = { title, entries: [] };
          sections.push(currentSection);
          currentEntry = null;
        } else {
          currentSection ??= this.createDefaultSection(sections);
          currentEntry = { date: title, items: [] };
          currentSection.entries.push(currentEntry);
        }

        pendingItemIndex = null;
        continue;
      }

      const listItem = line.match(/^-\s+(.*)$/);
      if (listItem) {
        currentSection ??= this.createDefaultSection(sections);
        currentEntry ??= this.createUndatedEntry(currentSection);
        currentEntry.items.push(this.cleanMarkdownText(listItem[1]));
        pendingItemIndex = currentEntry.items.length - 1;
        continue;
      }

      if (currentEntry && pendingItemIndex !== null) {
        currentEntry.items[pendingItemIndex] += ` ${this.cleanMarkdownText(line)}`;
      }
    }

    return sections
      .map(section => ({
        ...section,
        entries: section.entries.filter(entry => entry.items.length > 0)
      }))
      .filter(section => section.entries.length > 0);
  }

  private findLatestEntry(sections: WorklogSection[]): WorklogEntry | null {
    for (let sectionIndex = sections.length - 1; sectionIndex >= 0; sectionIndex--) {
      const entries = sections[sectionIndex].entries;
      if (entries.length > 0) {
        return entries[entries.length - 1];
      }
    }

    return null;
  }

  private reverseWorklog(sections: WorklogSection[]): WorklogSection[] {
    return sections
      .map(section => ({
        ...section,
        entries: [...section.entries].reverse()
      }))
      .reverse();
  }

  private createDefaultSection(sections: WorklogSection[]): WorklogSection {
    const section = { title: 'Updates', entries: [] };
    sections.push(section);
    return section;
  }

  private createUndatedEntry(section: WorklogSection): WorklogEntry {
    const entry = { date: 'Latest', items: [] };
    section.entries.push(entry);
    return entry;
  }

  private cleanMarkdownText(value: string): string {
    return value
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  }
}
