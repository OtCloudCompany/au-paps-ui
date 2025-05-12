import * as am5 from '@amcharts/amcharts5';
import {
  geoNaturalEarth1,
  MapChart,
  MapPolygonSeries,
} from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import {
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'ds-usage-world-map',
  standalone: true,
  imports: [],
  templateUrl: './usage-world-map.component.html',
  styleUrl: './usage-world-map.component.scss',
})
export class UsageWorldMapComponent implements OnInit, OnDestroy{
  @Input() mapData: any;
  private root!: am5.Root;
  constructor(private zone: NgZone) {}
  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new('chartdiv');

      this.root.setThemes([am5themes_Animated.new(this.root)]);

      const chart = this.root.container.children.push(
        MapChart.new(this.root, {
          projection: geoNaturalEarth1(),
          panX: 'rotateX',
          panY: 'none',
        }),
      );

      const polygonSeries = chart.series.push(
        MapPolygonSeries.new(this.root, {
          geoJSON: am5geodata_worldLow,
          valueField: 'value',
          calculateAggregates: true,
        }),
      );

      // Get max for scaling
      const maxValue = Math.max(...this.mapData.map(([_, value]) => value));

      // Format into amCharts-friendly structure
      const data = this.mapData.map(([id, value]) => ({
        id: id.toUpperCase(),  // amCharts expects ISO Alpha-2 in UPPERCASE
        value,
      }));

      polygonSeries.data.setAll(data);

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}: {value}',
        interactive: true,
      });

      polygonSeries.set('heatRules', [{
        target: polygonSeries.mapPolygons.template,
        dataField: 'value',
        min: am5.color(0xff621f),
        max: am5.color(0x661f00),
        key: 'fill',
      }]);
    });
  }

  ngOnDestroy(): void {
    this.root?.dispose();
  }
}
