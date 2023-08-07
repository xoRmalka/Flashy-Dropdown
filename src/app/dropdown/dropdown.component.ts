// Import required modules and decorators
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Define the component with selector, template, and styles
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  // Input properties for the component
  @Input() options: { id: number; title: string }[] = [];
  @Input() sourceType: 'inline' | 'url' = 'inline';
  @Input() url: string = '';
  @Input() search: boolean = false;
  @Input() disabled: boolean = false;

  // Properties for filtered options, selected IDs, search term, and options visibility
  filteredOptions: { id: number; title: string }[] = [];
  selectedIds: number[] = [];
  searchTerm: string = '';
  showOptions: boolean = false;

  constructor(private http: HttpClient) {}

  // Lifecycle hook, executed after the component is initialized
  ngOnInit(): void {
    // If the source type is 'url', fetch options from the URL; otherwise, use inline options
    if (this.sourceType === 'url') {
      this.fetchOptionsFromUrl();
    } else {
      this.filteredOptions = this.options;
    }
  }

  // Method to fetch options from the specified URL using HttpClient
  fetchOptionsFromUrl(): void {
    this.http
      .get<{ id: number; title: string }[]>(this.url)
      .pipe(
        map((response) => {
          return response.map((item) => {
            return { id: item.id, title: item.title.toLowerCase() };
          });
        })
      )
      .subscribe(
        (options) => {
          this.filteredOptions = options;
        },
        (error) => {
          console.error('Error fetching options from the URL:', error);
        }
      );
  }

  // Method to filter options based on the search term
  filterOptions(): void {
    if (this.search && this.sourceType === 'url') {
      // If search is enabled and the source is a URL, fetch options with the search term
      this.fetchOptionsFromUrlWithSearch(this.searchTerm);
    } else {
      // Otherwise, filter the inline options based on the search term
      this.filteredOptions = this.options.filter((option) =>
        option.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Method to fetch options from the URL with a specific search query
  fetchOptionsFromUrlWithSearch(query: string): void {
    this.http
      .get<{ id: number; title: string }[]>(`${this.url}?q=${query}`)
      .pipe(
        map((response) => {
          return response.map((item) => {
            return { id: item.id, title: item.title.toLowerCase() };
          });
        })
      )
      .subscribe(
        (options) => {
          this.filteredOptions = options;
        },
        (error) => {
          console.error('Error fetching options from the URL:', error);
        }
      );
  }

  // Method to handle checkbox changes and update selectedIds accordingly
  onCheckboxChange(option: { id: number; title: string }): void {
    if (this.selectedIds.includes(option.id)) {
      this.selectedIds = this.selectedIds.filter((id) => id !== option.id);
    } else {
      this.selectedIds.push(option.id);
    }
  }

  // Method to toggle the visibility of the dropdown options container
  toggleOptionsContainer(): void {
    this.showOptions = !this.showOptions;
  }

  // Method to check if a particular option with the given ID is selected or not
  isSelected(optionId: number): boolean {
    return this.selectedIds.includes(optionId);
  }
}
