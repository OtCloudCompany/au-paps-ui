import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
import ExportingModule from 'highcharts/modules/exporting';

// Import world map data
import worldMap from '@highcharts/map-collection/custom/world.geo.json';

@Injectable({
  providedIn: 'root',
})
export class HighchartsService {
  Highcharts: any = Highcharts;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize the modules
      MapModule(Highcharts);
      ExportingModule(Highcharts);

      // Add map data to Highcharts
      Highcharts.maps['custom/world'] = worldMap;
    }
  }

  getHighcharts(): any {
    return this.Highcharts;
  }
}
