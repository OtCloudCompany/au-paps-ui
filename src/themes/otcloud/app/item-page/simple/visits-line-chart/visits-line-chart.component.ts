import {Component, AfterViewInit, NgZone, OnDestroy, ElementRef, ViewChild, Input} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'ds-visits-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './visits-line-chart.component.html',
  styleUrl: './visits-line-chart.component.scss',
})
export class VisitsLineChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef;
  @Input() xAxisData: any;
  @Input() yAxisData: any;
  private root!: am5.Root;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new(this.chartDiv.nativeElement);

      this.root.setThemes([am5themes_Animated.new(this.root)]);

      const chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, {
          layout: this.root.verticalLayout
        })
      );

      // xAxis (categories - months)
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.root, {
          categoryField: "month",
          renderer: am5xy.AxisRendererX.new(this.root, {
            minGridDistance: 30
          })
        })
      );

      // yAxis (numeric - visits)
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {})
        })
      );

      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: 'Visits',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'visits',
          categoryXField: 'month',
          tooltip: am5.Tooltip.new(this.root, {
            labelText: '{categoryX}: {valueY}',
          }),
        }),
      );

      series.strokes.template.setAll({
        strokeWidth: 3,
      });

      series.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          sprite: am5.Circle.new(this.root, {
            radius: 5,
            fill: series.get('fill'),
          }),
        });
      });

      const abbreviatedXAxis = this.abbreviateMonths(this.xAxisData);
      const chartData = this.mergeAxisData(abbreviatedXAxis, this.yAxisData);

      xAxis.data.setAll(chartData);
      series.data.setAll(chartData);

      chart.appear(1000, 100);
      series.appear(1000);
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  abbreviateMonths(fullDates: string[]): string[] {
    return fullDates.map(dateStr => {
      const [month, year] = dateStr.split(" ");
      const shortMonth = month.slice(0, 3);
      return `${shortMonth} ${year}`;
    });
  }

  mergeAxisData(xAxis: string[], yAxis: number[]) {
    if (xAxis.length !== yAxis.length) {
      throw new Error("xAxis and yAxis must be the same length");
    }

    return xAxis.map((month, index) => ({
      month,
      visits: yAxis[index]
    }));
  }

}
