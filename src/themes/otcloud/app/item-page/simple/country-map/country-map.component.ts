import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Item } from '../../../../../../app/core/shared/item.model';
import {
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import worldMap from '@highcharts/map-collection/custom/africa.geo.json';
import MapModule from 'highcharts/modules/map';
import ExportingModule from 'highcharts/modules/exporting';
import { HighchartsService } from '../highcharts.service';
import { getIsoCodeFromCountryName } from '../../africanCountries';

@Component({
  selector: 'ds-country-map',
  standalone: true,
  imports: [
    HighchartsChartModule,
    NgIf,
  ],
  templateUrl: './country-map.component.html',
  styleUrl: './country-map.component.scss',
})
export class CountryMapComponent implements OnInit {
  @Input() country: Item;

  Highcharts: typeof Highcharts = Highcharts;
  isBrowser: boolean;
  countryCode = 'et'; // default
  countryName = 'Ethopia'; // default
  mapChartOptions: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private cd: ChangeDetectorRef,
              private highchartsService: HighchartsService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Initialize the modules
    MapModule(Highcharts);
    ExportingModule(Highcharts);
    // Add map data to Highcharts
    Highcharts.maps['custom/africa'] = worldMap;
  }

  ngOnInit() {
    this.Highcharts = this.highchartsService.getHighcharts();
    this.countryName = this.country.firstMetadataValue(['dc.title']);
    this.countryCode = getIsoCodeFromCountryName(this.countryName);
    this.mapChartOptions = {
      chart: { map: worldMap },
      title: { text: 'Map of Africa' },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom',
        },
      },
      colorAxis: { min: 10 },
      series: [
        {
          type: 'map',
          name: 'Views',
          mapData: worldMap,
          data: [[this.countryCode, 800]],
          dataLabels: {
            enabled: false,
            format: '{point.name}',
          },
          tooltip: {
            pointFormat: '{point.name}: {point.value}',
          },
        },
      ],
    };
    this.cd.detectChanges();
  }
}
