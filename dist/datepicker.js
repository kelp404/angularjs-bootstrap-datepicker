(function() {
  angular.module('bootstrap.datepicker', []).directive('bootstrapDatepicker', [
    '$injector', function($injector) {
      var $filter;
      $filter = $injector.get('$filter');
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
          var $datePicker, disabledBlur, getDatetime, hideDatePicker, insertContent, onBlur, onFocus, onKeydown, onKeyupAndChnage, options, ref, showDatePicker, validateDatetime, visibleDate;
          disabledBlur = false;
          $datePicker = null;
          visibleDate = null;
          options = (ref = scope.$eval(attr.bootstrapDatepicker)) != null ? ref : {};
          if (options.format == null) {
            options.format = 'M/d/yyyy';
          }
          if (options.days == null) {
            options.days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          }
          if (options.months == null) {
            options.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          }
          getDatetime = function() {

            /*
            Get datetime of ng-model.
            @return: {Date}
             */
            var datetime;
            datetime = controller.$viewValue;
            if (!datetime) {
              datetime = null;
            } else if (datetime.constructor === Date) {

            } else if (typeof datetime === 'string') {
              datetime = new Date(datetime);
              if (datetime.toString() === 'Invalid Date') {
                datetime = new Date();
              }
            } else {
              datetime = new Date();
            }
            return datetime;
          };
          validateDatetime = function(value) {
            var i, index, item, len, match, params, pattern, regex, result;
            if (value == null) {
              value = '';
            }

            /*
            Validate datetime string entered by user.
            @param value: {string} The user input value.
            @return: {object} {year: {number}, month: {number}, date: {number}}
             */
            pattern = options.format.replace(/[dM]+/g, '(\\d+)');
            pattern = pattern.replace(/[y]+/g, '(\\d+)');
            regex = new RegExp("^" + pattern + "$");
            match = value.match(regex);
            if (match) {
              params = [
                {
                  name: 'year',
                  index: options.format.indexOf('y')
                }, {
                  name: 'month',
                  index: options.format.indexOf('M')
                }, {
                  name: 'date',
                  index: options.format.indexOf('d')
                }
              ];
              params.sort(function(a, b) {
                return a.index - b.index;
              });
              result = {};
              for (index = i = 0, len = params.length; i < len; index = ++i) {
                item = params[index];
                result[item.name] = Number(match[index + 1]);
              }
              if (result.month > 12 || result.date > 31) {
                return null;
              }
              return result;
            } else {
              return null;
            }
          };
          insertContent = function(viewDate, selectedDate, $body) {
            var contents, dataValue, date, day, elements, i, index, indexDate, isNext, j, k, previous, previousCount, previousDate, ref1, week;
            if (selectedDate == null) {
              selectedDate = new Date();
            }

            /*
            Render date picker calendar.
            @params viewDate: {Date}
            @params selectedDate: {Date}
            @params $body: {jQuery} The calendar DOM.
             */
            indexDate = new Date(viewDate);
            indexDate.setDate(1);
            elements = new Array(6);
            for (index = i = 0; i <= 6; index = ++i) {
              elements[index] = new Array(7);
            }
            previousCount = indexDate.getDay() - 1;
            previous = new Date(indexDate);
            previous.setDate(0);
            previousDate = previous.getDate();
            for (index = j = ref1 = previousCount; j >= 0; index = j += -1) {
              dataValue = (previous.getFullYear()) + "-" + (previous.getMonth() + 1) + "-" + previousDate;
              elements[0][index] = "<td data-value='" + dataValue + "' class='text-muted'>" + (previousDate--) + "</td>";
            }
            week = 0;
            isNext = false;
            while (week < 6) {
              date = indexDate.getDate();
              day = indexDate.getDay();
              dataValue = (indexDate.getFullYear()) + "-" + (indexDate.getMonth() + 1) + "-" + date;
              if (isNext) {
                elements[week][day] = "<td data-value='" + dataValue + "' class='text-muted'>" + date + "</td>";
              } else if (date === selectedDate.getDate() && indexDate.getMonth() === selectedDate.getMonth()) {
                elements[week][day] = "<td data-value='" + dataValue + "' class='selected'><strong>" + date + "</strong></td>";
              } else {
                elements[week][day] = "<td data-value='" + dataValue + "'>" + date + "</td>";
              }
              indexDate.setDate(date + 1);
              if (indexDate.getDate() === 1) {
                isNext = true;
              }
              if (day === 6) {
                week++;
              }
            }
            contents = new Array(6);
            for (week = k = 0; k <= 5; week = ++k) {
              contents[week] = "<tr class='pa-week'>" + (elements[week].join('')) + "</tr>";
            }
            $body.find('.pa-week').remove();
            return $body.append($(contents.join('')));
          };
          showDatePicker = function() {

            /*
            Show date picker.
             */
            var $tbody, dayTemplates, elementOffset, i, index, ref1, template;
            if ($datePicker) {
              return;
            }
            template = "<div class='bootstrap-datepicker fade panel panel-default'>\n<table class='table table-condensed'>\n  <thead>\n  <tr>\n    <th class=\"prev\"><i class=\"fa fa-angle-double-left\"></i></th>\n    <th class='title disabled' colspan=\"5\"></th>\n    <th class='next'><i class=\"fa fa-angle-double-right\"></i></th>\n  </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>\n</div>";
            $datePicker = $(template);
            $tbody = $datePicker.find('tbody');
            dayTemplates = [];
            for (index = i = 0; i <= 6; index = ++i) {
              dayTemplates[index] = "<td>" + options.days[index] + "</td>";
            }
            $tbody.append($("<tr class='pa-days disabled'>" + (dayTemplates.join('')) + "</tr>"));
            visibleDate = (ref1 = getDatetime()) != null ? ref1 : new Date();
            $datePicker.find('.title').text(options.months[visibleDate.getMonth()] + " " + (visibleDate.getFullYear()));
            insertContent(visibleDate, visibleDate, $tbody);
            $datePicker.insertAfter(element);
            elementOffset = element.offset();
            if (element[0].getBoundingClientRect().top > $(window).height() / 2) {
              $datePicker.offset({
                top: elementOffset.top - $datePicker.height() - 10,
                left: elementOffset.left
              });
            } else {
              $datePicker.offset({
                top: elementOffset.top + element.height() + 20,
                left: elementOffset.left
              });
            }
            $datePicker.on('mousedown', function() {
              return disabledBlur = true;
            });
            $datePicker.on('mouseup', function() {
              return element.focus();
            });
            $datePicker.on('click', 'th.prev', function() {
              visibleDate.setMonth(visibleDate.getMonth() - 1);
              $datePicker.find('.title').text(options.months[visibleDate.getMonth()] + " " + (visibleDate.getFullYear()));
              return insertContent(visibleDate, getDatetime(), $tbody);
            });
            $datePicker.on('click', 'th.next', function() {
              visibleDate.setMonth(visibleDate.getMonth() + 1);
              $datePicker.find('.title').text(options.months[visibleDate.getMonth()] + " " + (visibleDate.getFullYear()));
              return insertContent(visibleDate, getDatetime(), $tbody);
            });
            $datePicker.on('click', 'td', function() {
              var datetime, match, ref2;
              match = $(this).attr('data-value').match(/^(\d+)-(\d+)-(\d+)$/);
              hideDatePicker();
              datetime = (ref2 = getDatetime()) != null ? ref2 : new Date();
              datetime.setFullYear(match[1]);
              datetime.setMonth(match[2] - 1);
              datetime.setDate(match[3]);
              controller.$setViewValue(datetime);
              return controller.$render();
            });
            return setTimeout(function() {
              return $datePicker.addClass('in');
            });
          };
          hideDatePicker = function() {

            /*
            Hide date picker.
             */
            if (!$datePicker) {
              return;
            }
            $datePicker.removeClass('in');
            return setTimeout(function() {
              $datePicker.remove();
              return $datePicker = null;
            }, 250);
          };
          controller.$render = function() {
            return element.val($filter('date')(getDatetime(), options.format));
          };
          onFocus = function() {
            return showDatePicker();
          };
          onBlur = function() {
            if (disabledBlur) {
              disabledBlur = false;
              return;
            }
            return hideDatePicker();
          };
          onKeydown = function(e) {
            if (e.keyCode === 27) {
              return hideDatePicker();
            }
          };
          onKeyupAndChnage = function(e) {
            var datetime, match, ref1;
            e.preventDefault();
            match = validateDatetime($(this).val());
            if (match) {
              element.closest('.form-group').removeClass('has-error');
              datetime = (ref1 = getDatetime()) != null ? ref1 : new Date();
              datetime.setFullYear(match.year);
              datetime.setMonth(match.month - 1);
              datetime.setDate(match.date);
              controller.$setViewValue(datetime);
              if ($datePicker) {
                return insertContent(visibleDate, datetime, $datePicker.find('tbody'));
              }
            } else {
              if (e.type === 'change') {
                controller.$setViewValue('');
                controller.$render();
                return element.closest('.form-group').removeClass('has-error');
              } else if ($(this).val()) {
                return element.closest('.form-group').addClass('has-error');
              }
            }
          };
          element.on('focus click', onFocus);
          element.on('blur', onBlur);
          element.on('keydown', onKeydown);
          element.on('keyup change', onKeyupAndChnage);
          return scope.$on('$destroy', function() {
            element.off('focus click', onFocus);
            element.off('blur', onBlur);
            element.off('keydown', onKeydown);
            return element.off('keyup change', onKeyupAndChnage);
          });
        }
      };
    }
  ]);

}).call(this);
