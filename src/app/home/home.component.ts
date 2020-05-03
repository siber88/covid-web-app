import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = true;
  elements = [];
  displayedColumns = ['province', 'active', 'confirmed', 'deaths', 'recovered'];

  // Graph options
  legend = true;
  legendPosition = 'below';
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  timeline = true;

  colorScheme = {
    domain: ['orange', '#E44D25']
  };

  graphData: any;
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private apiService: ApiService) {
    const emptyElement = {
      province: null,
      active: null,
      confirmed: null,
      deaths: null,
      recovered: null
    };
    this.elements = Array(10).fill(emptyElement);
    this.dataSource = new MatTableDataSource(this.elements);

    this.graphData = [
      {
        name: 'Active',
        series: [
          {
            name: moment()
              .subtract(1, 'd')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(2, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(4, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(6, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          }
        ]
      },
      {
        name: 'Confirmed',
        series: [
          {
            name: moment()
              .subtract(1, 'd')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(2, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(4, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          },
          {
            name: moment()
              .subtract(6, 'w')
              .format('YYYY-MM-DD'),
            value: 0
          }
        ]
      }
    ];
  }

  ngOnInit() {
    this.apiService.getCountriesData().subscribe((data: any[]) => {
      this.elements = data.map(item => {
        return item.provinces[0];
      });
      this.dataSource = new MatTableDataSource(this.elements);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
    this.apiService.getTotals().subscribe((data: any) => {
      console.log(data);
      this.graphData = [
        {
          name: 'Active',
          series: [
            {
              name: data[3][0].date,
              value: data[3][0].active
            },
            {
              name: data[2][0].date,
              value: data[2][0].active
            },
            {
              name: data[1][0].date,
              value: data[1][0].active
            },
            {
              name: data[0][0].date,
              value: data[0][0].active
            }
          ]
        },
        {
          name: 'Confirmed',
          series: [
            {
              name: data[3][0].date,
              value: data[3][0].confirmed
            },
            {
              name: data[2][0].date,
              value: data[2][0].confirmed
            },
            {
              name: data[1][0].date,
              value: data[1][0].confirmed
            },
            {
              name: data[0][0].date,
              value: data[0][0].confirmed
            }
          ]
        }
      ];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
