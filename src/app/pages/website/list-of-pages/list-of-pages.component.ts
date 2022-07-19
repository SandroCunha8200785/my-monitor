import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {
  Location
} from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NewWebsiteAddPagesComponent } from '../new-website-add-pages/new-website-add-pages.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.component.html',
  styleUrls: ['./list-of-pages.component.scss']
})
export class ListOfPagesComponent implements OnInit {

  @Input('pages') pages: Array<any>;
  @Input("website") website: string;

  @Output('removePages') removePages = new EventEmitter<Array<number>>();

  @Output('reEvaluatePages') reEvaluatePages = new EventEmitter<void>();

  selection: any = {};//url-> selected

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  loading: boolean;
  error: boolean;
  sortedData: Array<any>;
  indicator1: number;
  indicator2: number;
  pageSize: number;

  constructor(
    private cd: ChangeDetectorRef,
    private location: Location,
    private readonly dialog: MatDialog,

  ) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.pages.map((page) => {
      this.selection[page.Uri] = false;
    });
    if (this.pages !== null) {
      this.pageSize = 50;
      this.sortedData = this.pages.slice(0, this.pageSize);
      this.indicator1 = 1;
      this.indicator2 =
        this.pages.length > this.pageSize
          ? this.pageSize
          : this.pages.length;
    } else {
      this.error = true;
    }

    this.loading = false;
    this.cd.detectChanges();
  }

  nextPage(): void {
    this.sortedData = this.pages.slice(
      this.indicator2,
      this.indicator2 + this.pageSize
    );
    this.indicator1 = this.indicator1 + this.pageSize;
    this.indicator2 =
      this.indicator2 + this.pageSize > this.pages.length
        ? this.pages.length
        : this.indicator2 + this.pageSize;
  }

  previousPage(): void {
    this.sortedData = this.pages.slice(
      this.indicator1 - this.pageSize - 1 < 0
        ? 0
        : this.indicator1 - this.pageSize - 1,
      this.indicator1 - 1
    );
    this.indicator2 = this.indicator1 - 1;
    this.indicator1 =
      this.indicator1 - this.pageSize < 1 ? 1 : this.indicator1 - this.pageSize;
  }

  firstPage(): void {
    this.sortedData = this.pages.slice(0, this.pageSize);
    this.indicator1 = 1;
    this.indicator2 =
      this.pages.length > this.pageSize
        ? this.pageSize
        : this.pages.length;
  }

  lastPage(): void {
    this.indicator2 = this.pages.length;
    this.indicator1 =
      this.indicator2 % this.pageSize === 0
        ? this.indicator2 - this.pageSize + 1
        : this.indicator2 - (this.indicator2 % this.pageSize) + 1;
    this.sortedData = this.pages.slice(this.indicator1 - 1, this.indicator2);
  }

  changeItemsPerPage(e): void {
    this.pageSize = parseInt(e.target.value);
    if (this.indicator1 + this.pageSize > this.pages.length) {
      this.lastPage();
    } else {
      this.indicator2 = this.indicator1 + this.pageSize - 1;
      this.sortedData = this.pages.slice(
        this.indicator1 - 1,
        this.indicator2
      );
    }
  }

  sortData(sort: Sort): void {
    if (sort.active === "score") {
      if (sort.direction === "asc") {
        this.pages = this.pages.sort((a, b) => a.Score - b.Score).slice();
      } else {
        this.pages = this.pages.sort((a, b) => b.Score - a.Score).slice();
      }
    } else if (sort.active === "uri") {
      if (sort.direction === "asc") {
        this.pages = this.pages
          .sort((a, b) => {
            if (a.Uri.toLowerCase() < b.Uri.toLowerCase()) {
              return -1;
            } else if (a.Uri.toLowerCase() > b.Uri.toLowerCase()) {
              return 1;
            }
            return 0;
          })
          .slice();
      } else {
        this.pages = this.pages
          .sort((a, b) => {
            if (a.Uri.toLowerCase() < b.Uri.toLowerCase()) {
              return 1;
            } else if (a.Uri.toLowerCase() > b.Uri.toLowerCase()) {
              return -1;
            }
            return 0;
          })
          .slice();
      }
    } else if (sort.active === "date") {
      if (sort.direction === "asc") {
        this.pages = this.pages.sort((a, b) => a.Creation_Date - b.Creation_Date).slice();
      } else {
        this.pages = this.pages.sort((a, b) => b.Creation_Date - a.Creation_Date).slice();
      }
    } else if (sort.active === "A") {
      if (sort.direction === "asc") {
        this.pages = this.pages.sort((a, b) => a.A - b.A).slice();
      } else {
        this.pages = this.pages.sort((a, b) => b.A - a.A).slice();
      }
    } else if (sort.active === "AA") {
      if (sort.direction === "asc") {
        this.pages = this.pages.sort((a, b) => a.AA - b.AA).slice();
      } else {
        this.pages = this.pages.sort((a, b) => b.AA - a.AA).slice();
      }
    } else if (sort.active === "AAA") {
      if (sort.direction === "asc") {
        this.pages = this.pages.sort((a, b) => a.AAA - b.AAA).slice();
      } else {
        this.pages = this.pages.sort((a, b) => b.AAA - a.AAA).slice();
      }
    }

    if (this.indicator1 + this.pageSize > this.pages.length) {
      this.lastPage();
    } else {
      this.indicator2 = this.indicator1 + this.pageSize - 1;
      this.sortedData = this.pages.slice(
        this.indicator1 - 1,
        this.indicator2
      );
    }
  }

  deletePages(): void {
    const pagesId = this.getSelectedPagesId();
    this.removePages.next(pagesId);
  }
  getSelectedPagesId(){
    const pagesId = [];
    for (const page of this.pages) {
      if (this.selection[page.Uri])
        pagesId.push(page.PageId)
    }
    return pagesId;
  }

  reEvaluate(): void {
    this.reEvaluatePages.next();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    // this.dataSource.filter = filterValue;
  }

  getUriRoute(uri: string): Array<string> {
    const path = this.location.path();
    let segments = path.split('/');
    segments[0] = '/user';
    segments.splice(1, 1);
    segments.push(uri);
    segments = segments.map(s => decodeURIComponent(s));

    return segments;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const values = Object.values(this.selection);
    return values.reduce((prev, curr) => { return prev && curr }, true);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.changeAll(false) :
      this.changeAll(true);
  }

  changeAll(value: boolean) {
    const keys = Object.keys(this.selection);
    for (const key of keys) {
      this.selection[key] = value
    }
  }

  onChkChange(ob: MatCheckboxChange, page: any) {
    this.selection[page.Uri] = ob.checked;
  }

  openAddPages(){
    console.log("open dialog")
    this.dialog.open(NewWebsiteAddPagesComponent, {
      data: {},
      width: "60vw",
    });

  }
}
