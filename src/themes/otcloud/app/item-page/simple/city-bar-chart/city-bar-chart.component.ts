import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
  AxisRendererX,
  AxisRendererY,
  CategoryAxis,
  ColumnSeries,
  ValueAxis,
  XYChart,
} from '@amcharts/amcharts5/xy';
import {
  AfterViewInit,
  Component,
  ElementRef, Input,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ds-city-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './city-bar-chart.component.html',
  styleUrl: './city-bar-chart.component.scss',
})
export class CityBarChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef;
  @Input() barGraphData: any;
  private root!: am5.Root;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new(this.chartDiv.nativeElement);

      this.root.setThemes([am5themes_Animated.new(this.root)]);

      const chart = this.root.container.children.push(
        XYChart.new(this.root, {
          panX: false,
          panY: false,
          layout: this.root.verticalLayout,
        }),
      );

      // Create axes
      const yAxis = chart.yAxes.push(
        CategoryAxis.new(this.root, {
          categoryField: 'cityLabel',
          renderer: AxisRendererY.new(this.root, {
            inversed: true,
            minGridDistance: 20,
          }),
          tooltip: am5.Tooltip.new(this.root, {}),
        }),
      );

      const xAxis = chart.xAxes.push(
        ValueAxis.new(this.root, {
          renderer: AxisRendererX.new(this.root, {}),
        }),
      );

      const data = this.barGraphData;

      yAxis.data.setAll(data);

      // Create series
      const series = chart.series.push(
        ColumnSeries.new(this.root, {
          name: 'Visits',
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: 'value',
          categoryYField: 'cityLabel',
          tooltip: am5.Tooltip.new(this.root, {
            labelText: '{valueX}',
          }),
        }),
      );

      series.columns.template.setAll({
        tooltipText: '{categoryY}: {valueX}',
        cornerRadiusTL: 4,
        cornerRadiusBL: 4,
      });

      series.data.setAll(data);

      // Animate chart and series
      series.appear(1000);
      chart.appear(1000, 100);
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
