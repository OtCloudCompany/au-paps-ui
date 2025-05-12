import * as am5 from '@amcharts/amcharts5';
import {
  geoNaturalEarth1,
  MapChart,
  MapPolygonSeries,
} from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_region_world_africaLow from '@amcharts/amcharts5-geodata/region/world/africaLow';
import {
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

import { Item } from '../../../../../../app/core/shared/item.model';
import { getIsoCodeFromCountryName } from '../../africanCountries'

@Component({
  selector: 'ds-country-map',
  standalone: true,
  imports: [NgIf],
  templateUrl: './country-map.component.html',
  styleUrl: './country-map.component.scss',
})
export class CountryMapComponent implements OnInit, AfterViewInit {
  @Input() country: Item;

  isBrowser: boolean;
  countryCode = 'et'; // default
  countryName = 'Ethopia'; // default

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private zone: NgZone) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      const root = am5.Root.new('chartdiv');

      root.setThemes([am5themes_Animated.new(root)]);
      const chart = root.container.children.push(
        MapChart.new(root, {
          projection: geoNaturalEarth1(),
        }),
      );
      // Create polygon series
      const polygonSeries = chart.series.push(
        MapPolygonSeries.new(root, {
          geoJSON: am5geodata_region_world_africaLow,
        }),
      );
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        interactive: true, fill: am5.color(0xc3a466),
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0x677935),
      });
      polygonSeries.events.on('datavalidated', () => {
        const countryDataItem = polygonSeries.getDataItemById(this.countryCode);
        if (countryDataItem) {
          const countryPolygon = countryDataItem.get('mapPolygon');
          if (countryPolygon) {
            countryPolygon.set('fill', am5.color(0x0e591a));
            countryPolygon.set('stroke', am5.color(0x000000));
          }
        }
      });
    });
  }
  ngOnInit() {
    this.countryName = this.country.firstMetadataValue(['dc.title']);
    this.countryCode = getIsoCodeFromCountryName(this.countryName).toUpperCase();
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {f();});
    }
  }
}
