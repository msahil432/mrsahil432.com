import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import {Globals} from '../../globals';

import { AdsenseModule } from 'ng2-adsense';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [Globals]
})
export class DashboardComponent implements OnInit {

  constructor(public globals: Globals) { }

  showNotification(){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
        icon: "notifications",
        message: "This site collects data about its visitors using <b>Google Analytics</b>."
    },{
        type: type[color],
        timer: 2000,
        placement: {
            from: "bottom",
            align: "center"
        }
    });
}

  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
        //Show Notification
        if(!this.globals.notified){
            this.showNotification();
            this.globals.notified=true;
        }

      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]};

        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart: any = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                [230, 750, 450, 300, 280, 240, 200, 190]
            ]
        };

        const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        var datawebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

            ]
        };
        var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
        };
        var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
                labelInterpolationFnc: function (value) {
                return value[0];
                }
            }
            }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(websiteViewsChart);

        var t: Array<{ tech:string, used: number }> = [];

        this.globals.myPro.forEach(function (el) {
            el.tech.forEach(function (techs) { 
                var found: boolean = false;
                var index = 0;
                t.forEach(function (s) {
                    if (s.tech == techs) {
                        found = true;
                        t.splice(index, 1);
                        t.push({ tech: techs, used: s.used + 1 });
                    }
                    index++;
                })
                if (!found) t.push({ tech: techs, used: 1 });
            })
        });

        //Display 4 technologies from projects
        var n=4;
        var result = new Array(n),
        len = t.length,
        taken = new Array(len);
        
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = t[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }

        this.techs = result;
    }
    public techs;
}